import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, Operator } from 'rxjs/Rx';
import { AppConfig } from '../app.config';
import 'rxjs/Rx';
import { CriteriaRequest, Filter, FilterOperator } from '../Models/Common/CriteriaRequest';
import { FormControl, AbstractControl, FormGroup } from '@angular/forms';

declare var $: any;
@Injectable()
export class Common {

    private baseUrl: string;
    private header = new Headers({ 'Content-Type': 'application/json' });
    private req = new RequestOptions({ headers: this.header });
    constructor(private _http: Http, private _appconfig: AppConfig) {
        this.baseUrl = _appconfig.apiUrl;
    }
    setProcessState(isWorking:boolean){
        if(isWorking == true){
            $(".pageLoader").show();
        }else{
            $(".pageLoader").hide();
        }
    }
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    getCountryList() {
        return this._http.post(this.baseUrl + "Common/Masters/GetCountryList", "", this.req)
            .map((res: Response) => res.json());
    }

    getCurrencyList() {
        return this._http.post(this.baseUrl + "Common/Masters/GetCurrencyList", "", this.req)
            .map((res: Response) => res.json());
    }
    getCompanyDocumentType(criteria:CriteriaRequest){
        return this._http.post(this.baseUrl + "Common/Masters/GetCompanyDocumentType", criteria, this.req)
        .map((res: Response) => res.json());
    }
    getStateList(IsoCode: string) {
        let criteria: CriteriaRequest = new CriteriaRequest();
        var filter = new Filter();
        filter.LeftOperand = "country";
        filter.RightOperand = IsoCode;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "string";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);

        return this._http.post(this.baseUrl + "Common/Masters/GetProvincesList", criteria, this.req)
            .map((res: Response) => res.json());

    }

    getCompanyCategoryList() {
        let criteria: CriteriaRequest = new CriteriaRequest();
        var filter = new Filter();
        filter.LeftOperand = "ListType";
        filter.RightOperand = "CompanyCategory";
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "string";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);

        return this._http.post(this.baseUrl + "Common/Masters/GetPickList", criteria, this.req)
            .map((res: Response) => res.json());

    }

    getNotificationSettingsList() {
        let criteria: CriteriaRequest = new CriteriaRequest();
        var filter = new Filter();
        filter.LeftOperand = "ListType";
        filter.RightOperand = "NotificationSettings";
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "string";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);

        return this._http.post(this.baseUrl + "Common/Masters/GetPickList", criteria, this.req)
            .map((res: Response) => res.json());
    }
    getTitleList() {
        let criteria: CriteriaRequest = new CriteriaRequest();
        var filter = new Filter();
        filter.LeftOperand = "ListType";
        filter.RightOperand = "Title";
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "string";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);

        return this._http.post(this.baseUrl + "Common/Masters/GetPickList", criteria, this.req)
            .map((res: Response) => res.json());

    }

    getAboutHearList() {
        let criteria: CriteriaRequest = new CriteriaRequest();
        var filter = new Filter();
        filter.LeftOperand = "ListType";
        filter.RightOperand = "AboutUS";
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "string";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);

        return this._http.post(this.baseUrl + "Common/Masters/GetPickList", criteria, this.req)
            .map((res: Response) => res.json());

    }

    getDistanceUnitList() {
        let criteria: CriteriaRequest = new CriteriaRequest();
        var filter = new Filter();
        filter.LeftOperand = "ListType";
        filter.RightOperand = "DistanceUnit";
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "string";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);

        return this._http.post(this.baseUrl + "Common/Masters/GetPickList", criteria, this.req)
            .map((res: Response) => res.json());

    }
    getRole(criteria:CriteriaRequest) {
        return this._http.post(this.baseUrl + "Common/Masters/GetRole", criteria, this.req)
            .map((res: Response) => res.json());
    }

    getCityList(IsoCode: string, Province: string) {
        let criteria: CriteriaRequest = new CriteriaRequest();
        var filter1 = new Filter();
        filter1.LeftOperand = "country";
        filter1.RightOperand = IsoCode;
        filter1.Operator = FilterOperator.EQUALSTO;
        filter1.OperandType = "string";

        var filter2 = new Filter();
        filter2.LeftOperand = "region";
        filter2.RightOperand = Province;
        filter2.Operator = FilterOperator.EQUALSTO;
        filter2.OperandType = "string";

        criteria.OperatorBetweenFilters = 5;
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter1);
        criteria.FilterCriteria.push(filter2);

        return this._http.post(this.baseUrl + "Common/Masters/GetCityList", criteria, this.req)
            .map((res: Response) => res.json());

    }


}

export function validateAllFormFields(formGroup: FormGroup) {       
    Object.keys(formGroup.controls).forEach(field => {  
        const control = formGroup.get(field);           
        if (control instanceof FormControl) {           
            control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {      
            this.validateAllFormFields(control);
        }
    });
}
export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    } else {
        return { invalidEmail: false };
    }
}


export function emailCompareValidator(control1: FormControl, control2: FormControl): { [key: string]: any } {

    if (control1.value && !control2.value) {
        return { unmatchedEmail: true };
    } else {
        return { unmatchedEmail: false };
    }

}

export function helplineValidator(control: FormControl): { [key: string]: any } {
    var mobileRegx = /^[0-9]*$/i;
    if (control.value && !mobileRegx.test(control.value)) {
        return { invalidHelplineNumber: true };
    } else {
        return { invalidHelplineNumber: false };
    }
}

export function mobileValidator(control: FormControl): { [key: string]: any } {
    var mobileRegx = /^[0-9]*$/i;
    if (control.value && !mobileRegx.test(control.value)) {
        return { invalidMobileNumber: true };
    } else {
        return { invalidMobileNumber: false };
    }
}

export function zipCodeValidator(control: FormControl): { [key: string]: any } {
    var zipCodeRegexp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (control.value && !zipCodeRegexp.test(control.value)) {
        return { invalidzipCode: true };
    } else {
        return { invalidzipCode: false };
    }
}


//export class MatchTwoFieldsValidation {

//    static MatchTwoFields(ctrl1Name: string, ctrl2Name: string, AC: AbstractControl) {
//        let password = AC.get(ctrl1Name).value; // to get value in input tag
//        let confirmPassword = AC.get(ctrl2Name).value; // to get value in input tag
//        if (password != confirmPassword) {
//            console.log('false');
//            AC.get(ctrl2Name).setErrors({ MatchTwoFields: true })
//        } else {
//            console.log('true');
//            return null
//        }
//    }
//}

