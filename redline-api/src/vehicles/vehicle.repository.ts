import { Repository, EntityRepository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { User } from 'src/auth/user.entity';
import { unlinkSync } from 'fs';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {
  async createVehicle(createVehicleDTO: CreateVehicleDTO, user: User, image) {
    try {
      const vehicle = await Vehicle.create(createVehicleDTO);
      vehicle.photo = image.filename;
      vehicle.owner = user;

      await vehicle.save();
      return vehicle;
    } catch (error) {
      unlinkSync(`./${image.path}`);
      throw new InternalServerErrorException(error);
    }
  }
}
