import { MasterPageComponent } from './../Components/MasterPage/MasterPage.component';
import { LeftMenuComponent } from './../Components/MasterPage/LeftMenu/LeftMenu.component';
import { TopMenuComponent } from './../Components/MasterPage/TopMenu/TopMenu.component';
import { FleetComponent } from './../Components/Fleet/fleet.component';
import { CreateDepotComponent } from './../Components/Fleet/CreateDepot/createDepot.component';
import { ListAllVehiclesComponent } from './../Components/Fleet/ListAllFleet/listAllFleet.component';
import {LogInComponent } from './../Components/LogIn/Login.component'


import { AppConfig } from './../app.config';
import { routing } from './../app.routing';
import { Component, NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { L10nService } from './../Services/L10n.service';
import {Security } from './../Services/Security.service'

import { CommonModule } from '../Modules/common.module';


@NgModule({
    imports: [CommonModule, BrowserModule, HttpModule, routing, FormsModule, ReactiveFormsModule],
    exports: [MasterPageComponent],
    declarations: [
        MasterPageComponent
        , LeftMenuComponent
        , TopMenuComponent
         , FleetComponent
        , CreateDepotComponent
        , ListAllVehiclesComponent
    ,LogInComponent],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, AppConfig, L10nService,Security],
})
export class LayoutModule {

}