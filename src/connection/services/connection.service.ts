import { Injectable } from '@nestjs/common';
import { Connection } from '../core/connection';
import { IConnection } from '../core/iconnection';
import { Param } from '../types/param';
import { Observable } from 'rxjs';

@Injectable()
export class ConnectionService implements IConnection {

    constructor(private connection: Connection) { }

    public initTransaction() {
        this.connection.initTransaction();
    }

    public commit(): Observable<any> {
        return this.connection.commit();
    }

    public rollback(): Observable<any> {
        return this.connection.rollback();
    }

    public toTable(columns: Param[], data: any[]): any {
        this.connection.toTable(columns, data);
    }

    public returnFirst(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnFirst(query, parametersInput);
    }

    public returnDataSet(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnDataSet(query, parametersInput);
    }

    public returnDataTable(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnDataTable(query, parametersInput);
    }

    public returnValue(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnValue(query, parametersInput);
    }

    public returnDataTableProcedure(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnDataTableProcedure(query, parametersInput);
    }

    public returnValueProcedure(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.returnValueProcedure(query, parametersInput);
    }

    public returnOutPutProcedure(query: string, parametersInput: Array<Param> = undefined, parametersOutPut: Array<Param> = undefined): Promise<any> {
        return this.connection.returnOutPutProcedure(query, parametersInput, parametersOutPut);
    }

    public returnDataTableAndOutPutProcedure(query: string, parametersInput: Array<Param> = undefined, parametersOutPut: Array<Param> = undefined): Promise<any> {
        return this.connection.returnDataTableAndOutPutProcedure(query, parametersInput, parametersOutPut);
    }

    public executeQuery(query: string, parametersInput: Array<Param> = undefined): Promise<any> {
        return this.connection.executeQuery(query, parametersInput);
    }

    public setParams(columns: Array<Param>, data: any) {
        columns.forEach((item) => {
            item.value = data[item.name];
        })
        return columns;
    }

}
