#!/usr/bin/env python3
"""
Image resizing script for the travel website.
Generates resized versions of images for responsive loading.

Requirements:
pip install pillow
"""

import os
from PIL import Image
import argparse
from pathlib import Path

def resize_image(image_path, output_dir, sizes):
    """Resize an image to multiple sizes and save with appropriate suffixes."""
    try:
        img = Image.open(image_path)
        filename = os.path.basename(image_path)
        name, ext = os.path.splitext(filename)
        
        # Convert to WebP if not already
        if ext.lower() != '.webp':
            ext = '.webp'
        
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)
        
        # Save original as WebP if not already
        if os.path.splitext(image_path)[1].lower() != '.webp':
            original_webp_path = os.path.join(output_dir, f"{name}{ext}")
            img.save(original_webp_path, 'WEBP', quality=85)
            print(f"Converted original to WebP: {original_webp_path}")
            
        # Resize and save each size
        for size in sizes:
            # Calculate height to maintain aspect ratio
            width = size
            aspect_ratio = img.height / img.width
            height = int(width * aspect_ratio)
            
            # Resize image
            resized_img = img.resize((width, height), Image.LANCZOS)
            
            # Save as WebP with size suffix
            output_path = os.path.join(output_dir, f"{name}-{width}w{ext}")
            resized_img.save(output_path, 'WEBP', quality=85)
            print(f"Created: {output_path} ({width}x{height})")
            
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

def process_directory(input_dir, output_dir, sizes):
    """Process all images in a directory."""
    if not os.path.exists(input_dir):
        print(f"Input directory does not exist: {input_dir}")
        return
        
    os.makedirs(output_dir, exist_ok=True)
    
    for filename in os.listdir(input_dir):
        file_path = os.path.join(input_dir, filename)
        if os.path.isfile(file_path) and filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            resize_image(file_path, output_dir, sizes)

def main():
    parser = argparse.ArgumentParser(description='Resize images for responsive web loading.')
    parser.add_argument('--input', '-i', required=True, help='Input image or directory')
    parser.add_argument('--output', '-o', help='Output directory (defaults to same as input)')
    parser.add_argument('--sizes', '-s', nargs='+', type=int, default=[400, 800, 1200],
                        help='Output sizes (default: 400, 800, 1200)')
    
    args = parser.parse_args()
    
    input_path = args.input
    output_dir = args.output or os.path.dirname(input_path)
    
    if os.path.isdir(input_path):
        process_directory(input_path, output_dir, args.sizes)
    elif os.path.isfile(input_path):
        resize_image(input_path, output_dir, args.sizes)
    else:
        print(f"Input path does not exist: {input_path}")

if __name__ == "__main__":
    main() 