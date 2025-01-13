import { Component, OnInit, Inject, ViewChild, Input, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatTableDataSource } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { PharmacyModel } from '../../modals/pharmacy-model';
import { ApiServices } from '../../../../views/services/api.services';
import { CommonServices } from '../../../../views/services/common';
import { MapsAPILoader } from '@agm/core';
import { LoaderService } from '../../../../views/services/loader.service';
import { NotifierService } from 'angular-notifier';
import { LayoutUtilsService } from '../../../../core/_base/crud';

@Component({
  selector: 'pp-orderstatus-dialog',
  templateUrl: './orderstatus-dialog.component.html',
  styleUrls: ['./orderstatus-dialog.component.scss']
})
export class OrderStatusDialogComponent implements OnInit {
  CancelReasonId: any;
  CancelFeedback = "";
  orderModel: any;
  loginDetails: any;
  DDReasonId: any;
  DDFlag: boolean = false;
  ReasonList = [];
  constructor(
    public _formBuilder: FormBuilder, public loaderService: LoaderService,
    public apiServices: ApiServices,
    public commonServices: CommonServices,
    public spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<OrderStatusDialogComponent>,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public notifier: NotifierService,
    private layoutUtilsService: LayoutUtilsService,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {
    this.orderModel = modalData.model; this.DDFlag = this.modalData.DDflag;
    if (this.DDFlag) { this.ReasonList = this.modalData.DDReasonList; }
    else { this.ReasonList = this.commonServices.cancelStatusList; }
  }

  ngOnInit() {
    this.commonServices.backSetCls(false); this.loginDetails = JSON.parse(localStorage.getItem("userdetails"));
  }

  onStatusChange(e) { this.CancelReasonId = e.value; }

  onFeedbackChange(e) { this.CancelFeedback = e.value; }

  onSave(): void {
    if (this.DDFlag) {
      if (this.CancelReasonId == undefined || this.CancelReasonId == null || this.CancelReasonId == "" || this.CancelReasonId == 0 || this.CancelReasonId == "0") {
        this.apiServices.showSnack('Please select reason');
        return;
      }
      const title: string = 'DoorDash store offline';
      const description: string = 'Are you sure you want make store as offline?';
      const waitDesciption: string = 'Store is being offline...';
      const flag: number = 1;
      const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption, flag);
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(res => {
        if (res) { this.dialogRef.close(this.CancelReasonId); }
      });
    }
    else {
      if (this.CancelReasonId == undefined || this.CancelReasonId == null || this.CancelReasonId == "" || this.CancelReasonId == 0 || this.CancelReasonId == "0") {
        this.notifier.notify('error', "Cancel reason is required.");
        return;
      }

      if (this.CancelReasonId == 5 && (this.CancelFeedback == "" || this.CancelFeedback == null || this.CancelFeedback == undefined)) {
        this.notifier.notify('error', "Feedback is required.");
        return;
      }
      this.orderModel.CancelReasonId = this.CancelReasonId;
      this.orderModel.CancelFeedback = this.CancelFeedback;
      this.dialogRef.close(this.orderModel);
    }
  }

  closeDialog(): void { this.dialogRef.close(null); }

}
