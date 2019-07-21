import { Param } from "../types/param";
import { Observable } from "rxjs";

export interface IConnection {

    initTransaction(): any;
    commit(): Observable<any>;
    rollback(): Observable<any>;
    
    returnFirst(query: string, parametersInput: Array<Param>): Promise<any>;
    returnDataSet(query: string, parametersInput: Array<Param>): Promise<any>;
    returnDataTable(query: string, parametersInput: Array<Param>): Promise<any>;
    returnValue(query: string, parametersInput: Array<Param>): Promise<any>;
    returnDataTableProcedure(query: string, parametersInput: Array<Param>): Promise<any>;
    returnValueProcedure(query: string, parametersInput: Array<Param>): Promise<any>;
    returnOutPutProcedure(query: string, parametersInput: Array<Param>, parametersOutPut: Array<Param>): Promise<any>;
    returnDataTableAndOutPutProcedure(query: string, parametersInput: Array<Param>, parametersOutPut: Array<Param>): Promise<any>;
    executeQuery(query: string, parametersInput: Array<Param>): Promise<any>;
}
