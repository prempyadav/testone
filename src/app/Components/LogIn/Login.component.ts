import { Component, EventEmitter, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Security } from '../../Services/Security.service';
import { L10nService } from '../../Services/L10n.service';
import { validateAllFormFields, emailValidator } from '../../Services/Common.service';
import { loggedInEmail, token, clientCompanyId, companyContactId } from '../../Models/Common/Constants';
import { L10nPipe } from './../../Pipes/L10n.pipe';
import { LoggedInUser } from '../../Models/Common/LoggedInUser';

@Component({
    selector: 'login',
    templateUrl: 'Login.component.html',
    styleUrls: ['Login.component.scss'],
    providers: [],
})
export class LogInComponent implements OnInit {
    constructor(l10Pipe: L10nPipe, security: Security, l10Service: L10nService, router: Router, private formBuilder: FormBuilder) {
        this.router = router;
        this.l10Pipe = l10Pipe;
        this.securityService = security;
        this.l10Service = l10Service;
        this.frmLoginDetails = this.formBuilder.group({
            txtUserName: ['', Validators.compose([emailValidator])],//14
            txtPassword: ['']
        });
        this.userName = '';
        this.password = '';
    }
    userName:string;
    password:string;
    frmLoginDetails: FormGroup;
    l10Pipe: L10nPipe;
    l10Service: L10nService;
    router: Router;
    securityService: Security;
    ngOnInit(): void {
        if (sessionStorage.getItem("authtoken")) {//mean already logged in
            this.redirect();
        }
    }
    private redirect() {
        this.securityService.getRedirectionURL(sessionStorage.getItem(loggedInEmail)).subscribe(
            (data: any) => {
                //inprogress false;
                this.router.navigate([data.Data[0]]);
            },
            (error: any) => {
                console.log(error);
            }
        );
    }
    logIn() {
        if (!this.frmLoginDetails.valid) {
            //alert('invalid');
            validateAllFormFields(this.frmLoginDetails);
            //return; ned to uncomment later
        }
        this.securityService.logIn(this.userName, this.password).subscribe(
            (data: any) => {
                if (data!.Data.length > 0) {
                    let loggedInUser:LoggedInUser = (data.Data[0] as LoggedInUser);
                    sessionStorage.setItem(token, loggedInUser.AuthToken);
                    if (loggedInUser.ClientUser) {
                        sessionStorage.setItem(clientCompanyId, loggedInUser.ClientUser!.ClientCompanyId);
                        sessionStorage.setItem(companyContactId, loggedInUser.ClientUser!.ContactDetailId);
                    }
                    sessionStorage.setItem(loggedInEmail, loggedInUser.User.Email);
                    this.redirect();
                } else {
                    console.log("Invalid credentials");
                }
            },
            (error: any) => {
                console.log(error);
            });
    }
}


