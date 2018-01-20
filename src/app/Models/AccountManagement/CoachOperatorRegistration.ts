export class CoachOperatorRegistration {
    public id: string;
    public dateAdded: Date;
    public email: string;
    public firstName: string;
    public lastName: string;
    public companyName: string; //existing column value
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public country: string;
    public province: string;
    public postCode: string;
    public landlineNumber: string;
    public faxNumber: string;
    public emergencyMobileNumber: string;
    public confirmEmergencyMobileNumber: string;
    public website: string;
    public companyRegistrationNumber: string;
    public taxNumber: string;
    public dateApproved?: Date;
    public dateRejected?: Date;
    public reasonRejected: string;
    
    //new columns are below
    public legalCompanyName: string; //new column, in migration copy from existing companyname column
    public companyCategory: string; //Ffk from picklist
    public hearAboutUS: string; //FK from picklist
}