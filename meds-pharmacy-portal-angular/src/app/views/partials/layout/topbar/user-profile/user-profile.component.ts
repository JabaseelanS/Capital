// Angular
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
// NGRX
import { Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User, AuthDataContext } from '../../../../../core/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthAdminContext } from '../../../../shared/authadminContext';
import { ApiServices } from '../../../../services/api.services';
import { CommonServices } from '../../../../services/common';
import { InviteLinkPopupComponent } from '../../../../pages/dialogs/invite-link-popup/invite-link-popup.component';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Subscription } from 'rxjs';
import { VideoDialogComponent } from '../../../../pages/dialogs/video-dialog/video-dialog.component';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user: User;
	mobileno = "";
	InviteCount = 0;
	userguide: any;
	@Input() avatar: boolean = true;
	@Input() greeting: boolean = true;
	@Input() badge: boolean;
	@Input() icon: boolean;
	private InvitemessageSource: Subscription;
	// private InvitemessageSource: BehaviorSubject<number> = new BehaviorSubject(0);
	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>,
		private dialog: MatDialog,
		private router: Router,
		private cdRef: ChangeDetectorRef,
		public apiService: ApiServices,
		public commonServices: CommonServices
	) {

	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		var user = JSON.parse(localStorage.getItem("userdetails"));
		if (user != null && user != undefined) {
			this.user = user;
		} else {
			this.logout();
		}
		this.InviteCount = JSON.parse(localStorage.getItem("invcount")) || 0;
		this.InvitemessageSource = this.commonServices.getMessage().subscribe(message => {
			this.InviteCount = message; this.cdRef.detectChanges();
		});
		// AuthAdminContext.users;
		//this.user$ = this.store.pipe(select(currentUser));
	}

	/**
	 * Log out
	 */
	logout() {
		localStorage.clear(); AuthAdminContext.users = []; AuthAdminContext.roles = []; AuthAdminContext.permissions = [];
		this.router.navigate(['/auth/login']); // Main page
		clearInterval(this.commonServices.expiryIntrval);
		clearInterval(this.commonServices.orderExpireId);
		// this.dialog.closeAll();
		// this.router.navigate(['auth/login']); // Main page
		//this.store.dispatch(new Logout());
	}

	openLink(link, flag): void {
		this.init("", link, flag);
	}

	init(path, link, flag) {
		this.apiService.GetList('UserGuide/GetByActive').subscribe((res: any) => {
			if (res != null) {
				if (flag == 1 && res.UserGuide != null && res.UserGuide != "") {
					window.open(link + res.UserGuide, '_blank');
				}
				else {
					path = path + (flag == 2 ? (res.ProcessingPrescriptionOrders == null ? "" : res.ProcessingPrescriptionOrders) :
						flag == 3 ? (res.ProcessingOtcOrders == null ? "" : res.ProcessingOtcOrders) : (res.CarerMode == null ? "" : res.CarerMode));
					this.dialog.open(VideoDialogComponent, {
						data: { path, name },
						disableClose: true,
						width: 'auto',
						height: 'auto',
						maxWidth: '70vw',
						minWidth: 'auto',
						maxHeight: '790px',
					});
				};
			}
		}, error => {
		});
	}

	downloadVideo(path, name, flag) {
		var userguide = JSON.parse(localStorage.getItem("userguide"));
		path = path + (flag == 2 ? userguide.ProcessingPrescriptionOrders : flag == 3 ? userguide.ProcessingOtcOrders : userguide.CarerMode);
		this.dialog.open(VideoDialogComponent, {
			data: { path, name },
			disableClose: true,
			width: 'auto',
			height: 'auto',
			maxWidth: '70vw',
			minWidth: 'auto',
			maxHeight: '790px',
		});
	}

	openInvitePopup() {
		this.dialog.open(InviteLinkPopupComponent, {
			data: {},
			disableClose: true,
			height: 'auto',
		}).afterClosed().subscribe(async res => {
			if (res != null) {
				if (res == 1) {
					this.apiService.showSnack('Invite sent successfully');
				} else if (res == 2) {
					this.apiService.showSnack('Invite sent failed');
				}
			}
		})
	}
}
