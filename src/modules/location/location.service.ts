import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Location, Employee } from '@prisma/client';
import { LocationDto } from './dto';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllLocations(): Promise<Location[]> {
    return this.databaseService.location.findMany();
  }

  async getOneLocationById(locationId: number): Promise<Location | null> {
    return this.databaseService.location.findUnique({
      where: { id: locationId },
    });
  }

  async getEmployeesByLocationId(locationId: number): Promise<Employee[]> {
    return this.databaseService.employee.findMany({
      where: { locationId },
      include: {
        user: true,
      },
    });
  }

  async createLocation(dto: LocationDto): Promise<Location> {
    return this.databaseService.location.create({
      data: {
        ...dto,
      },
    });
  }

  async updateLocation(
    locationId: number,
    dto: LocationDto,
  ): Promise<Location> {
    return this.databaseService.location.update({
      where: { id: locationId },
      data: dto,
    });
  }

  async deleteLocation(locationId: number): Promise<Location | null> {
    return this.databaseService.location.delete({
      where: { id: locationId },
    });
  }
}
