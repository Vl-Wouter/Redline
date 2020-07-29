import {
  Controller,
  Param,
  Get,
  UseGuards,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Vehicle } from './vehicle.entity';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { diskStorage } from 'multer';

@Controller('vehicles')
@ApiTags('Vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get('/user/:id')
  @ApiOperation({
    operationId: 'Get vehicles by user',
  })
  @ApiOkResponse({
    description: 'Vehicles have been found',
    type: Vehicle,
    isArray: true,
  })
  getVehiclesByUser(@Param() userId: number): Promise<Vehicle[]> {
    return this.vehiclesService.getUserVehicles(userId);
  }

  @Get('/:id')
  @ApiOperation({ operationId: 'Get vehicle by id' })
  @ApiOkResponse({ description: 'Vehicle has been found', type: Vehicle })
  getVehicleById(@Param() id: number): Promise<Vehicle> {
    return this.vehiclesService.getVehicleById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiOperation({ operationId: 'Create a new vehicle' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateVehicleDTO })
  @ApiCreatedResponse({
    description: 'Vehicle has been created',
    type: Vehicle,
  })
  @ApiBadRequestResponse({ description: 'Vehicle data is incomplete' })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to create vehicles',
  })
  @ApiInternalServerErrorResponse({
    description: 'A server-side error occured',
  })
  createVehicle(
    @Body() createVehicleDTO: CreateVehicleDTO,
    @GetUser() user: User,
    @UploadedFile() file,
  ) {
    return this.vehiclesService.createVehicle(createVehicleDTO, user, file);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Delete a vehicle' })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'Vehicle has successfully been deleted',
  })
  @ApiNotFoundResponse({ description: 'Cannot find a vehicle to delete' })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to delete this vehicle',
  })
  deleteVehicle(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.vehiclesService.deleteVehicle(id, user);
  }
}
