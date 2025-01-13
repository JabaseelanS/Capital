import { ChangeDetectorRef, EventEmitter, Input, Output } from "@angular/core";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { animation } from "../../../../../../../app/directives/transition.directive";
import { SubheaderService } from "../../../../../../../app/core/_base/layout";
import { ApiServices } from "../../../../../../../app/views/services/api.services";
import { CommonServices } from "../../../../../../../app/views/services/common";
import { PageEvent } from "@angular/material";
import { MatDialog } from "@angular/material";
import { DeletePopupComponent } from "../../../../../../../app/views/pages/dialogs/delete-popup/delete-popup.component";
import { environment } from "../../../../../../../environments/environment.prod";
import * as signalR from "@aspnet/signalr";
import { AlertDialogComponent } from "../../../../dialogs/alert-dialog/alert.dialog.component";
import { TableDataSource } from "angular4-material-table";
import { PrescriptionModel } from "../../live.order.model";
import { NotifierService } from "angular-notifier";
import { OrderStatusDialogComponent } from "../../../../dialogs/orderstatus-dialog/orderstatus-dialog.component";
import { GlobalConstant } from "../../../../../../../app/views/pages/globals/globalvariables";
import { DatePipe, TitleCasePipe } from "@angular/common";
import { BookDeliveryDialogComponent } from "../../../../../../../app/views/pages/dialogs/book-delivery-dialog/book-delivery-dialog.component";
import { DeliveryBookingModel } from "../../../../dialogs/book-delivery-dialog/book-delivery.model";
import { CourierstatusDialogComponent } from "../../../../dialogs/courierstatus-dialog/courierstatus-dialog.component";
import { debounce } from "lodash";

var that: any;
@Component({
	selector: "pp-order-detail",
	templateUrl: "./order-detail.component.html",
	styleUrls: ["./order-detail.component.scss"],
	animations: [animation],
	host: { "[@animation]": "" },
})
export class OrderDetailComponent implements OnInit {
	@Input() isPage;
	orderId = 0;
	liveLoadFlag = 0;
	filterStatusId: any = 0;
	deleteBy = false;
	loadedData: PrescriptionModel[];
	orderDLList = [];
	orders = [];
	url = "PharmacistReviewV2/";
	syncUrl = "trackDelivery";
	successorderStatusList = [];
	orderStatusListByPickup = [];
	filterPharmacyId: any;
	@Input() pharmacyList;
	userdetails: any;
	setData: any;
	dataset: MatTableDataSource<any>;
	orderModel: any;
	displayedPresDetailsColumns: string[] = ["OrderNo", "CreatedDate", "Items", "Total", "FullName", "MobileNo", "OrderType", "IsPaid", "IsOrderStatus"];
	pageSize = 10;
	pageSizeOptions: number[] = [5, 10, 50, 100];
	pageEvent: PageEvent;
	length: number;
	lowValue: number = 0;
	highValue: number = 10;
	showTestOrders = false;
	orderDataSource: any;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	liveDataSourceTemp: any;
	liveDataSource = [];
	tempPharmacyList = [];
	private _hubConnection: signalR.HubConnection;
	results: any;
	prescriptionDetailsDataSource: TableDataSource<any>;
	@Output() prescriptionListChange = new EventEmitter<PrescriptionModel[]>();
	@Output() loaderHide = new EventEmitter<boolean>();
	tempOrderList: any;
	IsSherpaDelivery: boolean;
	filterSearch: "";
	orderDatailPFList = [];
	orderStatusList = [];
	signalrOrder: any = [];
	filterOrderStatusId = "0";
	tempFiltList: any;
	filterOrderType: any = "0";
	FilterByDate: any;
	deliveryBook: DeliveryBookingModel;
	viewAllOrders = [
		{ id: 0, value: "Live orders" },
		{ id: 5, value: "Completed orders" },
		{ id: 8, value: "Cancelled orders" },
	];
	OrderTypeList = [
		{ id: 1, value: "Delivery" },
		{ id: 2, value: "Pickup" },
		{ id: 3, value: "Next business day delivery" },
	];
	isDeliveryBooked: boolean = true;
	str = "";
	startCount = 0;
	endCount = 10;
	isLoading = false;
	constructor(private _subheaderService: SubheaderService, public cdf: ChangeDetectorRef, private apiService: ApiServices, public router: Router, public commonServices: CommonServices, private dialog: MatDialog, private notifier: NotifierService, public datePipe: DatePipe) {
		this.userdetails = JSON.parse(localStorage.getItem("userdetails"));
		this.filterPharmacyId = this.userdetails.PharmacyId;
	}

	ngOnInit() {
		localStorage.setItem("signalrOrder", JSON.stringify(null));
		this.orderStatusList = this.commonServices.orderStatusList;
		if ((this.userdetails.RoleId == 1 || this.userdetails.RoleId == 5) && (this.isPage == 1 || this.isPage == 3)) {
			this.orderStatusList = this.commonServices.orderStatusListAdmin;
		}
		if (this.userdetails.RoleId == 3) {
			if (this.isPage == 1 || this.isPage == 3) {
				this.orderStatusList = [
					{ id: 1, value: "Confirm order", isflag: false },
					{ id: 6, value: "Awaiting payment", isflag: false },
					{ id: 2, value: "Request delivery", isflag: false },
					{ id: 20, value: "Ready for Pickup", isflag: true },
					{ id: 11, value: "Courier Arrived", isflag: false },
					{ id: 16, value: "Complete Order", isflag: false },
					{ id: 5, value: "Order completed", isflag: false },
					{ id: 10, value: "Out for delivery", isflag: false },
					{ id: 8, value: "Order cancelled", isflag: false },
				];
			}
		}

		if (this.isPage == 2) {
			this.orderStatusList = [
				{ id: 8, value: "Order cancelled" },
				{ id: 5, value: "Order completed" },
			];
		}
		// this._subheaderService.setTitle("Live Orders");
		// this.commonServices.decider = false;
		that = this;
		this.pharmNotify();
		this.startNotify();
		this.setConnection();
		this.connectionCheck();
		this.loadInitData(0, "", false);
		//this.commonServices.visibility = "hidden";
		//this.str = this.isDeliveryBooked ? "Book Delivery" : "Delivery Status";
	}

	getDetailsSync(orderModel, isBookingPopup) {
		if (orderModel.isLoading) return;
		orderModel.isLoading = true;

		this.apiService.Get("Sherpa/trackDelivery?deliveryId=" + orderModel.BookingReference).subscribe(
			(data: any) => {
				if (data != null && data.error) {
					this.apiService.showSnack(data.error);
				}
				if (isBookingPopup) {
					setTimeout(() => {
						this.getDetails(orderModel.OrderId, orderModel.CurrentStatus);
					}, 100);
				} else {
					orderModel.isLoading = false;
				}
			},
			(error) => {
				this.commonServices.customError(1);
				orderModel.isLoading = false;
			}
		);
	}

	getBookingDetails(orderModel, userdetails) {
		if (!orderModel) {
			return;
		}
		if (userdetails && orderModel.IsSherpaDelivery && userdetails.RoleId == 1) {
			this.getDetailsSync(orderModel, true);
			orderModel.isLoading = false;
		} else {
			this.getDetails(orderModel.OrderId, orderModel.CurrentStatus);
		}
	}

	// Getting details for delivery booking
	async getDetails(id, stat) {
		var ur = stat == "Book Delivery" ? false : true;
		this.commonServices.visibility = "shown";
		//  this.commonServices.backDrpCls();
		this.apiService.GetList("DoorDash/getDetailInfo?orderid=" + id + "&val=" + ur).subscribe(
			(resp: any) => {
				if (resp != null) {
					this.commonServices.ddpage = true;
					this.dialog
						.open(BookDeliveryDialogComponent, {
							disableClose: true,
							data: resp,
							width: "80%",
							height: "auto",
							maxHeight: "700px",
						})
						.afterClosed()
						.subscribe((val) => {
							if (val != null) {
								// console.log("val ==>", val.ExternalDeliveryId, val.CurrentStatus, val.BookingReference);
								this.commonServices.ddpage = false;
								this.setDeliveryStatus(val.ExternalDeliveryId, val.CurrentStatus, val.BookingReference, val.IsSherpaDelivery);
							}
						});
				}
			},
			(err) => {
				this.commonServices.customError(1);
				this.commonServices.visibility = "hidden";
				// this.cdf.detectChanges();
			}
		);
	}

	fetchDataByOrders(e) {
		this.commonServices.visibility = "shown";
		this.startCount = 0;
		this.endCount = 10;
		this.filterSearch = "";
		this.filterOrderStatusId = "0";
		this.filterOrderType = "0";
		this.filterPharmacyId = this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5 ? "0" : this.filterPharmacyId;
		this.loadInitData(e, "", false);
	}

	getPaginatorData(event: PageEvent) {
		this.lowValue = event.pageIndex * event.pageSize;
		this.highValue = this.lowValue + event.pageSize;
		if (this.isPage == 1) {
			this.pageSize = this.lowValue + 1;
			this.startCount = this.lowValue;
			this.endCount = this.highValue;
			this.commonServices.visibility = "shown";
			var phid = this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5 ? "0" : this.filterPharmacyId == null || this.filterPharmacyId <= 0 || this.filterPharmacyId == "0" ? 0 : this.filterPharmacyId;
			var search = this.filterSearch == null || this.filterSearch == "" || this.filterSearch == undefined ? "" : this.filterSearch;
			var statusid = this.filterOrderStatusId == null || this.filterOrderStatusId == "0" ? 0 : this.filterOrderStatusId;
			var ordertype = this.filterOrderType == null || this.filterOrderType == "0" ? 0 : this.filterOrderType;
			var filterStatusId = this.filterStatusId == null || this.filterStatusId == "0" ? 0 : this.filterStatusId;
			var url = "";
			if (this.showTestOrders) {
				this.OnshowTestOrders(true, true);
				return;
			} else if (filterStatusId > 0 && (this.userdetails.RoleId == 1 || this.userdetails.RoleId == 5)) {
				url = this.url + "GetPrescriptionByOrder?pharmacyid=" + this.filterPharmacyId + "&roleid=" + this.userdetails.RoleId + "&pharmacygrpid=" + this.userdetails.PharmacyGrpId + "&statusid=" + filterStatusId + "&phadminid=" + this.userdetails.UserId + "&startcount=" + this.startCount + "&endcount=" + this.endCount + "&search=" + (search == undefined || search == null ? "" : search);
			} else {
				if (this.userdetails.RoleId == 3 || this.userdetails.RoleId == 4) {
					url = this.url + "filterOrderByPharmacy?pharmacygrpid=" + 0 + "&pharmacyid=" + phid + "&filter=" + false + "&roleid=" + this.userdetails.RoleId + "&phadminid=" + this.userdetails.UserId + (this.isPage == 1 ? "&startcount=" + this.startCount + "&endcount=" + this.endCount : "") + "&search=" + search + "&statusid1=" + statusid + "&ordertype=" + ordertype;
				} else {
					var ordertype = this.filterOrderType == null || this.filterOrderType == "0" ? 0 : this.filterOrderType;
					url = this.url + "GetPrescriptionByOrder?pharmacyid=" + this.filterPharmacyId + "&roleid=" + this.userdetails.RoleId + "&pharmacygrpid=" + this.userdetails.PharmacyGrpId + "&statusid=" + 0 + "&phadminid=" + this.userdetails.UserId + "&startcount=" + this.startCount + "&endcount=" + this.endCount + "&search=" + search + "&statusid1=" + statusid + "&ordertype=" + ordertype;
				}
			}
			this.apiCall(url, 1);
		} else {
			return event;
		}
	}

	OnshowTestOrders(val, flag) {
		this.filterPharmacyId = this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5 ? "0" : this.filterPharmacyId;
		if (!flag) {
			this.startCount = 0;
			this.endCount = 10;
		}
		if (val) {
			this.url = "PharmacistReviewV2/";
			if (this.isPage == 2) {
				this.url = "PharmacyHistoryV2/";
			}
			if (this.isPage == 3) {
				this.url = "PharmacistReviewRAT/";
			}
			this.commonServices.visibility = "shown";
			this.filterStatusId = 0;
			this.filterOrderStatusId = "0"; //this.filterPharmacyId = 10002;
			var url = this.url + "filterOrderByPharmacy?pharmacygrpid=" + 0 + "&pharmacyid=" + 10002 + "&filter=" + false + "&roleid=" + this.userdetails.RoleId + "&phadminid=" + this.userdetails.UserId + (this.isPage == 1 ? "&startcount=" + this.startCount + "&endcount=" + this.endCount : "");
			this.apiCall(url, false);
		} else {
			this.commonServices.visibility = "shown";
			this.loadInitData(0, "", false);
		}
	}

	loadInitData(statusid, search, flag) {
		if (this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5) {
			if (!flag) {
				this.filterPharmacyId = "0";
			}
		}
		var url = this.isPage == 1 ? "PharmacistReviewV2/" : "PharmacistReviewRAT/";
		this.showTestOrders = false;
		if (this.isPage == 2) {
			url = "PharmacyHistoryV2/GetPharmacyByRole?roleid=" + this.userdetails.RoleId + "&pharmacygrpid=" + this.userdetails.PharmacyGrpId + "&phadminid=" + this.userdetails.UserId + "&pid=" + this.userdetails.PharmacyId;
		} else {
			url = url + "GetPrescriptionByOrder?pharmacyid=" + this.filterPharmacyId + "&roleid=" + this.userdetails.RoleId + "&pharmacygrpid=" + this.userdetails.PharmacyGrpId + "&statusid=" + statusid + "&phadminid=" + this.userdetails.UserId + "&startcount=" + this.startCount + "&endcount=" + this.endCount + "&search=" + (search == undefined || search == null ? "" : search);
		}
		this.apiService.GetList(url).subscribe(
			(res: any) => {
				// console.log('Initial data set:->>', res);
				if (this.isPage == 2) {
					this.liveDataSource = [];
					this.liveDataSourceTemp = [];
					this.pharmacyList = res;
					this.tempPharmacyList = res;
					this.commonServices.visibility = "hidden";
				} else {
					if (res.orderModel != null || res.orderModel != undefined) {
						this.tempOrderList = res;
						var RecordCount = 0;
						this.setValue(res);
						if (this.isPage == 1) {
							if (res.orderModel.length > 0) {
								RecordCount = res.orderModel[0].RecordCount;
							}
							if (statusid != -1) {
								this.setPagin(RecordCount);
							}
						}
						this.commonServices.visibility = "hidden";
					} else {
						this.loaderHide.emit(true);
						this.ressetValue(res);
					}
				}
				this.lowValue = 0;
				this.highValue = 10;
				this.paginator.pageIndex = 0;
			},
			(err) => {
				console.log(err);
				this.commonServices.customError(1);
				this.commonServices.visibility = "hidden";
				// this.cdf.detectChanges();
			}
		);
	}

	OnSearch() {
		var list = {
			Name: this.filterSearch,
			IsStatus: this.filterOrderStatusId,
			PharmacyId: this.filterPharmacyId,
			DeliverBy: this.filterOrderType,
			Start: this.FilterByDate != undefined && this.FilterByDate != null ? this.datePipe.transform(new Date(this.FilterByDate.begin), "dd MMM yyyy hh:mm a") : null,
			End: this.FilterByDate != undefined && this.FilterByDate != null ? this.datePipe.transform(new Date(this.FilterByDate.end), "dd MMM yyyy hh:mm a") : null,
			RoleId: this.userdetails.RoleId,
			pharmacies: this.tempPharmacyList,
		};
		this.commonServices.visibility = "shown";
		this.showTestOrders = false;
		this.apiService.Post(list, "PharmacyHistoryV2/SearchByHistory").subscribe(
			(res: any) => {
				console.log("Initial data set:->>", res);
				res.pharmacyModel = this.tempPharmacyList;
				if (res.orderModel != null || res.orderModel != undefined) {
					this.tempOrderList = res;
					this.setValue(res);
					this.commonServices.visibility = "hidden";
				} else {
					this.loaderHide.emit(true);
					this.ressetValue(res);
				}
			},
			(err) => {
				console.log(err);
				this.commonServices.customError(1);
				this.commonServices.visibility = "hidden";
				// this.cdf.detectChanges();
			}
		);
	}

	gotoDetails(row) {
		this.url = "PharmacistReviewV2/";
		if (this.isPage == 2) {
			this.url = "PharmacyHistoryV2/";
		}
		if (this.isPage == 3) {
			this.url = "PharmacistReviewRAT/";
		}
		var grpid = this.userdetails.PharmacyGrpId;
		this.apiService.GetList(this.url + "GetPrescriptionByView?orderid=" + row.OrderId + "&pharmacygrpid=" + grpid + "&phid=" + row.PharmacyId + "&rid=" + this.userdetails.RoleId).subscribe(
			(res: any) => {
				if (res.flag) {
					var data = {
						btnCancelText: "",
						btnOkText: "OK",
						title: "Live Order",
						message: res.orderModel.ErroMessage,
						height: "205px",
						flag: res.orderModel.CheckOrder == 1 ? 5 : 6,
						list: res.liveOrders,
					};
					this.alertDialog(data);
					return;
				}
				res.orderModel.isPage = this.isPage;
				this.commonServices.isPage = this.isPage;
				res.orderModel.pharmacies = this.pharmacyList;
				localStorage.setItem("LiveOrder", JSON.stringify(res));
				this.commonServices.PrescriptionTabData = res;
				this.router.navigate(["/app/masters/tabs"]);
			},
			(err) => {
				this.commonServices.visibility = "hidden";
				this.commonServices.customError(1);
				this.cdf.detectChanges();
			}
		);
	}

	applyFilter(value, flag) {
		if (this.isPage == 1) {
			this.filterPharmacyId = this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5 ? "0" : this.filterPharmacyId;
			this.filterStatusId = this.userdetails.RoleId == 1 || this.userdetails.RoleId == 5 ? this.filterStatusId : 0;
			this.startCount = 0;
			this.endCount = 10;
			this.filterOrderType = "0";
			this.filterOrderStatusId = "0";
			this.showTestOrders = false;
			this.loadInitData(this.filterStatusId, value, false);
		} else {
			this.pageSize = this.liveDataSourceTemp.length;
			this.filterOrderType = "0"; // 8;
			if (value == undefined || value == null || value == "") {
				var prescriptionDataSource = this.liveDataSourceTemp;
				this.liveDataSource = prescriptionDataSource.slice(0, this.pageSize);
				if (prescriptionDataSource.length > 100) {
					this.pageSizeOptions.push(prescriptionDataSource.length);
				}
			} else {
				var filter = this.liveDataSourceTemp.filter(function (val) {
					if (val.FullName != null && val.MobileNo != null) {
						return (val.MarketPlaceDisplayId != null && val.MarketPlaceDisplayId != undefined && val.MarketPlaceDisplayId != "" && val.MarketPlaceDisplayId.toLowerCase().indexOf(value.trim().toLowerCase()) != -1) || val.MobileNo.toLowerCase().indexOf(value.trim().toLowerCase()) != -1 || val.FullName.toLowerCase().includes(value.trim().toLowerCase()) != false || val.OrderNo.toLowerCase().indexOf(value.trim().toLowerCase()) != -1;
					} else {
						return val.OrderNo.toLowerCase().indexOf(value.trim().toLowerCase()) != -1;
					}
				});
				this.liveDataSource = filter.slice(0, this.pageSize);
				this.length = filter.length;
				this.setPagin(this.length);
				if (this.length > 100) {
					this.pageSizeOptions.push(filter.length);
				}
			}
		}
	}

	fetchData(data) {
		if (this.isPage == 1) {
			var status = data.value == null || data.value == "0" ? 0 : data.value;
			this.startCount = 0;
			this.endCount = 10;
			this.showTestOrders = false;
			// if (status == 20) { status = 2; }
			var url = this.url + "GetPrescriptionByOrder?pharmacyid=" + this.filterPharmacyId + "&roleid=" + this.userdetails.RoleId + "&pharmacygrpid=" + this.userdetails.PharmacyGrpId + "&statusid=" + 0 + "&phadminid=" + this.userdetails.UserId + "&startcount=" + this.startCount + "&endcount=" + this.endCount + "&statusid1=" + status;
			this.commonServices.visibility = "shown";
			this.filterStatusId = 0;
			this.filterSearch = "";
			this.filterOrderType = "0";
			this.filterOrderStatusId = status == 0 ? status.toString() : status;
			this.filterPharmacyId = this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5 ? "0" : this.filterPharmacyId;
			this.apiCall(url, 3);
		} else {
			this.pageSize = this.liveDataSourceTemp.length;
			if (data.value != "0") {
				var datv = data.value;
				if (data.value == 20) {
					datv = 2;
				}
				var filter = this.liveDataSourceTemp.filter(function (val) {
					return val.IsStatus == datv;
				});
				if ((this.userdetails.RoleId == 1 || this.userdetails.RoleId == 5) && data.value == 2) {
				} else {
					if (data.value == 20) {
						filter = filter.filter(function (val) {
							return val.DeliverBy == 2;
						});
					} else if (data.value == 2) {
						filter = filter.filter(function (val) {
							return val.DeliverBy == 1;
						});
					}
				}
				this.liveDataSource = filter.slice(0, this.pageSize);
				this.length = this.liveDataSource.length;
				this.setPagin(this.length);
				if (this.length > 100) {
					this.pageSizeOptions.push(this.liveDataSource.length);
				}
			} else {
				var filter = this.liveDataSourceTemp; //new MatTableDataSource(this.orders);
				this.liveDataSource = filter.slice(0, this.pageSize);
				this.setPagin(this.liveDataSource.length);
				if (this.liveDataSource.length > 100) {
					this.pageSizeOptions.push(this.liveDataSource.length);
				}
			}
		}
	}

	setPagin(evd) {
		var eve = {
			previousPageIndex: 1,
			pageIndex: 0,
			pageSize: 10,
			length: evd,
		};
		this.lowValue = eve.pageIndex * eve.pageSize;
		this.highValue = this.lowValue + eve.pageSize;
		if (this.isPage != 1) {
			this.paginator.firstPage();
		}
	}

	searchFilterBypharmacy(value, flag) {
		let data = []; //debugger
		this.tempPharmacyList.filter((val) => {
			if (val.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) {
				data.push(val);
			}
		});
		this.pharmacyList = data;
	}

	fetchDataByPharmacy(data) {
		var filterF = false;
		this.filterStatusId = 0;
		this.filterOrderStatusId = "0";
		this.filterOrderType = "0";
		this.filterSearch = "";
		this.showTestOrders = false;
		if (data == "0") {
			data = 0;
			var grpid = this.userdetails.PharmacyGrpId;
			filterF = true;
		} else {
			var grpid = this.userdetails.PharmacyGrpId;
			if (this.userdetails.RoleId == 1) {
				var filter = this.tempPharmacyList.filter(function (val) {
					return val.PharmacyId == data;
				});
				if (filter.length > 0) {
					grpid = filter[0].PharmacyGrpId;
				}
			}
		}
		this.url = "PharmacistReviewV2/";
		this.showTestOrders = false;
		this.startCount = 0;
		this.endCount = 10;
		if (this.isPage == 2) {
			this.url = "PharmacyHistoryV2/";
		}
		if (this.isPage == 3) {
			this.url = "PharmacistReviewRAT/";
		}
		this.commonServices.visibility = "shown";
		var url = this.url + "filterOrderByPharmacy?pharmacygrpid=" + grpid + "&pharmacyid=" + data + "&filter=" + filterF + "&roleid=" + this.userdetails.RoleId + "&phadminid=" + this.userdetails.UserId + (this.isPage == 1 ? "&startcount=" + this.startCount + "&endcount=" + this.endCount : "");
		if ((this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5) && filterF) {
			var pgrpid = 0;
			if (this.userdetails.RoleId == 2) {
				pgrpid = grpid;
			}
			url = this.url + "filterOrderByPharmacyByAll?pharmacyid=" + data + "&pharmacygrpid=" + pgrpid + "&roleid=" + this.userdetails.RoleId + "&phadminid=" + this.userdetails.UserId + (this.isPage == 1 ? "&startcount=" + this.startCount + "&endcount=" + this.endCount : "");
		}
		this.apiCall(url, 2);
	}

	fetchDataByOrderType(data) {
		if (this.isPage == 1) {
			this.commonServices.visibility = "shown";
			this.filterStatusId = 0;
			this.filterOrderStatusId = "0";
			this.filterSearch = "";
			this.showTestOrders = false;
			var ordertype = data == null || data == "0" ? 0 : data;
			this.startCount = 0;
			this.endCount = 10;
			this.filterPharmacyId = this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5 ? "0" : this.filterPharmacyId;
			var url = this.url + "GetPrescriptionByOrder?pharmacyid=" + this.filterPharmacyId + "&roleid=" + this.userdetails.RoleId + "&pharmacygrpid=" + this.userdetails.PharmacyGrpId + "&statusid=" + 0 + "&phadminid=" + this.userdetails.UserId + "&startcount=" + this.startCount + "&endcount=" + this.endCount + "&ordertype=" + ordertype;
			this.apiCall(url, 2);
		} else {
			if (data != null && data != "" && data != undefined && data != 0 && data != "0") {
				var list = this.liveDataSourceTemp.filter(function (a) {
					return a.DeliverBy == data;
				});
				this.liveDataSource = list;
			} else {
				this.liveDataSource = this.liveDataSourceTemp;
			}
		}
	}

	apiCall(url, flag) {
		this.apiService.GetList(url).subscribe(
			(res: any) => {
				if (res != null && res.orderModel != null && res.orderModel.length > 0) {
					if (this.isPage == 2) {
						res.pharmacyModel = this.tempPharmacyList;
					}
					this.setValue(res);
					var RecordCount = 0;
					if (this.isPage == 1) {
						if (res.orderModel.length > 0) {
							RecordCount = res.orderModel[0].RecordCount;
						}
						if (flag == 2 || flag == 3) {
							this.paginator.pageIndex = 0;
						}
						this.setPagin(RecordCount);
					}
				} else {
					this.ressetValue(res);
				}
			},
			(err) => {
				this.commonServices.visibility = "hidden";
				this.commonServices.customError(1);
				this.cdf.detectChanges();
			}
		);
	}

	setValue(res) {
		this.liveDataSource = res.orderModel;
		this.liveDataSourceTemp = res.orderModel;
		this.successorderStatusList = res.successorderStatusList;
		this.orderStatusListByPickup = res.orderStatusListByPickup;
		this.pharmacyList = res.pharmacyModel;
		this.tempPharmacyList = res.pharmacyModel;
		this.commonServices.visibility = "hidden";
		this.cdf.detectChanges();
	}

	ressetValue(res) {
		this.liveDataSource = [];
		this.liveDataSourceTemp = [];
		this.successorderStatusList = res.successorderStatusList;
		this.orderStatusListByPickup = res.orderStatusListByPickup;
		this.pharmacyList = res.pharmacyModel;
		this.tempPharmacyList = res.pharmacyModel;
		this.commonServices.visibility = "hidden";
		this.cdf.detectChanges();
	}

	promptWarning(ordermodel, flag) {
		// console.log(ordermodel.IsOrderStatus)
		if (ordermodel.IsOrderStatus == 1) {
			this.gotoDetails(ordermodel);
			return;
		}
		var str: string;
		// for Admin
		if (flag && ordermodel.IsOrderStatus != 1 && ordermodel.IsOrderStatus != 6) {
			if (ordermodel.DeliverBy == 2) {
				var k = this.orderStatusListByPickup.filter(function (val) {
					// console.log(val.id, val.value);
					if (ordermodel.IsOrderStatus == val.id) {
						if (ordermodel.IsOrderStatus == 16) {
							str = "Please confirm the customer has picked up the order.";
						} else if (ordermodel.IsOrderStatus == 2) {
							str = "Please confirm this order is ready for pickup.";
						} else {
							str = "Do you want to change this order to " + val.value.toString() + " ?";
						}
					} else {
						return;
					}
				});
			} else if (ordermodel.DeliverBy == 1 || ordermodel.DeliverBy == 3) {
				var k = this.successorderStatusList.filter(function (val) {
					if (ordermodel.IsOrderStatus == 2) {
						str = "Please confirm that this delivery order doesn't have S4 restricted and/or S8 medicines.";
					} else if (ordermodel.IsOrderStatus == 11) {
						str = "Please confirm the courier has picked up the order for delivery.";
					} else if (ordermodel.IsOrderStatus == val.id) {
						str = "Do you want to change this order to " + val.value.toString() + " ?";
					} else {
						return;
					}
				});
			} else {
				return;
			}
		}
		// for pharmacy user
		else if (!flag && ordermodel.IsOrderStatus != 1 && ordermodel.IsOrderStatus != 6) {
			if (ordermodel.DeliverBy == 2) {
				var k = this.orderStatusListByPickup.filter(function (val) {
					console.log(val.id, val.value);
					if (ordermodel.IsOrderStatus == val.id) {
						if (ordermodel.IsOrderStatus == 16) {
							str = "Please confirm the customer has picked up the order.";
						} else if (ordermodel.IsOrderStatus == 2) {
							str = "Please confirm this order is ready for pickup.";
						} else {
							return;
						}
					} else {
						return;
					}
				});
			} else if (ordermodel.DeliverBy == 1 || ordermodel.DeliverBy == 3) {
				var k = this.successorderStatusList.filter(function (val) {
					if (ordermodel.IsOrderStatus == 2) {
						str = "Please confirm that this delivery order doesn't have S4 restricted and/or S8 medicines.";
					} else if (ordermodel.IsOrderStatus == 11) {
						str = "Please confirm the courier has picked up the order for delivery.";
					} else {
						return;
					}
				});
			} else {
				return;
			}
		} else {
			return;
		}
		var data = {
			btnCancelText: "Cancel",
			btnOkText: "Confirm",
			title: "Live Order",
			message: str,
			height: "205px",
			flag: 4,
			list: ordermodel,
		};
		this.alertDialog(data);
	}

	Post(ordermodel) {
		if (ordermodel.IsOrderStatus == 1) {
			this.gotoDetails(ordermodel);
			return;
		}
		ordermodel.uploadList = this.loadedData == null || this.loadedData == undefined ? [] : this.loadedData;
		// ordermodel.Total = 0;
		ordermodel.orderDetails = this.orderDLList == null || this.orderDLList == undefined ? [] : this.orderDLList;
		ordermodel.orderPFModel = this.orderDatailPFList == null || this.orderDatailPFList == undefined ? [] : this.orderDatailPFList;
		var ostatus = ordermodel.IsOrderStatus;
		var statusId = ordermodel.IsOrderStatus;
		ordermodel.IsPreviousOrderStatus = ordermodel.IsStatus;
		if (ordermodel.IsOrderStatus == 1) {
			statusId = 6;
		}

		if (this.commonServices.checkValidation(ordermodel, this.prescriptionDetailsDataSource, statusId)) {
			ordermodel.IsIcon = false;
			if (this.userdetails.RoleId == 3 || this.userdetails.RoleId == 4 || this.userdetails.RoleId == 5) {
				if (ordermodel.IsOrderStatus == 1) {
					ordermodel.IsOrderStatus = 6;
				} else if (ordermodel.IsOrderStatus == 2) {
					ordermodel.IsOrderStatus = 11;
					if (ordermodel.DeliverBy == 2) {
						ordermodel.IsOrderStatus = 16;
					}
				} else if (ordermodel.IsOrderStatus == 4) {
					ordermodel.IsOrderStatus = 11;
					if (ordermodel.DeliverBy == 2) {
						ordermodel.IsOrderStatus = 5;
					}
				} else if (ordermodel.IsOrderStatus == 11) {
					ordermodel.IsOrderStatus = 10;
				} else if (ordermodel.IsOrderStatus == 12) {
					ordermodel.IsOrderStatus = 2;
				} else if (ordermodel.IsOrderStatus == 13) {
					ordermodel.IsOrderStatus = 5;
				} else if (ordermodel.IsOrderStatus == 16) {
					if (ordermodel.DeliverBy == 2) {
						ordermodel.IsOrderStatus = 5;
					}
				}
			} else {
				if (ordermodel.IsOrderStatus == 1) {
					ordermodel.IsOrderStatus = 6;
				} else if (ordermodel.IsOrderStatus == 2) {
					ordermodel.IsOrderStatus = 11;
					if (ordermodel.DeliverBy == 2) {
						ordermodel.IsOrderStatus = 16;
					}
				} else if (ordermodel.IsOrderStatus == 11) {
					ordermodel.IsOrderStatus = 10;
				} else if (ordermodel.IsOrderStatus == 10) {
					ordermodel.IsOrderStatus = 5;
				} else if (ordermodel.IsOrderStatus == 13) {
					ordermodel.IsOrderStatus = 5;
				} else if (ordermodel.IsOrderStatus == 14) {
					ordermodel.IsOrderStatus = 15;
				} else if (ordermodel.IsOrderStatus == 16) {
					if (ordermodel.DeliverBy == 2) {
						ordermodel.IsOrderStatus = 5;
					}
				}
			}

			ordermodel.uploadList.forEach((element) => {
				if (element.TotalDays == "" || element.TotalDays == undefined || element.TotalDays == null) {
					element.TotalDays = 0;
				}
				if (element.TotalRepeats == "" || element.TotalRepeats == undefined || element.TotalRepeats == null) {
					element.TotalRepeats = 0;
				}
				if (element.DaysRemaining == "" || element.DaysRemaining == undefined || element.DaysRemaining == null) {
					element.DaysRemaining = 0;
				}
				if (element.RemainingRepeats == "" || element.RemainingRepeats == undefined || element.RemainingRepeats == null) {
					element.RemainingRepeats = 0;
				}
				if (element.OriginalPrice == "" || element.OriginalPrice == undefined || element.OriginalPrice == null) {
					element.OriginalPrice = 0;
				}
			});
			ordermodel.LiveLoadFlag = 1;
			// console.log('tempOrderList List===', this.tempOrderList);
			ordermodel.initiateBy = this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5 ? 0 : this.userdetails.PharmacyId;
			ordermodel.PharmacyGrpId = this.userdetails.PharmacyGrpId;
			ordermodel.PharmacyGroupUserId = this.userdetails.UserId;
			ordermodel.RoleId = this.userdetails.RoleId;
			this.url = "PharmacistReviewV2/";
			if (this.isPage == 2) {
				this.url = "PharmacyHistoryV2/";
			}
			if (this.isPage == 3) {
				this.url = "PharmacistReviewRAT/";
			}
			// this.commonServices.visibility = "shown";
			this.apiService.Post(ordermodel, this.url + "Post?id=" + ordermodel.OrderId + "&deleteBy=" + this.deleteBy + "&createdby=" + this.userdetails.UserId).subscribe(
				(res: any) => {
					console.log(res);
					if (res.flag && res.Omodel.OrderDetailCount <= 0) {
						ordermodel.IsOrderStatus = ostatus;
						ordermodel.rowCreate = false;
						this.commonServices.visibility = "hidden";
						if (res.Omodel.CheckOrder == 1 || res.Omodel.CheckOrder == 2) {
							var data = {
								btnCancelText: "",
								btnOkText: "OK",
								title: "Live Order",
								message: res.Omodel.ErroMessage,
								height: "205px",
								flag: res.Omodel.CheckOrder == 1 ? 5 : 6,
								list: res.liveOrders,
							};
							this.alertDialog(data);
							return;
						}
						// this.apiService.showSnack('Please check the order details.');
					} else {
						if (res.flag && res.tolist != null && res.tolist.orderModel != null && res.tolist.orderModel.length > 0) {
							var signalModel = { type: "3" };
							this.pageSize = 5;
							var textmsg = "Order updated successfully";
							if (res.Omodel.IsOrderStatus == 8) {
								textmsg = "Order cancelled successfully.";
							}
							this.apiService.showSnack(textmsg);
							console.log(res);
							if (this.isPage == 1) {
								this.paginator.pageIndex = 0;
							}
							this.filterSearch = "";
							this.filterOrderStatusId = "0";
							this.filterOrderType = "0";
							this.filterStatusId = 0;
							this.tempOrderList = res.objList;
							this.loadAftPost(res.objList, true);
							//this.signalRApiUpdate(res.tolist, signalModel, 1);
							// if (this.userdetails.RoleId != 1 && res.tolist.orderModel[0].DeliverBy != 2 && res.tolist.orderModel[0].IsOrderStatus != 5) {
							//   this.signalRApiUpdate(res.tolist, signalModel, 1);
							// }
							// else if (this.userdetails.RoleId == 1 && res.tolist.orderModel[0].DeliverBy == 1 && res.tolist.orderModel[0].IsOrderStatus == 5) {
							//   this.signalRApiUpdate(res.tolist, signalModel, 1);
							// } else if (this.userdetails.RoleId == 2 || this.userdetails.RoleId == 3 || this.userdetails.RoleId == 4) {
							//   this.signalRApiUpdate(res.tolist, signalModel, 1);
							// }
							// this.notifier.notify('success', "Order updated successfully.");
						} else {
							// this.spinner.hide();
							this.commonServices.visibility = "hidden";
							this.apiService.showSnack(GlobalConstant.savefailed);
							// this.notifier.notify('error', "Order saved failed");
						}
					}
				},
				(err) => {
					console.log(err);
					ordermodel.IsOrderStatus = ostatus;
					ordermodel.rowCreate = false;
					this.commonServices.customError(2);
					this.commonServices.visibility = "hidden";
				}
			);
		} else {
			this.commonServices.visibility = "hidden";
			if (ordermodel.uploadList.length > 0) {
				ordermodel.rowCreate = true;
			}
			this.apiService.showSnack("Please check the order details.");
		}
	}

	onStatusChange(model) {
		var that = this;
		if (model.IsOrderStatus == 8) {
			this.dialog
				.open(OrderStatusDialogComponent, {
					disableClose: true,
					data: { model },
					width: " 450px",
					// height: '335px'
				})
				.afterClosed()
				.subscribe((val) => {
					if (val != null) {
						val.IsOrderStatus = 8;
						this.Post(val);
					}
				});
		} else {
			this.dialog
				.open(CourierstatusDialogComponent, {
					disableClose: true,
					data: { model },
					width: "auto",
					height: "auto",
				})
				.afterClosed()
				.subscribe((val) => {
					if (val != null) {
						var driverdetails = this.liveDataSource.find((item: any) => item.OrderId == val.OrderId);
						driverdetails.DriverName = val.DriverName;
						driverdetails.DriverMobileNumber = val.DriverMobileNumber;
						driverdetails.MarketPlace = val.MarketPlace;
						driverdetails.CostOfDelivery = val.CostOfDelivery;
						if (driverdetails.IsStatus == 10) {
							driverdetails.IsOrderStatus = 5;
						} else {
							driverdetails.IsOrderStatus = driverdetails.IsStatus;
						}
						this.apiService.showSnack(val.ErroMessage);
					}
				});
		}
	}

	//  -----------    Signal R     ------------
	public pharmNotify = () => {
		this._hubConnection = new signalR.HubConnectionBuilder()
			.configureLogging(signalR.LogLevel.Error)
			.withUrl(environment.apiEndpointR + "/notify", {
				skipNegotiation: true,
				transport: signalR.HttpTransportType.WebSockets,
				// transport: signalR.HttpTransportType.LongPolling
				// transport: signalR.HttpTransportType.ServerSentEvents
			})
			.build();
		// console.log(this._hubConnection.state);
	};

	public startNotify() {
		this._hubConnection.on("BroadcastMessage", (signalModel: any) => {
			this.signalrOrder = JSON.parse(localStorage.getItem("signalrOrder"));
			// console.log(signalModel, window.location.href, environment);
			if (signalModel == null) {
				return;
			}
			if ((window.location.href == environment.portalURL && signalModel.liveLoadFlag == 0) || (window.location.href == environment.portalTabURL && signalModel.liveLoadFlag == 0)) {
				if (this.signalrOrder != null && this.signalrOrder != undefined && this.signalrOrder.orderno == signalModel.orderno && this.signalrOrder.type == signalModel.type) {
					localStorage.setItem("signalrOrder", JSON.stringify(signalModel));
					return;
				}
				localStorage.setItem("signalrOrder", JSON.stringify(signalModel));

				if (this.userdetails.RoleId == 1 && signalModel.pid != "10002") {
					if (signalModel.type == "1" || signalModel.type == "2" || signalModel.type == "5" || signalModel.type == "4" || signalModel.type == "9" || signalModel.type == "10") {
						that.signalRDialogue(signalModel);
					} else if (signalModel.type == "3") {
						this.orderId = 0;
						that.signalRDialogue(signalModel);
					} else if (signalModel.type == "7") {
						that.signalRDialogue(signalModel);
					}
				} else if (this.userdetails.PharmacyId == parseInt(signalModel.pid) && (this.userdetails.RoleId == 3 || this.userdetails.RoleId == 4 || this.userdetails.RoleId == 2)) {
					if (signalModel.type == "1" || signalModel.type == "4" || signalModel.type == "2" || signalModel.type == "5" || signalModel.type == "9" || signalModel.type == "10") {
						that.signalRDialogue(signalModel);
					} else if (signalModel.type == "3") {
						this.orderId = 0;
						that.signalRDialogue(signalModel);
					}
				} else if (this.pharmacyadminRole(parseInt(signalModel.pid)) && this.userdetails.RoleId == 5) {
					if (signalModel.type == "1" || signalModel.type == "4" || signalModel.type == "2" || signalModel.type == "5" || signalModel.type == "9" || signalModel.type == "10") {
						that.signalRDialogue(signalModel);
					} else if (signalModel.type == "3") {
						this.orderId = 0;
						that.signalRDialogue(signalModel);
					}
				}
			} else if (window.location.href == environment.portalURL && signalModel.liveLoadFlag == 1) {
				if (this.signalrOrder != null && this.signalrOrder != undefined && this.signalrOrder.orderno == signalModel.orderno && this.signalrOrder.statusId == signalModel.statusId) {
					localStorage.setItem("signalrOrder", JSON.stringify(signalModel));
					return;
				}
				localStorage.setItem("signalrOrder", JSON.stringify(signalModel));
				//signalModel.statusId == 8 ||
				if ((signalModel.statusId == 8 || signalModel.statusId == 11 || signalModel.statusId == 6 || signalModel.statusId == 4 || signalModel.statusId == 2 || signalModel.statusId == 10 || signalModel.statusId == 16) && this.userdetails.RoleId == 1 && signalModel.pid != "10002") {
					that.signalRDialogue(signalModel);
				} else if (((signalModel.type != "6" && signalModel.statusId == 5) || signalModel.statusId == 10 || signalModel.statusId == 11 || signalModel.statusId == 13 || signalModel.statusId == 12) && this.userdetails.PharmacyId == parseInt(signalModel.pid) && (this.userdetails.RoleId == 3 || this.userdetails.RoleId == 4)) {
					that.signalRDialogue(signalModel);
				} else if (((signalModel.type != "6" && signalModel.statusId == 5) || signalModel.statusId == 10 || signalModel.statusId == 11 || signalModel.statusId == 13 || signalModel.statusId == 12) && this.pharmacyadminRole(parseInt(signalModel.pid)) && this.userdetails.RoleId == 5) {
					that.signalRDialogue(signalModel);
				} else if ((signalModel.statusId == 8 || signalModel.statusId == 11 || signalModel.statusId == 6 || signalModel.statusId == 5 || signalModel.statusId == 4 || signalModel.statusId == 2 || signalModel.statusId == 10 || signalModel.statusId == 16) && this.userdetails.PharmacyGrpId == parseInt(signalModel.pid) && this.userdetails.RoleId == 2) {
					that.signalRDialogue(signalModel);
				} else if ((signalModel.statusId == 8 || signalModel.statusId == 11 || signalModel.statusId == 6 || signalModel.statusId == 5 || signalModel.statusId == 4 || signalModel.statusId == 2 || signalModel.statusId == 10 || signalModel.statusId == 16) && this.userdetails.PharmacyId == parseInt(signalModel.pid) && this.userdetails.RoleId == 3) {
					that.signalRDialogue(signalModel);
				} else if ((signalModel.statusId == 8 || signalModel.statusId == 11 || signalModel.statusId == 6 || signalModel.statusId == 5 || signalModel.statusId == 4 || signalModel.statusId == 2 || signalModel.statusId == 10 || signalModel.statusId == 16) && this.pharmacyadminRole(parseInt(signalModel.pid)) && this.userdetails.RoleId == 5) {
					that.signalRDialogue(signalModel);
				} else if (signalModel.statusId == 5 && signalModel.type == "6" && (this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2) && signalModel.pid != "10002") {
					that.signalRDialogue(signalModel);
				}
			}
			this.liveLoadFlag = 0;
		});

		this._hubConnection.on("DeliveryStatusUpdate", (signalRDelstatus: any) => {
			// console.log("Check Here status msg from signalr", signalRDelstatus);
			if (signalRDelstatus == null) {
				return;
			}
			if (window.location.href == environment.portalURL && signalRDelstatus != null) {
				if (signalRDelstatus.isOrder == 12) {
					this.setOrderStatus(signalRDelstatus);
				} else {
					this.setDeliveryStatus(signalRDelstatus.orderNo, signalRDelstatus.deliveryStatus, signalRDelstatus.refId, signalRDelstatus.isSherpaDelivery);
				}
			}
		});
	}

	getUploadTypeIcon(value): String {
		if (value == 7 || value == 8 || value == 9) {
			return "../../../../../../assets/packapill-icons/SVG/create_order.svg";
		} else if (value == 10 || value == 11) {
			return "../../../../../../assets/packapill-icons/SVG/wos.svg";
		} else if (value == 12) {
			return "../../../../../../assets/packapill-icons/SVG/dd.svg";
		} else if (value == 13) {
			return "../../../../../../assets/packapill-icons/SVG/ue.svg";
		} else {
			return "../../../../../../assets/packapill-icons/SVG/app_order.svg";
		}
	}

	setDeliveryStatus(ordNum, status, ref, isSherpaDelivery) {
		console.log("SignalR Model ===>", ordNum, status, ref);
		this.liveDataSource.forEach((element) => {
			if (element.OrderNo == ordNum) {
				element.IsSherpaDelivery = isSherpaDelivery;
				element.CurrentStatus = status;
				if (ref != null) {
					element.BookingReference = ref;
				}
			}
		});
		this.cdf.detectChanges();
	}

	private pharmacyadminRole(pid) {
		if (this.userdetails.PharmacyGroupUserId != null && this.userdetails.PharmacyGroupUserId != "" && this.userdetails.PharmacyGroupUserId != undefined) {
			var Arraysplit = this.userdetails.PharmacyGroupUserId.split(",");
			if (Arraysplit != null && Arraysplit != undefined && Arraysplit != "") {
				var list = Arraysplit.filter(function (a) {
					return a == pid;
				});
				if (list.length > 0) {
					return true;
				}
			}
			return false;
		}
	}

	private connectionCheck(): void {
		var tick = 0;
		// if (!this.commonServices.loginExpired) {
		this.commonServices.orderExpireId = setInterval(() => {
			// console.log(this.commonServices.loginExpired);
			if (!this.commonServices.loginExpired && tick <= 2) {
				this.setConnection();
			} else {
				tick--;
				clearInterval(this.commonServices.orderExpireId);
				this.dialog.closeAll();
				console.log("SignalR Disconnected!", tick, this._hubConnection.state);
				this.commonServices.loginExpired = false;
			}
		}, 4000);
		// }
	}

	private setConnection() {
		var conect = this._hubConnection.state;
		// console.log('Connection before!', conect);
		if (conect != 1) {
			this._hubConnection.start().then(() => console.log("SignalR Connection started!"));
		}
	}

	signalRDialogue(signalModel) {
		console.log(signalModel);

		var text = "Someone else is working on this order. Do you want to reload the page?";
		if (signalModel.type == "1") {
			text = "New order received";
		} else if (signalModel.type == "4") {
			text = "Order cancelled.";
		} else if (signalModel.type == "2") {
			text = "Payment completed";
		} else if (signalModel.type == "9") {
			text = "Order completed. Do you want to reload the page?";
		} else if (signalModel.type == "10") {
			text = "Order has been picked up.";
		}
		var data = {
			btnCancelText: "Close",
			btnOkText: "Ok",
			title: "Order Number Is " + signalModel.orderno,
			message: text,
			height: "230px",
			flag: 3,
			id: 0,
			list: { signalModel },
		};
		// console.log(signalModel, this.userdetails.PharmacyId.toString(), signalModel.type);
		if ((signalModel.type == "5" || signalModel.type == "6" || signalModel.type == "3") && (signalModel.initiateBy == 0 || signalModel.initiateBy == this.userdetails.PharmacyId.toString())) {
			// console.log('Same Pharmacy user login', signalModel.type);
		} else {
			// console.log('Showing popup', signalModel.type);
			this.alertDialog(data);
		}
	}

	alertDialog(data) {
		this.dialog
			.open(AlertDialogComponent, {
				disableClose: true,
				data: data,
				width: "auto",
				maxWidth: "430px",
				minWidth: "360px",
				height: data.height,
			})
			.afterClosed()
			.subscribe((val) => {
				localStorage.setItem("signalrOrder", JSON.stringify(null));
				if (val == "Show") {
					if ((this.userdetails.RoleId == 1 || this.userdetails.RoleId == 5) && this.filterStatusId != "0" && this.filterStatusId > 0) {
						return;
					}
					if (data.flag == 5) {
						var signalModel = { type: "3" };
						this.signalRApiUpdate(data.list, signalModel, 1);
						return;
					} else if (data.flag == 6) {
						window.location.reload();
					}
					if (window.location.href == environment.portalTabURL) {
						return;
					}
					if (data.flag == 2) {
						console.log(data.list.deldata);
					} else if (data.flag == 4) {
						this.Post(data.list);
					} else if (data.list.signalModel.type == "9") {
						this.loadInitData(0, "", false);
					} else {
						this.signalRUpdate(data.list.signalModel);
						console.log(data.list.signalModel);
					}
				}
			});
	}

	loadDataSource(pList) {
		this.liveDataSource = pList;
		this.results = this.liveDataSource.slice(0, this.pageSize);
		this.length = this.liveDataSource.length;
		if (this.liveDataSource.length > 0 && this.isPage == 1) {
			this.paginator.length = this.liveDataSource[0].RecordCount;
		}
		if (this.length > 100) {
			this.pageSizeOptions.push(this.length);
		}
		this.cdf.detectChanges();
	}

	loadAftPost(res, flag) {
		this.loadedData = null;
		if (this.userdetails.RoleId == 1 || this.userdetails.RoleId == 2 || this.userdetails.RoleId == 5) {
			this.pharmacyList = res.pharmacyModel;
			this.tempPharmacyList = res.pharmacyModel;
			if (flag) {
				if (this.userdetails.RoleId == 1 || this.userdetails.RoleId == 5) {
					this.filterPharmacyId = "0";
				} else {
					this.filterPharmacyId = res.orderModel[0].PharmacyId;
				}
			}
		}
		this.setValue(res);
		this.loadDataSource(res.orderModel);
		this.commonServices.visibility = "hidden";
		this.cdf.detectChanges();
	}

	signalRUpdate(signalModel) {
		this.apiService.GetList("PharmacistReviewV2/signalRUpdate?id=" + parseInt(signalModel.oid) + "&roleid=" + this.userdetails.RoleId).subscribe(
			(res: any) => {
				// console.log('Signal R Update -->', res, signalModel);
				this.signalRApiUpdate(res, signalModel, 2);
				// console.log(res.orderModel[0].IsOrderStatus, res.orderModel[0].OrderNo, this.liveDataSource[0].OrderNo);
			},
			(err) => {
				this.commonServices.visibility = "hidden";
				this.cdf.detectChanges();
			}
		);
	}

	signalRApiUpdate(res, signalModel, flag) {
		if (this.tempOrderList == undefined) {
			this.tempOrderList = { orderModel: [], orderDtlModel: [] };
		}
		var roleid = this.userdetails.RoleId;
		var statusid = 0;
		if (res.orderModel != null && res.orderModel.length > 0) {
			var tempOrderList = [];
			var exist = true;
			this.tempOrderList.orderModel.forEach((element, i) => {
				var filter = res.orderModel.filter(function (a) {
					return a.OrderId == element.OrderId;
				});
				statusid = 0;
				if (filter.length > 0) {
					filter[0].RecordCount = this.paginator.length;
					element = filter[0];
					exist = false;
				}
				if (roleid == 1 || roleid == 2 || roleid == 5) {
					statusid = element.IsOrderStatus;
					element.IsOrderStatus = element.IsOrderStatus == 10 ? 5 : element.IsOrderStatus;
				}
				tempOrderList.push(element);
			});
			// This one row up the changed data.
			if (exist) {
				if (roleid == 1 || roleid == 2 || roleid == 5) {
					res.orderModel[0].IsOrderStatus = res.orderModel[0].IsOrderStatus == 10 ? 5 : res.orderModel[0].IsOrderStatus;
					if (signalModel.type == "1" && (res.orderModel[0].DeliverBy == 1 || res.orderModel[0].DeliverBy == 3)) {
						res.orderModel[0].CurrentStatus = "Book Delivery";
						res.orderModel[0].BookingReference = null;
					}
				}
				res.orderModel[0].RecordCount = tempOrderList.length < 10 ? (tempOrderList.length < 1 ? 1 : tempOrderList.length + 1) : this.paginator.length + 1;
				tempOrderList.splice(0, 0, res.orderModel[0]);
			}
			if (roleid == 1 || roleid == 5) {
				tempOrderList = tempOrderList.filter(function (a) {
					return a.IsStatus != 5 && a.IsStatus != 8;
				});
			}
			// tempOrderList = tempOrderList.sort((a, b) => b.ModifiedOn - a.ModifiedOn);
			this.tempOrderList.orderModel = tempOrderList;
			// var stringToFilter = res.orderModel[0].OrderNo; //this holds order no
			// tempOrderList.unshift(tempOrderList.splice(tempOrderList.findIndex(item => item.OrderNo === stringToFilter), 1)[0]);
			this.cdf.detectChanges();
			if (this.tempOrderList.orderDtlModel != null && this.tempOrderList.orderDtlModel.length > 0) {
				var tempOrderDtl = [];
				this.tempOrderList.orderDtlModel.forEach((element, i) => {
					var filter = res.orderDtlModel.filter(function (a) {
						return a.SubOrderId == element.SubOrderId;
					});
					if (filter.length > 0) {
						element = filter[0];
					}
					tempOrderDtl.push(element);
				});
				this.tempOrderList.orderDtlModel = tempOrderDtl;
			}
			this.commonServices.printdata = this.tempOrderList.orderModel;
			// console.log('Load after post data :->>', this.tempOrderList);
			this.loadAftPost(this.tempOrderList, true);
		}
	}

	deleteOrder(ordermodel) {
		this.deleteBy = true;
	}

	setOrderStatus(Data) {
		console.log("SignalR Model ===>", Data);
		this.liveDataSource.forEach((element) => {
			if (element.OrderNo == Data.orderNo) {
				element.NotificationText = Data.notifitext;
				element.BtnNotificationText = Data.notifyBtnText;
				if (Data.isOrderStatus == 11) {
					element.IsOrderStatus = Data.isOrderStatus;
				}
				if (Data.isOrderStatus == 10) {
					element.IsOrderStatus = 5;
				} else if (Data.isOrderStatus == 5) {
					this.loadInitData(0, "", false);
					element.IsOrderStatus = 5;
				}
			}
		});
		this.cdf.detectChanges();
	}
}
