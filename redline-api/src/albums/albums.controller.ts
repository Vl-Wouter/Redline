import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Patch,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { Album } from './entities/album.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Controller('albums')
@ApiTags('Albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  // Get albums
  @Get()
  @ApiOperation({ operationId: 'Get all albums' })
  @ApiOkResponse({
    description: 'List of all albums',
    type: Album,
    isArray: true,
  })
  getAll(): Promise<Album[]> {
    return this.albumsService.getAll();
  }
  // Get single album
  @Get('/:id')
  @ApiOperation({ operationId: 'Get one album' })
  @ApiOkResponse({ description: 'A single album', type: Album })
  @ApiNotFoundResponse({ description: 'No album with this id' })
  getById(@Param('id') id: number | string): Promise<Album> {
    if (typeof id === 'string') {
      return this.albumsService.getBySlug(id);
    }
    return this.albumsService.getById(id);
  }
  // Create album
  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiOperation({ operationId: 'Create an album' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateAlbumDTO })
  @ApiCreatedResponse({
    description: 'New Album',
    type: Album,
  })
  @ApiUnauthorizedResponse({ description: 'Not Authorized' })
  create(
    @Body() createAlbumDTO: CreateAlbumDTO,
    @UploadedFiles() images,
    @GetUser() user: User,
  ): Promise<Album> | void {
    return this.albumsService.create(createAlbumDTO, images, user);
  }
  // Update album
  @Patch('/:id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @ApiOperation({ operationId: 'Update an album' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateAlbumDTO })
  @ApiOkResponse({ description: 'Updated album', type: Album })
  @ApiUnauthorizedResponse({ description: 'Not Authorized' })
  @ApiNotFoundResponse({ description: 'Cannot update album' })
  update(
    @Param('id') id: number,
    @Body() updateAlbumDTO: UpdateAlbumDTO,
    @GetUser() user: User,
  ): Promise<Album> {
    return this.albumsService.update(id, updateAlbumDTO, user);
  }
  // Delete album
  @Delete('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Delete an album' })
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Album is deleted' })
  @ApiNotFoundResponse({ description: 'Cannot delete album' })
  @ApiUnauthorizedResponse({ description: 'Not Authorized' })
  delete(@Param('id') id: number, @GetUser() user: User) {
    return this.albumsService.delete(id, user);
  }
  // Delete single photo
  // Add photos to album
}
