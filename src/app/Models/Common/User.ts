export class User {
    public Id: string;
    public Email: string;
    public Password: string;
    public Role?: string;
    public DateCreated?: Date;
    public DateAcceptedTermsAndConditions?: Date;
    public IsSuspend: boolean;
    public IsActive: boolean;
    public ConfirmPassword: string;
    public ConfirmEmail: string;
}