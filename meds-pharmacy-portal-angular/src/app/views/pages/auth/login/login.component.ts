// Angular
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, Login, AuthDataContext } from '../../../../core/auth';
//Login Service
import { LoginService } from '../login/services/app.loginservice';
import { LoginModel } from './models/app.loginmodel';
import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServices } from '../../../../views/services/api.services';
import { CommonServices } from '../../../../views/services/common';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { environment } from '../../../../../environments/environment';
import { LoaderService } from '../../../../views/services/loader.service';
import { SwPush } from '@angular/service-worker';
import { ForgotEmailDialogComponent, ForgotPwdDialogComponent } from '../../dialogs/forgot-pwd-dialog/forgot-pwd-dialog.component';
/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
	EMAIL: '',
	PASSWORD: ''
};

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	readonly VAPID_PUBLIC_KEY = "BD9REiUQJ8fpietjMJsUfOl7IkcI99ldJ8jTsNwqvHd4UMvkHydaCkikyr33jZiwYBqkDdmMJqPO3tpaeNwfCBg";
	today: number = Date.now();
	// For Password Field
	hide = false;
	// Public params
	loginForm: FormGroup;
	// loading = false;
	isLoggedIn$: Observable<boolean>;
	AuthDataContext: AuthDataContext;
	errors: any = [];
	LoginModel: LoginModel = new LoginModel();
	private unsubscribe: Subject<any>;

	private returnUrl: any;
	actionButtonLabel: string = 'Retry';
	action: boolean = false;
	setAutoHide: boolean = true;
	autoHide: number = 2000;
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';

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
		private router: Router,
		private _loginservice: LoginService,
		private authNoticeService: AuthNoticeService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private spinner: NgxSpinnerService,
		private loaderService: LoaderService,
		private notificationService: NotificationsComponent,
		private apiService: ApiServices,
		private commonServices: CommonServices,
		public swPush: SwPush,
		private dialog: MatDialog,
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this._loginservice.isLogin = true;
		this.initLoginForm();
		this.commonServices.helpWiseByClass('none !important');
		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params['returnUrl'] || '/';
		});

		this.swPush.requestSubscription({
			serverPublicKey: this.VAPID_PUBLIC_KEY
		})
			.then(sub => {
				debugger
				console.log(sub);
				localStorage.setItem('pushNotification', JSON.stringify(sub));
				// this.newsletterService.addPushSubscriber(sub).subscribe()
			})
			.catch(err => console.error("Could not subscribe to notifications", err));
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// debugger;
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		// this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// debugger;
		// demo message to show
		if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Use account
			<strong>${DEMO_PARAMS.EMAIL}</strong> and password
			<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
			this.authNoticeService.setNotice(initialNotice, 'info');
		}

		this.loginForm = this.fb.group({
			email: [DEMO_PARAMS.EMAIL, Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: [DEMO_PARAMS.PASSWORD, Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}

	getMedicineList() {
		debugger
		this.apiService.GetList("/PharmacistReview/jsonByMedicine").subscribe((res: any) => {
			debugger
		}, err => {
			debugger
		});
	}

	login() {
		// this.spinner.show();
		const controls = this.loginForm.controls;
		this.loaderService.display(true);
		// this.loading = true;
		var pushNotification = JSON.parse(localStorage.getItem("pushNotification"));
		var data: any;
		if (pushNotification != null && pushNotification != undefined) {
			data = {
				UserId: pushNotification.UserId,
				PharmacyId: pushNotification.PharmacyId,
				EndPoint: pushNotification ? pushNotification.endpoint : null,
				P256dh: pushNotification ? pushNotification.keys.p256dh : null,
				Auth: pushNotification ? pushNotification.keys.auth : null
			}
		}

		var loginModel1 = {
			UserEmail: controls['email'].value,
			UserPassword: controls['password'].value,
			FireBaseToken: this.commonServices.firebaseToken == null ? "" : this.commonServices.firebaseToken.value,
			browserSubscriber: data,
			FireBaseKeysAuth: "", //pushNotification.keys == null ? "" : pushNotification.keys.auth,
			FireBaseKeysToken: "", //pushNotification.keys == null ? "" : pushNotification.keys.auth,
		};

		// this.loaderService.display(true);
		this.apiService.Post(loginModel1, environment.apiEndpoint + "/Authenticate/PharmacyPost").subscribe(
			response => {
				console.log(response);
				if (response == null || response.userData == null) {
					this.apiService.showSnack('Login failed. Please check username and password.');
					this.router.navigate(["/auth/login"]); // Main page
					return;
				}
				AuthDataContext.users = response.userData;
				localStorage.setItem('userdetails', JSON.stringify(response.userData));
				localStorage.setItem('userguide', JSON.stringify(response.userguide));
				// localStorage.setItem('invcount', response.InviteCount);
				localStorage.setItem('logindetails', JSON.stringify(loginModel1));
				localStorage.setItem('currentUser', 'true');
				// if (response.userData.RoleId == 3) {
				// 	this.commonServices.helpWiseByChat();
				// 	this.commonServices.helpWiseByClass('flex !important');
				// }
				this.store.dispatch(new Login({ authToken: response.userData.Token }));
				// this.postBrowserSubscriptions(response);
				this.router.navigateByUrl('/app/dashboard'); // Main page
				// this.getMedicineList();
				this.autoLogout(); //For AutoLogout
				this.loaderService.display(false);
				this.apiService.showSnack('Logged in successfully');
				this.loaderService.display(false);
			},
			(error: any) => {
				// this.notiService.showNotification(error, 2);
				// this.apiService.showSnack("Oops something went wrong. please try again.");
				this.commonServices.customError(1);
				// this.spinner.hide();
				this.loaderService.display(false);
			});
		// this.loaderService.display(false);
	}
	// For Auto Logout
	autoLogout() {
		// console.log('Auto Logout Triggered In Login Page');
		const tkn = localStorage.authce9d77b308c149d5992a80073637e4d5;
		this.commonServices.triggerLogout(tkn);
	}

	postBrowserSubscriptions(response: any) {
		let sub = JSON.parse(localStorage.getItem('pushNotification'));
		let data = {
			UserId: response.UserId,
			PharmacyId: response.PharmacyId,
			EndPoint: sub ? sub.endpoint : null,
			P256dh: sub ? sub.keys.p256dh : null,
			Auth: sub ? sub.keys.auth : null
		}
		this.apiService.Post(data, 'BrowserSubscription').subscribe(res => {
			console.log('Subscription Saved');
		});
	}
	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		// debugger;
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	// forgot() {
	// 	this.router.navigate(["/auth/forgot-password"]);
	// }

	forgot() {
		this.dialog.open(ForgotEmailDialogComponent, {
			disableClose: true,
			// data: data,
			width: ' 500px',
			height: ' 365px',
			panelClass: 'padding-0'
			// height: data.height
		});
	}

}
