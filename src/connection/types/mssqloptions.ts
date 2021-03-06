import { Configuration } from "./configuration";

export class MsSqlOptions {
    user: string;
    password: string;
    server: string;
    database: string;
    subdomain: string;
    schema: string;
    driver = "tedious";
    pool = {
        max: 100,
        min: 0,
        idleTimeoutMillis: 100000
    };
    options = {
        encrypt: false
    };


    constructor(config: Configuration) {
        this.server = config.server;
        this.user = config.user;
        this.password = config.password;
        this.database = config.database;
        this.subdomain = config.subdomain;
        this.schema = config.schema;
    }
}