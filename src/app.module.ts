import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConnectionModule } from './connection/connection.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

const ENV = join(__dirname, '..', 'environments');
dotenv.config({ path: `${ENV}/.env` });
const FILE_ENV = `${ENV}/${process.env.NODE_ENV}.env`;

@Module({
  imports: [ConnectionModule.forRoot(FILE_ENV)],
  controllers: [AppController],
  providers: [],
  exports: [ConnectionModule]
})
export class AppModule { }
