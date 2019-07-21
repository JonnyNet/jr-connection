import { Controller, Get } from '@nestjs/common';
import { ConnectionService } from './connection/services/connection.service';

@Controller('home')
export class AppController {
  constructor(private readonly appService: ConnectionService) {}

  @Get('getHello')
  getHello(): string {
    return this.appService.config.database;
  }
}
