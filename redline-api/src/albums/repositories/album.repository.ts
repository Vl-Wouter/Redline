import { Repository, EntityRepository } from 'typeorm';
import { Album } from '../entities/album.entity';
import { CreateAlbumDTO } from '../dto/create-album.dto';
import { User } from 'src/users/user.entity';
import { slugify } from 'src/utils/slugify.utils';

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {
  async createAlbum(dto: CreateAlbumDTO, user: User): Promise<Album> {
    console.log('DTO', dto);
    const album = await this.create(dto);
    album.slug = slugify(album.title);
    album.photographer = user;

    await album.save();
    return album;
  }
}
