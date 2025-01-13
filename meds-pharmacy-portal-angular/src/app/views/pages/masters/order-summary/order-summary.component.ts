import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, PageEvent } from '@angular/material';
import { ApiServices } from '../../../services/api.services';
import { SubheaderService } from '../../../../core/_base/layout/services/subheader.service';
import { OrderSummaryDialogComponent } from '../../dialogs/order-summary-dialog/order-summary-dialog.component';
import { GlobalConstant } from '../../globals/globalvariables';
import { CommonServices } from '../../../services/common';
import { Report } from '../../dialogs/order-summary-dialog/report';
import { LoaderService } from '../../../services/loader.service';
import { LayoutUtilsService } from '../../../../core/_base/crud/utils/layout-utils.service';

@Component({
  selector: 'pp-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})

export class OrderSummaryComponent implements OnInit {
  report = [];
  tempreport = [];
  url = "OrderSummary/";
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 5;
  pageindex = 0;
  previousPageIndex = 1;
  length: number;
  lowValue: number = 0;
  highValue: number = 5;
  search: any;
  @ViewChild('searchkey', { static: true }) searchKey;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dialog: MatDialog, public snackbar: MatSnackBar,
    public loaderService: LoaderService, public layoutUtilsService: LayoutUtilsService,
    public subheaderService: SubheaderService,
    public apiservice: ApiServices,
    public cdRef: ChangeDetectorRef, public commonservices: CommonServices) { }

  ngOnInit() {
    this.commonservices.visibility = "shown";

    this.subheaderService.setTitle('Order Summary');
    this.get();
  }
  get() {
    this.apiservice.GetById(this.url).subscribe((data: any) => {
      if (data != null) {
        this.report = data.report;
        this.tempreport = data.report;
        this.commonservices.visibility = "hidden";
      }
    }, error => {
      this.commonservices.visibility = "hidden";
      this.commonservices.customError(1);
    })
  }

  // Addreport() {
  // //  var index=this.report.length-1
  //  if(this.report.length==0 || this.report[0].Reportsummaryid!=0  ){
  //   this.report.unshift(this.emptyobject);
  //  }
  //  else{
  //   this.apiservice.showSnack("Fill the Empty Row");
  //  }
  // }
  reporttype(type) {
    var typefilter = this.commonservices.reportlist.filter(x => x.id == type);
    if (typefilter.length > 0) {
      return typefilter[0].reportname;
    }
    return "";
  }
  Newreport(value) {
    this.dialog.open(OrderSummaryDialogComponent, {
      height: 'auto',
      data: value,
      disableClose: true,
      width: '700px',
    }).afterClosed().subscribe(res => {
      if (res.flag == true) {
        this.report = res.list.report;
        this.tempreport = res.list.report;
        this.apiservice.showSnack(res.report.ErroMessage);
      }
      this.cdRef.detectChanges();
      this.commonservices.backaddCls();
      this.commonservices.visibility = "hidden";
    });
  }
  applyFilter(value) {
    this.pageSize = this.tempreport.length;
    if (value == undefined || value == null || value == "") {
      this.report = this.tempreport.slice(0, this.pageSize);
      if (this.tempreport.length > 100) {
        this.pageSizeOptions.push(this.tempreport.length);
      }
    } else {
      var filter = this.tempreport.filter(function (val) {
        if (value == 1) {
          return val.ReportType == 1;
        }
        else if (value == 2) {
          return val.ReportType == 2;
        }
        else if (value == 3) {
          return val.ReportType == 3;
        } else {
          return val.ReportType == 4;
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
      pageIndex: this.pageindex,
      pageSize: 5,
      length: evd
    }
    this.paginator.firstPage();
    this.getPaginatorData(eve);
    console.log(this.getPaginatorData(eve));
  }
  getPaginatorData(event: PageEvent): PageEvent {
    this.pageindex = event.pageIndex;
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  downloadfile(data: any) {
    this.apiservice.Post(data, this.url + 'DownloadFile/').subscribe((res: any) => {
      if (res) {
        var a = document.createElement('a');
        a.download = res.FileName;
        a.href = res.Base64;
        document.body.appendChild(a).click();
        this.apiservice.showSnack("Downloaded successfully");
      }
    }, error => {
      this.commonservices.customError(1);
    });
  }

  delete(item: Report, i) {
    var index = this.report.length - 1;
    var s = this.report[index].OrderSummaryId == item.OrderSummaryId ? true : false
    const title: string = 'Order Summary Delete';
    const description: string = 'Are you sure you want to delete this report? ';
    const waitDescription: string = "Report is being deleted...";
    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDescription);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loaderService.display(true);
        this.apiservice.Post(item, this.url + 'Delete/').subscribe((res: any) => {
          this.apiservice.showSnack(GlobalConstant.deleted);
          this.report = res.data.report;
          this.tempreport = res.data.report;
          if (!this.paginator.hasNextPage() && i == 0 && s) {
            this.paginator.pageIndex = this.paginator.pageIndex - 1;
            this.lowValue = this.paginator.pageIndex * this.pageSize;
            this.highValue = this.lowValue + this.pageSize;
          }
          this.cdRef.detectChanges();
        }, error => {
          this.loaderService.display(false);
          this.commonservices.customError(1);
        });
      } else {
        return;
      }
    });
  }

}
