import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumRepository } from './repositories/album.repository';
import { AuthModule } from 'src/auth/auth.module';
import { PhotoRepository } from './repositories/photo.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumRepository, PhotoRepository]),
    AuthModule,
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
