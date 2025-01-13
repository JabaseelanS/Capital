import { Component, OnInit, Inject } from '@angular/core'; import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../../views/services/common';

@Component({
  selector: 'pp-live-order-popup',
  templateUrl: './live-order-popup.component.html',
  styleUrls: ['./live-order-popup.component.scss']
})
export class LiveOrderPopupComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<LiveOrderPopupComponent>, @Inject(MAT_DIALOG_DATA) public modalData: any,
    public commonServices: CommonServices) { }
  data = this.modalData;
  ngOnInit() {
    this.commonServices.backSetCls(false);
  }

  closeDialog(hide: string): void {
    this.dialogRef.close(hide);
  }
  show(show: string): void {
    this.dialogRef.close(show);
  }
}