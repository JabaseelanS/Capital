// Angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// Translate Module
import { TranslateModule } from '@ngx-translate/core';

// UI
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PartialsModule } from '../../partials/partials.module';
import { MatTreeModule } from '@angular/material/tree';
// Core
import { FakeApiService } from '../../../core/_base/layout';
// Auth
import { ModuleGuard } from '../../../core/auth';
// Core => Services

import { TextMaskModule } from 'angular2-text-mask';

// Core => Utils
import {
	HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../core/_base/crud';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
	MatSlideToggleModule,
	MatDividerModule,
	MatExpansionModule,
	MatBadgeModule,
} from '@angular/material';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { environment } from '../../../../environments/environment';
import { NgbProgressbarModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ApiServices } from '../../services/api.services';
import { MasterComponent } from './master.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { OrdersComponent } from './orders/orders.component';
import { PharmacyComponent, } from './pharmacy/pharmacy.component';
import { PharmacyGrpListComponent } from './pharmacy-groups/pharmacy-groups.component';
// import { PrescriptionOrdersComponent } from '../masters/orders/prescription-orders/prescription-orders.component';
// import { PrescriptionDetailsComponent } from './orders/prescription-orders/prescription-details/prescription-details.component';
// import { PrescriptionDetailsFailedComponent } from './orders/prescription-orders/prescription-details-failed/prescription-details-failed.component';
import { InventoryComponent } from './inventory/inventory.component';
import { UserProfileComponentP } from './user-profile/user-profile.component';
import { AgmCoreModule } from '@agm/core';
// import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';

import { DeliveryUserComponent } from './delivery-user/delivery-user.component';
import { DeliveryUserCreateComponent } from './delivery-user/delivery-user-create/delivery-user-create.component';

import { PharmacyUserGroupCreateComponent } from './pharmacy-group-user/pharmacy-user-group-create/pharmacy-user-group-create.component';
import { PharmacyUserGroupComponent } from './pharmacy-group-user/pharmacy-user-group.component';

import { PharmacyUserComponent } from './pharmacy-user/pharmacy-user.component';
import { PharmacyUserCreateComponent } from './pharmacy-user/pharmacy-user-create/pharmacy-user-create.component';
// import { OrderHistoryComponent } from './orders/order-history/order-history.component';
// import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { ReversePipe } from '../../../directives/reverse.pipe';
import { PrintDialogComponent } from '../dialogs/print-dialog/print-dialog.component';
import { LiveOrderPopupComponent } from '../dialogs/live-order-popup/live-order-popup.component';
import { GrowlModule } from 'primeng/growl';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NgxImageCompressService } from 'ngx-image-compress';
// import { TestOrdersComponent } from './orders/test-orders/test-orders.component';
// import { UserProfileComponent } from '../../partials/layout/topbar/user-profile/user-profile.component';
import { CustomersComponent } from './customers/customers.component';
import { DeletePopupComponent } from '../dialogs/delete-popup/delete-popup.component';
import { ReportComponent } from './report/report.component';
// import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { LiveOrdersComponent } from './order-2.0/live-orders/live-orders.component';
import { DetailsDialog, TabsComponent, TabsDialog } from './order-2.0/tabs/tabs/tabs.component';
import { ScriptsComponent } from './order-2.0/components/scripts/scripts.component';
import { DetailComponent } from './order-2.0/components/detail/detail.component';
import { MedicineListComponent } from './order-2.0/components/medicine-list/medicine-list.component';
import { DeliveryDetailComponent } from './order-2.0/components/delivery-detail/delivery-detail.component';
// import { NgxImageZoomModule } from 'ngx-image-zoom';
import { TooltipComponent } from './order-2.0/components/tooltip/tooltip.component';
import { TooltipDirective } from './order-2.0/components/tooltip/tooltip.directive';
import { OrderDetailComponent } from './order-2.0/components/order-detail/order-detail.component';
import { OrderHistoryV2Component } from './order-2.0/order-history/order-history.component';
import { CommonServices, commonNumberOnlyModule } from '../../services/common';
import { CreateOrderComponentV2 } from './order-2.0/create-order/create-order.component';
import { DeleteEntityDialogComponent } from '../../partials/content/crud';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CustomerDialogComponent } from '../dialogs/customer-dialog/customer-dialog.component'
import { TwoDigitDecimaNumberDirective } from '../../../../app/directives/twodecimal.pipe';
import { ReportDialog } from './report/report-dialog/report-dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { AngularDualListBoxModule } from 'angular-dual-listbox';
// import { DatePickerComponent } from './common-component/date-picker.component'; 
// import {
// 	MatFormFieldModule,
// 	DateAdapter,
// 	MAT_DATE_LOCALE,
// 	MAT_DATE_FORMATS
// } from '@angular/material';
import {
	MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS
} from '@angular/material-moment-adapter';
// import { MAT_DATE_FORMATS } from '@angular/material';
// import { DateAdapter } from '@angular/material';
import { ReportV2Component } from './report/reportV2.component';
import { TransferFundDialogComponent } from '../dialogs/transfer-fund-dialog/transfer-fund-dialog.component';
import { RefundDialogComponent } from '../dialogs/refund-dialog/refund-dialog.component';
import { MomentUtcDateAdapter } from './moment-utc-date-adapter';
import { PharmacyDialogComponent } from '../dialogs/pharmacy-dialog/pharmacy-dialog.component';
import { PaymentDialogComponent } from '../dialogs/payment-dialog/payment-dialog.component';
import { ImageDialogComponent } from '../../common-dialogs/image-dialog/image-dialog.component';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { LiveOrder2Component } from './order-2.0/live-order2/live-order2.component';
import { DynamicImageDirective } from '../../../../app/directives/dynamic.image.directive';
import { DeliveryAddressComponent } from './order-2.0/components/delivery-address/delivery-address.component';
import { BookDeliveryDialogComponent } from '../dialogs/book-delivery-dialog/book-delivery-dialog.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OtcPriceComponent } from './otc-price/otc-price.component';
import { OtcCreateComponent } from '../dialogs/otc-create/otc-create.component';
import { PharmacyInvoicesReportComponent } from './pharmacy-invoices-report/pharmacy-invoices-report.component';
import { prescriptionComponent } from './order-2.0/components/prescription-image/prescription-image.component';
import { UserGuideComponent } from './user-guide/user-guide.component'
import { UserGuideDialogComponent } from '../dialogs/user-guide-dialog/user-guide-dialog.component';
import { SettingComponent } from './setting/setting.component';
import { PharmacySpecialHoursComponent } from './pharmacy-special-hours/pharmacy-special-hours.component';
import { PharmacySpecialHoursDialogComponent } from './../dialogs/pharmacy-special-hours-dialog/pharmacy-special-hours-dialog.component';
import { HolidayListSpecialHoursDialogComponent } from './../dialogs/pharmacy-list-special-hours-dialog/pharmacy-list-special-hours.component';

import { MAT_DATE_FORMATS, DateAdapter } from 'saturn-datepicker';
import { AppDateAdapter } from './date.adapter';
import { UploadDrugImagesComponent } from './upload-drug-images/upload-drug-images.component';
import { PopupComponent } from './upload-drug-images/popup/popup.component';
import { PageCanDeactivateGuard } from './upload-drug-images/upload-drug-images.guard';
import { ProductsComponent } from './order-2.0/products/products.component';
import { AgGridModule } from 'ag-grid-angular';
//import 'ag-grid-enterprise'
// import { InprogressDetailsComponent } from './orders/order-details/inprogress-details/inprogress-details.component';
// import { PrintService } from '../../services/print.service';

// Roles: 
// 1 = Admin
// 2 = Pillmate
// 3 = Pharmacy
const customNotifierOptions: NotifierOptions = {
	position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
	theme: 'material',
	behaviour: {
		autoHide: 5000,
		onClick: 'hide',
		onMouseover: 'pauseAutoHide',
		showDismissButton: true,
		stacking: 4
	},
	animations: {
		enabled: true,
		show: {
			preset: 'slide',
			speed: 300,
			easing: 'ease'
		},
		hide: {
			preset: 'fade',
			speed: 300,
			easing: 'ease',
			offset: 50
		},
		shift: {
			speed: 300,
			easing: 'ease'
		},
		overlap: 150
	}
};
const routes: Routes = [
	{
		path: '',
		component: MasterComponent,
		children: [
			// For Customers Component
			{
				path: '',
				redirectTo: 'user',
				pathMatch: 'full'
			},
			{
				path: 'customers',
				component: CustomersComponent,
			},
			{
				path: 'user-guide',
				component: UserGuideComponent,
			},
			{
				path: 'pharmacy',
				component: PharmacyComponent,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{
				path: 'user/pharmacy',
				component: PharmacyUserComponent,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{
				path: 'groupuser/pharmacy',
				component: PharmacyUserGroupComponent,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{
				path: 'user/delivery',
				component: DeliveryUserComponent,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{
				path: 'groups/pharmacy',
				component: PharmacyGrpListComponent,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{
				path: 'upload-drug-images',
				component: UploadDrugImagesComponent,
				canDeactivate: [PageCanDeactivateGuard]
			},
			// {
			// 	path: 'order-history',
			// 	component: OrderHistoryComponent
			// },
			// {
			// 	path: 'prescription-orders',
			// 	component: PrescriptionOrdersComponent,
			// },
			// {
			// 	path: 'test-orders',
			// 	component: TestOrdersComponent,
			// },
			{
				path: 'report',
				component: ReportComponent,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{
				path: 'new-report-v2',
				component: ReportV2Component,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			// {
			// 	path: 'prescription-orders/edit',
			// 	component: PrescriptionDetailsComponent
			// },
			// {
			// 	path: 'prescription-orders/fail',
			// 	component: PrescriptionDetailsFailedComponent
			// },
			{
				path: 'inventory',
				component: InventoryComponent
			},
			{
				path: 'user-profile',
				component: UserProfileComponentP
			}, {
				path: 'daily',
				component: PrintDialogComponent
			},
			{
				path: 'live-order-2',
				component: LiveOrdersComponent,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			}, {
				path: 'new-live-order',
				component: LiveOrder2Component,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{
				path: 'order-history-2',
				component: OrderHistoryV2Component,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{
				path: 'order-create-V2',
				component: CreateOrderComponentV2,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{
				path: 'order-create-V2/:page',
				component: CreateOrderComponentV2,
				// canActivate: [AuthGuard],
				// data: {
				// 	roles: [1, 2, 3]
				// }
			},
			{

				path: 'order-summary',
				component: OrderSummaryComponent

			},
			{
				path: 'otc-price',
				component: OtcPriceComponent
			},
			{
				path: 'tabs',
				component: TabsComponent
			},
			{
				path: 'invoices-report',
				component: PharmacyInvoicesReportComponent
			},
			{
				path: 'setting',
				component: SettingComponent
			},
			{
				path: 'special-hours',
				component: PharmacySpecialHoursComponent
			},
			{
				path: 'products',
				component: ProductsComponent
			},
		]
	}];

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

export const MY_FORMATS = {
	parse: {
		dateInput: 'DD/MM/YYYY',
	},

	display: {
		dateInput: 'DD/MM/YYYY',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY',
	},
};

@NgModule({
	imports: [
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyCvDn02LFJm12cARuqVRBglbvZwKIlJOco',//'AIzaSyBdeXSarf8KTrsQe74eUYti5HndfxxLm3k',
			libraries: ['places']
		}),
		MatDialogModule,
		// NgxMatDrpModule,
		// NgxDaterangepickerMd.forRoot(),
		// MaskedTextBoxModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		AngularDualListBoxModule,
		// InprogressDetailsComponent,
		GrowlModule,
		commonNumberOnlyModule.forRoot(),
		NgxPermissionsModule.forChild(),
		RouterModule.forChild(routes),
		NotifierModule.withConfig(customNotifierOptions),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
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
		NgbDropdownModule,
		NgbTabsetModule,
		NgbTooltipModule,
		// NgxMatSelectSearchModule,
		// NgxImageCompressService,
		// NgxImageZoomModule,
		MatSlideToggleModule,
		MatDividerModule,
		MatMenuModule,
		MatTreeModule,
		// InprogressDetailsComponent,
		TextMaskModule,
		MatExpansionModule,
		environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
			passThruUnknownUrl: true,
			dataEncapsulation: false
		}) : [],
		NgxSpinnerModule,
		PerfectScrollbarModule,
		NgxMaterialTimepickerModule.setLocale('en-US'),
		NgxMaskModule.forRoot(),
		SatDatepickerModule, SatNativeDateModule,
		AgGridModule.withComponents([])
	],
	providers: [
		ModuleGuard,
		PageCanDeactivateGuard,
		// PrintService,
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: 'auto'
			}
		},
		// {
		// 	provide: DateAdapter,
		// 	useClass: MomentDateAdapter,
		// 	deps: [MAT_DATE_LOCALE]
		// },
		// { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
		// { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
		{ provide: DateAdapter, useClass: MomentUtcDateAdapter },
		HttpUtilsService,
		TypesUtilsService,
		NgxImageCompressService,
		LayoutUtilsService,
		// NgxImageCompressService,
		ApiServices,
		DatePipe,
		MatBadgeModule,
		TitleCasePipe,
		{ provide: DateAdapter, useClass: AppDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
		// ApiDataService
	],
	declarations: [
		MasterComponent,
		// DatePickerComponent,
		// OrdersComponent,
		PrintDialogComponent,
		PharmacyUserComponent,
		PharmacyUserGroupComponent,
		DeliveryUserComponent,
		PharmacyComponent,
		// OrderHistoryComponent,
		PharmacyDialogComponent,
		OrderHistoryV2Component,
		// InprogressDetailsComponent,
		PharmacyGrpListComponent,
		// PrescriptionOrdersComponent,
		// CreateOrderComponent,
		// TestOrdersComponent,
		// UserProfileComponent,
		ReportComponent,
		ReportV2Component,
		InventoryComponent,
		UserProfileComponentP,
		PharmacyUserCreateComponent,
		PharmacyUserGroupCreateComponent,
		DeliveryUserCreateComponent,
		ReversePipe,
		LiveOrderPopupComponent,
		CustomersComponent,
		DeletePopupComponent,
		// AlertDialogComponent,
		LiveOrdersComponent,
		TabsComponent,
		ScriptsComponent,
		DeliveryDetailComponent,
		DetailComponent,
		MedicineListComponent,
		TabsDialog,
		TooltipComponent,
		TooltipDirective,
		DetailsDialog,
		OrderDetailComponent,
		CreateOrderComponentV2,
		CustomerDialogComponent,
		TwoDigitDecimaNumberDirective,
		ReportDialog, TransferFundDialogComponent, RefundDialogComponent,
		PaymentDialogComponent,
		ImageDialogComponent,
		LiveOrder2Component,
		DynamicImageDirective,
		DeliveryAddressComponent,
		BookDeliveryDialogComponent,
		OrderSummaryComponent,
		OtcPriceComponent,
		OtcCreateComponent,
		PharmacyInvoicesReportComponent,
		prescriptionComponent,
		UserGuideComponent,
		UserGuideDialogComponent,
		SettingComponent,
		PharmacySpecialHoursDialogComponent,
		PharmacySpecialHoursComponent,
		HolidayListSpecialHoursDialogComponent,
		UploadDrugImagesComponent,
		PopupComponent,
		ProductsComponent
	],

	entryComponents: [PharmacyUserCreateComponent, PharmacyDialogComponent, PharmacyUserGroupCreateComponent, DeleteEntityDialogComponent, DetailsDialog, DeliveryUserCreateComponent, LiveOrderPopupComponent, DeletePopupComponent, TabsDialog, TooltipComponent, OrderDetailComponent, CustomerDialogComponent, ReportDialog, TransferFundDialogComponent, RefundDialogComponent, PaymentDialogComponent, ImageDialogComponent, BookDeliveryDialogComponent, OtcCreateComponent, UserGuideDialogComponent, PharmacySpecialHoursDialogComponent, HolidayListSpecialHoursDialogComponent, PopupComponent, ProductsComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MasterModule { }
