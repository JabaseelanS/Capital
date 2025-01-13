import { MapsAPILoader } from '@agm/core';
import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonServices } from '../../../../../../views/services/common';
import { ApiServices } from '../../../../../../views/services/api.services';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'pp-change-pharmacy',
  templateUrl: './change-pharmacy.component.html',
  styleUrls: ['./change-pharmacy.component.scss'],
  providers: [DatePipe]
})
export class ChangePharmacyComponent implements OnInit {
  @Input() order;
  pharmacyList = [];
  tempPharmacyList = [];
  public searchControl: FormControl;
  public zoom: number;
  filterPharmacyId = 0;
  url = 'PharmacistReviewV2/';
  @Input() adressType: string;
  deliveryBy = 1;
  @ViewChild("search", { static: true }) public searchElementRef: ElementRef;
  constructor(public commonServices: CommonServices,
    public mapsAPILoader: MapsAPILoader,
    public cdRef: ChangeDetectorRef,
    public apiServices: ApiServices,
    public router: Router,
    public ngZone: NgZone, public dialogRef: MatDialogRef<ChangePharmacyComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any) { }

  ngOnInit() {
    var pharmacylist = this.modalData.pharmacies.filter(function (a) { return a.AvailableDelivery || a.AvailablePickup; });
    this.pharmacyList = pharmacylist;
    this.tempPharmacyList = pharmacylist;
    this.filterPharmacyId = this.modalData.PharmacyId;
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

  changepharmacy(model) {
    if (this.filterPharmacyId != null && this.filterPharmacyId != undefined && this.filterPharmacyId > 0 && this.filterPharmacyId != this.modalData.PharmacyId) {
      var list = {
        PharmacyId: this.filterPharmacyId,
        OrderId: this.modalData.OrderId
      }
      this.dialogRef.close(list);
      // this.commonServices.visibility = "shown";
      // this.apiServices.Post(list, this.url + "ChangePharmacy").subscribe(res => {
      //   this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      //   this.apiServices.showSnack(res.ErroMessage);
      //   if (res.Operation == 1) { this.router.navigate(['/app/masters/live-order-2']); }
      // }, error => {
      //   this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      //   this.apiServices.showSnack("Pharmacy updated failed.");
      // });
    }
  }

  closeDialog(hide: string): void {
    this.dialogRef.close(null);
  }

  validMBy(val, message) {
    var s = new String(val);
    if (val == null || s.trim() == "" || val == undefined || val == "0" || val == "Not Available") {
      this.apiServices.showSnack(message);
      return true;
    }
    return false;
  }

  validBy(val, message) {
    var s = new String(val);
    if (val == null || s.trim() == "" || val == undefined || val == "0" || val == "Not Available") {
      this.apiServices.showSnack(message + " is required");
      return true;
    }
    return false;
  }

}
