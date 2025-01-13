// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './views/themes/demo1/content/error-page/error-page.component';

const routes: Routes = [
	// enable this router to set which demo theme to load,
	{ path: '', redirectTo: 'auth', pathMatch: 'full' },
	{ path: 'auth', loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule) },
	{ path: 'app', loadChildren: () => import('../app/views/themes/demo1/theme.module').then(m => m.ThemeModule) },
	// { path: 'auth', loadChildren: () => AuthModule },
	// { path: 'app', loadChildren: () => ThemeModule },

	// If No Path Matched Set Navigate To Error Page Component
	{ path: 'error/:type', component: ErrorPageComponent },
	{ path: '**', redirectTo: 'error/error-v1', pathMatch: 'full' }

];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { useHash: true })
	],
	exports: [RouterModule]
})

export class AppRoutingModule {
}
