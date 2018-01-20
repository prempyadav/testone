import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { L10nService } from '../../../Services/L10n.service'
import { AccountManagement } from '../../../Services/AccountManagement.service';
import { AppConfig } from '../../../app.config';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Common, validateAllFormFields, mobileValidator, emailCompareValidator, emailValidator, helplineValidator, zipCodeValidator } from '../../../Services/Common.service';
import { CriteriaRequest, Filter, FilterOperator } from "../../../Models/Common/CriteriaRequest";
import { clientCompanyId, coachOperatorSubUserKey } from '../../../Models/Common/Constants'
import { UserDetails } from "../../../Models/Common/UserDetails";
import { ClientUser } from "../../../Models/AccountManagement/ClientUser";
import { User } from "../../../Models/Common/User";
import { ContactDetails } from "../../../Models/AccountManagement/ContactDetails";
import { Observable } from "rxjs/Observable";
import { Role } from "../../../Models/Common/Role";

declare var $: any;

@Component({
    selector: 'user-management',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'usermanagement.component.html',
    styleUrls: [],
    providers: [AccountManagement, UserDetails, L10nService, AppConfig, Common]
})
export class UserManagementComponent implements OnInit {
    @Output() public onSucess = new EventEmitter();
    @Input() public isForReview: boolean = false;
    public accountmanagement: AccountManagement;
    public router: Router;
    public userDetailList: UserDetails[];
    public errorMessage: string = "";
    public userDetail: UserDetails;
    public titleData: any[];
    public roleData: Role[];
    public companyId: string = "";
    public isAddUser: boolean = true;
    frmUserManagement: FormGroup;
    defaultCountry: string = "";
    public emailNotAvialable: boolean = false;
    private _l10Service: L10nService;

    constructor(private _appConfig: AppConfig, public _router: Router, public _common: Common, public _accountmanagement: AccountManagement, private formBuilder: FormBuilder) {
        this.accountmanagement = _accountmanagement;
        this.router = _router;
        this.userDetail = new UserDetails();
        this.userDetailList = new Array<UserDetails>(0);
        this.frmUserManagement = this.formBuilder.group({
            txtFirstName: ['', Validators.compose([Validators.required])],
            txtLastName: ['', Validators.compose([Validators.required])],
            ddlTitle: ['', Validators.compose([Validators.required])],
            txtJobTitle: ['', Validators.compose([Validators.required])],
            txtDepartment: ['', Validators.compose([Validators.required])],
            txtTelephoneNumber: ['', Validators.compose([Validators.required])],
            txtEmergencyMobileNumber: ['', Validators.compose([Validators.required])],
            txtEmail: ['', Validators.compose([Validators.required])],
            txtConfirmEmail: ['', Validators.compose([Validators.required])],
            txtPassword: ['', Validators.compose([Validators.required])],
            txtConfirmPassword: ['', Validators.compose([Validators.required])]
        });
        this.companyId = sessionStorage.getItem(clientCompanyId);
    }


    ngOnInit() {
        this._common.setProcessState(true);
        Observable.forkJoin(
            this.filltitle(),
            this.fillroles()).toPromise().then(() =>
                this.fillgrid());
        this.errorMessage = "";
        this.isAddUser = true;
    }


    DisplayErrorMessage(error: any) {
        this._common.setProcessState(false);
        if (error.errorMessage)
            this.errorMessage = error.errorMessage;
        else if (this.errorMessage)
            this.errorMessage = this.errorMessage;
        else
            this.errorMessage = this._appConfig.genericError;
    }
    getRoleText(id: string): string {
        let role = this.roleData.find(item => item.Id === id);
        return role ? role.DisplayValue : "";
    }
    isSuperUser(id: string): boolean {
        let role = this.roleData.find(item => item.Id === id);
        return role ? role.IsSuperUser : false;
    }
    getClientUser(companyId: string): Observable<any> {
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "ClientCompany";
        filter.RightOperand = companyId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        return this.accountmanagement.getClientUser(criteria);
    }
    getContactDetails(contactDetailsIds: string[]): Observable<any> {
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "Id";
        filter.RightOperand = contactDetailsIds;
        filter.Operator = FilterOperator.IN;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        return this.accountmanagement.getContactDetails(criteria);
    }
    addUserDetails() {
        this._common.setProcessState(true);
        this.userDetail = new UserDetails();
        this.userDetail.UserData.Role = this.roleData.find(item => item.Key === coachOperatorSubUserKey).Id;
        this.userDetail.UserData.IsActive = true;
        this.userDetail.ContactDetailsData.Country = this.defaultCountry;
        this.userDetail.ClientUserData.ClientCompanyId = this.companyId;
        this.isAddUser = true;
        console.log(this.userDetail.UserData.Email);
        this.showadd();
        this._common.setProcessState(false);
    }
    editUserDetails(contactDetailsId: string) {
        this.emailNotAvialable = false;
        this._common.setProcessState(true);
        this.userDetail = this.userDetailList.find(item => item.ClientUserData.ContactDetailId === contactDetailsId);
        this.isAddUser = false;
        this.showadd();
        this._common.setProcessState(false);
    }
    deleteUserDetails(contactDetailsId: string) {
        this._common.setProcessState(true);
        this.userDetail = this.userDetailList.find(item => item.ClientUserData.ContactDetailId === contactDetailsId);
        this.userDetail.UserData.IsActive = false;
        this.setUserDetails();
        this._common.setProcessState(false);
    }
    getUser(userEmails: string[]): Observable<any> {
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "Email";
        filter.RightOperand = userEmails;
        filter.Operator = FilterOperator.IN;
        filter.OperandType = "string";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        return this.accountmanagement.getUser(criteria);
    }
    populateUserDetails(clientUserData: ClientUser[], contactDetailsData: ContactDetails[],
        userData: User[]) {
        userData = userData.filter((item,index,array)=>{return (item.IsActive == true);});
        this.userDetailList = new Array<UserDetails>(userData.length);
        userData.forEach((value, index) => {
            this.userDetailList[index] = new UserDetails();

            value.ConfirmEmail = value.Email;
            value.ConfirmPassword = value.Password;
            this.userDetailList[index].UserData = value;

            let clientUser: ClientUser = clientUserData.find(item => item.Id === value.Id);
            if (!clientUser) {
                clientUser = new ClientUser();
                clientUser.Id = value.Id;
            }
            this.userDetailList[index].ClientUserData = clientUser;

            let contact: ContactDetails = contactDetailsData.find(contact => contact.Id === clientUser.ContactDetailId);
            if (!contact) {
                contact = new ContactDetails();
            }
            this.userDetailList[index].ContactDetailsData = contact;
            if (this.roleData.find(item => item.Id == value.Role && item.IsSuperUser == true)) {
                this.defaultCountry = contact.Country;
                console.log(this.defaultCountry);
            }

        }
        );
        this._common.setProcessState(false);
    }
    fillgrid() {

        let clientUserData: ClientUser[],
            userData: User[],
            contactDetailsData: ContactDetails[];
        this.getClientUser(this.companyId).subscribe(
            (data: any) => {
                clientUserData = (data.Data as ClientUser[]);
                let contactIds: string[] = clientUserData.map(item => item.ContactDetailId);
                userData = new Array<User>(clientUserData.length);
                contactDetailsData = new Array<ContactDetails>(clientUserData.length);
                this.getContactDetails(contactIds).subscribe(
                    (data: any) => {
                        contactDetailsData = (data.Data as ContactDetails[]);
                        let emailIds: string[] = contactDetailsData.map(item => item.Email);
                        this.getUser(emailIds).subscribe(
                            (data: any) => {
                                userData = (data.Data as User[]);

                                this.populateUserDetails(clientUserData, contactDetailsData, userData);
                            },
                            (error: any) => {
                                this.DisplayErrorMessage(error);
                            }
                        );
                    },
                    (error: any) => {
                        this.DisplayErrorMessage(error);
                    });
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );

    }

    filltitle(): Observable<any> {
        let handler = this._common.getTitleList();
        handler.subscribe(
            (data: any) => {
                this.titleData = data.Data;
            },
            (error: any) => {
                console.log(error);
            }
        );
        return handler;
    }
    fillroles(): Observable<any> {
        let handler = this._common.getRole(null);
        handler.subscribe(
            (data: any) => {
                this.roleData = (data.Data as Role[]);
            },
            (error: any) => {
                console.log(error);
            }
        );
        return handler;
    }

    showadd() {
        this.emailNotAvialable = false;
        this.frmUserManagement.setErrors(null);
        $('#add-modal').modal('show');
    }

    hideadd() {
        this.emailNotAvialable = false;
        $('#add-modal').modal('hide');
        this.frmUserManagement.setErrors(null);
    }

    get isValid(): boolean {
        this.errorMessage = "";
       
        var mobileRegx = /^[0-9]*$/i;
        var emailRegex = /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/i;
        if (!mobileRegx.test(this.userDetail.ContactDetailsData.LandlineNumber))
            this.errorMessage += "\n" + this._l10Service.getL10String("Phone Number is not valid");
        if (!mobileRegx.test(this.userDetail.ContactDetailsData.EmergencyMobileNumber))
            this.errorMessage += "\n" + this._l10Service.getL10String("Emergency Mobile Number is not valid");
        if (!emailRegex.test(this.userDetail.UserData.Email))
            this.errorMessage += "\n" + this._l10Service.getL10String("Email is not valid");
       

        if (this.userDetail.UserData.ConfirmEmail !== this.userDetail.UserData.Email)
            this.errorMessage += "\n" + this._l10Service.getL10String("Confirm Email not matched");
        if (this.userDetail.UserData.ConfirmPassword !== this.userDetail.UserData.Password)
            this.errorMessage += "\n" + this._l10Service.getL10String("Confirm Password not matched");
        validateAllFormFields(this.frmUserManagement);
        return (this.errorMessage == "");
    }
    setUserDetails() {
        this._common.setProcessState(true);
        this.errorMessage = "";
        if (!this.isValid) {
            this.DisplayErrorMessage("Please fix below error");
            return;
        }
        this.accountmanagement.setUserDetails(this.userDetail).subscribe(
            (data: any) => {
                this.fillgrid();
                this.hideadd();
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
    }
    saveUser() {
        this.emailNotAvialable = false;
        this._common.setProcessState(true);
        this.errorMessage = "";
        if (!this.isValid) {
            this.DisplayErrorMessage("Please fix below error");
            return;
        }
        this.setUserDetails();
    }
    doesEmailExists() {
        console.log("does emailexists");
        this.accountmanagement.doesEmailExists(this.userDetail.UserData.Email, this.userDetail.UserData.Id).subscribe(
            (data: any) => {
                this.emailNotAvialable = data;
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
    }
    setUser() {
        this.frmUserManagement.reset();
        this.onSucess.emit('payment_details');
    }

    getElement(event: any, from: string) {
        let isClassPresent = event.srcElement.offsetParent.className;
        if (isClassPresent.indexOf("focused") == -1 && from == "focus") {
            event.srcElement.offsetParent.className += " focused";
        } else if (from == "blur" && (event.target.value == "" || event.target.value == "select")) {
            event.srcElement.offsetParent.classList.remove("focused");
        };
    }
}
