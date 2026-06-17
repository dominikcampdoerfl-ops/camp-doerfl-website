import AppKit
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

enum RemoveChromaKeyError: Error {
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

let args = CommandLine.arguments

guard args.count == 3 else {
  fputs("Usage: remove_chroma_key.swift <input> <output>\n", stderr)
  throw RemoveChromaKeyError.invalidArguments
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

guard
  let sourceImage = NSImage(contentsOf: inputURL),
  var proposedRect = Optional(CGRect(origin: .zero, size: sourceImage.size)),
  let cgImage = sourceImage.cgImage(forProposedRect: &proposedRect, context: nil, hints: nil)
else {
  throw RemoveChromaKeyError.inputLoadFailed
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
  throw RemoveChromaKeyError.contextCreateFailed
}

context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))

let transparentThreshold = 10
let opaqueThreshold = 215

for y in 0 ..< height {
  for x in 0 ..< width {
    let offset = y * bytesPerRow + x * 4
    let red = Int(pixels[offset])
    let green = Int(pixels[offset + 1])
    let blue = Int(pixels[offset + 2])
    let alpha = Int(pixels[offset + 3])

    let distance = max(abs(red - 0), abs(green - 255), abs(blue - 0))
    var outputAlpha: Int

    if distance <= transparentThreshold {
      outputAlpha = 0
    } else if distance >= opaqueThreshold {
      outputAlpha = 255
    } else {
      let ratio = Double(distance - transparentThreshold) / Double(opaqueThreshold - transparentThreshold)
      outputAlpha = Int(round(255.0 * smoothstep(ratio)))
    }

    let maxOther = max(red, blue)
    let dominance = green - maxOther
    if dominance > 0 {
      let denominator = max(1, 255 - maxOther)
      let dominanceAlpha = Int(
        round((1.0 - min(1.0, Double(dominance) / Double(denominator))) * 255.0)
      )
      outputAlpha = min(outputAlpha, dominanceAlpha)
    }

    outputAlpha = Int(round(Double(outputAlpha) * (Double(alpha) / 255.0)))
    if outputAlpha < 8 {
      outputAlpha = 0
    }

    if outputAlpha < 255 && green > maxOther {
      let cappedGreen = max(0, maxOther - 1)
      pixels[offset + 1] = UInt8(cappedGreen)
    }

    pixels[offset + 3] = UInt8(max(0, min(255, outputAlpha)))
  }
}

guard let outputCGImage = context.makeImage() else {
  throw RemoveChromaKeyError.outputImageFailed
}

guard let destination = CGImageDestinationCreateWithURL(
  outputURL as CFURL,
  UTType.png.identifier as CFString,
  1,
  nil
) else {
  throw RemoveChromaKeyError.destinationCreateFailed
}

CGImageDestinationAddImage(destination, outputCGImage, nil)
CGImageDestinationFinalize(destination)
print(outputURL.path)
