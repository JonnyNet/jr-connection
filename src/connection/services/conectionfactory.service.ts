import { Injectable } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { Configuration } from '../types/configuration';
import { ConnectionModule } from '../connection.module';

@Injectable()
export class ConectionfactoryService {

    constructor() { }

    public createConection(database: Configuration): ConnectionService {
        return ConnectionModule.readConfig(database);
    }
}
