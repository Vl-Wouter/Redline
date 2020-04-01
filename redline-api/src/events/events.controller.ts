import {
  Controller,
  Param,
  Get,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  Delete,
  Patch,
  Query,
  UseGuards,
  Logger,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDTO } from './dto/create-event.dto';
import { UpdateEventDTO } from './dto/update-event.dto';
import { GetEventFilterDTO } from './dto/get-event-filters.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiConsumes,
  ApiBody,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  private logger = new Logger('EventsController');

  constructor(private eventService: EventsService) {}

  @Get()
  @ApiOperation({
    operationId: 'Get all Events',
    description: 'Get all & filter events',
  })
  @ApiOkResponse({
    description: 'Found all events',
    type: Event,
    isArray: true,
  })
  getEvents(
    @Query(ValidationPipe) filterDTO: GetEventFilterDTO,
  ): Promise<Event[]> {
    return this.eventService.getEvents(filterDTO);
  }

  @Get('/header/:name')
  @ApiOperation({
    operationId: 'Get event header',
    description: 'Returns the image file associated with the event',
  })
  @ApiOkResponse({ description: 'Image has been returned' })
  async getEventHeader(@Param('name') name: string, @Res() res): Promise<any> {
    res.sendFile(name, { root: 'uploads/events' });
  }

  @Get('/:slug')
  @ApiOperation({
    operationId: 'Get event by slug',
    description: 'Returns event associated with the slug',
  })
  @ApiOkResponse({ description: 'Event has been found', type: Event })
  @ApiNotFoundResponse({ description: 'Event does not exist' })
  @ApiBadRequestResponse({ description: 'Event information is not complete' })
  getEventBySlug(@Param('slug') slug: string): Promise<Event> {
    return this.eventService.getEventBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('header', {
      storage: diskStorage({
        destination: './uploads/events',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UsePipes(ValidationPipe)
  @ApiOperation({ operationId: 'Create a new event' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Event data', type: CreateEventDTO })
  @ApiOkResponse({
    description: 'Event has successfully been created',
    type: Event,
  })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  createEvent(
    @UploadedFile() headerImage,
    @Body() createEventDTO: CreateEventDTO,
    @GetUser() user: User,
  ): Promise<Event> {
    console.log(createEventDTO);
    return this.eventService.createEvent(createEventDTO, user, headerImage);
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  @ApiOperation({
    operationId: 'Delete event by slug',
    description: 'Removes an event from the database',
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Event has successfully been deleted' })
  @ApiNotFoundResponse({ description: 'Unable to find event to remove' })
  @ApiUnauthorizedResponse({ description: 'User cannot delete an event' })
  deleteEvent(
    @Param('slug') slug: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.eventService.deleteEvent(slug, user);
  }

  @Patch('/:slug')
  @UseGuards(AuthGuard())
  @ApiOperation({
    operationId: 'Update event by slug',
    description: 'Update certain event values',
  })
  @ApiBearerAuth()
  @ApiBody({ description: 'Event data', type: UpdateEventDTO })
  @ApiOkResponse({
    description: 'Event has successfully been updated',
    type: Event,
  })
  @ApiUnauthorizedResponse({ description: 'User cannot update an event' })
  @ApiNotFoundResponse({ description: 'Cannot find event to update' })
  updateEvent(
    @Param('slug') slug: string,
    @Body() updateEventDTO: UpdateEventDTO,
    @GetUser() user: User,
  ): Promise<Event> {
    return this.eventService.updateEvent(slug, updateEventDTO, user);
  }

  @Post('/:id/attend')
  @UseGuards(AuthGuard())
  attendEvent(
    @Param('id') id: number,
    @Body('vehicle') vehicleId: number,
    @GetUser() user: User,
  ) {
    return this.eventService.attendEvent(id, user, vehicleId);
  }

  @Post('/:id/leave')
  @UseGuards(AuthGuard())
  leaveEvent(@Param('id') id: number, @GetUser() user: User) {
    return this.eventService.leaveEvent(id, user);
  }
}
