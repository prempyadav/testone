import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from './Modules/layout.module';

import { HttpModule } from '@angular/http';
import { AppConfig } from './app.config';
import { routing } from './app.routing';
import { Component, NgModule, OnInit, OnDestroy } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AMProcessModule } from './Modules/amprocess.module'
import { MasterPageComponent } from './Components/MasterPage/MasterPage.component';

import { AccountManagement } from './Services/AccountManagement.service';
import { L10nService } from './Services/L10n.service'
@NgModule({
    imports: [
        BrowserModule
        , AMProcessModule
        , HttpModule
        , routing
        , FormsModule
        , ReactiveFormsModule
        , LayoutModule],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, AccountManagement,AppConfig, L10nService],
    bootstrap:[MasterPageComponent]
})

export class AppModule implements OnInit,OnDestroy{
    ngOnDestroy(): void {
        //clear session after stop app
        sessionStorage!.clear();
    }
    ngOnInit(): void {
        //clear session befor start app
        sessionStorage!.clear();
    }
    
    
}