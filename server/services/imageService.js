import sharp from 'sharp';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_WIDTH = 2000;

export async function processImage(fileBuffer) {
    const metaData = await sharp(fileBuffer).metadata();
    const hasAlpha = metaData.hasAlpha === true;
    const format = hasAlpha ? "png" : "jpeg";
    const ext = format === "png" ? ".png" : ".jpg"; 
    const mimeType = format === "png" ? "image/png" : "image/jpeg";

    let quality = 90;
    let outputBuffer;

    do {
        outputBuffer = await sharp(fileBuffer)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            [format]({ quality })
            .toBuffer();

        quality-=10;
    }
    while(outputBuffer.length > MAX_FILE_SIZE && quality > 10);

    return { buffer: outputBuffer, ext, mimeType };
}