import AppKit
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

enum RemoveLightBackgroundError: Error {
  case invalidArguments
  case inputLoadFailed
  case contextCreateFailed
  case outputImageFailed
  case destinationCreateFailed
}

func smoothstep(_ value: Double) -> Double {
  let clamped = min(max(value, 0.0), 1.0)
  return clamped * clamped * (3.0 - 2.0 * clamped)
}

func recoveredChannel(_ channel: Int, alpha: Double) -> UInt8 {
  guard alpha > 0.0 else { return 0 }

  let normalized = Double(channel) / 255.0
  let recovered = (normalized - (1.0 - alpha)) / alpha
  let clamped = min(max(recovered, 0.0), 1.0)
  return UInt8(round(clamped * 255.0))
}

let args = CommandLine.arguments

guard args.count == 3 else {
  fputs("Usage: remove_light_background.swift <input> <output>\n", stderr)
  throw RemoveLightBackgroundError.invalidArguments
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

guard
  let sourceImage = NSImage(contentsOf: inputURL),
  var proposedRect = Optional(CGRect(origin: .zero, size: sourceImage.size)),
  let cgImage = sourceImage.cgImage(forProposedRect: &proposedRect, context: nil, hints: nil)
else {
  throw RemoveLightBackgroundError.inputLoadFailed
}

let width = cgImage.width
let height = cgImage.height
let bytesPerRow = width * 4
let colorSpace = CGColorSpaceCreateDeviceRGB()
let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue
var pixels = [UInt8](repeating: 0, count: height * bytesPerRow)

guard
  let context = CGContext(
    data: &pixels,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: bytesPerRow,
    space: colorSpace,
    bitmapInfo: bitmapInfo
  )
else {
  throw RemoveLightBackgroundError.contextCreateFailed
}

context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))

let transparentThreshold = 8
let opaqueThreshold = 72

for y in 0 ..< height {
  for x in 0 ..< width {
    let offset = y * bytesPerRow + x * 4
    let red = Int(pixels[offset])
    let green = Int(pixels[offset + 1])
    let blue = Int(pixels[offset + 2])
    let alpha = Int(pixels[offset + 3])

    let distance = max(255 - red, 255 - green, 255 - blue)

    let backgroundAlpha: Double
    if distance <= transparentThreshold {
      backgroundAlpha = 0.0
    } else if distance >= opaqueThreshold {
      backgroundAlpha = 1.0
    } else {
      let ratio = Double(distance - transparentThreshold) / Double(opaqueThreshold - transparentThreshold)
      backgroundAlpha = smoothstep(ratio)
    }

    let combinedAlpha = backgroundAlpha * (Double(alpha) / 255.0)
    let outputAlpha = UInt8(round(min(max(combinedAlpha, 0.0), 1.0) * 255.0))
    pixels[offset + 3] = outputAlpha

    guard outputAlpha > 0, outputAlpha < 255 else { continue }

    let recoveredAlpha = Double(outputAlpha) / 255.0
    pixels[offset] = recoveredChannel(red, alpha: recoveredAlpha)
    pixels[offset + 1] = recoveredChannel(green, alpha: recoveredAlpha)
    pixels[offset + 2] = recoveredChannel(blue, alpha: recoveredAlpha)
  }
}

guard let outputCGImage = context.makeImage() else {
  throw RemoveLightBackgroundError.outputImageFailed
}

guard let destination = CGImageDestinationCreateWithURL(
  outputURL as CFURL,
  UTType.png.identifier as CFString,
  1,
  nil
) else {
  throw RemoveLightBackgroundError.destinationCreateFailed
}

CGImageDestinationAddImage(destination, outputCGImage, nil)
CGImageDestinationFinalize(destination)
print(outputURL.path)
