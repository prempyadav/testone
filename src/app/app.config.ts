import { Injectable } from '@angular/core';
import { L10nService } from './Services/L10n.service'

@Injectable()
export class AppConfig {

   sassVariables:any; 
   config:any;
   apiUrl: string;
   baseUrl:string;
   tempDocumentStorageDirectory:string;
   companyDocumentStorageDirectory:string;
   driverDocumentStorageDirectory:string;
   connectionError: string = "Problem with connection.Please try after some time.";
   genericError: string = "Some error occured at server.Please try again.";
   genericValidationError: string = "Please fix velow error(s).";
   constructor(){
       this.config = {
           name: 'TripCenter-Supplier',
           title: 'TripCenter-Supplier',
           version: '1.1.0'
       },
           //dev
       this.apiUrl = "http://localhost:2818/api/v1/";
       this.baseUrl = "http://localhost:2818/";
       //release
       //this.apiUrl = "http://tripcenterapi.azurewebsites.net/api/v1/";
       //this.baseUrl = "http://tripcenterapi.azurewebsites.net/";


       this.tempDocumentStorageDirectory = "\\temp";
       this.companyDocumentStorageDirectory = "\\companyDocuments";
       
        //qa
        //this.ApiUrl=""
	    //PROD
        //this.ApiUrl="";
        
   }   

   
}