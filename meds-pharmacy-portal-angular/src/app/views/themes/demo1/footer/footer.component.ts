// Angular
import { Component, OnInit } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../core/_base/layout';
// Object-Path
import * as objectPath from 'object-path';
import { environment } from '../../../../../environments/environment';
import { ApiServices } from '../../../../views/services/api.services';
@Component({
	selector: 'kt-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
	// Public properties
	today: number = Date.now();
	fluid: boolean;
	userdetails

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayouConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService, private apiServices: ApiServices) {
		this.userdetails = JSON.parse(localStorage.getItem('userdetails'))
	}


	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		const config = this.layoutConfigService.getConfig();

		// footer width fluid
		this.fluid = objectPath.get(config, 'footer.self.width') === 'fluid';
	}
	DownloadNotifier() {
		const encodedUrl = environment.notifierDownloadLocation;
		if (window.navigator.userAgent.indexOf("Win") !== -1) {
			const link = document.createElement('a');
			link.href = encodedUrl;
			link.download = '';
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

		}
		else if (window.navigator.userAgent.indexOf("iPhone") !== -1 || window.navigator.userAgent.indexOf("iPad") !== -1 || window.navigator.userAgent.indexOf("iPod") !== -1 || window.navigator.userAgent.indexOf("Mac") !== -1 || window.navigator.userAgent.indexOf("Linux") !== -1) {
			console.log("iOS or macOS");
			this.apiServices.showSnack('Order notifier is not supported to this system');
		}

	}
}
