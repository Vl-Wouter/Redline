import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumRepository } from './repositories/album.repository';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { User } from 'src/users/user.entity';
import { Album } from './entities/album.entity';
import { PhotoRepository } from './repositories/photo.repository';
import { unlink, unlinkSync } from 'fs';
import { promisify } from 'util';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumRepository) private albumRepository: AlbumRepository,
    @InjectRepository(PhotoRepository) private photoRepository: PhotoRepository,
  ) {}

  async getAll() {
    return this.albumRepository.find();
  }

  async getById(id: number) {
    return this.albumRepository.findOneOrFail(id, { relations: ['photos'] });
  }

  async create(
    createAlbumDTO: CreateAlbumDTO,
    images,
    user: User,
  ): Promise<Album> {
    const album = await this.albumRepository.createAlbum(createAlbumDTO, user);
    images.forEach(async image => {
      await this.photoRepository.createPhoto(image, album, user);
    });

    return this.getById(album.id);
  }

  async update(
    id: number,
    updateAlbumDTO: UpdateAlbumDTO,
    user: User,
  ): Promise<Album> {
    const result = await this.albumRepository.update(id, updateAlbumDTO);
    if (result.affected === 0 || result.raw.affectedRows === 0) {
      throw new NotFoundException('Cannot update this album');
    }
    return this.getById(id);
  }

  async delete(id: number, user: User) {
    const album = await this.getById(id);
    album.photos.forEach(image => {
      unlinkSync(`./uploads/${image.url}`);
    });
    await this.albumRepository.remove(album);
  }
}
