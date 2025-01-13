import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiServices } from '../../../../../app/views/services/api.services';
import { CommonServices } from '../../../../../app/views/services/common';
import { GlobalConstant } from '../../globals/globalvariables';

@Component({
  selector: 'pp-transfer-fund-dialog',
  templateUrl: './transfer-fund-dialog.component.html',
  styleUrls: ['./transfer-fund-dialog.component.scss']
})
export class TransferFundDialogComponent implements OnInit {
  refund = 'PharmacyStripe/';
  refAmount = "";
  IsUserType: any = false;
  edited = true;
  constructor(
    public dialogRef: MatDialogRef<TransferFundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public fundDetails: any,
    public commonServices: CommonServices,
    private apiService: ApiServices,
  ) {
    console.log(this.fundDetails);
  }

  ngOnInit() {
    this.commonServices.backSetCls(false); this.edited = true;
  }

  closeIt() {
    this.dialogRef.close();
    this.commonServices.visibility = "hidden";
  }

  onChange($event: Event) {
    console.log($event);
  }

  sendRef(data) {
    if (this.refAmount == null || this.refAmount == undefined || this.refAmount == "" || this.refAmount == '0' || parseFloat(this.refAmount) <= 0) {
      this.apiService.showSnack('Please enter a valid amount'); this.refAmount = "";
      return;
    }

    if (!this.IsUserType) {
      this.apiService.showSnack('Please confirm transfer');
      return;
    }
    var list = {
      PharmacyId: data.PharmacyId,
      StripeId: data.StripeConnectId,
      StripeDetailsubmitted: data.StripeDetailsubmitted,
      Amount: parseFloat(this.refAmount),
    }
    console.log(list);
    this.commonServices.visibility = "shown"; this.edited = false;
    this.commonServices.backDrpCls();
    this.apiService.Post(list, this.refund + "PayoutTransfer").subscribe((res: any) => {
      this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden"; this.dialogRef.close(res);
    }, err => {
      this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden";
      this.commonServices.customError(4); this.dialogRef.close(null);
    });
  }


}
