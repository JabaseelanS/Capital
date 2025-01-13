import { Component, OnInit, ViewChild, Inject, Input, NgZone, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, VERSION, MatSelect, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ApiServices } from '../../../../../views/services/api.services';
import { CommonServices } from '../../../../../views/services/common';
import { baseUrl, GlobalConstant } from '../../../globals/globalvariables';
import { NgxSpinnerService } from 'ngx-spinner';
import { PharmacyUserModel } from '../../../modals/pharmacy-user.model';
import { MapsAPILoader } from '@agm/core';
import { LoaderService } from '../../../../../views/services/loader.service';
import { AlertDialogComponent } from '../../../dialogs/alert-dialog/alert.dialog.component';

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
  selector: 'kt-pharmacy-user-create',
  templateUrl: './pharmacy-user-create.component.html',
  styleUrls: ['./pharmacy-user-create.component.scss']
})
export class PharmacyUserCreateComponent implements OnInit, AfterViewInit {

  url = 'PharmacyUser/';

  version = VERSION;

  // genders ============
  genders = [
    { GenderId: 1, value: "Male" },
    { GenderId: 2, value: "Female" },
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
  edited = true;
  @Input() adressType: string;
  @ViewChild("search", { static: false }) public searchElementRef: ElementRef;
  @ViewChild("search1", { static: false }) public searchElementRef1: ElementRef;
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
  phLength = 12;
  phLength1 = 12;
  public mobMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public phoneMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public phoneMask1 = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  WEdata = {
    btnCancelText: 'no',
    btnOkText: 'yes',
    title: "Welcome E-Mail",
    message: 'Do you wish to send welcome email ? ',
    height: "190px",
    WEmail: true,
  }
  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private apiServices: ApiServices,
    public commonServices: CommonServices,
    public dialogRef: MatDialogRef<PharmacyUserCreateComponent>,
    private mapsAPILoader: MapsAPILoader,
    private loaderService: LoaderService, private cdf: ChangeDetectorRef,
    private ngZone: NgZone,
    private dialog: MatDialog,
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
    this.phamracyList = this.modalData.pharmacyList;
    if (this.userModel != null) {
      this.MobLength = this.commonServices.auML(this.userModel.Mobileno);
      this.phLength = this.commonServices.auML(this.userModel.Phoneno1);
      this.phLength1 = this.commonServices.auML(this.userModel.Phoneno2);
      this.mobMask = this.commonServices.auX(this.userModel.Mobileno);
      this.phoneMask = this.commonServices.auX(this.userModel.Phoneno1);
      this.phoneMask1 = this.commonServices.auX(this.userModel.Phoneno2);
    }
    this.formCreation();
  }

  ngAfterViewInit() {
    this.autoCompletedLocation();
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

  onChangeByMob(mobno, e) {
    mobno = this.commonServices.validDigRep(mobno);
    if (mobno != null && mobno != "" && mobno != undefined) {
      var dtA = this.commonServices.validAUMobNo(mobno);
      var dtN = this.commonServices.validByMobileNo(mobno);
      if ((mobno.charAt(0) != 0 && mobno.length >= 1)) {
        if (e == 2) {
          this.phoneMask = this.commonServices.auX(mobno);
          this.phLength = 11;
          if (mobno.length != this.phLength && dtA != 2) { this.userForm.controls['Phoneno1'].setValidators([Validators.minLength(11)]); this.userForm.controls['Phoneno1'].setErrors({ 'incorrect': true }); }
        } else if (e == 3) {
          this.phoneMask1 = this.commonServices.auX(mobno);
          this.phLength1 = 11;
          if (mobno.length != this.phLength1 && dtA != 2) { this.userForm.controls['Phoneno2'].setValidators([Validators.minLength(11)]); this.userForm.controls['Phoneno2'].setErrors({ 'incorrect': true }); }
        } else {
          this.mobMask = this.commonServices.auX(mobno);
          this.MobLength = 11;
          if (mobno.length != this.MobLength && dtN != 2) { this.userForm.controls['Mobileno'].setValidators([Validators.minLength(11)]); this.userForm.controls['Mobileno'].setErrors({ 'incorrect': true }); }
        }
      }
      else if ((mobno.charAt(0) == 0 && mobno.length >= 2)) {
        var dtA2 = this.commonServices.validAUMobNo(mobno);
        var dtN2 = this.commonServices.validByMobileNo(mobno);
        if (e == 2) {
          this.phoneMask = this.commonServices.auX(mobno);
          this.phLength = 12;
          if (mobno.length != this.phLength && dtA2 != 2) { this.userForm.controls['Phoneno1'].setValidators([Validators.minLength(12)]); this.userForm.controls['Phoneno1'].setErrors({ 'incorrect': true }); }
        }
        else if (e == 3) {
          this.phoneMask1 = this.commonServices.auX(mobno);
          this.phLength1 = 12;
          if (mobno.length != this.phLength1 && dtA2 != 2) { this.userForm.controls['Phoneno2'].setValidators([Validators.minLength(12)]); this.userForm.controls['Phoneno2'].setErrors({ 'incorrect': true }); }
        } else {
          this.mobMask = this.commonServices.auX(mobno);
          this.MobLength = 12;
          if (mobno.length != this.MobLength && dtN2 != 2) { this.userForm.controls['Mobileno'].setValidators([Validators.minLength(12)]); this.userForm.controls['Mobileno'].setErrors({ 'incorrect': true }); }
        }
      }
    } else if (e == '' && e != false) {
      this.userForm.controls['Mobileno'].setErrors({ 'incorrect': true });
    }
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
      UserEmail: new FormControl(this.userModel.UserEmail, [
        Validators.required, Validators.email, Validators.pattern(this.commonServices.emailPattern)
      ]),
      Phoneno1: new FormControl(this.userModel.Phoneno1),
      Phoneno2: new FormControl(this.userModel.Phoneno2),
      City: new FormControl(this.userModel.City),
      StateId: new FormControl(this.userModel.StateId),
      CountryId: new FormControl(this.userModel.CountryId),
      Pincode: new FormControl(this.userModel.Pincode, [
        Validators.required
      ]),
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
      IsPharmacyGroup: new FormControl(this.userModel.IsPharmacyGroup),
      IsGroupAdmin: new FormControl(this.userModel.IsGroupAdmin),
    })
  }

  onSave(iswemail): void {
    var mobno = this.commonServices.validDigRep(this.userForm.value.Mobileno); var dt = this.commonServices.validAUMobNo(mobno);
    if (dt == 2) {
      if (this.userForm.value.Mobileno.charAt(0) != 0) {
        var m1 = "0" + mobno
        this.MobLength = 12; this.mobMask = this.commonServices.auX(m1); this.cdf.detectChanges();
        this.userForm.controls['Mobileno'].setValue(m1);
        this.userForm.controls['Mobileno'].setValidators([Validators.minLength(12)]);
      }
    }
    if (this.userForm.value.Phoneno1 != null && this.userForm.value.Phoneno1 != undefined && this.userForm.value.Phoneno1 != "") {
      var mobno2 = this.commonServices.validDigRep(this.userForm.value.Phoneno1); var dt2 = this.commonServices.validAUMobNo(mobno2);
      if (dt2 == 2) {
        if (this.userForm.value.Phoneno1.charAt(0) != 0) {
          var m2 = "0" + mobno2; this.phLength1 = 12; this.phoneMask1 = this.commonServices.auX(m2); this.cdf.detectChanges();
          this.userForm.controls['Phoneno1'].setValue(m2);
          this.userForm.controls['Phoneno1'].setValidators([Validators.minLength(12)]);
        }
      }
    } if (this.userForm.value.Phoneno2 != null && this.userForm.value.Phoneno2 != undefined && this.userForm.value.Phoneno2 != "") {
      var mobno3 = this.commonServices.validDigRep(this.userForm.value.Phoneno2); var dt3 = this.commonServices.validAUMobNo(mobno3);
      if (dt3 == 2) {
        if (this.userForm.value.Phoneno2.charAt(0) != 0) {
          var m3 = "0" + mobno3; this.phLength = 12; this.phoneMask = this.commonServices.auX(m3); this.cdf.detectChanges();
          this.userForm.controls['Phoneno2'].setValue(m3);
          this.userForm.controls['Phoneno2'].setValidators([Validators.minLength(12)]);
        }
      }
    }
    this.userForm.value.RoleId = 3;
    if (this.userModel.UserId !== null && this.userModel.UserId > 0) {
      this.userForm.addControl('UserId', new FormControl(this.userModel.UserId));
    }
    if (this.userForm.value.IsGroupAdmin != null && this.userForm.value.IsGroupAdmin) { this.userForm.value.RoleId = 2; }
    this.userForm.value.CreatedBy = this.loginDetails.UserId;
    this.spinner.show();
    var that = this;
    if (iswemail) {
      this.dialog.open(AlertDialogComponent, {
        disableClose: true,
        data: that.WEdata,
        width: 'auto',
        maxWidth: '430px',
        minWidth: '360px',
        height: that.WEdata.height
      }).afterClosed().subscribe(val => {
        if (val == 'Show') {
          this.trigerApi(this.userForm.value, true);
        }
        else if (val == 'Hide') {
          this.trigerApi(this.userForm.value, false);
        }
        else {
          // this.dialogRef.close();
        }
      });
    } else {
      this.trigerApi(this.userForm.value, false);
    }

  }

  sendWEmail() {
    this.commonServices.visibility = "shown"; this.commonServices.backDrpCls();
    this.apiServices.GetList(this.url + "SendWEmail?userid=" + this.userModel.UserId).subscribe(res => {
      console.log("SendWEmail ====> ", res);
      if (res) {
        this.apiServices.showSnack("Email Sent Successfully.");
      } else {
        this.apiServices.showSnack("Unable to send email.");
      }
      this.commonServices.backaddCls(); this.commonServices.visibility = "hidden";
    }, error => {
      console.log("SendWEmail Error ====> ", error);
      this.commonServices.backaddCls(); this.commonServices.visibility = "hidden";
      this.apiServices.showSnack("Unable to send email.");
    });
  }

  trigerApi(val, flag) {
    this.commonServices.visibility = "shown"; this.edited = false; this.commonServices.backDrpCls();
    this.apiServices.Post(val, this.url + "Post?roleid=" + this.loginDetails.RoleId + "&isMail=" + flag).subscribe(res => {
      if (res.flag == 4 || res.flag == 3 || res.flag == 2) {
        this.userForm.controls['Mobileno'].clearValidators();
        this.userForm.controls['Phoneno1'].clearValidators();
        this.userForm.controls['Phoneno2'].clearValidators();
        this.commonServices.backSetCls(false); this.apiServices.showSnack(res.ErroMessage); res.list = null; this.commonServices.visibility = "hidden";
        this.cdf.detectChanges();
        this.edited = true; return;
      }
      this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden"; this.dialogRef.close(res);
    }, error => {
      this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden";
      this.commonServices.customError(10); this.dialogRef.close(null);
    }
    );

  }
  closeDialog(): void {
    this.dialogRef.close();
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

}
