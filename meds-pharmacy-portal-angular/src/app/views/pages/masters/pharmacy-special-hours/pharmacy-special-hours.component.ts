import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, PageEvent } from '@angular/material';
import { ApiServices } from '../../../services/api.services';
import { SubheaderService } from '../../../../core/_base/layout/services/subheader.service';
import { CommonServices } from '../../../services/common';
import { PharmacySpecialHoursDialogComponent } from '../../dialogs/pharmacy-special-hours-dialog/pharmacy-special-hours-dialog.component';
import { DatePipe } from '@angular/common';
import { HolidayListSpecialHoursDialogComponent } from '../../dialogs/pharmacy-list-special-hours-dialog/pharmacy-list-special-hours.component';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { GlobalConstant } from '../../globals/globalvariables';

@Component({
  selector: 'pp-pharmacy-special-hours',
  templateUrl: './pharmacy-special-hours.component.html',
  styleUrls: ['./pharmacy-special-hours.component.scss']
})
export class PharmacySpecialHoursComponent implements OnInit {

  url: string = "PharmacySpecialHours/";
  stateList: any = [];
  pharmacyList: any = [];
  SpecialHrs: any = [];
  TopTableDisable = false;
  lowValue: number = 0;
  highValue: number = 10;
  length: number;
  pageSize = 10;
  tempSpecialHrs: any = [];
  disableHoilday = true;
  IncludePharmacy: any = [];
  tableAllCheck: boolean = true;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  pageEvent: PageEvent;
  userDetail: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchkey', { static: true }) searchKey;
  constructor(private dialog: MatDialog,
    private apiService: ApiServices,
    private commonService: CommonServices,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    public datePipe: DatePipe,) {
    this.userDetail = JSON.parse(localStorage.getItem("userdetails"));

  }

  ngOnInit() {
    this.commonService.visibility = "shown";
    this.subheaderService.setTitle('Holiday calendar & Special hours');
    this.apiService.Get(this.url).subscribe((res: any) => {
      if (res != null) {
        this.responseHandler(res);
        this.commonService.visibility = "hidden";
      } else {
        this.commonService.visibility = "hidden";
        this.apiService.showSnack(GlobalConstant.fetch);
      }
    }, error => {
      this.commonService.visibility = "hidden";
      this.apiService.showSnack(GlobalConstant.fetch);
    });
  }

  responseHandler(res) {
    this.SpecialHrs = res.pharmacySpecialHour;
    this.stateList = res.states;
    this.pharmacyList = res.pharmacies; this.searchKey.nativeElement.value = '';
    this.SpecialHrs.forEach((x: any) => {
      x.FromandToDate = this.datePipe.transform(x.FromDate, 'dd/MM/yyyy') + " - " + this.datePipe.transform(x.ToDate, 'dd/MM/yyyy');
      var state = x.StateId.split(",");
      var pharmacy = x.SearchForPharmacies.split(",");
      var stateNames = "";
      state.forEach((row: any, i: number) => {
        var filteredState = this.stateList.filter((f: any) => f.id == row);
        var filterPharmacy = this.pharmacyList.filter((Pharmacy: any) => Pharmacy.StateId == row);
        if (filterPharmacy.length > 0) {
          this.IncludePharmacy = this.IncludePharmacy.concat(filterPharmacy);
        }
        if (filteredState.length > 0) {
          stateNames = i == 0 ? filteredState[0].value : stateNames + " , " + filteredState[0].value;
        }
      })
      x.IncludePharmacyCount = this.IncludePharmacy.length - x.ExcludedPharmacyCount;
      pharmacy.forEach((x: any) => {
        var index = this.IncludePharmacy.findIndex(Inpharm => Inpharm.PharmacyId == x);
        if (index != -1) {
          this.IncludePharmacy.splice(index, 1);
        }
      })
      x.StateNames = stateNames;
      x.IncludePharmacylist = this.IncludePharmacy;
      this.IncludePharmacy = [];
    });
    var selected = this.SpecialHrs.filter(x => x.IsHolidayDisable == true);
    this.disableHoilday = selected.length != 0 && selected.length > 0 ? false : true;
    this.tempSpecialHrs = this.SpecialHrs;
    this.tableAllCheck = this.SpecialHrs.length > 0 && this.SpecialHrs.length != 0 ? false : true;
    this.SpecialHrs.reverse();
  }

  applyFilter(value) {
    this.pageSize = this.tempSpecialHrs.length;
    var selected = this.SpecialHrs.filter(x => x.IsHolidayDisable == true);
    selected.forEach((f: any) => {
      var myIndex = this.tempSpecialHrs.findIndex(a => a.SpecialhrsId == f.SpecialhrsId);
      if (myIndex !== -1) {
        this.tempSpecialHrs[myIndex].IsHolidayDisable = true;
      }
    });

    if (value == undefined || value == null || value == "") {
      var pharmDataSource = JSON.parse(JSON.stringify(this.tempSpecialHrs));
      this.SpecialHrs = pharmDataSource.slice(0, this.pageSize);
      if (pharmDataSource.length > 100) {
        this.pageSizeOptions.push(pharmDataSource.length);
      }
    } else {
      var filter = JSON.parse(JSON.stringify(this.tempSpecialHrs)).filter((val: any) => {
        if (val.FromandToDate != null || val.StateNames != null) {
          return val.FromandToDate.toLowerCase().includes(value.trim().toLowerCase()) != false || val.StateNames.toLowerCase().includes(value.trim().toLowerCase()) != false || val.LabelAs.toLowerCase().includes(value.trim().toLowerCase()) != false;
        }
      });

      this.SpecialHrs = filter.slice(0, this.pageSize);
      this.length = filter.length;
      this.setPagin(this.length);
      if (this.length > 100) {
        this.pageSizeOptions.push(filter.length);
      }
    }
    var selected = this.SpecialHrs.filter(x => x.IsHolidayDisable == true);
    this.TopTableDisable = this.SpecialHrs.length == selected.length && this.SpecialHrs.length != 0 ? true : false;
    this.disableHoilday = selected.length != 0 && selected.length > 0 ? false : true;
    this.tableAllCheck = this.SpecialHrs.length > 0 && this.SpecialHrs.length != 0 ? false : true;
  }

  timeFormat24to12(time: any) {
    if (time != null && time != "") {
      let hour = (time.split(':'))[0]
      let min = (time.split(':'))[1]
      let part = hour >= 12 ? 'PM' : 'AM';
      if (parseInt(hour) == 0)
        hour = 12;
      min = (min + '').length == 1 ? `0${min}` : min;
      hour = hour > 12 ? hour - 12 : hour;
      hour = (hour + '').length == 1 ? `0${hour}` : hour;
      return `${hour}:${min} ${part}`
    } else {
      return "Mark as closed";
    }
  }

  findStringLength(value) {
    value = value.trim();
    if (value != null && value != "") {
      var pharmacy = value.split(",");
      return pharmacy.length;
    }
    return 0;
  }

  AddRecord(record, flag) {
    var id = 0;
    this.commonService.visibility = "shown";
    if (record != null) { id = record.SpecialhrsId; }
    this.apiService.GetList(this.url + "GetById?id=" + id).subscribe((res: any) => {
      if (res != null) {
        this.popup(res, flag);
        this.commonService.visibility = "hidden";
      } else {
        this.commonService.visibility = "hidden";
        this.apiService.showSnack(GlobalConstant.fetch);
      }
    }, error => {
      this.commonService.visibility = "hidden";
      this.apiService.showSnack(GlobalConstant.fetch);

    });
  }

  popup(result, flag) {
    this.dialog.open(PharmacySpecialHoursDialogComponent, {
      data: { result, flag },
      disableClose: true,
      height: '385px',
      width: '845px'
    }).afterClosed().subscribe(res => {
      if (res != null) {
        this.responseHandler(res);
        this.TopTableDisable = false;
        this.commonService.backaddCls();
        this.commonService.visibility = "hidden";
        this.apiService.showSnack(result.pharmacySpecialHour == null ? GlobalConstant.saved : GlobalConstant.updated);
      }
    });
  }

  IncludedPopup(value, i, pharmacy) {
    var ExcludedPharmacyId = []; this.pharmacyList = [];
    this.pharmacyList = JSON.parse(JSON.stringify(pharmacy));
    var title;
    if (i == 2) {
      title = "Included pharmacies"
      value.SearchForPharmacies.split(",").map(x => {
        var index = pharmacy.findIndex(p => p.PharmacyId == x)
        if (index != -1) {
          this.pharmacyList[index].IsIncluded = false;
          ExcludedPharmacyId.push(this.pharmacyList[index])
        }
      })
    }
    else {
      title = "Excluded pharmacies";
      var pharmaciesList = value.IncludePharmacylist;
      pharmaciesList.forEach((row: any) => {
        var filteredPharmacy = pharmacy.filter((f: any) => f.PharmacyId == row.PharmacyId);
        if (filteredPharmacy.length > 0) { ExcludedPharmacyId.push(filteredPharmacy[0]) }
      });
    }
    this.dialog.open(HolidayListSpecialHoursDialogComponent, {
      data: { ExcludedPharmacyId, title, i, value },
      disableClose: true,
      height: '700px',
      width: '600px'
    }).afterClosed().subscribe(res => {
      if (res != null) {
        this.responseHandler(res);
        this.TopTableDisable = false;
        this.commonService.backaddCls();
        this.commonService.visibility = "hidden";
        this.apiService.showSnack(GlobalConstant.updated);
      }
    });
  }

  IncludeExcludedPharmacy(value, i) {
    var id = 0;
    this.commonService.visibility = "shown";
    this.apiService.GetList(this.url + "GetPharmacy").subscribe((res: any) => {
      if (res != null) {
        this.IncludedPopup(value, i, res);
        this.commonService.visibility = "hidden";
      } else {
        this.commonService.visibility = "hidden";
        this.apiService.showSnack(GlobalConstant.fetch);
      }
    }, error => {
      this.apiService.showSnack(GlobalConstant.fetch);
      this.commonService.visibility = "hidden";
    });
  }

  isClosedCheck(value, item) {
    if (value == 2) {
      if (item != null) {
        var index = this.tempSpecialHrs.findIndex(c => c.SpecialhrsId == item.SpecialhrsId);
        if (index !== -1) {
          this.tempSpecialHrs[index] = item;
        }
      }
      var selectedArray = this.SpecialHrs.filter((x: any) => x.IsHolidayDisable == true);
      this.disableHoilday = selectedArray.length != 0 ? false : true;
      selectedArray.length == this.SpecialHrs.length && this.SpecialHrs.length != 0 ? this.TopTableDisable = true : this.TopTableDisable = false;
    }
    else {
      this.SpecialHrs.forEach((x: any) => {
        x.IsHolidayDisable = this.TopTableDisable;
        var filterIndex = this.tempSpecialHrs.findIndex((f: any) => f.SpecialhrsId == x.SpecialhrsId);
        if (filterIndex !== -1) {
          this.tempSpecialHrs[filterIndex] = x;
        }
      });
      this.disableHoilday = this.TopTableDisable ? false : true;
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

  HolidayDisable() { //selcted object IsClose change
    const title: string = 'Holiday calendar & Special hours';
    const description: string = 'Are you sure you want to disable this selected Holiday special hours?';
    const waitDesciption: string = 'Holiday special hours is being disable...';
    const flag: number = 2;
    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption, flag);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.commonService.visibility = "shown";
        this.apiService.Post(this.SpecialHrs, this.url + "Holidaydisable?UserId=" + this.userDetail.UserId).subscribe(res => {
          if (res != null) {
            this.responseHandler(res);
            this.commonService.visibility = "hidden";
            this.TopTableDisable = false;
            this.apiService.showSnack(GlobalConstant.updated);
          } else {
            this.commonService.visibility = "hidden";
            this.apiService.showSnack(GlobalConstant.savefail);
          }
        }, error => {
          this.commonService.customError(10);
          this.commonService.visibility = "hidden";
          this.apiService.showSnack(GlobalConstant.savefail);
        });
      }
      else {
        return;
      }
    })
  }

  isActive() {  // Remove button action, selcted object IsActive change
    const title = 'Holiday & Special hours';
    const description = 'Are you sure you want to deactivate selected Holiday special hours?';
    const waitDesciption = 'Holiday special hours is being deactivated...';
    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.apiService.Post(this.SpecialHrs, this.url + "Delete?UserId=" + this.userDetail.UserId).subscribe(res => {
          if (res != null) {
            this.responseHandler(res);
            this.apiService.showSnack("Data deactivated successfully");
          } else {
            this.apiService.showSnack(GlobalConstant.savefail);
          }
        }, error => {
          this.apiService.showSnack("Data failed to deactivate, please try again")
        });
      } else {
        return;
      }
    });
  }

  singleIsActive(data, event)  // single object Isactive change
  {
    event.source.checked = data.IsActive ? true : false;
    var title: string; var description: string; var waitDesciption: string; const flag: number = 2;
    if (data.IsActive == true) {
      title = 'Holiday calendar & Special hours';
      description = 'Are you sure, you want to deactivate this Holiday/Special hours?';
      waitDesciption = 'Holiday special hours is being deactivated...';
    }
    else {
      title = 'Holiday calendar & Special hours';
      description = 'Are you sure, you want to activate this Holiday/Special hours?';
      waitDesciption = 'Holiday special hours is being activated...';
    }
    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption, flag);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.commonService.visibility = "shown";
        data.IsActive = !data.IsActive;
        this.apiService.Post(data, this.url + "IsActiveChange?UserId=" + this.userDetail.UserId).subscribe(response => {
          if (response != null) {
            this.responseHandler(response);
            this.commonService.visibility = "hidden";
            data.IsActive == true ? this.apiService.showSnack("Data activated successfully") : this.apiService.showSnack("Data deactivated successfully");
          }
          else {
            this.commonService.visibility = "hidden";
            data.IsActive == true ? this.apiService.showSnack("Data failed to activate, please try again") : this.apiService.showSnack("Data failed to deactivate, please try again")
          }
        }, error => {
          this.commonService.visibility = "hidden";
          data.IsActive == true ? this.apiService.showSnack("Data failed to activate, please try again") : this.apiService.showSnack("Data failed to deactivate, please try again")
        });
      } else {
        return;
      }
    });
  }

  deleteSplhrs(value) { // single object IsDelete change
    const title: string = 'Holiday calendar & Special hours';
    const description: string = 'Are you sure you want to delete this Holiday/Special hours?';
    const waitDesciption: string = 'Holiday special hours is being deleted...';
    const flag: number = 2;
    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption, flag);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.commonService.visibility = "shown";
        this.apiService.GetList(this.url + "IsDeleteById?id=" + value.SpecialhrsId + "&UserId=" + this.userDetail.UserId).subscribe(res => {
          if (res != null) {
            this.responseHandler(res);
            this.commonService.visibility = "hidden";
            this.apiService.showSnack(GlobalConstant.deleted);
          } else {
            this.commonService.visibility = "hidden";
            this.apiService.showSnack(GlobalConstant.delete);
          }
        }, error => {
          this.commonService.visibility = "hidden";
          this.apiService.showSnack(GlobalConstant.delete);
        });
      } else {
        return;
      }
    });
  }


}
