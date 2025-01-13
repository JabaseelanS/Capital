// Angular
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig, MatProgressSpinnerModule, MatSelectModule, MatDialogModule, MatButtonModule, MatMenuModule, MatInputModule, MatTableModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatSnackBarModule, MatTabsModule, MatTooltipModule, MatSlideToggleModule, MatDividerModule, MatTreeModule, MatExpansionModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
// Angular in memory
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// Perfect Scroll bar
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
// Env
// Hammer JS
import 'hammerjs';
// NGX Permissions
import { NgxPermissionsModule } from 'ngx-permissions';

// NGX Spinner
import { NgxSpinnerModule } from "ngx-spinner";

// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// State
import { metaReducers, reducers } from './core/reducers';
// Copmponents
import { AppComponent } from './app.component';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
// Partials

import { PartialsModule } from './views/partials/partials.module';
// Layout Services
import {
	// DataTableService,
	//FakeApiService,
	KtDialogService,
	LayoutConfigService,
	LayoutRefService,
	MenuAsideService,
	MenuConfigService,
	MenuHorizontalService,
	PageConfigService,
	SplashScreenService,
	SubheaderService,
	FakeApiService
} from './core/_base/layout';

import { FlexLayoutModule } from "@angular/flex-layout";

// Auth
import { AuthModule } from './views/pages/auth/auth.module';
import { AuthService } from './core/auth';
// CRUD
import { HttpUtilsService, LayoutUtilsService, TypesUtilsService, InterceptService } from './core/_base/crud';
// Config
import { LayoutConfig } from './core/_config/demo1/layout.config';
// Highlight JS
import { HIGHLIGHT_OPTIONS, HighlightLanguage } from 'ngx-highlightjs';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as scss from 'highlight.js/lib/languages/scss';
import * as xml from 'highlight.js/lib/languages/xml';
import * as json from 'highlight.js/lib/languages/json';
import { ErrorPageComponent } from './views/themes/demo1/content/error-page/error-page.component';
import { InviteLinkPopupComponent } from './views/pages/dialogs/invite-link-popup/invite-link-popup.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OrderStatusDialogComponent } from './views/pages/dialogs/orderstatus-dialog/orderstatus-dialog.component';
import { PharmacyGroupsDialogComponent } from './views/pages/dialogs/pharmacy-groups-dialog/pharmacy-group-dialog.component';
import { CommonModule, AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NotificationsComponent } from './views/pages/notifications/notifications.component';
import { InventoryDialogComponent } from './views/pages/dialogs/inventory-dialog/inventory-dialog.component';
import { LoaderService } from './views/services/loader.service';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { CommonServices, commonNumberOnlyModule } from '../app/views/services/common';
import { GlobalErrorHandler } from '../app/views/services/version-check.service';
import { MatRippleModule } from '@angular/material';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { AlertDialogComponent } from './views/pages/dialogs/alert-dialog/alert.dialog.component';
import { ChangePharmacyComponent } from './views/pages/masters/order-2.0/components/change-pharmacy/change-pharmacy.component';
import { RepeatListComponent } from './views/pages/dialogs/repeat-list/repeat-list.component';
import { RepeatViewComponent } from './views/pages/dialogs/repeat-view/repeat-view.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { VideoDialogComponent } from './views/pages/dialogs/video-dialog/video-dialog.component';
import { TextMaskModule } from 'angular2-text-mask';
import { BankDetailsComponent } from './views/pages/dialogs/bank-details/bank-details.component';
import { BookDeliveryDialogComponent } from './views/pages/dialogs/book-delivery-dialog/book-delivery-dialog.component';
import { OrderSummaryDialogComponent } from './views/pages/dialogs/order-summary-dialog/order-summary-dialog.component';
import { MAT_DATE_FORMATS, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { CourierstatusDialogComponent } from './views/pages/dialogs/courierstatus-dialog/courierstatus-dialog.component';
// import { GrowlModule } from 'primeng/growl';
// import { AutocompleteComponent } from './views/pages/masters/auto-complete-component/auto-complete-component.component';
// import { DiscountComponent } from './discount/discount.component';

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	wheelSpeed: 0.5,
	swipeEasing: true,
	minScrollbarLength: 40,
	maxScrollbarLength: 300,
	suppressScrollX: true
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
	// initialize app by loading default demo layout config
	return () => {
		if (appConfig.getConfig() === null) {
			appConfig.loadConfigs(new LayoutConfig().configs);
		}
	};
}

export function hljsLanguages(): HighlightLanguage[] {
	return [
		{ name: 'typescript', func: typescript },
		{ name: 'scss', func: scss },
		{ name: 'xml', func: xml },
		{ name: 'json', func: json }
	];
}

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
	declarations: [AppComponent, ErrorPageComponent, InviteLinkPopupComponent, InventoryDialogComponent, PharmacyGroupsDialogComponent, OrderStatusDialogComponent, AlertDialogComponent, VideoDialogComponent, BankDetailsComponent, ChangePharmacyComponent, RepeatListComponent, RepeatViewComponent,
		OrderSummaryDialogComponent, CourierstatusDialogComponent
		// BookDeliveryDialogComponent
	],
	imports: [
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		AngularFireMessagingModule,
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		AngularDualListBoxModule,
		NgxPermissionsModule.forChild(),
		// RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		// GrowlModule,
		MatRippleModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		FlexLayoutModule,
		NgbProgressbarModule,
		NgxMatSelectSearchModule,
		MatSlideToggleModule,
		MatDividerModule,
		MatMenuModule,
		MatTreeModule,
		MatExpansionModule,
		BrowserAnimationsModule,
		BrowserModule,
		FlexLayoutModule,
		AppRoutingModule,
		HttpClientModule,
		PerfectScrollbarModule,
		NgxMaterialTimepickerModule.setLocale('en-US'),
		// environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService, {
		// 	passThruUnknownUrl: true,
		// 	dataEncapsulation: false
		// }) : [],
		NgxPermissionsModule.forRoot(),
		NgxSpinnerModule,
		CoreModule,
		OverlayModule,
		StoreModule.forRoot(reducers, { metaReducers }),
		EffectsModule.forRoot([]),
		StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
		StoreDevtoolsModule.instrument(),
		AuthModule.forRoot(),
		TranslateModule.forRoot(),
		MatProgressSpinnerModule,
		InlineSVGModule.forRoot(),
		InMemoryWebApiModule.forRoot(FakeApiService, {
			delay: 0,
			passThruUnknownUrl: true
		}),
		ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
		NgxMaskModule.forRoot(),
		TextMaskModule,
		SatDatepickerModule, SatNativeDateModule
	],
	exports: [],
	providers: [
		CommonServices,
		AsyncPipe,
		NotificationsComponent,
		AuthService,
		LayoutConfigService,
		LayoutRefService,
		MenuConfigService,
		PageConfigService,
		KtDialogService,
		LoaderService,
		// DataTableService,
		SplashScreenService,
		InterceptService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},

		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		{
			provide: HAMMER_GESTURE_CONFIG,
			useClass: GestureConfig
		},
		{
			// layout config initializer
			provide: APP_INITIALIZER,
			useFactory: initializeLayoutConfig,
			deps: [LayoutConfigService], multi: true
		},
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: { languages: hljsLanguages }
		},
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
		{ provide: ErrorHandler, useClass: GlobalErrorHandler },
		// template services
		SubheaderService,
		MenuHorizontalService,
		MenuAsideService,
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
		DatePipe,
		NgxImageCompressService, TitleCasePipe
	],
	entryComponents: [// UserDialogComponent,
		InviteLinkPopupComponent,
		PharmacyGroupsDialogComponent,
		// NgxMaterialTimepickerComponent,
		InventoryDialogComponent,
		OrderStatusDialogComponent,
		AlertDialogComponent,
		ChangePharmacyComponent,
		RepeatListComponent,
		RepeatViewComponent,
		VideoDialogComponent,
		BankDetailsComponent,
		OrderSummaryDialogComponent,
		CourierstatusDialogComponent
		// BookDeliveryDialogComponent
		// DeleteDialogComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent]
})
export class AppModule {
}
