import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../../../app/views/services/common';

@Component({
    selector: 'pp-alert-dialog',
    templateUrl: './alert.dialog.component.html',
    styleUrls: ['./alert.dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {
    rippleColor: string = "#ffdcda";
    btnCancelText = "Cancel"; btnOkText = "Ok"; title = ""; message = "";
    WEmail = false;
    constructor(public dialogRef: MatDialogRef<AlertDialogComponent>,
        public commonServices: CommonServices,
        @Inject(MAT_DIALOG_DATA) public modalData: any) {

    }

    ngOnInit() {
        this.commonServices.backSetCls(false); this.title = this.modalData.title;
        this.message = this.modalData.message;
        this.btnOkText = this.modalData.btnOkText;
        this.btnCancelText = this.modalData.btnCancelText;
        this.WEmail = this.modalData.WEmail == true ? true : false;
    }

    closeDialog(hide: string): void {
        this.dialogRef.close(hide);
    }
    hideDialog(): void {
        this.dialogRef.close('');
    }
    show(show: string): void {
        this.dialogRef.close(show);
    }
}
