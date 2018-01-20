import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Country } from '../../../Models/Common/Country';
import { Common, mobileValidator, emailCompareValidator, emailValidator, helplineValidator, zipCodeValidator } from '../../../Services/Common.service';
import { State } from '../../../Models/Common/States';

@Component({
    selector: 'create-depot',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'createDepot.component.html',
    styleUrls: ['createDepot.component.css'],
    providers: [Country, Common]
})

export class CreateDepotComponent {

    modelDialog = false;

    public isValidate: boolean = false;
    public errorMessage: string = "";
    public isProgress: boolean = false;
    public countryData: any[];
    public companyCategoryData: any[];
    public allStateData = new Array();
    public stateData: any[];
    public cityData: any[];
    public aboutUS: any[];
    public distanceUnit: any[];
    public currencydata: any[];

    public dv1: boolean = true;
    public PageDivs: any[];
    public countryCode: string;
    public provinceCode: string;

    //frmCompanyDetails: FormGroup;

    constructor(private _common: Common, private formBuilder: FormBuilder) {

        //this.frmCompanyDetails = this.formBuilder.group({
        //    txtAssociateName: [''],
        //    txtCompanyName: [''],
        //    txtLegalCompanyName: [''],
        //    ddlCompanyCategory: [''],
        //    ddlCountry: [''],
        //    ddlProvince: [''],
        //    ddlCity: [''],
        //    txtAddressLine1: [''],
        //    txtAddressLine2: [''],
        //    txtPostCode: [''],
        //    txtPhoneNumber: ['', Validators.compose([Validators.required, mobileValidator])], //14
        //    txtEMobileNumber: ['', Validators.compose([mobileValidator])],//14
        //    txtConfirmEMobileNumber: ['', Validators.compose([mobileValidator])],//14
        //    txtHelplineNumber: ['', Validators.compose([helplineValidator])],//16
        //    txtFaxNumber: [''],
        //    txtWebsite: [''],
        //    txtFirstName: [''],
        //    txtLastName: [''],
        //    txtTitle: [''],
        //    txtJobTitle: [''],
        //    txtEmail: ['', Validators.compose([Validators.required, emailValidator])],
        //    txtConfirmEmail: ['', Validators.compose([Validators.required, emailValidator])],
        //    txtMobileNumber: ['', Validators.compose([Validators.required, mobileValidator])], //14
        //    ddlPreferredDistanceUnit: [''],
        //    txtRegistrationNumber: [''],
        //    txtTaxNumber: [''],
        //    ddlAboutUS: [''],
        //    txtAssociateMembership: [''],
        //    ddlCurrency: ['']
        //});

    }


}
