import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, Operator } from 'rxjs/Rx';
import 'rxjs/Rx';
import { AppConfig } from '../app.config';
import { FormControl, AbstractControl } from '@angular/forms';

import { User } from '../Models/Common/User'


@Injectable()
export class Security {
    private baseUrl: string;
    private header = new Headers({ 'Content-Type': 'application/json' });
    private req = new RequestOptions({ headers: this.header });
    constructor(private _http: Http, private _appconfig: AppConfig) {
        this.baseUrl = _appconfig.apiUrl;
    }
    getRedirectionURL(loggedInUserEmailId: string) {
        return this._http.post(this.baseUrl + "Common/Security/GetRedirectUrlAfterLoggedIn", loggedInUserEmailId, this.req)
            .map((res: Response) => res.json());
    }
    logIn(email: string, password: string) {
        let user = new User();
        user.Email = email;
        user.Password = password;
        return this._http.post(this.baseUrl + "Common/Security/LogIn", user, this.req)
            .map((res: Response) => res.json());
    }
}