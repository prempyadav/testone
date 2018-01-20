import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { StorageManagement } from '../../../Services/StorageManagement.service';
import { AppConfig } from "../../../app.config"
import { DocumentUploadData } from '../../../Models/AccountManagement/DocumentUploadData';
import { UrlSegment } from '@angular/router/src/url_tree';
import { UrlResolver } from '@angular/compiler';
import { ViewRef } from '@angular/core/src/linker/view_ref';
import { ElementRef } from '@angular/core/src/linker/element_ref';
@Component({
    selector: 'tripcenterfileupload',
    templateUrl: 'fileupload.component.html'
})
export class FileUploadComponent implements OnInit {
    public errors: Array<string> = [];
    public dragAreaClass: string = "Upload_file";
    public controlId: string = "";
    public placeholderImagePath: string = "";
    public imagePath: string = "";
    public errorImagePath: string = "";
    public placeholderAltText: string = "";
    @Input() public fileExt: string = "JPG, GIF, PNG";
    @Input() public maxFiles: number = 1;
    @Input() public maxSize: number = 5; // in MB
    public mainClassName: string = "";
    public isReadOnly: boolean = false;
    @Output() public uploadStatus = new EventEmitter<DocumentUploadData>();

    private fileActualName: string = "";

    constructor(private _appConfig: AppConfig, private _storageManagement: StorageManagement) {
        this.isReadOnly = false;
    }

    ngOnInit() { }
    onFileChange(event: any) {
        let files = event.target.files;
        this.saveFiles(files);
    }
    @HostListener('dragover', ['$event']) onDragOver(event: any) {
        if (this.isReadOnly == true) return;
        event.preventDefault();
        event.stopPropagation();
        this.dragAreaClass = "onDragHover";
    }
    @HostListener('dragenter', ['$event']) onDragEnter(event: any) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isReadOnly == true) return;
        this.dragAreaClass = "onDragHover";

    }
    @HostListener('dragend', ['$event']) onDragEnd(event: any) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isReadOnly == true) return;
        this.dragAreaClass = "Upload_file";
    }
    @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isReadOnly == true) return;
        this.dragAreaClass = "Upload_file";
    }
    @HostListener('drop', ['$event']) onDrop(event: any) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isReadOnly == true) return;
        this.dragAreaClass = "Upload_file";
        var files = event.dataTransfer.files;
        this.saveFiles(files);
    }
    clearFile(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.imagePath = this.placeholderImagePath;
        let updatedEntry: DocumentUploadData = new DocumentUploadData();
        updatedEntry.ControlId = this.controlId;
        updatedEntry.FileDirectory = this._appConfig.tempDocumentStorageDirectory;
        updatedEntry.FileId = "";
        updatedEntry.FileActualName = "";
        this.uploadStatus.emit(updatedEntry);
    }
    showFile(filePath: string, actualFileName: string) {
        //load file content here 
        console.log("showFile");
        console.log(filePath);
        console.log(actualFileName);
        this.fileActualName = actualFileName;
        this._storageManagement.getFileURL((filePath + "." + actualFileName.split(".").pop())).subscribe((data: string) => {
            data = data.replace('~', '');
            console.log(this._appConfig.baseUrl + data);
            this.imagePath = (this._appConfig.baseUrl + data);
            console.log("this.imagePath");
            console.log(this.imagePath);
            /*let reader = new FileReader();
            reader.addEventListener("load",()=>{
                this.placeholderImagePath = reader.result;
            },false);
            if(data){
    s            reader.readAsDataURL(data._body);
            }*/
        },
            (error: any) => {
                this.imagePath = this.placeholderImagePath;
                this.errors.push(error);
            });
    }
    /*previewFile(file:File){
        console.log("preview file");
        var reader = new FileReader();
        reader.onload = (function(aImg) { 
            return function(e:any) { 
                aImg.src = e.target.result;
             };
            })(this.fileImage);
        reader.readAsDataURL(file);
    }*/
    saveFiles(files: any) {
        let updatedEntry: DocumentUploadData = new DocumentUploadData();
        updatedEntry.ControlId = this.controlId;
        updatedEntry.FileDirectory = this._appConfig.tempDocumentStorageDirectory;
        updatedEntry.FileId = "";
        updatedEntry.FileActualName = "";
        this.errors = []; // Clear error
        // Validate file size and allowed extensions
        if (files.length > 0 && (!this.isValidFiles(files))) {
            this.uploadStatus.emit(updatedEntry);
            return;
        }
        if (files.length > 0) {
            let formData: FormData = new FormData();
            for (var j = 0; j < files.length; j++) {
                formData.append("file[]", files[j], files[j].name);
            }
            //this.previewFile(files[0]);
            this._storageManagement.addFile(formData, this._appConfig.tempDocumentStorageDirectory).subscribe((data: Map<string, string>) => {
                Object.keys(data).forEach(key => {
                    let value = data[key];
                    updatedEntry.FileId = key;
                    updatedEntry.FileActualName = value;
                    this.showFile(this._appConfig.tempDocumentStorageDirectory + "//" + key, value);
                });
                this.uploadStatus.emit(updatedEntry);
            },
                (error: any) => {
                    this.uploadStatus.emit(updatedEntry);
                    this.errors.push(error);
                });
        }
    }
    private isValidFiles(files: any): boolean {
        // Check Number of files
        if (files.length > this.maxFiles) {
            this.errors.push("Error: At a time you can upload only " + this.maxFiles + " files");
            return false;
        }
        this.isValidFileExtension(files);
        return this.errors.length === 0;
    }
    private isValidFileExtension(files: any) {
        // Make array of file extensions
        var extensions: string[] = (this.fileExt.split(','))
            .map(function (x) { return x.toLocaleUpperCase().trim() });
        for (var i = 0; i < files.length; i++) {
            // Get file extension
            var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
            // Check the extension exists
            var exists = extensions.indexOf(ext);
            if (exists < 0) {
                this.errors.push("Error (Extension): " + files[i].name);
            }
            // Check file size
            this.isValidFileSize(files[i]);
        }
    }
    private isValidFileSize(file: File) {
        var fileSizeinMB = file.size / (1024 * 1000);
        var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize)
            this.errors.push("Error (File Size): " + file.name + ": exceed file size limit of " + this.maxSize + "MB ( " + size + "MB )");
    }
}