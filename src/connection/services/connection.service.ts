import { Injectable } from '@nestjs/common';
import { IConnection } from '../core/iconnection.interface';
import { Configuration } from '../types/configuration';

@Injectable()
export class ConnectionService {

    private _config : Configuration;
    public squema: string;

    constructor(private connection: IConnection) {

    }

    get config() {
        return this._config;
    }

    set config(config: Configuration) {
        this._config = config;
        this.squema = config.schema;
    }

}
