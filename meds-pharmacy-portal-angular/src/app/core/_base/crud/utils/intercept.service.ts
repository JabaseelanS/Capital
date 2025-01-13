// Angular
import { Injectable, NgZone } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// RxJS
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiServices } from '../../../../views/services/api.services';
import { CommonServices } from '../../../../views/services/common';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */

@Injectable()
export class InterceptService implements HttpInterceptor {

	constructor(public router: Router, public apiService: ApiServices, public commonServices: CommonServices,) {

	}

	// intercept request and add token
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let data = JSON.parse(localStorage.getItem("userdetails"));
		// For Onesignal Push Notification
		if (req.url.match("https://onesignal.com/api/v1/notifications")) {
			return next
				.handle(
					req.clone({
						setHeaders: {
							Authorization: 'Basic ' + environment.OnesignalToken
						},
						url: req.url
					})
				).pipe(catchError((err) => this.handleError(err)))
		}
		else if (req.url.match("https://fcm.googleapis.com/fcm/send")) {
			return next
				.handle(
					req.clone({
						url: req.url
					})
				).pipe(catchError((err) => this.handleError(err)))
		}
		else if (req.url.match('UserGuide/GetByActive') || req.url.match('AppOrder/sendSMSAppLink') || req.url.match('AppOrder/GetSearchByMobBlock') || req.url.match('AppOrder/GetPharmacyByRole')) {
			var url1 = req.url.replace(environment.apiEndpoint + "/", "");
			return next
				.handle(
					req.clone({
						setHeaders: {
							Authorization: 'Bearer ' + data.Token
						},
						url: environment.apiEndpoint + "/" + url1
					})
				).pipe(catchError((err) => this.handleError(err)))
		}
		else if (req.url.match('UberDirect')) {
			return next
				.handle(
					req.clone({
						setHeaders: {
							Authorization: 'Bearer ' + data.Token
						},
						url: environment.apiEndpointR + "/" + req.url
					})
				).pipe(catchError((err) => this.handleError(err)))
		}
		else if (!req.url.match('Authenticate/')) {
			// https://translation.googleapis.com/language/translate/v2
			// Clone the request and set the new header in one step.

			// modify request
			// Need To Add Token
			return next
				.handle(
					req.clone({
						setHeaders: {
							Authorization: 'Bearer ' + data.Token
						},
						url: environment.apiEndpoint + "/" + req.url
					})
				).pipe(catchError((err) => this.handleError(err)))
		}
		else {
			// modify request
			// No Need To Add Token
			return next
				.handle(
					req.clone({
						url: req.url
					})
				).pipe(catchError((err) => this.handleError(err)))
		}
	}

	handleError(error: HttpErrorResponse): Observable<never> {
		this.commonServices.loginExpired = false;
		// Auto Logout If 401 Error Returns
		if (error.status === 401) {
			this.router.navigate(['/auth/login']);
			this.commonServices.visibility = "hidden";
			this.commonServices.loginExpired = true;
			this.commonServices.customError(1);
			return throwError(error.statusText);
		}
		else if (error.status === 404) {
			return throwError('Not Found');
		}
		else if (error.error && error.error.message) {
			return throwError(error.error.message);
		}
		else if (error.error && error.error.error_description) {
			return throwError(error.error.error_description);
		} else {
			// this.commonServices.definedError();
			return throwError('Error occurred');
		}
	}
}