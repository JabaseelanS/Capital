import { Subscription } from 'rxjs';
// Angular
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// Layout
import { LayoutConfigService, SplashScreenService, SubheaderService, TranslationService } from './core/_base/layout';
// language list
import { locale as enLang } from './core/_config/i18n/en';
import { locale as chLang } from './core/_config/i18n/ch';
import { locale as esLang } from './core/_config/i18n/es';
import { locale as jpLang } from './core/_config/i18n/jp';
import { locale as deLang } from './core/_config/i18n/de';
import { locale as frLang } from './core/_config/i18n/fr';
import { LoaderService } from './views/services/loader.service';
import { CommonServices } from "../app/views/services/common";
import { trigger, transition, animate, state, style } from '@angular/animations';
import { SwPush, SwUpdate } from '@angular/service-worker';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'body[kt-root]',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [
		trigger('visibilityChanged', [
			state('shown', style({ opacity: 1, visibility: 'visible' })),
			state('hidden', style({ opacity: 0, visibility: 'hidden' })),
			transition('shown => hidden', animate('500ms')),
			transition('hidden => shown', animate('10ms')),
			//transition('* => *', animate('500ms'))
		])
	]
})
export class AppComponent implements OnInit, OnDestroy {
	// readonly VAPID_PUBLIC_KEY = "BJrgcREkLmatRmLK9PSQBez3q7Un__dBafI81sOPJIvVWeggWIWkDodC95zZhlWrS3qJXEprM-hBaXUyRMyn2zE";
	// Public properties
	title = 'Pack a Pill';
	loader: boolean;
	showLoader: boolean;
	message: any;
	public unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	readonly VAPID_PUBLIC_KEY = "BD9REiUQJ8fpietjMJsUfOl7IkcI99ldJ8jTsNwqvHd4UMvkHydaCkikyr33jZiwYBqkDdmMJqPO3tpaeNwfCBg";
	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * @param router: Router
	 * @param layoutConfigService: LayoutCongifService
	 * @param splashScreenService: SplashScreenService
	 */
	constructor(public translationService: TranslationService,
		public router: Router,
		private swUpdate: SwUpdate,
		public loaderService: LoaderService,
		public commonServices: CommonServices,
		public layoutConfigService: LayoutConfigService,
		public _subheaderService: SubheaderService,
		public splashScreenService: SplashScreenService, public swPush: SwPush) {
		this.commonServices.visibility = "shown";
		this._subheaderService.isDetail = false;
		// register translations
		this.translationService.loadTranslations(enLang, chLang, esLang, jpLang, deLang, frLang);

		swPush.notificationClicks.subscribe(res => {
			console.log('Clicks in new', res);
			window.open(res.notification.data.url);
		})

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

	async ngOnInit() {
		this.commonServices.helpWiseByChat();
		this.autoLogout();
		if (this.swUpdate.isEnabled) {
			this.swUpdate.available.subscribe(() => {
				this.swUpdate.activateUpdate()
					.then(() => {
						window.location.reload();
					});
			});
		}

		await this.commonServices.requestPermission();
		await this.commonServices.receiveMessage();
		this.showLoader = this.loaderService.status;
		this.loader = this.layoutConfigService.getConfig('loader.enabled');

		const routerSubscription = this.router.events.subscribe(event => {
			this._subheaderService.isDetail = false;
			if (event instanceof NavigationEnd) {
				// hide splash screen
				// this.splashScreenService.hide();

				// scroll to top on every route change
				window.scrollTo(0, 0);

				// to display back the body content
				setTimeout(() => {
					document.body.classList.add('kt-page--loaded');
				}, 500);
			}
		});
		this.unsubscribe.push(routerSubscription);
		this.commonServices.visibility = "hidden";
	}

	//On Refresh Auto Logout
	autoLogout() {
		if (localStorage.authce9d77b308c149d5992a80073637e4d5 != null || localStorage.authce9d77b308c149d5992a80073637e4d5 != undefined) {
			// console.log('Auto Logout Triggered In App ts Page');
			const tkn = localStorage.authce9d77b308c149d5992a80073637e4d5;
			this.commonServices.triggerLogout(tkn);
		}
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}
}
