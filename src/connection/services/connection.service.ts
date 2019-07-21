import { Injectable } from '@nestjs/common';
import { Connection } from '../core/connection';
import { IConnection } from '../core/iconnection';
import { Param } from '../types/param';
import { Observable } from 'rxjs';

@Injectable()
export class ConnectionService implements IConnection {

    constructor(private connection: Connection) { }

    initTransaction() {
        this.connection.initTransaction();
    }

    commit(): Observable<any> {
        return this.connection.commit();
    }

    rollback(): Observable<any> {
        return this.connection.rollback();
    }

    returnFirst(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnFirst(query, parametersInput);
    }

    returnDataSet(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnDataSet(query, parametersInput);
    }
    returnDataTable(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnDataTable(query, parametersInput);
    }

    returnValue(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnValue(query, parametersInput);
    }

    returnDataTableProcedure(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnDataTableProcedure(query, parametersInput);
    }
    returnValueProcedure(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnValueProcedure(query, parametersInput);
    }

    returnOutPutProcedure(query: string, parametersInput: Array<Param> = undefined, parametersOutPut: Array<Param> = undefined): Promise<any> {
        return this.connection.returnOutPutProcedure(query, parametersInput, parametersOutPut);
    }

    returnDataTableAndOutPutProcedure(query: string, parametersInput: Array<Param> = undefined, parametersOutPut: Array<Param> = undefined): Promise<any> {
        return this.connection.returnDataTableAndOutPutProcedure(query, parametersInput, parametersOutPut);
    }

    executeQuery(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.executeQuery(query, parametersInput);
    }

}
