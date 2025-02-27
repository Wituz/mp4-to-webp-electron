#!/bin/bash

# Convert SVG to PNG for Linux
convert -background none -density 1024 icon.svg -resize 512x512 icon.png

# Convert SVG to ICO for Windows
convert -background none -density 256 icon.svg -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# Convert SVG to ICNS for macOS
# Create temporary iconset directory
mkdir MyIcon.iconset

# Generate different sizes
convert -background none -density 1024 icon.svg -resize 16x16 MyIcon.iconset/icon_16x16.png
convert -background none -density 1024 icon.svg -resize 32x32 MyIcon.iconset/icon_16x16@2x.png
convert -background none -density 1024 icon.svg -resize 32x32 MyIcon.iconset/icon_32x32.png
convert -background none -density 1024 icon.svg -resize 64x64 MyIcon.iconset/icon_32x32@2x.png
convert -background none -density 1024 icon.svg -resize 128x128 MyIcon.iconset/icon_128x128.png
convert -background none -density 1024 icon.svg -resize 256x256 MyIcon.iconset/icon_128x128@2x.png
convert -background none -density 1024 icon.svg -resize 256x256 MyIcon.iconset/icon_256x256.png
convert -background none -density 1024 icon.svg -resize 512x512 MyIcon.iconset/icon_256x256@2x.png
convert -background none -density 1024 icon.svg -resize 512x512 MyIcon.iconset/icon_512x512.png
convert -background none -density 1024 icon.svg -resize 1024x1024 MyIcon.iconset/icon_512x512@2x.png

# Convert iconset to icns
iconutil -c icns MyIcon.iconset

# Clean up
rm -rf MyIcon.iconset