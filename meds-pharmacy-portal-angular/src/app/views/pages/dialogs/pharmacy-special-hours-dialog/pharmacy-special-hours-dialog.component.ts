import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiServices } from '../../../../../../src/app/views/services/api.services';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatTableDataSource, MatDialog, MatOption } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PharmacySplHoursModel } from '../../modals/pharmacy-splhours-model';
import { DatePipe } from '@angular/common';
import { CommonServices } from '../../../../../../src/app/views/services/common';
import { filter, includes } from 'lodash';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { GlobalConstant } from '../../globals/globalvariables';

@Component({
  selector: 'pp-pharmacy-special-hours-dialog',
  templateUrl: './pharmacy-special-hours-dialog.component.html',
  styleUrls: ['./pharmacy-special-hours-dialog.component.scss'],
})
export class PharmacySpecialHoursDialogComponent implements OnInit {
  minDate: Date;
  stateList: any = [];
  pharmacyList: any = [];
  IncludedpharmacyList: any = [];
  tempIncludedpharmacyList: any = [];
  ExcludedpharmacyList: any = [];
  tempExcludedpharmacyList: any = [];
  pharmacySplHolidayList: any = [];
  FormandToDate: any = {};
  userDetail: any = {};
  searchIncluded: string;
  searchExcluded: string;
  allSelectedState: boolean = false;
  allSelectedIncluded: boolean = false;
  allSelectedExcluded: boolean = false;
  oldInPharmacy: string = "";
  oldExPharmacy: string = "";
  url: string = "PharmacySpecialHours/";
  opentime: any;
  closeingtime: any;
  specialHrsForm: FormGroup;
  pharmacySplHoursModel: PharmacySplHoursModel;
  markAsClosed: boolean = false;
  @ViewChild('selectState', { static: true }) selectState: MatSelect;
  @ViewChild('selectIncluded', { static: true }) selectIncluded: MatSelect;
  @ViewChild('selectExcluded', { static: true }) selectExcluded: MatSelect;
  constructor(private apiService: ApiServices,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PharmacySpecialHoursDialogComponent>,
    private dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    public datePipe: DatePipe,
    public commonServices: CommonServices,
    public layoutUtilsService: LayoutUtilsService,
    @Inject(MAT_DIALOG_DATA) public modalData: any) {
    this.userDetail = JSON.parse(localStorage.getItem("userdetails"));
    this.pharmacySplHoursModel = new PharmacySplHoursModel();
    this.formCreation();
  }


  async ngOnInit() {
    this.commonServices.backSetCls(false);
    this.minDate = new Date();
    this.pharmacyList = this.modalData.result.pharmacies;
    this.stateList = this.modalData.result.states;
    this.pharmacySplHolidayList = this.modalData.result.pharmacySpecialHolidays;
    if (this.modalData.result.pharmacySpecialHour != null) {
      var record = JSON.parse(JSON.stringify(this.modalData.result.pharmacySpecialHour));
      var fromandto = { begin: this.datePipe.transform(record.FromDate, 'yyyy-MM-dd'), end: this.datePipe.transform(record.ToDate, 'yyyy-MM-dd') }
      this.FormandToDate = fromandto;
      record.StateId = record.StateId.split(",").map((x: any) => { return Number(x) });
      this.markAsClosed = record.IsClosed;
      this.pharmacySplHoursModel = new PharmacySplHoursModel(record);
      this.formCreation();
      this.oldInPharmacy = record.ExcludedPharmacyId;
      var excludedName = "";
      var exIds = record.ExcludedPharmacyId.split(",");
      exIds.forEach((ele: any) => {
        var filterExcluded = JSON.parse(JSON.stringify(this.pharmacyList)).filter((x: any) => x.PharmacyId == Number(ele));
        if (filterExcluded.length > 0) {
          filterExcluded[0].IsIncluded = true;
          excludedName = excludedName != "" ? excludedName + ", " + filterExcluded[0].PharmacyName : filterExcluded[0].PharmacyName;
          this.tempIncludedpharmacyList.push(filterExcluded[0]);
        }
      });
      this.allSelectedState = this.specialHrsForm.get("StateId").value.length == this.stateList.length ? true : false;
      this.specialHrsForm.controls.SearchForPharmacies.patchValue(excludedName);
      var srcArray = [];
      record.StateId.forEach((val: any) => {
        var States = JSON.parse(JSON.stringify(this.pharmacyList)).filter((x: any) => x.StateId == Number(val));
        Array.prototype.push.apply(srcArray, States);
      });
      this.tempExcludedpharmacyList = srcArray;
      this.tempIncludedpharmacyList.forEach((row: any) => {
        var indexfilter = this.tempExcludedpharmacyList.findIndex(x => x.PharmacyId == row.PharmacyId);
        if (indexfilter !== -1) {
          this.tempExcludedpharmacyList.splice(indexfilter, 1);
        }
      });
      this.specialHrsForm.controls.ExcludedPharmacies.patchValue('');
    }
    this.commonServices.visibility = "hidden";
  }

  formCreation() {
    this.specialHrsForm = this._formBuilder.group({
      SpecialhrsId: new FormControl(this.pharmacySplHoursModel.SpecialhrsId),
      FromDate: new FormControl(this.pharmacySplHoursModel.FromDate),
      ToDate: new FormControl(this.pharmacySplHoursModel.ToDate),
      StateId: new FormControl(this.pharmacySplHoursModel.StateId),
      SearchForPharmacies: new FormControl(this.pharmacySplHoursModel.SearchForPharmacies),
      ExcludedPharmacies: new FormControl(this.pharmacySplHoursModel.ExcludedPharmacies),
      LabelAs: new FormControl(this.pharmacySplHoursModel.LabelAs),
      IsClosed: new FormControl(this.pharmacySplHoursModel.IsClosed),
      IsActive: new FormControl(this.pharmacySplHoursModel.IsActive),
      OpeningHours: new FormControl(this.pharmacySplHoursModel.OpeningHours),
      ClosingHours: new FormControl(this.pharmacySplHoursModel.ClosingHours),
      RepeatEveryYear: new FormControl(this.pharmacySplHoursModel.RepeatEveryYear),
      CreatedOn: new FormControl(this.pharmacySplHoursModel.CreatedOn),
      CreatedBy: new FormControl(this.pharmacySplHoursModel.CreatedBy),
    })
  }

  onChangeMarkAsClosed(event) {
    this.markAsClosed = event.checked;
    if (event.checked) {
      this.specialHrsForm.controls['OpeningHours'].setValue("");
      this.specialHrsForm.controls['ClosingHours'].setValue("");
    }
  }

  searchFilteronPharmacy(value) {
    let data = [];
    this.tempIncludedpharmacyList.filter((val: any) => { if (val.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) { data.push(val); } });
    this.IncludedpharmacyList = data;
    this.checkSelctionLength();
  }

  searchFilteronExcluded(value) {
    let data = [];
    this.tempExcludedpharmacyList.filter((val: any) => { if (val.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) { data.push(val); } });
    this.ExcludedpharmacyList = data;
    this.checkSelctionLengthForEx();
  }

  IdstringToNamestring(value: string): string {
    var SearchpharmacyName = "";
    value.split(",").map((x: any) => {
      var selectedFilter = this.pharmacyList.filter((y: any) => y.PharmacyId == x);
      if (selectedFilter.length > 0) {
        SearchpharmacyName = SearchpharmacyName == "" ? selectedFilter[0].PharmacyName : SearchpharmacyName + ", " + selectedFilter[0].PharmacyName
      }
    });
    return SearchpharmacyName;
  }
  LoadIncluded() {
    var selectedRecord = this.tempIncludedpharmacyList.filter((a: any) => a.IsIncluded == true);
    var selectedRecordExcluded = JSON.parse(JSON.stringify(this.tempExcludedpharmacyList));
    this.tempIncludedpharmacyList = []; var name = ""; this.oldInPharmacy = ""; this.tempExcludedpharmacyList = [];
    var nameex = ""; this.oldExPharmacy = "";
    this.specialHrsForm.controls.StateId.value.forEach((item: number) => {
      if (item != 0) {
        var SaveArr = this.pharmacyList.filter((x: any) => x.StateId == item);
        SaveArr.forEach((row: any) => {
          var record = selectedRecord.findIndex((j: any) => j.PharmacyId == row.PharmacyId);
          var recordEx = selectedRecordExcluded.findIndex((j: any) => j.PharmacyId == row.PharmacyId);
          if (record !== -1) {
            row.IsIncluded = true; name = name != "" ? name + ", " + row.PharmacyName : row.PharmacyName;
            this.oldInPharmacy = this.oldInPharmacy != "" ? this.oldInPharmacy + "," + row.PharmacyId : row.PharmacyId;
            this.tempIncludedpharmacyList.push(row);
          } else if (recordEx !== -1) {
            row.IsIncluded = selectedRecordExcluded[recordEx].IsIncluded;
            nameex = row.IsIncluded == true ? nameex != "" ? nameex + ", " + row.PharmacyName : row.PharmacyName : nameex;
            this.oldExPharmacy = row.IsIncluded == true ? this.oldExPharmacy != "" ? this.oldExPharmacy + "," + row.PharmacyId : row.PharmacyId : this.oldExPharmacy;
            this.tempExcludedpharmacyList.push(row);
          }
          else {
            row.IsIncluded = false;
            this.tempIncludedpharmacyList.push(row);
          }
        });
      }
    });
    this.specialHrsForm.controls.SearchForPharmacies.patchValue(name);
    this.specialHrsForm.controls.ExcludedPharmacies.patchValue(nameex);
    this.IncludedpharmacyList = this.tempIncludedpharmacyList;
    this.ExcludedpharmacyList = this.tempExcludedpharmacyList;
  }
  setPharmacyBasedState() {
    var selectedRecord = JSON.parse(JSON.stringify(this.tempIncludedpharmacyList));
    var selectedRecordExcluded = JSON.parse(JSON.stringify(this.tempExcludedpharmacyList));
    this.tempIncludedpharmacyList = []; var name = ""; this.oldInPharmacy = ""; this.tempExcludedpharmacyList = [];
    var nameex = ""; this.oldExPharmacy = "";
    this.specialHrsForm.controls.StateId.value.forEach((item: number) => {
      if (item != 0) {
        var SaveArr = this.pharmacyList.filter((x: any) => x.StateId == item);
        SaveArr.forEach((row: any) => {
          var record = selectedRecord.findIndex((j: any) => j.PharmacyId == row.PharmacyId);
          var recordEx = selectedRecordExcluded.findIndex((j: any) => j.PharmacyId == row.PharmacyId);
          if (record !== -1) {
            row.IsIncluded = selectedRecord[record].IsIncluded;
            name = row.IsIncluded == true ? name != "" ? name + ", " + row.PharmacyName : row.PharmacyName : name;
            this.oldInPharmacy = row.IsIncluded == true ? this.oldInPharmacy != "" ? this.oldInPharmacy + "," + row.PharmacyId : row.PharmacyId : this.oldInPharmacy;
            this.tempIncludedpharmacyList.push(row);
          } else if (recordEx !== -1) {
            row.IsIncluded = selectedRecordExcluded[recordEx].IsIncluded;
            nameex = row.IsIncluded == true ? nameex != "" ? nameex + ", " + row.PharmacyName : row.PharmacyName : nameex;
            this.oldExPharmacy = row.IsIncluded == true ? this.oldExPharmacy != "" ? this.oldExPharmacy + "," + row.PharmacyId : row.PharmacyId : this.oldExPharmacy;
            this.tempExcludedpharmacyList.push(row);
          }
          else {
            row.IsIncluded = false;
            this.tempIncludedpharmacyList.push(row);
          }
        });
      }
    });
    this.specialHrsForm.controls.SearchForPharmacies.patchValue(name);
    this.specialHrsForm.controls.ExcludedPharmacies.patchValue(nameex);
    this.IncludedpharmacyList = this.tempIncludedpharmacyList;
    this.ExcludedpharmacyList = this.tempExcludedpharmacyList;
  }
  // setOnEditLoad() {
  //   var selectedRecord = JSON.parse(JSON.stringify(this.tempIncludedpharmacyList));
  //   var selectedRecordExcluded = this.tempExcludedpharmacyList.filter((a: any) => a.IsIncluded == true);
  //   this.oldInPharmacy = ""; this.oldExPharmacy = "";
  //   this.tempIncludedpharmacyList = []; this.tempExcludedpharmacyList = [];
  //   var name = ""; var nameex = "";
  //   this.specialHrsForm.controls.StateId.value.forEach((item: number) => {
  //     if (item != 0) {
  //       var SaveArr = this.pharmacyList.filter((x: any) => x.StateId == item);
  //       SaveArr.forEach((row: any) => {
  //         var record = selectedRecord.findIndex((j: any) => j.PharmacyId == row.PharmacyId);
  //         var recordEx = selectedRecordExcluded.findIndex((j: any) => j.PharmacyId == row.PharmacyId);
  //         if (record !== -1) {
  //           row.IsIncluded = selectedRecord[record].IsIncluded;
  //           name = row.IsIncluded == true ? name != "" ? name + ", " + row.PharmacyName : row.PharmacyName : name;
  //           this.oldInPharmacy = this.oldInPharmacy != "" ? this.oldInPharmacy + "," + row.PharmacyId : row.PharmacyId;
  //           this.tempIncludedpharmacyList.push(row);
  //         } else if (recordEx !== -1) {
  //           row.IsIncluded = true;
  //           nameex = nameex != "" ? nameex + ", " + row.PharmacyName : row.PharmacyName;
  //           this.oldExPharmacy = this.oldExPharmacy != "" ? this.oldExPharmacy + "," + row.PharmacyId : row.PharmacyId;
  //           this.tempExcludedpharmacyList.push(row);
  //         }
  //         else {
  //           row.IsIncluded = false;
  //           this.tempExcludedpharmacyList.push(row);
  //         }
  //       });
  //     }
  //   });
  //   this.specialHrsForm.controls.SearchForPharmacies.patchValue(name);
  //   this.specialHrsForm.controls.ExcludedPharmacies.patchValue(nameex);
  //   this.IncludedpharmacyList = this.tempIncludedpharmacyList;
  //   this.ExcludedpharmacyList = this.tempExcludedpharmacyList;
  // }
  submit() {
    var formValue = JSON.parse(JSON.stringify(this.specialHrsForm.value));
    if (Object.keys(this.FormandToDate).length === 0) {
      this.apiService.showSnack("Please enter date");
      return;
    }
    if (formValue.StateId.length == 0) {
      this.apiService.showSnack("Please select state");
      return;
    }
    if (formValue.SpecialhrsId == 0 && (String(formValue.SearchForPharmacies).trim() == "" || formValue.SearchForPharmacies == null)) {
      this.apiService.showSnack("Please select included pharmacies");
      return;
    }
    if (formValue.SpecialhrsId != 0 && ((String(formValue.SearchForPharmacies).trim() == "" || formValue.SearchForPharmacies == null) && (String(formValue.ExcludedPharmacies).trim() == "" || formValue.ExcludedPharmacies == null))) {
      this.apiService.showSnack("Please select atleast one pharmacy");
      return;
    }
    if (formValue.LabelAs.trim() == "" || formValue.LabelAs == null) {
      this.apiService.showSnack("Please enter label as");
      return;
    }
    if (!formValue.IsClosed) {
      // if (!formValue.IsClosed && (formValue.OpeningHours == null || formValue.OpeningHours.trim() == "") && (formValue.ClosingHours == null || formValue.ClosingHours.trim() == "")) {
      //   this.apiService.showSnack("Please check mark pharmacies are closed or fill the opening hours and closing hours");
      //   return;
      // }
      if (formValue.OpeningHours == null || formValue.OpeningHours.trim() == "") {
        this.apiService.showSnack("Please select opening hours");
        return;
      }
      if (formValue.ClosingHours == null || formValue.ClosingHours.trim() == "") {
        this.apiService.showSnack("Please select closing hours");
        return;
      }
    }
    formValue.FromDate = this.datePipe.transform(this.FormandToDate.begin, 'yyyy-MM-dd');
    formValue.ToDate = this.datePipe.transform(this.FormandToDate.end, 'yyyy-MM-dd');
    formValue.StateId = this.ArraytoString(formValue.StateId);
    formValue.CreatedOn = this.datePipe.transform(formValue.CreatedOn, 'yyyy-MM-dd HH:mm:ss.SSS');
    var PharmacyIds = [];
    if (String(this.oldInPharmacy).trim() != "" && this.oldInPharmacy != null) {
      String(this.oldInPharmacy).split(",").map((a) => { PharmacyIds.push(Number(a)) });
    }
    if (String(this.oldExPharmacy).trim() != "" && this.oldExPharmacy != null) {
      String(this.oldExPharmacy).split(",").map((a) => { PharmacyIds.push(Number(a)) });
    }

    var filteredArray = PharmacyIds.filter(function (item, pos) {
      return PharmacyIds.indexOf(item) == pos;
    });
    formValue.SearchForPharmacies = filteredArray.join();
    formValue['ModifiedBy'] = this.userDetail.UserId;
    if (formValue.SpecialhrsId == 0) {
      formValue.CreatedBy = this.userDetail.UserId;
    }
    this.post(formValue);
    // if (formValue.SpecialhrsId > 0 && formValue.IsActive == false) {
    //   const title: string = 'Holiday calendar & Special hours';
    //   const description: string = 'Are you sure, you want to active this special holiday hours and apply the changes ?';
    //   const waitDesciption: string = 'Holiday special hours is being activated...';
    //   const flag: number = 2;
    //   const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption, flag);
    //   dialogRef.disableClose = true;
    //   dialogRef.afterClosed().subscribe(res => {
    //     if (res) {
    //       this.post(formValue);
    //     }
    //     else {
    //       return;
    //     }
    //   });
    // }
    // else {
    //   this.post(formValue);
    // }
  }
  post(formValue) {
    this.commonServices.visibility = "shown";
    this.commonServices.backDrpCls();
    this.apiService.Post(formValue, this.url).subscribe((res: any) => {
      if (res != null) {
        this.dialogRef.close(res);
      } else {
        this.commonServices.backSetCls(false);
        this.commonServices.visibility = "hidden";
        this.apiService.showSnack(GlobalConstant.savefail);
      }
    }, error => {
      this.commonServices.backSetCls(false);
      this.commonServices.visibility = "hidden";
      this.apiService.showSnack(GlobalConstant.savefail);
    });
  }
  ArraytoString(Array): string {
    var value = "";
    if (Array.length != 0) {
      Array.forEach((item: any, index: number) => {
        value = index == 0 ? String(item) : value + "," + String(item);
      });
      return value
    }
  }
  closeDialog(): void {
    this.dialogRef.close(null);
  }
  searchfieldopenExclude() {
    this.searchExcluded = "";
    this.ExcludedpharmacyList = this.tempExcludedpharmacyList;
    var itemlist = this.specialHrsForm.value.ExcludedPharmacies;
    var item = [];
    itemlist.forEach((f: any) => {
      var filteritem = this.ExcludedpharmacyList.filter((x: any) => x.PharmacyId == f);
      if (filteritem.length > 0) {
        item.push(filteritem[0]);
      }
    })
    if (this.ExcludedpharmacyList.length == item.length) {
      this.allSelectedExcluded = true;
    } else { this.allSelectedExcluded = false; }
  }

  searchfieldclose() {
    this.ExcludedpharmacyList = JSON.parse(JSON.stringify(this.tempIncludedpharmacyList));
    var selectedData = this.specialHrsForm.value.SearchForPharmacies;
    selectedData.forEach((row: any) => {
      var record = this.ExcludedpharmacyList.filter((x: any) => x.PharmacyId == row);
      if (record.length > 0) {
        var pi = this.ExcludedpharmacyList.findIndex((y: any) => y.PharmacyId == record[0].PharmacyId);
        if (pi !== -1) {
          this.ExcludedpharmacyList.splice(pi, 1);
        }
      }
    });
    this.tempExcludedpharmacyList = JSON.parse(JSON.stringify(this.ExcludedpharmacyList));
    var selectedDataEx = this.specialHrsForm.value.ExcludedPharmacies;
    selectedDataEx.forEach((row: any) => {
      var filteredPharmacy = this.tempIncludedpharmacyList.filter((x: any) => x.PharmacyId == row);
      if (filteredPharmacy.length > 0) {
        var existOnlyExcluded = this.ExcludedpharmacyList.filter((y: any) => y.PharmacyId == filteredPharmacy[0].PharmacyId)
        if (existOnlyExcluded.length == 0) {
          this.ExcludedpharmacyList.push(filteredPharmacy[0])
        }
      }
    });
  }

  toggleAllSelectIncluded() {
    this.IncludedpharmacyList.forEach((x: any) => {
      x.IsIncluded = this.allSelectedIncluded;
    });
    this.checkSelctionLength();
  }

  singleChangeIncluded() {
    this.checkSelctionLength();
  }

  singleChangeExcluded() {
    this.checkSelctionLengthForEx();
  }

  checkSelctionLength() {
    var selectedFilter = this.tempIncludedpharmacyList.filter((x: any) => x.IsIncluded == true);
    var selectedArray = this.IncludedpharmacyList.filter((x: any) => x.IsIncluded == true);
    selectedArray.length == this.IncludedpharmacyList.length && this.IncludedpharmacyList.length != 0 ? this.allSelectedIncluded = true : this.allSelectedIncluded = false;
    var pharmacyName = "";
    this.oldInPharmacy = selectedFilter.length == 0 ? "" : this.oldInPharmacy;
    selectedFilter.forEach((y: any, i) => {
      this.oldInPharmacy = i == 0 ? y.PharmacyId : this.oldInPharmacy + "," + y.PharmacyId;
      pharmacyName = i == 0 ? y.PharmacyName : pharmacyName + ", " + y.PharmacyName;
    });
    this.specialHrsForm.controls.SearchForPharmacies.patchValue(pharmacyName);
  }

  checkSelctionLengthForEx() {
    var selectedFilter = this.tempExcludedpharmacyList.filter((x: any) => x.IsIncluded == true);
    var selectedArray = this.ExcludedpharmacyList.filter((x: any) => x.IsIncluded == true);
    selectedArray.length == this.ExcludedpharmacyList.length && this.ExcludedpharmacyList.length != 0 ? this.allSelectedExcluded = true : this.allSelectedExcluded = false;
    var pharmacyName = "";
    this.oldExPharmacy = selectedFilter.length == 0 ? "" : this.oldExPharmacy;
    selectedFilter.forEach((y: any, i) => {
      this.oldExPharmacy = i == 0 ? y.PharmacyId : this.oldExPharmacy + "," + y.PharmacyId;
      pharmacyName = i == 0 ? y.PharmacyName : pharmacyName + ", " + y.PharmacyName;
    });
    this.specialHrsForm.controls.ExcludedPharmacies.patchValue(pharmacyName);
  }

  IncludedOpen() {
    this.searchIncluded = "";
    this.IncludedpharmacyList = this.tempIncludedpharmacyList;
    this.checkSelctionLength();
    this.tempIncludedpharmacyList = this.IncludedpharmacyList;
  }

  ExcludedOpen() {
    this.searchExcluded = "";
    this.ExcludedpharmacyList = this.tempExcludedpharmacyList;
    this.checkSelctionLengthForEx();
  }
  toggleAllState() {
    if (this.allSelectedState) {
      this.selectState.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectState.options.forEach((item: MatOption) => item.deselect());
    }
    this.pharmacySplHoursModel.SpecialhrsId > 0 ? this.setPharmacyBasedState() : this.LoadIncluded();
  }

  optionClickState() {
    let newStatus = true;
    this.selectState.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedState = newStatus;
    this.pharmacySplHoursModel.SpecialhrsId > 0 ? this.setPharmacyBasedState() : this.LoadIncluded();
  }

  toggleAllSelectExcluded() {
    this.ExcludedpharmacyList.forEach((x: any) => {
      x.IsIncluded = this.allSelectedExcluded;
    });
    this.checkSelctionLengthForEx();
  }
}
