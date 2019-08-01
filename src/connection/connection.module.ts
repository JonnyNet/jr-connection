import { Module, DynamicModule, Global } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Configuration } from './types/configuration';
import { ConnectionService } from './services/connection.service';
import { Connection } from './core/connection';
import { SqlServer } from './sqlserver/sqlserver';
import { MySqlServer } from './mysql/mysqlserver';

@Global()
@Module({})
export class ConnectionModule {

    public static forRoot(path: string): DynamicModule {
        const config = dotenv.parse(fs.readFileSync(path));

        const options = new Configuration();
        options.type = config.DBTYPE;
        options.user = config.DBUSER;
        options.password = config.DBPASSWORD;
        options.server = config.DBSERVER;
        options.database = config.DBDATABASE;
        options.schema = config.DBSCHEMA;

        if (config.DBSUBDOMAIN)
            options.subdomain = config.DBSUBDOMAIN;

        const providers = this.createDatabaseProviders(options);
        return ({
            module: ConnectionModule,
            providers: providers,
            exports: providers,
        });
    }

    private static createDatabaseProviders(options: Configuration) {
        return [
            {
                provide: ConnectionService,
                useValue: this.readConfig(options)
            }
        ]
    }

    public static readConfig(options: Configuration): ConnectionService {
        let connection: Connection;
        switch (options.type) {
            case 'MYSQL':
                connection = new MySqlServer(options);
                break;
            case 'MSSQL':
                connection = new SqlServer(options);
                break;
            default:
                throw 'typo of database is not specified';
        }
        return new ConnectionService(connection);
    }
}