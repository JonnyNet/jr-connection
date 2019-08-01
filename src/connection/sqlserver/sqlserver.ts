import * as sqlsrv from "mssql";
import { from, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Param } from '../types/param';
import { Connection } from '../core/connection';
import { Configuration } from "../types/configuration";
import { MsSqlOptions } from "../types/mssqloptions";

export class SqlServer extends Connection {

    constructor(config: Configuration) {
        super(config);
    }

    protected set config(config: Configuration) {
        super.config = new MsSqlOptions(config);
    }

    public initTransaction() {
        this.istransaction = true;
    }

    public commit(): Observable<any> {
        this.istransaction = false;
        return of(this.transaction.commit())
    }

    public rollback(): Observable<any> {
        this.istransaction = false;
        return of(this.transaction.rollback())
    }

    public toTable(columns: Array<Param>, data: Array<any>) {
        let tvp = new sqlsrv.Table();
        Object.keys(data[0]).forEach(item => {
            const i = columns.find(x => x.name == item);
            tvp.columns.add(i.name, i.type);
        });

        let rowList = [];
        data.forEach(item => {
            rowList.push(Object.values(item));
        });
        tvp.rows = rowList;

        return tvp;
    }

    protected connectionStart(): Observable<any> {
        let connection = new sqlsrv.ConnectionPool(this.config);
        return from(connection.connect());
    }

    protected async getConectionTransaction(pool: any) {
        if (this.istransaction) {
            if (!this.transaction) {
                this.transaction = new sqlsrv.Transaction(pool);
                this.transaction = await this.transaction.begin();
            }
            return new sqlsrv.Request(this.transaction);
        } else
            return new Promise((resolve) => resolve(new sqlsrv.Request(pool)));
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
                                return this.baseReturn(x.recordset, typeData);
                            })
                        );
                    })
                );
            })
        ).toPromise();
    }

    protected input(com: any, item: Param) {
        if (item.type != null)
            com.input(item.name, item.type, item.value);
        else
            com.input(item.name, item.value);

        return com;
    }

    protected output(com: any, item: Param) {
        if (item.type != null)
            com.output(item.name, item.type, item.value);
        else
            com.output(item.name, item.value);
        return com;
    }

    protected query(com: any, query: string, parametersInput: Array<Param> = undefined) {
        return com.query(query);
    }

    protected execute(com: any, query: string, parametersInput: Array<Param> = undefined) {
        return com.execute(query);
    }

    protected dataOutPut(records: any) {
        return records.output;
    }

    protected dataTableAndOutPut(records: any) {
        return {
            recordset: records.recordset,
            output: records.output
        };
    }
}
