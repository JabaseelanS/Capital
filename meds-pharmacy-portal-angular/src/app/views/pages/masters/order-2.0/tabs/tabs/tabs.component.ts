import { ChangeDetectorRef, Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { TableDataSource } from 'angular4-material-table';
import { SubheaderService } from '../../../../../../../app/core/_base/layout';
import { CommonServices } from '../../../../../../../app/views/services/common';
import { PrescriptionModel } from '../../live.order.model';

@Component({
  selector: 'pp-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  selectedScript: any;
  PrescriptionTab: any;
  userdetails: any;
  activeTab = 0;
  constructor(
    private _subheaderService: SubheaderService,
    public cdf: ChangeDetectorRef,
    public router: Router,
    public commonServices: CommonServices,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    var List = JSON.parse(localStorage.getItem("LiveOrder"));
    if (List != undefined && List != null) {
      this.commonServices.PrescriptionTabData = List; this.commonServices.isPage = List.orderModel.isPage;
      this._subheaderService.isDetail = true; this.commonServices.NotificationText = this.commonServices.PrescriptionTabData.orderModel.NotificationText;
      this._subheaderService.setTitle('Order No : #' + this.commonServices.PrescriptionTabData.orderModel.OrderNo);
      this.PrescriptionTab = this.commonServices.PrescriptionTabData.objList.orderPFModel;
      this.cdf.detectChanges();
    }
  }

  repeatValidation(data: any) {
    // var fillter = this.commonServices.repeatValidation(data, flag);
    // if (fillter == 1) {
    //   this.notifier.notify('error', "Please enter the Total Repeats and Remaining Repeats before enter the Days Remaining.");
    // } else if (fillter == 2) {
    //   this.notifier.notify('error', "Please enter the Total Repeats before enter the Remaining Repeats.");
    // } else if (fillter == 3) {
    //   this.notifier.notify('error', "Please enter less than or equal Total Repeats.");
    // }
  }

  changeImg() {

  }
  onTabChanged(event) {
    // this.commonServices.visibility = 'shown';
    this.commonServices.isImgLoaded = false;
    console.log(event);
    // var ldimg = document.getElementById('loadSImg').className;
    // document.getElementById('loadSImg').className = ldimg.replace(/dis-non/g, 'dis-blk');
    // console.log("After loadimg ", document.getElementById('loadSImg').className);
    // var srimg = document.getElementById('srcSImg').className;
    // document.getElementById('srcSImg').className = srimg.replace(/dis-blk /g, 'dis-non ');
    // console.log("After srcSImg ", document.getElementById('srcSImg').className);
    // this.cdf.detectChanges();
    this.commonServices.PrintPrescV2(this.PrescriptionTab[event.index], this.commonServices.PrescriptionTabData.orderModel);
    this.commonServices.onImageLoad(event.index);
    this.cdf.detectChanges();
  }

  openDialog(selectedScript): void {
    this.dialog.open(TabsDialog, {
      data: selectedScript ? { data: selectedScript.medData, action: 'edit' } : { data: [], action: 'edit' },
      width: '80%',
      height: '48%'
    }).afterClosed().subscribe(res => {
      if (res) { }
    })
  }
}


@Component({
  selector: 'pp-tabs-dialog',
  templateUrl: './tabs-dialog.component.html'
})
export class TabsDialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<TabsDialog>, @Inject(MAT_DIALOG_DATA) public dialogData: any) { }
  prescriptionDetailsDataSource: TableDataSource<any>;
  isView = false;
  selectedScript: any;
  ngOnInit(): void {
    if (this.dialogData.action === 'view') {
      this.isView = true;
    }
    this.prescriptionDetailsDataSource = new TableDataSource(this.dialogData.data, PrescriptionModel);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSave(): void {

  }

}

@Component({
  selector: 'pp-detail.dialog',
  templateUrl: './detail.dialog.component.html'
})
export class DetailsDialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<DetailsDialog>, @Inject(MAT_DIALOG_DATA) public dialogData: any) { }
  prescriptionDetailsDataSource: TableDataSource<any>;
  ngOnInit(): void {
    // this.prescriptionDetailsDataSource = new TableDataSource(this.dialogData, PrescriptionModel);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSave(): void {

  }

}



