import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Country } from '../../../Models/Common/Country';
import { Common, mobileValidator, emailCompareValidator, emailValidator, helplineValidator, zipCodeValidator } from '../../../Services/Common.service';
import { State } from '../../../Models/Common/States'

@Component({
    selector: 'fleet-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'listAllFleet.component.html',
    styleUrls: ['listAllFleet.component.css'],
    providers: [Country, Common]
})

export class ListAllVehiclesComponent {
}
