import { Repository, EntityRepository } from 'typeorm';
import { Album } from '../entities/album.entity';
import { CreateAlbumDTO } from '../dto/create-album.dto';
import { User } from 'src/users/user.entity';
import { slugify } from 'src/utils/slugify.utils';

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {
  async createAlbum(dto: CreateAlbumDTO, user: User): Promise<Album> {
    const album = await this.create(dto);
    const [albums, existing] = await this.findAndCount({ title: album.title });
    if (existing > 0) {
      album.slug = slugify(`${album.title} ${existing}`);
    } else {
      album.slug = slugify(album.title);
    }
    album.eventId = dto.eventId;
    album.photographer = user;

    await album.save();
    return album;
  }
}
