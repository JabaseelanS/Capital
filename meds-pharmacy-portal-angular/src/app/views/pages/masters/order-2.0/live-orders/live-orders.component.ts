import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServices } from '../../../../../../app/views/services/api.services';
import { SubheaderService } from '../../../../../../app/core/_base/layout';
import { CommonServices } from '../../../../../../app/views/services/common';
import { TableDataSource } from 'angular4-material-table';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { animation } from '../../../../../../app/directives/transition.directive';


@Component({
  selector: 'pp-live-orders',
  templateUrl: './live-orders.component.html',
  styleUrls: ['./live-orders.component.scss'],
  animations: [animation],
  host: { '[@animation]': '' },
})
export class LiveOrdersComponent implements OnInit {

  userdetails: any;
  url = 'PharmacistReviewV2/';
  filterPharmacyId: any;
  setData: any;
  LiveorderData: TableDataSource<any>;
  length: number;
  orderStatusList = [{ id: 1, value: 'Awaiting review' }, { id: 2, value: 'Ready for fulfilment' }, { id: 3, value: 'Packing order' }, { id: 4, value: 'Ready for dispatch' }, { id: 5, value: 'Order Completed' }, { id: 6, value: 'Order confirmed' }, { id: 10, value: 'Out for delivery' },
  { id: 7, value: 'Send order to admin' }, { id: 8, value: 'Order cancelled' }, { id: 9, value: 'Order refunded' }];
  dataset: MatTableDataSource<any>;
  orderDetailData = [];
  pharmacyList = [];
  results: any;
  constructor(
    private _subheaderService: SubheaderService,
    public cdf: ChangeDetectorRef,
    private apiService: ApiServices,
    public router: Router,
    public commonServices: CommonServices,
  ) {
    this.commonServices.visibility = "shown";
    this._subheaderService.isDetail = false; this.commonServices.isPage = 1;
  }

  ngOnInit() {
    this._subheaderService.setTitle("Live Orders");

  }
  addItem(newItem: boolean) {
    console.log(newItem);
  }

  over(event) {
    console.log(event);
  }


}
