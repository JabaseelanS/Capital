// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
// import { AuthGuard } from '../../../core/auth';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InterceptService, HttpUtilsService, TypesUtilsService, LayoutUtilsService } from '../../../core/_base/crud';
import { ApiServices } from '../../services/api.services';

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		TranslateModule,
		HttpClientModule,
		FlexLayoutModule,
		ChartsModule,
		// Material
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatMenuModule,
		MatSelectModule,
		MatTabsModule,
		MatTableModule,
		// NgxChartsModule,
		CoreModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent,

			},
		]),
	],
	providers: [
		ThemeService,
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		}, HttpUtilsService,
		ApiServices,],
	declarations: [
		DashboardComponent,
	]
})
export class DashboardModule {
}
