import { Repository, EntityRepository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {
  async createVehicle(createVehicleDTO: CreateVehicleDTO, user: User, image) {}
}
