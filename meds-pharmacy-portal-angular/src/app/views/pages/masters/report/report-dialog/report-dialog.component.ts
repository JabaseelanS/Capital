import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableDataSource } from 'angular4-material-table';
import { ApiServices } from '../../../../../../app/views/services/api.services';
import { CommonServices } from '../../../../../../app/views/services/common';
import { ReportModel } from '../report.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalConstant } from '../../../globals/globalvariables';

var _this: any;
@Component({
  selector: 'pp-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss'],
  providers: [DatePipe]
})
export class ReportDialog implements OnInit {
  reportForm: FormGroup;
  repModel: ReportModel;
  loginDetails: any;
  pharmacyList = [];
  base64Image: string;
  rfile: string;
  rfile2: string;
  slectedImage = new Array<string>();
  slectedImage2 = new Array<string>();
  isRole = false;
  url = "ReportV2/";
  edited = true;
  tempPharmacyList: any = [];
  isCreate = false;
  constructor(public dialogRef: MatDialogRef<ReportDialog>, @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _formBuilder: FormBuilder,
    private apiServices: ApiServices,
    public commonServices: CommonServices,
    private cdRef: ChangeDetectorRef,
    public datepipe: DatePipe,
    public router: Router
  ) {
    this.repModel = new ReportModel({});
  }
  prescriptionDetailsDataSource: TableDataSource<any>;

  ngOnInit(): void {
    this.commonServices.backSetCls(false); this.loginDetails = JSON.parse(localStorage.getItem("userdetails")); this.edited = true;
    this.formCreation();
    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      this.isRole = true;
      this.pharmacyList = this.dialogData.plist; this.tempPharmacyList = this.dialogData.plist;
    } else {
      this.repModel.PharmacyId = this.loginDetails.PharmacyId;
      this.reportForm.get('PharmacyId').setValue(this.loginDetails.PharmacyId);
    }
    if (this.dialogData.model != null && this.dialogData.model != 0) {
      this.inItList(this.dialogData.model); this.isCreate = true;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  pharmacyFilter(value) {
    let data = [];
    this.tempPharmacyList.filter(val => { if (val.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) { data.push(val); } })
    this.pharmacyList = data;
  }

  formCreation() {
    this.reportForm = this._formBuilder.group({
      Week: new FormControl(this.repModel.Week),
      PharmacyId: new FormControl(this.repModel.PharmacyId),
      TaxInvoice: new FormControl(this.repModel.TaxInvoice),
      PaymentSummary: new FormControl(this.repModel.PaymentSummary),
    })
  }

  inItList(res) {
    this.repModel = new ReportModel(res);
    this.reportForm.get('PharmacyId').setValue(this.repModel.PharmacyId);
    this.formCreation();
  }

  loadFile(fileLoader) {
    _this = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      _this.slectedImage = fileLoader.files;
      // console.log(_this.slectedImage);
      var reader: any = new FileReader();
      reader.addEventListener("load", function () {
        var check = reader.result.substring(0, 27)
        if (check == "data:application/pdf;base64") {
          _this.base64Image = reader.result;
          _this.repModel.B64string = reader.result;
          _this.repModel.TaxInvoice = file.name;
          _this.rfile = file.name;
        }
        else {
          _this.apiServices.showSnack('Please choose pdf file format');
          _this.repModel.TaxInvoice = '';
          return;
        }

      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  preUpload(event) {
    let file = event.target.files[0];
    if (event.target.files.length > 0) { }
    this.repModel.TaxInvoice = file.name;
  }

  loadFile1(fileLoader) {
    // fileLoader.click();
    _this = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      _this.slectedImage2 = fileLoader.files;
      // console.log(_this.slectedImage2);
      var reader: any = new FileReader();
      reader.addEventListener("load", function () {
        var check = reader.result.substring(0, 27)
        if (check == "data:application/pdf;base64") {
          _this.base64Image = reader.result;
          _this.repModel.B64string2 = reader.result;
          _this.repModel.PaymentSummary = file.name;
          _this.rfile2 = file.name;
        } else {
          _this.apiServices.showSnack('Please choose pdf file format');
          _this.repModel.PaymentSummary = '';
          return;

        }

      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  preUpload1(event) {
    let file = event.target.files[0];
    if (event.target.files.length > 0) { }
    this.repModel.PaymentSummary = file.name;
  }

  onSave(): void {
    if (this.reportForm.value.Week == null || this.reportForm.value.Week == undefined || this.reportForm.value.Week == '') {
      this.apiServices.showSnack('Week is required');
      return;
    }

    if ((this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) && this.reportForm.value.PharmacyId == null || this.reportForm.value.PharmacyId == undefined || this.reportForm.value.PharmacyId == 0) {
      this.apiServices.showSnack('Please select a pharmacy');
      return;
    }
    if (this.repModel.TaxInvoice == null || this.repModel.TaxInvoice == undefined || this.repModel.TaxInvoice == '') {
      this.apiServices.showSnack('Please Upload TaxInvoice');
      return;
    }
    if (this.repModel.PaymentSummary == null || this.repModel.PaymentSummary == undefined || this.repModel.PaymentSummary == '') {
      this.apiServices.showSnack('Please Upload PaymentSummary');
      return;
    }

    if (this.repModel.ReportId == null || this.repModel.ReportId <= 0) {
      var that = this; var tdate = this.datepipe.transform(new Date(that.reportForm.value.Week), 'dd/MM/yyyy')
      var filterby = this.dialogData.reportList.filter(function (val) { return val.PharmacyId == that.reportForm.value.PharmacyId && that.datepipe.transform(new Date(val.Week), 'dd/MM/yyyy') == tdate; });
      if (filterby.length > 0) {
        this.apiServices.showSnack('Same week and pharmacy already exists');
        return;
      }
    }

    this.commonServices.visibility = "shown"; this.edited = false; this.commonServices.backDrpCls();
    var list = {
      Week: this.reportForm.value.Week,
      PharmacyId: this.reportForm.value.PharmacyId,
      ReportId: this.repModel.ReportId,
      TaxInvoice: this.repModel.TaxInvoice,
      PaymentSummary: this.repModel.PaymentSummary,
      B64string2: this.repModel.B64string2,
      B64string: this.repModel.B64string,
      RoleId: this.loginDetails.RoleId,
      PharmacyGroupUserId: this.loginDetails.PharmacyGroupUserId,
      PharmacyGrpId: this.loginDetails.PharmacyGrpId,
      UserId: this.loginDetails.UserId
    }
    // this.dialogRef.close(null);
    this.apiServices.Post(list, this.url + "Post").subscribe((res: any) => {
      // this.pharmacyList = res.pharmacy_list;
      this.apiServices.showSnack(res.model.ErroMessage);
      if (res.flag != 1) { this.edited = true; this.commonServices.visibility = "hidden"; return; }
      // this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; }
      // this.router.onSameUrlNavigation = 'reload';
      // this.router.navigate(['/app/masters/new-report-v2']);
      this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden"; this.cdRef.detectChanges(); this.dialogRef.close(res);
    }, err => {
      this.commonServices.backSetCls(false); this.apiServices.showSnack(GlobalConstant.savefailed);
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
    });
  }

  goBack() {
    this.dialogRef.close(null);
  }

}
