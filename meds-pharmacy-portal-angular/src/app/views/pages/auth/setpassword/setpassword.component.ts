// Angular
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
// Store
// Auth
import { AuthDataContext } from '../../../../core/auth';
//Login Service
import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatDialog } from '@angular/material';
import { ApiServices } from '../../../../views/services/api.services';
import { CommonServices } from '../../../../views/services/common';
import { environment } from '../../../../../environments/environment';
import { SwPush } from '@angular/service-worker';
import { ForgotPwdDialogComponent } from '../../dialogs/forgot-pwd-dialog/forgot-pwd-dialog.component';
import { SetPasswordModel } from '../login/models/setpasswordmodel';
import { ForgotPWDModel } from '../../dialogs/forgot-pwd-dialog/forgot.pwd.model';
import { Router } from '@angular/router';
/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
  EMAIL: '',
  PASSWORD: '',
  CONFIRMPASSWORD: ''
};

@Component({
  selector: 'pp-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SetpasswordComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = "BD9REiUQJ8fpietjMJsUfOl7IkcI99ldJ8jTsNwqvHd4UMvkHydaCkikyr33jZiwYBqkDdmMJqPO3tpaeNwfCBg";
  today: number = Date.now();
  // For Password Field
  hide = false;
  // Public params
  PassForm: FormGroup
  OTPForm: FormGroup;
  SetPassForm: FormGroup;
  tempList: any = [];
  // loading = false;
  isLoggedIn$: Observable<boolean>;
  AuthDataContext: AuthDataContext;
  errors: any = [];
  LoginModel: SetPasswordModel = new SetPasswordModel();
  private unsubscribe: Subject<any>;
  url = '/Authenticate';
  private returnUrl: any;
  actionButtonLabel: string = 'Retry';
  action: boolean = false;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  timerFlag = false;
  timeLeft = 30;
  interval;
  tabval = 1
  isEnter = false;
  hide1 = false;
  inputHtml: any;
  errorMessage = "Incorrect code. Please try again.";
  forgotModel: ForgotPWDModel;
  showOTP = false;
  showPWD = false;
  disBtn = false;
  @ViewChild('VerifyOTP1', { static: false }) VerifyOTP1;
  // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
   * Component constructor
   *
   * @param router: Router
   * @param auth: AuthService
   * @param authNoticeService: AuthNoticeService
   * @param translate: TranslateService
   * @param store: Store<AppState>
   * @param fb: FormBuilder
   * @param cdr
   * @param route
   */
  constructor(
    private fb: FormBuilder,
    private apiService: ApiServices,
    private router: Router,
    public commonServices: CommonServices,
    private cdf: ChangeDetectorRef,
    public swPush: SwPush,
    private dialog: MatDialog,
  ) {
    this.forgotModel = new ForgotPWDModel();
  }

  ngOnInit(): void {
    // this._loginservice.isLogin = true;
    this.initLoginForm();

  }


  initLoginForm() {
    this.PassForm = this.fb.group({
      email: [DEMO_PARAMS.EMAIL, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
      ])
      ],
    });
  }
  passwdForm() {
    this.SetPassForm = this.fb.group({
      password: [DEMO_PARAMS.PASSWORD, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])],
      confirmPassword: [DEMO_PARAMS.CONFIRMPASSWORD, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
      ]
    });
  }
  otpForminit() {
    this.OTPForm = this.fb.group({
      VerifyOTP1: new FormControl(this.forgotModel.VerifyOTP1),
      VerifyOTP2: new FormControl(this.forgotModel.VerifyOTP2),
      VerifyOTP3: new FormControl(this.forgotModel.VerifyOTP3),
      VerifyOTP4: new FormControl(this.forgotModel.VerifyOTP4),
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    // debugger;
    const control = this.PassForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  onKeyPress(event) {
    if (event.target.value.length > 1) {
      event.target.value = "";
    }
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

    if (this.commonServices.isValid) { this.commonServices.isValid = false; }
    if (event.target.value != "" && event.target.value != null && event.target.value != undefined && event.srcElement.id == "VerifyOTP4" && event.target.value.length > 0) {
      this.OTPForm.get('VerifyOTP4').setValue(event.target.value); this.inputHtml = next;
      this.verify(event);
      // return 0;
    }
  }

  editEm() {
    this.showPWD = false;
    this.showOTP = false;
    this.disBtn = false;
    this.timerFlag = false;
    this.rest();
  }
  rest() {
    this.OTPForm.get('VerifyOTP1').setValue('');
    this.OTPForm.get('VerifyOTP2').setValue('');
    this.OTPForm.get('VerifyOTP3').setValue('');
    this.OTPForm.get('VerifyOTP4').setValue('');
    //document.getElementById('VerifyOTP1').focus();
  }
  savePwd(pwd, cpwd, e) {
    console.log(pwd, cpwd, e);

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
    // this.tempList.UserName = this.PassForm.controls['email'].value;
    this.tempList.UserPassword = cpwd;
    this.apiService.Post(this.tempList, environment.apiEndpoint + this.url + '/UpdatePwd').subscribe((res: any) => {
      if (res != null) {
        this.apiService.showSnack('Password changed successfully.');
        this.editEm();
        this.router.navigateByUrl("/auth/login");
      }
      else {
        this.apiService.showSnack('Failed to change password, please try again.');
      }
    }, err => {
      this.commonServices.customError(1); this.commonServices.visibility = 'hidden';
    });
  }
  verify(e) {

    this.commonServices.isValid = false; this.isEnter = true;
    const controls = this.OTPForm.controls;
    var otp1 = controls['VerifyOTP1'].value;
    var otp2 = controls['VerifyOTP2'].value;
    var otp3 = controls['VerifyOTP3'].value;
    var otp4 = controls['VerifyOTP4'].value;
    otp1 = otp1 == null || otp1 == undefined ? "" : otp1.toString(); otp2 = otp2 == null || otp2 == undefined ? "" : otp2.toString();
    otp3 = otp3 == null || otp3 == undefined ? "" : otp3.toString(); otp4 = otp4 == null || otp4 == undefined ? "" : otp4.toString();
    var otp = otp1 + otp2 + otp3 + otp4;
    if (otp == '') {
      setTimeout(() => {
        this.commonServices.isValid = true; this.isEnter = false; this.reSet();
        this.errorMessage = "Enter code sent to your Email."; e.preventDefault();
      });
      return;
    }
    else if (otp1 == "" || otp2 == "" || otp3 == "" || otp4 == "") {
      setTimeout(() => {
        this.isEnter = false; this.commonServices.isValid = true;
        this.reSet();
        this.errorMessage = "Incorrect code. Please try again.";
      });
      return;
    }

    this.apiService.GetList(environment.apiEndpoint + this.url + '/userVerifyOTP?value=' + otp + "&email=" + this.PassForm.controls['email'].value).subscribe(
      (response: any) => {
        if (response) {
          this.passwdForm();
          this.rest();
          this.showOTP = false;
          this.showPWD = true;
          this.disBtn = true;
        }
        else {
          this.commonServices.isValid = true; this.reSet();
          this.apiService.showSnack("Incorrect code. Please try again.");
        }
      });
  }
  resendCode() {
    var val = this.PassForm.controls['email'].value
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
        console.log(res);
        this.tempList = res;
        this.otpForminit();
        this.showOTP = true;
        this.apiService.showSnack("Code sent succesfully.");
        if (this.interval != undefined && this.interval != null)
          clearInterval(this.interval);
        this.startTimer();
        this.cdf.detectChanges();
        document.getElementById('VerifyOTP1').focus();
      }
      else {
        this.apiService.showSnack("Invalid email id.");
        return;
      }
    }, err => {
      this.commonServices.customError(1); this.cdf.detectChanges();
    });
  }

  forceUpdateMethod(val1) {
    if (val1 == null) return;
    var val = new String(val1);
    if (val.length == 4) {
      event.stopPropagation();
      const controls = this.OTPForm.controls;
      controls['VerifyOTP1'].setValue(val[0]);
      controls['VerifyOTP2'].setValue(val[1]);
      controls['VerifyOTP3'].setValue(val[2]);
      controls['VerifyOTP4'].setValue(val[3]);
      //this.verify();
    }
  }

  reSet() {
    this.OTPForm.get('VerifyOTP1').setValue('');
    this.OTPForm.get('VerifyOTP2').setValue('');
    this.OTPForm.get('VerifyOTP3').setValue('');
    this.OTPForm.get('VerifyOTP4').setValue('');
    document.getElementById('VerifyOTP1').focus();
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
}
