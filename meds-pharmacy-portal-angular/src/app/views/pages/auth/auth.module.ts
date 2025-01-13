// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Material
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSnackBarModule } from '@angular/material';
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../core/_base/crud/';
// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
// import { CustomerAuthGuardService } from '../masters/services/app.customerservice';
// Auth
import { AuthEffects, authReducer, AuthService } from '../../../core/auth';
import { CommonAuthGuardService } from '../../services/common.auth.services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ForgotEmailDialogComponent, ForgotOtpDialogComponent, ForgotPwdDialogComponent } from '../dialogs/forgot-pwd-dialog/forgot-pwd-dialog.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [

			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full'
			},
			{
				path: 'login',
				component: LoginComponent,
				data: { returnUrl: window.location.pathname }
			},
			{
				path: 'register',
				component: RegisterComponent
			},
			{
				path: 'setpassword',
				component: SetpasswordComponent,
				// data: { returnUrl: window.location.pathname }
			},
			// {
			// 	path: 'forgot-password',
			// 	component: ForgotPasswordComponent,
			// }

		]
	}
];


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule.forChild(routes),
		MatInputModule,
		MatIconModule,
		MatFormFieldModule,
		MatCheckboxModule,
		TranslateModule.forChild(),
		StoreModule.forFeature('auth', authReducer),
		EffectsModule.forFeature([AuthEffects]),
		FlexLayoutModule,
		NgxSpinnerModule,
		PerfectScrollbarModule,
		MatSnackBarModule,
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
	],
	exports: [AuthComponent],
	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterComponent,
		ForgotPasswordComponent,
		AuthNoticeComponent,
		ForgotPwdDialogComponent, ForgotEmailDialogComponent, ForgotOtpDialogComponent, SetpasswordComponent
	],
	entryComponents: [
		ForgotPwdDialogComponent, ForgotEmailDialogComponent, ForgotOtpDialogComponent
	]
})

export class AuthModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: [
				AuthService,
				// AuthGuard,
				// CustomerAuthGuardService,
				// CommonAuthGuardService
			]
		};
	}
}
