import { Configuration } from "./configuration";

export class MysqlOptions {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit: number = 10;
    subdomain: string;
    schema: string;
    acquireTimeout : number = 10000;
    multipleStatements : boolean = true;

    constructor(config: Configuration) {
        this.host = config.server;
        this.user = config.user;
        this.password = config.password;
        this.database = config.database;
        this.subdomain = config.subdomain;
        this.schema = config.schema;
    }
}
