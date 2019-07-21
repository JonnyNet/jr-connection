import * as sqlsrv from "mssql";
import { from, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Param } from '../types/param';
import { Connection } from '../core/connection';
import { Configuration } from "../types/configuration";

export class SqlServer extends Connection {

    constructor(config: Configuration) {
        super(config);
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

    public setParams(columns: Array<Param>, data: any) {
        columns.forEach((item) => {
            item.value = data[item.name];
        })
        return columns;
    }

    protected connectionStart(): Observable<any> {
        let connection = new sqlsrv.ConnectionPool(this.config);
        return from(connection.connect());
    }

    private async getConectionTransaction(pool: any) {
        if (this.istransaction) {
            if (!this.transaction) {
                this.transaction = new sqlsrv.Transaction(pool);
                this.transaction = await this.transaction.begin();
            }
            return new sqlsrv.Request(this.transaction);
        } else
            return new Promise((resolve) => resolve(new sqlsrv.Request(pool)));
    }

    private setParemeters(com: any, parameters: Array<Param>, typeparam): any {
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

    protected query(com: any, query: string) {
        return com.query(query);
    }

    protected execute(com: any, query: string) {
        return com.execute(query);
    }

    protected dataSet(records: any) {
        return records.recordsets;
    }

    protected dataTable(records: any) {
        return records.recordset;
    }

    protected first(records: any) {
        if (records.recordset.length > 0)
            return records.recordset[0];
        else return undefined;
    }

    protected value(records: any) {
        let objoutput = undefined;
        const data = records.recordset;
        if (data.length > 0) {
            const propety = Object.keys(data[0])[0]
            objoutput = data[0][propety];
        }
        return objoutput;
    }

    protected void(records: any) {
        return records;
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
