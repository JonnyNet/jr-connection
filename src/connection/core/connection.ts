import { Observable } from "rxjs";
import { Param } from "../types/param";
import { IConnection } from "./iconnection";
import { Configuration } from "../types/configuration";

export abstract class Connection implements IConnection {

    protected transaction: any;
    protected istransaction: boolean = false;
    protected _config: any;

    constructor(config: Configuration) {
        this.config = config;
    }

    protected set config(config: any) {
        this._config = config;
    }

    protected get config() {
        return this._config;
    }

    protected abstract connectionStart(): Observable<any>;

    public abstract initTransaction(): void;
    public abstract commit(): Observable<any>;
    public abstract rollback(): Observable<any>;

    protected abstract executeQuerys(query: string, parametersInput: Array<Param>, parametersOutPut: Array<Param>, typeExecute: any, typeData: any): Promise<any>;
    protected abstract query(com: any, query: string, parametersInput: Array<Param>): any;
    protected abstract execute(com: any, query: string, parametersInput: Array<Param>): any;
    protected abstract dataOutPut(records: any): any;
    protected abstract dataTableAndOutPut(records: any): any;
    protected abstract getConectionTransaction(pool: any): any;

    public abstract toTable(columns: Array<Param>, data: Array<any>): any;

    public returnFirst(query: string, parametersInput: Array<Param> = undefined) {
        return this.executeQuerys(query, parametersInput, undefined, this.query, this.first)
    }

    public returnDataSet(query: string, parametersInput: Array<Param> = undefined) {
        return this.executeQuerys(query, parametersInput, undefined, this.query, this.dataSet)
    }

    public returnDataTable(query: string, parametersInput: Array<Param> = undefined) {
        return this.executeQuerys(query, parametersInput, undefined, this.query, this.dataTable)
    }

    public returnValue(query: string, parametersInput: Array<Param> = undefined) {
        return this.executeQuerys(query, parametersInput, undefined, this.query, this.value)
    }

    public returnDataTableProcedure(query: string, parametersInput: Array<Param> = undefined) {
        return this.executeQuerys(query, parametersInput, undefined, this.execute, this.dataTable)
    }

    public returnValueProcedure(query: string, parametersInput: Array<Param> = undefined) {
        return this.executeQuerys(query, parametersInput, undefined, this.execute, this.value)
    }

    public returnOutPutProcedure(query: string, parametersInput: Array<Param> = undefined, parametersOutPut: Array<Param> = undefined) {
        return this.executeQuerys(query, parametersInput, parametersOutPut, this.execute, this.dataOutPut)
    }

    public returnDataTableAndOutPutProcedure(query: string, parametersInput: Array<Param> = undefined, parametersOutPut: Array<Param> = undefined) {
        return this.executeQuerys(query, parametersInput, parametersOutPut, this.execute, this.dataTableAndOutPut)
    }

    public executeQuery(query: string, parametersInput: Array<Param> = undefined) {
        return this.executeQuerys(query, parametersInput, undefined, this.query, this.void)
    }

    protected dataSet(records: any) {
        return records;
    }

    protected dataTable(records: any) {
        return records;
    }

    protected first(records: any) {
        if (records.length > 0)
            return records[0];
        else return undefined;
    }

    protected value(records: any) {
        let objoutput = undefined;
        const data = records;
        if (data.length > 0) {
            const propety = Object.keys(data[0])[0]
            objoutput = data[0][propety];
        }
        return objoutput;
    }

    protected void(records: any) {
        return;
    }

    protected baseReturn(records: any, callback: any) {
        if (records.length > 0) {
            return callback(records);
        } else return [];
    }

}
