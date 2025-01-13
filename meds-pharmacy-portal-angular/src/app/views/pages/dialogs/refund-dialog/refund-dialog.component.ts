import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../../../app/views/services/common';
import { ApiServices } from '../../../../../app/views/services/api.services';

@Component({
  selector: 'pp-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {
  refund = 'PharmacyStripe/';
  stripList = [
    {
      id: 1,
      reason: 'Requested by customer',
      value: 'requested_by_customer'

    }, {
      id: 2,
      reason: 'Fraudulent',
      value: 'fraudulent'
    },
    {
      id: 3,
      reason: 'Duplicate',
      value: 'duplicate'
    }]

  refundAmount = "";
  reason: string = '';
  refReason: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public refundDetails: any,
    public dialogRef: MatDialogRef<RefundDialogComponent>,
    public commonServices: CommonServices,
    private apiService: ApiServices,
  ) {

  }

  ngOnInit() {
    this.commonServices.backSetCls(false);
  }

  changeData(event) {
    this.refReason = event;
    console.log(event);
  }

  closeIt() {
    this.dialogRef.close();
  }

  refundCreate() {
    if (this.refundAmount == null || this.refundAmount == undefined || this.refundAmount == "" || this.refundAmount == '0' || parseFloat(this.refundAmount) <= 0) {
      this.apiService.showSnack('Please enter a valid amount'); this.refundAmount = "";
      return;
    }

    if (this.refReason == '') {
      this.apiService.showSnack('Please select a reason');
      return;
    }
    var list = {
      OrderId: this.refundDetails.OrderId,
      Amount: parseFloat(this.refundAmount),
      RefundReason: this.refReason,
    }
    this.commonServices.visibility = "shown"; this.closeIt();
    this.apiService.Post(list, this.refund + "PayoutRefund").subscribe((res: any) => {
      this.apiService.showSnack(res.data.ErroMessage);
      this.commonServices.visibility = "hidden";
    }, err => {
      this.commonServices.visibility = "hidden";
      this.commonServices.customError(3);
    });
  }

}
