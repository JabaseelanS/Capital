import { Component, OnInit, ViewChild, Input, NgZone, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ApiServices } from '../../../../../views/services/api.services';
import { CommonServices } from '../../../../../views/services/common';
import { GlobalConstant } from '../../../globals/globalvariables';
import { CreateOrderModel } from './create-order.model';
import { TableDataSource } from 'angular4-material-table';
import { SubheaderService } from '../../../../../core/_base/layout';
import { MapsAPILoader } from '@agm/core';
import { NotifierService } from 'angular-notifier';
import { ChangeDetectorRef } from '@angular/core';
import { AlertDialogComponent } from '../../../dialogs/alert-dialog/alert.dialog.component';
import { animation } from '../../../../../directives/transition.directive';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../../environments/environment.prod';
import { PrescriptionModel } from '../live.order.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentDialogComponent } from '../../../dialogs/payment-dialog/payment-dialog.component';
declare var google: any;
const branch = window['branch'];

@Component({
  selector: 'pp-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
  animations: [animation],
  host: { '[@animation]': '' },
  providers: [DatePipe]
})
export class CreateOrderComponentV2 implements OnInit {

  IsChargeaccount = false;
  url = 'CreateNewOrder/';
  public zoom: number;
  public searchControl: FormControl;
  isRole = false;
  fAddBtn = "Add";
  editbyId = 0;
  showPInfo = false;
  showDInfo = true;
  editMode = false;
  mdat = "*";
  orderForm: FormGroup;
  orderModel: CreateOrderModel;
  orderDLList = [];
  patientList = [];
  pharmacyList = [];
  tempPharmacyList = [];
  @Input() adressType: string;
  @ViewChild("search", { static: true }) public searchElementRef: ElementRef;
  MobLength = 11;
  public mobMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public expMask = [/[0-1]/, /[0-9]/, '/', /[2-9]/, /\d/]; ///, /[2-9]/, /\d/];
  public dateMask = [/[0-3]/, /[0-9]/, '/', /[0-1]/, /\d/, '/', /[1-2]/, /\d/, /\d/, /\d/];
  public mediMask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, ' ', /\d/, ' ', '-', ' ', /\d/];
  public consMask = [/[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/, /[0-9A-Za-z]/];
  orderTypeList = [{ id: 1, value: "Delivery" }, { id: 2, value: "Pickup" }]
  // For Table
  dataSource: MatTableDataSource<any>;
  dataSourceUpload: any = [];
  TempdataSource = []; TempdataSourceUpload = [];
  displayedColumns = ['FName', 'LName', 'MedicareNo', 'MedicareValidTo', 'ConcessionNo', 'ConcessionValidTo', 'actionsv2'];
  displayedColumnsUpload = ['Image', 'FileName', 'actionsv2'];
  displayedPresDetailsColumns: string[] = ['FamilyId', 'OrderScriptId', 'MedicineName', 'Price', 'Quantity', 'Repeats', 'TotalRepeats', 'RemainingRepeats', 'DaysRemaining', 'actionsv2Column']; //
  displayedColumnsPharm = ['pharmacyId', 'pharmacyName', 'pharmacyLocation', 'status', 'orderCount', 'amount']
  // For File Uploading Option
  loginDetails: any;
  deleteBy = false;
  medicineStatus = [{ id: 1, value: "Yes" }, { id: 2, value: "No" }];
  repeats = [{ id: 1, value: "Yes" }, { id: 2, value: "No" }];
  deliveryAddressList = [];
  tempdeliveryAddressList = [];
  prescriptionDetailsDataSource: TableDataSource<any>;
  @Output() prescriptionListChange = new EventEmitter<CreateOrderModel[]>();
  loadedData = [];
  medicineList = [];
  tempMedicineList = [];
  orderDatailList = [];
  minDate = new Date();
  maxDate = new Date();
  deliveryTimeSlots = [];
  customerModel = {};
  addressModel = {
    DeliveryStreetNumber: '',
    DeliveryStreetName: '',
    State: '',
    City: '',
    Pincode: '',
    ShortStreetName: '',
    Country: '',
    DeliveryUnit: '',
    lat: '',
    lng: '',
  }
  TempaddressModel = {
    DeliveryStreetNumber: '',
    DeliveryStreetName: '',
    State: '',
    City: '',
    Pincode: '',
    ShortStreetName: '',
    Country: '',
    Unit: '',
  }
  saveBtn = false;
  prePharId = 0;
  pharmacyFlag = false;
  createByList = false;
  noPharmacy = 'There seems to be an issue with your pharmacy setup. Please contact support immediately.';
  timeSlotsN = ['09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM']
  isFromCustomer = false;
  page = '';
  dobValue = '';
  cusId = 0;
  emailEdit = false;
  pharmacyAvailableTimings: any;
  selectedPharmacy: any;
  isNoDeliveryPickup = false;
  isPharmacySelected = false;
  offsetList = [];
  base64Image: any;
  IsDelivery = "";
  valueChange = false;
  condata = {
    show: false,
    placehdat: '*'
  }
  addressInput = {
    DeliveryPincode: "",
    DeliveryCity: "",
    DeliveryAdd: "",
    DeliveryLandmark: "",
    DeliveryState: "",
    DeliveryCountry: "",
    DeliveryLattitude: '',
    DeliveryLongitude: '',
    DeliveryNotes: "",
    DeliveryAddId: 0,
    IsDefault: false,
    DeliverBy: 0,
    DeliveryByDate: null,
    DeliveryByTime: "",
    MobileNo: "",
    DeliveryStreetNumber: "", DeliveryStreetName: "", DeliveryUnit: ""
  };
  constructor(
    private _formBuilder: FormBuilder,
    private subheaderService: SubheaderService,
    public apiServices: ApiServices,
    public commonServices: CommonServices,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    private notifier: NotifierService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.orderModel = new CreateOrderModel();
  }

  ngOnInit(): void {
    this.commonServices.ddpage = false;
    this.commonServices.visibility = "shown";
    this.maxDate.setDate(this.maxDate.getDate() + 4);
    this.loginDetails = JSON.parse(localStorage.getItem("userdetails"));
    this.prescriptionDetailsDataSource = new TableDataSource([], PrescriptionModel);
    this.prescriptionDetailsDataSource.datasourceSubject.subscribe(personList => {
      this.prescriptionListChange.emit(personList); this.loadedData = personList;
    });

    var id = this.apiServices.custIdByGobal; this.page = this.activatedRoute.snapshot.paramMap.get("page");
    this.cusId = this.apiServices.custIdByGobal;
    if (this.page == 'new' && (id == null || id == undefined || id <= 0)) {
      this.subheaderService.setTitle("Add New Customer");
    } else {
      this.subheaderService.setTitle("Create New Order");
    }
    if (id != null && id != undefined && id > 0) {
      this.setInit(id); this.createByList = true; this.emailEdit = true; this.apiServices.custIdByGobal = 0;
    } else {
      this.setInit(0);
    }
  }

  searchFilterBypharmacy(value, flag) {
    let data = []; //debugger
    this.tempPharmacyList.filter(val => {
      if (val.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        data.push(val);
      }
    })
    this.pharmacyList = data;
  }

  setInit(id) {
    this.orderModel.CustomerId = id;
    this.orderModel.CreatedBy = this.loginDetails.UserId;
    this.formCreation(); this.autoCompletedLocation();
    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      this.isRole = true; this.inItList(id);
    } else {
      if (this.loginDetails.IsChargeaccount != undefined && this.loginDetails.IsChargeaccount != null) {
        this.IsChargeaccount = this.loginDetails.IsChargeaccount;
      }
      this.orderForm.get('PharmacyId').setValue(this.loginDetails.PharmacyId);
      this.orderModel.PharmacyId = this.loginDetails.PharmacyId;
      if (id != null && id != undefined && id != "" && id > 0) {
        this.customerBy(id);
      } else {
        this.apiServices.GetList("Pharmacy/GetListByPId?id=" + this.loginDetails.PharmacyId).subscribe((res: any) => {
          this.commonServices.visibility = "hidden"; this.loginDetails.PharmacyOffSet = res.offset;
          this.orderTypeList = res.adminUsers;
          if (res.flag) {
            this.isPharmacySelected = true; this.isNoDeliveryPickup = false;
          }
          if (res.adminUsers == null || res.adminUsers.length <= 0) {
            this.isNoDeliveryPickup = true; this.isPharmacySelected = true;
          }
        }, err => {
          this.commonServices.visibility = "hidden"; this.commonServices.customError(1);
        });
      }
    }
  }

  customerBy(id) {
    this.apiServices.GetList(this.url + "GetPharmacyByCustomer?cusid=" + id).subscribe((res: any) => {
      if (res != null && !res.IsBlock) {
        res.PharmacyId = this.apiServices.phIdByGobal;
        this.isCheckNextDayDelivery(res.PharmacyId, res);
      } else {
        this.commonServices.visibility = "hidden"; this.apiServices.showSnack(res.ErroMessage);
      }
    }, err => {
      this.commonServices.customError(1);
    });
  }

  isCheckNextDayDelivery(id, res) {
    this.apiServices.GetList("Pharmacy/GetListByIdBySlot?id=" + id).subscribe((res1: any) => {
      res.adminUsers = res1;
      this.setValueBy(res); this.loginDetails.PharmacyOffSet = res.PharmacyOffSet;
      if (res.pharmacy != null) {
        this.isPharmacySelected = true;
        if (res.pharmacy.AvailableDelivery) {
          this.isNoDeliveryPickup = !res.pharmacy.AvailableDelivery;
        }
        else {
          this.isNoDeliveryPickup = !res.pharmacy.AvailablePickup;
        }
      }
      this.commonServices.visibility = "hidden";
    }, err => {
      this.commonServices.customError(1);
    });
  }

  setValueBy(res) {
    if (res.pharmacy != null) {
      this.orderTypeList = res.adminUsers;
    }
    if (!res.IsProcessOrder && this.emailEdit && (res.Email == null || res.Email == "" || res.Email == undefined)) {
      this.emailEdit = false;
    }
    this.customerModel = res; this.orderModel = res;
    this.orderModel.MobileNo = res.Mobileno;
    this.mobMask = this.commonServices.auX(res.Mobileno);
    this.MobLength = this.commonServices.auML(res.Mobileno);
    this.orderModel.EmailId = res.Email;
    this.orderModel.IsOrderStatus = 6;
    this.orderModel.OrderTo = 0; var newFList = [];
    this.patientList.push({ FamilyId: 999, TemFamilyId: 999, Name: res.FirstName + " " + (res.LastName == null || res.LastName == undefined ? "" : res.LastName) });
    if (res.familyMembers != null && res.familyMembers.length > 0) {
      res.familyMembers.forEach((element, i) => {
        newFList.push({
          FamilyId: element.FamilyId, TemFamilyId: element.FamilyId, Name: element.FirstName + " " + (element.LastName == null || element.LastName == undefined ? "" : element.LastName), MedicareNo: element.MedicareNo,
          FirstName: element.FirstName, LastName: element.LastName, ConcessionNo: element.ConcessionNo,
          ConcessionValidTo: element.ConcessionValidTo ? this.datepipe.transform(element.ConcessionValidTo, 'MM/yy') : '',
          MedicareValidTo: element.MedicareValidTo ? this.datepipe.transform(element.MedicareValidTo, 'MM/yy') : ''
        });
      });
      this.patientList = this.patientList.concat(newFList);
      this.TempdataSource = newFList; this.orderModel.OrderTo = 1;
      this.showPInfo = true; this.dataSource = new MatTableDataSource(newFList);
    }
    // console.log(res.deliveryAddress);
    if (res.deliveryAddress != null) {
      this.orderModel.DeliveryAddress = res.deliveryAddress.DeliveryAdd;
      this.orderModel.Latitude = res.deliveryAddress.DeliveryLattitude;
      this.orderModel.City = res.deliveryAddress.DeliveryCity;
      this.orderModel.State = res.deliveryAddress.DeliveryState;
      this.orderModel.Pincode = res.deliveryAddress.DeliveryPincode;
      this.orderModel.Longitude = res.deliveryAddress.DeliveryLongitude;
      this.orderModel.DeliveryUnit = res.deliveryAddress.DeliveryUnit;
      this.orderModel.DeliveryStreetNumber = res.deliveryAddress.DeliveryStreetNumber;
      this.orderModel.DeliveryStreetName = res.deliveryAddress.DeliveryStreetName;
      this.IsDelivery = res.deliveryAddress.DeliveryAdd;
      this.addressModel.City = res.deliveryAddress.DeliveryCity;
      this.addressModel.State = res.deliveryAddress.DeliveryState;
      this.addressModel.Pincode = res.deliveryAddress.DeliveryPincode;
      this.addressModel.DeliveryStreetNumber = res.deliveryAddress.DeliveryStreetNumber;
      this.addressModel.DeliveryStreetName = res.deliveryAddress.DeliveryStreetName;
      this.addressModel.DeliveryUnit = res.deliveryAddress.DeliveryUnit;
      this.addressModel.lat = res.deliveryAddress.DeliveryLattitude;
      this.addressModel.lng = res.deliveryAddress.DeliveryLongitude;
    }
    this.formCreation(); this.orderForm.get('OrderType').setValue(this.orderModel.OrderType);
    this.dobValue = this.orderForm.controls['Dob'].value;
    this.commonServices.visibility = "hidden";
    this.cdRef.detectChanges();
  }

  async recievedItem(dat: any) {
    var un = dat.DeliveryUnit ? dat.DeliveryUnit : '';
    var delad = un + " " + this.orderModel.DeliveryStreetNumber + ', ' + this.orderModel.DeliveryStreetName + ', ' + this.orderModel.City + ', ' + this.orderModel.State + ', ' + this.orderModel.Pincode
    if (dat.DeliveryStreetNumber != '' && dat.DeliveryStreetNumber != undefined && dat.DeliveryStreetNumber != null && dat.DeliveryStreetName != '' && dat.DeliveryStreetName != undefined && dat.DeliveryStreetName != null && dat.City != '' && dat.City != undefined && dat.City != null && dat.State != '' && dat.State != undefined && dat.State != null && dat.Postcode != '' && dat.Postcode != undefined && dat.Postcode != null) {

      this.orderModel.DeliveryStreetNumber = dat.DeliveryStreetNumber.toString();
      this.orderModel.DeliveryStreetName = dat.DeliveryStreetName.toString();
      this.orderModel.City = dat.City.toString();
      this.orderModel.Pincode = dat.Pincode.toString();
      this.orderModel.State = dat.State.toString();
      this.orderModel.DeliveryUnit = dat.DeliveryUnit.toString();
    }
    this.orderModel.DeliveryAddress = delad;
    this.orderModel.DeliveryUnit = un;
    // this.orderModel.DeliveryAdd = this.setManualAddress(this.delData);
    // await this.getSelectedLatLng(dat.DeliveryAdd);
    // console.log(dat);

    // }
  }

  inItList(id) {
    this.apiServices.GetList(this.url + "GetPharmacyByRole?pharmacygrpid=" + this.loginDetails.PharmacyGrpId + "&roleid=" + this.loginDetails.RoleId + "&cusid=" + id + "&phadminid=" + this.loginDetails.UserId).subscribe((res: any) => {
      if (res != null && !res.customers.IsBlock) {
        this.pharmacyList = res.dbpharmacy; this.offsetList = res.offsetList; this.tempPharmacyList = res.dbpharmacy;
        if (id > 0) {
          res.customers.PharmacyId = this.apiServices.phIdByGobal;
          var filterby = this.pharmacyList.filter(function (val) { return val.PharmacyId == res.customers.PharmacyId });
          if (filterby.length > 0) {
            var filterby1 = res.customers.adminUsers.filter(function (val) { return val.id == 3 });
            if (filterby1.length <= 0) {
              res.customers.adminUsers.push({ id: 3, value: "Next business day delivery" });
            }
            if (filterby[0].LongDistanceDeliveryFee == null || filterby[0].LongDistanceDeliveryFee == 0) {
              res.customers.adminUsers = this.orderTypeList;
            }
            this.IsChargeaccount = filterby[0].IsChargeaccount != null ? filterby[0].IsChargeaccount : false;
          }
          this.setValueBy(res.customers); this.apiServices.phIdByGobal = 0;
          if (res.customers.pharmacy != null) {
            this.isPharmacySelected = true;
            if (res.customers.pharmacy.AvailableDelivery) {
              this.isNoDeliveryPickup = !res.customers.pharmacy.AvailableDelivery;
            }
            else {
              this.isNoDeliveryPickup = !res.customers.pharmacy.AvailablePickup;
            }
          }
        } else { this.commonServices.visibility = "hidden"; this.cdRef.detectChanges(); }
      } else {
        this.commonServices.visibility = "hidden"; this.apiServices.showSnack(res.customers.ErroMessage);
      }
    }, err => {
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      this.commonServices.customError(1);
    });
  }

  repeatValidation(data: any, flag) {
    var fillter = this.commonServices.repeatValidation(data, flag);
    if (fillter == 1) {
      this.notifier.notify('error', "Please enter the Total Repeats and Remaining Repeats before enter the Days Remaining.");
    } else if (fillter == 2) {
      this.notifier.notify('error', "Please enter the Total Repeats before enter the Remaining Repeats.");
    } else if (fillter == 3) {
      this.notifier.notify('error', "Please enter less than or equal Total Repeats.");
    }
  }

  alertDialog(data) {
    this.dialog.open(AlertDialogComponent, {
      disableClose: data.closebtn,
      data: data,
      width: ' 380px',
      height: data.height
    }).afterClosed().subscribe(val => {
      if (val == 'Show') {
        if (data.flag == 1) {
          this.medicineList = []; this.prePharId = this.orderForm.controls.PharmacyId.value; this.pharmacyFlag = false;
          this.prescriptionDetailsDataSource = new TableDataSource([], PrescriptionModel);
        }
        else if (data.flag == 3) {
          this.resetBy();
        }
        else if (data.flag == 4) {
          this.apiServices.Post(data.list, this.url + 'famPost?id=' + data.cusid).subscribe((res: any) => {
            this.apiServices.showSnack("Family member removed successfully");
            this.reset();
            var k = this.patientList.findIndex(element => element.FamilyId == data.list.FamilyId);
            this.TempdataSource.splice(data.index, 1);
            this.patientList.splice(k, 1);
            this.dataSource = new MatTableDataSource(this.TempdataSource);
            this.resetDtl();
            this.cdRef.detectChanges();
          }, err => {
            console.log(err);
            this.commonServices.customError(2);
          });
        }
        else {
          this.deleteOrder(data.list.deldata); data.list.row.cancelOrDelete();
        }
      } else {
        if (data.flag == 1) {
          this.prePharId = data.id; this.pharmacyFlag = true; this.orderForm.get('PharmacyId').setValue(data.id);
        }
      }
      this.cdRef.detectChanges();
    });
  }

  deleteAlert(deldata, row) {
    var data = {
      closebtn: true,
      btnCancelText: 'No',
      btnOkText: 'Yes',
      title: "Delete Medicine",
      message: "Are you sure you want to delete?",
      height: "200px",
      flag: 2,
      id: 0,
      list: { deldata, row }
    }
    this.alertDialog(data);
  }

  changePharmacyBy(pid, e, prescriptionDetailsDataSource) {
    // this.selectPharmacy(e);
    if (this.createByList) { return; }
    if (this.pharmacyFlag) { this.pharmacyFlag = false; return; }
    this.prePharId = this.prePharId == 0 ? e : pid;
    if (prescriptionDetailsDataSource.rowsSubject.value != undefined && prescriptionDetailsDataSource.rowsSubject.value != null &&
      prescriptionDetailsDataSource.rowsSubject.value.length > 0) {
      if (e <= 0) {
        this.medicineList = []; this.prePharId = 0; this.pharmacyFlag = false;
        this.prescriptionDetailsDataSource = new TableDataSource([], PrescriptionModel); this.cdRef.detectChanges();
        return;
      }
      var data = {
        closebtn: true,
        btnCancelText: 'No',
        btnOkText: 'Yes',
        title: "Medicine Details",
        message: "Your order contains items from another pharmacy.Would you like to create a new order from this pharmacy ?",
        height: "240px",
        flag: 1,
        id: pid
      }
      this.alertDialog(data);
    } else {
      this.medicineList = [];
    }
  }

  selectPharmacy(pid, pharmacyId, prescriptionDetailsDataSource): void {
    this.IsChargeaccount = false;
    if (pharmacyId != null && pharmacyId > 0) {
      this.commonServices.visibility = "shown";
      this.apiServices.GetById('Pharmacy/GetPharmacyByTimeSlots?pharmacyId=' + pharmacyId).subscribe(res => {
        this.isPharmacySelected = true; this.IsChargeaccount = res.pharmacy != null && res.pharmacy.IsChargeaccount != null ? res.pharmacy.IsChargeaccount : false; //this.pharmacyAvailableTimings = res.list;
        this.orderTypeList = res.adminUsers; this.isNoDeliveryPickup = res.flag; this.commonServices.visibility = "hidden";
        this.changePharmacyBy(pid, pharmacyId, prescriptionDetailsDataSource);
      });
    }
  }

  getMedicineList(val, list, orderModel) {
    list.currentData.Quantity = 1; //list.currentData.Repeats = 2;
    if (val != undefined && val != null && val != "" && val.length > 2 && val.length <= 3 && this.orderForm.controls.PharmacyId.value != null && this.orderForm.controls.PharmacyId.value > 0) {
      this.apiServices.GetList("PharmacistReviewV2/GetSearchByMedicine?pharmacygrpid=" + this.loginDetails.PharmacyGrpId + "&search=" + val + "&phid=" + this.orderForm.controls.PharmacyId.value).subscribe((res: any) => {
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

  deleteOrder(ordermodel) {
    this.deleteBy = true;
  }

  medicineUpdate(rowdata, suborderid, rowd) {
    if (suborderid == 1 && rowd.currentData.SubOrderId == 0) {
      rowd.cancelOrDelete()
    }
  }

  formCreation() {
    this.orderForm = this._formBuilder.group({
      OrderId: new FormControl(this.orderModel.OrderId),
      CreatedBy: new FormControl(this.orderModel.CreatedBy),
      FirstName: new FormControl(this.orderModel.FirstName),
      LastName: new FormControl(this.orderModel.LastName),
      MobileNo: new FormControl(this.orderModel.MobileNo),
      EmailId: new FormControl(this.orderModel.EmailId),
      Total: new FormControl(this.orderModel.Total),
      Dob: new FormControl(this.orderModel.Dob != null ? this.datepipe.transform(new Date(this.orderModel.Dob), 'dd/MM/yyyy') : ''),
      Age: new FormControl(this.orderModel.Age),
      MedicareNo: new FormControl(this.orderModel.MedicareNo),
      MedicareValidTo: new FormControl(this.orderModel.MedicareValidTo ? this.datepipe.transform(this.orderModel.MedicareValidTo, 'MM/yy') : ''),
      ConcessionValidTo: new FormControl(this.orderModel.ConcessionValidTo ? this.datepipe.transform(this.orderModel.ConcessionValidTo, 'MM/yy') : ''),
      DeliveryByDate: new FormControl(this.orderModel.DeliveryByDate),
      DeliveryByTime: new FormControl(this.orderModel.DeliveryByTime),
      OrderType: new FormControl(this.orderModel.OrderType.toString()),
      IsDefault: new FormControl(this.orderModel.IsDefault),
      IsPreferredPharmacy: new FormControl(this.orderModel.IsPreferredPharmacy),
      IsConvenienceFee: new FormControl(this.orderModel.IsConvenienceFee),
      IsDeliveryFee: new FormControl(this.orderModel.IsDeliveryFee),
      DeliveryAddress: new FormControl(this.orderModel.DeliveryAddress),
      FFirstName: new FormControl(this.orderModel.FFirstName),
      FLastName: new FormControl(this.orderModel.FLastName),
      FMedicareNo: new FormControl(this.orderModel.FMedicareNo),
      FMedicareValidTo: new FormControl(this.orderModel.FMedicareValidTo ? this.datepipe.transform(this.orderModel.FMedicareValidTo, 'MM/yy') : ''),
      FConcessionValidTo: new FormControl(this.orderModel.FConcessionValidTo ? this.datepipe.transform(this.orderModel.FConcessionValidTo, 'MM/yy') : ''),
      FConcessionNo: new FormControl(this.orderModel.FConcessionNo),
      OrderTo: new FormControl(this.orderModel.OrderTo),
      Latitude: new FormControl(this.orderModel.Latitude),
      City: new FormControl(this.orderModel.City),
      State: new FormControl(this.orderModel.State),
      Pincode: new FormControl(this.orderModel.Pincode),
      Longitude: new FormControl(this.orderModel.Longitude),
      DeliveryUnit: new FormControl(this.orderModel.DeliveryUnit),
      DeliveryStreetNumber: new FormControl(this.orderModel.DeliveryStreetNumber),
      DeliveryStreetName: new FormControl(this.orderModel.DeliveryStreetName),
      PharmacyId: new FormControl(this.orderModel.PharmacyId),
      IsOrderStatus: new FormControl(this.orderModel.IsOrderStatus),
      ConcessionNo: new FormControl(this.orderModel.ConcessionNo),
      CustomerId: new FormControl(this.orderModel.CustomerId),
      IsProcessOrder: new FormControl(this.orderModel.IsProcessOrder),
      PharmacyNotes: new FormControl(this.orderModel.PharmacyNotes)
    })
  }

  changeOrderType(val) {
    this.orderForm.get('DeliveryByDate').setValue(null); this.orderForm.get('DeliveryByTime').setValue('');
    if (val == 3) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Setting to tomorrow's date
      this.minDate = tomorrow;
    } else {
      this.minDate = new Date(); // Set minDate to today's date
    }
    // this.orderModel.OrderType = val;
    // this.orderForm.get('OrderType').setValue(val);
    // debugger
    // if (val != null && val == 2) {
    //   this.changeDelDate(null);
    // }
  }

  changeOrderTo() {
    if (this.showPInfo) {
      this.editMode = false; this.editbyId = 0; this.fAddBtn = "Add";
      this.orderForm.get('FFirstName').setValue("");
      this.orderForm.get('FLastName').setValue("");
      this.orderForm.get('FMedicareNo').setValue("");
      this.orderForm.get('FConcessionNo').setValue("");
      this.orderForm.get('FMedicareValidTo').setValue("");
      this.orderForm.get('FConcessionValidTo').setValue("");
      if (!this.createByList) {
        this.TempdataSource = []; this.dataSource = new MatTableDataSource(this.TempdataSource);
      }
    }
  }

  changeDefault(val) {
    debugger
  }

  changeFName() {
    var firstname = this.orderForm.controls.FirstName.value + " " + (this.orderForm.controls.LastName.value == null || this.orderForm.controls.LastName.value == undefined ? "" : this.orderForm.controls.LastName.value);
    if (this.patientList.length > 0) {
      this.patientList.forEach((element, i) => {
        if (element.FamilyId == 999) {
          element.Name = firstname;
        }
      });
    } else {
      this.patientList.push({ FamilyId: 999, TemFamilyId: 999, Name: firstname });
    }
  }

  changeDelDate(val): void {
    if (val !== null) {
      this.deliveryTimeSlots = []; var PharmacyId = this.orderForm.get('PharmacyId').value;
      if (this.validBy(PharmacyId, "Pharmacy name")) {
        return;
      }
      var CustomerOffSet = 0;
      if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
        var filterby = this.pharmacyList.filter(function (val) { return val.PharmacyId == PharmacyId; });
        if (filterby.length > 0) {
          var flist = this.offsetList.filter(function (val) { return val.id == filterby[0].PharmacyOffSet; });
          if (flist.length > 0) {
            CustomerOffSet = flist[0].value;
          }
        }
      } else {
        CustomerOffSet = this.loginDetails.PharmacyOffSet;
        PharmacyId = this.loginDetails.PharmacyId;
      }

      var list = {
        ClientDate: val == null ? new Date() : this.datepipe.transform(new Date(val), 'dd MMM yyyy hh:mm a'),
        CustomerOffSet: CustomerOffSet,
        PharmacyId: PharmacyId,
        cDate: new Date(),
        OrderType: this.orderForm.get('OrderType').value,
      }
      this.commonServices.visibility = "shown"; this.pharmacyAvailableTimings = []; this.deliveryTimeSlots = [];

      this.apiServices.Post(list, "CreateNewOrder/GetTimeSlotList").subscribe((res: any) => {
        this.commonServices.visibility = "hidden";
        if (list.OrderType == 1 || list.OrderType == 3) {
          this.pharmacyAvailableTimings = res.selectedDayPharmacyAvailability;
          this.deliveryTimeSlots = res.timeSlots;
          if (this.deliveryTimeSlots != null && this.deliveryTimeSlots.length > 0) {
            this.orderForm.get('DeliveryByTime').setValue(this.deliveryTimeSlots[0]);
          }
          if (res.flag == 4 || res.flag == 3) {
            this.apiServices.showSnack(res.ErroMessage);
          }
        } else {
          if (val == null && (res.flag == 4 || res.flag == 3 || res.flag == 2)) {
            this.orderForm.get('OrderType').setValue(0);
          }
          if (res.flag == 4 || res.flag == 3) {
            this.apiServices.showSnack(res.ErroMessage);
          } else {
            if (res.flag == 2) {
              if (list.OrderType == 1) {
                this.apiServices.showSnack('Sorry, we do not currently serve this area.');
              }
              else {
                this.apiServices.showSnack('Pharmacy closing hours is nearing. Please try again next day.');
              }
            }
          }
        }
      }, err => {
        this.commonServices.visibility = "hidden"; this.commonServices.customError(1);
      });


    }

  }
  selectTime(data) {
    this.orderForm.get('DeliveryByTime').setValue(data);
  }

  setValue(i: number, timeSlots: any) {
    this.deliveryTimeSlots = [];
    for (i; i < timeSlots.length; i++) {
      this.deliveryTimeSlots.push(timeSlots[i]);
    }
    this.orderForm.get('DeliveryByTime').setValue(this.deliveryTimeSlots[0]);
  }

  changeValue(e) {
    var medicareno = this.orderForm.controls.MedicareNo.value;
    console.log(this.patientList);
    var list = this.patientList.filter(function (val) { return val.MedicareNo == medicareno; });
    if (list.length > 0) {
      this.apiServices.showSnack("Medicare number is duplicated");
      return;
    }
  }

  onAdd() {
    var firstname = this.orderForm.controls.FFirstName.value;
    var lastname = this.orderForm.controls.FLastName.value;
    var medicareno = this.orderForm.controls.FMedicareNo.value;
    var medicareValidTo = this.orderForm.controls.FMedicareValidTo.value;
    var concessionValidTo = this.orderForm.controls.FConcessionValidTo.value;
    var concessionNo = this.orderForm.controls.FConcessionNo.value;
    if (firstname == null || firstname == "" || firstname == undefined) {
      this.apiServices.showSnack("First name is required");
      return;
    }
    if (lastname == null || lastname == "" || lastname == undefined) {
      this.apiServices.showSnack("Last name is required");
      return;
    }
    if (medicareno != undefined && medicareno != "" && medicareno != null || (medicareValidTo != undefined && medicareValidTo != "" && medicareValidTo != null)) {
      medicareno = this.commonServices.validDigRep(medicareno);
      if (medicareno == "") {
        this.apiServices.showSnack("Medicare number is required");
        return;
      }
      if (medicareno.length < 11) {
        this.apiServices.showSnack("Invalid Medicare number");
        return;
      }
      var medino = this.orderForm.controls.MedicareNo.value;
      if (this.TempdataSource.length <= 1 && medicareno == medino) {
        this.apiServices.showSnack("Medicare number is duplicated");
        return;
      }

      if (medicareno == medino) {
        this.apiServices.showSnack("Medicare number is duplicated");
        return;
      }

      if (medicareValidTo == undefined || medicareValidTo == "" || medicareValidTo == null) {
        this.apiServices.showSnack("Medicare validity date is required");
        return;
      }

      var mval = this.commonServices.isNotValidExp(medicareValidTo);
      if (medicareValidTo == undefined || medicareValidTo == "" || medicareValidTo == null || mval == 2) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }

      if (mval == true) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }
      else if (mval == 2) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }
      var editid = this.editbyId; var flist = [];
      this.TempdataSource.forEach((element, i) => {
        var list = this.patientList.filter(function (val) { return val.MedicareNo == medicareno; });
        if (list.length > 0 && list[0].FamilyId != editid) {
          flist = [element];
          return;
        }
      });

      if (flist.length > 0) {
        this.apiServices.showSnack("Medicare number is duplicated");
        return;
      }
      medicareValidTo = this.commonServices.setValidDate(medicareValidTo);
    }

    if ((concessionNo != undefined && concessionNo != "" && concessionNo != null) || (concessionValidTo != undefined && concessionValidTo != "" && concessionValidTo != null)) {
      concessionNo = concessionNo.toUpperCase();
      concessionNo = this.commonServices.validDigRep(concessionNo);
      if (concessionNo == undefined || concessionNo == "" || concessionNo == null) {
        this.apiServices.showSnack("Concession number is required");
        return;
      }
      if (concessionValidTo == undefined || concessionValidTo == "" || concessionValidTo == null) {
        this.apiServices.showSnack("Concession validity date is required");
        return;
      }
      var cval = this.commonServices.isNotValidExp(concessionValidTo);
      if (cval == true) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
      else if (cval == 2) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
    }

    concessionValidTo = this.commonServices.setValidDate(concessionValidTo);

    var dlist = { FamilyId: this.TempdataSource.length + 1, TemFamilyId: this.TempdataSource.length + 1, Name: firstname + " " + (lastname == null || lastname == undefined ? "" : lastname), FirstName: firstname, LastName: lastname, MedicareNo: medicareno, ConcessionNo: concessionNo, ConcessionValidTo: concessionValidTo, MedicareValidTo: medicareValidTo };
    if (!this.editMode) {
      this.TempdataSource.push(dlist); this.patientList.push(dlist);
    }

    var editbyId = this.editbyId;
    if (this.TempdataSource.length > 0) {
      this.TempdataSource.forEach((element, i) => {
        if (element.FamilyId == editbyId) {
          element.Name = firstname + " " + (lastname == null || lastname == undefined ? "" : lastname); element.FirstName = firstname; element.LastName = lastname; element.MedicareNo = medicareno; element.ConcessionNo = concessionNo; element.ConcessionValidTo = concessionValidTo, element.MedicareValidTo = medicareValidTo;
        }
      });
      this.patientList.forEach((element, i) => {
        if (element.FamilyId == editbyId) {
          element.Name = firstname + " " + (lastname == null || lastname == undefined ? "" : lastname); element.FirstName = firstname; element.LastName = lastname; element.MedicareNo = medicareno; element.ConcessionNo = concessionNo; element.ConcessionValidTo = concessionValidTo, element.MedicareValidTo = medicareValidTo;
        }
      });
    } else {
      this.TempdataSource.push(dlist); this.patientList.push(dlist);
    }
    this.reset(); this.dataSource = new MatTableDataSource(this.TempdataSource);
    this.resetDtl();
  }

  editAdd(data) {
    let CVtype = '';
    let MVtype = '';
    if (data.ConcessionValidTo != null) {
      CVtype = typeof (data.ConcessionValidTo);
    }
    if (data.MedicareValidTo != null) {
      MVtype = typeof (data.MedicareValidTo);
    }

    data.ConcessionValidTo = data.ConcessionValidTo == undefined || data.ConcessionValidTo == "" ? null : this.getValidTo(data.ConcessionValidTo, CVtype);
    data.MedicareValidTo = data.MedicareValidTo == undefined || data.MedicareValidTo == "" ? null : this.getValidTo(data.MedicareValidTo, MVtype);
    this.editMode = true; this.editbyId = data.FamilyId; this.fAddBtn = "Edit";
    this.orderForm.get('FFirstName').setValue(data.FirstName);
    this.orderForm.get('FLastName').setValue(data.LastName);
    this.orderForm.get('FMedicareNo').setValue(data.MedicareNo);
    this.orderForm.get('FConcessionNo').setValue(data.ConcessionNo);
    this.orderForm.get('FConcessionValidTo').setValue(data.ConcessionValidTo);
    this.orderForm.get('FMedicareValidTo').setValue(data.MedicareValidTo);
  }

  getValidTo(validTo, type): any {
    if (type == 'string') {
      if (validTo[2] == '/') {
        return validTo;
      }
      return this.datepipe.transform(validTo, 'MM/yy');
    } else {
      return this.datepipe.transform(validTo, 'MM/yy');
    }
  }

  reset() {
    this.editMode = false; this.editbyId = 0; this.fAddBtn = "Add";
    this.orderForm.get('FFirstName').setValue("");
    this.orderForm.get('FLastName').setValue("");
    this.orderForm.get('FMedicareNo').setValue("");
    this.orderForm.get('FConcessionNo').setValue("");
    this.orderForm.get('FConcessionValidTo').setValue("");
    this.orderForm.get('FMedicareValidTo').setValue("");
  }

  resetDtl() {
    var list = this.patientList.filter(function (val) { return val.FamilyId == 999 });
    if (list.length <= 0 && this.orderForm.controls.FirstName.value != null && this.orderForm.controls.FirstName.value != "") {
      var firstname = this.orderForm.controls.FirstName.value + " " + (this.orderForm.controls.LastName.value == null || this.orderForm.controls.LastName.value == undefined ? "" : this.orderForm.controls.LastName.value);
      this.patientList.push({ FamilyId: 999, TemFamilyId: 999, Name: firstname })
    }
  }

  deleteAdd(dltdata, indx) {
    var data = {
      closebtn: true,
      btnCancelText: 'No',
      btnOkText: 'Yes',
      title: "Delete Family Member",
      message: "Are you sure you want to delete?",
      flag: 4,
      index: indx,
      cusid: this.cusId,
      list: dltdata
    }
    this.alertDialog(data);
  }

  odAdd(prescriptionDetailsDataSource) {
    if (prescriptionDetailsDataSource.rowsSubject.value.length <= 1) {
      var list = this.patientList.filter(function (val) { return val.FamilyId == 999 });
      if (list.length <= 0 && this.orderForm.controls.FirstName.value != null && this.orderForm.controls.FirstName.value != "") {
        var firstname = this.orderForm.controls.FirstName.value + " " + (this.orderForm.controls.LastName.value == null || this.orderForm.controls.LastName.value == undefined ? "" : this.orderForm.controls.LastName.value);
        this.patientList.push({ FamilyId: this.TempdataSource.length + 1, TemFamilyId: this.TempdataSource.length + 1, Name: firstname });
      }
    }
  }

  onChangeByMob(mobno) {
    mobno = this.commonServices.validDigRep(mobno);
    if (mobno != null && mobno != "" && mobno != undefined) {
      if ((mobno.charAt(0) != 0 && mobno.length == 1) || (mobno.charAt(0) != 0 && mobno.length >= 8)) {
        this.mobMask = this.commonServices.auX(mobno);
        this.MobLength = 11;
      }
      else if ((mobno.charAt(0) == 0 && mobno.length == 2) || (mobno.charAt(0) == 0 && mobno.length >= 9)) {
        this.mobMask = this.commonServices.auX(mobno);
        this.MobLength = 12;
      }
      if ((mobno.length == 9 && mobno.charAt(0) != 0) || (mobno.length == 10 && mobno.charAt(0) == 0)) {
        var phid = this.loginDetails.PharmacyId;
        if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
          phid = this.orderForm.get('PharmacyId').value || 0;
          if (phid <= 0) {
            this.apiServices.showSnack("Please choose the pharmacy.");
            return;
          }
        }
        this.apiServices.GetList(this.url + "GetSearchByMobBlock?cmob=" + mobno + "&phid=" + phid).subscribe((res: any) => {
          if (res.value == 1) {
            var data = {
              closebtn: true,
              btnCancelText: 'No',
              btnOkText: 'Yes',
              title: "Existing customer",
              message: "Please use customer list page to create new order. Do you want to reset the value?",
              height: "200px",
              flag: 3,
              id: 0,
              list: null
            }
            this.alertDialog(data);
          } else if (res.value == 3) {
            this.orderForm.get('MobileNo').setValue("");
            this.apiServices.showSnack(res.ErroMessage);
          }
        }, err => {
          this.commonServices.customError(1);
        });
      }
    }
  }

  getValidToData(validTo): any {
    if (validTo != null) {
      let type = typeof (validTo);
      if (type == 'string') {
        if (validTo[2] == '/') {
          return validTo;
        }
        return this.datepipe.transform(validTo, 'MM/yy');
      }
      return this.datepipe.transform(validTo, 'MM/yy');
    }
  }

  isProcessChange() {

  }

  async getImages(fileLoader) {
    fileLoader.click();
    var that = this; fileLoader.value = "";
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      var reader: any = new FileReader();
      reader.addEventListener("load", function () {
        that.base64Image = reader.result;
        that.TempdataSourceUpload.push({ Base64: reader.result, FileName: fileLoader.files[0].name });
        that.dataSourceUpload = that.TempdataSourceUpload;
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  uploaddelete(value, i) {
    var data = {
      closebtn: true,
      btnCancelText: 'No',
      btnOkText: 'Yes',
      title: "Delete File",
      message: "Are you sure you want to delete?",
      height: "200px",
      flag: 2,
      id: 0,
      list: { value, i }
    }
    this.alertDialogFile(data);
  }

  alertDialogFile(data) {
    var that = this;
    this.dialog.open(AlertDialogComponent, {
      disableClose: data.closebtn,
      data: data,
      width: ' 380px',
      height: data.height
    }).afterClosed().subscribe(val => {
      if (val == 'Show') {
        that.TempdataSourceUpload.splice(data.list.i, 1);
        that.dataSourceUpload = that.TempdataSourceUpload;
      } else {

      }
      this.cdRef.detectChanges();
    });
  }

  async onSave(bflag) {
    if (this.saveBtn) {
      this.apiServices.showSnack("Please wait loading...");
      return;
    }
    const controls = this.orderForm.controls;
    let enterdate = '';
    if (controls['Dob'].value != '') {
      if (controls['Dob'].value.length > 8) {
        enterdate = controls['Dob'].value
      } else {
        enterdate = controls['Dob'].value[0] + controls['Dob'].value[1] + '/' + controls['Dob'].value[2] + controls['Dob'].value[3] + '/' + controls['Dob'].value[4] + controls['Dob'].value[5] + controls['Dob'].value[6] + controls['Dob'].value[7]
      }
      var dateString = new Date(this.apiServices.changeFormate(enterdate));
    } else { dateString = null; }

    if (!this.createByList) { this.orderForm.get('IsPreferredPharmacy').setValue(true); }
    var deliveryadd = this.orderModel.DeliveryAddress;// controls['DeliveryAddress'].value;

    // if (deliveryadd != null && deliveryadd != "" && this.IsDelivery.toString().trim().toLowerCase() != deliveryadd.toString().trim().toLowerCase()) {
    //   await this.getSelectedLatLng(controls['DeliveryAddress'].value);

    // }
    // console.log(this.orderModel.DeliveryAddress);

    if (deliveryadd != null && deliveryadd != "" && this.IsDelivery.toString().trim().toLowerCase() != this.orderModel.DeliveryAddress.toString().trim().toLowerCase() || (deliveryadd == null || deliveryadd == "")) {

      if (this.orderModel.DeliveryStreetNumber == '' || this.orderModel.DeliveryStreetNumber == undefined || this.orderModel.DeliveryStreetNumber == null) {
        this.apiServices.showSnack('Please enter a valid street no.'); return;
      }
      if (this.orderModel.DeliveryStreetName == '' || this.orderModel.DeliveryStreetName == undefined || this.orderModel.DeliveryStreetName == null) {
        this.apiServices.showSnack('Please enter a valid street name.'); return;
      }

      if (this.orderModel.City == '' || this.orderModel.City == undefined || this.orderModel.City == null) {
        this.apiServices.showSnack('Please enter a valid suburb.'); return;
      }

      if (this.orderModel.Pincode == '' || this.orderModel.Pincode == undefined || this.orderModel.Pincode == null) {
        this.apiServices.showSnack('Please enter a valid postcode.'); return;
      }
      if (this.orderModel.State == '' || this.orderModel.State == undefined || this.orderModel.State == null) {
        this.apiServices.showSnack('Please enter a valid state.'); return;
      }
      // await this.getSelectedLatLng(this.orderModel.DeliveryAddress);


      // this.TempaddressModel.DeliveryStreetName = this.orderModel.DeliveryStreetName;
      // this.TempaddressModel.DeliveryStreetNumber = this.orderModel.DeliveryStreetNumber;
      // this.TempaddressModel.City = this.orderModel.City;
      // this.TempaddressModel.State = this.orderModel.State;
      // this.TempaddressModel.Pincode = this.orderModel.Pincode;
      // this.TempaddressModel.Country = this.addressModel.Country;
      // this.commonServices.visibility = "shown";
      await this.getSelectedLatLng(this.orderModel.DeliveryAddress);
      var stri1 = this.orderModel.DeliveryStreetNumber + "" + this.orderModel.DeliveryStreetName + "" + this.orderModel.City + " " + this.orderModel.State + " " + this.orderModel.Pincode; // this.orderModel.DeliveryAddress.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      stri1 = stri1.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      var manualSAdd = this.addressModel.DeliveryStreetNumber + " " + this.addressModel.ShortStreetName + ", " + this.addressModel.City + " " + this.addressModel.State + " " + this.addressModel.Pincode;// + " " + this.addressModel.Country;
      manualSAdd = manualSAdd.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      var manualLAdd = this.addressModel.DeliveryStreetNumber + " " + this.addressModel.DeliveryStreetName + ", " + this.addressModel.City + " " + this.addressModel.State + " " + this.addressModel.Pincode;// + " " + this.addressModel.Country;
      manualLAdd = manualLAdd.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      // console.log(manualSAdd, stri1);
      if (manualSAdd != stri1 && manualLAdd != stri1) {
        if (this.addressModel.DeliveryStreetNumber != this.orderModel.DeliveryStreetNumber) {
          this.apiServices.showSnack('Invalid street no.'); this.commonServices.visibility = "hidden"; return;
        }
        if (this.addressModel.DeliveryStreetName.toString().trim().toLowerCase() != this.orderModel.DeliveryStreetName.toString().trim().toLowerCase() && this.addressModel.ShortStreetName.toString().trim().toLowerCase() != this.orderModel.DeliveryStreetName.toString().trim().toLowerCase()) {
          this.apiServices.showSnack('Invalid street name.'); this.commonServices.visibility = "hidden"; return;
        }
        if (this.addressModel.City.toString().trim().toLowerCase() != this.orderModel.City.toString().trim().toLowerCase()) {
          this.apiServices.showSnack('Invalid suburb.'); this.commonServices.visibility = "hidden"; return;
        }
        if (this.addressModel.Pincode != this.orderModel.Pincode) {
          this.apiServices.showSnack('Invalid postcode.'); this.commonServices.visibility = "hidden"; return;
        }
        if (this.addressModel.State.toString().trim().toLowerCase() != this.orderModel.State.toString().trim().toLowerCase()) {
          this.apiServices.showSnack('Invalid state.'); this.commonServices.visibility = "hidden"; return;
        }
      }
      else {
        // console.log(this.orderModel.DeliveryAddress);

        await this.getSelectedLatLng(this.orderModel.DeliveryAddress);
      }

    }

    // this.saveBtn = false; this.commonServices.visibility = "hidden";
    // return;
    var list = {
      FirstName: controls['FirstName'].value,
      LastName: controls['LastName'].value,
      MobileNo: this.commonServices.validDigRep(controls['MobileNo'].value),
      CustomerId: controls['CustomerId'].value,
      EmailId: controls['EmailId'].value,
      MedicareNo: controls['MedicareNo'].value,
      Dob: dateString,
      Age: controls['Age'].value,
      MedicareValidTo: controls['MedicareValidTo'].value,
      OrderType: controls['OrderType'].value,
      IsPreferredPharmacy: controls['IsPreferredPharmacy'].value,
      IsConvenienceFee: controls['IsConvenienceFee'].value || 0,
      IsDeliveryFee: controls['IsDeliveryFee'].value || 0,
      IsDefault: controls['IsPreferredPharmacy'].value ? true : false,
      DeliveryByDate: this.datepipe.transform(controls['DeliveryByDate'].value, 'dd, MMM, y') || null,
      DeliveryByTime: controls['DeliveryByTime'].value || null,
      DeliveryAddress: this.orderModel.DeliveryAddress,// controls['DeliveryAddress'].value,
      Latitude: this.addressModel.lat,// controls['Latitude'].value,
      City: this.addressModel.City,// controls['City'].value,
      State: this.addressModel.State,// controls['State'].value,
      Pincode: this.addressModel.Pincode,//controls['Pincode'].value,
      Longitude: this.addressModel.lng,// controls['Longitude'].value,
      DeliveryUnit: this.addressModel.DeliveryUnit,// controls['DeliveryUnit'].value,
      DeliveryStreetNumber: this.addressModel.DeliveryStreetNumber,// controls['DeliveryStreetNumber'].value,
      DeliveryStreetName: this.addressModel.DeliveryStreetName,// controls['DeliveryStreetName'].value,
      OrderTo: controls['OrderTo'].value || 0,
      PharmacyId: controls['PharmacyId'].value,
      IsOrderStatus: 6,
      CreatedBy: this.orderModel.CreatedBy,
      ConcessionNo: controls['ConcessionNo'].value,
      ConcessionValidTo: controls['ConcessionValidTo'].value,
      IsProcessOrder: controls['IsProcessOrder'].value,
      CustomerOffSet: new Date().getTimezoneOffset(),
      ChargeAccount: bflag,
      PharmacyNotes: controls['PharmacyNotes'].value,
    };
    // console.log(list);
    // return;
    if (list.IsProcessOrder == null) {
      list.IsProcessOrder = false;
    }

    if (list.IsPreferredPharmacy != null && list.IsPreferredPharmacy != "" && list.IsPreferredPharmacy) {
      list.IsDefault = true;
    }

    var model = {
      familyList: this.patientList,
      uploadList: this.loadedData,
      newOrder: list,
      webpushdata: {},
      customer: {}
    }

    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      if (this.validBy(list.PharmacyId, "Pharmacy name")) {
        return;
      }
      var filterby = this.pharmacyList.filter(function (val) { return val.PharmacyId == list.PharmacyId; });
      if (filterby.length > 0) {
        var flist = this.offsetList.filter(function (val) { return val.id == filterby[0].PharmacyOffSet; });
        if (flist.length > 0) {
          list.CustomerOffSet = flist[0].value;
        }
      }
    } else {
      list.PharmacyId = this.loginDetails.PharmacyId;
      list.CustomerOffSet = this.loginDetails.PharmacyOffSet;
    }

    if (this.validBy(list.FirstName, "First name")) { return; }

    if (this.validBy(list.LastName, "Last name")) { return; }
    var validby = this.commonServices.validByMobileNo(list.MobileNo);
    if (validby == 1) {
      this.apiServices.showSnack("Enter your mobile number");
      return;
    }
    if (validby == 3) {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }
    if (validby == 2) {
      if (list.MobileNo.charAt(0) != 0) { list.MobileNo = "0" + list.MobileNo; }
    } else {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }

    if (!list.IsProcessOrder && this.validBy(list.EmailId, "Email address")) { return; }

    if (!list.IsProcessOrder && list.EmailId != null && list.EmailId != "" && list.EmailId != undefined) {
      if (!this.commonServices.validByEmailNo(list.EmailId)) {
        this.apiServices.showSnack("Please enter a valid email address");
        return;
      }
    }

    if (enterdate == '') {
      list.Age = 0;
    } else {
      var notvaliddob = this.commonServices.isNotValidDob(enterdate);
      if (notvaliddob == 2) {
        this.apiServices.showSnack("Invalid DOB");
        return;
      }
      if (list.Dob == undefined || list.Dob == null || notvaliddob == true) {
        this.apiServices.showSnack("Invalid DOB");
        return;
      }

      var avalid = this.ageFromDOB(enterdate);
      list.Age = controls['Age'].value;
      if (!avalid || list.Age == undefined || list.Age == null) {
        this.apiServices.showSnack("Age greater than or equal 1 year. Invalid Dob.");
        return;
      }
    }
    if ((list.MedicareNo != undefined && list.MedicareNo != "" && list.MedicareNo != null) || (list.MedicareValidTo != undefined && list.MedicareValidTo != "" && list.MedicareValidTo != null)) {
      list.MedicareNo = this.commonServices.validDigRep(list.MedicareNo);
      var s = new String(list.MedicareNo);
      if (list.MedicareNo == null || s.trim() == "" || list.MedicareNo == undefined || list.MedicareNo == "0") {
        this.apiServices.showSnack("Medicare number is required");
        return;
      }
      if (list.MedicareNo.length < 11) {
        this.apiServices.showSnack("Invalid Medicare number");
        return;
      }

      var cmedino = list.MedicareNo;
      var isduplicate = this.TempdataSource.filter(function (val) { return val.MedicareNo == cmedino; });
      if (this.TempdataSource.length != 0 && isduplicate != null && isduplicate.length != 0) {
        this.apiServices.showSnack("Medicare number is duplicated");
        return;
      }

      if (list.MedicareValidTo == undefined || list.MedicareValidTo == "" || list.MedicareValidTo == null) {
        this.apiServices.showSnack("Medicare validity date is required");
        return;
      }

      var mval = this.commonServices.isNotValidExp(list.MedicareValidTo);
      if (list.MedicareValidTo == undefined || list.MedicareValidTo == "" || list.MedicareValidTo == null || mval == 2) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }

      if (mval == true) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }

      list.MedicareValidTo = this.commonServices.setValidDate(this.getValidToData(list.MedicareValidTo));
    }

    // if (list.ConcessionNo != undefined && list.ConcessionNo != "" && list.ConcessionNo != null && list.ConcessionNo.length != 15) {
    //   this.apiServices.showSnack("Invalid Concession No.");
    //   return;
    // }

    if ((list.ConcessionNo != undefined && list.ConcessionNo != "" && list.ConcessionNo != null) || (list.ConcessionValidTo != undefined && list.ConcessionValidTo != "" && list.ConcessionValidTo != null)) {
      list.ConcessionNo = this.commonServices.validDigRep(list.ConcessionNo);
      list.ConcessionNo = list.ConcessionNo.toUpperCase();
      if (list.ConcessionNo == undefined || list.ConcessionNo == "" || list.ConcessionNo == null) {
        this.apiServices.showSnack("Concession number is required");
        return;
      }
      if (list.ConcessionValidTo == undefined || list.ConcessionValidTo == "" || list.ConcessionValidTo == null) {
        this.apiServices.showSnack("Concession validity date is required");
        return;
      }
      var cval = this.commonServices.isNotValidExp(list.ConcessionValidTo);
      if (cval == true) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
      else if (cval == 2) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
      list.ConcessionValidTo = this.commonServices.setValidDate(this.getValidToData(list.ConcessionValidTo));
    }

    if (this.validBy(list.OrderType, "Order type")) { return; }

    var text = "Delivery address";
    if (list.OrderType == 2) { text = "Customer address"; }

    if (this.validBy(list.DeliveryAddress, text)) { return; }

    if (this.validMBy(list.DeliveryStreetNumber, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (this.validMBy(list.DeliveryStreetName, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (this.validMBy(list.City, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (list.OrderType == 1 || list.OrderType == 3) {
      if (this.validBy(list.DeliveryByDate, "Delivery date")) {
        return;
      }
      if (this.validBy(list.DeliveryByTime, "Delivery time")) { return; }
      if (list.DeliveryByTime == "Not Available Today") {
        this.apiServices.showSnack("Delivery time is invalid.");
        return;
      }
    }

    if (this.loadedData == null || this.loadedData.length <= 0) {
      this.commonServices.visibility = "hidden";
      this.apiServices.showSnack("Please add medicine details");
      return;
    }
    if (this.validateBy(this.loadedData)) {
      model.uploadList.forEach(element => {
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

      model.familyList.forEach(element => {
        element.ConcessionValidTo = this.commonServices.setValidDate(this.getValidToData(element.ConcessionValidTo));
        element.MedicareValidTo = this.commonServices.setValidDate(this.getValidToData(element.MedicareValidTo));
      });
      model.webpushdata = this.commonServices.sendWebPush(model);
      model.customer = this.setSlots(list);
      this.saveBtn = true; this.commonServices.visibility = "shown";
      this.apiServices.Post(model, this.url + "Post?roleid=" + this.loginDetails.RoleId).subscribe(res => {
        this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
        if (res.Flag == 1) {
          this.commonServices.visibility = "hidden";
          this.router.navigate(['/app/masters/customers']);
        } else if (res.Flag == 3) {
          this.orderForm.get('DeliveryByDate').setValue(null); this.orderForm.get('DeliveryByTime').setValue(0);
          this.deliveryTimeSlots = [];
        }
        this.apiServices.showSnack(res.ErrorStr); this.saveBtn = false;
      }, error => {
        this.saveBtn = false; this.commonServices.visibility = "hidden";
        this.commonServices.customError(2); this.router.navigate(['/app/masters/customers']);
        this.cdRef.detectChanges();
      });
    } else {
      this.apiServices.showSnack('Please check the order details');
    }
  }

  async onPlaceOrder() {
    if (this.saveBtn) {
      this.apiServices.showSnack("Please wait loading...");
      return;
    }
    const controls = this.orderForm.controls;

    let enterdate = '';
    if (controls['Dob'].value != '') {
      if (controls['Dob'].value.length > 8) {
        enterdate = controls['Dob'].value
      } else {
        enterdate = controls['Dob'].value[0] + controls['Dob'].value[1] + '/' + controls['Dob'].value[2] + controls['Dob'].value[3] + '/' + controls['Dob'].value[4] + controls['Dob'].value[5] + controls['Dob'].value[6] + controls['Dob'].value[7]
      }
      var dateString = new Date(this.apiServices.changeFormate(enterdate));
    } else { dateString = null; }

    if (!this.createByList) { this.orderForm.get('IsPreferredPharmacy').setValue(true); }
    var deliveryadd = this.orderModel.DeliveryAddress;  //controls['DeliveryAddress'].value;
    //  old
    // if (deliveryadd != null && deliveryadd != "" && this.IsDelivery.toString().trim().toLowerCase() != deliveryadd.toString().trim().toLowerCase()) {
    //   await this.getSelectedLatLng(controls['DeliveryAddress'].value);
    // }
    if (deliveryadd != null && deliveryadd != "" && this.IsDelivery.toString().trim().toLowerCase() != this.orderModel.DeliveryAddress.toString().trim().toLowerCase() || (deliveryadd == null || deliveryadd == "")) {

      if (this.orderModel.DeliveryStreetNumber == '' || this.orderModel.DeliveryStreetNumber == undefined || this.orderModel.DeliveryStreetNumber == null) {

        this.apiServices.showSnack('Please enter a valid street no.'); return;
      }
      if (this.orderModel.DeliveryStreetName == '' || this.orderModel.DeliveryStreetName == undefined || this.orderModel.DeliveryStreetName == null) {
        this.apiServices.showSnack('Please enter a valid street name.'); return;
      }
      if (this.orderModel.City == '' || this.orderModel.City == undefined || this.orderModel.City == null) {
        this.apiServices.showSnack('Please enter a valid suburb.'); return;
      }
      if (this.orderModel.Pincode == '' || this.orderModel.Pincode == undefined || this.orderModel.Pincode == null) {
        this.apiServices.showSnack('Please enter a valid postcode.'); return;
      }
      if (this.orderModel.State == '' || this.orderModel.State == undefined || this.orderModel.State == null) {
        this.apiServices.showSnack('Please enter a valid state.'); return;
      }
      // await this.getSelectedLatLng(this.orderModel.DeliveryAddress);
      // this.commonServices.visibility = "shown";
      await this.getSelectedLatLng(this.orderModel.DeliveryAddress);
      var stri1 = this.orderModel.DeliveryStreetNumber + "" + this.orderModel.DeliveryStreetName + "" + this.orderModel.City + " " + this.orderModel.State + " " + this.orderModel.Pincode;
      stri1 = stri1.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      // var stri1 = this.orderModel.DeliveryAddress.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      var manualSAdd = this.addressModel.DeliveryStreetNumber + " " + this.addressModel.ShortStreetName + ", " + this.addressModel.City + " " + this.addressModel.State + " " + this.addressModel.Pincode;// + " " + this.addressModel.Country;
      manualSAdd = manualSAdd.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      var manualLAdd = this.addressModel.DeliveryStreetNumber + " " + this.addressModel.DeliveryStreetName + ", " + this.addressModel.City + " " + this.addressModel.State + " " + this.addressModel.Pincode;// + " " + this.addressModel.Country;
      manualLAdd = manualLAdd.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      // console.log(manualSAdd, stri1);
      if (manualSAdd != stri1 && manualLAdd != stri1) {
        if (this.addressModel.DeliveryStreetNumber != this.orderModel.DeliveryStreetNumber) {
          this.apiServices.showSnack('Invalid street no.'); this.commonServices.visibility = "hidden"; return;
        }
        if (this.addressModel.DeliveryStreetName.toString().trim().toLowerCase() != this.orderModel.DeliveryStreetName.toString().trim().toLowerCase() && this.addressModel.ShortStreetName.toString().trim().toLowerCase() != this.orderModel.DeliveryStreetName.toString().trim().toLowerCase()) {
          this.apiServices.showSnack('Invalid street name.'); this.commonServices.visibility = "hidden"; return;
        }
        if (this.addressModel.City.toString().trim().toLowerCase() != this.orderModel.City.toString().trim().toLowerCase()) {
          this.apiServices.showSnack('Invalid suburb.'); this.commonServices.visibility = "hidden"; return;
        }
        if (this.addressModel.Pincode != this.orderModel.Pincode) {
          this.apiServices.showSnack('Invalid postcode.'); this.commonServices.visibility = "hidden"; return;
        }
        if (this.addressModel.State.toString().trim().toLowerCase() != this.orderModel.State.toString().trim().toLowerCase()) {
          this.apiServices.showSnack('Invalid state.'); this.commonServices.visibility = "hidden"; return;
        }
      }
      else {
        await this.getSelectedLatLng(this.orderModel.DeliveryAddress);
      }
    }
    var list = {
      FirstName: controls['FirstName'].value,
      LastName: controls['LastName'].value,
      MobileNo: this.commonServices.validDigRep(controls['MobileNo'].value),
      CustomerId: controls['CustomerId'].value,
      EmailId: controls['EmailId'].value,
      MedicareNo: controls['MedicareNo'].value,
      Dob: dateString,
      Age: controls['Age'].value,
      MedicareValidTo: controls['MedicareValidTo'].value,
      OrderType: controls['OrderType'].value,
      IsPreferredPharmacy: controls['IsPreferredPharmacy'].value,
      IsConvenienceFee: controls['IsConvenienceFee'].value || 0,
      IsDeliveryFee: controls['IsDeliveryFee'].value || 0,
      IsDefault: controls['IsPreferredPharmacy'].value ? true : false,
      DeliveryByDate: this.datepipe.transform(controls['DeliveryByDate'].value, 'dd, MMM, y') || null,
      DeliveryByTime: controls['DeliveryByTime'].value || null,
      // DeliveryAddress: controls['DeliveryAddress'].value,
      // Latitude: controls['Latitude'].value,
      // City: controls['City'].value,
      // State: controls['State'].value,
      // Pincode: controls['Pincode'].value,
      // Longitude: controls['Longitude'].value,

      DeliveryAddress: this.orderModel.DeliveryAddress,// controls['DeliveryAddress'].value,
      Latitude: this.addressModel.lat,// controls['Latitude'].value,
      City: this.addressModel.City,// controls['City'].value,
      State: this.addressModel.State,// controls['State'].value,
      Pincode: this.addressModel.Pincode,//controls['Pincode'].value,
      Longitude: this.addressModel.lng,// controls['Longitude'].value,
      DeliveryUnit: this.addressModel.DeliveryUnit,// controls['DeliveryUnit'].value,
      DeliveryStreetNumber: this.addressModel.DeliveryStreetNumber,// controls['DeliveryStreetNumber'].value,
      DeliveryStreetName: this.addressModel.DeliveryStreetName,// controls['DeliveryStreetName'].value,



      // DeliveryUnit: controls['DeliveryUnit'].value,
      // DeliveryStreetNumber: controls['DeliveryStreetNumber'].value,
      // DeliveryStreetName: controls['DeliveryStreetName'].value,
      OrderTo: controls['OrderTo'].value || 0,
      PharmacyId: controls['PharmacyId'].value,
      IsOrderStatus: 6,
      CreatedBy: this.orderModel.CreatedBy,
      ConcessionNo: controls['ConcessionNo'].value,
      ConcessionValidTo: controls['ConcessionValidTo'].value,
      IsProcessOrder: controls['IsProcessOrder'].value,
      CustomerOffSet: new Date().getTimezoneOffset(),
      PharmacyNotes: controls['PharmacyNotes'].value,
    };

    if (list.IsProcessOrder == null) {
      list.IsProcessOrder = false;
    }

    if (list.IsPreferredPharmacy != null && list.IsPreferredPharmacy != "" && list.IsPreferredPharmacy) {
      list.IsDefault = true;
    }

    var model = {
      familyList: this.patientList,
      uploadList: this.loadedData,
      newOrder: list,
      webpushdata: {},
      upload: this.dataSourceUpload,
      customer: {}
    }

    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      if (this.validBy(list.PharmacyId, "Pharmacy name")) {
        return;
      }
      var filterby = this.pharmacyList.filter(function (val) { return val.PharmacyId == list.PharmacyId; });
      if (filterby.length > 0) {
        var flist = this.offsetList.filter(function (val) { return val.id == filterby[0].PharmacyOffSet; });
        if (flist.length > 0) {
          list.CustomerOffSet = flist[0].value;
        }
      }
    } else {
      list.PharmacyId = this.loginDetails.PharmacyId;
      list.CustomerOffSet = this.loginDetails.PharmacyOffSet;
    }

    if (this.validBy(list.FirstName, "First name")) { return; }

    if (this.validBy(list.LastName, "Last name")) { return; }

    var validby = this.commonServices.validByMobileNo(list.MobileNo);
    if (validby == 1) {
      this.apiServices.showSnack("Enter your mobile number");
      return;
    }
    if (validby == 3) {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }
    if (validby == 2) {
      if (list.MobileNo.charAt(0) != 0) { list.MobileNo = "0" + list.MobileNo; }
    } else {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }

    if (!list.IsProcessOrder && this.validBy(list.EmailId, "Email address")) { return; }

    if (!list.IsProcessOrder && list.EmailId != null && list.EmailId != "" && list.EmailId != undefined) {
      if (!this.commonServices.validByEmailNo(list.EmailId)) {
        this.apiServices.showSnack("Please enter a valid email address");
        return;
      }
    }

    if (enterdate == '') {
      list.Age = 0;
    } else {
      var notvaliddob = this.commonServices.isNotValidDob(enterdate);
      if (notvaliddob == 2) {
        this.apiServices.showSnack("Invalid DOB");
        return;
      }
      if (list.Dob == undefined || list.Dob == null || notvaliddob == true) {
        this.apiServices.showSnack("Invalid DOB");
        return;
      }

      var avalid = this.ageFromDOB(enterdate);
      list.Age = controls['Age'].value;
      if (!avalid || list.Age == undefined || list.Age == null) {
        this.apiServices.showSnack("Age greater than or equal 1 year. Invalid Dob.");
        return;
      }
    }
    if ((list.MedicareNo != undefined && list.MedicareNo != "" && list.MedicareNo != null) || (list.MedicareValidTo != undefined && list.MedicareValidTo != "" && list.MedicareValidTo != null)) {
      list.MedicareNo = this.commonServices.validDigRep(list.MedicareNo);
      var s = new String(list.MedicareNo);
      if (list.MedicareNo == null || s.trim() == "" || list.MedicareNo == undefined || list.MedicareNo == "0") {
        this.apiServices.showSnack("Medicare number is required");
        return;
      }
      if (list.MedicareNo.length < 11) {
        this.apiServices.showSnack("Invalid Medicare number");
        return;
      }

      var cmedino = list.MedicareNo;
      var isduplicate = this.TempdataSource.filter(function (val) { return val.MedicareNo == cmedino; });
      if (this.TempdataSource.length != 0 && isduplicate != null && isduplicate.length != 0) {
        this.apiServices.showSnack("Medicare number is duplicated");
        return;
      }

      if (list.MedicareValidTo == undefined || list.MedicareValidTo == "" || list.MedicareValidTo == null) {
        this.apiServices.showSnack("Medicare validity date is required");
        return;
      }

      var mval = this.commonServices.isNotValidExp(list.MedicareValidTo);
      if (list.MedicareValidTo == undefined || list.MedicareValidTo == "" || list.MedicareValidTo == null || mval == 2) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }

      if (mval == true) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }

      list.MedicareValidTo = this.commonServices.setValidDate(this.getValidToData(list.MedicareValidTo));
    }

    // if (list.ConcessionNo != undefined && list.ConcessionNo != "" && list.ConcessionNo != null && list.ConcessionNo.length != 15) {
    //   this.apiServices.showSnack("Invalid Concession No.");
    //   return;
    // }

    if ((list.ConcessionNo != undefined && list.ConcessionNo != "" && list.ConcessionNo != null) || (list.ConcessionValidTo != undefined && list.ConcessionValidTo != "" && list.ConcessionValidTo != null)) {
      list.ConcessionNo = this.commonServices.validDigRep(list.ConcessionNo);
      list.ConcessionNo = list.ConcessionNo.toUpperCase();
      if (list.ConcessionNo == undefined || list.ConcessionNo == "" || list.ConcessionNo == null) {
        this.apiServices.showSnack("Concession number is required");
        return;
      }

      if (list.ConcessionValidTo == undefined || list.ConcessionValidTo == "" || list.ConcessionValidTo == null) {
        this.apiServices.showSnack("Concession validity date is required");
        return;
      }

      var cval = this.commonServices.isNotValidExp(list.ConcessionValidTo);
      if (cval == true) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
      else if (cval == 2) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
      list.ConcessionValidTo = this.commonServices.setValidDate(this.getValidToData(list.ConcessionValidTo));
    }

    if (this.validBy(list.OrderType, "Order type")) { return; }

    var text = "Delivery address";
    if (list.OrderType == 2) { text = "Customer address"; }

    if (this.validBy(list.DeliveryAddress, text)) { return; }

    if (this.validMBy(list.DeliveryStreetNumber, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (this.validMBy(list.DeliveryStreetName, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (this.validMBy(list.City, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (list.OrderType == 1 || list.OrderType == 3) {
      if (this.validBy(list.DeliveryByDate, "Delivery date")) {
        return;
      }
      if (this.validBy(list.DeliveryByTime, "Delivery time")) { return; }
      if (list.DeliveryByTime == "Not Available Today") {
        this.apiServices.showSnack("Delivery time is invalid.");
        return;
      }
    }

    model.uploadList.forEach(element => {
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
      element.Price = 0;
    });

    model.familyList.forEach(element => {
      element.ConcessionValidTo = this.commonServices.setValidDate(this.getValidToData(element.ConcessionValidTo));
      element.MedicareValidTo = this.commonServices.setValidDate(this.getValidToData(element.MedicareValidTo));
    });

    if (model.upload == null || model.upload.length <= 0) {
      this.apiServices.showSnack("Please upload any one file");
      return;
    }

    model.customer = this.setSlots(list);

    model.webpushdata = this.commonServices.sendWebPush(model);
    this.saveBtn = true; this.commonServices.visibility = "shown";
    // console.log(model);
    this.apiServices.Post(model, this.url + "PlaceOrder").subscribe(res => {
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      if (res.Flag == 1) {
        this.commonServices.visibility = "hidden";
        this.router.navigate(['/app/masters/customers']);
      } else if (res.Flag == 3) {
        this.orderForm.get('DeliveryByDate').setValue(null); this.orderForm.get('DeliveryByTime').setValue(0);
        this.deliveryTimeSlots = [];
      }
      this.apiServices.showSnack(res.ErrorStr); this.saveBtn = false;
    }, error => {
      this.saveBtn = false; this.commonServices.visibility = "hidden";
      this.commonServices.customError(2); this.router.navigate(['/app/masters/customers']);
      this.cdRef.detectChanges();
    });
  }

  async payNow() {
    var dateString: any;
    // if (this.saveBtn) {
    //   this.apiServices.showSnack("Please wait loading...");
    //   return;
    // }
    const controls = this.orderForm.controls;
    let enterdate = '';
    if (controls['Dob'].value != '') {
      if (controls['Dob'].value.length > 8) {
        enterdate = controls['Dob'].value
      } else {
        enterdate = controls['Dob'].value[0] + controls['Dob'].value[1] + '/' + controls['Dob'].value[2] + controls['Dob'].value[3] + '/' + controls['Dob'].value[4] + controls['Dob'].value[5] + controls['Dob'].value[6] + controls['Dob'].value[7]
      }
      dateString = new Date(this.apiServices.changeFormate(enterdate));
    } else { dateString = null; }

    if (!this.createByList) { this.orderForm.get('IsPreferredPharmacy').setValue(true); }
    var deliveryadd = this.orderModel.DeliveryAddress; //controls['DeliveryAddress'].value;

    // if (deliveryadd != null && deliveryadd != "" && this.IsDelivery.toString().trim().toLowerCase() != deliveryadd.toString().trim().toLowerCase()) {
    //   await this.getSelectedLatLng(controls['DeliveryAddress'].value);
    // }
    if (deliveryadd != null && deliveryadd != "" && this.IsDelivery.toString().trim().toLowerCase() != this.orderModel.DeliveryAddress.toString().trim().toLowerCase() || (deliveryadd == null || deliveryadd == "")) {

      if (this.orderModel.DeliveryStreetNumber == '' || this.orderModel.DeliveryStreetNumber == undefined || this.orderModel.DeliveryStreetNumber == null) {

        this.apiServices.showSnack('Please enter a valid street no.'); return;
      }
      if (this.orderModel.DeliveryStreetName == '' || this.orderModel.DeliveryStreetName == undefined || this.orderModel.DeliveryStreetName == null) {
        this.apiServices.showSnack('Please enter a valid street name.'); return;
      }
      if (this.orderModel.City == '' || this.orderModel.City == undefined || this.orderModel.City == null) {
        this.apiServices.showSnack('Please enter a valid suburb.'); return;
      }
      if (this.orderModel.Pincode == '' || this.orderModel.Pincode == undefined || this.orderModel.Pincode == null) {
        this.apiServices.showSnack('Please enter a valid postcode.'); return;
      }
      if (this.orderModel.State == '' || this.orderModel.State == undefined || this.orderModel.State == null) {
        this.apiServices.showSnack('Please enter a valid state.'); return;
      }
      // await this.getSelectedLatLng(this.orderModel.DeliveryAddress);
      // this.commonServices.visibility = "shown";
      await this.getSelectedLatLng(this.orderModel.DeliveryAddress);
      var stri1 = this.orderModel.DeliveryStreetNumber + "" + this.orderModel.DeliveryStreetName + "" + this.orderModel.City + " " + this.orderModel.State + " " + this.orderModel.Pincode; // this.orderModel.DeliveryAddress.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      stri1 = stri1.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      var manualSAdd = this.addressModel.DeliveryStreetNumber + " " + this.addressModel.ShortStreetName + ", " + this.addressModel.City + " " + this.addressModel.State + " " + this.addressModel.Pincode;// + " " + this.addressModel.Country;
      manualSAdd = manualSAdd.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      var manualLAdd = this.addressModel.DeliveryStreetNumber + " " + this.addressModel.DeliveryStreetName + ", " + this.addressModel.City + " " + this.addressModel.State + " " + this.addressModel.Pincode;// + " " + this.addressModel.Country;
      manualLAdd = manualLAdd.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s/g, '').trim().toLowerCase();
      // console.log(manualSAdd, stri1);
      if (manualSAdd != stri1 && manualLAdd != stri1) {
        if (this.addressModel.DeliveryStreetNumber != this.orderModel.DeliveryStreetNumber) {
          this.apiServices.showSnack('Invalid street no.'); return;
        }
        if (this.addressModel.DeliveryStreetName.toString().trim().toLowerCase() != this.orderModel.DeliveryStreetName.toString().trim().toLowerCase() && this.addressModel.ShortStreetName.toString().trim().toLowerCase() != this.orderModel.DeliveryStreetName.toString().trim().toLowerCase()) {
          this.apiServices.showSnack('Invalid street name.'); return;
        }
        if (this.addressModel.City.toString().trim().toLowerCase() != this.orderModel.City.toString().trim().toLowerCase()) {
          this.apiServices.showSnack('Invalid suburb.'); return;
        }
        if (this.addressModel.Pincode != this.orderModel.Pincode) {
          this.apiServices.showSnack('Invalid postcode.'); return;
        }
        if (this.addressModel.State.toString().trim().toLowerCase() != this.orderModel.State.toString().trim().toLowerCase()) {
          this.apiServices.showSnack('Invalid state.'); return;
        }
      }
      else {
        await this.getSelectedLatLng(this.orderModel.DeliveryAddress);
      }
    }
    var list = {
      FirstName: controls['FirstName'].value,
      LastName: controls['LastName'].value,
      MobileNo: this.commonServices.validDigRep(controls['MobileNo'].value),
      CustomerId: controls['CustomerId'].value,
      EmailId: controls['EmailId'].value,
      MedicareNo: controls['MedicareNo'].value,
      Dob: dateString,
      Age: controls['Age'].value,
      MedicareValidTo: controls['MedicareValidTo'].value,
      OrderType: controls['OrderType'].value,
      IsPreferredPharmacy: controls['IsPreferredPharmacy'].value,
      IsConvenienceFee: controls['IsConvenienceFee'].value || 0,
      IsDeliveryFee: controls['IsDeliveryFee'].value || 0,
      IsDefault: controls['IsPreferredPharmacy'].value ? true : false,
      DeliveryByDate: this.datepipe.transform(controls['DeliveryByDate'].value, 'dd, MMM, y') || null,
      DeliveryByTime: controls['DeliveryByTime'].value || null,

      DeliveryAddress: this.orderModel.DeliveryAddress,// controls['DeliveryAddress'].value,
      Latitude: this.addressModel.lat,// controls['Latitude'].value,
      City: this.addressModel.City,// controls['City'].value,
      State: this.addressModel.State,// controls['State'].value,
      Pincode: this.addressModel.Pincode,//controls['Pincode'].value,
      Longitude: this.addressModel.lng,// controls['Longitude'].value,
      DeliveryUnit: this.addressModel.DeliveryUnit,// controls['DeliveryUnit'].value,
      DeliveryStreetNumber: this.addressModel.DeliveryStreetNumber,// controls['DeliveryStreetNumber'].value,
      DeliveryStreetName: this.addressModel.DeliveryStreetName,// controls['DeliveryStreetName'].value,

      // DeliveryAddress: controls['DeliveryAddress'].value,
      // Latitude: controls['Latitude'].value,
      // City: controls['City'].value,
      // State: controls['State'].value,
      // Pincode: controls['Pincode'].value,
      // Longitude: controls['Longitude'].value,
      // DeliveryUnit: controls['DeliveryUnit'].value,
      // DeliveryStreetNumber: controls['DeliveryStreetNumber'].value,
      // DeliveryStreetName: controls['DeliveryStreetName'].value,
      OrderTo: controls['OrderTo'].value || 0,
      PharmacyId: controls['PharmacyId'].value,
      IsOrderStatus: 6,
      CreatedBy: this.orderModel.CreatedBy,
      ConcessionNo: controls['ConcessionNo'].value,
      ConcessionValidTo: controls['ConcessionValidTo'].value,
      IsProcessOrder: controls['IsProcessOrder'].value,
      CustomerOffSet: new Date().getTimezoneOffset(),
      PharmacyNotes: controls['PharmacyNotes'].value,
    };

    if (list.IsProcessOrder == null) {
      list.IsProcessOrder = false;
    }

    if (list.IsPreferredPharmacy != null && list.IsPreferredPharmacy != "" && list.IsPreferredPharmacy) {
      list.IsDefault = true;
    }

    var model = {
      familyList: this.patientList,
      uploadList: this.loadedData,
      newOrder: list,
      webpushdata: {},
      ordersPaymentModel: {},
      customer: {}
    }

    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      if (this.validBy(list.PharmacyId, "Pharmacy name")) {
        return;
      }
      var filterby = this.pharmacyList.filter(function (val) { return val.PharmacyId == list.PharmacyId; });
      if (filterby.length > 0) {
        var flist = this.offsetList.filter(function (val) { return val.id == filterby[0].PharmacyOffSet; });
        if (flist.length > 0) {
          list.CustomerOffSet = flist[0].value;
        }
      }
    } else {
      list.PharmacyId = this.loginDetails.PharmacyId;
      list.CustomerOffSet = this.loginDetails.PharmacyOffSet;
    }

    if (this.validBy(list.FirstName, "First name")) { return; }

    if (this.validBy(list.LastName, "Last name")) { return; }

    var validby = this.commonServices.validByMobileNo(list.MobileNo);
    if (validby == 1) {
      this.apiServices.showSnack("Enter your mobile number");
      return;
    }
    if (validby == 3) {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }
    if (validby == 2) {
      if (list.MobileNo.charAt(0) != 0) { list.MobileNo = "0" + list.MobileNo; }
    } else {
      this.apiServices.showSnack("Invalid mobile number");
      return;
    }

    if (list.IsProcessOrder && list.EmailId != null && list.EmailId != "" && list.EmailId != undefined) {
      if (!this.commonServices.validByEmailNo(list.EmailId)) {
        this.apiServices.showSnack("Please enter a valid email address");
        return;
      }
    }

    if (enterdate == '') {
      list.Age = 0;
    } else {
      var notvaliddob = this.commonServices.isNotValidDob(enterdate);
      if (notvaliddob == 2) {
        this.apiServices.showSnack("Invalid DOB");
        return;
      }
      if (list.Dob == undefined || list.Dob == null || notvaliddob == true) {
        this.apiServices.showSnack("Invalid DOB");
        return;
      }

      var avalid = this.ageFromDOB(enterdate);
      list.Age = controls['Age'].value;
      if (!avalid || list.Age == undefined || list.Age == null) {
        this.apiServices.showSnack("Age greater than or equal 1 year. Invalid Dob.");
        return;
      }
    }
    if ((list.MedicareNo != undefined && list.MedicareNo != "" && list.MedicareNo != null) || (list.MedicareValidTo != undefined && list.MedicareValidTo != "" && list.MedicareValidTo != null)) {
      list.MedicareNo = this.commonServices.validDigRep(list.MedicareNo);
      var s = new String(list.MedicareNo);
      if (list.MedicareNo == null || s.trim() == "" || list.MedicareNo == undefined || list.MedicareNo == "0") {
        this.apiServices.showSnack("Medicare number is required");
        return;
      }
      if (list.MedicareNo.length < 11) {
        this.apiServices.showSnack("Invalid Medicare number");
        return;
      }
      var cmedino = list.MedicareNo;
      var isduplicate = this.TempdataSource.filter(function (val) { return val.MedicareNo == cmedino; });
      if (this.TempdataSource.length != 0 && isduplicate != null && isduplicate.length != 0) {
        this.apiServices.showSnack("Medicare number is duplicated");
        return;
      }

      if (list.MedicareValidTo == undefined || list.MedicareValidTo == "" || list.MedicareValidTo == null) {
        this.apiServices.showSnack("Medicare validity date is required");
        return;
      }

      var mval = this.commonServices.isNotValidExp(list.MedicareValidTo);
      if (list.MedicareValidTo == undefined || list.MedicareValidTo == "" || list.MedicareValidTo == null || mval == 2) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }

      if (mval == true) {
        this.apiServices.showSnack("Invalid Medicare validity date");
        return;
      }

      list.MedicareValidTo = this.commonServices.setValidDate(this.getValidToData(list.MedicareValidTo));
    }

    if ((list.ConcessionNo != undefined && list.ConcessionNo != "" && list.ConcessionNo != null) || (list.ConcessionValidTo != undefined && list.ConcessionValidTo != "" && list.ConcessionValidTo != null)) {
      list.ConcessionNo = this.commonServices.validDigRep(list.ConcessionNo);
      list.ConcessionNo = list.ConcessionNo.toUpperCase();
      if (list.ConcessionNo == undefined || list.ConcessionNo == "" || list.ConcessionNo == null) {
        this.apiServices.showSnack("Concession number is required");
        return;
      }
      if (list.ConcessionValidTo == undefined || list.ConcessionValidTo == "" || list.ConcessionValidTo == null) {
        this.apiServices.showSnack("Concession validity date is required");
        return;
      }
      var cval = this.commonServices.isNotValidExp(list.ConcessionValidTo);
      if (cval == true) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
      else if (cval == 2) {
        this.apiServices.showSnack("Invalid Concession validity date");
        return;
      }
      list.ConcessionValidTo = this.commonServices.setValidDate(this.getValidToData(list.ConcessionValidTo));
    }

    if (this.validBy(list.OrderType, "Order type")) { return; }

    var text = "Delivery address";
    if (list.OrderType == 2) { text = "Customer address"; }

    if (this.validBy(list.DeliveryAddress, text)) { return; }

    if (this.validMBy(list.DeliveryStreetNumber, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (this.validMBy(list.DeliveryStreetName, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (this.validMBy(list.City, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (list.OrderType == 1 || list.OrderType == 3) {
      if (this.validBy(list.DeliveryByDate, "Delivery date")) {
        return;
      }
      if (this.validBy(list.DeliveryByTime, "Delivery time")) { return; }
      if (list.DeliveryByTime == "Not Available Today") {
        this.apiServices.showSnack("Delivery time is invalid.");
        return;
      }
    }

    if (this.loadedData == null || this.loadedData.length <= 0) {
      this.commonServices.visibility = "hidden";
      this.apiServices.showSnack("Please add medicine details");
      return;
    }
    var totalpay = 0; var fixedotal = 0; var roundTotal = 0;
    if (this.validateBy(this.loadedData)) {
      model.uploadList.forEach(element => {
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
        totalpay = totalpay + element.Price;
        fixedotal = element.Price * (element.Quantity == null || element.Quantity == "" ? 0 : element.Quantity);
        roundTotal = roundTotal + fixedotal;
      });
      this.payNowAlert(totalpay, roundTotal, model, list);

    } else {
      this.apiServices.showSnack('Please check the order details');
    }
  }

  payNowAlert(totalpay, roundTotal, model, list) {
    this.commonServices.visibility = "shown"; var pid = this.loginDetails.PharmacyId;
    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) { pid = this.orderForm.controls['PharmacyId'].value; }
    this.apiServices.GetList("Pharmacy/GetListById?id=" + pid).subscribe((res: any) => {
      this.commonServices.visibility = "hidden";
      var ConvenienceFee = 0, DeliveryCharge = 0;
      if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5 || this.loginDetails.RoleId == 3) {
        ConvenienceFee = res.ConvenienceFee == null ? 0 : res.ConvenienceFee;
        DeliveryCharge = (res.CreateOrderDeliveryFee == null || res.CreateOrderDeliveryFee <= 0 ? (res.DeliveryCharge == null || res.DeliveryCharge <= 0 ? 4.99 : res.DeliveryCharge) : res.CreateOrderDeliveryFee);
      } else {
        list.PharmacyId = this.loginDetails.PharmacyId; ConvenienceFee = 0.99;
        list.CustomerOffSet = this.loginDetails.PharmacyOffSet; DeliveryCharge = 4.99;
      }

      if (list.OrderType == 3) {
        DeliveryCharge = res.LongDistanceDeliveryFee;
      }

      if (list.OrderType == 1 || list.OrderType == 3) {
        roundTotal = roundTotal + (list.IsConvenienceFee ? 0 : ConvenienceFee) + (list.IsDeliveryFee ? 0 : DeliveryCharge);
      } else {
        roundTotal = roundTotal + (list.IsConvenienceFee ? 0 : ConvenienceFee);
      }
      roundTotal = this.commonServices.preciseRound(roundTotal, 2);
      model.familyList.forEach(element => {
        element.ConcessionValidTo = this.commonServices.setValidDate(this.getValidToData(element.ConcessionValidTo));
        element.MedicareValidTo = this.commonServices.setValidDate(this.getValidToData(element.MedicareValidTo));
      });

      model.customer = this.setSlots(list);
      model.webpushdata = this.commonServices.sendWebPush(model);
      this.saveBtn = true;
      if (totalpay <= 0 && list.IsConvenienceFee && ((list.IsDeliveryFee && (list.OrderType == 1 || list.OrderType == 3)) || list.OrderType == 2)) {
        this.commonServices.visibility = "shown";
        this.apiMethod(model, "");
        return;
      }
      this.dialog.open(PaymentDialogComponent, {
        disableClose: true,
        data: { roundTotal },
        width: ' 45vh',
        height: 'auto'
      }).afterClosed().subscribe(res => {
        if (res.flag == true) {
          this.commonServices.visibility = "shown";
          model.ordersPaymentModel['Type'] = res.paymentData.type;
          model.ordersPaymentModel['CurrencyCode'] = 'AUD';
          model.ordersPaymentModel['CardFirstNo'] = res.cardDetails.number.substring(0, 4);
          model.ordersPaymentModel['LastFour'] = res.cardDetails.number.slice(-4);
          model.ordersPaymentModel['CardExpiryDate'] = res.Expiry;
          model.ordersPaymentModel['PackapillAmount'] = 0;
          model.ordersPaymentModel['PharmacyAmount'] = 0;
          model.ordersPaymentModel['PaymentToken'] = res.paymentData.id;
          model.ordersPaymentModel['TransactionId'] = 0;
          // payment and further code here
          // console.log(model);
          this.apiMethod(model, res.paymentData.id);
        } else {
          this.saveBtn = false
        }
      });
    }, error => {
      this.commonServices.visibility = "hidden";
    });
  }

  setSlots(list) {
    var newdate = new Date(); var deldate = new Date(list.DeliveryByDate);
    deldate.setHours(newdate.getHours());
    deldate.setMinutes(newdate.getMinutes());
    var list1 = {
      ClientDate: this.datepipe.transform(new Date(deldate), 'dd MMM yyyy hh:mm a'),
      CustomerOffSet: list.CustomerOffSet,
      PharmacyId: list.PharmacyId,
      cDate: new Date(),
      OrderType: list.OrderType,
    }
    return list1;
  }

  onManualKeyup(flag: any, e: any) {
    this.valueChange = true;
  }

  apiMethod(model, paymentToken) {
    this.apiServices.Post(model, this.url + 'Carer/' + "Post?paymentToken=" + paymentToken).subscribe(res => {
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      if (res.Flag == 1) {
        this.commonServices.visibility = "hidden";
        this.router.navigate(['/app/masters/customers']);
      } else if (res.Flag == 3) {
        this.orderForm.get('DeliveryByDate').setValue(null); this.orderForm.get('DeliveryByTime').setValue(0);
        this.deliveryTimeSlots = [];
      }
      this.apiServices.showSnack(res.ErrorStr); this.saveBtn = false;
    }, error => {
      this.saveBtn = false; this.commonServices.visibility = "hidden";
      this.apiServices.showSnack("Data failed to save");
      this.router.navigate(['/app/masters/customers']);
      this.cdRef.detectChanges();
    });
  }

  ageFromDOB(dob) {
    const controls = this.orderForm.controls;
    if (dob == "" || dob == null || dob == undefined) { return; }
    dob = dob.replace('_', '');
    let d = this.apiServices.changeFormate(dob);
    if (dob.length == 10) {
      if (d != 'no valid') {
        var fromdate = this.datepipe.transform(d, 'dd MMM, y');
      } else {
        this.orderForm.get('Age').setValue('');
        return false;
      }
      var fromdate = this.datepipe.transform(this.apiServices.changeFormate(dob), 'dd MMM, y');
      var now = new Date();
      var selDate = new Date(fromdate)
      var age = this.commonServices.setAge(now, selDate);
      if (age > 0) {
        this.orderForm.get('Age').setValue(age);
      } else {
        this.orderForm.get('Age').setValue('');
        return false;
      }
    } else {
      this.orderForm.get('Age').setValue('');
      return false;
    }
    return true;
  }

  resetBy() {
    this.patientList = []; this.TempdataSource = [];
    this.reset(); this.dataSource = new MatTableDataSource(this.TempdataSource); this.dataSourceUpload = []; this.prePharId = 0;
    this.loadedData = []; this.medicineList = []; this.tempMedicineList = []; this.editbyId = 0; this.pharmacyFlag = false;
    this.orderDatailList = []; this.deliveryTimeSlots = []; this.prescriptionDetailsDataSource = new TableDataSource([], PrescriptionModel);
    this.prescriptionDetailsDataSource.datasourceSubject.subscribe(personList => {
      this.prescriptionListChange.emit(personList);
      this.loadedData = personList;
    });
    this.orderForm.get('FirstName').setValue("");
    this.orderForm.get('LastName').setValue("");
    this.orderForm.get('EmailId').setValue("");
    this.orderForm.get('MedicareNo').setValue("");
    // this.orderForm.get('OrderType').setValue("0");
    // this.orderForm.get('Dob').setValue("");
    this.orderForm.get('MobileNo').setValue("");
    this.orderForm.get('IsPreferredPharmacy').setValue(false);
    this.orderForm.get('IsConvenienceFee').setValue(false);
    this.orderForm.get('IsDeliveryFee').setValue(false);
    this.orderForm.get('IsDefault').setValue(false);
    this.orderForm.get('OrderTo').setValue(false);
    this.orderForm.get('DeliveryAddress').setValue("");
    this.orderForm.get('DeliveryByDate').setValue(null);
    this.orderForm.get('DeliveryByTime').setValue(0);
    this.orderForm.get('ConcessionNo').setValue('');
    this.orderForm.get('ConcessionValidTo').setValue('');
    this.orderForm.get('MedicareValidTo').setValue('');
    this.orderForm.get('PharmacyNotes').setValue('');
    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      // this.orderForm.get('PharmacyId').setValue("0");
    }
    this.showPInfo = false;
  }

  preSelectDropDown(row) {
    if (this.patientList != null && this.patientList.length == 1) {
      var id = this.patientList[0].FamilyId;
      row.rowsSubject.value.forEach(element => {
        element.currentData.FamilyId = id;
      });
    }
    this.medicineList = [];
  }

  sendWebPush(res) {
    return {
      notification: {
        title: 'Hola Health',
        icon: 'https://www.holameds.com/wp-content/uploads/2020/03/favion.png',
        body: 'New Order ' + ' #' + res.OrderNo + ' Received',
        data: {
          "dateOfArrival": Date.now(),
          "primaryKey": 1,
          "url": this.getUrl(res.PharmacyId)
        },
        actions: [{
          "action": "Open",
          "title": "Hola Health"
        }]
      }
    };
  }

  getUrl(PharmacyId): string {
    let endUrl = 'prescription-orders';
    if (PharmacyId == 10002) {
      endUrl = 'test-orders';
    }
    if (environment.apiEndpoint === 'http://aapi.hlhlth.app/api') {
      return environment.portalURL1 + '' + endUrl;
    } else {
      return environment.portalURL1 + '' + endUrl;
    }
  }

  validBy(val, message) {
    var s = new String(val);
    if (val == null || s.trim() == "" || val == undefined || val == "0" || val == "Not Available") {
      this.apiServices.showSnack(message + " is required");
      return true;
    }
    return false;
  }

  validMBy(val, message) {
    var s = new String(val);
    if (val == null || s.trim() == "" || val == undefined || val == "0" || val == "Not Available") {
      this.apiServices.showSnack(message);
      return true;
    }
    return false;
  }

  autoCompletedLocation() {
    //set google maps defaults
    this.zoom = 4;
    //create search FormControl
    this.searchControl = new FormControl();
    this.IsDelivery = "";
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {

        componentRestrictions: { country: 'AUS' },
        types: [this.adressType]  // 'establishment' / 'address' / 'geocode'

      });
      autocomplete.addListener("place_changed", (val) => {
        this.ngZone.run(() => {
          //get the place result
          const place = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.zoom = 12;
          this.orderModel.Latitude = place.geometry.location.lat().toString();
          this.orderForm.get('Latitude').setValue(this.orderModel.Latitude);
          this.orderModel.Longitude = place.geometry.location.lng().toString();
          this.orderForm.get('Longitude').setValue(this.orderModel.Longitude);
          this.orderModel.DeliveryAddress = place['formatted_address'];
          this.orderForm.get('DeliveryAddress').setValue(this.orderModel.DeliveryAddress);
          this.orderModel.DeliveryUnit = this.commonServices.getUnit(place);
          // if (this.commonServices.getUnit(place) == '') {
          //   this.orderModel.DeliveryAddress = this.addressModel.DeliveryUnit + " " + this.orderModel.DeliveryAddress;
          // } else {
          //   this.orderModel.DeliveryUnit = this.commonServices.getUnit(place);
          //   this.addressModel.DeliveryUnit = this.orderModel.DeliveryUnit;
          //   // _that.orderForm.get('DeliveryUnit').setValue(_that.orderModel.DeliveryUnit);
          // }
          this.orderForm.get('DeliveryUnit').setValue(this.orderModel.DeliveryUnit);
          this.orderModel.DeliveryStreetNumber = this.commonServices.getStreetNumber(place);
          this.orderForm.get('DeliveryStreetNumber').setValue(this.orderModel.DeliveryStreetNumber);
          this.orderModel.DeliveryStreetName = this.commonServices.getStreetName(place);
          this.orderForm.get('DeliveryStreetName').setValue(this.orderModel.DeliveryStreetName);

          this.orderModel.Pincode = this.commonServices.getPostCode(place);
          this.orderForm.get('Pincode').setValue(this.orderModel.Pincode);

          this.orderModel.City = this.commonServices.getCity(place);
          this.orderForm.get('City').setValue(this.orderModel.City);

          this.orderModel.State = this.commonServices.getState(place);
          this.orderForm.get('State').setValue(this.orderModel.State);
          this.IsDelivery = this.orderModel.DeliveryAddress;
          this.addressModel.DeliveryUnit = this.orderModel.DeliveryUnit;
          this.addressModel.Pincode = this.commonServices.getPostCode(place);
          this.addressModel.City = this.commonServices.getCity(place);
          this.addressModel.State = this.commonServices.getState(place);
          this.addressModel.DeliveryStreetName = this.commonServices.getStreetName(place);
          this.addressModel.DeliveryStreetNumber = this.commonServices.getStreetNumber(place);
          this.addressModel.lat = place.geometry.location.lat();
          this.addressModel.lng = place.geometry.location.lng();
        });
      });
    });
  }

  validateBy(list) {
    var isValid = true;
    list.forEach(element => {
      element.Price = parseFloat(element.Price || 0);
      element.Quantity = parseInt(element.Quantity || 0);
      if (element.MedicineName == null || element.MedicineName == undefined || element.MedicineName.trim() === '' || element.Price == null || element.Price == undefined || element.Price === '') {
        isValid = false;
      }
      if ((element.Quantity == null || element.Quantity == undefined || element.Quantity == '' || element.Quantity <= 0)) {
        isValid = false;
      }
      if (element.FamilyId == null || element.FamilyId == undefined || element.FamilyId == '' && element.FamilyId <= 0) {
        isValid = false;
      }
      if (element.Repeats != null && element.Repeats != undefined && element.Repeats == 1) {
        if (element.TotalRepeats == null || element.TotalRepeats == undefined || element.TotalRepeats === '' || element.RemainingRepeats == null || element.RemainingRepeats === undefined
          || element.RemainingRepeats == "" || element.DaysRemaining == null || element.DaysRemaining == undefined || element.DaysRemaining == '') {
          isValid = false;
        }
      }
      element.OriginalPrice = element.Price;
    });
    return isValid;
  }

  createUrl(res) {
    let _that = this;
    branch.link({
      stage: 'Payment',
      data: {
        notificationData: res.notificationData,
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
      if (link) {
        _that.apiServices.Post(res, _that.url + 'sendSMSBy?id=' + res.notificationData.OrderId + "&link=" + link).subscribe(res => {
          console.log('sms sent');
        }, err => {
          this.commonServices.customError(1);
        });
      }
    });
  }

  createUrlWithOutSms(res) {
    let _that = this;
    branch.link({
      stage: 'Payment',
      data: {
        notificationData: res.notificationData,
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
      if (link) {
        _that.apiServices.Post(res, _that.url + 'sendCarerSMSBy?link=' + link).subscribe(res => {
          console.log('sms sent');
        });
      }
    });
  }

  setDecimal(index, price): any {
    this.setTableVal(index, price);
  }

  setTableVal(i: number, price: any) {
    let zero = 0;
    let p = +price;
    if (p > 0) {
      this.prescriptionDetailsDataSource.getRow(i).currentData.Price = p.toFixed(2);
    } else {
      this.prescriptionDetailsDataSource.getRow(i).currentData.Price = zero.toFixed(2);
    }
  }

  async getSelectedLatLng(address): Promise<any> {
    let _that = this;
    var lat = '';
    var lng = '';
    const geocoder = new google.maps.Geocoder();
    var request = {
      address: address,
      componentRestrictions: {
        country: 'au'
      }
    }
    await geocoder.geocode(request, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var cite = _that.commonServices.getCity(results[0]);
        if (cite != null && cite != undefined && cite != "" && address != null && address != undefined && address != "" && address.toLowerCase().indexOf(cite.toLowerCase()) == -1) {
          _that.orderModel.City = "";
          _that.orderForm.get('City').setValue(_that.orderModel.City);
          _that.apiServices.showSnack('Invalid City');
          return;
        }

        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        // console.log('Latitude: ' + lat + ' Logitude: ' + lng);
        _that.orderModel.Latitude = lat;
        _that.orderForm.get('Latitude').setValue(_that.orderModel.Latitude);
        _that.orderModel.Longitude = lng;
        _that.orderForm.get('Longitude').setValue(_that.orderModel.Longitude);
        _that.orderModel.DeliveryAddress = results[0]['formatted_address'];
        _that.orderForm.get('DeliveryAddress').setValue(_that.orderModel.DeliveryAddress);
        if (_that.commonServices.getUnit(results[0]) == '') {
          _that.orderModel.DeliveryAddress = _that.addressModel.DeliveryUnit + " " + _that.orderModel.DeliveryAddress;
        } else {
          _that.orderForm.get('DeliveryUnit').setValue(_that.orderModel.DeliveryUnit);
        }
        // _that.orderModel.DeliveryUnit = _that.commonServices.getUnit(results[0]);

        _that.orderModel.DeliveryStreetNumber = _that.commonServices.getStreetNumber(results[0]);
        _that.orderForm.get('DeliveryStreetNumber').setValue(_that.orderModel.DeliveryStreetNumber);
        _that.orderModel.DeliveryStreetName = _that.commonServices.getStreetName(results[0]);
        _that.orderForm.get('DeliveryStreetName').setValue(_that.orderModel.DeliveryStreetName);

        _that.orderModel.Pincode = _that.commonServices.getPostCode(results[0]);
        _that.orderForm.get('Pincode').setValue(_that.orderModel.Pincode);

        _that.orderModel.City = cite;
        _that.orderForm.get('City').setValue(_that.orderModel.City);

        _that.orderModel.State = _that.commonServices.getState(results[0]);
        _that.orderForm.get('State').setValue(_that.orderModel.State);
        _that.addressModel.Pincode = _that.orderModel.Pincode;
        _that.addressModel.City = _that.orderModel.City;
        _that.addressModel.State = _that.orderModel.State;
        _that.addressModel.DeliveryStreetNumber = _that.orderModel.DeliveryStreetNumber;
        _that.addressModel.Country = _that.commonServices.getAutoCountry(results[0]);
        _that.addressModel.lat = lat;
        _that.addressModel.lng = lng;
        _that.addressModel.DeliveryUnit = _that.orderModel.DeliveryUnit;
        _that.addressModel.DeliveryStreetName = _that.orderModel.DeliveryStreetName;
        // _that.addressModel.LongStreetName = _that.commonServices.getStreetName(results[0]);
        _that.addressModel.ShortStreetName = _that.commonServices.getStreetshortName(results[0]);
        console.log('address model inside ', _that.addressModel);


      } else {
        _that.orderModel.DeliveryAddress = "";
        // _that.addressModel.Pincode = "";
        // _that.addressModel.City = "";
        // _that.addressModel.State = "";
        // _that.addressModel.DeliveryStreetName = "";
        // _that.addressModel.DeliveryStreetNumber = "";
        _that.orderForm.get('DeliveryAddress').setValue(_that.orderModel.DeliveryAddress);
      }
    });
  }
  async getTempAddress(address): Promise<any> {
    let _that = this;
    var lat = '';
    var lng = '';
    const geocoder = new google.maps.Geocoder();
    var request = {
      address: address,
      componentRestrictions: {
        country: 'au'
      }
    }
    await geocoder.geocode(request, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        _that.addressModel.Pincode = _that.commonServices.getPostCode(results[0]);
        _that.addressModel.City = _that.commonServices.getCity(results[0]);
        _that.addressModel.State = _that.commonServices.getState(results[0]);
        _that.addressModel.DeliveryStreetName = _that.commonServices.getStreetName(results[0]);
        _that.addressModel.DeliveryStreetNumber = _that.commonServices.getStreetNumber(results[0]);
        _that.addressModel.Country = _that.commonServices.getAutoCountry(results[0]);
        _that.addressModel.ShortStreetName = _that.commonServices.getStreetshortName(results[0]);
        _that.addressModel.DeliveryUnit = _that.commonServices.getUnit(results[0]);
        _that.addressModel.lat = results[0].geometry.location.lat();
        _that.addressModel.lng = results[0].geometry.location.lng();
        _that.commonServices.visibility = "hidden";
      } else {
        _that.orderModel.DeliveryAddress = ""; _that.commonServices.visibility = "hidden";
        _that.orderForm.get('DeliveryAddress').setValue(_that.orderModel.DeliveryAddress);
      }
    });
  }

}