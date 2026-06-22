import { analyzeFabricRepeat } from "./repeatDetection.js";

export function loadFabricFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Unable to read fabric file."));

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const fabric = {
          name: file.name,
          dataUrl: reader.result,
          image,
          repeat: analyzeFabricRepeat(image),
          repeatTile: null
        };

        resolve(fabric);
      };

      image.onerror = () => reject(new Error("Unable to load fabric image."));
      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}
