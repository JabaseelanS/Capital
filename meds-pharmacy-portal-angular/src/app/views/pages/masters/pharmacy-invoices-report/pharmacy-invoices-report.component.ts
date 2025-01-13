import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServices } from '../../../services/api.services';
import { SubheaderService } from '../../../../core/_base/layout/services/subheader.service';
import { CommonServices } from '../../../services/common';
import { MatPaginator, PageEvent } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'pp-pharmacy-invoices-report',
  templateUrl: './pharmacy-invoices-report.component.html',
  styleUrls: ['./pharmacy-invoices-report.component.scss']
})
export class PharmacyInvoicesReportComponent implements OnInit {
  url = 'PharmacyInvoicesReport/';
  pageSizeOptions: number[] = [5, 10, 50, 100];
  pageSize = 10;
  pageindex = 0;
  previousPageIndex = 1;
  length: number;
  lowValue: number = 0;
  highValue: number = 10;
  search: any;
  year: any;
  report = [];
  tempreport = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private subheaderService: SubheaderService, private Apiservice: ApiServices, private commonservices: CommonServices, private datepipe: DatePipe) { }

  ngOnInit() {
    this.commonservices.visibility = "shown";
    this.subheaderService.setTitle('Pharmacy Invoices Report');
    this.Apiservice.Get(this.url).subscribe((res: any) => {
      this.report = res.report;
      this.tempreport = res.report
      this.year = res.years;
      this.search = this.year[0];
      this.applyFilter(this.search);
      this.commonservices.visibility = "hidden";
    }, error => {
      this.commonservices.customError(1);
      this.commonservices.visibility = "hidden";
    })

  }
  downloadfile(data) {
    this.Apiservice.Post(data, this.url + 'DownloadFile/').subscribe((res: any) => {
      if (res) {
        var a = document.createElement('a');
        a.download = res.FileName;
        a.href = res.Base64;
        document.body.appendChild(a).click();
        this.Apiservice.showSnack(res.ErroMessage);
      }
    }, error => {
      this.commonservices.customError(1);
    });
  }

  applyFilter(value) {
    this.pageSize = this.tempreport.length;
    if (value == undefined || value == null || value == "") {
      this.report = this.tempreport.slice(0, this.pageSize);
      if (this.tempreport.length > 100) {
        this.pageSizeOptions.push(this.report.length);
      }
    } else {
      var filter = this.tempreport.filter(val => {
        var year = this.datepipe.transform(new Date(val.Date), 'yyyy')
        if (value != null) {
          return year == value;
        }
      });
      this.report = filter.slice(0, this.pageSize);
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
    this.pageindex = event.pageIndex;
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }
}
