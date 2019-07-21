import { Observable } from "rxjs";
import { Param } from "../types/param";
import { IConnection } from "./iconnection";
import { Configuration } from "../types/configuration";

export abstract class Connection implements IConnection {

    protected transaction: any;
    protected istransaction: boolean = false;
    private _config;
    protected schema: string;

    constructor(config: Configuration) {
        this._config = config;
        this.schema = config.schema;
    }

    protected get config() {
        return this._config;
    }

    protected abstract connectionStart(): Observable<any>;

    public abstract initTransaction(): void;
    public abstract commit(): Observable<any>;
    public abstract rollback(): Observable<any>;

    protected abstract executeQuerys(query: string, parametersInput: Array<Param>, parametersOutPut: Array<Param>, typeExecute: any, typeData: any): Promise<any>;
    protected abstract query(com: any, query: string): any;
    protected abstract first(records: any): any;
    protected abstract dataSet(records: any): any;
    protected abstract dataTable(records: any): any;
    protected abstract value(records: any): any;
    protected abstract execute(com: any, query: string): any;
    protected abstract dataOutPut(records: any): any;
    protected abstract dataTableAndOutPut(records: any): any;
    protected abstract void(records: any): any;

    protected abstract setParemeters(com: any, parameters: Array<Param>, typeparam): any;
    protected abstract input(com: any, item: Param): any;
    protected abstract output(com: any, item: Param): any;
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

}
