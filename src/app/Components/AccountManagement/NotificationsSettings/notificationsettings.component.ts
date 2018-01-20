import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsSettings } from '../../../Models/AccountManagement/NotificationsSettings';
import { AccountManagement } from '../../../Services/AccountManagement.service';
import { AppConfig } from './../../../app.config'

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Common, validateAllFormFields } from '../../../Services/Common.service';
import { PickList } from "../../../Models/Common/PickList";
import { Observable } from "rxjs/Observable";
import { CriteriaRequest, Filter, FilterOperator } from "../../../Models/Common/CriteriaRequest";
import { User } from "../../../Models/Common/User";
import { ClientUser } from "../../../Models/AccountManagement/ClientUser";
import { ContactDetails } from "../../../Models/AccountManagement/ContactDetails";
import { clientCompanyId } from "../../../Models/Common/Constants";
import { L10nService } from "../../../Services/L10n.service";


@Component({
    selector: 'notification-settings',
    templateUrl: 'notificationsettings.component.html',
    providers: [AccountManagement,Common,AppConfig]
})
export class NotificationSettingsComponent implements OnInit {
    @Output() public onSucess = new EventEmitter();
    @Input() public isForReview: boolean = false;
    public router: Router;
    public notificationList: Array<PickList>;
    public notificationSettings: Array<NotificationsSettings>;
    public notificationUserList: Array<User>;
    public isValidate: boolean = false;
    public errorMessage: string = "";
    public PageDivs: any[];
    public companyId: string;
    public contactIds: Array<string>;
    frmNotificationSettings: FormGroup;
    public editMode: boolean;
    private sendtoNoOne: string;
    private notificationSettingsClone: Array<NotificationsSettings>;

    constructor(private _appConfig:AppConfig,public _router: Router, private _l10Service: L10nService, private _accountManagement: AccountManagement, private _common: Common, private formBuilder: FormBuilder) {
        this.PageDivs = [true];
        this.editMode = false;
        this.notificationList = new Array<PickList>();
        this.notificationSettings = new Array<NotificationsSettings>();
        this.notificationUserList = new Array<User>();
        this.contactIds = new Array<string>();
        this.router = _router;
        this.sendtoNoOne = this._l10Service.getL10String("Send to no one");
        this.frmNotificationSettings = this.formBuilder.group({


        });
        this.companyId = sessionStorage.getItem(clientCompanyId);
        this.isValidate = false;
        this.errorMessage = "";
    }

    ngOnInit() {
        this._common.setProcessState(true);
        this.fillData();
    }
    edit() {
        this.editMode = true;
        this.notificationSettingsClone = JSON.parse(JSON.stringify(this.notificationSettings));
    }
    save() {
        this.editMode = false;
    }
    cancel() {
        this.editMode = false;
        this.notificationSettings = JSON.parse(JSON.stringify(this.notificationSettingsClone));
    }
    getDescription(id: string):string {
        return this.notificationList.find(item => item.Id == id).Text;
    }
    DisplayErrorMessage(error: any) {
        console.log(error);
        this._common.setProcessState(false);
        if (error.errorMessage)
            this.errorMessage = error.errorMessage;
        else
            this.errorMessage = this._appConfig.genericError;
    }
    fillNotificationUserList(): Observable<any> {
        let handler = this.fillContactIds();
        handler.subscribe((data: any) => {
            if (data && data.Data && data.Data.length > 0) {
                this.contactIds = (data.Data as ClientUser[]).map(item => item.ContactDetailId);
                console.log("contactIds" + this.contactIds);
            }
        },(error: any) => {
            this.DisplayErrorMessage(error);
            });
        return handler;
    }
    fillData() {
        console.log("filldata");
        Observable.forkJoin(
            this.fillNotificationList(),
            this.fillNotificationUserList()
        ).toPromise().then(() => {
            this.fillContactEmails(this.contactIds).toPromise()
                .then(() => {
                    console.log("before getnotificaiton");
                    this.getNotificationSettings();
                })
                .catch((reason: any) => {
                    this.DisplayErrorMessage(reason);
                });
            });
        console.log("after fork");

    }
    fillContactEmails(contactDetailsIds: string[]): Observable<any> {
        console.log(contactDetailsIds);
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "Id";
        filter.RightOperand = contactDetailsIds;
        filter.Operator = FilterOperator.IN;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        let handler = this._accountManagement.getContactDetails(criteria);
        handler.subscribe(
            (data: any) => {
                if (data && data.Data && data.Data.length > 0) {
                    let contactDetails: ContactDetails[] = (data.Data as ContactDetails[]);
                    contactDetails.forEach((value, index) => {
                        console.log("contactId" + value.Id);
                        console.log("contactEmail" + value.Email);
                        let user = new User();
                        user.Id = value.Id;
                        user.Email = value.Email;
                        this.notificationUserList.push(user);
                    });
                }
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }
    fillContactIds(): Observable<any> {
        let criteria: CriteriaRequest = new CriteriaRequest();
        var filter = new Filter();
        filter.LeftOperand = "ClientCompany";
        filter.RightOperand = this.companyId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        return this._accountManagement.getClientUser(criteria);
    }
    fillNotificationList(): Observable<any> {
        let handler = this._common.getNotificationSettingsList();
        handler.subscribe(
            (data: any) => {
                console.log("fillNotificationList");
                console.log(data);
                if (data && data.Data) {
                    this.notificationList = (data.Data as PickList[]);
                }
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
        return handler;
    }
    getNotificationSettings() {
        let criteria: CriteriaRequest = new CriteriaRequest();
        var filter = new Filter();
        filter.LeftOperand = "ClientCompanyId";
        filter.RightOperand = this.companyId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        this._accountManagement.getNotificationSettings(criteria).subscribe(
            (data: any) => {
                if (data && data.Data) {
                    this.notificationSettings = (data.Data as NotificationsSettings[]);
                    this.notificationList.forEach((value, index) => {
                        if (!this.notificationSettings.find(item => item.DescriptionId == value.Id)) {
                            let notification = new NotificationsSettings();
                            notification.ClientCompanyId = this.companyId;
                            notification.DescriptionId = value.Id;
                            notification.EmailId = this.sendtoNoOne;
                            notification.CreatedDate = new Date();
                            this.notificationSettings.push(notification);
                        }
                    });
                }
                this._common.setProcessState(false);
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
    }
    setNotificationSettings() {
        this._common.setProcessState(true);
        if (!this.frmNotificationSettings.valid) {
            validateAllFormFields(this.frmNotificationSettings);
            this.DisplayErrorMessage("Please fix below error(s)");
            return;
        }
        this._accountManagement.setNotificationSettings(this.notificationSettings).subscribe(
            (data: any) => {
                this.frmNotificationSettings.reset();
                this.onSucess.emit('review_amprocess');
            },
            (error: any) => {
                this.DisplayErrorMessage(error);
            }
        );
    }


}
