import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiServices } from '../../../services/api.services';
import { SubheaderService } from '../../../../core/_base/layout';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { CommonServices } from '../../../services/common';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatInput } from '@angular/material';
import { ReportDialog } from './report-dialog/report-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import { GlobalConstant } from '../../globals/globalvariables';



@Component({
  selector: 'pp-reportv2',
  templateUrl: './reportV2.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [DatePipe]
})
export class ReportV2Component implements OnInit {
  url2 = "ReportV2/";
  PharmacyId = 0;
  loginDetails: any;
  customerdata: any;
  filterPharmacyId: any;
  pharmacyList = [];
  pharmList = [];
  temppharmlist = [];
  tempreplist = [];
  ReportList = [];
  tempPharmacyList = [];
  totalLength = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  pageEvent: PageEvent;
  length: number;
  lowValue: number = 0;
  highValue: number = 10;
  isRole = false;
  clear = false;
  ByWeek: Date = null;
  constructor(
    private apiService: ApiServices,
    private cdRef: ChangeDetectorRef,
    private _subheaderService: SubheaderService,
    private commonServices: CommonServices,
    public dialog: MatDialog,
    public datepipe: DatePipe,
  ) {
    this.loginDetails = JSON.parse(localStorage.getItem("userdetails"));
  }

  ngOnInit() {
    this.roleCheck();
    this._subheaderService.setTitle("Invoice Report");
    this.filterPharmacyId = "0";
  }

  dateEve(e) {
    if (e.target.value != null) {
      var that = this;
      this.clear = true; var valued = e.target.value;
      var filter = this.tempreplist.filter(function (val) {
        return formatDate(val.Week, 'dd/MM/yyyy', 'en-GB').toLowerCase().indexOf(formatDate(valued, 'dd/MM/yyyy', 'en-GB').toLowerCase()) != -1
      });

      if (that.filterPharmacyId != "0" && that.filterPharmacyId > 0) {
        filter = filter.filter(function (val) { return val.PharmacyId == that.filterPharmacyId; });
      }

      this.ReportList = filter.slice(0, this.pageSize);
      this.length = filter.length;
      this.setPagin(this.length);
      if (this.length > 100) {
        this.pageSizeOptions.push(filter.length);
      }
    }
    else {
    }
  }

  resetDate(e) {
    e._datepickerInput.value = ""; var that = this;
    if (that.filterPharmacyId != "0" && that.filterPharmacyId > 0) {
      this.ReportList = this.tempreplist.filter(function (val) { return val.PharmacyId == that.filterPharmacyId; });
    } else {
      this.ReportList = this.tempreplist;
    }
    this.clear = false; this.ByWeek = null;
    this.cdRef.detectChanges();
  }

  filterPhrm(data) {
    var that = this;
    var tdate = this.ByWeek == null || this.ByWeek == undefined ? null : this.datepipe.transform(new Date(this.ByWeek), 'dd/MM/yyyy');
    if (data == "0") {
      data = 0; this.ReportList = this.tempreplist;
    }
    else {
      this.ReportList = this.tempreplist.filter(function (val) { return val.PharmacyId == data; });
    }
    if (tdate != null) {
      this.ReportList = this.ReportList.filter(function (val) { return that.datepipe.transform(new Date(val.Week), 'dd/MM/yyyy') == tdate; });
    }
  }

  roleCheck() {
    this.commonServices.visibility = "shown";
    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      if (this.loginDetails.RoleId != 2) { this.isRole = true; }
      this.inItList(this.loginDetails.PharmacyGrpId, this.loginDetails.RoleId);
    }
    else {
      this.inItList(this.loginDetails.PharmacyId, 0);
    }
  }

  inItList(id, role) {
    this.apiService.GetList(this.url2 + "GetList?id=" + id + "&roleid=" + role + "&phadminid=" + this.loginDetails.UserId).subscribe((res: any) => {
      this.initValue(res);
    }, err => {
      this.commonServices.customError(1);
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
    });
  }

  initValue(res) {
    this.pharmList = res.pharmacy_list; this.temppharmlist = res.pharmacy_list; this.filterPharmacyId = "0"; this.ByWeek = null;
    this.ReportList = res.report_list; this.tempreplist = res.report_list;
    this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
  }

  retPharm(id) {
    var dat = this.temppharmlist.filter(function (val) { return val.PharmacyId == id });
    return dat[0].PharmacyName;
  }

  OpenDialog(id) {
    var that = this;
    this.dialog.open(ReportDialog, {
      data: { model: id, plist: that.pharmList, reportList: this.ReportList },
      disableClose: true,
      minWidth: '900px',
      width: '50%',
    }).afterClosed().subscribe(res => {
      if (res != "" && res != null && res.list != null) {
        this.commonServices.visibility = "hidden";
        this.initValue(res.list);
      }
    });
  }

  editDialog(id) {
    this.commonServices.visibility = "shown";
    this.apiService.GetList(this.url2 + "GetDoc?id=" + id + "&type=" + 3).subscribe((res: any) => {
      this.OpenDialog(res.reports);
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
    }, err => {
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      this.commonServices.customError(1);
    });
  }

  pickDoc(id, type) {
    this.commonServices.IsDownload = true; this.commonServices.visibility = "shown";
    this.apiService.GetList(this.url2 + "GetDoc?id=" + id + "&type=" + type).subscribe((res: any) => {
      this.commonServices.downloadFile(res);
      // var a = document.createElement('a'); 
      // a.href = "data:application/pdf;base64," + res.B64string; a.download = res.FileName;
      // a.style.display = 'none';
      // document.body.appendChild(a).click();
      this.commonServices.IsDownload = false; this.commonServices.visibility = "hidden";
      this.cdRef.detectChanges();
    }, err => {
      this.commonServices.IsDownload = false; this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      this.commonServices.customError(9);
    });
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

  searchFilterBypharmacy(value, flag) {
    let data = []; //debugger
    this.temppharmlist.filter(val => {
      if (val.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        data.push(val);
      }
    })
    this.pharmList = data;
  }


}
