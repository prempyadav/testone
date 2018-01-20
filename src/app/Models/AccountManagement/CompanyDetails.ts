import { ClientCompany } from './ClientCompany';
import { CoachOperator } from './CoachOperator';
import { OperatorMembership } from './OperatorMembership'
import { CoachOperatorRegistration } from './CoachOperatorRegistration';
import { ContactDetails } from "./ContactDetails";
import { ClientUser } from "./ClientUser";
export class CompanyDetails {
    public ClientCompany: ClientCompany ;
    public CoachOperator: CoachOperator;
    public ContactDetails: ContactDetails;
    public AdminUser: ClientUser;
    public Membership: OperatorMembership[];
    constructor() {
        this.ClientCompany = new ClientCompany();
        this.CoachOperator = new CoachOperator();
        this.ContactDetails = new ContactDetails();
        this.AdminUser = new ClientUser();
        this.Membership = new Array<OperatorMembership>();
    }
}