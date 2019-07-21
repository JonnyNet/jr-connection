import { Module, DynamicModule } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Configuration } from './types/configuration';
import { ConnectionService } from './services/connection.service';
import { IConnection } from './core/iconnection.interface';
import { SqlServer } from './sqlserver/sqlserver';

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
        let connection: IConnection;
        switch (options.type) {
            case 'MYSQL':
                break;
            case 'MSSQL':
                connection = new SqlServer();
                break;
            default:
                throw 'typo of database is not specified';
        }

        let con = new ConnectionService(connection);
        con.config = options;
        return con;
    }
}