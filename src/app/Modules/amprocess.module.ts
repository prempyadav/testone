import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppConfig } from './../app.config';
import { routing } from './../app.routing';
import { Component, NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CompanyDetailsComponent } from './../Components/AccountManagement/CompanyDetails/companydetails.component';
import { CompanyDocumentsComponent } from './../Components/AccountManagement/CompanyDocuments/companydocuments.component';
import { UserManagementComponent } from './../Components/AccountManagement/UserManagement/usermanagement.component';
import { PaymentDetailsComponent } from './../Components/AccountManagement/PaymentDetails/paymentdetails.component';
import { NotificationSettingsComponent } from './../Components/AccountManagement/NotificationsSettings/notificationsettings.component';
import { FileUploadComponent } from './../Components/Common/FileUpload/fileupload.component';
import { AMProcessComponent } from './../Components/AccountManagement/amprocess.component';

import { AccountManagement } from './../Services/AccountManagement.service';
import { L10nService } from './../Services/L10n.service'
import { CommonModule } from '../Modules/common.module'
import {StorageManagement} from './../Services/StorageManagement.service'

@NgModule({
    imports: [CommonModule, BrowserModule, HttpModule, routing, FormsModule, ReactiveFormsModule],
    declarations: [
        FileUploadComponent
        , CompanyDetailsComponent
        , CompanyDocumentsComponent
        , UserManagementComponent
        , PaymentDetailsComponent
        , NotificationSettingsComponent
        , AMProcessComponent],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, AccountManagement, AppConfig, L10nService,StorageManagement],
})
export class AMProcessModule {

}