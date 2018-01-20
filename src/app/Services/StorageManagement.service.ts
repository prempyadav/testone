import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, Operator } from 'rxjs/Rx';
import { AppConfig } from '../app.config';
import 'rxjs/Rx';
import { KeyValue } from '../Models/Common/KeyValue';

@Injectable()
export class StorageManagement {

    private baseUrl: string;
    private header = new Headers({ 'Content-Type': 'application/json' });
    private req = new RequestOptions({ headers: this.header });
    constructor(private _http: Http, private _appconfig: AppConfig) {
        this.baseUrl = _appconfig.apiUrl;
    }
    addFile(files:FormData,directoryPath:string) {
        console.log(files);
        console.log(directoryPath);
        let reqLocal = new RequestOptions({ headers: new Headers(), params:{directoryPath:directoryPath} });
        return this._http.post(this.baseUrl + "Common/StorageManagement/UploadFilesAsync", files, reqLocal)
            .map((res: Response) => res.json());
    }
    deleteFile(filePath:string) {
        return this._http.post(this.baseUrl + "Common/StorageManagement/DeleteFileAsync", filePath, this.req)
            .map((res: Response) => res.json());
    }
    moveFiles(fileData:KeyValue[]) {
        return this._http.post(this.baseUrl + "Common/StorageManagement/MoveFilesAsync", fileData, this.req)
            .map((res: Response) => res.json());
    }
    getFileURL(filePath:string){
        let reqLocal = new RequestOptions({ headers: new Headers(), params:{filePath:filePath} });
        return this._http.get(this.baseUrl + "Common/StorageManagement/GetFileUrlAsync", reqLocal)
            .map((res: Response) => res.json());
    }
}