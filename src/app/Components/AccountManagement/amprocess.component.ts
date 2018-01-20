import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { clientCompanyId, companyContactId,loggedInEmail,token, companyDateApproved, companyDateSubmitted } from '../../Models/Common/Constants';
import { fail } from 'assert';
import { Common } from '../../Services/Common.service';
declare var $: any;
@Component({
  selector: 'am-process',
  templateUrl: 'amprocess.component.html',
  styleUrls: [],
  providers:[Common]
})
export class AMProcessComponent implements OnInit 
{
    ngOnInit(): void {
        
    }
    constructor(private _common:Common) {
        this.stepDivs = [true, true, true, true, true];
        this.stepEditable = [false, false, false, false, false];
        this.isSubmit = false;
        this.stepProgressImages = [this.inPorgressImage,this.stepNumberImage+"/2.svg",
        this.stepNumberImage+"/3.svg",this.stepNumberImage+"/4.svg",this.stepNumberImage+"/5.svg"];

    }
    private inPorgressImage ="/images/ProgressBar/In_Progress.svg";
    private underVerficationImage ="/images/ProgressBar/Under_Verification.svg";
    private doneImage ="/images/ProgressBar/Done.svg";
    private stepNumberImage ="/images/ProgressBar/";

    public stepDivs: boolean[];
    public stepEditable: boolean[];
    public stepProgressImages:string[];
    public currentStep: string = "company_details";
    public isReview: boolean = false;
    public isSubmit: boolean = false;
    public nextStep: string;
    public nextStepText: string;
    public progressClass:string= "bar-1";

    public getStatusImage():string{
        let dateApproved = Date.parse(sessionStorage.getItem(companyDateApproved));
        let dateSubmitted = Date.parse(sessionStorage.getItem(companyDateSubmitted));
        let dateRejected = Date.parse(sessionStorage.getItem(companyDateSubmitted));
        console.log("dateApproved");
        console.log(dateApproved);
        if(isNaN(dateApproved)){
            return this.underVerficationImage;
        }else{
            return this.doneImage;
        }
    }
    public jumpToStep(step: string) {
        this._common.setProcessState(false);
        //can do some validations if required
        this.isReview = false;
        this.isSubmit = false;
        this.currentStep = step;
        let statusImagePath:string = "";
        switch (this.currentStep) {
            case "company_details":
                this.progressClass = "bar-1";
                this.stepProgressImages[0] = this.inPorgressImage;
                this.stepProgressImages[1] = this.stepNumberImage +"/2.svg";
                this.stepProgressImages[2] = this.stepNumberImage +"/3.svg";
                this.stepProgressImages[3] = this.stepNumberImage +"/4.svg";
                this.stepProgressImages[4] = this.stepNumberImage +"/5.svg"; 
                break;
            case "company_documents":
                this.progressClass = "bar-2";
                statusImagePath = this.getStatusImage();
                this.stepProgressImages[0] = statusImagePath;
                if(statusImagePath===this.doneImage){
                    this.stepEditable[0] = true;
                }
                this.stepProgressImages[1] = this.inPorgressImage;
                this.stepProgressImages[2] = this.stepNumberImage +"/3.svg";
                this.stepProgressImages[3] = this.stepNumberImage +"/4.svg";
                this.stepProgressImages[4] = this.stepNumberImage +"/5.svg"; 
                break;
            case "user_management":
            this.progressClass = "bar-3";
                statusImagePath = this.getStatusImage();
                this.stepProgressImages[0] = statusImagePath;
                this.stepProgressImages[1] = statusImagePath;
                if(statusImagePath===this.doneImage){
                    this.stepEditable[0] = true;
                    this.stepEditable[1] = true;
                }
                this.stepProgressImages[2] = this.inPorgressImage;
                this.stepProgressImages[3] = this.stepNumberImage +"/4.svg";
                this.stepProgressImages[4] = this.stepNumberImage +"/5.svg"; 
                break;
            case "payment_details":
            this.progressClass = "bar-4";
                statusImagePath = this.getStatusImage();
                this.stepProgressImages[0] = statusImagePath;
                this.stepProgressImages[1] = statusImagePath;
                if(statusImagePath===this.doneImage){
                    this.stepEditable[0] = true;
                    this.stepEditable[1] = true;
                }
                this.stepEditable[2] = true;
                this.stepProgressImages[2] = this.doneImage;
                this.stepProgressImages[3] = this.inPorgressImage;
                this.stepProgressImages[4] = this.stepNumberImage +"/5.svg"; 
                break;
            case "notification_settings":
                this.progressClass = "bar-5";
                statusImagePath = this.getStatusImage();
                this.stepProgressImages[0] = statusImagePath;
                this.stepProgressImages[1] = statusImagePath;
                this.stepEditable[2] = true;
                this.stepEditable[3] = true;
                this.stepProgressImages[2] = this.doneImage;
                this.stepProgressImages[3] = this.doneImage;
                this.stepProgressImages[4] = this.inPorgressImage;
                break;
            case "review_amprocess":
                this.progressClass = "bar-6";
                this.isReview = true;
                statusImagePath = this.getStatusImage();
                this.stepProgressImages[0] = statusImagePath;
                this.stepProgressImages[1] = statusImagePath;
                this.stepEditable[2] = true;
                this.stepEditable[3] = true;
                this.stepEditable[4] = true;
                this.stepProgressImages[2] = this.doneImage;
                this.stepProgressImages[3] = this.doneImage;
                this.stepProgressImages[4] = this.doneImage;
                break;
        }
    }
    showhideSteps(divid: number) {
        this.stepDivs[divid] = !this.stepDivs[divid];
    }
    hideModal() {
        $('#submitData').modal('hide');
    }
    submit() {
        this.isSubmit = true;
        this.nextStep = "../home";
        this.nextStepText = "GO TO DASHBOARD";
        $('#submitData').modal('show');
    }
}


