// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
// Auth
// import { AuthGuard } from '../../../core/auth';
import { CommonAuthGuardService } from '../../services/common.auth.services';
import { DashboardModule } from '../../pages/dashboard/dashboard.module';
import { MasterModule } from '../../pages/masters/master.module';

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		children: [

			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },

			{
				path: 'dashboard',
				// canActivate: [AuthGuard],
				//component: DashboardModule /
				// loadChildren: () => DashboardModule
				loadChildren: () => import('../../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},

			{
				path: 'masters',
				//canActivate: [CustomerAuthGuardService],
				// canActivate: [AuthGuard],
				// loadChildren: () => MasterModule
				loadChildren: () => import('../../pages/masters/master.module').then(m => m.MasterModule)
			},

		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}
