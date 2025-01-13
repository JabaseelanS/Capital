import { Component, OnInit, ViewChild, Inject, Input, NgZone, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, VERSION, MatSelect, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ApiServices } from '../../../../services/api.services';
import { CommonServices } from '../../../../services/common';
import { baseUrl, GlobalConstant } from '../../../globals/globalvariables';
import { NgxSpinnerService } from 'ngx-spinner';
import { PharmacyUserModel } from '../../../modals/pharmacy-user.model';
import { MapsAPILoader } from '@agm/core';
import { LoaderService } from '../../../../services/loader.service';

interface Pharmacy {
  id: string;
  name: string;
}
interface State {
  id: string;
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
  selector: 'kt-delivery-user-create',
  templateUrl: './delivery-user-create.component.html',
  styleUrls: ['./delivery-user-create.component.scss']
})
export class DeliveryUserCreateComponent implements OnInit {

  url = 'DeliveryUser/';

  version = VERSION;

  // genders ============
  genders = [
    { GenderId: 1, value: "Male" },
    { GenderId: 2, value: "FeMale" },
    { GenderId: 3, value: "Others" },
  ];

  searchStateData = [];
  public statesList = [];
  public countryList = [];

  /** list of pharmacies filtered by search keyword */
  public filteredPharmacies: ReplaySubject<Pharmacy[]> = new ReplaySubject<Pharmacy[]>(1);

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl = new FormControl();
  public searchControl1: FormControl = new FormControl();
  public zoom: number;

  @Input() adressType: string;
  @ViewChild("search", { static: true }) public searchElementRef: ElementRef;
  @ViewChild("search1", { static: true }) public searchElementRef1: ElementRef;
  // @ViewChild("search1", { static: true })

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  userForm: FormGroup;
  searchForm: FormGroup;
  userModel: PharmacyUserModel;
  isActive = true;
  id: any;

  // For Table
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['logindetail', 'logoutdetail', 'totaltime', 'location', 'logoutLocation'];

  displayedColumnsPharm = ['pharmacyId', 'pharmacyName', 'pharmacyLocation', 'status', 'orderCount', 'amount']
  // For File Uploading Option
  imageUrl: string = "/assets/img/demo.png";
  fileToUpload: File = null;
  isFileSelected = false;
  phamracyList = [];
  searchData = [];
  loginDetails: any;
  hide = true;
  MobLength = 11;
  phLength = 11;
  phLength1 = 11;
  public mobMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public phoneMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public phoneMask1 = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public tempMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/,];
  public tempMask1 = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private apiServices: ApiServices,
    private commonServices: CommonServices,
    public dialogRef: MatDialogRef<DeliveryUserCreateComponent>,
    private mapsAPILoader: MapsAPILoader,
    private loaderService: LoaderService,
    private ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {
    this.userModel = new PharmacyUserModel();
  }

  ngOnInit(): void {
    this.commonServices.backSetCls(false); this.loginDetails = JSON.parse(localStorage.getItem("userdetails"));
    this.statesList = this.commonServices.getStatesList();
    this.countryList = this.commonServices.getCountryList();
    this.searchStateData = this.commonServices.getStatesList();

    this.searchData = this.modalData.pharmacyList;
    this.phamracyList = this.modalData.pharmacyList;
    this.userModel = new PharmacyUserModel(this.modalData.user);
    this.formCreation();

    this.autoCompletedLocation();
  }

  autoCompletedLocation() {
    //set google maps defaults
    this.zoom = 4;
    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    // this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        componentRestrictions: { country: 'AUS' },
        types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
      });

      let autocomplete1 = new google.maps.places.Autocomplete(this.searchElementRef1.nativeElement, {
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

          this.userModel.Address1 = place['formatted_address'];
          this.userForm.get('Address1').setValue(this.userModel.Address1);

          this.userModel.Pincode = this.commonServices.getPostCode(place);
          this.userForm.get('Pincode').setValue(this.userModel.Pincode);

          this.userModel.City = this.commonServices.getCity(place);
          this.userForm.get('City').setValue(this.userModel.City);

          var stateid = this.commonServices.getState(place);
          var filter = this.statesList.filter(function (val) { return val.code == stateid });
          if (filter.length > 0) {
            this.userModel.StateId = filter[0].id;
            this.userForm.get('StateId').setValue(this.userModel.StateId);
          }

          this.userModel.CountryId = 1;
          this.userForm.get('CountryId').setValue(this.userModel.CountryId);

          // this.pharmacyGrpModel.Pincode = this.ge(place);
          // this.pharmacyGrpForm.get('Pincode').setValue(this.pharmacyGrpModel.Pincode);
        });
      });

      autocomplete1.addListener("place_changed", (val) => {
        this.ngZone.run(() => {
          //get the place result
          const place = autocomplete1.getPlace();
          //let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;

          this.userModel.Address2 = place['formatted_address'];
          this.userForm.get('Address2').setValue(this.userModel.Address2);
          console.log(this.userModel.Address2);
        });
      });
    });
  }
  onChangeByMob(mobno, e) {
    mobno = this.commonServices.validDigRep(mobno);
    if (mobno != null && mobno != "" && mobno != undefined) {
      var dtA = this.commonServices.validAUMobNo(mobno);
      var dtN = this.commonServices.validByMobileNo(mobno);
      if ((mobno.charAt(0) != 0 && mobno.length == 1) || (mobno.charAt(0) != 0 && mobno.length >= 8)) {
        if (e == 1) {
          this.phoneMask = this.commonServices.auX(mobno);
          this.phLength = 11;
          if (mobno.length != this.phLength && dtA != 2) { this.userForm.controls['Phoneno1'].setValidators([Validators.minLength(11)]); this.userForm.controls['Phoneno1'].setErrors({ 'incorrect': true }); }
        } else if (e == 2) {
          this.phoneMask1 = this.commonServices.auX(mobno);
          this.phLength1 = 11;
          if (mobno.length != this.phLength1 && dtA != 2) { this.userForm.controls['Phoneno2'].setValidators([Validators.minLength(11)]); this.userForm.controls['Phoneno2'].setErrors({ 'incorrect': true }); }
        } else {
          this.mobMask = this.commonServices.auX(mobno);
          this.MobLength = 11;
          if (mobno.length != this.MobLength && dtN != 2) { this.userForm.controls['Mobileno'].setValidators([Validators.minLength(11)]); this.userForm.controls['Mobileno'].setErrors({ 'incorrect': true }); }
        }
      }
      else if ((mobno.charAt(0) == 0 && mobno.length == 1) || (mobno.charAt(0) == 0 && mobno.length >= 9)) {
        var dtA2 = this.commonServices.validAUMobNo(mobno);
        var dtN2 = this.commonServices.validByMobileNo(mobno);
        if (e == 1) {
          this.phoneMask = this.commonServices.auX(mobno);
          this.phLength = 12;
          if (mobno.length != this.phLength && dtA2 != 2) { this.userForm.controls['Phoneno1'].setValidators([Validators.minLength(12)]); this.userForm.controls['Phoneno1'].setErrors({ 'incorrect': true }); }
        }
        else if (e == 2) {
          this.phoneMask1 = this.commonServices.auX(mobno);
          this.phLength1 = 12;
          if (mobno.length != this.phLength1 && dtA2 != 2) { this.userForm.controls['Phoneno2'].setValidators([Validators.minLength(12)]); this.userForm.controls['Phoneno2'].setErrors({ 'incorrect': true }); }
        } else {
          this.mobMask = this.commonServices.auX(mobno);
          this.MobLength = 12;
          if (mobno.length != this.MobLength && dtN2 != 2) { this.userForm.controls['Mobileno'].setValidators([Validators.minLength(12)]); this.userForm.controls['Mobileno'].setErrors({ 'incorrect': true }); }
        }
      }
    }
    else if (e == 3) {
      this.userForm.controls['Mobileno'].setErrors({ 'incorrect': true });
    }
  }

  onChangeByMob2(mobno) {
    mobno = this.commonServices.validDigRep(mobno);
    if (mobno != null && mobno != "" && mobno != undefined) {
      var dt = this.commonServices.validByMobileNo(mobno);
      if ((mobno.charAt(0) != 0 && mobno.length == 1) || (mobno.charAt(0) != 0 && mobno.length >= 8)) {
        this.mobMask = this.commonServices.auX(mobno);
        this.MobLength = 11;
        if (mobno.length != this.MobLength && dt != 2) { this.userForm.controls['MobileNo'].setValidators([Validators.minLength(11)]); this.userForm.controls['MobileNo'].setErrors({ 'pattern': true }); }
      }
      else if ((mobno.charAt(0) == 0 && mobno.length == 1) || (mobno.charAt(0) == 0 && mobno.length >= 9)) {
        this.mobMask = this.commonServices.auX(mobno);
        this.MobLength = 12;
      }
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

  searchFilter(value, flag) {
    let data = [];
    this.searchData.filter(order => {
      if (order.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        data.push(order);
      }
    });
    this.phamracyList = data;
  }

  formCreation() {
    this.userForm = this._formBuilder.group({

      // Mandatory Fields
      // Login Details 
      UserName: new FormControl(this.userModel.UserName),
      UserPassword: new FormControl(this.userModel.UserPassword),
      Mobileno: new FormControl(this.userModel.Mobileno),

      // NoN Mandatory Fields
      // Personal Info
      FirstName: new FormControl(this.userModel.FirstName),
      LastName: new FormControl(this.userModel.LastName),
      UserDob: new FormControl(this.userModel.UserDob),
      Gender: new FormControl(this.userModel.Gender),
      Status: new FormControl(this.userModel.Status),
      UserEmail: new FormControl(this.userModel.UserEmail),
      Phoneno1: new FormControl(this.userModel.Phoneno1),
      Phoneno2: new FormControl(this.userModel.Phoneno2),
      City: new FormControl(this.userModel.City),
      StateId: new FormControl(this.userModel.StateId),
      CountryId: new FormControl(this.userModel.CountryId),
      Pincode: new FormControl(this.userModel.Pincode),
      RoleId: new FormControl(this.userModel.RoleId),
      // Bank Details
      BankName: new FormControl(this.userModel.BankName),
      AccountNumber: new FormControl(this.userModel.AccountNumber),
      BranchName: new FormControl(this.userModel.BranchName),
      IfscCode: new FormControl(this.userModel.IfscCode),

      // Pharmacy Details
      PharmacyId: new FormControl(this.userModel.PharmacyId),
      CreatedBy: new FormControl(this.userModel.CreatedBy),
      // loginHistory
      loginHistory: new FormControl(this.userModel.loginHistory),

      CreatedOn: new FormControl(this.userModel.CreatedOn),
      ModifiedOn: new FormControl(this.userModel.ModifiedOn),
      Address1: new FormControl(this.userModel.Address1),
      Address2: new FormControl(this.userModel.Address2),
    })
  }

  onSave(): void {
    // debugger
    if (this.userModel.UserId !== null && this.userModel.UserId > 0) {
      this.userForm.addControl('UserId', new FormControl(this.userModel.UserId));
    }
    this.userForm.value.CreatedBy = this.loginDetails.UserId;
    // this.spinner.show();
    this.commonServices.visibility = "shown";
    this.apiServices.Post(this.userForm.value, this.url + "Post").subscribe(res => {
      if (res.flag == 3) {
        this.apiServices.showSnack("User Name is already exist."); res = null;
      } else if (res.flag == 2) {
        this.apiServices.showSnack("Oops something went wrong. please try again."); res = null;
      } else {
        if (this.userModel.UserId !== null && this.userModel.UserId > 0) {
          this.apiServices.showSnack(GlobalConstant.updated);
        } else {
          this.apiServices.showSnack(GlobalConstant.saved);
        }
      }
      this.dialogRef.close(res.list);
    }, error => {
      this.commonServices.customError(2);
      this.dialogRef.close(null);
    }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
