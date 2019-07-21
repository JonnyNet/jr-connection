import { Injectable } from '@nestjs/common';

@Injectable()
export class BuildSqlService {


    public buildInsert(obj: any, table: string) {
        obj = this.deletePropetyUndefined(obj);
        let sql = `insert into [].[${table}] ([`;
        const keys = Object.keys(obj);
        sql += keys.join('],[');
        sql += "]) values (@";
        sql += keys.join(',@');
        sql += "); select SCOPE_IDENTITY();";
        return {
            sql: sql,
            paramns: keys.map(x => {
                return {
                    name: x,
                    value: obj[x]
                }
            })
        }
    }

    private deletePropetyUndefined(obj: any) {
        const keys = Object.keys(obj);
        keys.forEach(x => {
            if (obj[x] === '' || obj[x] == null || obj[x] == undefined) {
                delete obj[x];
            }

        });
        return obj;
    }
}
