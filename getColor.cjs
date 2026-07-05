const Jimp = require('jimp');

async function getColor() {
  try {
    const image = await Jimp.read('public/letterpad-default.jpg');
    // Read a pixel from the bottom center (the footer is a solid bar of the accent color)
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const hex = image.getPixelColor(Math.floor(width / 2), height - 20);
    const color = Jimp.intToRGBA(hex);
    console.log(`Footer Color: rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
    
    // Convert to Hex
    const hexStr = '#' + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1).toUpperCase();
    console.log(`Hex: ${hexStr}`);
  } catch (error) {
    console.error(error);
  }
}

getColor();
