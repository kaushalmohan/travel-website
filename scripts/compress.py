from PIL import Image
import os
import shutil

def compress_image(image_path, quality=75):
    # Create a temporary file path
    temp_path = image_path + ".temp"
    
    try:
        # Get original size
        original_size = os.path.getsize(image_path)
        
        with Image.open(image_path) as img:
            # Save compressed version to temporary file
            img.save(temp_path, "JPEG", optimize=True, quality=quality)
            
            # Get compressed size
            compressed_size = os.path.getsize(temp_path)
            
            # Compare sizes
            if compressed_size < original_size:
                # Replace original with compressed version
                shutil.move(temp_path, image_path)
                print(f"✅ Compressed: {image_path} ({original_size/1024:.2f}KB → {compressed_size/1024:.2f}KB)")
            else:
                # Delete temporary file if larger
                os.remove(temp_path)
                print(f"⏩ Skipped: {image_path} (Compressed larger: {compressed_size/1024:.2f}KB vs {original_size/1024:.2f}KB)")
                
    except Exception as e:
        print(f"❌ Error processing {image_path}: {str(e)}")
        if os.path.exists(temp_path):
            os.remove(temp_path)

def compress_images_in_folder(folder_path, quality=75):
    for dirpath, _, filenames in os.walk(folder_path):
        for filename in filenames:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(dirpath, filename)
                compress_image(image_path, quality)

if __name__ == "__main__":
    target_folder = "/Users/pankhuriandkaushal/CodeExperiments/travel-website/public/images/vietnam/"
    compress_images_in_folder(target_folder, quality=75)
