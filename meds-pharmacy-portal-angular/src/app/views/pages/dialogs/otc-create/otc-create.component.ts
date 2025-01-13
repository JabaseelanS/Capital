import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../services/common';
import { ApiServices } from '../../../services/api.services';
import { OtcPrice } from './otc-model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'pp-otc-create',
  templateUrl: './OTC-create.component.html',
  styleUrls: ['./OTC-create.component.scss']
})
export class OtcCreateComponent implements OnInit {
  style = false;
  PharmacyList: any;
  testform: FormGroup;
  testmodel: OtcPrice;
  edited = true;
  url = "OTC/"
  constructor(public apiService: ApiServices,
    public dialogRef: MatDialogRef<OtcCreateComponent>, private formbuilder: FormBuilder,
    public commonServices: CommonServices, @Inject(MAT_DIALOG_DATA) public testdata: any,
    public datepipe: DatePipe) { }

  ngOnInit() {
    this.testmodel = new OtcPrice(this.testdata);
    this.formcreation();
    if (this.testdata.user.RoleId == 3 || this.testdata.user.RoleId == 4) {
      this.testmodel = new OtcPrice(this.testdata.model);
      this.formcreation();
      this.testform.controls['Ean'].disable();
      this.style = true;
    }
    else if (this.testdata.user.RoleId == 2 || this.testdata.user.RoleId == 5 || this.testdata.user.RoleId == 1) {
      this.testmodel = new OtcPrice(this.testdata.model);
      var pharmacyName = this.testdata.phlist.filter(name => name.PharmacyId == this.testdata.phid);
      if (pharmacyName.length != 0) {
        this.testmodel.Pharmacy = pharmacyName[0].PharmacyName
      }
      this.formcreation();
      this.testform.controls['Pharmacy'].disable();
      this.testform.controls['Ean'].disable();
    }
  }

  close(): void {
    this.dialogRef.close(null);
  }

  submit() {
    if (this.testform.value.Price === null || this.testform.value.Price === undefined || this.testform.value.Price === "") {
      this.apiService.showSnack('Enter the Price'); return;
    }
    if (this.testform.value.Stock === null || this.testform.value.Stock === undefined || this.testform.value.Stock === "") {
      this.apiService.showSnack('Enter the Stock'); return;
    }
    if (this.testdata.user.RoleId == 2 || this.testdata.user.RoleId == 5 || this.testdata.user.RoleId == 1) {
      this.testform.controls['Pharmacy'].enable();
      this.testform.controls['Pharmacy'].setValue(this.testdata.phid);
    }
    this.testform.controls['OTCId'].setValue(this.testmodel.OTCId);
    this.commonServices.visibility = "shown"; this.commonServices.backDrpCls(); this.testform.controls['Ean'].enable();
    this.apiService.Post(this.testform.value, this.url + 'UpdateOtcPrice/' + this.testdata.phid).subscribe(response => {
      this.dialogRef.close(response);
    }, error => {
      this.commonServices.customError(1);
    })
  }

  formcreation() {
    this.testform = this.formbuilder.group({
      Pharmacy: new FormControl(this.testmodel.Pharmacy, [Validators.required]),
      Ean: new FormControl(this.testmodel.Ean, [Validators.required]),
      Price: new FormControl(this.testmodel.Price, [Validators.required]),
      MedicineName: new FormControl(this.testmodel.MedicineName, [Validators.required]),
      Stock: new FormControl(this.testmodel.Stock, [Validators.required]),
      IsActive: new FormControl(this.testmodel.IsActive),
      OTCId: new FormControl(this.testmodel.OTCId)
    });
  }

  setDecimal(flag, e) {
    var val = e.target.value || null;
    if (val == null || val == undefined) {
      return false;
    }
    val = parseFloat(val).toFixed(2);
    if (flag == 1) {
      this.testform.get('Price').setValue(val);
    }
  }

}



