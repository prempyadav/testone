import { Component, OnInit, ViewEncapsulation, Directive, EventEmitter, Output, Input, ViewChild  } from "@angular/core"
import { Router } from "@angular/router";
import { CompanyDocument } from "../../../Models/AccountManagement/CompanyDocument";
import { AccountManagement } from "../../../Services/AccountManagement.service";
import {Common, validateAllFormFields} from "../../../Services/Common.service"
import { AppConfig } from "../../../app.config";
import { DocumentUploadData } from "../../../Models/AccountManagement/DocumentUploadData";
import { FileUploadComponent } from "../../Common/FileUpload/fileupload.component"
import { CriteriaRequest, Filter, FilterOperator } from "../../../Models/Common/CriteriaRequest";
import { CompanyDocumentType } from "../../../Models/AccountManagement/CompanyDocumentType";
import { clientCompanyId,companyDateApproved,companyDateSubmitted,companyDateSuspended, companyTypeId } from "../../../Models/Common/Constants";
import { L10nService } from "../../../Services/L10n.service";
import { Observable } from "rxjs/Observable";
import { StorageManagement } from "../../../Services/StorageManagement.service";
import { KeyValue } from "../../../Models/Common/KeyValue";
import { PickList } from "../../../Models/Common/PickList";
import { ClientCompany } from "../../../Models/AccountManagement/ClientCompany";

@Component({
    selector: "company-documents",
    templateUrl: "companydocuments.component.html",
    providers: [AccountManagement,AppConfig,Common]
})

export class CompanyDocumentsComponent implements OnInit {
    @Input() public isForReview: boolean = false;
    @Output() public onSucess = new EventEmitter();
    public router: Router;
    public companydocuments: CompanyDocument[];
    public tempdocuments: CompanyDocument[];
    public errorMessage: string = "";
    public PageDivs: any[];
    private companyDocumentType:CompanyDocumentType[];
    public companyCategoryData:any[];
    public companyId: string;

    public companyCategoryId:string = "";
    private isDirty=false;

    @ViewChild("certificate")
    private certificate: FileUploadComponent;
    @ViewChild("license")
    private license: FileUploadComponent;
    @ViewChild("insurance")
    private insurance: FileUploadComponent;
    @ViewChild("logo")
    private logo: FileUploadComponent;

    constructor(private _storageManagement:StorageManagement, private _l10Service:L10nService, private _accountManagement:AccountManagement, private _common:Common, private _appConfig:AppConfig,private _router: Router) {
        console.log("constru");
        this.companyId = sessionStorage.getItem(clientCompanyId);
        this.PageDivs = [true, true, true];
        this.router = _router;
        this.companyDocumentType = new Array<CompanyDocumentType>();
        this.companyCategoryData = new Array<PickList>();
        this.companydocuments = new Array<CompanyDocument>(
            new CompanyDocument(),
            new CompanyDocument(),
            new CompanyDocument(),
            new CompanyDocument());
        
        this.tempdocuments = new Array<CompanyDocument>();
    }
    ngOnInit() {
        this._common.setProcessState(true);
        this.fillcompanyCategory();
        this.getData();
        this.errorMessage = "";
    }
    ngAfterViewInit(){
        this.populateDocumentDetailsForComponent(true);
    }

    setHasExpiry(index:number,value:boolean){
        if(this.companydocuments.length >0){
            this.companydocuments[index].HasExpiryDate = value;
        }
    }
    showhide(divid: number) {

        this.PageDivs[divid] = !this.PageDivs[divid]
    }
    updateEntry(data:DocumentUploadData){
        console.log("updateEntry");
        console.log(data);
        if(data && data.ControlId){
            let componentData = this.companydocuments.find(item=>item.DocumentTypeId == data.ControlId);
            if(componentData){
                this.isDirty = true;
                if(data.FileActualName!=null && data.FileId){
                componentData.DocumentFile = data.FileId;
                componentData.FileNameWithExtension = data.FileActualName;
                componentData.IsDirty = true;
                }else{
                    componentData.DocumentFile = "";
                    componentData.FileNameWithExtension = "";
                }
            }
        }
    }
    
    displayErrorMessage(error: any) {
        this._common.setProcessState(false);
        if (error.errorMessage)
            this.errorMessage = error.errorMessage;
       else if (this.errorMessage )
            this.errorMessage = this.errorMessage ;
        else
            this.errorMessage = this._appConfig.genericError;
    }
    fillcompanyCategory() {
        this._common.getCompanyCategoryList().subscribe(
            (data: any) => {
                console.log("Company Category");
                console.log(data);
                this.companyCategoryData = data.Data;
                this.companyCategoryId = sessionStorage.getItem(companyTypeId);
            },
            (error: any) => {
                this.displayErrorMessage(error);
            }
        );
    }
    getData(){
        this._common.getCompanyDocumentType(null).subscribe(
            (data: any) => {
                if (data && data.Data) {
                    this.companyDocumentType = (data.Data as CompanyDocumentType[]);
                    console.log("gettypes");
                    this.getCompanyDocuments()
                }else{
                    this._common.setProcessState(false);
                }
            },
            (error: any) => {
                this.displayErrorMessage(error);
            }
        );
    }
    getCompanyDocuments(){
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "ClientCompany";
        filter.RightOperand = this.companyId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        this._accountManagement.getCompanyDocument(criteria).subscribe(
            (data: any) => {
                if (data && data.Data) {
                    console.log("getcompanydocyuemtns");
                    this.tempdocuments = (data.Data as CompanyDocument[]);
                    this.populateDocumentDetailsForComponent(false);
                }else{
                    this._common.setProcessState(false);
                }
            },
            (error: any) => {
                this.displayErrorMessage(error);
            }
        );
    }
    get isValid():boolean{
        this.errorMessage = "";
        this.companydocuments.forEach(element => {
            let documentType:CompanyDocumentType = this.companyDocumentType.find(item=>item.Id == element.DocumentTypeId);
            if(element.IsRequired == true 
                && (!element.DocumentFile)
                && (element.DocumentFile==null)
                && (element.DocumentFile.trim()=="")){
                this.errorMessage+= "\n" + this._l10Service.getL10String("Please upload file for "+ documentType.DisplayValue);
            }
            if(element.HasExpiryDate==true && element.ExpiryDate==null){
                this.errorMessage+= "\n" + this._l10Service.getL10String("Please enter Expiry Date for "+ documentType.DisplayValue);
            }
            if(documentType.Key === "Public And Products Liability Insurance"
                && element.InsuranceAmount <=0){
                    this.errorMessage+= "\n" + this._l10Service.getL10String("Please enter Insurance Amount for "+ documentType.DisplayValue);
                }
        });
        return (this.errorMessage=="");    
    }
    setCompanyDocuments(){
        this._common.setProcessState(true);
        if(!this.isValid){
            this.displayErrorMessage("Please fix below error");
            return;
        }
        this.moveFilesfromTemp();
    }
    updateClientCompany(){
        let criteria = new CriteriaRequest();
        let filter = new Filter();
        filter.LeftOperand = "Id";
        filter.RightOperand = this.companyId;
        filter.Operator = FilterOperator.EQUALSTO;
        filter.OperandType = "guid";
        criteria.FilterCriteria = [];
        criteria.FilterCriteria.push(filter);
        this._accountManagement.getClientCompany(criteria).subscribe(
            (data: any) => {
                if (data!.Data.length > 0) {
                    let clientCompany = (data.Data[0] as ClientCompany);
                    clientCompany.DateApproved = null;
                    clientCompany.DateSuspended = null;
                    clientCompany.DateSubmitted = new Date();
                    this._accountManagement.setClientCompany(clientCompany);
                    sessionStorage.setItem(companyDateSubmitted,clientCompany.DateSubmitted.toString());
                    sessionStorage.setItem(companyDateApproved,null);
                    sessionStorage.setItem(companyDateSuspended,null);
                    this.onSucess.emit('user_management');
                }
            },
            (error: any) => {
                this.displayErrorMessage(error);
            }
        );
    }
    saveData(){
        let successCount:number = 4;
        
        this.companydocuments.forEach(element => {
            this._accountManagement.setCompanyDocument(element).subscribe(
                (data: any) => {
                    if (data) {
                        successCount--;
                        element.Id = data;
                        if(successCount == 0){
                            if(this.isDirty==true){
                                this.updateClientCompany();
                            }else{
                                this.onSucess.emit('user_management');
                            }
                        }
                    }
                },
                (error: any) => {
                    this.displayErrorMessage(error);
                }
            );    
        });
    }
    moveFilesfromTemp(){
        let filesToMove:Array<KeyValue> = new Array<KeyValue>();
        this.companydocuments.forEach(element => {
            if(element.IsDirty === true){
                let fileName:string = element.DocumentFile + "."+ element.FileNameWithExtension.split(".").pop();
                console.log("Move file "+ fileName);
                filesToMove.push({Key:this._appConfig.tempDocumentStorageDirectory  +"\\" + fileName,
                Value:this._appConfig.companyDocumentStorageDirectory  +"\\" + fileName});
            }
        });
        this._storageManagement.moveFiles(filesToMove).subscribe(
            (data: any) => {
                console.log("filesMoved");
                this.companydocuments.forEach(element => {
                    element.IsDirty = false;
                });
                this.saveData();
            },
            (error: any) => {
                this.displayErrorMessage(error);
            }
        );    
    }
    setUploadComponentData(fileComponent:FileUploadComponent,documentType:CompanyDocumentType
        ,placeHolderImagePath:string
        ,errorImagePath:string 
        ,placeholderAltText:string
        ,entryIndex:number
        ){
        console.log("setUploadComponentData start");
        fileComponent.controlId = documentType.Id;
        console.log(fileComponent.controlId);
        fileComponent.placeholderImagePath = placeHolderImagePath;
        if(!(fileComponent.imagePath && fileComponent.imagePath!=null && fileComponent.imagePath!="")){
            fileComponent.imagePath = placeHolderImagePath;
        }
        fileComponent.placeholderAltText = placeholderAltText;
        fileComponent.errorImagePath = errorImagePath;
        fileComponent.mainClassName = "Trading_Lience";
        fileComponent.isReadOnly = this.isForReview;
        let documentFile = this.tempdocuments.find(item=>item.DocumentTypeId === documentType.Id);
        if(!documentFile){
            let blankObject:CompanyDocument = new CompanyDocument();
            blankObject.ClientCompanyId = this.companyId;
            blankObject.DocumentFile = "";
            blankObject.DocumentTypeId = documentType.Id;
            blankObject.IsRequired = documentType.IsMandatory;
            blankObject.ExpiryDate = null;
            blankObject.HasExpiryDate = false;
            blankObject.InsuranceAmount = 0;
            blankObject.FileNameWithExtension = "";
            blankObject.Id = "";
            this.companydocuments[entryIndex] = blankObject;
        }else{
            documentFile.HasExpiryDate = (documentFile.ExpiryDate!=null);
            this.companydocuments[entryIndex] = documentFile;
            documentFile.IsRequired = documentType.IsMandatory;
            fileComponent.showFile(this._appConfig.companyDocumentStorageDirectory 
                +"\\"+documentFile.DocumentFile,documentFile.FileNameWithExtension);
        }
    }
    populateDocumentDetailsForComponent(processState:boolean){
        console.log("populate start");
        this.companyDocumentType.forEach(element => {
            console.log("key"+element.Key);
            if(element.Key === "Trading License"){
                this.setUploadComponentData(this.certificate,element
                    ,"\\images\\PlaceHolder\\Trading_Licence.svg"
                    ,"\\images\\PlaceHolder\\Trading_Licence.png"
                    ,"Trading License",0);
            }else if(element.Key === "VOSA Document"){
                this.setUploadComponentData(this.license,element    
                ,"\\images\\PlaceHolder\\Vehicle_Operators_Licence.svg"
                ,"\\images\\PlaceHolder\\Vehicle_Operators_Licence.png"
                ,"Vehicle Operator's Licence",1);
            }else if(element.Key === "Public And Products Liability Insurance"){
                this.setUploadComponentData(this.insurance,element    
                    ,"\\images\\PlaceHolder\\PublicandProducts_Liability_Insurance.svg"
                    ,"\\images\\PlaceHolder\\PublicandProducts_Liability_Insurance.png"
                    ,"Public & Product Liability Insurance",2);
            }else if(element.Key === "Company Logo"){
                this.setUploadComponentData(this.logo,element    
                    ,"\\images\\PlaceHolder\\Company_Logo.svg"
                    ,"\\images\\PlaceHolder\\Company_Logo.png"
                    ,"Company Logo",3);
            }
        });
        this._common.setProcessState(processState);
    }
}