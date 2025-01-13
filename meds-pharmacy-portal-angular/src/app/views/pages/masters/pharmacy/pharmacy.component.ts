import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiServices } from '../../../services/api.services';
import { CommonServices } from '../../../services/common';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { PharmacyDialogComponent } from '../../dialogs/pharmacy-dialog/pharmacy-dialog.component';
import { SubheaderService } from '../../../../core/_base/layout';
import { PharmacyModel } from '../../modals/pharmacy-model';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConstant } from '../../globals/globalvariables';
import { LoaderService } from '../../../../views/services/loader.service';
import { PageEvent } from '@angular/material';
import { TransferFundDialogComponent } from '../../dialogs/transfer-fund-dialog/transfer-fund-dialog.component';
import { OrderStatusDialogComponent } from '../../dialogs/orderstatus-dialog/orderstatus-dialog.component';

@Component({
  selector: 'pp-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.scss']
})
export class PharmacyComponent implements OnInit {
  url = "Pharmacy/";
  displayedColumns = ['PharmacyName', 'State', 'Email', 'Country', 'actions'];
  dataSource: MatTableDataSource<any>;
  totalLength = 0;
  pharmacyModel: PharmacyModel;
  tempPharmacyGrp: any;
  stateList = [];
  countryList = [];
  pharmacyGroup = [];
  pharmacyservingList = [];
  PharmacyList = [];
  TempPharmacyList = [];
  lowValue: number = 0;
  highValue: number = 10;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  pageEvent: PageEvent;
  length: number;
  userdetails: any;
  OffSetList = [];
  DDReasonList = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('searchkey', { static: true }) searchKey;
  constructor(
    private apiService: ApiServices,
    private commonServices: CommonServices,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private _subheaderService: SubheaderService,
  ) {
    this.commonServices.visibility = "shown";
  }

  ngOnInit() {
    // var encodedStringBtoA = decodeURIComponent(atob("cGhhcm1hY3kycGFwJTQwZ21haWwuY29t"));
    this._subheaderService.setTitle("Pharmacy");
    this.userdetails = JSON.parse(localStorage.getItem("userdetails"));
    this.loadData();
  }

  async loadData() {
    this.stateList = this.commonServices.getStatesList();
    this.countryList = this.commonServices.getCountryList();
    this.apiService.GetList(this.url + 'GetList?phadminid=' + this.userdetails.UserId + "&roleid=" + this.userdetails.RoleId).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.pharmacy_list);
      this.PharmacyList = res.pharmacy_list; this.OffSetList = res.offsetList;
      this.DDReasonList = res.DDdeactivate_list;
      this.TempPharmacyList = res.pharmacy_list;
      // this.totalLength = res.pharmacy_list.length;
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      this.pharmacyGroup = res.pharmacygroup_list;
      this.pharmacyservingList = res.pharmacyserve_list;
      this.cdRef.detectChanges();
      // this.spinner.hide();
      //this.setPharmServing(this.dataSource.data, res.pharmacyserve_list);
      //console.log(this.dataSource);
      this.commonServices.visibility = "hidden";
    }, err => {
      this.commonServices.customError(1);
      this.commonServices.visibility = "hidden";
    });
  }

  applyFilter(value, flag) {
    console.log(value);
    this.pageSize = this.TempPharmacyList.length; // 8;
    if (value == undefined || value == null || value == "") {
      var pharmDataSource = this.TempPharmacyList;
      this.PharmacyList = pharmDataSource.slice(0, this.pageSize);
      if (pharmDataSource.length > 100) {
        this.pageSizeOptions.push(pharmDataSource.length);
      }
    } else {
      var filter = this.TempPharmacyList.filter(function (val) {
        if (val.PharmacyName != null && val.Email1 != null) {
          return val.PharmacyName.toLowerCase().includes(value.trim().toLowerCase()) != false || val.Email1.toLowerCase().includes(value.trim().toLowerCase()) != false
        }
      });
      this.PharmacyList = filter.slice(0, this.pageSize);
      this.length = filter.length;
      this.setPagin(this.length);
      if (this.length > 100) {
        this.pageSizeOptions.push(filter.length);
      }
    }
  }

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  setPagin(evd) {
    var eve = {
      previousPageIndex: 1,
      pageIndex: 0,
      pageSize: 10,
      length: evd
    }
    this.paginator.firstPage();
    this.getPaginatorData(eve);
  }

  findByState(id) {
    var filter = this.stateList.filter(function (val) { return val.id == id });
    if (filter.length > 0) {
      return filter[0].name;
    }
    return "";
  }

  findByCountry(id) {
    var filter = this.countryList.filter(function (val) { return val.id == id });
    if (filter.length > 0) {
      return filter[0].name;
    }
    return "";
  }

  transferFund(tansData: any) {
    var that = this;
    this.dialog.open(TransferFundDialogComponent, {
      data: tansData,
      disableClose: true,
      width: '550px',
      height: 'auto',
    }).afterClosed().subscribe(res => {
      if (res != null) {
        that.apiService.showSnack(res.ErroMessage);
      }
    })
  }

  editPharmacy(pharmacy: any) {
    this.commonServices.visibility = "shown";
    this.apiService.GetList(this.url + 'GetListByPHId?id=' + pharmacy.PharmacyId).subscribe((res: any) => {
      this.AddPharmacy(pharmacy, res);
    }, err => {
      this.commonServices.visibility = "hidden";
    });
  }

  AddPharmacy(pharmacy, result) {
    var filter = this.pharmacyservingList.filter(function (val) { return val.PharmacyId == pharmacy.PharmacyId });
    if (result != null) { pharmacy = result; }
    if (filter.length > 0) {
      var filter1 = filter.filter(function (val) { return val.AvailableServices == 1 });
      pharmacy['pharmacyserve_list'] = filter1;
      var filter2 = filter.filter(function (val) { return val.AvailableServices == 2 });
      pharmacy['pharmacyserve_list2'] = filter2;
    }
    // this.router.navigate(['/app/masters/customer/edit/' + customer.Id]);
    pharmacy['pharmacyGroup'] = this.pharmacyGroup;
    pharmacy['OffSetList'] = this.OffSetList;
    pharmacy['DDReasonList'] = this.DDReasonList;
    this.commonServices.visibility = "hidden";
    this.dialog.open(PharmacyDialogComponent, {
      data: pharmacy,
      disableClose: true,
      // hasBackdrop: false,
      height: 'auto',
    }).afterClosed().subscribe(async res => {
      if (res != null && res.list != null) {
        this.searchKey.nativeElement.value = '';
        this.PharmacyList = res.list.pharmacy_list;
        this.TempPharmacyList = res.list.pharmacy_list;
        this.pharmacyGroup = res.list.pharmacygroup_list;
        this.pharmacyservingList = res.list.pharmacyserve_list;
        this.apiService.showSnack(res.model.ErroMessage); this.cdRef.detectChanges();
      }
    });
  }

  deletePharmacy(pharmacy: any): void {
    // this.spinner.show();
    this.loaderService.display(true);
    // debugger;
    if (pharmacy.pharmacyserve_list.length) {
      pharmacy.pharmacyserve_list.forEach(element => {
        element.IsActive = false;
      });
      this.apiService.Post(pharmacy.pharmacyserve_list, this.url + 'Schedule').subscribe(res => {
        this.deletePharm(pharmacy);
      }, err => {
        // this.spinner.hide();
        this.commonServices.customError(2);
        this.loaderService.display(false);
      });
    } else {
      this.deletePharm(pharmacy);
    }
  }

  deletePharm(pharmacy: any) {
    this.apiService.Delete(this.url + pharmacy.PharmacyId).subscribe(res => {
      this.apiService.showSnack(GlobalConstant.deleted);
      this.dataSource = new MatTableDataSource(res.pharmacy_list);
      this.totalLength = res.pharmacy_list.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.pharmacyGroup = res.pharmacygroup_list
      this.pharmacyservingList = res.pharmacyserve_list;
      // this.spinner.hide();
      this.loaderService.display(false);
      //this.setPharmServing(this.dataSource.data, res.pharmacyserve_list);
    }, err => {
      this.commonServices.customError(5);
      // this.spinner.hide();
      this.loaderService.display(false);
    })
  }

  CheckToggleDD(value) {
    var cls = (this.userdetails.RoleId == 1 ? ' class-enable1-repeat' : ' class-disabled1-repeat');
    if (value.IsDD == true && value.IsDDOnline == true) {
      return "DDActiveOnline" + cls;
    }
    else if (value.IsDD == true && value.IsDDOnline == false) {
      return "DDActive class-enable1-repeat" + cls;
    }
    else if (value.IsDD == false && value.IsDDOnline == false) {
      return "DDFail class-enable1-repeat" + cls;

    }
  }

  CheckToggleUe(value) {
    var cls = (this.userdetails.RoleId == 1 ? ' class-enable1-repeat' : ' class-disabled1-repeat');
    if (value.IsUE == true && value.IsUEOnline == true) {
      return "UeActiveOnline" + cls;
    }
    else if (value.IsUE == true && value.IsUEOnline == false) {
      return "UeActive" + cls;
    }
    else if (value.IsUE == false && value.IsUEOnline == false) {
      return "UeFail" + cls;

    }
  }

  changeDDUE(value, i, e) {
    if (i == 1) {
      if (value.IsDDOnline) {
        e.source.checked = true;
        this.dialog.open(OrderStatusDialogComponent, {
          data: { DDReasonList: this.DDReasonList, DDflag: true },
          disableClose: true,
          height: 'auto',
          width: '450px'
        }).afterClosed().subscribe(async res => {
          if (res != null && res != 0) {
            this.commonServices.visibility = "shown";
            value.DDOnlineReasonId = res;
            value.IsDDOnline = !value.IsDDOnline;
            value.IsDD = !value.IsDD;
            this.post(value);
            this.cdRef.detectChanges();
          }
        });
      }
      else if (value.IsDDOnline == false && value.IsDD == true) {
        value.IsDD = !value.IsDD;
        this.post(value);
      }
    }
    else {
      value.IsUE = !value.IsUE;
      if (value.IsUEOnline) { value.IsUEOnline = !value.IsUEOnline; }
      this.post(value);
    }
  }

  post(value) {
    this.commonServices.visibility = "shown";
    var index = this.PharmacyList.findIndex(x => x.PharmacyId == value.PharmacyId);
    this.apiService.Post(value, this.url + "Post").subscribe(res => {
      if (res != null) {
        this.PharmacyList[index] = res.model;
        this.apiService.showSnack(res.model.ErroMessage);
        this.cdRef.detectChanges();
        this.commonServices.visibility = "hidden";
      }
    },
      (error: any) => {
        this.commonServices.visibility = "hidden";
        this.apiService.showSnack(GlobalConstant.savefail);
      }
    )
  }

}