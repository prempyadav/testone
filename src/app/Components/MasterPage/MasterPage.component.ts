import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
    selector: 'master-page',
    templateUrl: 'MasterPage.component.html',
    styleUrls: []
})

export class MasterPageComponent implements OnInit{
    public hideLeftMenu:boolean = false;
    public hideTopMenu: boolean = false;
    constructor(private _router: Router, private _render: Renderer2) {
       this._router.events
        .subscribe((event)=>
        {
            if((event as RoutesRecognized)){
                let foundUrl = (event as RoutesRecognized).urlAfterRedirects;
                if(foundUrl === "" || foundUrl === "/" || foundUrl === "/login" || foundUrl === "/amprocess"){
                    this.hideLeftMenu = true;
                    this.hideTopMenu = true;
                    this._render.addClass(document.body, "AMProcessOutdoor");
                }else{
                    this.hideLeftMenu = false;
                    this.hideTopMenu = false;
                    this._render.removeClass(document.body, "AMProcessOutdoor");
                    console.log(this._render)
                }
            }
        });
    }
    ngOnInit(): void {
        
    }

}


