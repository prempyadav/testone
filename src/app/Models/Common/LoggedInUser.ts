import { ClientUser } from "../AccountManagement/ClientUser";
import { User } from "./User";

export class LoggedInUser {
    public AuthToken: string;
    public ClientUser: ClientUser;
    public User: User;
}