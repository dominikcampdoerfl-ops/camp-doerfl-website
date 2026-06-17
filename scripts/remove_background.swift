import AppKit
import CoreImage
import CoreImage.CIFilterBuiltins
import Foundation
import Vision

enum RemoveBackgroundError: Error {
  case invalidArguments
  case loadFailed
  case cgImageMissing
  case maskMissing
  case outputFailed
}

let args = CommandLine.arguments

guard args.count == 3 else {
  fputs("Usage: remove_background.swift <input> <output>\n", stderr)
  throw RemoveBackgroundError.invalidArguments
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

guard let sourceImage = NSImage(contentsOf: inputURL) else {
  throw RemoveBackgroundError.loadFailed
}

var proposedRect = CGRect(origin: .zero, size: sourceImage.size)
guard let cgImage = sourceImage.cgImage(forProposedRect: &proposedRect, context: nil, hints: nil) else {
  throw RemoveBackgroundError.cgImageMissing
}

let inputImage = CIImage(cgImage: cgImage)
let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
try handler.perform([request])

guard let maskBuffer = request.results?.first?.pixelBuffer else {
  throw RemoveBackgroundError.maskMissing
}

let maskImage = CIImage(cvPixelBuffer: maskBuffer)
let scaledMask = maskImage
  .transformed(
    by: CGAffineTransform(
      scaleX: inputImage.extent.width / maskImage.extent.width,
      y: inputImage.extent.height / maskImage.extent.height
    )
  )
  .cropped(to: inputImage.extent)

let transparentBackground = CIImage(color: .clear).cropped(to: inputImage.extent)
let filter = CIFilter.blendWithMask()
filter.inputImage = inputImage
filter.backgroundImage = transparentBackground
filter.maskImage = scaledMask

guard let outputImage = filter.outputImage else {
  throw RemoveBackgroundError.outputFailed
}

let context = CIContext(options: [
  CIContextOption.useSoftwareRenderer: false
])

guard let outputCGImage = context.createCGImage(outputImage, from: outputImage.extent) else {
  throw RemoveBackgroundError.outputFailed
}

let bitmap = NSBitmapImageRep(cgImage: outputCGImage)
guard let pngData = bitmap.representation(using: .png, properties: [:]) else {
  throw RemoveBackgroundError.outputFailed
}

try pngData.write(to: outputURL)
print(outputURL.path)
