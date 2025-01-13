import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiServices } from '../../../services/api.services';
import { CommonServices } from '../../../services/common';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSpinner } from '@angular/material';
import { PharmacyGroupsDialogComponent } from '../../dialogs/pharmacy-groups-dialog/pharmacy-group-dialog.component';
import { SubheaderService } from '../../../../core/_base/layout';
import { GlobalConstant } from '../../globals/globalvariables';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from '../../../../views/services/loader.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'pp-pharmacy-group',
  templateUrl: './pharmacy-groups.component.html',
  styleUrls: ['./pharmacy-groups.component.scss']
})
export class PharmacyGrpListComponent implements OnInit {

  url = "PharmacyGroups/";
  userdetails: any;
  displayedColumns = ['PharmacyGroupName', 'CreatedOn', 'Contact', 'Email', 'Phone', 'actions'];
  dataSource: MatTableDataSource<any>;
  totalLength = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('searchkey', { static: true }) searchKey;
  PharmacyGrpList = [];
  lowValue: number = 0;
  highValue: number = 10;
  TempPharmacyGrpList = [];
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  pageEvent: PageEvent;
  length: number;
  constructor(
    private apiService: ApiServices,
    public commonServices: CommonServices,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _subheaderService: SubheaderService,
    private spinner: NgxSpinnerService,
    private loaderService: LoaderService
  ) {
    this.commonServices.visibility = "shown";
  }

  ngOnInit() {
    this.userdetails = JSON.parse(localStorage.getItem("userdetails"));
    this._subheaderService.setTitle("Pharmacy Group");
    this.loadData();
  }

  loadData() {
    this.apiService.GetList(this.url + "GetList?phadminid=" + this.userdetails.UserId + "&roleid=" + this.userdetails.RoleId).subscribe((res: any) => {
      this.PharmacyGrpList = res.list;
      this.TempPharmacyGrpList = res.list;
      // this.dataSource = new MatTableDataSource(res.list);
      // this.totalLength = res.list.length;
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      this.setPharmServing(res.list, res.pharmacyserve_list);
      this.cdRef.detectChanges();
      this.commonServices.visibility = "hidden";
    }, err => {
      this.commonServices.customError(1);
      this.commonServices.visibility = "hidden";
    })
  }

  applyFilter(value, flag) {
    // if (flag) {
    //   this.dataSource.filter = value.trim().toLocaleLowerCase();
    // } else {
    //   this.dataSource.filter = value.trim().toLocaleLowerCase();
    // }

    this.pageSize = this.TempPharmacyGrpList.length; // 8;
    if (value == undefined || value == null || value == "") {
      var pharmDataSource = this.TempPharmacyGrpList;
      this.PharmacyGrpList = pharmDataSource.slice(0, this.pageSize);
      if (pharmDataSource.length > 100) {
        this.pageSizeOptions.push(pharmDataSource.length);
      }
    } else {
      var filter = this.TempPharmacyGrpList.filter(function (val) {
        if (val.PharmacyGrpName != null && val.ContactName != null && val.Email != null && val.PhoneNo1 != null) {
          return val.PharmacyGrpName.toLowerCase().includes(value.trim().toLowerCase()) != false || val.ContactName.toLowerCase().includes(value.trim().toLowerCase()) != false || val.Email.toLowerCase().includes(value.trim().toLowerCase()) != false || val.PhoneNo1.toLowerCase().indexOf(value.trim().toLowerCase()) != -1
        }
      });
      this.PharmacyGrpList = filter.slice(0, this.pageSize);
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

  setPharmServing(res: any, pharmacyserve_list: any) {
    // pharmacyserve_list
    for (let i = 0; i < res.length; i++) {
      let _list = pharmacyserve_list.filter(a => a.PharmacyGrpId === res[i].PharmacyGrpId);
      this.PharmacyGrpList[i]['pharmacyserve_list'] = _list;
    }
  }

  addPharmacy(pharmacy: any) {
    // this.router.navigate(['/app/masters/customer/edit/' + customer.Id]);
    this.dialog.open(PharmacyGroupsDialogComponent, {
      data: pharmacy,
      disableClose: true,
      height: 'auto',
      width: '70%'
    }).afterClosed().subscribe(res => {
      if (res != null && res.list != null) {
        this.PharmacyGrpList = res.list.list;
        this.TempPharmacyGrpList = res.list.list;
        this.searchKey.nativeElement.value = '';
        this.setPharmServing(res.list.list, res.list.pharmacyserve_list);
        this.apiService.showSnack(res.ErroMessage); this.cdRef.detectChanges();
      }
    });
  }

  editPharmacy(pharmacy: any) {
    this.commonServices.visibility = "shown";
    this.apiService.GetList(this.url + 'GetListByPHGId?id=' + pharmacy.PharmacyGrpId).subscribe((res: any) => {
      this.commonServices.visibility = "hidden";
      pharmacy.QrCode = res.QrCode;
      this.addPharmacy(pharmacy);
    }, err => {
      this.commonServices.visibility = "hidden";
    });
  }

  deletePharmacy(pharmacyGrp): void {
    // this.spinner.show();
    this.loaderService.display(true);
    this.apiService.Delete(this.url + 'DeleteById/' + pharmacyGrp.PharmacyGrpId).subscribe(res => {
      this.apiService.showSnack(GlobalConstant.deleted);
      this.dataSource = new MatTableDataSource(res.list);
      this.totalLength = res.list.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // this.spinner.hide();
      this.loaderService.display(false);
    }, err => {
      // this.apiService.showSnack(GlobalConstant.delete);
      this.commonServices.customError(5);
      // this.spinner.hide();
      this.loaderService.display(false);
    });
  }
}
