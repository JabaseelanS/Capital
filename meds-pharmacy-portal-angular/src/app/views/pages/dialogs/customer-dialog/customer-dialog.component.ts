import { ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ApiServices } from '../../../services/api.services';
import { CommonServices } from '../../../services/common';
import { SubheaderService } from '../../../../../app/core/_base/layout';
import { CreateOrderModel } from '../../masters/order-2.0/create-order/create-order.model';
import { DatePipe } from '@angular/common';
import { MapsAPILoader } from '@agm/core';
import { GlobalConstant } from '../../globals/globalvariables';
import { AlertDialogComponent } from '../alert-dialog/alert.dialog.component';

declare var google: any;

@Component({
  selector: 'pp-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss'],
  providers: [DatePipe]
})
export class CustomerDialogComponent implements OnInit {

  pharmacyList = [];
  patientList = [];
  prePharId = 0;
  // pharmacyFlag = false;
  isRole = false;
  MobLength = 12;
  public mobMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public expMask = [/[0-1]/, /[0-9]/, '/', /[2-9]/, /\d/]; ///, /[2-9]/, /\d/];
  public dateMask = [/[0-3]/, /[0-9]/, '/', /[0-1]/, /\d/, '/', /[1-2]/, /\d/, /\d/, /\d/];
  public mediMask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, ' ', /\d/, ' ', '-', ' ', /\d/];
  public consMask = [/[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/];
  public zoom: number;
  public searchControl: FormControl;
  @Input() adressType: string;
  @ViewChild("search", { static: true }) public searchElementRef: ElementRef;
  loginDetails: any;
  createCusForm: FormGroup;
  cusModel: CreateOrderModel;
  url2 = 'PharmacyCustomer/';
  url = 'Pharmacy/';
  constructor(
    public mapsAPILoader: MapsAPILoader,
    private _formBuilder: FormBuilder,
    private _subheaderService: SubheaderService,
    private router: Router,
    private apiServices: ApiServices,
    private cdRef: ChangeDetectorRef,
    public commonServices: CommonServices,
    public datepipe: DatePipe,
    public ngZone: NgZone,
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {
    this.cusModel = new CreateOrderModel();
  }

  async ngOnInit() {
    this.commonServices.backSetCls(false); this.loginDetails = JSON.parse(localStorage.getItem("userdetails"));
    this.pharmacyList = this.modalData.plist;
    this.cusModel = new CreateOrderModel(this.modalData.model);
    console.log(this.cusModel);
    if (this.cusModel != null) {
      this.MobLength = this.commonServices.auML(this.commonServices.convertNum(this.cusModel.MobileNo));
      this.mobMask = this.commonServices.auX(this.commonServices.convertNum(this.cusModel.MobileNo));
    }
    if (this.modalData.model != null) {
      this.cusModel.DeliveryAddress = this.modalData.model.deliveryAddress.DeliveryAdd;
    } else {
      // this.pharmacyFlag = true;
    }
    this.formCreation();
    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      this.isRole = true;
    } else {
      this.cusModel.PharmacyId = this.loginDetails.PharmacyId;
      this.createCusForm.get('PharmacyId').setValue(this.cusModel.PharmacyId);
    }
  }

  formCreation() {
    this.createCusForm = this._formBuilder.group({
      FirstName: new FormControl(this.cusModel.FirstName),
      LastName: new FormControl(this.cusModel.LastName),
      MobileNo: new FormControl(this.commonServices.convertNum(this.cusModel.MobileNo)),
      EmailId: new FormControl(this.cusModel.EmailId),
      Age: new FormControl(this.cusModel.Age),
      DeliveryAddress: new FormControl(this.cusModel.DeliveryAddress),
      IsDefault: true,
      IsPreferredPharmacy: new FormControl(this.cusModel.IsPreferredPharmacy),
      MedicareNo: new FormControl(this.cusModel.MedicareNo),
      ConcessionNo: new FormControl(this.cusModel.ConcessionNo),
      Dob: new FormControl(this.cusModel.Dob != null ? this.datepipe.transform(new Date(this.cusModel.Dob), 'dd/MM/yyyy') : ''),
      MedicareValidTo: new FormControl(this.cusModel.MedicareValidTo ? this.datepipe.transform(this.cusModel.MedicareValidTo, 'MM/yy') : ''),
      ConcessionValidTo: new FormControl(this.cusModel.ConcessionValidTo ? this.datepipe.transform(this.cusModel.ConcessionValidTo, 'MM/yy') : ''),
      Latitude: new FormControl(this.cusModel.Latitude),
      City: new FormControl(this.cusModel.City),
      State: new FormControl(this.cusModel.State),
      Pincode: new FormControl(this.cusModel.Pincode),
      Longitude: new FormControl(this.cusModel.Longitude),
      PharmacyId: new FormControl(this.cusModel.PharmacyId),
    });
  }

  deactivateCust() {
    var data = {
      closebtn: true,
      btnCancelText: 'No',
      btnOkText: 'Yes',
      title: "Deactivate Customer",
      message: "Do you want to deactivate this profile?",
      height: "200px",
      flag: 2,
      id: 0
    }
    this.alertDialog(data, this.cusModel.MobileNo);
  }


  alertDialog(data, mob) {
    this.dialog.open(AlertDialogComponent, {
      disableClose: data.closebtn,
      data: data,
      width: ' 380px',
      height: data.height
    }).afterClosed().subscribe(val => {
      if (val == 'Show') {
        var validby = this.commonServices.validByMobileNo(mob);
        if (validby == 1) {
          this.apiServices.showSnack("Enter your mobile number");
          return;
        }
        if (validby == 3) {
          this.apiServices.showSnack("Invalid mobile number");
          return;
        }
        if (validby == 2) {
          if (mob.charAt(0) != 0) { mob = "0" + mob; }
        } else {
          this.apiServices.showSnack("Invalid mobile number");
          return;
        }
        var list = {
          Mobileno: mob,
          RoleId: this.loginDetails.RoleId,
          PhadminId: this.loginDetails.UserId,
          PGId: this.loginDetails.PharmacyGrpId
        }
        this.commonServices.visibility = "shown"; this.commonServices.backDrpCls();
        this.apiServices.Post(list, this.url2 + "DeactivateCustomer").subscribe((res: any) => {
          this.commonServices.visibility = "hidden"; this.apiServices.showSnack(res.model.ErroMessage);
          if (res.flag) {
            this.commonServices.backSetCls(false); this.dialogRef.close(res);
            return;
          }
          this.commonServices.backSetCls(false);
        }, err => {
          this.commonServices.backSetCls(false); this.dialogRef.close(null);
          this.apiServices.showSnack("Profile deactivated failed. please try again"); this.commonServices.visibility = "hidden";
        });
      } else {
      }
    });
  }



  goBack() {
    this.dialogRef.close(null);
  }

  inItList(id) {
    this.apiServices.GetList(this.url + "GetPharById?cusid=" + id + "&roleid=" + this.loginDetails.RoleId).subscribe((res: any) => {
      this.pharmacyList = res;
    }, err => {

    });
  }

  save() {
    const controls = this.createCusForm.controls;
    let enterdate = '';
    if (controls['Dob'].value != '') {
      if (controls['Dob'].value.length > 8) {
        enterdate = controls['Dob'].value
      } else {
        enterdate = controls['Dob'].value[0] + controls['Dob'].value[1] + '/' + controls['Dob'].value[2] + controls['Dob'].value[3] + '/' + controls['Dob'].value[4] + controls['Dob'].value[5] + controls['Dob'].value[6] + controls['Dob'].value[7]
      }
      var dateString = new Date(this.apiServices.changeFormate(enterdate));
    } else { dateString = null; }

    var list = {
      FirstName: controls['FirstName'].value,
      LastName: controls['LastName'].value,
      Mobileno: this.commonServices.validDigRep(controls['MobileNo'].value),
      CustomerId: this.cusModel.CustomerId,
      Email: controls['EmailId'].value,
      MedicareNo: controls['MedicareNo'].value,
      Dob: dateString,
      Age: dage,
      MedicareValidTo: controls['MedicareValidTo'].value,
      IsPreferredPharmacy: controls['IsPreferredPharmacy'].value,
      IsDefault: controls['IsPreferredPharmacy'].value ? true : false,
      PreferredPharmacyId: controls['PharmacyId'].value,
      ConcessionNo: controls['ConcessionNo'].value,
      ConcessionValidTo: controls['ConcessionValidTo'].value,
      UserPassword: "123456",
      CreatedBy: this.loginDetails.UserId,
      RoleId: this.loginDetails.RoleId,
      PhadminId: this.loginDetails.PharmacyGroupUserId,
      PGId: this.loginDetails.PharmacyGrpId,
      deliveryAddress: {}
    };

    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      if (this.validBy(list.PreferredPharmacyId, "Pharmacy name")) {
        return;
      }
    } else {
      list.PreferredPharmacyId = this.loginDetails.PharmacyId;
    }

    if (this.validBy(list.FirstName, "First name")) { return; }

    if (this.validBy(list.LastName, "Last name")) { return; }

    list.FirstName = list.FirstName.toString().trim();
    list.LastName = list.LastName.toString().trim();

    var validby = this.commonServices.validByMobileNo(list.Mobileno);
    if (validby == 1) {
      this.apiServices.showSnack("Enter your mobile number");
      return;
    }
    if (validby == 3) {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }
    if (validby == 2) {
      if (list.Mobileno.charAt(0) != 0) { list.Mobileno = "0" + list.Mobileno; }
    } else {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }

    if (this.validBy(list.Email, "Email address")) { return; }

    if (list.Email != null && list.Email != "" && list.Email != undefined) {
      if (!this.commonServices.validByEmailNo(list.Email)) {
        this.apiServices.showSnack("Please enter a valid email address");
        return;
      }
    }

    list.Email = list.Email.toString().toLowerCase();

    if (enterdate == '') {
      list.Age = 0;
    } else {
      var notvaliddob = this.commonServices.isNotValidDob(enterdate);
      if (notvaliddob == 2) {
        this.apiServices.showSnack("Invalid DOB");
        return;
      }
      if (list.Dob == undefined || list.Dob == null || notvaliddob == true) {
        this.apiServices.showSnack("Invalid DOB");
        return;
      }

      var avalid = this.ageFromDOB(enterdate);
      list.Age = controls['Age'].value;
      if (!avalid || list.Age == undefined || list.Age == null) {
        this.apiServices.showSnack("Age greater than or equal 1 year. Invalid Dob.");
        return;
      }
    }

    var dob = controls['Dob'].value;
    if (dob != null && dob != "" && dob != undefined) {
      let enterdate = '';
      if (dob != '') {
        if (dob.length > 8) {
          enterdate = dob
        } else {
          enterdate = dob[0] + dob[1] + '/' + dob[2] + dob[3] + '/' + dob[4] + dob[5] + dob[6] + dob[7]
        }
      }
      var dateString = new Date(this.apiServices.changeFormate(enterdate));
      var notvaliddob = this.commonServices.isNotValidDob(enterdate);
      if (notvaliddob == 2) {
        this.apiServices.showSnack("Invalid Dob");
        return;
      }
      if (dob == undefined || dob == null || notvaliddob == true) {
        this.apiServices.showSnack("Invalid Dob");
        return;
      }

      var avalid = this.ageFromDOB(enterdate);
      var dage = controls['Age'].value;
      if (!avalid || dage == undefined || dage == null) {
        this.apiServices.showSnack("Age greater than or equal 1 year. Invalid Dob.");
        return;
      }
    }

    if ((list.MedicareNo != undefined && list.MedicareNo != "" && list.MedicareNo != null) || (list.MedicareValidTo != undefined && list.MedicareValidTo != "" && list.MedicareValidTo != null)) {
      list.MedicareNo = this.commonServices.validDigRep(list.MedicareNo);
      var s = new String(list.MedicareNo);
      if (list.MedicareNo == null || s.trim() == "" || list.MedicareNo == undefined || list.MedicareNo == "0") {
        this.apiServices.showSnack("Medicare number is required");
        return;
      }
      if (list.MedicareNo.length < 11) {
        this.apiServices.showSnack("Invalid Medicare number");
        return;
      }

      if (list.MedicareValidTo == undefined || list.MedicareValidTo == "" || list.MedicareValidTo == null) {
        this.apiServices.showSnack("Medicare validity date is required");
        return;
      }

      var mval = this.commonServices.isNotValidExp(list.MedicareValidTo);
      if (list.MedicareValidTo == undefined || list.MedicareValidTo == "" || list.MedicareValidTo == null || mval == 2) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }

      if (mval == true) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }

      list.MedicareValidTo = this.commonServices.setValidDate(this.getValidToData(list.MedicareValidTo));
    }

    if ((list.ConcessionNo != undefined && list.ConcessionNo != "" && list.ConcessionNo != null) || (list.ConcessionValidTo != undefined && list.ConcessionValidTo != "" && list.ConcessionValidTo != null)) {
      list.ConcessionNo = this.commonServices.validDigRep(list.ConcessionNo);
      list.ConcessionNo = list.ConcessionNo.toUpperCase();
      if (list.ConcessionNo == undefined || list.ConcessionNo == "" || list.ConcessionNo == null) {
        this.apiServices.showSnack("Concession number is required");
        return;
      }

      if (list.ConcessionValidTo == undefined || list.ConcessionValidTo == "" || list.ConcessionValidTo == null) {
        this.apiServices.showSnack("Concession validity date is required");
        return;
      }

      var cval = this.commonServices.isNotValidExp(list.ConcessionValidTo);
      if (cval == true) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
      else if (cval == 2) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
      list.ConcessionValidTo = this.commonServices.setValidDate(this.getValidToData(list.ConcessionValidTo));
    }
    this.commonServices.visibility = "shown"; this.commonServices.backDrpCls();
    this.apiServices.Post(list, this.url2 + "PharmCustProfile").subscribe(res => {
      this.commonServices.visibility = "hidden"; this.apiServices.showSnack(res.model.ErroMessage);
      if (res.flag == 2) {
        this.commonServices.backSetCls(false);
        return;
      }
      this.commonServices.backSetCls(false); this.dialogRef.close(res);
    }, error => {
      this.commonServices.backSetCls(false); this.dialogRef.close(null);
      this.commonServices.customError(2); this.commonServices.visibility = "hidden";
    });
  }

  changeValue(e) {
    var medicareno = this.createCusForm.controls.MedicareNo.value;
    var list = this.patientList.filter(function (val) { return val.MedicareNo == medicareno; });
    if (list.length > 0) {
      this.apiServices.showSnack("Medicare number is duplicated");
      return;
    }
  }

  validBy(val, message) {
    val = val.toString().trim();
    if (val == null || val == "" || val == undefined || val == "0") {
      this.apiServices.showSnack(message + " is required");
      return true;
    }
    return false;
  }

  closeDialog(hide: string): void {
    this.dialogRef.close(null);
  }

  getValidToData(validTo): any {
    if (validTo != null) {
      let type = typeof (validTo);
      if (type == 'string') {
        if (validTo[2] == '/') {
          return validTo;
        }
        return this.datepipe.transform(validTo, 'MM/yy');
      }
      return this.datepipe.transform(validTo, 'MM/yy');
    }
  }

  ageFromDOB(dob) {
    const controls = this.createCusForm.controls;
    if (dob == "" || dob == null || dob == undefined) { return; }
    dob = dob.replace('_', '');
    let d = this.apiServices.changeFormate(dob);
    if (dob.length == 10) {
      if (d != 'no valid') {
        var fromdate = this.datepipe.transform(d, 'dd MMM, y');
      } else {
        this.createCusForm.get('Age').setValue('');
        return false;
      }
      var fromdate = this.datepipe.transform(this.apiServices.changeFormate(dob), 'dd MMM, y');
      var now = new Date();
      var selDate = new Date(fromdate)
      var age = this.commonServices.setAge(now, selDate);
      if (age > 0) {
        this.createCusForm.get('Age').setValue(age);
      } else {
        this.createCusForm.get('Age').setValue('');
        return false;
      }
    } else {
      this.createCusForm.get('Age').setValue('');
      return false;
    }
    return true;
  }

}
