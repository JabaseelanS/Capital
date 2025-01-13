import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiServices } from '../../../../views/services/api.services';
import { CommonServices } from '../../../../views/services/common';
import { environment } from '../../../../../environments/environment.prod';
import { AlertDialogComponent } from '../../../../views/pages/dialogs/alert-dialog/alert.dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { InviteModel } from './invite.model';
import { Validators } from '@angular/forms';

const branch = window['branch'];
@Component({
  selector: 'pp-invite-link-popup',
  templateUrl: './invite-link-popup.component.html',
  styleUrls: ['./invite-link-popup.component.scss']
})
export class InviteLinkPopupComponent implements OnInit {
  rippleColor: string = "#ffdcda";
  mobileno: any = "";
  errorMessage = "";
  moberr = "";
  fnameerr = "";
  lnameerr = "";
  isValid = false;
  firstname = "";
  lastname = "";
  PharmacyId = 0;
  userdetails: any;
  pharmacyList = [];
  inviteForm: FormGroup;
  inviteModel: InviteModel;
  isRole = false;
  MobLength = 11;
  public mobMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public expMask = [/[0-1]/, /[0-9]/, '/', /[2-9]/, /\d/]; ///, /[2-9]/, /\d/];
  constructor(public dialogRef: MatDialogRef<InviteLinkPopupComponent>,
    private dialog: MatDialog,
    public commonServices: CommonServices,
    private cdRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    // @Inject(MAT_DIALOG_DATA) public modalData: any,
    private apiServices: ApiServices) {
    this.inviteModel = new InviteModel({});
  }

  ngOnInit() {
    this.userdetails = JSON.parse(localStorage.getItem("userdetails"));
    if (this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5) {
      this.isRole = true; this.inItList();
    } else {
      this.inviteModel.PharmacyId = this.userdetails.PharmacyId;
    }
    this.formCreation();
  }

  formCreation() {
    this.inviteForm = this._formBuilder.group({
      MobileNo: new FormControl(this.inviteModel.MobileNo, [Validators.required]),
      PharmacyId: new FormControl(this.inviteModel.PharmacyId),
      FirstName: new FormControl(this.inviteModel.FirstName, Validators.required),
      LastName: new FormControl(this.inviteModel.LastName, Validators.required),
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  show(show: string): void {
    this.dialogRef.close(3);
  }

  createUrl() {
    if (this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5) {
      if (this.inviteForm.value.PharmacyId == null || this.inviteForm.value.PharmacyId == undefined || this.inviteForm.value.PharmacyId <= 0) {
        this.apiServices.showSnackBy('Please choose the pharmacy', 'custom-style');
        return;
      }
    }
    this.inviteForm.value.MobileNo = this.commonServices.validDigRep(this.inviteForm.value.MobileNo)
    var validby = this.commonServices.validByMobileNo(this.inviteForm.value.MobileNo);
    if (validby == 1) {
      // this.inviteForm.controls['MobileNo'].setErrors({ 'required': true });
      this.inviteForm.controls['MobileNo'].markAsTouched()
      return;
    }
    if (validby == 3) {
      this.inviteForm.controls['MobileNo'].setErrors({ 'pattern': true });
      return;
    }
    if (validby == 2) {
      if (this.inviteForm.value.MobileNo.charAt(0) != 0) { this.inviteForm.value.MobileNo = "0" + this.inviteForm.value.MobileNo; }
    } else {
      this.inviteForm.controls['MobileNo'].setErrors({ 'pattern': true });
      return;
    }

    if (this.inviteForm.value.FirstName == undefined || this.inviteForm.value.FirstName == null || this.inviteForm.value.FirstName == "") {
      this.apiServices.showSnackBy('Please enter the first name', 'custom-style');
      return;
    }

    if (this.inviteForm.value.LastName == undefined || this.inviteForm.value.LastName == null || this.inviteForm.value.LastName == "") {
      this.apiServices.showSnackBy('Please enter the last name', 'custom-style');
      return;
    }

    let _that = this;
    var list = {
      MobileNo: this.inviteForm.value.MobileNo,
      FirstName: this.inviteForm.value.FirstName,
      LastName: this.inviteForm.value.LastName,
      InviteUrl: "",
      PharmacyId: this.inviteForm.value.PharmacyId,
      RoleId: this.userdetails.RoleId,
      PharmacyIdGrp: this.userdetails.PharmacyGrpId,
      IsActiveInvite: false,
      PharmacyGroupUserId: this.userdetails.PharmacyGroupUserId,
    }
    this.apiServices.Post(list, 'AppOrder/sendSMSAppLink').subscribe(res => {
      var list = res.flag ? 1 : 2;
      localStorage.setItem('invitecount', JSON.stringify(res.InviteCount));
      this.commonServices.apiInviteCount = res.InviteCount;
      this.commonServices.sendMessage(res.InviteCount);
      this.inviteForm.value.MobileNo = ""; this.cdRef.detectChanges(); this.dialogRef.close(list);
    }, err => {
      this.commonServices.customError(2); this.dialogRef.close(null);
    });
  }
  onChangeByMob2(mobno) {
    mobno = this.commonServices.validDigRep(mobno);
    if (mobno != null && mobno != "" && mobno != undefined) {
      var dt = this.commonServices.validByMobileNo(mobno);
      if ((mobno.charAt(0) != 0 && mobno.length == 1) || (mobno.charAt(0) != 0 && mobno.length >= 8)) {
        this.mobMask = this.commonServices.auX(mobno);
        this.MobLength = 11;
        if (mobno.length != this.MobLength && dt != 2) { this.inviteForm.controls['MobileNo'].setValidators([Validators.minLength(11)]); this.inviteForm.controls['MobileNo'].setErrors({ 'pattern': true }); }
      }
      else if ((mobno.charAt(0) == 0 && mobno.length == 2) || (mobno.charAt(0) == 0 && mobno.length >= 9)) {
        this.mobMask = this.commonServices.auX(mobno);
        this.MobLength = 12;
        if (mobno.length != this.MobLength && dt != 2) { this.inviteForm.controls['MobileNo'].setValidators([Validators.minLength(11)]); this.inviteForm.controls['MobileNo'].setErrors({ 'pattern': true }); }
      }
    }
  }

  onChangeByMob() {
    var mobno = this.mobileno;
    if (mobno != null && mobno != "" && mobno != undefined && mobno.replace(/^0+/, '').length >= 9) {
      if (mobno.length <= 9 && mobno.charAt(0) != 0) { mobno = "0" + mobno; }
      this.apiServices.GetList("AppOrder/GetSearchByMobBlock?cmob=" + mobno).subscribe((res: any) => {
        if (res.value == 1) {
          var data = {
            closebtn: true,
            btnCancelText: '',
            btnOkText: 'Ok',
            title: "Existing customer",
            message: "Customer already registered.",
            height: "200px",
            flag: 3,
            id: 0,
            list: null
          }
          // this.alertDialog(data);
        } else if (res.value == 3) {
          this.inviteForm.get('MobileNo').setValue("");
          this.apiServices.showSnack(res.ErroMessage);
        }
      }, err => {
        this.commonServices.customError(1);
      });
    }
  }

  inItList() {
    this.apiServices.GetList("AppOrder/GetPharmacyByRole?pharmacygrpid=" + this.userdetails.PharmacyGrpId + "&roleid=" + this.userdetails.RoleId + "&phadminid=" + this.userdetails.UserId).subscribe((res: any) => {
      this.pharmacyList = res;
    }, err => {

    });
  }

  alertDialog(data) {
    var that = this;
    this.dialog.open(AlertDialogComponent, {
      disableClose: data.closebtn,
      data: data,
      width: ' 380px',
      height: data.height
    }).afterClosed().subscribe(val => {
      that.reset();
    });
  }

  reset() {
    this.inviteForm.value.MobileNo = ""; this.inviteForm.value.FirstName = ""; this.inviteForm.value.LastName = "";
  }
}
