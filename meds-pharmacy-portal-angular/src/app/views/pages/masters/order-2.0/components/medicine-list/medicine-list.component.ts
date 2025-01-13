import { animation } from '../../../../../../directives/transition.directive';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TableDataSource } from 'angular4-material-table';
import { CommonServices } from '../../../../../../views/services/common';
import { PrescriptionModel } from '../../live.order.model';
import { AlertDialogComponent } from '../../../../dialogs/alert-dialog/alert.dialog.component';
import { ApiServices } from '../../../../../../../app/views/services/api.services';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { OrderStatusDialogComponent } from '../../../../dialogs/orderstatus-dialog/orderstatus-dialog.component';
import { environment } from '../../../../../../../environments/environment.prod';
import { RefundDialogComponent } from '../../../../../../../app/views/pages/dialogs/refund-dialog/refund-dialog.component';
import { forEach } from 'lodash';

var that: any;
const branch = window['branch'];
@Component({
  selector: 'pp-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.scss'],
  animations: [animation],
  host: { '[@animation]': '' },
})
export class MedicineListComponent implements OnInit {
  displayedPresDetailsColumns: string[] = [];// ['FamilyId', 'OrderScriptId', 'MedicineName', 'Price', 'Quantity', 'TotalPrice', 'Repeats', 'TotalRepeats', 'RemainingRepeats', 'DaysRemaining', 'actionsColumn'];
  displayedColumns = ['MedicineName', 'ScriptId', 'Price', 'Qty', 'Repeats', 'Trepeats', 'Rrepeats', 'Daysremaining', 'Action'];
  @Input() orderModelList: any = [];
  prescriptionDetailsDataSource: TableDataSource<any>;
  // @Input() repeats: any;
  // @Input() medicineStatus: any;
  @Output() prescriptionListChange = new EventEmitter<PrescriptionModel[]>();
  loadedData: PrescriptionModel[];
  patientList = [];
  medicineStatus = [{ id: 1, value: "Yes" }, { id: 2, value: "No" }];
  repeatsList = [];
  orderModel: any = {};
  medicineList = [];
  temporderDLList = [];
  deleteBy = false;
  url = 'PharmacistReviewV2/';
  refund = 'PharmacyStripe/';
  tempMedicineList = [];
  orderDLList = [];
  orderDatailPFList = [];
  isSave = false;
  userdetails: any;
  isStripeSubmited = false;
  OtcLength: any;
  PrescLength: any;
  IsChargeaccount = false;
  @Output() messageEvent7 = new EventEmitter<string>();
  totalPrice = 0;
  constructor(
    private dialog: MatDialog,
    public commonServices: CommonServices,
    private apiService: ApiServices,
    public cdRef: ChangeDetectorRef,
    private notifier: NotifierService,
    public router: Router,) {
    this.userdetails = JSON.parse(localStorage.getItem("userdetails"));
    console.log(this.userdetails.RoleId);
  }

  ngOnInit() {
    this.repeatsList = this.orderModelList.objList.repeatsList; that = this;
    if (this.orderModelList.objList.familyModel != null && this.orderModelList.objList.familyModel.length > 0) {
      this.patientList = this.orderModelList.objList.familyModel;
      var templist = { FamilyId: 0, Name: this.orderModelList.orderModel.Name };
      this.patientList.splice(0, 0, templist);
    } else {
      this.patientList.push({ FamilyId: 0, Name: this.orderModelList.orderModel.Name });
    }
    this.orderModel = this.orderModelList.orderModel; this.orderDLList = this.orderModelList.objList.orderDtlModel; this.temporderDLList = JSON.parse(JSON.stringify(this.orderModelList.objList.orderDtlModel));
    this.displayedPresDetailsColumns = ['FamilyId', 'OrderScriptId', 'MedicineName', 'Price', 'Quantity', 'TotalPrice', 'Repeats', 'TotalRepeats', 'RemainingRepeats', 'DaysRemaining', 'actionsColumn'];
    if (this.orderModel.IsUploadType == 13 && this.orderModel.IsOrderStatus != 8 && this.orderModel.IsOrderStatus != 5) {
      this.displayedPresDetailsColumns = ['MarketPlaceItemStatus', 'FamilyId', 'OrderScriptId', 'MedicineName', 'Price', 'Quantity', 'TotalPrice', 'Repeats', 'TotalRepeats', 'RemainingRepeats', 'DaysRemaining', 'actionsColumn'];
    }
    this.isStripeSubmited = this.orderModel.pharmacyData == null ? false : this.orderModel.pharmacyData.StripeDetailsubmitted;
    this.orderDatailPFList = this.orderModelList.objList.orderPFModel; this.IsChargeaccount = false;
    if (this.orderModel.pharmacyData.IsChargeaccount != undefined && this.orderModel.pharmacyData.IsChargeaccount != null) {
      this.IsChargeaccount = this.orderModel.pharmacyData.IsChargeaccount;
    }
    this.prescriptionDetailsDataSource = new TableDataSource(this.orderDLList, PrescriptionModel);
    this.loadedData = this.orderDLList;
    setTimeout(() => {
      this.prescriptionDetailsDataSource.datasourceSubject.subscribe(personList => {
        this.prescriptionListChange.emit(personList);
        this.loadedData = personList;
        this.cdRef.detectChanges();
      });
      this.SetPriceDecimal(this.orderDLList);
    });
    this.cdRef.detectChanges();
  }

  SetPriceDecimal(datas) {
    var total = 0;
    for (let i = 0; i < datas.length; i++) {
      this.setTableVal(i, this.prescriptionDetailsDataSource.getRow(i).currentData.Price, datas[i]);
    }
    this.cdRef.detectChanges();
  }

  setTableVal(i: number, price: any, data) {
    let zero = 0;
    let p = +price;
    if (p > 0) {
      this.prescriptionDetailsDataSource.getRow(i).currentData.Price = p.toFixed(2);
    } else {
      this.prescriptionDetailsDataSource.getRow(i).currentData.Price = ((data != null && data != undefined && this.orderModel.IsOrderStatus == 1 && (data.IsUploadType == 4 || data.IsUploadType == 9 || data.IsUploadType == 10 || data.IsUploadType == 6)) || price === "" ? "" : zero.toFixed(2));
    }
  }

  repeatValidation(model, flag) {
    var fillter = this.commonServices.repeatValidation(model, flag); var text = "";
    if (fillter == 1) {
      text = "Please enter the Total Repeats and Remaining Repeats before enter the Days Remaining.";
      // this.notifier.notify('error', "Please enter the Total Repeats and Remaining Repeats before enter the Days Remaining.");
    } else if (fillter == 2) {
      text = "Please enter the Total Repeats before enter the Remaining Repeats.";
      // this.notifier.notify('error', "Please enter the Total Repeats before enter the Remaining Repeats.");
    } else if (fillter == 3) {
      text = "Please enter less than or equal Total Repeats.";
      // this.notifier.notify('error', "Please enter less than or equal Total Repeats.");
    }
    if (text != "" && text != null) {
      this.apiService.showSnack(text);
    }

    // var list: any;
    // list = {
    //   model: model,
    //   flag: flag
    // }
    // this.messageEvent7.emit(list);
  }

  getMedicineList(val, list, orderModel) {
    list.currentData.Quantity = list.currentData.Quantity == null || list.currentData.Quantity == undefined || list.currentData.Quantity == "" || list.currentData.Quantity <= 0 ? 1 : list.currentData.Quantity;
    var grpid = this.userdetails.PharmacyGrpId; val = val.toString().trim();
    if (val != undefined && val != null && val != "" && val.length > 2 && val.length <= 3) {
      this.apiService.GetList(this.url + "GetSearchByMedicine?pharmacygrpid=" + grpid + "&search=" + val + "&phid=" + orderModel.PharmacyId).subscribe((res: any) => {
        this.medicineList = res; this.tempMedicineList = res;
      }, err => {
        this.commonServices.customError(1);
      });
    }
    if (val != undefined && val != null && val != "" && val.length > 3 && this.medicineList != null) {
      var filter = this.tempMedicineList.filter(function (value) { return value.MedicineName.toLowerCase().indexOf(val.trim(' ').toLowerCase()) != -1 });
      this.medicineList = filter;
    }
  }

  refunDialog(data) {
    console.log(data);
    this.dialog.open(RefundDialogComponent, {
      disableClose: true,
      data: data,
      width: '420px',
      height: 'auto',
      // height: data.height
    }).afterClosed().subscribe(val => {

    });

  }

  deleteAlert(deldata, row) {

    if (this.orderDLList.length >= 1 && deldata.IsUploadType == 13) {
      var isdelete = this.orderDLList.filter(function (val) { return !val.IsStock; });
      if (isdelete.length == 1) {
        var uedeletedata = {
          btnOkText: 'Ok',
          title: "Insufficient products in Order",
          message: "It looks like this order only contains one in-stock item.Please cancel the complete order instead of deleting the item.",
          height: "230px",
          flag: 6,
          id: 0,
        }
        this.alertDialog(uedeletedata);
        return;
      }
    }

    var data = {
      btnCancelText: 'Close',
      btnOkText: 'Ok',
      title: "Delete Medicine",
      message: "Are you sure you want to delete this order?",
      height: "200px",
      flag: 2,
      id: 0,
      list: { deldata, row }
    }
    this.alertDialog(data);
  }

  alertDialog(data) {
    this.dialog.open(AlertDialogComponent, {
      disableClose: true,
      data: data,
      width: ' 380px',
      height: data.height
    })
      .afterClosed().subscribe(val => {
        if (val == 'Show') {
          if (data.flag == 5) {
            this.router.navigate(['/app/masters/live-order-2']);
            return
          }
          if (data.flag == 2) {
            this.deleteOrder(data.list.deldata); //data.list.row.cancelOrDelete();
            this.medicineUpdate(data.list.deldata, 1, data.list.row);
          }
          else if (data.flag == 4) {
            data.list.ChargeAccount = false;
            this.Post(data.list);
          }
          else if (data.flag == 5) {
            this.medicineUpdate(data.list, 0, '')
          }
          if (data.flag == 6) {
            return;
          }
        }
      });
  }

  deleteOrder(ordermodel) {
    this.deleteBy = true;
  }

  medicineUpdate(rowdata, suborderid, rowd) {
    if (suborderid == 0) {
      rowdata.uploadList = this.loadedData == null || this.loadedData == undefined ? [] : this.loadedData;
      rowdata.uploadList = rowdata.uploadList.filter(function (val) { return !val.IsStock; });
      if (rowdata.uploadList.length <= 0) { return; }
      var valid = this.commonServices.checkMedicineValidate(rowdata.uploadList);
      if (valid.isValid) {
        if (this.isSave) { return; }
        if (this.userdetails.RoleId == 3 || this.userdetails.RoleId == 4 || this.userdetails.RoleId == 5) {
          if (rowdata.IsOrderStatus == 1) {
            rowdata.IsOrderStatus = 6;
          } else if (rowdata.IsOrderStatus == 2) {
            rowdata.IsOrderStatus = 11;
            if (rowdata.DeliverBy == 2) {
              rowdata.IsOrderStatus = 16;
            }
          } else if (rowdata.IsOrderStatus == 4) {
            rowdata.IsOrderStatus = 11;
            if (rowdata.DeliverBy == 2) {
              rowdata.IsOrderStatus = 5;
            }
          } else if (rowdata.IsOrderStatus == 11) {
            rowdata.IsOrderStatus = 10;
          } else if (rowdata.IsOrderStatus == 12) {
            rowdata.IsOrderStatus = 2;
          } else if (rowdata.IsOrderStatus == 13) {
            rowdata.IsOrderStatus = 5;
          }
          else if (rowdata.IsOrderStatus == 16) {
            if (rowdata.DeliverBy == 2) {
              rowdata.IsOrderStatus = 5;
            }
          }
        } else {
          if (rowdata.IsOrderStatus == 1) {
            rowdata.IsOrderStatus = 6;
          } else if (rowdata.IsOrderStatus == 2) {
            rowdata.IsOrderStatus = 4;
            if (rowdata.DeliverBy == 2) {
              rowdata.IsOrderStatus = 16;
            }
          }

          else if (rowdata.IsOrderStatus == 10) {
            rowdata.IsOrderStatus = 5;
          }
          else if (rowdata.IsOrderStatus == 13) {
            rowdata.IsOrderStatus = 5;
          } else if (rowdata.IsOrderStatus == 14) {
            rowdata.IsOrderStatus = 15;
          }
          else if (rowdata.IsOrderStatus == 16) {
            if (rowdata.DeliverBy == 2) {
              rowdata.IsOrderStatus = 5;
            }
          }
        }
        rowdata.uploadList = valid.list; this.commonServices.visibility = "shown"; this.isSave = true;
        if (rowdata.MarketPlaceReferenceId != null && rowdata.MarketPlaceReferenceId != "" && this.orderModel.IsUploadType == 13) {
          this.commonServices.visibility = "shown";

          this.apiService.Post(this.orderDLList, this.url + 'marketPlacePatch?orderid=' + rowdata.OrderId).subscribe(res => {
            if (res != null && res.flag == 1) {
              rowdata.uploadList = res.DtlModel; this.orderDLList = res.DtlModel;
              this.loadedData = res.DtlModel; this.temporderDLList = JSON.parse(JSON.stringify(res.DtlModel));
              rowdata.Total = res.Total; rowdata.OrderDetailCount = res.ordercount;
              this.prescriptionDetailsDataSource = new TableDataSource(res.DtlModel, PrescriptionModel);
              this.prescriptionDetailsDataSource.datasourceSubject.subscribe(personList => {
                this.prescriptionListChange.emit(personList); this.loadedData = personList;
              });
              this.SetPriceDecimal(res.DtlModel);
              if (res.order != null && !res.order.MarketPlaceStockStatus) {
                this.commonServices.NotificationText = "Courier assigned"
              }
              else {
                this.commonServices.NotificationText = "Awaiting review"
              }

              this.commonServices.visibility = "hidden"; this.cdRef.detectChanges(); this.isSave = false;
              this.apiService.showSnackBy('Medicine updated successfully', 'custom-style');
            }
            else {
              this.commonServices.visibility = "hidden"; this.cdRef.detectChanges(); this.isSave = false;
              this.apiService.showSnackBy('Medicine update failed', 'custom-style');
            }
          }, err => {
            this.commonServices.visibility = "hidden"; this.isSave = false;
            this.commonServices.customError(6);
            this.cdRef.detectChanges();
          });
        } else {
          this.apiService.Post(rowdata, this.url + 'MedicineUpdate?orderid=' + rowdata.OrderId).subscribe(res => {
            if (!res) {
              this.isSave = false; this.apiService.showSnackBy('Medicine update failed', 'custom-style');
              this.commonServices.visibility = "hidden";
              this.cdRef.detectChanges();
            } else {
              res.DtlModel.forEach(element => {
                if (element.MedicineName == null || element.MedicineName == undefined || element.MedicineName === '' || element.Price == null || element.Price == undefined || element.Price === '') {
                  return;
                }
                if (element.TotalDays == 0 || element.TotalDays == undefined || element.TotalDays == null) {
                  element.TotalDays = '';
                }
                if (element.TotalRepeats == 0 || element.TotalRepeats == undefined || element.TotalRepeats == null) {
                  element.TotalRepeats = '';
                }
                if (element.DaysRemaining == 0 || element.DaysRemaining == undefined || element.DaysRemaining == null) {
                  element.DaysRemaining = '';
                }
                if (element.RemainingRepeats == 0 || element.RemainingRepeats == undefined || element.RemainingRepeats == null) {
                  element.RemainingRepeats = '';
                }
                if (element.OriginalPrice == "" || element.OriginalPrice == undefined || element.OriginalPrice == null) {
                  element.OriginalPrice = 0;
                }
              });
              rowdata.uploadList = res.DtlModel; this.orderDLList = res.DtlModel;
              this.loadedData = res.DtlModel; this.temporderDLList = JSON.parse(JSON.stringify(res.DtlModel));
              rowdata.Total = res.Total; rowdata.OrderDetailCount = res.ordercount;
              this.prescriptionDetailsDataSource = new TableDataSource(res.DtlModel, PrescriptionModel);
              this.prescriptionDetailsDataSource.datasourceSubject.subscribe(personList => {
                this.prescriptionListChange.emit(personList); this.loadedData = personList;
              });
              this.SetPriceDecimal(res.DtlModel);
              this.commonServices.visibility = "hidden"; this.cdRef.detectChanges(); this.isSave = false;
              this.apiService.showSnackBy('Medicine updated successfully', 'custom-style');
            }

          }, err => {
            this.commonServices.visibility = "hidden"; this.isSave = false;
            this.commonServices.customError(6);
            this.cdRef.detectChanges();
          });
        }

      } else {
        this.apiService.showSnack('Please check the order details.');
      }
    }
    else if (suborderid == 1 && rowd.currentData.SubOrderId == 0) {
      rowd.cancelOrDelete();
      // this.setLiveTotal();
    }
    else if (suborderid == 1 && rowd.currentData.SubOrderId != 0) {
      if (rowd.currentData.TotalDays == '' || rowd.currentData.TotalDays == undefined || rowd.currentData.TotalDays == null) {
        rowd.currentData.TotalDays = 0;
      }
      if (rowd.currentData.TotalRepeats == '' || rowd.currentData.TotalRepeats == undefined || rowd.currentData.TotalRepeats == null) {
        rowd.currentData.TotalRepeats = 0;
      }
      if (rowd.currentData.DaysRemaining == '' || rowd.currentData.DaysRemaining == undefined || rowd.currentData.DaysRemaining == null) {
        rowd.currentData.DaysRemaining = 0;
      }
      if (rowd.currentData.RemainingRepeats == '' || rowd.currentData.RemainingRepeats == undefined || rowd.currentData.RemainingRepeats == null) {
        rowd.currentData.RemainingRepeats = 0;
      }
      if (rowd.currentData.OriginalPrice == "" || rowd.currentData.OriginalPrice == undefined || rowd.currentData.OriginalPrice == null) {
        rowd.currentData.OriginalPrice = 0;
      }
      rowd.currentData.IsStock = true; this.commonServices.visibility = "shown"; this.cdRef.detectChanges();
      if (rowdata.MarketPlaceReferenceId != null && rowdata.MarketPlaceReferenceId != "" && this.orderModel.IsUploadType == 13) {
        this.apiService.Get(this.url + 'marketPlaceDelete?suborderid=' + rowd.currentData.SubOrderId + "&orderid=" + rowd.currentData.OrderId).subscribe((res: any) => {
          if (res != null && res.flag == 1) {
            rowdata.uploadList = res.DtlModel; this.orderDLList = res.DtlModel;
            rowdata.Total = res.Total; rowdata.OrderDetailCount = res.ordercount; this.loadedData = res.DtlModel;
            this.prescriptionDetailsDataSource = new TableDataSource(res.DtlModel, PrescriptionModel);
            this.prescriptionDetailsDataSource.datasourceSubject.subscribe(personList => {
              this.prescriptionListChange.emit(personList); this.loadedData = personList;
            });
            this.SetPriceDecimal(res.DtlModel);
            if (res.order != null && !res.order.MarketPlaceStockStatus) {
              this.commonServices.NotificationText = "Courier assigned"
            }
            else {
              this.commonServices.NotificationText = "Awaiting review"
            }
            this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
            this.apiService.showSnackBy('Selected item removed successfully', 'custom-style');
          }
          else {
            this.commonServices.visibility = "hidden"; this.cdRef.detectChanges(); this.isSave = false; rowd.currentData.IsStock = false;
            this.apiService.showSnackBy('Medicine delete failed', 'custom-style');
          }
        }, err => {
          rowd.currentData.IsStock = false; this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
          this.commonServices.customError(7);
        });
      }
      else {
        this.apiService.GetList(this.url + 'DeleteMed?id=' + rowd.currentData.SubOrderId + '&orderid=' + rowdata.OrderId).subscribe((res: any) => {
          res.DtlModel.forEach(element => {
            if (element.MedicineName == null || element.MedicineName == undefined || element.MedicineName === '' || element.Price == null || element.Price == undefined || element.Price === '') {
              return;
            }
            if (element.TotalDays == 0 || element.TotalDays == undefined || element.TotalDays == null) {
              element.TotalDays = '';
            }
            if (element.TotalRepeats == 0 || element.TotalRepeats == undefined || element.TotalRepeats == null) {
              element.TotalRepeats = '';
            }
            if (element.DaysRemaining == 0 || element.DaysRemaining == undefined || element.DaysRemaining == null) {
              element.DaysRemaining = '';
            }
            if (element.RemainingRepeats == 0 || element.RemainingRepeats == undefined || element.RemainingRepeats == null) {
              element.RemainingRepeats = '';
            }
          });
          rowdata.uploadList = res.DtlModel; //this.orderDLList = res.DtlModel;
          rowdata.Total = res.Total; rowdata.OrderDetailCount = res.ordercount; this.loadedData = res.DtlModel;
          this.prescriptionDetailsDataSource = new TableDataSource(res.DtlModel, PrescriptionModel);
          this.prescriptionDetailsDataSource.datasourceSubject.subscribe(personList => {
            this.prescriptionListChange.emit(personList); this.loadedData = personList;
          });
          this.SetPriceDecimal(res.DtlModel);
          this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
          this.apiService.showSnackBy('Selected item removed successfully', 'custom-style');
        }, err => {
          rowd.currentData.IsStock = false; this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
          this.commonServices.customError(7);
        });
      }
    }
  }

  onStatusChange(model) {
    if (model.IsOrderStatus != 5 && model.IsOrderStatus != 8) {
      this.dialog.open(OrderStatusDialogComponent, {
        disableClose: true,
        data: { model },
        width: ' 450px',
        // height: '335px'
      }).afterClosed().subscribe(val => {
        if (val != null) {
          val.IsPreviousOrderStatus = val.IsOrderStatus;
          val.IsOrderStatus = 8; this.isSave = false; val.ChargeAccount = false;
          this.Post(val);
        }
      });
    } else {
      var text = model.IsOrderStatus == 5 ? "This order completed already. You don't have to cancel it." : "This order cancelled already. You don't have to cancel it.";
      that.notifier.notify('error', text);
    }
  }

  dataSpliter() {
    if (this.loadedData != null && this.loadedData != undefined) {
      this.PrescLength = this.loadedData.filter(function (val) { return val.IsUploadType == 0; });
    }
  }

  promptWarning(ordermodel, flag) {
    var str = '';
    this.dataSpliter();
    var filter = this.orderDatailPFList.filter(function (val) { return val.IsUploadType != 4 && val.IsUploadType != 5 && val.IsUploadType != 7 && val.IsUploadType != 8 && val.IsUploadType != 9 && val.IsUploadType != 6 && val.IsUploadType != 10 });
    if (this.PrescLength.length < filter.length && ordermodel.IsOrderStatus == 1) {
      var filterby = this.loadedData.filter(function (val) { return !val.IsStock; });
      str = 'It looks like you are missing an item. Do you want to confirm this order with ' + filterby.length + ' item only?';
    }
    else {
      if (flag == 4) {
        str = "Confirm order.";
      }
      else if (flag === 5) {
        if (ordermodel.MarketPlaceReferenceId != null && ordermodel.IsUploadType == 13) {
          for (let i = 0; i < this.orderDLList.length; i++) {
            this.orderDLList = this.orderModel.uploadList != null ? this.orderModel.uploadList : this.orderDLList;
            if (this.orderDLList[i].MarketPlaceItemStatus === 2 && this.orderDLList[i].OrderScriptId === this.temporderDLList[i].OrderScriptId && !this.orderDLList[i].IsStock) {
              this.apiService.showSnack("One or more items are out of stock or invalid. Please update the items or cancel the order.");
              return;
            }
            if (this.orderDLList[i].Quantity > this.temporderDLList[i].Quantity) {
              this.apiService.showSnack("Quantity modification is not allowed. You can cancel the order if needed.");
              return;
            }
            if (this.orderDLList[i].MarketPlaceItemStatus === 1 && this.orderDLList[i].OrderScriptId !== this.temporderDLList[i].OrderScriptId) {
              this.orderDLList[i].MarketPlaceItemStatus = 2;
            }
          }
        }
        this.medicineUpdate(ordermodel, 0, '');
        return;
      }
      else {
        // str = "Do you want to change the status?"
        return;
      }
    }
    var data = {
      btnCancelText: 'Cancel',
      btnOkText: 'Confirm',
      title: "Live Order",
      message: str,
      height: "205px",
      flag: flag,
      list: ordermodel
    }
    this.alertDialog(data);
  }

  chargeAccount(ordermodel) {
    ordermodel.ChargeAccount = true;
    this.Post(ordermodel);
  }

  Post(ordermodel) {
    if (this.isSave) {
      return;
    }
    ordermodel.uploadList = this.loadedData == null || this.loadedData == undefined ? [] : this.loadedData;
    ordermodel.Total = 0;// this.Total;
    ordermodel.RoleId = this.userdetails.RoleId;
    ordermodel.orderDetails = this.orderDLList == null || this.orderDLList == undefined ? [] : this.orderDLList;
    ordermodel.orderPFModel = this.orderDatailPFList == null || this.orderDatailPFList == undefined ? [] : this.orderDatailPFList;
    var ostatus = ordermodel.IsOrderStatus;
    var statusId = ordermodel.IsOrderStatus;
    if (ordermodel.IsOrderStatus != 8) {
      ordermodel.IsPreviousOrderStatus = ordermodel.IsOrderStatus;
    }
    if (ordermodel.IsOrderStatus == 1) {
      statusId = 6;
    }
    if (this.commonServices.checkValidation(ordermodel, this.prescriptionDetailsDataSource, statusId)) {
      if (statusId == 6 && (ordermodel.uploadList == null || ordermodel.uploadList.length <= 0)) {
        ordermodel.IsOrderStatus = ostatus; ordermodel.rowCreate = false;
        this.apiService.showSnack("Please check the order details. Price not updated properly.");
        return;
      }
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
        }
        else if (ordermodel.IsOrderStatus == 16) {
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
        }
        else if (ordermodel.IsOrderStatus == 11) {
          ordermodel.IsOrderStatus = 10;
        }
        else if (ordermodel.IsOrderStatus == 10) {
          ordermodel.IsOrderStatus = 5;
        }
        else if (ordermodel.IsOrderStatus == 13) {
          ordermodel.IsOrderStatus = 5;
        } else if (ordermodel.IsOrderStatus == 14) {
          ordermodel.IsOrderStatus = 15;
        }
        else if (ordermodel.IsOrderStatus == 16) {
          if (ordermodel.DeliverBy == 2) {
            ordermodel.IsOrderStatus = 5;
          }
        }
      }

      ordermodel.uploadList.forEach(element => {
        if (element.Price == "" || element.Price == undefined || element.Price == null) {
          element.Price = 0;
        }
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
        if (!element.IsStock) {
          element.IsUploadType = 5;
        }
      });
      console.log(ordermodel.uploadList)
      ordermodel.LiveLoadFlag = 1;
      ordermodel.webpushdata = this.commonServices.sendWebPush(ordermodel);
      this.commonServices.visibility = "shown"; this.isSave = true;
      var url = !ordermodel.ChargeAccount ? this.url + "Post" : this.url + "ChargeAccount";
      this.apiService.Post(ordermodel, url + "?id=" + ordermodel.OrderId + "&deleteBy=" + this.deleteBy + "&createdby=" + this.userdetails.UserId).subscribe((res: any) => {
        this.isSave = false;
        if (!res) {
          this.apiService.showSnackBy('Data failed to save', 'custom-style');
          this.commonServices.visibility = "hidden";
          this.cdRef.detectChanges();
        } else {
          if (res.flag && res.Omodel.IsOrderStatus == 8) {
            this.commonServices.visibility = "hidden"; this.notifier.notify('success', "Order updated successfully");
            if (this.commonServices.isPage == 3) {
              this.router.navigate(['/app/masters/new-live-order']);
            } else {
              this.router.navigate(['/app/masters/live-order-2']);
            }
          }
          else if (res.flag && res.Omodel.OrderDetailCount <= 0) {
            ordermodel.IsOrderStatus = ostatus; ordermodel.rowCreate = false; var text = ''; this.commonServices.visibility = "hidden";
            if (res.Omodel.CheckOrder == 1 || res.Omodel.CheckOrder == 2) {
              var data = {
                btnCancelText: '',
                btnOkText: 'OK',
                title: "Live Order",
                message: res.Omodel.ErroMessage,
                height: "205px",
                flag: 5,
                list: ordermodel
              }
              this.alertDialog(data);
              return;
            }

            if (res.Omodel.isPage) { text = " Price not updated properly."; }
            this.apiService.showSnack('Please check the order details.' + text);
          } else {
            if (res.flag && res.tolist != null && res.tolist.orderModel != null && res.tolist.orderModel.length > 0) {
              // if (res.notificationData != null && res.notificationData.StatusId == 6) {
              //   this.createUrl(res.notificationData);
              // }
              this.apiService.showSnack('Order updated successfully.');
              if (this.commonServices.isPage == 3) {
                this.router.navigate(['/app/masters/new-live-order']);
              } else {
                this.router.navigate(['/app/masters/live-order-2']);
              }
            } else {
              // this.spinner.hide();
              this.commonServices.visibility = "hidden"; this.apiService.showSnack('Data failed to save');
              // this.notifier.notify('error', "Order saved failed");
            }
          }
        }
      }, err => {
        ordermodel.IsOrderStatus = ostatus; ordermodel.rowCreate = false; this.isSave = false;
        this.commonServices.customError(2); // this.notifier.notify('error', "Order saved failed");
        this.commonServices.visibility = "hidden";
      });
    }
    else {
      this.commonServices.visibility = "hidden"; this.isSave = false;
      if (ordermodel.uploadList.length > 0) { ordermodel.rowCreate = true; }
      this.apiService.showSnack('Please check the order details.');
    }
  }

  createUrl(notificationData) {
    let _that = this;
    branch.link({
      stage: 'Payment',
      data: {
        notificationData: notificationData,
        '$desktop_url': 'https://www.holameds.com',
        '$android_url': 'https://play.google.com/store/apps/details?id=com.packapill.app',
        '$ios_url': 'https://apps.apple.com/us/app/packapill/id1506077305?ls=1',
        '$og_app_id': '804006564573762225',
        '$og_type': 'website',
        '$twitter_title': 'Digital Health App, Online Medicine Delivery APP - Hola Health',
        '$twitter_description': 'Get your medicines delivery at your doorsteps and online consulation from your home',
        '$og_image_url': 'https://cdn.branch.io/branch-assets/1592929787667-og_image.png',
        '$twitter_card': 'summary_large_image'
      }
    }, function (err, link) {
      console.log(err);
      if (link) {
        _that.apiService.Get('AppOrder/sendSMSBy?id=' + notificationData.OrderId + "&link=" + link).subscribe(res => {
          console.log('sms sent');
        });
      }
    });
  }

  getTotalPrice(Price, Quantity): any {
    if (Price == '.') {
      return '';
    }
    if (Quantity > 0) {
      var tot = Price * Quantity
      return tot.toFixed(2);
    }
    return 0;
  }

  setDecimal(index, price): any {
    this.setTableVal(index, price, null);
  }

}
