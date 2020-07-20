import { Repository, EntityRepository } from 'typeorm';
import { Photo } from '../entities/photo.entity';
import { handleImage } from 'src/utils/file-upload.utils';
import { User } from 'src/users/user.entity';
import { Album } from '../entities/album.entity';

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {
  async createPhoto(image, album: Album, user: User): Promise<Photo> {
    const photo = this.create();
    console.log(image);
    photo.url = await handleImage(image.path, {
      width: 2000,
      isSquare: false,
      dest: `uploads/albums/${user.username}/${album.slug}`,
      name: image.filename.split('.jpg')[0],
      format: 'jpg',
    });
    photo.alt = image.filename;
    photo.album = album;

    await photo.save();
    return photo;
  }
}
