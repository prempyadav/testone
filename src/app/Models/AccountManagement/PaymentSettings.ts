export class PaymentSettings
{
    public Id:string = "";
    public ClientCompany:string = "";
    
    //Bank Account Details 
    public AccountName: string = "";
    public AccountNumber: string = "";
    public SortCode: string = "";
    public SwiftOrBICCode: string = "";
    public IBANNumber: string = "";
    public RoutingNumberABA: string = "";
    public IntermediaryBank: string = "";
    public BankName: string = "";
    public BranchAddressLine1: string = "";
    public BranchAddressLine2: string = "";
    public BranchCountry: string = "";
    public BranchProvince: string = "";
    public BranchCity: string ="";
    
    public BranchPostcode: string = "";
    public OtherInfo: string;
}