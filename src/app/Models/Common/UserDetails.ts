import { ClientUser } from "../AccountManagement/ClientUser";
import { User } from "./User";
import { ContactDetails } from "../AccountManagement/ContactDetails";

export class UserDetails {
    public ClientUserData: ClientUser;
    public UserData: User;
    public ContactDetailsData: ContactDetails;

    constructor() {
        this.ClientUserData = new ClientUser();
        this.UserData = new User();
        this.ContactDetailsData = new ContactDetails();
    }
}