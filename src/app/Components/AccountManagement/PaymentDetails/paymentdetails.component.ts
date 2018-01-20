import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AccountManagement } from '../../../Services/AccountManagement.service';
import { AppConfig } from '../../../app.config'

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Common, validateAllFormFields, mobileValidator, emailCompareValidator, emailValidator, helplineValidator, zipCodeValidator } from '../../../Services/Common.service';
import { Observable } from "rxjs/Observable";
import { clientCompanyId, clientCurrencyCode, clientCurrencyName } from "../../../Models/Common/Constants";
import { CriteriaRequest, Filter, FilterOperator } from "../../../Models/Common/CriteriaRequest";
import { PaymentSettings } from '../../../Models/AccountManagement/PaymentSettings';

@Component({
    selector: 'payment-details',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'paymentdetails.component.html',
    providers: [AccountManagement, Common,AppConfig]
})

export class PaymentDetailsComponent implements OnInit {
    @Output() public onSucess = new EventEmitter();
    @Input() public isForReview: boolean = false;
    public accountmanagement: AccountManagement;
    public router: Router;
    public paymentSettings: PaymentSettings;
    public errorMessage: string = "";
    public countryData: any[];
    public countryId: string;
    public provinceCode: string;
    public stateData: any[];
    public cityData: any[];
    public companyId: string;
    public PageDivs: any[];
    public currencyName:string = "";
    public currencyCode:string = "";
    frmPaymentdetails: FormGroup;
    constructor(private _appConfig: AppConfig
        , private _accountmanagement: AccountManagement
        , public _router: Router
        , private _common: Common
        , private formBuilder: FormBuilder) {
        this.PageDivs = [true];
        this.accountmanagement = _accountmanagement;
        this.paymentSettings = new PaymentSettings();
        this.router = _router;
        this.frmPaymentdetails = this.formBuilder.group({
            txtBeneficiaryName: ['', Validators.compose([Validators.required])],
            txtBankName: ['', Validators.compose([Validators.required])],
            txtBankBranchAddress1: ['', Validators.compose([Validators.required])],
            txtBankBranchAddress2: [''],
            ddlCountry: ['', Validators.compose([Validators.required])],
            ddlProvince: ['', Validators.compose([Validators.required])],
            ddlCity: ['', Validators.compose([Validators.required])],
            txtZipCode: ['', Validators.compose([Validators.required])],
            txtAccountNo: ['', Validators.compose([Validators.required])],
            txtBranchShortCode: ['', Validators.compose([Validators.required])],
            txtSwift: [''],
            txtIBANNo: [''],
            txtRoutingNumber: [''],
            txtIntermediateBank: [''],
            txtOtherInfo: ['']
        });

    }

    ngOnInit() {
        this.currencyCode = sessionStorage.getItem(clientCurrencyCode);
        this.currencyName = sessionStorage.getItem(clientCurrencyName);
        this._common.setProcessState(true);
        this.companyId = sessionStorage.getItem(clientCompanyId);
        this.paymentSettings.ClientCompany = this.companyId;
        this.errorMessage = "";
        this.fillMasterData().subscribe(
            () => {
                this.getPaymentDetails(this.companyId);
            }
        );
    }
    getPaymentDetails(clientCompanyId: string) {
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "ClientCompany";
        filter.RightOperand = clientCompanyId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        this.accountmanagement.getPaymentSettings(criteria).subscribe(
            (data: any) => {
                if (data.Data.length > 0) {
                    let paymentData: PaymentSettings = (data.Data[0] as PaymentSettings);
                    this.paymentSettings = paymentData;
                    let countryData = this.countryData.find(item => item.Id === paymentData.BranchCountry);
                    if (countryData) {
                        this.countryId = countryData.Id;
                    }
                    this.provinceCode = paymentData.BranchProvince;
                    this.fillprovinces(this.countryId).toPromise().then(() => {
                        this.fillcities(this.countryId, this.provinceCode).toPromise().then(() => {
                            this.paymentSettings = paymentData;
                            this._common.setProcessState(false);
                        }).catch((reason: any) => {
                            this.DisplayErrorMessage(reason);
                        });
                    }).catch((reason: any) => {
                        this.DisplayErrorMessage(reason);
                    });
                }else{
                    this._common.setProcessState(false);
                }
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
    }
    showhide(divid: number) {

        this.PageDivs[divid] = !this.PageDivs[divid]
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

    fillMasterData(): Observable<any> {
        return Observable.forkJoin(
            this.fillcountries());
    }

    onCountrySelect(countryId: string) {
        this.fillprovinces(countryId);
    }

    onProvinceSelect(provinceId: string) {
        this.fillcities(this.countryId, provinceId);
    }

    fillprovinces(countryId: string): Observable<any> {
        var row = this.countryData.filter(x => x.Id === countryId);
        this.countryId = countryId;
        this._common.setProcessState(true);
        if (row.length > 0) {
            let handler = this._common.getStateList(row[0].IsoCode);
            handler.subscribe(
                (data: any) => {
                    this.stateData = data.Data;
                    this._common.setProcessState(false);
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
        this._common.setProcessState(true);
        if (row.length > 0) {
            let handler = this._common.getCityList(row[0].IsoCode, provinceCode);
            handler.subscribe(
                (data: any) => {
                    this.cityData = data.Data;
                    this._common.setProcessState(false);
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

    DisplayErrorMessage(error: any) {
        this._common.setProcessState(false);
        if (error.errorMessage)
            this.errorMessage = error.errorMessage;
        else
            this.errorMessage = this._appConfig.genericError;
    }

    setPaymentInformation() {
        this._common.setProcessState(true);
        if (!this.frmPaymentdetails.valid) {
            validateAllFormFields(this.frmPaymentdetails);
            this.DisplayErrorMessage(this._appConfig.genericValidationError);
            return;
        }
        this.accountmanagement.setPaymentSettings(this.paymentSettings).subscribe(
            (data: any) => {
                this.frmPaymentdetails.reset();
                this.onSucess.emit('notification_settings');
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
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
