import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { TableDataSource } from 'angular4-material-table';
import { SubheaderService } from '../../../../../../app/core/_base/layout';
import { ApiServices } from '../../../../../../app/views/services/api.services';
import { CommonServices } from '../../../../../../app/views/services/common';

@Component({
  selector: 'pp-order-historyv2',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryV2Component implements OnInit {
  constructor(
    private _subheaderService: SubheaderService,
    public cdf: ChangeDetectorRef,
    private apiService: ApiServices,
    public router: Router,
    public commonServices: CommonServices,
  ) {
    this.commonServices.visibility = "shown";
    this._subheaderService.isDetail = false; this.commonServices.isPage = 2;
  }

  ngOnInit() {
    this._subheaderService.setTitle("Order History")
  }
  addItem(newItem: boolean) {
    console.log(newItem);
  }

}
