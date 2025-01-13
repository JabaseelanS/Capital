import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { PrintService } from '../../../../views/services/print.service';
import { CommonServices } from '../../../../views/services/common';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ApiServices } from '../../../../views/services/api.services';
@Component({
  selector: 'pp-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss']
})
export class PrintDialogComponent implements OnInit {
  url = 'Order/';
  pntdata: any;
  displayedColumns = ['PharmacyName', 'State', 'Email', 'Country', 'actions'];
  customerList = [];
  data: any;
  data2: any
  constructor(public common: CommonServices, private cdRef: ChangeDetectorRef, private apiServices: ApiServices,) {
    this.common.backSetCls(false);
  }


  ngOnInit() {
    this.data = this.common.printdata
    this.cdRef.detectChanges();
    this.loadData();
    // this.Intit();
  }
  public loadData() {
    let data = [];
    // this.spinner.show();

    this.apiServices.GetList(this.url).subscribe((res: any) => {
      this.customerList = res._customer_list

    }, error => {
      // this.notificationService.showNotification(error, 2);
      // this.spinner.hide();
      this.common.customError(1);
      // this.loaderService.display(false);
    }
    )
  }

  findByCustomer(id, flag) {
    var filter = this.customerList.filter(function (val) { return val.CustomerId == id });
    if (filter.length > 0) {
      if (flag) { return filter[0].CustomerFullname; }
      else { return filter[0].Mobileno; }
    }
    return "";
  }


}
