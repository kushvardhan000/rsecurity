from PIL import Image
import os
import json

dir = "D:/rsecurity/public/gallery/"
res = []
for f in os.listdir(dir):
    try:
        with Image.open(os.path.join(dir, f)) as img:
            res.append({"file": f, "w": img.width, "h": img.height})
    except Exception as e:
        res.append({"file": f, "error": str(e)})

print(json.dumps(res, indent=2))
