import { Injectable } from '@nestjs/common';
import { Configuration } from '../types/configuration';
import { Connection } from '../core/connection';

@Injectable()
export class ConnectionService {

    private _config : Configuration;
    public squema: string;

    constructor(private connection: Connection) {

    }

    get config() {
        return this._config;
    }

    set config(config: Configuration) {
        this._config = config;
        this.squema = config.schema;
    }

}
