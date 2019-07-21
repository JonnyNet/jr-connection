export class MsSqlOptions {
    user: string;
    password: string;
    server: string;
    database: string;
    schema: string;
    subdomain: string;
    driver = "tedious";
    pool = {
        max: 100,
        min: 0,
        idleTimeoutMillis: 100000
    };
    options = {
        encrypt: false
    };
}