import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatTableDataSource } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { PharmacyGrpModel } from '../../modals/pharmacy-group-model';
import { ApiServices } from '../../../../views/services/api.services';
import { MapsAPILoader } from '@agm/core';
import { LoaderService } from '../../../../views/services/loader.service';
import { CommonServices } from '../../../../views/services/common';
import { GlobalConstant } from '../../globals/globalvariables';

interface State {
  id: number;
  name: string;
}
// interface City {
//   id: number;
//   name: string; 
// }
interface Country {
  id: string;
  name: string;
}

declare var google: any;

@Component({
  selector: 'pp-pharmacy-group-dialog',
  templateUrl: './pharmacy-group-dialog.component.html',
  styleUrls: ['./pharmacy-group-dialog.component.scss']
})
export class PharmacyGroupsDialogComponent implements OnInit, AfterViewInit {

  displayedColumnsDay = ['WeekDays', 'OpeningHours', 'ClosingHours'];
  ELEMENT_DATA = [
    { Days: 'Sunday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0 },
    { Days: 'Monday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0 },
    { Days: 'Tuesday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0 },
    { Days: 'Wednesday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0 },
    { Days: 'Thursday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0 },
    { Days: 'Friday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0 },
    { Days: 'Saturday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0 }];

  dataSource = new MatTableDataSource<any>();

  url = 'PharmacyGroups/';

  searchStateData = [];
  public statesList = [];
  public countryList = [];

  public _onDestroy = new Subject<void>();

  pharmacyGrpForm: FormGroup;
  pharmacyGrpModel: PharmacyGrpModel;
  id: any;
  pharmacy: any[];
  loginDetails: any;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  QFlag = false;
  QrCode = "";
  phLength = 12;
  phLength1 = 12;
  faxLength = 12;
  public phoneMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public phoneMask1 = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public faxMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  @Input() adressType: string;
  @ViewChild("search", { static: false }) public searchElementRef: ElementRef;
  edited = true;
  constructor(
    public commonServices: CommonServices,
    public _formBuilder: FormBuilder,
    public apiServices: ApiServices,
    public spinner: NgxSpinnerService, public loaderService: LoaderService,
    public dialogRef: MatDialogRef<PharmacyGroupsDialogComponent>,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {
    this.pharmacyGrpModel = new PharmacyGrpModel(this.modalData); this.commonServices.backSetCls(false);

  }

  async ngOnInit() {
    this.loginDetails = JSON.parse(localStorage.getItem("userdetails")); this.edited = true;
    this.statesList = this.commonServices.getStatesList();
    this.countryList = this.commonServices.getCountryList();
    this.searchStateData = this.commonServices.getStatesList();
    this.pharmacyGrpModel = new PharmacyGrpModel(this.modalData);
    if (this.pharmacyGrpModel != null) {
      this.phLength = this.commonServices.auML(this.pharmacyGrpModel.PhoneNo1);
      this.phLength1 = this.commonServices.auML(this.pharmacyGrpModel.PhoneNo2);
      this.phoneMask = this.commonServices.auX(this.pharmacyGrpModel.PhoneNo1);
      this.phoneMask1 = this.commonServices.auX(this.pharmacyGrpModel.PhoneNo2);
      this.faxLength = this.commonServices.auML(this.pharmacyGrpModel.FaxId);
      this.faxMask = this.commonServices.auX(this.pharmacyGrpModel.FaxId);
    }
    if (this.pharmacyGrpModel != null && this.pharmacyGrpModel.QrCode != null && this.pharmacyGrpModel.QrCode != "" && this.pharmacyGrpModel.QrCode != undefined && this.pharmacyGrpModel.QrCode != 'data:image/png;base64,') {
      this.QrCode = this.pharmacyGrpModel.QrCode;
    }
    this.formCreation();
    console.log(this.pharmacyGrpModel, this.phLength, this.phoneMask, this.pharmacyGrpForm.valid, this.pharmacyGrpForm.dirty);
    if (this.pharmacyGrpModel.pharmacyserve_list.length) {
      this.dataSource = new MatTableDataSource(this.pharmacyGrpModel.pharmacyserve_list);
    } else {
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    }
    // this.cityFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterCities();
    //   });
    // listen for search field value changes
  }

  GenerateQRImage() {
    if (this.QFlag) { this.apiServices.showSnack("Please wait loading..."); return true; }
    this.QFlag = true;
    this.apiServices.GetList(this.url + 'GenerateQRImage?id=' + this.modalData.PharmacyGrpId).subscribe((res: any) => {
      if (res != null) {
        this.QrCode = res.QrCode;
        this.pharmacyGrpForm.get('QrCode').setValue(res.QrCode);
      }
      this.QFlag = false;
    }, err => {
      this.QFlag = false;
    });
  }

  ngAfterViewInit() {
    this.autoCompletedLocation();
  }

  autoCompletedLocation() {
    //set google maps defaults
    this.zoom = 4;
    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        componentRestrictions: { country: 'AUS' },
        types: [this.adressType]  // 'establishment' / 'address' / 'geocode'

      });
      autocomplete.addListener("place_changed", (val) => {
        this.ngZone.run(() => {
          //get the place result
          const place = autocomplete.getPlace();
          //let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;

          this.pharmacyGrpModel.Address = place['formatted_address'];
          this.pharmacyGrpForm.get('Address').setValue(this.pharmacyGrpModel.Address);

          this.pharmacyGrpModel.Pincode = this.getPostCode(place);
          this.pharmacyGrpForm.get('Pincode').setValue(this.pharmacyGrpModel.Pincode);

          this.pharmacyGrpModel.City = this.getCity(place);
          this.pharmacyGrpForm.get('City').setValue(this.pharmacyGrpModel.City);

          var stateid = this.getState(place);
          var filter = this.statesList.filter(function (val) { return val.code == stateid });
          if (filter.length > 0) {
            this.pharmacyGrpModel.StateId = filter[0].id;
            this.pharmacyGrpForm.get('StateId').setValue(this.pharmacyGrpModel.StateId);
          }

          this.pharmacyGrpModel.CountryId = 1;
          this.pharmacyGrpForm.get('CountryId').setValue(this.pharmacyGrpModel.CountryId);
        });
      });
    });
  }

  public setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  searchStatesFilter(value, flag) {
    let data = [];
    this.searchStateData.filter(order => {
      if (order.name.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        data.push(order);
      }
    });
    this.statesList = data;
  }

  repeatstr(ch, n): any {
    let result = '';
    while (n-- > 0) {
      result += ch;
    }
    return result;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getPharmacyById() {
    // this.spinner.show();
    this.loaderService.display(true);
    this.apiServices.GetById(this.url + "GetListById?id=" + this.id).subscribe(res => {
      this.pharmacyGrpModel = new PharmacyGrpModel(res);
      this.formCreation();
      // this.spinner.hide();
      this.loaderService.display(false);
    }, error => {
      // this.spinner.hide();
      this.loaderService.display(false);
      this.commonServices.customError(1);
    });
  }

  formCreation() {
    this.pharmacyGrpForm = this._formBuilder.group({
      PharmacyGrpName: new FormControl(this.pharmacyGrpModel.PharmacyGrpName, [
        Validators.required
      ]),
      ContactName: new FormControl(this.pharmacyGrpModel.ContactName, [
        Validators.required
      ]),
      Email: new FormControl(this.pharmacyGrpModel.Email, [
        Validators.required, Validators.email, Validators.pattern(this.commonServices.emailPattern)
      ]),
      PhoneNo1: new FormControl(this.pharmacyGrpModel.PhoneNo1, [
        Validators.required
      ]),
      PhoneNo2: new FormControl(this.pharmacyGrpModel.PhoneNo2),
      Address: new FormControl(this.pharmacyGrpModel.Address, [
        Validators.required
      ]),
      City: new FormControl(this.pharmacyGrpModel.City, [
        Validators.required
      ]),
      StateId: new FormControl(this.pharmacyGrpModel.StateId),
      CountryId: new FormControl(this.pharmacyGrpModel.CountryId),
      Pincode: new FormControl(this.pharmacyGrpModel.Pincode, [
        Validators.required
      ]),
      FaxId: new FormControl(this.pharmacyGrpModel.FaxId),
      OpeningHours: new FormControl(this.pharmacyGrpModel.OpeningHours),
      ClosingHours: new FormControl(this.pharmacyGrpModel.ClosingHours),
      CreatedOn: new FormControl(this.pharmacyGrpModel.CreatedOn),
      ModifiedOn: new FormControl(this.pharmacyGrpModel.ModifiedOn),
      CreatedBy: new FormControl(this.pharmacyGrpModel.CreatedBy),
      QrCode: new FormControl(this.pharmacyGrpModel.QrCode)
    })
  }

  getAddrComponent(place, componentTemplate) {
    let result;

    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }

  getCity(place) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  getState(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getDistrict(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getAutoCountry(place) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return country;
  }

  getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFaxchange(faxno) {
    faxno = this.commonServices.validDigRep(faxno);
    if (faxno != null && faxno != "" && faxno != undefined) {
      var dt = this.commonServices.faxNoValid(faxno);
      if (faxno.charAt(0) != 0 && faxno.length >= 1) {
        this.faxMask = this.commonServices.auX(faxno);
        this.faxLength = 11;
        if (faxno.length != this.faxLength && dt != 2) { this.pharmacyGrpForm.controls['FaxId'].setValidators([Validators.minLength(11)]); this.pharmacyGrpForm.controls['FaxId'].setErrors({ 'incorrect': true }); }
      }
      else if (faxno.charAt(0) == 0 && faxno.length > 1) {
        this.faxMask = this.commonServices.auX(faxno);
        this.faxLength = 12;
        if (faxno.length != this.faxLength && dt != 2) { this.pharmacyGrpForm.controls['FaxId'].setValidators([Validators.minLength(11)]); this.pharmacyGrpForm.controls['FaxId'].setErrors({ 'incorrect': true }); }
      } else {
        this.pharmacyGrpForm.get('FaxId').setValidators(null); this.pharmacyGrpForm.get('FaxId').setErrors(null);
      }
    }
  }

  onChangeByMob(mobno, e) {
    mobno = this.commonServices.validDigRep(mobno);
    if (mobno != null && mobno != "" && mobno != undefined) {
      var dt = this.commonServices.validAUMobNo(mobno);
      if ((mobno.charAt(0) != 0 && mobno.length == 1) || (mobno.charAt(0) != 0 && mobno.length >= 8)) {
        if (e == true) {
          this.phoneMask1 = this.commonServices.auX(mobno);
          this.phLength1 = 11;
          if (mobno.length != this.phLength1 && dt != 2) { this.pharmacyGrpForm.controls['PhoneNo2'].setValidators([Validators.minLength(11)]); this.pharmacyGrpForm.controls['PhoneNo2'].setErrors({ 'incorrect': true }); }
        }
        else {
          this.phoneMask = this.commonServices.auX(mobno);
          this.phLength = 11;
          if (mobno.length != this.phLength && dt != 2) { this.pharmacyGrpForm.controls['PhoneNo1'].setValidators([Validators.minLength(11)]); this.pharmacyGrpForm.controls['PhoneNo1'].setErrors({ 'incorrect': true }); }
        }
      }
      else if ((mobno.charAt(0) == 0 && mobno.length == 2) || (mobno.charAt(0) == 0 && mobno.length >= 9)) {
        if (e == true) {
          this.phoneMask1 = this.commonServices.auX(mobno);
          this.phLength1 = 12;
          if (mobno.length != this.phLength1 && dt != 2) { this.pharmacyGrpForm.controls['PhoneNo2'].setValidators([Validators.minLength(12)]); this.pharmacyGrpForm.controls['PhoneNo2'].setErrors({ 'incorrect': true }); }
        } else {
          this.phoneMask = this.commonServices.auX(mobno);
          this.phLength = 12;
          if (mobno.length != this.phLength && dt != 2) { this.pharmacyGrpForm.controls['PhoneNo1'].setValidators([Validators.minLength(12)]); this.pharmacyGrpForm.controls['PhoneNo1'].setErrors({ 'incorrect': true }); }
        }
      }
    }
    else if (e != true) {
      this.pharmacyGrpForm.controls['PhoneNo1'].setErrors({ 'incorrect': true });
    }
  }

  onSave(): void {
    var mobno = this.commonServices.validDigRep(this.pharmacyGrpForm.value.PhoneNo1); var dt = this.commonServices.validAUMobNo(mobno);
    if (dt == 2) {
      if (this.pharmacyGrpForm.value.PhoneNo1.charAt(0) != 0) { this.pharmacyGrpForm.controls['PhoneNo1'].setValue("0" + mobno); }
    }
    if (this.pharmacyGrpForm.value.PhoneNo2 != null && this.pharmacyGrpForm.value.PhoneNo2 != undefined && this.pharmacyGrpForm.value.PhoneNo2 != "") {
      var mobno2 = this.commonServices.validDigRep(this.pharmacyGrpForm.value.PhoneNo2); var dt2 = this.commonServices.validAUMobNo(mobno2);
      if (dt2 == 2) {
        if (this.pharmacyGrpForm.value.PhoneNo2.charAt(0) != 0) { this.pharmacyGrpForm.controls['PhoneNo2'].setValue("0" + mobno2); }
      }
    }
    var fno = this.commonServices.validDigRep(this.pharmacyGrpForm.value.FaxId); var ft = this.commonServices.faxNoValid(fno);
    if (ft == 2) {
      if (this.pharmacyGrpForm.value.FaxId.charAt(0) != 0) { this.pharmacyGrpForm.controls['FaxId'].setValue("0" + fno); }
      else {
        this.pharmacyGrpForm.controls['FaxId'].setValue(fno);
      }
    }
    this.pharmacyGrpModel.CreatedBy = this.loginDetails.UserId;
    this.pharmacyGrpForm.addControl('CreatedBy', new FormControl(this.pharmacyGrpModel.CreatedBy));
    if (this.pharmacyGrpModel.PharmacyGrpId !== 0) {
      this.pharmacyGrpForm.addControl('PharmacyGrpId', new FormControl(this.pharmacyGrpModel.PharmacyGrpId));
    }
    if (this.dataSource.data != null) {
      this.pharmacyGrpForm.value.pharmacyGrpServingsList = this.dataSource.data;
    }
    this.pharmacyGrpForm.value.CreatedBy = this.loginDetails.UserId;

    this.commonServices.visibility = "shown"; this.edited = false;
    this.commonServices.backDrpCls();
    this.apiServices.Post(this.pharmacyGrpForm.value, this.url + "Post").subscribe(
      response => {
        this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden"; this.dialogRef.close(response);
      },
      (error: any) => {
        this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden";
        this.commonServices.customError(10); this.dialogRef.close(null);
      });

  }

  saveShedule(response: any) {
    this.dataSource.data.forEach(element => {
      element['PharmacyGrpId'] = response.id;
    });
    this.apiServices.Post(this.dataSource.data, this.url + 'Schedule').subscribe(res => {
      this.dialogRef.close(res);
    }, err => {
      this.dialogRef.close(response.list);
    })
  }
}

