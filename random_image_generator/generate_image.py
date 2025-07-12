import random
import uuid
import os
from PIL import Image, ImageDraw

# Create output directory if not exists
os.makedirs('./output', exist_ok=True)

# Generate a unique run ID
run_id = uuid.uuid1()
print(f'Processing run_id: {run_id}')

# Create a new image
image = Image.new('RGB', (2000, 2000))
width, height = image.size

rectangle_width = 100
rectangle_height = 100

# Random number of squares
number_of_squares = random.randint(10, 550)

draw_image = ImageDraw.Draw(image)

# Draw each rectangle
for _ in range(number_of_squares):
    rectangle_x = random.randint(0, width - rectangle_width)
    rectangle_y = random.randint(0, height - rectangle_height)

    rectangle_shape = [
        (rectangle_x, rectangle_y),
        (rectangle_x + rectangle_width, rectangle_y + rectangle_height)
    ]
    draw_image.rectangle(
        rectangle_shape,
        fill=(
            random.randint(0, 255),
            random.randint(0, 255),
            random.randint(0, 255)
        )
    )

# Save the image
output_path = f'./output/{run_id}.png'
image.save(output_path)
print(f'Image saved to {output_path}')
