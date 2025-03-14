import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Location, Employee } from '@prisma/client';
import { LocationDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Public()
  @Get()
  async getAllLocations(): Promise<Location[]> {
    return this.locationService.getAllLocations();
  }

  @Public()
  @Get(':locationId')
  async getOneLocationById(
    @Param('locationId', ParseIntPipe) locationId: number,
  ): Promise<Location | null> {
    return this.locationService.getOneLocationById(locationId);
  }

  @Public()
  @Get(':locationId/employees')
  async getEmployeesByLocationId(
    @Param('locationId', ParseIntPipe) locationId: number,
  ): Promise<Employee[]> {
    return this.locationService.getEmployeesByLocationId(locationId);
  }

  @Post()
  async createLocation(@Body() locationDto: LocationDto): Promise<Location> {
    return this.locationService.createLocation(locationDto);
  }

  @Put(':locationId')
  async updateLocation(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() locationDto: LocationDto,
  ): Promise<Location> {
    return this.locationService.updateLocation(locationId, locationDto);
  }

  @Delete(':locationId')
  async deleteLocation(
    @Param('locationId', ParseIntPipe) locationId: number,
  ): Promise<Location | null> {
    return this.locationService.deleteLocation(locationId);
  }
}
