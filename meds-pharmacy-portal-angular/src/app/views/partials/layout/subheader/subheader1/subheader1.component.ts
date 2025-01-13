// Angular
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// RxJS
import { Subscription } from 'rxjs';
import { CommonServices } from '../../../../../../app/views/services/common';
// Layout
import { SubheaderService } from '../../../../../core/_base/layout';
import { Breadcrumb } from '../../../../../core/_base/layout/services/subheader.service';

@Component({
	selector: 'kt-subheader1',
	templateUrl: './subheader1.component.html',
	styleUrls: ['./subheader1.component.scss']
})
export class Subheader1Component implements OnInit, OnDestroy, AfterViewInit {
	// Public properties
	@Input() fluid: boolean;
	@Input() clear: boolean;

	today: number = Date.now();
	title: string = '';
	desc: string = '';
	breadcrumbs: Breadcrumb[] = [];
	// isDisabled = true;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param subheaderService: SubheaderService
	 */
	constructor(public subheaderService: SubheaderService, private router: Router, public commonService: CommonServices) {
		this.subheaderService.isDetail = false;
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	}

	getUploadTypeIcon(value): String {
		if (value == 12) {
			return "../../../../../../assets/packapill-icons/SVG/dd.svg"
		}
		else {
			return "../../../../../../assets/packapill-icons/SVG/ue.svg"
		}
	}

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
		this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
			// breadcrumbs title sometimes can be undefined
			if (bt) {
				Promise.resolve(null).then(() => {
					this.title = bt.title;
					this.desc = bt.desc;
				});
			}
		}));

		this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
			Promise.resolve(null).then(() => {
				this.breadcrumbs = bc;
			});
		}));
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	goBack(): void {
		if (this.commonService.isPage == 2) {
			this.router.navigate(['/app/masters/order-history-2']);
		} else if (this.commonService.isPage == 3) {
			this.router.navigate(['/app/masters/new-live-order']);
		}
		else {
			this.router.navigate(['/app/masters/live-order-2']);
		}
	}
}
