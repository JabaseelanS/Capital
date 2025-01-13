import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiServices } from '../../../services/api.services';
import { CommonServices } from '../../../../views/services/common';
import { GlobalConstant } from '../../globals/globalvariables';

@Component({
  selector: 'pp-pharmacy-list-special-hours.component',
  templateUrl: './pharmacy-list-special-hours.component.html',
  styleUrls: ['./pharmacy-list-special-hours.component.scss']
})
export class HolidayListSpecialHoursDialogComponent implements OnInit {

  pharmacy: any;
  tempPharmacy: any;
  allSelectedIncluded: boolean = false;
  searchIncluded: string;
  oldPharmacy: string = "";
  checkIncludeExclude: number;
  btnName: any;
  value: any;
  url: string = "PharmacySpecialHours/";
  constructor(
    private dialogRef: MatDialogRef<HolidayListSpecialHoursDialogComponent>,
    private apiService: ApiServices,
    private commonService: CommonServices,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {
    this.pharmacy = this.modalData.ExcludedPharmacyId;
    this.tempPharmacy = this.modalData.ExcludedPharmacyId;
    this.checkIncludeExclude = this.modalData.i;
    this.value = this.modalData.value;
  }

  ngOnInit() {
    // this.btnName = this.checkIncludeExclude == 1 ? "Exclude pharmacy" : "Include pharmacy"
    this.checkSelctionLength();
  }

  closeDialog(): void {
    this.pharmacy.forEach((x: any) => {
      x.IsIncluded = false;
    });
    this.dialogRef.close(null);
  }

  toggleAllSelectIncluded() {
    this.pharmacy.forEach((x: any) => {
      x.IsIncluded = this.allSelectedIncluded;
    });
    this.checkSelctionLength();
  }

  singleChangeIncluded() {
    this.checkSelctionLength();
  }

  checkSelctionLength() {
    var selectedFilter = this.tempPharmacy.filter((x: any) => x.IsIncluded == true);
    var selectedArray = this.pharmacy.filter((x: any) => x.IsIncluded == true);
    selectedArray.length == this.pharmacy.length && this.pharmacy.length != 0 ? this.allSelectedIncluded = true : this.allSelectedIncluded = false;
    var pharmacyName = "";
    if (this.checkIncludeExclude == 2) {
      this.btnName = selectedArray.length == 1 || selectedArray.length == 0 ? "Exclude pharmacy" : "Exclude pharmacies";
    }
    else
      this.btnName = selectedArray.length == 1 || selectedArray.length == 0 ? "Include pharmacy" : "Include pharmacies";

    if (selectedFilter.length > 0) {
      selectedFilter.forEach((y: any, i) => {
        this.oldPharmacy = i == 0 ? y.PharmacyId : this.oldPharmacy + "," + y.PharmacyId;
        pharmacyName = i == 0 ? y.PharmacyName : pharmacyName + ", " + y.PharmacyName;
      });
    }
    else
      this.oldPharmacy = "";
  }

  save() {
    if (this.tempPharmacy.length === 0) {
      this.apiService.showSnack("No record found");
      return;
    }
    if (this.oldPharmacy == "") {
      this.apiService.showSnack("Please select atleast one pharmacy");
      return;
    }
    else {
      this.commonService.visibility = "shown";
      this.commonService.backDrpCls();
      if (this.checkIncludeExclude == 2) {
        var searches = this.value.SearchForPharmacies.split(",");
        String(this.oldPharmacy).split(",").forEach((item: any) => {
          var index = searches.indexOf(item);
          if (index !== -1) {
            searches.splice(index, 1);
          }
        });
        this.value.SearchForPharmacies = searches.join(",");
      }
      else {
        this.value.SearchForPharmacies = this.value.SearchForPharmacies == "" ? String(this.oldPharmacy) : this.value.SearchForPharmacies + ',' + String(this.oldPharmacy);
      }
      this.apiService.Post(this.value, this.url).subscribe((res: any) => {
        if (res != null) {
          this.dialogRef.close(res);
        } else {
          this.commonService.backSetCls(false);
          this.commonService.visibility = "hidden";
          this.apiService.showSnack(GlobalConstant.savefail);
        }
      }, error => {
        this.commonService.backSetCls(false);
        this.commonService.visibility = "hidden";
        this.apiService.showSnack(GlobalConstant.savefail);
      })
    }

  }

  searchFilteronPharmacy(value) {
    let data = [];
    this.tempPharmacy.filter((val: any) => { if (val.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) { data.push(val); } });
    this.pharmacy = data;
    this.checkSelctionLength();
  }
}
