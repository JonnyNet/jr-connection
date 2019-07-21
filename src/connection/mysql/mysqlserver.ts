import * as mysql from "mysql";
import { Observable, from } from "rxjs";
import { Connection } from "../core/connection";
import { Param } from "../types/param";
import { Configuration } from "../types/configuration";

export class MySqlServer extends Connection {
    

    private connection: any;

    constructor(config: Configuration) {
        super(config);
    }

    public initTransaction(): void {
        throw new Error("Method not implemented.");
    }
    public commit(): Observable<any> {
        throw new Error("Method not implemented.");
    }
    public rollback(): Observable<any> {
        throw new Error("Method not implemented.");
    }

    public toTable(columns: Param[], data: any[]) {
        throw new Error("Method not implemented.");
    }


    protected connectionStart(): Observable<any> {
        return from(mysql.createPool(this.config));
    }

    protected executeQuerys(query: string, parametersInput: Array<Param>, parametersOutPut: Array<Param>, typeExecute: any, typeData: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    protected query(com: any, query: string) {
        throw new Error("Method not implemented.");
    }

    protected first(records: any) {
        throw new Error("Method not implemented.");
    }

    protected dataSet(records: any) {
        throw new Error("Method not implemented.");
    }

    protected dataTable(records: any) {
        throw new Error("Method not implemented.");
    }

    protected value(records: any) {
        throw new Error("Method not implemented.");
    }

    protected execute(com: any, query: string) {
        throw new Error("Method not implemented.");
    }

    protected dataOutPut(records: any) {
        throw new Error("Method not implemented.");
    }

    protected dataTableAndOutPut(records: any) {
        throw new Error("Method not implemented.");
    }
    
    protected void(records: any) {
        throw new Error("Method not implemented.");
    }

}
