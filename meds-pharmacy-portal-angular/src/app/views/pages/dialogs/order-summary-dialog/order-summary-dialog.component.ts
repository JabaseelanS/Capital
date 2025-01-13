import { DatePipe } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../services/common';
import { ApiServices } from '../../../services/api.services';
import { OrderSummaryComponent } from '../../masters/order-summary/order-summary.component';
import { Report } from './report';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker'
// import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
//         {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
//         {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
// import {
//   MAT_DATE_FORMATS,
//   DateAdapter,
//   MAT_DATE_LOCALE
// } from 'saturn-datepicker';
// export const MY_FORMATS = {
// 	parse: {
// 	  dateInput: 'YYYY-MM-DD',
// 	  useUtc: true,
// 	},

// 	display: {
// 		dateInput: "DD/MM/YYYY",
// 		monthYearLabel: "MMMM YYYY",
// 		dateA11yLabel: "MM/DD/YYYY",
// 		monthYearA11yLabel: "MMMM YYYY"
// 	  }
//   };
// @NgModule({
//   providers: [
//     { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
//     { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
//   ]
// })
@Component({
  selector: 'pp-order-summary-dialog',
  templateUrl: './order-summary-dialog.component.html',
  styleUrls: ['./order-summary-dialog.component.scss']
})
export class OrderSummaryDialogComponent implements OnInit {
  minDate: any;
  maxDate: any;
  ReportType: any;
  formandtodate: any = {};
  report: any;
  tempreport: any = {}
  flag = true;
  url = "OrderSummary/";
  reportlist: any;

  testform: FormGroup;
  constructor(public dialogRef: MatDialogRef<OrderSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public testdata: any,
    public service: ApiServices,
    public datePipe: DatePipe,
    public commonServices: CommonServices) { }

  ngOnInit() {
    const today = new Date();
    // this.minDate = new Date(new Date().setDate(today.getDate() - 30));
    this.maxDate = today;
    this.reportlist = this.commonServices.reportlist;
    this.report = new Report(this.testdata);
    if (this.testdata != null) {
      this.report.FromDate = this.datePipe.transform(this.testdata.FromDate, 'yyyy-MM-dd');
      this.report.ToDate = this.datePipe.transform(this.testdata.ToDate, 'yyyy-MM-dd');
      this.tempreport = new Report(this.report);
      var beginvalue = this.report.FromDate;
      var endvalue = this.report.ToDate;
      var fromandto = { begin: beginvalue, end: endvalue }
      this.ReportType = this.report.ReportType;
      this.formandtodate = fromandto;
    }

  }
  close() {
    this.flag = false;
    this.dialogRef.close(this.flag);
  }
  validatedate(date) {
    var Time = new Date(date.end).getTime() - new Date(date.begin).getTime();
    var Days = Time / (1000 * 3600 * 24);
    if (Days >= 31) {
      this.formandtodate = {};
      this.service.showSnack("Maximum 31 days allowed");
      this.flag = true;
    }
    else {
      this.flag = false;
    }
  }

  submit() {
    if (this.ReportType == undefined) {
      this.service.showSnack("Choose the report type");
    }
    else if (this.flag || this.formandtodate == undefined) {
      this.service.showSnack("Enter the From and To date");
    }
    else {
      this.commonServices.visibility = "shown";
      this.commonServices.backDrpCls();
      this.report.ReportType = this.ReportType;
      this.report.FromDate = this.datePipe.transform(this.formandtodate.begin, 'yyyy-MM-dd');
      this.report.ToDate = this.datePipe.transform(this.formandtodate.end, 'yyyy-MM-dd');
      if (this.tempreport.ReportType != this.report.ReportType || this.tempreport.FromDate != this.report.FromDate || this.tempreport.ToDate != this.report.ToDate) {
        this.service.Post(this.report, this.url + 'Post').subscribe((respose: any) => {
          if (respose.flag == true) {
            this.dialogRef.close(respose);
          }
          else {
            this.commonServices.backSetCls(false);
            this.commonServices.visibility = "hidden";
            this.service.showSnack(respose.report.ErroMessage);
          }
        }, error => {
          this.commonServices.backSetCls(false);
          this.commonServices.visibility = "hidden";
          this.commonServices.customError(1);
        })
      } else {
        this.commonServices.backSetCls(false);
        this.commonServices.visibility = "hidden";
      }
    }


  }

}
