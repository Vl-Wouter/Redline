import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleRepository } from './vehicle.repository';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { unlinkSync } from 'fs';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleRepository)
    private vehicleRepository: VehicleRepository,
  ) {}

  async getUserVehicles(userId: number): Promise<Vehicle[]> {
    return this.vehicleRepository.find({ where: { ownerId: userId } });
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    const found = await this.vehicleRepository.findOne(id);

    if (!found)
      throw new NotFoundException('Cannot find a vehicle with this id');

    return found;
  }

  async createVehicle(
    createVehicleDTO: CreateVehicleDTO,
    user: User,
    imageFile,
  ) {
    return this.vehicleRepository.createVehicle(
      createVehicleDTO,
      user,
      imageFile,
    );
  }

  async deleteVehicle(id: number, user: User): Promise<void> {
    const options = user.isAdmin() ? { id } : { id, owner: user };
    const vehicle = await this.vehicleRepository.findOne(options);
    if (!vehicle)
      throw new NotFoundException(`No owned vehicle found with this id`);
    if (vehicle.photo) {
      unlinkSync(`./uploads/${vehicle.photo}`);
    }
    await this.vehicleRepository.remove(vehicle);
  }
}
