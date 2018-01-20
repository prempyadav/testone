
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AMProcessComponent } from './Components/AccountManagement/amprocess.component';
import { LogInComponent } from './Components/LogIn/Login.component';

//Dashboard
import { MasterPageComponent } from './Components/MasterPage/MasterPage.component';

//Fleet
import { FleetComponent } from './Components/Fleet/fleet.component';
import { CreateDepotComponent } from './Components/Fleet/CreateDepot/createDepot.component';
import { ListAllVehiclesComponent } from './Components/Fleet/ListAllFleet/listAllFleet.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'amprocess', component: AMProcessComponent },
    { path: 'amreview', component: AMProcessComponent },
    { path: 'fleet', component: FleetComponent },
    { path: 'fleet/createvehicle', component: FleetComponent },
    { path: 'login', component: LogInComponent },
    { path: 'home', component: MasterPageComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


