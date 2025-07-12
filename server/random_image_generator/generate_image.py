from flask import Flask, send_file, jsonify
import uuid
import os
import random
from PIL import Image, ImageDraw

app = Flask(__name__)
OUTPUT_DIR = 'output'
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.route('/generate', methods=['GET'])
def generate_image():
    run_id = str(uuid.uuid4())
    image_path = os.path.join(OUTPUT_DIR, f"{run_id}.png")

    image = Image.new('RGB', (2000, 2000))
    draw_image = ImageDraw.Draw(image)

    number_of_squares = random.randint(10, 550)
    rect_w, rect_h = 100, 100
    width, height = image.size

    for _ in range(number_of_squares):
        x = random.randint(0, width - rect_w)
        y = random.randint(0, height - rect_h)
        shape = [(x, y), (x + rect_w, y + rect_h)]
        color = tuple(random.randint(0, 255) for _ in range(3))
        draw_image.rectangle(shape, fill=color)

    image.save(image_path)
    return jsonify({"image_url": f"/image/{run_id}.png"})

@app.route('/image/<filename>')
def get_image(filename):
    path = os.path.join(OUTPUT_DIR, filename)
    return send_file(path, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
