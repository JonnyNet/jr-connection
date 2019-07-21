import * as sqlsrv from "mssql";
import { from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Param } from '../types/param';
import { IConnection } from '../core/iconnection.interface';

export class SqlServer implements IConnection {

    private transaction: any;
    private istransaction: boolean = false;
    private _config;
    public squema: string;

    constructor() {

    }

    get config() {
        return this._config;
    }

    set config(config: any) {
        this._config = config;
        this.squema = config.squema;
    }

    public initTransaction() {
        this.istransaction = true;
    }

    public commit() {
        this.istransaction = false;
        return from(this.transaction.commit())
    }

    public rollback() {
        this.istransaction = false;
        return from(this.transaction.rollback())
    }

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

    private connectionStart(): Observable<any> {
        let connection = new sqlsrv.ConnectionPool(this._config);
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

    private executeQuerys(query: string, parametersInput: Array<Param>, parametersOutPut: Array<Param>, typeExecute: any, typeData: any): Promise<any> {
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

    private input(com: any, item: Param) {
        if (item.type != null)
            com.input(item.name, item.type, item.value);
        else
            com.input(item.name, item.value);

        return com;
    }

    private output(com: any, item: Param) {
        if (item.type != null)
            com.output(item.name, item.type, item.value);
        else
            com.output(item.name, item.value);
        return com;
    }

    private query(com: any, query: string) {
        return com.query(query);
    }

    private execute(com: any, query: string) {
        return com.execute(query);
    }

    private dataSet(records: any) {
        return records.recordsets;
    }

    private dataTable(records: any) {
        return records.recordset;
    }

    private first(records: any) {
        if (records.recordset.length > 0)
            return records.recordset[0];
        else return undefined;
    }

    private value(records: any) {
        let objoutput = undefined;
        const data = records.recordset;
        if (data.length > 0) {
            const propety = Object.keys(data[0])[0]
            objoutput = data[0][propety];
        }
        return objoutput;
    }

    private void(records: any) {
        return records;
    }

    private dataOutPut(records: any) {
        return records.output;
    }

    private dataTableAndOutPut(records: any) {
        return {
            recordset: records.recordset,
            output: records.output
        };
    }
}
