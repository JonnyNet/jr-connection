import * as mysql from "mysql";
import * as util from 'util';
import { Observable, from, of } from "rxjs";
import { Connection } from "../core/connection";
import { Param } from "../types/param";
import { Configuration } from "../types/configuration";
import { concatMap, map } from "rxjs/operators";
import { MysqlOptions } from "../types/mysqloptions";

export class MySqlServer extends Connection {

    private connection: any;
    private flag: boolean = true;

    constructor(config: Configuration) {
        super(config);
    }

    protected set config(config: any) {
        super.config = new MysqlOptions(config);
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
        return of(mysql.createPool(this._config));
    }

    protected async getConectionTransaction(pool: any): Promise<any> {
        if (this.istransaction) {
            if (this.flag) {
                pool = await pool.beginTransaction();
                this.flag = this.flag;
                return pool;
            }
        }
        return new Promise((resolve) => resolve(pool));
    }

    protected executeQuerys(query: string, parametersInput: Array<Param>, parametersOutPut: Array<Param>, typeExecute: any, typeData: any): Promise<any> {
        query = query.split('[]').join(this._config.schema);
        return this.connectionStart().pipe(
            concatMap((pool: any) => {
                return from(this.getConectionTransaction(pool)).pipe(
                    concatMap(com => {
                        return from(typeExecute(com, query, parametersInput)).pipe(
                            map((x: any) => {
                                return this.baseReturn(x, typeData);
                            })
                        );
                    })
                );
            })
        ).toPromise();
    }

    protected async query(com: any, query: string, parametersInput: Array<Param> = undefined) {
        return new Promise((resolve, reject) => {
            com.query(query, parametersInput, (err: any, rows: any) => {
                if (err)
                    throw err;
                resolve(rows);
            });
        });
    }

    protected execute(com: any, query: string, parametersInput: Array<Param> = undefined) {
        return this.query(com, query, parametersInput);
    }

    protected dataOutPut(records: any) {
        throw new Error("Method not implemented.");
    }

    protected dataTableAndOutPut(records: any) {
        throw new Error("Method not implemented.");
    }

    
}
