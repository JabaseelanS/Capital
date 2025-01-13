import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { ApiServices } from '../../../../views/services/api.services';
import { PharmacyUserModel } from '../../modals/pharmacy-user.model';
import { GlobalConstant } from '../../globals/globalvariables';
import { SubheaderService } from '../../../../core/_base/layout';
import { PharmacyUserGroupCreateComponent } from './pharmacy-user-group-create/pharmacy-user-group-create.component';
import { LoaderService } from '../../../../views/services/loader.service';
import { CommonServices } from '../../../services/common';
import { PageEvent } from '@angular/material';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'pp-pharmacy-group-user',
  templateUrl: './pharmacy-user-group.component.html',
  styleUrls: ['./pharmacy-user-group.component.scss']
})
export class PharmacyUserGroupComponent implements OnInit {

  url = 'PharmacyGroupUser/';

  // Table fields
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['FirstName', 'UserName',
    'UserEmail', 'Mobileno', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('searchkey', { static: true }) searchKey;

  // Subscriptions
  private subscriptions: Subscription[] = [];
  isLoading = true;
  totalLength = 0;
  usersData: any;
  pharmacyList = [];
  PharmacyUserList = [];
  TempPharmacyUserList = [];
  lowValue: number = 0;
  highValue: number = 10;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  pageEvent: PageEvent;
  length: number;
  userdetails: any;
  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private subheaderService: SubheaderService,
    private apiServices: ApiServices,
    public commonServices: CommonServices,
    private dialog: MatDialog, private loaderService: LoaderService, private cdRef: ChangeDetectorRef,
  ) {
    this.commonServices.visibility = "shown";
  }

  /**
   * On init
   */
  ngOnInit() {
    this.userdetails = JSON.parse(localStorage.getItem("userdetails"));
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Pharmacy Admin');
    // Init DataSource
    this.loadUsersList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  loadUsersList() {
    var api = "GetList?id=" + this.userdetails.PharmacyId;
    if (this.userdetails.RoleId == 1) {
      api = "GetListByAdmin";
    } else if (this.userdetails.RoleId == 5) {
      api = "GetListByPHAdmin";
    }
    this.apiServices.GetList(this.url + api).subscribe((response: any) => {
      this.loadDataSource(response, response.pharmacyList);
      this.commonServices.visibility = "hidden";
    }, error => {
      this.commonServices.customError(1);
      this.commonServices.visibility = "hidden";
    });
  }

  loadDataSource(response, plist) {
    this.usersData = response.list; this.pharmacyList = plist;
    this.PharmacyUserList = response.list;
    this.TempPharmacyUserList = response.list;
    // this.cdRef.detectChanges();
  }

  applyFilter(value, flag) {
    this.pageSize = this.TempPharmacyUserList.length; // 8;
    if (value == undefined || value == null || value == "") {
      var pharmDataSource = this.TempPharmacyUserList;
      this.PharmacyUserList = pharmDataSource.slice(0, this.pageSize);
      if (pharmDataSource.length > 100) {
        this.pageSizeOptions.push(pharmDataSource.length);
      }
    } else {
      var filter = this.TempPharmacyUserList.filter(function (val) {
        if (val.FirstName != null && val.LastName != null && val.UserName != null && val.Mobileno != null) {
          return val.FirstName.toLowerCase().includes(value.trim().toLowerCase()) != false || val.LastName.toLowerCase().includes(value.trim().toLowerCase()) != false || val.UserName.toLowerCase().includes(value.trim().toLowerCase()) != false || val.Mobileno.toLowerCase().indexOf(value.trim().toLowerCase()) != -1
        }
      });
      this.PharmacyUserList = filter.slice(0, this.pageSize);
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

  getFilteredData(userType: string): void {
    const data = [];
    if (userType === 'All') {
      this.dataSource.data = this.usersData;
    } else {
      this.usersData.forEach((element: any) => {
        if (element.userType === userType) {
          data.push(element);
        }
      });
      this.dataSource.data = data;
    }
  }

  deleteUser(item: PharmacyUserModel) {
    const title: string = 'User Delete';
    const description: string = 'Are you sure you want to delete this user?';
    const waitDesciption: string = 'User is being deleted...';

    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.apiServices.GetList(this.url + "DeleteById?id=" + item.UserId).subscribe(res => {
          this.apiServices.showSnack(GlobalConstant.deleted);
          this.loadUsersList();
          this.searchKey.nativeElement.value = '';
        }, error => {
          this.commonServices.customError(5);
          this.apiServices.showSnack(GlobalConstant.delete);
        });
      } else {
        return;
      }
    });
  }

  editUser(user) {
    var pharmacyList = this.pharmacyList;
    this.dialog.open(PharmacyUserGroupCreateComponent, {
      data: { user, pharmacyList },
      disableClose: true,
      height: 'auto',
      width: '80%'
    }).afterClosed().subscribe(res => {
      if (res != null && res.list != null) {
        this.loadDataSource(res.list, res.list.pharmacyList);
        this.searchKey.nativeElement.value = '';
        this.apiServices.showSnack(res.ErroMessage); this.cdRef.detectChanges();
      }
    })
  }

}
