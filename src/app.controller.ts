import { Controller, Get } from '@nestjs/common';
import { ConnectionService } from './connection/services/connection.service';

@Controller('home')
export class AppController {
  constructor(private readonly appService: ConnectionService) { }

  @Get('getHello')
  async getHello() {
    const data =  await this.appService.returnDataTable('select * from inv_almacen;SELECT * FROM inv_conceptos;');
    console.log(data);
    return data;
  }
}
