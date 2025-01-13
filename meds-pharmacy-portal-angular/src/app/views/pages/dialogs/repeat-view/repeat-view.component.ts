import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../../../app/views/services/common';

@Component({
    selector: 'pp-repeat-view',
    templateUrl: './repeat-view.component.html',
    styleUrls: ['./repeat-view.component.scss']
})
export class RepeatViewComponent implements OnInit {
    rippleColor: string = "#ffdcda";
    repeatList = []; Mobileno = ""; Fullname = "";
    constructor(public dialogRef: MatDialogRef<RepeatViewComponent>,
        public commonServices: CommonServices,
        @Inject(MAT_DIALOG_DATA) public modalData: any) {
    }

    ngOnInit() {
        this.repeatList = this.modalData.model;
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
