//import { L10nService } from './../Services/L10n.service'
import { L10nPipe } from '../Pipes/L10n.pipe'

import { NgModule } from '@angular/core';
//import { AppConfig } from './../app.config';
//import { routing } from './../app.routing';
//import { APP_BASE_HREF } from '@angular/common';
//import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//import { BrowserModule } from '@angular/platform-browser';
//import { HttpModule } from '@angular/http';

//@NgModule({exports:[BrowserModule,HttpModule,routing,FormsModule]
//    //exports: [BrowserModule, HttpModule, routing, FormsModule, ReactiveFormsModule]
//    //providers: [{ provide: APP_BASE_HREF, useValue: '/' }, AppConfig, L10nService],
//})
import { L10nService } from './../Services/L10n.service'
import { Security } from './../Services/Security.service'

@NgModule({
    declarations: [L10nPipe],
    exports: [L10nPipe],
    providers: [L10nPipe,L10nService, Security],
})
export class CommonModule {
    
}