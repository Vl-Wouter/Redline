import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumRepository } from './repositories/album.repository';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { User } from 'src/users/user.entity';
import { Album } from './entities/album.entity';
import { PhotoRepository } from './repositories/photo.repository';
import { unlinkSync } from 'fs';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumRepository) private albumRepository: AlbumRepository,
    @InjectRepository(PhotoRepository) private photoRepository: PhotoRepository,
  ) {}

  async getAll() {
    return this.albumRepository.find({ relations: ['photos', 'photographer'] });
  }

  async getById(id: number) {
    return this.albumRepository.findOneOrFail(id, {
      relations: ['photos', 'photographer'],
    });
  }
  async getBySlug(slug: string) {
    return this.albumRepository.findOneOrFail(
      { slug },
      { relations: ['photos', 'photographer'] },
    );
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
    const options = user.isAdmin() ? { id } : { id, photographer: user };
    const result = await this.albumRepository.update(options, updateAlbumDTO);
    if (result.affected === 0 || result.raw.affectedRows === 0) {
      throw new NotFoundException('Cannot update this album');
    }
    return this.getById(id);
  }

  async delete(id: number, user: User) {
    const album = await this.getById(id);
    if (album.photographer !== user && !user.isAdmin()) {
      throw new NotFoundException('Cannot find an album to delete');
    }
    album.photos.forEach(image => {
      unlinkSync(`./uploads/${image.url}`);
    });
    await this.albumRepository.remove(album);
  }

  async deletePhoto(photoId: number, user: User) {
    const photo = await this.photoRepository.findOne(photoId, {
      relations: ['album', 'album.photographer'],
    });
    if (photo.album.photographer !== user && !user.isAdmin) {
      throw new NotFoundException('Cannot find a photo to delete');
    }
    unlinkSync(`./uploads/${photo.url}`);
    return this.photoRepository.remove(photo);
  }

  async addPhoto(albumId: number, images, user: User) {
    const options = user.isAdmin()
      ? { id: albumId }
      : { id: albumId, photographer: user };
    const album = await this.albumRepository.findOne(options);
    if (!album) {
      throw new NotFoundException('Cannot find an album to add a photo to');
    }

    images.forEach(async image => {
      await this.photoRepository.createPhoto(image, album, user);
    });

    return this.getById(albumId);
  }
}
