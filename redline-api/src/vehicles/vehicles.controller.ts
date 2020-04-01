import {
  Controller,
  Param,
  Get,
  UseGuards,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/vehicles',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createVehicle(
    @Body() createVehicleDTO: CreateVehicleDTO,
    @GetUser() user: User,
    @UploadedFile() file,
  ) {
    return this.vehiclesService.createVehicle(createVehicleDTO, user, file);
  }
}
