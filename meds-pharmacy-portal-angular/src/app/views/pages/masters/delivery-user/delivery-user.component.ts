import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { ApiServices } from '../../../services/api.services';
import { PharmacyUserModel } from '../../modals/pharmacy-user.model';
import { GlobalConstant } from '../../globals/globalvariables';
import { SubheaderService } from '../../../../core/_base/layout';
import { DeliveryUserCreateComponent } from './delivery-user-create/delivery-user-create.component';
import { LoaderService } from '../../../services/loader.service';
import { CommonServices } from '../../../services/common';

@Component({
  selector: 'pp-delivery-user',
  templateUrl: './delivery-user.component.html',
  styleUrls: ['./delivery-user.component.scss']
})
export class DeliveryUserComponent implements OnInit {

  url = 'DeliveryUser/';

  // Table fields
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['FirstName', 'UserName', 'UserDob',
    'UserEmail', 'Mobileno', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  // Subscriptions
  private subscriptions: Subscription[] = [];
  isLoading = true;
  totalLength = 0;
  usersData: any;
  pharmacyList = [];

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private subheaderService: SubheaderService,
    private apiServices: ApiServices,
    private commonServices: CommonServices,
    private dialog: MatDialog, private loaderService: LoaderService
  ) {
    this.commonServices.visibility = "shown";
  }

  /**
   * On init
   */
  ngOnInit() {
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Delivery User');
    // Init DataSource
    this.loadUsersList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  loadUsersList() {
    this.apiServices.GetList(this.url + "GetList").subscribe((response: any) => {
      this.loadDataSource(response);
      this.commonServices.visibility = "hidden";
    }, error => {
      this.commonServices.customError(1);
      this.commonServices.visibility = "hidden";
    });
  }

  loadDataSource(response) {
    this.usersData = response.list; this.pharmacyList = response.pharmacyList;
    this.dataSource = new MatTableDataSource(response.list);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalLength = response.list.length;
  }

  applyFilter(value, flag) {
    if (flag) {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    } else {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
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
    const description: string = 'Are you sure to delete this user?';
    const waitDesciption: string = 'User is deleting...';

    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.spinner.show();
        this.loaderService.display(true);
        this.apiServices.GetList(this.url + "DeleteById?id=" + item.UserId).subscribe(res => {
          this.apiServices.showSnack(GlobalConstant.deleted);
          this.loadDataSource(res);
        }, error => {
          // this.spinner.hide();
          this.loaderService.display(false);
          this.commonServices.customError(5);
        });
      } else {
        return;
      }
    });
  }

  editUser(user) {
    var pharmacyList = this.pharmacyList;
    this.dialog.open(DeliveryUserCreateComponent, {
      data: { user, pharmacyList },
      disableClose: true,
      height: 'auto',
      width: '80%'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadDataSource(res);
      }
      this.commonServices.visibility = "hidden";
    })
  }

}
