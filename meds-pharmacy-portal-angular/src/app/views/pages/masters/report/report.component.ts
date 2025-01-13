import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiServices } from '../../../../views/services/api.services';
import { SubheaderService } from '../../../../core/_base/layout';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { CommonServices } from '../../../../../app/views/services/common';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatInput } from '@angular/material';
import { ReportDialog } from './report-dialog/report-dialog.component';
import { formatDate } from '@angular/common';
import { GlobalConstant } from '../../globals/globalvariables';

@Component({
  selector: 'pp-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  url = 'Report/';
  PharmacyId = 0;
  OrderNo = "";
  loginDetails: any;
  customerdata: any;
  filterPharmacyId: any;
  pharmacyList = [];
  pharmList = [];
  temppharmlist = [];
  tempreplist = [];
  ReportList = [];
  tempPharmacyList = [];
  tempOrderList = [];
  OrderList = [];
  tordlist = [];
  orderNoList = [];
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];
  @ViewChild('dateRangePicker', { static: true }) dateRangePicker;
  range: Range = null
  totalLength = 0;
  displayedColumns = ['TimeTaken', 'OrderFullFill'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  orderStatusList = [];
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  pageEvent: PageEvent;
  length: number;
  lowValue: number = 0;
  highValue: number = 10;
  exldata = [];
  customerList = [];
  refPath: string;
  nam: string;
  csvPath: any;
  csvnam: any;
  IsSearch = false;
  isFilter = 0;
  searchVal: '';
  isRole = false;
  clear = false;
  constructor(
    private apiService: ApiServices,
    private cdRef: ChangeDetectorRef,
    private _subheaderService: SubheaderService,
    private commonServices: CommonServices,
    public dialog: MatDialog
  ) {
    this.loginDetails = JSON.parse(localStorage.getItem("userdetails"));
  }

  ngOnInit() {
    this._subheaderService.setTitle("Order Report");
    this.filterPharmacyId = "0";
    if (this.loginDetails.RoleId == 1 || this.loginDetails.RoleId == 2 || this.loginDetails.RoleId == 5) {
      this.isRole = true;
    }
    this.setDateRange(this.range); console.log(this.loginDetails);
    this.GetReport();
    // this.export(this.IsSearch, this.exldata, '', this.isFilter);
  }

  applyFilter(value, flag) {
    this.searchVal = value;
    if (this.filterPharmacyId != 0) {
      this.pageSize = this.tempOrderList.length; // 8;
      if (value == undefined || value == null || value == "") {
        var prescriptionDataSource = this.tempOrderList;
        this.OrderList = this.tempOrderList.slice(0, this.pageSize);
        this.setPagin(prescriptionDataSource.length);
        if (prescriptionDataSource.length > 100) {
          this.pageSizeOptions.push(prescriptionDataSource.length);
        }
      } else {
        var filter = this.tempOrderList.filter(function (val) { return val.OrderNo.toLowerCase().indexOf(value.trim().toLowerCase()) != -1 });
        this.IsSearch = true;
        this.OrderList = filter.slice(0, this.pageSize);
        this.length = filter.length;
        this.setPagin(this.length);
        if (this.length > 100) {
          this.pageSizeOptions.push(filter.length);
        }
      }
    }
    else {
      this.pageSize = this.tempOrderList.length; // 8;
      if (value == undefined || value == null || value == "") {
        var prescriptionDataSource = this.tempOrderList;
        this.OrderList = prescriptionDataSource.slice(0, this.pageSize);
        this.setPagin(prescriptionDataSource.length);
        if (prescriptionDataSource.length > 100) {
          this.pageSizeOptions.push(prescriptionDataSource.length);
        }
      } else {
        var filter = this.tempOrderList.filter(function (val) { return val.OrderNo.toLowerCase().indexOf(value.trim().toLowerCase()) != -1 });
        this.IsSearch = true;
        this.OrderList = filter.slice(0, this.pageSize);
        this.length = filter.length;
        this.setPagin(this.length);
        if (this.length > 100) {
          this.pageSizeOptions.push(filter.length);
        }
      }
    }
  }

  // Export Xlsx Data
  GetReport() {
    this.commonServices.visibility = "shown";
    this.apiService.Post(this.loginDetails, this.url + 'GetReport').subscribe((res: any) => {
      this.pharmacyList = res.pharmacyModel; this.tempPharmacyList = res.pharmacyModel;
      this.tempOrderList = res.orderModel; this.OrderList = res.orderModel;
      this.commonServices.visibility = "hidden"; this.commonServices.IsDownload = false;
      this.cdRef.detectChanges();
    }, err => {
      this.commonServices.visibility = "hidden";
      this.commonServices.customError(1);
      this.commonServices.IsDownload = false;
      this.cdRef.detectChanges();
      console.log(err);
    });
  }

  exportBy(flag) {
    if (this.OrderList == null || this.OrderList.length <= 0) {
      this.apiService.showSnack('Failed to export file');
      return;
    }
    var list = {
      pharmacyModel: this.tempPharmacyList,
      pharmacyUser: this.loginDetails,
      flag: flag,
      filterPharmacyId: this.filterPharmacyId,
    }
    this.commonServices.IsDownload = true;
    this.commonServices.visibility = "shown";
    this.apiService.Post(list, this.url + 'generateReport').subscribe((res: any) => {
      if (res.flag) {
        var a = document.createElement('a'); a.href = "data:text/csv;charset=utf-8;base64," + res.base64;
        a.style.display = 'none'; a.download = res.file;
        document.body.appendChild(a).click();
      }
      this.commonServices.visibility = "hidden"; this.commonServices.IsDownload = false;
      this.cdRef.detectChanges();
    }, err => {
      this.commonServices.visibility = "hidden"; this.commonServices.IsDownload = false;
      this.cdRef.detectChanges();
      this.commonServices.customError(8);
      // this.apiService.showSnack('Failed to export file');
      console.log(err);
    });
  }

  // Export Xlsx Data
  export(val, list, type, flag) {
    var filterId;
    if (this.isFilter != 0) {
      filterId = this.isFilter;
    }
    else {
      filterId = this.loginDetails.PharmacyId;
    }
    this.apiService.Post(list, this.url + 'generateXLSX?id=' + filterId + '&IsSearch=' + val + '&role=' + this.loginDetails.RoleId + "&grpid=" + this.loginDetails.PharmacyGrpId).subscribe((res: any) => {
      if (this.IsSearch || flag) {
        if (type == 1) {
          val = false; list = ''; type = '';
          var userInp = res.contentcsv;
          var a = document.createElement('a');
          a.href = "data:text/csv;charset=utf-8;base64," + userInp;
          a.style.display = 'none';
          a.download = res.filenamecsv;
          document.body.appendChild(a).click();
          this.commonServices.visibility = "hidden";
          this.commonServices.IsDownload = false;
          this.cdRef.detectChanges();
        }
        else {
          val = false; list = ''; type = '';
          var userInp = res.contentxl;
          var a = document.createElement('a');
          a.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + userInp;
          a.style.display = 'none';
          a.download = res.filenamexl;
          document.body.appendChild(a).click();
          this.commonServices.visibility = "hidden";
          this.commonServices.IsDownload = false;
          this.cdRef.detectChanges();
        }
      } else {
        this.refPath = res.contentxl;
        this.pharmacyList = res.pharmModel;
        this.tempPharmacyList = res.pharmModel;
        this.tempOrderList = res.orderModel;
        this.csvPath = res.contentcsv;
        this.OrderList = res.xlmodel;
        this.orderNoList = res.xlmodel;
        this.nam = res.filenamexl;
        this.csvnam = res.filenamecsv;
        this.commonServices.visibility = "hidden";
        this.commonServices.IsDownload = false;
        this.cdRef.detectChanges();
      }
    }, err => {
      this.commonServices.visibility = "hidden";
      this.commonServices.IsDownload = false;
      this.commonServices.customError(8);
      this.cdRef.detectChanges();
      console.log(err);
    });
  }

  saveAsCSVFile(dat) {
    this.commonServices.IsDownload = true;
    this.commonServices.visibility = "shown";
    if (this.IsSearch) {
      this.export(this.IsSearch, dat, 1, false);
    } else {
      this.export(true, dat, 1, true);
    }
  }

  saveAsXlsxFile(dat) {
    this.commonServices.IsDownload = true;
    this.commonServices.visibility = "shown";
    if (this.IsSearch) {
      this.export(this.IsSearch, dat, 2, false);
    }
    else {
      this.export(true, dat, 2, true);
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

  fetchDataByPharmacy(data) {
    if (data == "0") {
      data = 0; this.isFilter = 0;
      this.resetFilter();
    }
    else {
      this.OrderList = this.tempOrderList.filter(function (a) { return a.PharmacyId == data; });
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

  resetFilter() {
    this.OrderList = this.tempOrderList;
  }

  getReportPdf(dat) {
    console.log(dat);

  }
  updateRange(range: Range) {
    this.range = range;
  }

  reset() {
    const today = new Date();
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.dateRangePicker.resetDates({ fromDate: currMonthStart, toDate: currMonthEnd });
  }

  setDateRange(fulldate) {
    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: 'mediumDate',
      range: fulldate,
      applyLabel: "Submit",
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: false,
        hasBackdrop: false,
      },
      //cancelLabel: "Cancel",
      // excludeWeekends:true,
      // fromMinMax: {fromDate:fromMin, toDate:fromMax},
      // toMinMax: {fromDate:toMin, toDate:toMax}
    };
  }

  setupPresets() {
    const backDate = (numOfDays) => {
      const today = new Date();
      return new Date(today.setDate(today.getDate() - numOfDays));
    }

    const today = new Date();
    const yesterday = backDate(1);
    const minus7 = backDate(7)
    const minus30 = backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.presets = [
      { presetLabel: "Yesterday", range: { fromDate: yesterday, toDate: today } },
      { presetLabel: "Last 7 Days", range: { fromDate: minus7, toDate: today } },
      { presetLabel: "Last 30 Days", range: { fromDate: minus30, toDate: today } },
      { presetLabel: "This Month", range: { fromDate: currMonthStart, toDate: currMonthEnd } },
      { presetLabel: "Last Month", range: { fromDate: lastMonthStart, toDate: lastMonthEnd } }
    ]
  }


}
