
import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router';

@Component({
    selector: 'left-menu',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'LeftMenu.component.html',
    styleUrls: ['LeftMenu.component.scss']
})

export class LeftMenuComponent {
    title = "Navigation";
    lefMenuItems = leftNavigation;
};

const leftNavigation = [
    {
        icon: "ic_dashboard",
        name: "Dashboard",
        url: "/home"
    },
    {
        icon: "ic_bookings",
        name: "Bookings",
        url: "#"
    },
    {
        icon: "ic_fleet",
        name: "Fleet",
        url: "/fleet"
    },
    {
        icon: "ic_accountManagement",
        name: "Account Management",
        url: "/amreview"
    },
    {
        icon: "ic_managePrice",
        name: "Manage Price",
        url: "#"
    },
    {
        icon: "ic_mangeDrivers",
        name: "Manage Drivers",
        url: "#"
    },
    {
        icon: "ic_reviews",
        name: "Reviews",
        url: "#"
    }
];