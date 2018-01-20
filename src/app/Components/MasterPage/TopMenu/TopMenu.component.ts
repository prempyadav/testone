
import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'top-menu',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'TopMenu.component.html',
    styleUrls: ['TopMenu.component.scss']
})

export class TopMenuComponent {
    pageName = "Dashboard";
    loginUserName = "John Carter";
}