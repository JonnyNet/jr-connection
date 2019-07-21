import * as mysql from "mysql";
import { Observable, from } from "rxjs";
import { Connection } from "../core/connection";
import { Param } from "../types/param";
import { Configuration } from "../types/configuration";
import { concatMap, map } from "rxjs/operators";

export class MySqlServer extends Connection {
    
    private connection: any;
    private flag: boolean = true;

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

    protected async getConectionTransaction(pool: any) {
        if (this.istransaction) {
            if (this.flag) {
                pool = await pool.beginTransaction();
                this.flag = this.flag;
                return pool;
            }
        }
        return new Promise((resolve) => resolve(pool));
    }

    protected setParemeters(com: any, parameters: Array<Param>, typeparam): any {
        if (parameters) {
            parameters.forEach(item => {
                com = typeparam(com, item);
            });
        }
        return com;
    }

    protected executeQuerys(query: string, parametersInput: Array<Param>, parametersOutPut: Array<Param>, typeExecute: any, typeData: any): Promise<any> {
        query = query.split('[]').join(this.config.schema);
        return this.connectionStart().pipe(
            concatMap((pool: any) => {
                return from(this.getConectionTransaction(pool)).pipe(
                    concatMap(com => {
                        com = this.setParemeters(com, parametersInput, this.input);
                        com = this.setParemeters(com, parametersOutPut, this.output);
                        return from(typeExecute(com, query)).pipe(
                            map((x: any) => {
                                return typeData(x);
                            })
                        );
                    })
                );
            })
        ).toPromise();
    }

    protected input(com: any, item: Param) {
        throw new Error("Method not implemented.");
    }

    protected output(com: any, item: Param) {
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
