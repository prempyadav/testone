import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListAllVehiclesComponent } from "./ListAllFleet/listAllFleet.component";
import { CreateDepotComponent } from "./CreateDepot/createDepot.component";


@Component({
    selector: 'fleet-management',
    templateUrl: 'fleet.component.html',
    styleUrls: [],
    providers: [CreateDepotComponent, ListAllVehiclesComponent]
})

export class FleetComponent {

}


