import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../services/common';

@Component({
  selector: 'pp-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {
  rippleColor: string = "#ffdcda";
  headerstr: string = "Are you sure you want to delete?";
  constructor(public dialogRef: MatDialogRef<DeletePopupComponent>,
    public commonServices: CommonServices, @Inject(MAT_DIALOG_DATA) public modalData: any) { }
  ngOnInit() {
    // console.log(this.modalData);
    if (this.modalData != null) {
      this.headerstr = this.modalData.data;
    }
    this.commonServices.backSetCls(false);
  }
  closeDialog(hide: string): void {
    this.dialogRef.close(hide);
  }
  show(show: string): void {
    this.dialogRef.close(show);
  }
}
