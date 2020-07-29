import { Repository, EntityRepository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { User } from 'src/users/user.entity';
import { unlinkSync } from 'fs';
import { InternalServerErrorException } from '@nestjs/common';
import { handleImage } from 'src/utils/file-upload.utils';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {
  async createVehicle(createVehicleDTO: CreateVehicleDTO, user: User, image) {
    try {
      const vehicle = await Vehicle.create(createVehicleDTO);
      if (image) {
        vehicle.photo = await handleImage(image.path, {
          width: 2000,
          isSquare: false,
          dest: `uploads/vehicles/${user.username}`,
          name: `${user.id}-${vehicle.make}-${vehicle.model}`,
          format: 'jpg',
        });
      }
      vehicle.owner = user;

      await vehicle.save();
      return vehicle;
    } catch (error) {
      unlinkSync(`./${image.path}`);
      throw new InternalServerErrorException(error);
    }
  }
}
