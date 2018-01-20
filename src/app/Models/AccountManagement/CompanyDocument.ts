import {DocumentBase} from "../Common/DocumentBase"
import { fail } from "assert";

export class CompanyDocument extends DocumentBase
{
        public ClientCompanyId:string;
        public ExpiryDate?:Date;
        public InsuranceAmount?:number;
        //local fields
        public IsRequired:boolean;
        public HasExpiryDate:boolean;
        public IsDirty:boolean;
        constructor(){
                super();
                this.ClientCompanyId = "";
                this.ExpiryDate = null;
                this.InsuranceAmount = 0;
                this.IsRequired = false;
                this.HasExpiryDate = false;
                this.IsDirty = false;
        }

}