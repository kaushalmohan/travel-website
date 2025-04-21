#!/usr/bin/env python3
"""
Script to convert images from JPG to WebP in multiple sizes.
Requires Pillow: pip install Pillow
"""

import os
import sys
from pathlib import Path
from PIL import Image

# Define size suffixes and dimensions
SIZES = {
    '': 1200,  # Original (max width 1200px)
    '-800w': 800,
    '-400w': 400
}

def convert_image(image_path):
    """Convert image to WebP format in multiple sizes"""
    try:
        # Skip if already WebP
        if image_path.suffix.lower() == '.webp':
            print(f"Skipping already WebP image: {image_path}")
            return False

        # Skip if not jpg/jpeg
        if image_path.suffix.lower() not in ['.jpg', '.jpeg', '.png']:
            print(f"Skipping non-JPG/JPEG/PNG image: {image_path}")
            return False
            
        print(f"Converting {image_path}")
        
        # Open the image
        with Image.open(image_path) as img:
            # Create WebP variants in different sizes
            for suffix, max_width in SIZES.items():
                # Calculate new dimensions while maintaining aspect ratio
                width, height = img.size
                if width > max_width:
                    ratio = max_width / width
                    new_height = int(height * ratio)
                    resized_img = img.resize((max_width, new_height), Image.LANCZOS)
                else:
                    resized_img = img
                
                # Get the stem (filename without extension) and parent directory
                stem = image_path.stem
                parent = image_path.parent
                
                # Create output path with the proper suffix
                output_path = parent / f"{stem}{suffix}.webp"
                
                # Save as WebP with 85% quality
                resized_img.save(
                    output_path, 
                    format="WEBP", 
                    quality=90,
                    method=6  # Higher method means better compression but slower
                )
                
                print(f"  Created: {output_path}")
        
        return True
                
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return False

def process_images():
    """Process all images in the uzbekistan folder"""
    base_dir = Path('/Users/pankhuriandkaushal/CodeExperiments/travel-website/public/images/sikkim')
    
    if not base_dir.exists():
        print(f"Error: Directory {base_dir} does not exist")
        return
    
    # Get all subfolders
    folders = [f for f in base_dir.iterdir() if f.is_dir()]
    
    # Add the hero-image folder
    hero_folder = base_dir / 'hero-image'
    if hero_folder.exists() and hero_folder not in folders:
        folders.append(hero_folder)
    
    total_images = 0
    converted_images = 0
    failed_images = 0
    
    # Process each folder
    for folder in folders:
        print(f"Processing folder: {folder}")
        
        # Get all JPG/JPEG images in the folder
        images = [f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in ['.png', '.jpg', '.jpeg']]
        total_images += len(images)
        
        # Convert each image
        for image_path in images:
            if convert_image(image_path):
                converted_images += 1
            else:
                failed_images += 1
    
    print(f"\nConversion complete!")
    print(f"Total images found: {total_images}")
    print(f"Successfully converted: {converted_images}")
    print(f"Failed to convert: {failed_images}")
    print(f"WebP versions created in the following sizes: Original (max 1200px width), 800px width, 400px width")

if __name__ == "__main__":
    process_images() 