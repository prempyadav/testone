import { Injectable } from '@angular/core'
import { Http, Headers, Response, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Rx'
import { AppConfig } from '../app.config'

@Injectable()
export class L10nService {
    private baseURL: string;
    private requestOption: RequestOptions;
    constructor(private _http: Http, private _appConfig: AppConfig) {
        this.baseURL = _appConfig.apiUrl;
        this.requestOption = new RequestOptions({
            headers: new Headers({ 'Content-Type': 'applicaiton/json' })
        });
    }
    Locale: string = "en-US"; //set this value to change langugae for whole application
    getL10String(inputString:string,language?:string)
    {
        //if asked for specific language then get for that otherwise get as per Locale value
        //below code will get string from cache and or from server side
        return inputString;
    }
}