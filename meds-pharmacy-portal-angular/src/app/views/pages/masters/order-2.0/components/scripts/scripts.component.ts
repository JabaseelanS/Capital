import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ApiServices } from '../../../../../../../app/views/services/api.services';
import { CommonServices } from '../../../../../../../app/views/services/common';
import { DetailsDialog, TabsDialog } from '../../tabs/tabs/tabs.component';
import { state, style, trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'pp-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss'],

  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      state('rotated1', style({ transform: 'rotate(180deg)' })),
      state('rotated2', style({ transform: 'rotate(270deg)' })),
    ])
  ]
})
export class ScriptsComponent implements OnInit {
  @Output() viewPresc = new EventEmitter();
  public mediMask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, ' ', /\d/, ' ', '-', ' ', /\d/];
  @Input() scripts: any;
  @Input() orderModel: any;
  @Input() scriptData: any;
  @Input() tabIndex: any;
  selectedScript: any;
  medData: any;
  timerSubscription: any;
  hideOnSubscription: any;
  url = 'PharmacistReviewV2/';
  className = '';
  state: string = 'default';
  constructor(public dialog: MatDialog,
    public commonServices: CommonServices,
    public apiService: ApiServices,
    private cdf: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    if (this.scripts.familyMembers == null || this.scripts.familyMembers == undefined) {
      this.scripts.familyMembers = {};
    }
    if (this.scripts != null && this.scripts.IsUploadType == 9) {
      this.CreateOrderUpload();
    }
  }

  CreateOrderUpload() {
    this.commonServices.visibility = "shown";
    this.apiService.GetList(this.url + "DownloadFile?orderid=" + this.scripts.OrderId + "&orderprescriptionid=" + this.scripts.OrderPrescriptionId).subscribe((res: any) => {
      this.commonServices.visibility = "hidden"; this.scripts.Base64 = res.Base64;
    }, err => {
      this.commonServices.visibility = "hidden";
      this.cdf.detectChanges();
    });
  }

  openDialog(selectedScript): void {
    this.dialog.open(TabsDialog, {
      data: { data: selectedScript.medData, action: 'view' },
      width: '80%',
      height: '48%'
    }).afterClosed().subscribe(res => {
      if (res) { }
    })
  }

  openDetailDialog(selectedScript): void {
    this.dialog.open(DetailsDialog, {
      data: selectedScript,
      disableClose: true,
      width: '80%',
      height: '716px'
    }).afterClosed().subscribe(res => {
      if (res) { }
    })
  }
  loger(er) {
    console.log(er);

  }


}
