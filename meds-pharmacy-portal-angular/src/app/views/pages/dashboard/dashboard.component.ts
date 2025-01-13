// Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SubheaderService } from '../../../core/_base/layout';
import { ChartType, ChartOptions, ChartDataSets, Chart } from 'chart.js';
import { ApiServices } from '../../services/api.services';
import { CommonServices } from '../../services/common';
import { GlobalConstant } from '../globals/globalvariables';
import { MatDialog } from '@angular/material';
import { BankDetailsComponent } from '../dialogs/bank-details/bank-details.component';
// import * as pluginAnnotations from 'chartjs-plugin-annotation';
@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
	data: any;
	listOfYears = [2019]
	selectedYear = new Date().getFullYear();
	dataSource: any;
	displayedColumns = ['AMOUNT', 'Status', 'BANK', 'DESCRIPTION', 'DATE']
	public barChartOptions: ChartOptions = {
		responsive: true,
		legend: {

			position: 'top',
			labels: {
				fontSize: 12,
				usePointStyle: true
			}
		},
		// We use these empty structures as placeholders for dynamic theming.
		scales: {
			xAxes: [{
				// type: 'time',
				time: {
					unit: 'month',
					displayFormats: {
						quarter: 'MMM YYYY'
					}
				}
			}], yAxes: [{
				ticks: {
					stepSize: 1,
					beginAtZero: true,
				},
			}],
		},
		plugins: {
			datalabels: {
				anchor: 'end',
				align: 'end',
			}
		}
	};
	public barChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	public barChartType: ChartType = 'bar';
	public barChartLegend = true;
	// public barChartPlugins = [pluginDataLabels];

	public barChartData: ChartDataSets[] = [
		{ data: [], label: 'Orders Delivered', backgroundColor: '#a59de0' },
		{ data: [], label: 'Orders Cancelled', backgroundColor: ' #005760' },
		// { data: [], label: 'Orders Cancelled', backgroundColor: '#1e88e5' }

	];
	public pieChartOptions: ChartOptions = {
		responsive: true,
		legend: {

			position: 'left',
			labels: {
				fontSize: 12,
				usePointStyle: true
			}
		},
		plugins: {
			datalabels: {
				formatter: (value, ctx) => {
					const label = ctx.chart.data.labels[ctx.dataIndex];
					return label;
				},
			},
		}
	};
	public pieChartLabels = ['Current Month Orders'];
	public pieChartData: number[] = [];
	public pieChartType: ChartType = 'pie';
	public pieChartLegend = true;
	public pieChartColors = [
		{
			backgroundColor: ['#a59de0'],
		},
	];
	// 
	public pieChartData1: any[] = [];
	public pieChartLabels1 = ['New Orders', 'Fullfillment', 'Packed Items', 'Orders Delivered', 'Orders Cancelled',];
	public pieChartColors1 = [
		{
			backgroundColor: ['#04f8e4c5', '#a59de0', ' #005760', '#4504f8c5', '#43a047'],
		},
	];
	public pieChartType1: ChartType = 'doughnut';
	userdlist: any;
	purl = 'PharmacyStripe/'
	contentData: any;
	linkData: any;
	baldata: any;
	payurl: any;
	accounturl: any;
	payldata: any;
	loadedData: any;
	isStripe: number = 1;
	constructor(
		private _subheaderService: SubheaderService,
		private apiServices: ApiServices,
		public commonServices: CommonServices,
		private dialog: MatDialog,
		private cdRef: ChangeDetectorRef,
	) {
		this.userdlist = JSON.parse(localStorage.getItem('userdetails'));
		this._subheaderService.setTitle("Dashboard");

	}

	async ngOnInit() {
		this.loadData();
		this.postBrowserSubscriptions();
		// if (this.userdlist.RoleId == 3 || this.userdlist.RoleId == 4) {
		// 	this.Payoutuserdetail();
		// }
	}

	addBnk() {
		var that = this;
		this.dialog.open(BankDetailsComponent, {
			data: {
				PharmacyId: this.loadedData.PharmacyId
			},
			disableClose: true,
			height: 'auto',
			maxHeight: '45vw',
			maxWidth: '80vw',
			width: 'auto',
			minWidth: '40vw',
		}).afterClosed().subscribe(async res => {
			if (res) {
				this.loadData();
			}

		});
	}


	sliceFn(amountdat) {
		if (amountdat != 0) {
			var k = amountdat.length - 2
			var amt = amountdat.substring(0, k) + '.' + amountdat.substring(k)
			return amt;
		}
		else {
			return '0.00';
		}
	}

	loadData() {
		this.commonServices.visibility = "shown";
		if (this.userdlist.RoleId == 3 || this.userdlist.RoleId == 4) {
			this.apiServices.GetList('PharmacyStripe/PayoutList?id=' + this.userdlist.PharmacyId).subscribe((res: any) => {
				// this.apiServices.GetList('PharmacyStripe/GetDashList?pid=' + this.userdlist.PharmacyId + '&pgid=' + this.userdlist.PharmacyGrpId + '&prid=' + this.userdlist.RoleId + '&year=' + this.selectedYear).subscribe((res: any) => {
				localStorage.setItem('invcount', res.InviteCount);
				this.commonServices.apiInviteCount = res.InviteCount;
				this.commonServices.sendMessage(res.InviteCount);
				this.Payoutuserdetail(res);
				this.loadedData = res._list
			}, error => {
				this.isStripe = 4; this.commonServices.visibility = "hidden";
				this.commonServices.customError(1);
			});
		} else if (this.userdlist.RoleId == 1) {
			this.apiServices.GetList('Dashboard?year=' + this.selectedYear).subscribe((res: any) => {
				this.data = res;
				this.listOfYears = res.years;
				this.pieChartData = [this.data._pharmacycount]
				this.pieChartData1 = [this.data._neworder, this.data._fullfilment, this.data._packedorder, this.data._deliveredorder, this.data._cancelledorder];
				// this.barChartLabels = this.data.yearCounts;
				// this.barChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				this.barChartData[0].data = this.data.yearData1;
				this.barChartData[1].data = this.data.yearData2;
				// this.barChartData[3].data = this.data.yearData3;
				localStorage.setItem('invcount', res.InviteCount);
				this.commonServices.apiInviteCount = res.InviteCount;
				this.commonServices.sendMessage(res.InviteCount);
				this.commonServices.visibility = "hidden";
				this.cdRef.detectChanges();
				// admin = res._adminlistcount;
				// this.pillmateUser = res._pillmatecount;
				// this.pharmacyUser = res._pharmacycount;
			}, error => {
				this.commonServices.customError(1);
				this.commonServices.visibility = "hidden";
			});
		}
		else if (this.userdlist.RoleId == 2 || this.userdlist.RoleId == 5) {
			this.apiServices.GetList('Dashboard/GetDashPAList?pid=' + this.userdlist.PharmacyId + '&pgid=' + this.userdlist.PharmacyGrpId + '&prid=' + this.userdlist.RoleId + '&year=' + this.selectedYear + "&phadminid=" + this.userdlist.UserId).subscribe((res: any) => {
				// this.data = res;
				// this.listOfYears = res.years;
				// this.pieChartData = [this.data.papharmlist.length]
				// this.pieChartData1 = [this.data._paneworder, this.data._pafulllfilment, this.data._papackedorder, this.data._padeliveredorder, this.data._pacancelledorder];

				// this.barChartData[0].data = this.data.payearData1;
				// this.barChartData[1].data = this.data.payearData2;
				localStorage.setItem('invcount', res.InviteCount);
				this.commonServices.apiInviteCount = res.InviteCount;
				this.commonServices.sendMessage(res.InviteCount);
				this.cdRef.detectChanges();
				this.commonServices.visibility = "hidden";
			}, error => {
				this.commonServices.customError(1);
				this.commonServices.visibility = "hidden";
			});
		}
	}

	postBrowserSubscriptions() {
		let user = JSON.parse(localStorage.getItem('userdetails'));
		let sub = JSON.parse(localStorage.getItem('pushNotification'));
		let data = {
			UserId: user.UserId,
			PharmacyId: user.PharmacyId,
			EndPoint: sub ? sub.endpoint : null,
			P256dh: sub ? sub.keys.p256dh : null,
			Auth: sub ? sub.keys.auth : null
		}
		this.apiServices.Post(data, 'BrowserSubscription/').subscribe(res => {
			console.log('Subscription Saved');
			// this.send(user.PharmacyId);
		}, error => {
			console.log(error)
		});
	}

	send(PharmacyId) {
		const notificationPayload = {
			"notification": {
				"title": "Angular News",
				"body": "Newsletter Available!",
				"icon": "assets/main-page-logo-small-hat.png",
				"vibrate": [100, 50, 100],
				"data": {
					"dateOfArrival": Date.now(),
					"primaryKey": 1
				},
				"actions": [{
					"action": "explore",
					"title": "Go to the site"
				}]
			}
		};
		this.apiServices.Post({}, 'BrowserSubscription/WebPush/' + PharmacyId).subscribe(res => {
			// alert('notification sent')
		})
	}

	// events
	public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
		console.log(event, active);
	}

	public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
		console.log(event, active);
	}

	getVal(val): void {
		debugger
		if (val != undefined) { this.selectedYear = val; this.loadData() }
	}

	// Payout section
	toPay() {
		this.apiServices.GetList(this.purl + 'PayoutLogin?pharmid=' + this.userdlist.PharmacyId).subscribe((response: any) => {
			if (response == null) {
				this.apiServices.showSnack(GlobalConstant.fetch);
			}
			this.payurl = response.url;
			window.open(this.payurl, '_self');
		}, error => {
			console.log(error);
			this.commonServices.customError(1);
		});
	}

	toAcc() {
		this.apiServices.GetList(this.purl + 'PayoutLogin?pharmid=' + this.userdlist.PharmacyId).subscribe((response: any) => {
			if (response == null) {
				this.apiServices.showSnack(GlobalConstant.fetch);
			}
			this.accounturl = response.url + '#/account';
			window.open(this.accounturl, '_self');
		}, error => {
			this.commonServices.customError(1);
		});
	}

	Payoutuserdetail(response) {
		this.payldata = response._list; this.isStripe = 1;
		if (response.flag) {
			if (response._list.StripeConnectId != undefined && response._list.StripeConnectId != "0" && response._list.StripeConnectId != null && response._list.StripeConnectId != "" && response._list.StripeConnectId != "null" && response._list.StripeConnectId != 0) {
				this.isStripe = 2;
				if (!this.payldata.StripeDetailsubmitted && !this.payldata.ChargesEnabled) {
					this.isStripe = 3;
				} else if (!this.payldata.StripeDetailsubmitted && !this.payldata.PayoutEnabled) {
					this.isStripe = 5;
				}
				if (response.balance != undefined && response.balance != "" && response.balance != null) {
					this.baldata = response.balance.available[0];
				}
			}
			else if (response._list.StripeConnectId == "" || response._list.StripeConnectId == null || response._list.StripeConnectId == "null" || response._list.StripeConnectId == "0" || response._list.StripeConnectId == undefined || response._list.StripeConnectId == 0 || response._list.StripeConnectId <= 0) {
				this.isStripe = 1;
			}
		}
		this.commonServices.visibility = "hidden";
		this.cdRef.detectChanges();
	}



	OnBoardLink() {
		this.apiServices.GetList(this.purl + 'Payout?email=' + this.payldata.Email1 + '&accountid=' + this.payldata.StripeConnectId + '&pharmid=' + this.userdlist.PharmacyId).subscribe((response: any) => {
			if (response != null) {
				window.open(response.url, '_self');
			} else {
				this.apiServices.showSnack(GlobalConstant.fetch);
			}
			this.commonServices.visibility = "hidden";
		}, error => {
			console.log(error);
			this.commonServices.customError(1);
			this.commonServices.visibility = "hidden";
		});
	}

	PayoutDashboard() {
		this.apiServices.GetList(this.purl + 'PayoutLogin?pharmid=' + this.userdlist.PharmacyId).subscribe((response: any) => {
			if (response != null) {
				this.payldata = response._list;
				window.open(response.url, '_blank');
			} else {
				this.apiServices.showSnack(GlobalConstant.fetch);
			}
			this.commonServices.visibility = "hidden";
		}, error => {
			this.commonServices.customError(1);
			this.commonServices.visibility = "hidden";
		});
	}
}

function ngOnInit() {
	throw new Error('Function not implemented.');
}
