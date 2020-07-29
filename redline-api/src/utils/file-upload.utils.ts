import { extname } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import sharp from 'sharp';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)) {
    return callback(new Error('Only image files are allowed'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const handleImage = async (input: string, options) => {
  const { width, isSquare, dest, name, format } = options;
  try {
    const image = sharp(input);
    isSquare
      ? image.resize(width, width, {
          fit: 'cover',
          position: sharp.strategy.attention,
        })
      : image.resize({ width });
    const destExists = existsSync(dest);
    if (!destExists) mkdirSync(dest, { recursive: true });
    await image.toFormat(format).toFile(`${dest}/${name}.${format}`);

    return `${dest.replace('uploads/', '')}/${name}.${format}`;
  } catch (err) {
    console.error(err);
  } finally {
    unlinkSync(input);
  }
};
