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
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { User } from 'src/auth/user.entity';
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
} from '@nestjs/swagger';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { diskStorage } from 'multer';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/vehicles',
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
  deleteVehicle(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.vehiclesService.deleteVehicle(id, user);
  }
}
