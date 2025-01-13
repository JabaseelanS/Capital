import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../../../app/views/services/common';
import { RepeatViewComponent } from '../../dialogs/repeat-view/repeat-view.component';

@Component({
    selector: 'pp-repeat-list',
    templateUrl: './repeat-list.component.html',
    styleUrls: ['./repeat-list.component.scss']
})
export class RepeatListComponent implements OnInit {
    rippleColor: string = "#ffdcda";
    repeatList = []; Mobileno = ""; Fullname = "";
    constructor(public dialogRef: MatDialogRef<RepeatListComponent>,
        public commonServices: CommonServices,
        @Inject(MAT_DIALOG_DATA) public modalData: any,
        private dialog: MatDialog,) {
    }

    ngOnInit() {
        debugger
        this.repeatList = this.modalData.value;
        this.Mobileno = this.modalData.cModel.Mobileno.replace(/^0+/, '');
        this.Fullname = this.modalData.cModel.CustomerFullname;
    }

    addDate(val) {
        if (val > 0) {
            var date = new Date();
            return date.setDate(date.getDate() + val);
        }
        return '-';
    }

    repeatView(model) {
        var name = model[0].FamilyId <= 0 ? this.Fullname : model[0].familyMember.Name
        this.dialogRPop(model, name);
    }

    dialogRPop(model, name) {
        this.dialog.open(RepeatViewComponent, {
            data: {
                model, name
            },
            disableClose: true,
            height: 'auto',
            width: '600px'
            // maxHeight: '560px'
        }).afterClosed().subscribe(async res => {

        });
    }

    showMobileNo(model) {
        var mobile = "";
        if (model.FamilyId <= 0) {
            mobile = this.Mobileno;
        } else {
            mobile = model.familyMember.MobileNo;
        }
        if (mobile != null && mobile != "" && mobile != undefined) {
            return mobile;
        }
        return "";
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
