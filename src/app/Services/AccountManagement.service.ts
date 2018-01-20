import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { AppConfig } from "../app.config";
import { CompanyDetails } from "../Models/AccountManagement/CompanyDetails";
import { ClientCompany } from "../Models/AccountManagement/ClientCompany";
import { CoachOperator } from "../Models/AccountManagement/CoachOperator";
import { CoachOperatorRegistration } from "../Models/AccountManagement/CoachOperatorRegistration";
import { ContactDetails } from "../Models/AccountManagement/ContactDetails";
import { OperatorMembership } from "../Models/AccountManagement/OperatorMembership";

import { NotificationsSettings } from "../Models/AccountManagement/NotificationsSettings";
import { CriteriaRequest, Filter, FilterOperator } from "../Models/Common/CriteriaRequest";
import { FormControl } from "@angular/forms";
import { UserDetails } from "../Models/Common/UserDetails";
import { ClientUser } from "../Models/AccountManagement/ClientUser";
import { CompanyDocument } from "../Models/AccountManagement/CompanyDocument";
import { PaymentSettings } from "../Models/AccountManagement/PaymentSettings";


@Injectable()
export class AccountManagement {

    private baseUrl: string;
    private header = new Headers({ 'Content-Type': 'application/json' });
    private req = new RequestOptions({ headers: this.header });
    
    constructor(private _http: Http, private _appconfig: AppConfig) {
        this.baseUrl = _appconfig.apiUrl;
    }
    getClientCompany(criteria:CriteriaRequest) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/GetClientCompany", criteria, this.req)
            .map((res: Response) => res.json());
    }
    setClientCompany(clientCompany: ClientCompany) {

        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetClientCompany", clientCompany, this.req)
            .map((res: Response) => res.json());

    }
    setCompanyDetails(companyDetails: CompanyDetails) {

        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetCompanyDetails", companyDetails, this.req)
            .map((res: Response) => res.json());

    }
    getContactDetails(criteria: CriteriaRequest) {


        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/GetContactDetails", criteria, this.req)
            .map((res: Response) => res.json());
    }
    setContactDetails(contactDetails:ContactDetails ) {

        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetContactDetails", contactDetails, this.req)
            .map((res: Response) => res.json());
    }
    getClientUser(criteria: CriteriaRequest) {

        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/GetClientUser", criteria, this.req)
            .map((res: Response) => res.json());

    }
    getUser(criteria: CriteriaRequest) {

        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/GetUser", criteria, this.req)
            .map((res: Response) => res.json());

    }

    getCompanyDocument(criteria: CriteriaRequest){
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/GetCompanyDocument", criteria, this.req)
        .map((res: Response) => res.json());
    }
    setCompanyDocument(companydocument:CompanyDocument) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetCompanyDocument", companydocument, this.req)
        .map((res: Response) => res.json());
    }

    setUserDetails(userDetails: UserDetails) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetUserDetails", userDetails, this.req)
            .map((res: Response) => res.json());

    }

    setClientUser(clientUser: ClientUser) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetClientUser", clientUser, this.req)
            .map((res: Response) => res.json());

    }
    setOperatorMembership(operatorMembership: OperatorMembership) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetOperatorMembership", operatorMembership, this.req)
            .map((res: Response) => res.json());

    }
    getOperatorMembership(criteria: CriteriaRequest) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/GetOperatorMembership", criteria, this.req)
            .map((res: Response) => res.json());

    }
    getCoachOperator(criteria: CriteriaRequest) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/GetCoachOperator", criteria, this.req)
            .map((res: Response) => res.json());

    }
    getCoachOperatorRegistration(criteria: CriteriaRequest) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/getCoachRegistration", criteria, this.req)
            .map((res: Response) => res.json());
    }
    setCoachRegistration(coachOperatorRegistration: CoachOperatorRegistration) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetCoachRegistration", coachOperatorRegistration, this.req)
            .map((res: Response) => res.json());

    }
    
    setNotificationSettings(notificationSettings: NotificationsSettings[]) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetNotificationSettings", notificationSettings, this.req)
            .map((res: Response) => res.json());

    }
    getNotificationSettings(criteria: CriteriaRequest) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/GetNotificationSettings", criteria, this.req)
            .map((res: Response) => res.json());
    }

    setPaymentSettings(paymentSetting: PaymentSettings) {

        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/SetPaymentSettings", paymentSetting, this.req)
            .map((res: Response) => res.json());

    }
    getPaymentSettings(criteria:CriteriaRequest) {
        return this._http.post(this.baseUrl + "AccountManagement/AMProcess/GetPaymentSettings", criteria, this.req)
            .map((res: Response) => res.json());
    }
    doesEmailExists(emailAddress: string,userId:string) {
        let reqLocal = new RequestOptions({ headers: new Headers(), params:{emailAddress:emailAddress,userId:userId} });
        return this._http.post(this.baseUrl + "Common/AMProcess/DoesEmailExists", null, reqLocal)
            .map((res: Response) => res.json());
    }

}
