export class DocumentBase
{
        public Id:string;
        public DocumentTypeId:string;
        public DocumentFile:string;
        public FileNameWithExtension:string;
        constructor(){
                this.Id = "";
                this.DocumentTypeId = "";
                this.DocumentFile = "";
                this.FileNameWithExtension = "";
        }
}