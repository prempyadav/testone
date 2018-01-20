import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyDetails } from '../../../Models/AccountManagement/CompanyDetails';
import { AccountManagement } from '../../../Services/AccountManagement.service';
import { L10nService } from '../../../Services/L10n.service'
import { AppConfig } from '../../../app.config';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Country } from '../../../Models/Common/Country';
import { Common, validateAllFormFields, mobileValidator, emailCompareValidator, emailValidator, helplineValidator, zipCodeValidator } from '../../../Services/Common.service';
import { State } from '../../../Models/Common/States'
import { L10nPipe } from './../../../Pipes/L10n.pipe'
import { Filter, CriteriaRequest, FilterOperator } from "../../../Models/Common/CriteriaRequest";
import { companyTypeId, clientCompanyId, companyContactId, loggedInEmail, emptyGuid, companyDateSubmitted, companyDateApproved, companyDateSuspended, clientCurrencyCode, clientCurrencyName } from '../../../Models/Common/Constants'
import { ContactDetails } from "../../../Models/AccountManagement/ContactDetails";
import { ClientCompany } from "../../../Models/AccountManagement/ClientCompany";
import { OperatorMembership } from "../../../Models/AccountManagement/OperatorMembership";
import { CoachOperator } from "../../../Models/AccountManagement/CoachOperator";
import { Observable } from "rxjs/Observable";
import { ClientUser } from "../../../Models/AccountManagement/ClientUser";
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
    selector: 'company-details',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'companydetails.component.html',
    styleUrls: [],
    providers: [AccountManagement, CompanyDetails, L10nService, AppConfig, Country, Common]
})

export class CompanyDetailsComponent implements OnInit {
    public companyId: string;
    public adminContactId: string;
    public adminEmailId: string;
    public router: Router;
    public companydetails: CompanyDetails;
    public errorMessage: string = "";
    public genericError: string = "";
    public countryData: any[];
    public companyCategoryData: any[];
    public allStateData = new Array();
    public stateData: any[];
    public cityData: any[];
    public aboutUS: any[];
    public distanceUnit: any[];
    public currencydata: any[];
    public titleData: any[];
    public countryId: string;
    public provinceCode: string;
    public cityCode: string;
    public PageDivs: any[];
    frmCompanyDetails: FormGroup;
    @Input() public isForReview: boolean = false;
    @Output() public onSucess = new EventEmitter();
    constructor(private l10Pipe: L10nPipe
        , private _appConfig: AppConfig
        , private _router: Router
        , private _accountmanagement: AccountManagement
        , private _common: Common
        , private _l10Service:L10nService
        , private formBuilder: FormBuilder) {
        this.genericError = _appConfig.genericError;
        this.companydetails = new CompanyDetails();
        this.router = _router;
        this._accountmanagement = _accountmanagement;
        this.frmCompanyDetails = this.formBuilder.group({
            txtCompanyName: [''],
            txtLegalCompanyName: [''],
            ddlCompanyCategory: [''],
            ddlCountry: [''],
            ddlProvince: [''],
            ddlCity: [''],
            txtAddressLine1: [''],
            txtAddressLine2: [''],
            txtPostCode: [''],
            txtPhoneNumber: [''], //, Validators.compose([Validators.required, mobileValidator])
            txtEMobileNumber: [''],//, Validators.compose([mobileValidator])
            txtConfirmEMobileNumber: [''],//, Validators.compose([mobileValidator])
            txtHelplineNumber: [''],//, Validators.compose([helplineValidator])
            txtFaxNumber: [''],
            txtWebsite: [''],
            txtFirstName: [''],
            txtLastName: [''],
            ddlTitle: [''],
            txtJobTitle: [''],
            txtEmail: [''],//, Validators.compose([Validators.required, emailValidator])
            txtConfirmEmail: [''],//, Validators.compose([Validators.required, emailValidator])
            txtMobileNumber: [''], //, Validators.compose([Validators.required, mobileValidator])
            ddlPreferredDistanceUnit: [''],
            txtRegistrationNumber: [''],
            txtTaxNumber: [''],
            ddlAboutUS: [''],
            ddlCurrency: ['']

        });
        this.PageDivs = [true, true, true, true];
        this.companyId = sessionStorage.getItem(clientCompanyId);
        this.adminContactId = sessionStorage.getItem(companyContactId);
        this.adminEmailId = sessionStorage.getItem(loggedInEmail);
    }

    ngOnInit() {
        this._common.setProcessState(true);
        this.fillMasterData().subscribe(
            () => {
                this.fillCompanyDetails().subscribe(()=>{
                    this._common.setProcessState(false);
                });
            }
        );
    }

    fillMasterData(): Observable<any> {
        return Observable.forkJoin(
            this.fillcountries(),
            this.fillcompanyCategory(),
            this.fillaboutUS(),
            this.filldistanceUnit(),
            this.fillTitle(),
            this.fillcurrency());
    }

    onCountrySelect(countryId: string) {
        this.fillprovinces(countryId);
    }

    onProvinceSelect(provinceId: string) {
        this.fillcities(this.countryId, provinceId);
    }

    showhide(divid: number) {
        this.PageDivs[divid] = !this.PageDivs[divid];
    }

    fillprovinces(countryId: string): Observable<any> {
        var row = this.countryData.filter(x => x.Id === countryId);
        this.countryId = countryId;
        if (row.length > 0) {
            let handler = this._common.getStateList(row[0].IsoCode);
            handler.subscribe(
                (data: any) => {
                    this.stateData = data.Data;
                },
                (error: any) => {
                   this.DisplayErrorMessage(error);
                }
            );
            return handler;
        } else {
            return new Observable();
        }
    }

    fillcities(countryId: string, provinceCode: string): Observable<any> {
        var row = this.countryData.filter(x => x.Id === countryId);
        this.countryId = countryId;
        this.provinceCode = provinceCode;
        if (row.length > 0) {
            let handler = this._common.getCityList(row[0].IsoCode, provinceCode);
            handler.subscribe(
                (data: any) => {
                    this.cityData = data.Data;
                },
                (error: any) => {
                    this.DisplayErrorMessage(error);
                }
            );
            return handler;
        } else {
            return new Observable();
        }
    }

    fillcurrency(): Observable<any> {
        let handler = this._common.getCurrencyList();

        handler.subscribe(
            (data: any) => {
                this.currencydata = data.Data;
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    fillTitle(): Observable<any> {
        let handler = this._common.getTitleList();

        handler.subscribe(
            (data: any) => {
                this.titleData = data.Data;
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    fillcountries(): Observable<any> {
        let handler = this._common.getCountryList();
        handler.subscribe(
            (data: any) => {
                this.countryData = data.Data;
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    fillcompanyCategory(): Observable<any> {
        let handler = this._common.getCompanyCategoryList();
        handler.subscribe(
            (data: any) => {
                this.companyCategoryData = data.Data;
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    filldistanceUnit(): Observable<any> {
        let handler = this._common.getDistanceUnitList();
        handler.subscribe(
            (data: any) => {
                this.distanceUnit = data.Data;
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    fillaboutUS(): Observable<any> {
        let handler = this._common.getAboutHearList();
        handler.subscribe(
            (data: any) => {
                this.aboutUS = data.Data;
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    fillCompanyDetails():Observable<any> {
        return forkJoin(
        this.getClientCompany(this.companyId),
        this.getContactDetail(this.adminContactId),
        this.getAdminUser(this.adminContactId),
        this.getOperatorMembership(this.companyId),
        this.getCoachOperator(this.companyId)
        );
    }

    getContactDetail(contactId: string):Observable<any> {
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "Id";
        filter.RightOperand = contactId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        let handler = this._accountmanagement.getContactDetails(criteria);
        handler.subscribe(
            (data: any) => {
                if (data.Data.length > 0) {
                    let contactData: ContactDetails = (data.Data[0] as ContactDetails);
                    this.countryId = contactData.Country;
                    this.provinceCode = contactData.Province;
                    this.cityCode = contactData.City;
                    this.fillprovinces(this.countryId).toPromise().then(() => {
                        this.fillcities(this.countryId, this.provinceCode).toPromise().then(() => {
                            this.companydetails.ContactDetails = contactData;
                        }).catch((reason: any) => {
                            this.DisplayErrorMessage(reason);
                        });
                    }).catch((reason: any) => {
                        this.DisplayErrorMessage(reason);
                    });
                }
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }
    getClientCompany(clientCompanyId: string):Observable<any> {
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "Id";
        filter.RightOperand = clientCompanyId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        let handler = this._accountmanagement.getClientCompany(criteria);
        handler.subscribe(
            (data: any) => {
                if (data!.Data.length > 0) {
                    this.companydetails.ClientCompany = (data.Data[0] as ClientCompany);
                }
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    getOperatorMembership(clientCompanyId: string) {
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "ClientCompany";
        filter.RightOperand = clientCompanyId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        let handler = this._accountmanagement.getOperatorMembership(criteria);
        handler.subscribe(
            (data: any) => {
                if (data.Data.length > 0) {
                    this.companydetails.Membership = (data.Data as OperatorMembership[]);
                }else{
                    this.companydetails.Membership = new Array<OperatorMembership>();
                    this.addMembership();
                }
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    getAdminUser(contactDetails: string):Observable<any> {

        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "ContactDetails";
        filter.RightOperand = contactDetails;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        let handler = this._accountmanagement.getClientUser(criteria);
        handler.subscribe(
            (data: any) => {
                if (data.Data.length > 0) {
                    this.companydetails.AdminUser = (data.Data[0] as ClientUser);
                }
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    getCoachOperator(clientCompanyId: string):Observable<any> {
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "Id";
        filter.RightOperand = clientCompanyId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        let handler = this._accountmanagement.getCoachOperator(criteria);
        handler.subscribe(
            (data: any) => {
                if (data.Data.length > 0) {
                    this.companydetails.CoachOperator = (data.Data[0] as CoachOperator);
                }
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }

    get isValid(): boolean {
        this.errorMessage = "";
        
        var mobileRegx = /^[0-9]*$/i;
        if (!mobileRegx.test(this.companydetails.ContactDetails.EmergencyMobileNumber))
            this.errorMessage += "\n" + this._l10Service.getL10String("Emergency Mobile Number is not valid");
        if (!mobileRegx.test(this.companydetails.ContactDetails.MobileNumber))
            this.errorMessage += "\n" + this._l10Service.getL10String("Mobile Number is not valid");
        if (!mobileRegx.test(this.companydetails.ContactDetails.LandlineNumber))
            this.errorMessage += "\n" + this._l10Service.getL10String("Phone Number is not valid");
        if (!mobileRegx.test(this.companydetails.ContactDetails.HelplineNumber))
            this.errorMessage += "\n" + this._l10Service.getL10String("Helpline Number is not valid");

        if (this.companydetails.ContactDetails.EmergencyMobileNumber !== this.companydetails.ContactDetails.ConfirmEmergencyMobileNumber)
            this.errorMessage += "\n" + this._l10Service.getL10String("Emergency Mobile Number not matched");
        validateAllFormFields(this.frmCompanyDetails); 
        return (this.errorMessage == "");
    }
    setCompanyDetails() {
        this._common.setProcessState(true);
        this.errorMessage = "";
        if (!this.isValid) {
            this.DisplayErrorMessage("Please fix below error");
            return;
        }
        this._accountmanagement.setCompanyDetails(this.companydetails).subscribe(
            (data: any) => {
                sessionStorage.setItem(companyTypeId,this.companydetails.ClientCompany.CompanyCategory);
                sessionStorage.setItem(companyDateSubmitted,this.companydetails.ClientCompany.DateSubmitted?this.companydetails.ClientCompany.DateSubmitted.toString():null);
                sessionStorage.setItem(companyDateApproved,this.companydetails.ClientCompany.DateApproved?this.companydetails.ClientCompany.DateApproved.toString():null);
                sessionStorage.setItem(companyDateSuspended,this.companydetails.ClientCompany.DateSuspended?this.companydetails.ClientCompany.DateSuspended.toString():null);
                sessionStorage.setItem(clientCurrencyCode,this.currencydata.find(item=>item.Id==this.companydetails.CoachOperator.Currency).Code);
                sessionStorage.setItem(clientCurrencyName,this.currencydata.find(item=>item.Id==this.companydetails.CoachOperator.Currency).Name);
                this.onSucess.emit('company_documents');
                this.frmCompanyDetails.reset();
                return true;
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
                return false;
            }
        );
    }

    DisplayErrorMessage(error: any) {
        this._common.setProcessState(false);
        if (error.errorMessage) {
            this.errorMessage = error.errorMessage;
        }
        else if (this.errorMessage)
        { }
        else {
            this.errorMessage = this.genericError;
        }
    }

    addMembership() {
        this.companydetails.Membership.push(new OperatorMembership());
    }

    deleteMembership(idx: number) {
        this.companydetails.Membership.splice(idx, 1);
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
