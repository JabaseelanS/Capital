import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, PageEvent } from '@angular/material';
import { ApiServices } from '../../../services/api.services';
import { CommonServices } from '../../../services/common';
import { SubheaderService } from '../../../../core/_base/layout';
import { OtcCreateComponent } from '../../dialogs/otc-create/otc-create.component';
import { GlobalConstant } from '../../globals/globalvariables';


@Component({
  selector: 'pp-otc-price',
  templateUrl: './otc-price.component.html',
  styleUrls: ['./otc-price.component.scss']
})
export class OtcPriceComponent implements OnInit {
  pageSizeOptions: number[] = [5, 10, 50, 100];
  pageSize = 5;
  length: number;
  lowValue: number = 0;
  highValue: number = 10;
  url = "OTC/";
  psearch = "";
  tempotclist = [];
  user: any;
  pharmacylist: any; tempPharmacyList: any;
  phid: number;
  data: any = [];
  search = 1;
  searchval = "";
  searchlist = [{ id: 1, value: 'Show All' }, { id: 2, value: 'show Active' }, { id: 3, value: 'Show Inactive' }]
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private subheaderService: SubheaderService,
    private apiservices: ApiServices,
    public dialog: MatDialog,
    private commonServices: CommonServices,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.commonServices.visibility = "shown";
    this.subheaderService.setTitle('OTC Price');
    this.loginuser();
  }

  loginuser() {
    this.user = JSON.parse(localStorage.getItem("userdetails")); this.phid = 0;
    if (this.user.RoleId == 3 || this.user.RoleId == 4) {
      this.phid = this.user.PharmacyId;
    }
    else if (this.user.RoleId == 2) {
      this.phid = this.user.PharmacyGrpId;
    }
    this.apiservices.GetById(this.url + '?id=' + this.phid + "&roleid=" + this.user.RoleId + "&phadminid=" + this.user.UserId).subscribe(response => {
      if (response.value.length != 0) {
        this.data = response.value;
        this.tempotclist = response.value;
      }
      else {
        this.data = [];
        this.tempotclist = [];
      }
      if (response.pharmacyList.length != 0) {
        this.pharmacylist = response.pharmacyList; this.tempPharmacyList = response.pharmacyList;
        this.phid = response.pharmacyList[0].PharmacyId;
      }
      this.commonServices.visibility = "hidden";
    }, error => {
      this.commonServices.visibility = "hidden";
      this.commonServices.customError(1);
    });
  }

  searchFilterBypharmacy(value, flag) {
    let data = []; //debugger
    this.tempPharmacyList.filter(val => {
      if (val.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        data.push(val);
      }
    })
    this.pharmacylist = data;
  }

  applyFilter(value) {
    this.pageSize = this.tempotclist.length;
    if (value == undefined || value == null || value == "") {
      this.data = this.tempotclist.slice(0, this.pageSize);
      if (this.tempotclist.length > 100) {
        this.pageSizeOptions.push(this.tempotclist.length);
      }
    } else {
      var filter = this.tempotclist.filter(function (val) {
        if (val.Ean != null && val.MedicineName != null) {
          return val.Ean.toLowerCase().includes(value.trim().toLowerCase()) != false || val.MedicineName.toLowerCase().includes(value.trim().toLowerCase()) != false
        }
      });
      this.data = filter.slice(0, this.pageSize);
      this.length = filter.length;
      this.setPagin(this.length);
      if (this.length > 100) {
        this.pageSizeOptions.push(filter.length);
      }
    }
    if (this.search == 2) {
      this.data = this.data.filter(x => x.IsActive == true);
    }
    else if (this.search == 3) {
      this.data = this.data.filter(x => x.IsActive == false);
    }
  }

  choosepharmacy() {
    this.commonServices.visibility = "shown";
    this.search = 1;
    this.searchval = "";
    this.apiservices.GetById(this.url + 'GetOtcPrice?id=' + this.phid).subscribe(response => {
      if (response != null) {
        this.data = response;
        this.tempotclist = response;
        this.setPagin(this.data.length);
      }
      else {
        this.data = [];
        this.tempotclist = [];
      }
      this.commonServices.visibility = "hidden";
    }, error => {
      this.commonServices.visibility = "hidden";
      this.commonServices.customError(1);
    });
  }
  searchselection(value) {
    this.pageSize = this.tempotclist.length;
    this.searchval = "";
    if (value == 1) {
      this.data = this.tempotclist.slice(0, this.pageSize);
      if (this.tempotclist.length > 100) {
        this.pageSizeOptions.push(this.tempotclist.length);
      }
    }
    else {
      var filter = this.tempotclist.filter(function (val) {
        if (value == 2) {
          return val.IsActive == true
        }
        else if (value == 3) {
          return val.IsActive == false
        }
      });
      this.data = filter.slice(0, this.pageSize);
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
  opendialog(model) {
    var phid = this.phid;
    var user = this.user;
    var phlist = this.pharmacylist
    this.dialog.open(OtcCreateComponent, {
      height: 'auto',
      width: '700px',
      data: { model, user, phlist, phid },
      disableClose: true
    }).afterClosed().subscribe(async res => {
      if (res != null) {
        if (res.flag) {
          if (res.data.Stock === 0) {
            this.apiservices.showSnack(GlobalConstant.updated + ". Please update the stock otherwise, customer won't be able to purchase it.")
          }
          else {
            this.apiservices.showSnack(GlobalConstant.updated);
          }
          this.data = res.otc;
          this.tempotclist = res.otc;
        }
        else {
          this.apiservices.showSnack(res.data.ErroMessage);
        }
        this.commonServices.backaddCls(); this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      }
    });
  }
  // delete(item: Testgroup) {
  //   const title: string = 'OTC Delete';
  //   const description: string = 'Are You sure want to delete Otc item';
  //   const waitDescription: string = "OTC is being deleted...";
  //   const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDescription);
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res) {
  //       // this.spinner.show();
  //       this.loaderService.display(true);
  //       this.apiservices.deleteotcprice(this.url ,item.OTCId,this.PharmacyId.PharmacyId).subscribe((res: any) => {
  //         this.apiservices.showSnack(GlobalConstant.deleted);
  //         this.get();
  //         this.searchKey.nativeElement.value = '';
  //       }, error => {
  //         // this.spinner.hide();
  //         this.loaderService.display(false);
  //         this.commonServices.customError(1);
  //       });
  //     } else {
  //       return;
  //     }
  //   });
  // }
  changed(value) {
    this.commonServices.visibility = "shown";
    var index = this.data.findIndex(x => x.Ean === value.Ean);
    value.IsActive = !value.IsActive
    this.apiservices.Post(value, this.url + 'UpdateOtcPrice/' + this.phid).subscribe((response: any) => {
      if (response.flag) {
        if (response.data.Stock == 0 && response.data.IsActive == true) {
          this.apiservices.showSnack("Product activated. Please update the stock otherwise, customer won't be able to purchase it")
        } else {
          if (response.data.IsActive == true) {
            this.apiservices.showSnack(GlobalConstant.active);
          }
          else {
            this.apiservices.showSnack(GlobalConstant.Isactive);
          }
        }
      }
      else {
        this.apiservices.showSnack(response.data.ErroMessage);
      }
      this.commonServices.visibility = "hidden";
      this.data[index] = response.data;
      this.tempotclist = response.otc;

    });
  }
}