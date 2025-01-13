import { Component, OnInit, ViewChild, Inject, Input, NgZone, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, VERSION, MatSelect, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ApiServices } from '../../../../../views/services/api.services';
import { CommonServices } from '../../../../../views/services/common';
import { baseUrl, GlobalConstant } from '../../../globals/globalvariables';
import { NgxSpinnerService } from 'ngx-spinner';
import { PharmacyUserModel } from '../../../modals/pharmacy-user.model';
import { MapsAPILoader } from '@agm/core';
import { LoaderService } from '../../../../../views/services/loader.service';
import { DualListComponent } from 'angular-dual-listbox';

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
  selector: 'kt-pharmacy-user-group-create',
  templateUrl: './pharmacy-user-group-create.component.html',
  styleUrls: ['./pharmacy-user-group-create.component.scss']
})
export class PharmacyUserGroupCreateComponent implements OnInit {

  tab = 1;
  keepSorted = true;
  key: string;
  display: any;
  filter = true;
  source: Array<any>;
  confirmed: Array<any>;
  userAdd = '';
  disabled = false;

  sourceLeft = true;
  format: any = DualListComponent.DEFAULT_FORMAT;

  url = 'PharmacyGroupUser/';

  version = VERSION;
  edited = true;
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
  MobLength = 12;
  public mobMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private apiServices: ApiServices,
    public commonServices: CommonServices,
    public dialogRef: MatDialogRef<PharmacyUserGroupCreateComponent>,
    private mapsAPILoader: MapsAPILoader,
    private loaderService: LoaderService,
    private cdf: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {
    this.userModel = new PharmacyUserModel(this.modalData.user); this.edited = true; this.commonServices.backSetCls(false);
  }

  ngOnInit(): void {
    this.loginDetails = JSON.parse(localStorage.getItem("userdetails"));
    this.statesList = this.commonServices.getStatesList();
    this.countryList = this.commonServices.getCountryList();
    this.searchStateData = this.commonServices.getStatesList();

    this.searchData = this.modalData.pharmacyList;
    this.phamracyList = this.modalData.pharmacyList; this.confirmed = [];
    if (this.modalData.user != null) { this.modalData.user.IsUserType = true; }
    this.userModel = new PharmacyUserModel(this.modalData.user);
    if (this.userModel != null) {
      this.MobLength = this.commonServices.auML(this.userModel.Mobileno);
      this.mobMask = this.commonServices.auX(this.userModel.Mobileno);
    }
    this.formCreation();
    this.adminPharmacy();
    this.doReset();
    // this.autoCompletedLocation();
  }

  adminPharmacy() {
    if (this.modalData.user != null && this.modalData.user.PharmacyGroupUserId != null &&
      this.modalData.user.PharmacyGroupUserId != "" && this.modalData.user.PharmacyGroupUserId != undefined) {
      var push = []; var that = this;
      var array = this.modalData.user.PharmacyGroupUserId.split(",");
      array.forEach(element => {
        if (element != null && element != "" && element != undefined) {
          var id = parseInt(element); var list = that.phamracyList.filter(function (a) { return a.PharmacyId == id });
          if (list.length > 0) {
            push.push(list[0]);
          }
        }
      });
      this.confirmed = push;
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

      UserName: new FormControl(this.userModel.UserName),
      UserPassword: new FormControl(this.userModel.UserPassword),
      Mobileno: new FormControl(this.userModel.Mobileno),

      // Bank Details
      BankName: new FormControl(""),
      AccountNumber: new FormControl(""),
      BranchName: new FormControl(""),
      IfscCode: new FormControl(""),

      FirstName: new FormControl(this.userModel.FirstName),
      LastName: new FormControl(this.userModel.LastName),
      UserEmail: new FormControl(this.userModel.UserEmail, [Validators.required, Validators.email, Validators.pattern(this.commonServices.emailPattern)]),
      Phoneno1: new FormControl(this.userModel.Phoneno1, [Validators.minLength(11)]),
      City: new FormControl(this.userModel.City),
      bank: new FormControl(this.userModel.City),
      StateId: new FormControl(this.userModel.StateId),
      CountryId: new FormControl(this.userModel.CountryId),
      Pincode: new FormControl(this.userModel.Pincode),
      RoleId: new FormControl(this.userModel.RoleId),
      // Pharmacy Details
      CreatedBy: new FormControl(this.userModel.CreatedBy),
      CreatedOn: new FormControl(this.userModel.CreatedOn),
      ModifiedOn: new FormControl(this.userModel.ModifiedOn),
      Address1: new FormControl(this.userModel.Address1),
      Address2: new FormControl(this.userModel.Address2),
      IsUserType: new FormControl(this.userModel.IsUserType),
    })
  }

  onChangeByMob(mobno, e) {
    mobno = this.commonServices.validDigRep(mobno);
    if (mobno != null && mobno != "" && mobno != undefined) {
      var dt = this.commonServices.validByMobileNo(mobno);
      if ((mobno.charAt(0) != 0 && mobno.length == 1) || (mobno.charAt(0) != 0 && mobno.length >= 8)) {
        if (e == true) {
          this.mobMask = this.commonServices.auX(mobno);
          this.MobLength = 11;
          if (mobno.length != this.MobLength && dt != 2) { this.userForm.controls['Mobileno'].setValidators([Validators.minLength(11)]); this.userForm.controls['Mobileno'].setErrors({ 'incorrect': true }); }
        }
      }
      else if ((mobno.charAt(0) == 0 && mobno.length == 2) || (mobno.charAt(0) == 0 && mobno.length >= 9)) {
        if (e == true) {
          this.mobMask = this.commonServices.auX(mobno);
          this.MobLength = 12;
          if (mobno.length != this.MobLength && dt != 2) { this.userForm.controls['Mobileno'].setValidators([Validators.minLength(12)]); this.userForm.controls['Mobileno'].setErrors({ 'incorrect': true }); }
        }
      }
    }
  }


  onSave(): void {
    if (this.userForm.value.UserName == null || this.userForm.value.UserName == "" || this.userForm.value.UserName == undefined) {
      this.apiServices.showSnack("User Name is required."); return;
    }

    if (this.userForm.value.UserId == null || this.userForm.value.UserId <= 0) {
      if (this.userForm.value.UserPassword == null || this.userForm.value.UserPassword == "" || this.userForm.value.UserPassword == undefined) {
        this.apiServices.showSnack("Password is required."); return;
      }
    }

    if (this.userForm.value.UserEmail == null || this.userForm.value.UserEmail == undefined || this.userForm.value.UserEmail == "") {
      this.apiServices.showSnack("Email ID is required.");
      return;
    }

    if (!this.commonServices.validByEmailNo(this.userForm.value.UserEmail)) {
      this.apiServices.showSnack("Please enter a valid email address.");
      return;
    }

    if (this.userForm.value.Mobileno != null && this.userForm.value.Mobileno != undefined && this.userForm.value.Mobileno != "") {
      var mobno = this.commonServices.validDigRep(this.userForm.value.Mobileno); var validby = this.commonServices.validAUMobNo(mobno);
      if (validby == 1) {
        setTimeout(() => {
          this.apiServices.showSnack("Enter your mobile number.");
        })
        return;
      }
      if (validby == 3) {
        setTimeout(() => {
          this.apiServices.showSnack("Invalid mobile number.");
        })
        return;
      }
      if (validby == 2) {
        // if (mobno.charAt(0) != 0) {
        //   this.MobLength = 12; this.cdf.detectChanges();
        //   this.userForm.controls['Mobileno'].setValue("0" + mobno); this.mobMask = this.commonServices.auX(this.userForm.value.Mobileno); this.cdf.detectChanges(); console.log(this.MobLength);
        // }
      } else {
        setTimeout(() => {
          this.apiServices.showSnack("Invalid mobile number.");
        })
        return;
      }
    }

    this.userForm.value.RoleId = 5;
    if (this.userModel.UserId !== null && this.userModel.UserId > 0) {
      this.userForm.addControl('UserId', new FormControl(this.userModel.UserId));
    }
    if (this.userForm.value.IsUserType) { this.userForm.value.RoleId = 2 }
    this.userForm.value.CreatedBy = this.loginDetails.UserId;

    if (this.confirmed == null || this.confirmed.length <= 0) {
      this.apiServices.showSnack("Please select minimum 1 pharmacy.");
      return;
    }

    // this.spinner.show();
    this.userForm.value.pharmacyUsers = this.confirmed;
    this.commonServices.visibility = "shown"; this.edited = false;
    if (validby == 2) {
      if (mobno.charAt(0) != 0) {
        this.MobLength = 12;
        this.userForm.controls['Mobileno'].setValue("0" + mobno); this.mobMask = this.commonServices.auX(this.userForm.value.Mobileno); this.cdf.detectChanges(); console.log(this.MobLength);
      }
    }
    this.commonServices.backDrpCls();
    this.apiServices.Post(this.userForm.value, this.url + "Post?roleid=" + this.loginDetails.RoleId).subscribe(res => {
      if (res.flag == 2 || res.flag == 3 || res.flag == 4) {
        this.commonServices.backSetCls(false); this.dialogRef.close(null); res.list = null; this.commonServices.visibility = "hidden";
        this.edited = true; this.apiServices.showSnack(res.ErroMessage); return;
      }
      this.commonServices.backSetCls(false); this.dialogRef.close(res); this.commonServices.visibility = "hidden";
    }, error => {
      this.commonServices.backSetCls(false); this.dialogRef.close(null);
      this.commonServices.customError(10); this.commonServices.visibility = "hidden";
    }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private useStations() {
    this.key = 'PharmacyId';
    this.display = 'GlobalName';
    this.keepSorted = true;
    this.source = this.phamracyList;
  }

  doReset() {
    this.useStations();
  }

  doDelete() {
    if (this.source.length > 0) {
      this.source.splice(0, 1);
    }
  }

  doCreate() {
    if (typeof this.source[0] === 'object') {
      const o = {};
      o[this.key] = this.source.length + 1;
      o[this.display] = this.userAdd;
      this.source.push(o);
    } else {
      this.source.push(this.userAdd);
    }
    this.userAdd = '';
  }

  doAdd() {
    for (let i = 0, len = this.source.length; i < len; i += 1) {
      const o = this.source[i];
      const found = this.confirmed.find((e: any) => e === o);
      if (!found) {
        this.confirmed.push(o);
        break;
      }
    }
  }

  doRemove() {
    if (this.confirmed.length > 0) {
      this.confirmed.splice(0, 1);
    }
  }

  doFilter() {
    this.filter = !this.filter;
  }

  filterBtn() {
    return (this.filter ? 'Hide Filter' : 'Show Filter');
  }

  doDisable() {
    this.disabled = !this.disabled;
  }

  disableBtn() {
    return (this.disabled ? 'Enable' : 'Disabled');
  }

  swapDirection() {
    this.sourceLeft = !this.sourceLeft;
    this.format.direction = this.sourceLeft ? DualListComponent.LTR : DualListComponent.RTL;
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

          var stateid = this.commonServices.getState(place); debugger
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
    });
  }

}
