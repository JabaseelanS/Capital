import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { ApiServices } from '../../../../../app/views/services/api.services';
import { CommonServices } from '../../../../../app/views/services/common';
import { ForgotPWDModel } from './forgot.pwd.model';
const DEMO_PARAMS = {
  EMAIL: '',
  PASSWORD: '',
  CONFIRM_PASSWORD: ''
};
@Component({
  selector: 'pp-forgot-pwd-dialog',
  templateUrl: './forgot-pwd-dialog.component.html',
  styleUrls: ['./forgot-pwd-dialog.component.scss'],
})
export class ForgotPwdDialogComponent implements OnInit {
  verifyForm: FormGroup;
  pwdForm: FormGroup;
  emailForm: FormGroup;
  hide = false;
  hide1 = false;
  tabval = 1;
  forgotModel: ForgotPWDModel;
  inputHtml: any;
  isEnter = false;
  errorMessage = "Incorrect code. Please try again.";
  @Output() input: EventEmitter<string> = new EventEmitter<string>();
  TAB_KEY_CODE = 9456;
  ENTER_KEY_CODE = 13;
  ktp = '0000';
  passwordNotMatch = true;
  url = '/Authenticate';
  tempList: any;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ForgotPwdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public commonService: CommonServices,
    public elementRef: ElementRef,
    private apiService: ApiServices,
    private cdf: ChangeDetectorRef, private dialog: MatDialog,
  ) {
    this.tempList = this.dialogData;
    this.formCreate();
  }

  ngOnInit() {
    this.formCreate();
  }

  formCreate() {
    this.pwdForm = this.fb.group({
      password: [DEMO_PARAMS.PASSWORD, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])],
      confirmpassword: [DEMO_PARAMS.CONFIRM_PASSWORD, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])],
    },
      {
        validators: this.password.bind(this)
      }
    );
  }

  password(formGroup: FormGroup) {
    const pwd = formGroup.value.password;
    const cpwd = formGroup.value.confirmpassword;
    return pwd === cpwd ? this.passwordNotMatch = true : this.passwordNotMatch = false;
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
  /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
  isControlHasError(controlName: string, validationType: string): boolean {
    // debugger;
    const control = this.pwdForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  savePwd(pwd, cpwd, e) {

    if (pwd == null || pwd == "" || pwd == undefined) {
      this.apiService.showSnack("Password is required."); e.preventDefault();
      return;
    }
    if (cpwd == null || cpwd == "" || cpwd == undefined) {
      this.apiService.showSnack("Confirm password is required."); e.preventDefault();
      return;
    }
    if (pwd.toString().trim().toLowerCase() != cpwd.toString().trim().toLowerCase()) {
      this.apiService.showSnack("Password is mismatched."); e.preventDefault();
      return;
    }
    this.tempList.UserPassword = cpwd;
    this.apiService.Post(this.tempList, environment.apiEndpoint + this.url + '/UpdatePwd').subscribe((res: any) => {
      if (res != null) {
        this.apiService.showSnack('Password changed successfully.'); this.closeDialog();
      }
      else {
        this.apiService.showSnack('Failed to change password, please try again.'); this.closeDialog();
      }
    }, err => {
      this.closeDialog();
      this.commonService.customError(1); this.commonService.visibility = 'hidden';
    });
  }

  reSet1() {
    this.pwdForm.get('password').setValue('');
    this.pwdForm.get('confirmpassword').setValue('');
  }



}


//OTP Section

@Component({
  selector: 'pp-forgot-otp',
  templateUrl: './forgot-otp-dialog.component.html',
  styleUrls: ['./forgot-pwd-dialog.component.scss'],
})
export class ForgotOtpDialogComponent implements OnInit {

  verifyForm: FormGroup;
  forgotModel: ForgotPWDModel;
  errorMessage = "Incorrect code. Please try again.";
  public settings = {
    length: 4,
    numbersOnly: true,
    timer: 30
  }
  inputHtml: any;
  isEnter = false;
  hide = false;
  hide1 = false;
  tabval = 1;
  @ViewChild('VerifyOTP1', { static: false }) VerifyOTP1;
  @Output() input: EventEmitter<string> = new EventEmitter<string>();
  TAB_KEY_CODE = 9456;
  ENTER_KEY_CODE = 13;
  timerFlag = false;
  timeLeft = 30;
  interval;
  ktp = '0000';
  url = '/Authenticate';
  emailData: any;
  tempList: any;
  constructor(public dialogRef: MatDialogRef<ForgotOtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    public commonService: CommonServices,
    public elementRef: ElementRef,
    private apiService: ApiServices,
    private cdf: ChangeDetectorRef,
    private dialog: MatDialog,) {
    console.log(this.dialogData);

    this.emailData = this.dialogData;
    this.forgotModel = new ForgotPWDModel();
    this.formCreate();
  }

  ngOnInit() {
    setTimeout(() => {
      document.getElementById("VerifyOTP1").focus();
    }, 200);
  }

  formCreate() {
    this.verifyForm = this.fb.group({
      VerifyOTP1: new FormControl(this.forgotModel.VerifyOTP1),
      VerifyOTP2: new FormControl(this.forgotModel.VerifyOTP2),
      VerifyOTP3: new FormControl(this.forgotModel.VerifyOTP3),
      VerifyOTP4: new FormControl(this.forgotModel.VerifyOTP4),
    });
  }

  backToEmail() {
    this.dialogRef.close(null);
    this.dialog.open(ForgotEmailDialogComponent, {
      disableClose: true,
      data: this.emailData,
      width: ' 500px',
      height: ' 365px',
      panelClass: 'padding-0'
      // height: data.height
    });
    return
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  resendCode(val) {
    if (val.toString().trim().toLowerCase() == 'admin@packapill.com') {
      this.apiService.showSnack("You don't have permission to access this email id.");
      return;
    }

    if (val == "" || val == null || val == undefined) {
      this.apiService.showSnack("Email id is required.");
      return;
    }

    this.apiService.GetList(environment.apiEndpoint + this.url + '/ForgotPwd?email=' + val).subscribe((res: any) => {
      if (res != null) {
        this.emailData = res;
        this.apiService.showSnack("Code sent succesfully.");
        this.startTimer();
      }
      else {
        this.apiService.showSnack("Invalid email id.");
        return;
      }
    }, err => {
      this.commonService.customError(1); this.cdf.detectChanges();
    });
  }

  forceUpdateMethod(val1) {
    if (val1 == null) return;
    var val = new String(val1);
    if (val.length == 4) {
      event.stopPropagation();
      const controls = this.verifyForm.controls;
      controls['VerifyOTP1'].setValue(val[0]);
      controls['VerifyOTP2'].setValue(val[1]);
      controls['VerifyOTP3'].setValue(val[2]);
      controls['VerifyOTP4'].setValue(val[3]);
      //this.verify();
    }
  }

  reSet() {
    this.verifyForm.get('VerifyOTP1').setValue('');
    this.verifyForm.get('VerifyOTP2').setValue('');
    this.verifyForm.get('VerifyOTP3').setValue('');
    this.verifyForm.get('VerifyOTP4').setValue('');
    document.getElementById('VerifyOTP1').focus();
  }

  onKeyPress(event) {
    if (event.target.value.length > 1) {
      event.target.value = "";
    }
  }

  startTimer(): void {
    this.timeLeft = 30; this.timerFlag = true;
    this.interval = setInterval(() => {
      if (this.timeLeft === 0) {
        this.timerFlag = false; clearInterval(this.interval);
      } else if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    }, 1000);
  }


  otpController(event, next, prev, first) {
    this.inputHtml = next; this.tabval = 1;

    if (event.which == 8) { event.target.value = ""; document.getElementById(prev.id).focus(); return; } // backspace

    if (event.which == 39 && event.target.value.length <= 0) { return; } //arrowright
    if (event.which == 97 || event.which == 98 || event.which == 99 || event.which == 100 || event.which == 101 || event.which == 102 || event.which == 103 || event.which == 104 || event.which == 105 && event.target.value.length <= 0) {
      event.target.value = event.key;

    }
    if (event.target.value.length > 2) {
      event.target.value = "";
    }

    if (event.target.value.length > 1) {
      event.target.value = event.target.value.slice(1);
    }

    if (event.target.value.length < 1 && prev.id != "") {
      return "";
    }
    if (event.target.value.length < 1 && prev.id) {
      document.getElementById(prev.id).focus();
    }
    else if (next && event.target.value.length > 0) {
      if (!first) {
        document.getElementById(next.id).focus();
        // const k = this.elementRef.nativeElement[next.id];
        // k.setFocus();
        // next.id.setFocus();
      } else { this.tabval = -1; }
    }

    if (this.commonService.isValid) { this.commonService.isValid = false; }
    if (event.target.value != "" && event.target.value != null && event.target.value != undefined && event.srcElement.id == "VerifyOTP4" && event.target.value.length > 0) {
      this.verifyForm.get('VerifyOTP4').setValue(event.target.value); this.inputHtml = next;
      this.verify(event);
      // return 0;
    }
  }

  public onInputChange(e) {
    console.log(e);
    if (e.length == this.settings.length) {
      // e will emit values entered as otp and,
      console.log('otp is', e);
    } else if (e == -1) {
      // if e == -1, timer has stopped
      console.log(e, 'resend button enables');
    } else if (e == -2) {
      // e == -2, button click handle
      console.log('resend otp');
    }
  }

  verify(e) {

    this.commonService.isValid = false; this.isEnter = true;
    const controls = this.verifyForm.controls;
    var otp1 = controls['VerifyOTP1'].value;
    var otp2 = controls['VerifyOTP2'].value;
    var otp3 = controls['VerifyOTP3'].value;
    var otp4 = controls['VerifyOTP4'].value;
    otp1 = otp1 == null || otp1 == undefined ? "" : otp1.toString(); otp2 = otp2 == null || otp2 == undefined ? "" : otp2.toString();
    otp3 = otp3 == null || otp3 == undefined ? "" : otp3.toString(); otp4 = otp4 == null || otp4 == undefined ? "" : otp4.toString();
    var otp = otp1 + otp2 + otp3 + otp4;
    if (otp == '') {
      setTimeout(() => {
        this.commonService.isValid = true; this.isEnter = false; this.reSet();
        this.errorMessage = "Enter code sent to your Email."; e.preventDefault();
      });
      return;
    }
    else if (otp1 == "" || otp2 == "" || otp3 == "" || otp4 == "") {
      setTimeout(() => {
        this.isEnter = false; this.commonService.isValid = true;
        this.reSet();
        this.errorMessage = "Incorrect code. Please try again.";
      });
      return;
    }

    this.apiService.GetList(environment.apiEndpoint + this.url + '/userVerifyOTP?value=' + otp + "&email=" + this.emailData.UserEmail).subscribe(
      (response: any) => {
        if (response) {
          this.dialogRef.close(null);
          this.dialog.open(ForgotPwdDialogComponent, {
            disableClose: true,
            data: this.emailData,
            width: ' 500px',
            height: ' 365px',
            panelClass: 'padding-0'
            // height: data.height
          });
        }
        else {
          this.commonService.isValid = true; this.reSet();
          this.apiService.showSnack("Incorrect code. Please try again.");
        }
      });
  }
}

@Component({
  selector: 'pp-forgot-email',
  templateUrl: './forgot-email-dialog.component.html',
  styleUrls: ['./forgot-pwd-dialog.component.scss'],
})
export class ForgotEmailDialogComponent implements OnInit {

  emailForm: FormGroup;
  pwdForm: FormGroup;
  passwordNotMatch = true;
  url = '/Authenticate';
  tempList: any;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ForgotEmailDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public commonService: CommonServices,
    public elementRef: ElementRef,
    private apiService: ApiServices,
    private cdf: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    console.log(this.dialogData);
    this.formCreate();
  }

  ngOnInit() {
    this.formCreate();
    if (this.dialogData != null && this.dialogData != undefined && this.dialogData != '') {
      this.emailForm.controls['email'].setValue(this.dialogData.UserEmail);
    }
  }

  formCreate() {
    this.emailForm = this.fb.group({
      email: [DEMO_PARAMS.EMAIL, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320),
        Validators.pattern(this.commonService.emailPattern) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
      ])]
    });
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }


  isControl01HasError(controlName: string, validationType: string): boolean {
    // debugger;
    const control01 = this.emailForm.controls[controlName];
    if (!control01) {
      return false;
    }

    const result = control01.hasError(validationType) && (control01.dirty || control01.touched);
    return result;
  }

  emailCode(val, e) {
    if (val.email.toString().trim().toLowerCase() == 'admin@packapill.com') {
      this.apiService.showSnack("You don't have permission to access this email id.");
      e.preventDefault();
      return;
    }

    if (val.email == "" || val.email == null || val.email == undefined) {
      this.apiService.showSnack("Email id is required."); e.preventDefault();
      return;
    }

    this.apiService.GetList(environment.apiEndpoint + this.url + '/ForgotPwd?email=' + val.email).subscribe((res: any) => {
      if (res != null) {
        this.tempList = res;
        this.dialogRef.close(null);
        this.dialog.open(ForgotOtpDialogComponent, {
          disableClose: true,
          data: res,
          width: ' 500px',
          height: ' 365px',
          panelClass: 'padding-0'
          // height: data.height
        });
      }
      else {
        this.apiService.showSnack("Invalid email id.");
        return;
      }
    }, err => {
      this.commonService.customError(1); this.cdf.detectChanges();
    });
  }

}