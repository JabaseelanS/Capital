import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiServices } from '../../../../views/services/api.services';
import { CommonServices } from '../../../../views/services/common';
import { MapsAPILoader } from '@agm/core';
import { LoaderService } from '../../../../views/services/loader.service';
import { NotifierService } from 'angular-notifier';
import { CourierStatusModel } from './courierstatus-model';

@Component({
  selector: 'pp-courierstatus-dialog',
  templateUrl: './courierstatus-dialog.component.html',
  styleUrls: ['./courierstatus-dialog.component.scss']
})
export class CourierstatusDialogComponent implements OnInit {
  bookDeliveryForm: FormGroup;
  courierModel: CourierStatusModel;
  orderModel: any;
  loginDetails: any;
  driverlist: FormGroup;
  url = 'PharmacistReviewV2/';
  formlist: any = [];
  value: any = [];
  MobLength = 12;
  public mobMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];

  constructor(
    public _formBuilder: FormBuilder, public loaderService: LoaderService,
    public apiServices: ApiServices,
    public commonServices: CommonServices,
    public spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<CourierstatusDialogComponent>,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public notifier: NotifierService,

    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {
    this.orderModel = this.modalData.model;
  }

  ngOnInit() {
    this.commonServices.backSetCls(false); this.loginDetails = JSON.parse(localStorage.getItem("userdetails"));
    this.courierModel = new CourierStatusModel(this.modalData.model);
    this.formCreation();
  }

  formCreation() {
    this.driverlist = this._formBuilder.group({
      DriverName: new FormControl(this.courierModel.DriverName),
      DriverMobileNumber: new FormControl(this.courierModel.DriverMobileNumber),
      MarketPlace: new FormControl(this.courierModel.MarketPlace),
      CostOfDelivery: new FormControl(this.courierModel.CostOfDelivery),
      OrderId: new FormControl(this.courierModel.OrderId),
      //DriverDetailsId: new FormControl(this.courierModel.DriverDetailsId),
    })
  }
  showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

  onSave(): void {
    var form = {
      DriverName: this.driverlist.value.DriverName,
      DriverMobileNumber: this.commonServices.validDigRep(this.driverlist.value.DriverMobileNumber),
      MarketPlace: this.driverlist.value.MarketPlace,
      CostOfDelivery: this.driverlist.value.CostOfDelivery,
    }
    if (form.DriverName == "" || form.DriverName == null) {
      this.apiServices.showSnack("Please Enter Driver Name"); return;
    }
    var validby = this.commonServices.validByMobileNo(form.DriverMobileNumber);
    if (validby == 1) {
      this.apiServices.showSnack("Enter your mobile number");
      return;
    }
    if (validby == 3) {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }
    if (validby == 2) {
      if (form.DriverMobileNumber.charAt(0) != 0) { form.DriverMobileNumber = "0" + form.DriverMobileNumber; }
    } else {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }
    if (form.MarketPlace == "" || form.MarketPlace == null) {
      this.apiServices.showSnack("Please Select Market Place"); return;
    }
    if (form.CostOfDelivery == "" || form.CostOfDelivery == null) {
      this.apiServices.showSnack("Please Enter Cost Of Delivery"); return;
    }
    this.driverlist.controls['OrderId'] = this.modalData.model.OrderId

    this.apiServices.Post(this.driverlist.value, this.url + "driverDetails").subscribe((res: any) => {
      this.dialogRef.close(res)
    })
  }
}
