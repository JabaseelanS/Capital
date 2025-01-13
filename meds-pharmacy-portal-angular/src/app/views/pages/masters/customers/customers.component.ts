import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiServices } from '../../../../views/services/api.services';
import { SubheaderService } from '../../../../core/_base/layout';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, PageEvent } from '@angular/material';
import { CustomerDialogComponent } from '../../dialogs/customer-dialog/customer-dialog.component';
import { RepeatListComponent } from '../../dialogs/repeat-list/repeat-list.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonServices } from '../../../../../app/views/services/common';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { LoaderService } from '../../../../views/services/loader.service';

@Component({
  selector: 'pp-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  url = 'PharmacyCustomer/'
  loginDetails: any;
  customerdata: any;
  pharmacyList: any = [];
  Customerlist: any = [];
  searchGlb = "";
  totalLength = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  pageEvent: PageEvent;
  length: number;
  lowValue: number = 0;
  highValue: number = 10;
  isRole = false;
  displayedColumns = ['LastName', 'FirstName', 'Mobileno', 'Email', 'Actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private apiService: ApiServices,
    private cdRef: ChangeDetectorRef,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public commonServices: CommonServices,
    private _subheaderService: SubheaderService,
    private dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private loaderService: LoaderService
  ) {
    this.loginDetails = JSON.parse(localStorage.getItem("userdetails"));
  }

  ngOnInit() {
    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      this.isRole = true;
    }
    this.commonServices.visibility = "shown";
    this._subheaderService.setTitle("Customers List");
    this.loadcustomer();
    console.log(this.loginDetails.PharmacyId);
    this.apiService.custIdByGobal = 0; this.apiService.phIdByGobal = 0;
  }

  applyFilter(value, flag) {
    this.pageSize = this.customerdata.length; // 8;
    if (value == undefined || value == null || value == "") {
      var prescriptionDataSource = this.customerdata;
      this.Customerlist = prescriptionDataSource.slice(0, this.pageSize);
      if (prescriptionDataSource.length > 100) {
        this.pageSizeOptions.push(prescriptionDataSource.length);
      }
    } else {
      var filter = this.customerdata.filter(function (val) {
        if (val.FirstName != null || val.LastName != null || val.EmailId != null || val.Mobileno != null) {
          return val.Mobileno.toLowerCase().indexOf(value.trim().toLowerCase()) != -1 || val.FirstName.toLowerCase().includes(value.trim().toLowerCase()) != false || val.LastName.toLowerCase().includes(value.trim().toLowerCase()) != false || val.EmailId.toLowerCase().includes(value.trim().toLowerCase()) != false
        }
      });
      this.Customerlist = filter.slice(0, this.pageSize);
      this.length = filter.length;
      this.setPagin(this.length);
      if (this.length > 100) {
        this.pageSizeOptions.push(filter.length);
      }
    }
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

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  createOrder(model) {
    this.searchGlb = "";
    if (model != null) {
      this.apiService.custIdByGobal = model.CustomerId; this.apiService.phIdByGobal = model.PharmacyId;
    } else {
      this.apiService.custIdByGobal = null; this.apiService.phIdByGobal = null;
    }
    // this.router.navigate(['/app/masters/order-create-V2'], { skipLocationChange: true, relativeTo: this.activatedRoute, queryParams: { id: model.CustomerId } });
    this.router.navigate(['/app/masters/order-create-V2/new']);
  }

  viewProfile() {

  }

  loadcustomer() {
    var grpid = this.loginDetails.PharmacyId;
    if (this.loginDetails.RoleId == 2) {
      grpid = this.loginDetails.PharmacyGrpId;
    }
    this.apiService.GetList(this.url + 'GetListByPharmacy?id=' + grpid + "&roleid=" + this.loginDetails.RoleId + "&phadminid=" + this.loginDetails.UserId).subscribe((res: any) => {
      this.setInit(res);
    }, err => {
      console.log(err);
      this.commonServices.customError(1);
      this.commonServices.visibility = "hidden";
    });
  }

  setInit(res) {
    this.pharmacyList = res.pharmacylist;
    this.customerdata = res.objList; this.Customerlist = res.objList;
    console.log(this.customerdata);
    this.dataSource = new MatTableDataSource(res.objList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalLength = res.objList.length;
    this.commonServices.visibility = "hidden";
  }

  openScriptDialog(cModel) {
    this.commonServices.visibility = "shown";
    this.apiService.GetList('AppRepeats/GetListByPortal?customerid=' + cModel.CustomerId + "&pharmacyid=" + cModel.PharmacyId + "&name=" + cModel.CustomerFullname).subscribe((response: any) => {
      this.commonServices.visibility = "hidden";
      this.dialogRPop(response, cModel);
    }, error => {
    });
  }

  openCusDialog(cModel) {
    var that = this;
    if (cModel != null) {
      this.commonServices.visibility = "shown";
      var url = "CreateNewOrder/GetPharmacyByCustomerById?cusid=" + cModel.CustomerId;
      this.apiService.GetList(url).subscribe((res: any) => {
        res.PharmacyId = cModel.PharmacyId;
        res.MobileNo = res.Mobileno; res.PreferredPharmacyId = cModel.PharmacyId; res.EmailId = res.Email; this.commonServices.visibility = "hidden";
        this.dialogPop(res, that);
      }, err => {
        this.commonServices.customError(1);
      });
    } else {
      this.dialogPop(null, that);
    }
  }

  dialogRPop(value, cModel) {
    this.dialog.open(RepeatListComponent, {
      data: {
        value, cModel
      },
      disableClose: true,
      height: 'auto',
      width: '980px'
      // maxHeight: '560px'
    }).afterClosed().subscribe(async res => {
    });
  }

  dialogPop(value, that) {
    this.dialog.open(CustomerDialogComponent, {
      data: {
        model: value, plist: that.pharmacyList
      },
      disableClose: true,
      height: 'auto',
      maxHeight: '560px'
    }).afterClosed().subscribe(async res => {
      if (res != null) {
        that.searchGlb = ""; that.setInit(res.list);
      }
    });
  }

  blockUser(value) {
    const title: string = 'Block Customer';
    const description: string = 'Are you sure you want to block this Customer?';
    const waitDesciption: string = 'Customer is being blocked...';
    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        value.RoleId = this.loginDetails.RoleId; value.phadminid = this.loginDetails.UserId; this.commonServices.visibility = 'shown';
        this.apiService.Post(value, this.url + "BlockByCustomerId").subscribe(res => {
          if (res.flag) {
            this.setInit(res.list);
          }
          this.commonServices.visibility = "hidden"; this.apiService.showSnack(res.msg);
        },);
      }
    })
  }
}
