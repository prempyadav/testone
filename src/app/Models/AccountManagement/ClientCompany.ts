export class ClientCompany {
    public Id: string;
    public Name: string;
    public PrimaryContact: string;
    public ContactDetailsId: string;
    public CompanyRegistrationNumber: string;
    public CompanyCategory?: string;
    public LegalCompanyName?: string;
    public HearAboutUs?: string;
    public TaxNumber: string;
    public DateSubmitted?: Date;
    public DateApproved?: Date;
    public DateSuspended?: Date;
    public LetsAdminComment: string;
}