import { Component, OnInit, Inject, ViewChild, Input, ElementRef, NgZone, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatTableDataSource, MatDialog } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { PharmacyModel } from '../../modals/pharmacy-model';
import { ApiServices } from '../../../../views/services/api.services';
import { CommonServices } from '../../../../views/services/common';
import { MapsAPILoader } from '@agm/core';
import { LoaderService } from '../../../../views/services/loader.service';
import { GlobalConstant } from '../../globals/globalvariables';
import { BankDetailsComponent } from '../bank-details/bank-details.component';


interface State {
  id: number;
  name: string;
}
// interface City {
// id: number;
// name: string;
// }
interface Country {
  id: string;
  name: string;
}
declare var google: any;

@Component({
  selector: 'pp-pharmacy-dialog',
  templateUrl: './pharmacy-dialog.component.html',
  styleUrls: ['./pharmacy-dialog.component.scss']
})
export class PharmacyDialogComponent implements OnInit, AfterViewInit {
  loginDetails: any;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  DDReasonList = [];
  @Input() adressType: string;
  @ViewChild("search", { static: false }) public searchElementRef: ElementRef;


  url = 'Pharmacy/';
  // displayedColumnsDay = ['WeekDays', 'OpeningHours', 'ClosingHours', 'Meridian']
  displayedColumnsDay = ['WeekDays', 'OpeningHours', 'ClosingHours'];
  DELIVERY = [
    { PharmacyId: 0, ServingId: 0, Days: 'Sunday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 1 },
    { PharmacyId: 0, ServingId: 0, Days: 'Monday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 1 },
    { PharmacyId: 0, ServingId: 0, Days: 'Tuesday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 1 },
    { PharmacyId: 0, ServingId: 0, Days: 'Wednesday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 1 },
    { PharmacyId: 0, ServingId: 0, Days: 'Thursday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 1 },
    { PharmacyId: 0, ServingId: 0, Days: 'Friday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 1 },
    { PharmacyId: 0, ServingId: 0, Days: 'Saturday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 1 }];

  PICKUP = [
    { PharmacyId: 0, ServingId: 0, Days: 'Sunday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 2 },
    { PharmacyId: 0, ServingId: 0, Days: 'Monday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 2 },
    { PharmacyId: 0, ServingId: 0, Days: 'Tuesday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 2 },
    { PharmacyId: 0, ServingId: 0, Days: 'Wednesday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 2 },
    { PharmacyId: 0, ServingId: 0, Days: 'Thursday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 2 },
    { PharmacyId: 0, ServingId: 0, Days: 'Friday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 2 },
    { PharmacyId: 0, ServingId: 0, Days: 'Saturday', OpeningHours: '', OpeningFormat: 0, ClosingHours: '', ClosingFormat: 0, AvailableServices: 2 }];

  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  base64Image: any = '/assets/logo/Pharmacy-icon.svg';
  searchStateData = [];
  public statesList = [];
  public countryList = [];
  OTCDB = [{ Name: 'Not available', value: 0 }, { Name: 'Generic', value: 10000 }, { Name: 'Own', value: 1 }];
  pharmacyForm: FormGroup;
  pharmacy: PharmacyModel;
  id: any;
  pharmacyGroup: any[];
  pharmacyOffSet = [];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  edited = true;
  MobLength = 12;
  MobLength2 = 12;
  faxLength = 12;
  QFlag = false;
  public mobMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public faxMask = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  public mobMask2 = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
  QrCode = "";
  QrCodeTelehealthBooking = "";
  WosQrCode = "";
  constructor(
    public _formBuilder: FormBuilder, public loaderService: LoaderService,
    public apiServices: ApiServices,
    public commonServices: CommonServices,
    public spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<PharmacyDialogComponent>,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    private dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {
    this.pharmacy = new PharmacyModel(modalData); this.commonServices.backSetCls(false);
  }

  async ngOnInit() {
    this.loginDetails = JSON.parse(localStorage.getItem("userdetails")); this.edited = true;
    this.DDReasonList = this.modalData.DDReasonList;
    this.statesList = this.commonServices.getStatesList();
    this.countryList = this.commonServices.getCountryList();
    this.searchStateData = this.commonServices.getStatesList();
    this.pharmacy = new PharmacyModel(this.modalData);
    if (this.pharmacy != null) {
      if (this.modalData.PharmacyId === null || this.modalData.PharmacyId === undefined || (this.pharmacy.OTCDB != 0 && this.pharmacy.OTCDB != 10000)) {
        this.pharmacy.OTCDB = 1
      }
      this.MobLength = this.commonServices.auML(this.pharmacy.Phoneno1);
      this.MobLength2 = this.commonServices.auML(this.pharmacy.Phoneno2);
      this.faxLength = this.commonServices.auML(this.pharmacy.FaxId);
      this.mobMask = this.commonServices.auX(this.pharmacy.Phoneno1);
      this.mobMask2 = this.commonServices.auX(this.pharmacy.Phoneno2);
      this.faxMask = this.commonServices.auX(this.pharmacy.FaxId);
    }
    this.pharmacyGroup = this.pharmacy.pharmacyGroup;
    this.pharmacyOffSet = this.modalData.OffSetList;
    if (this.pharmacy.pharmacyserve_list.length > 0) {
      var deliveryPush = [];
      deliveryPush = this.getMissing(this.DELIVERY, this.pharmacy.pharmacyserve_list);
      deliveryPush = deliveryPush.concat(this.pharmacy.pharmacyserve_list);
      deliveryPush.sort(function sortByDay(a, b) {
        let day1 = a.Days.toLowerCase();
        let day2 = b.Days.toLowerCase();
        return sorter[day1] - sorter[day2];
      });
      this.pharmacy.pharmacyserve_list = deliveryPush;
      this.dataSource = new MatTableDataSource(this.pharmacy.pharmacyserve_list);

    } else {
      this.dataSource = new MatTableDataSource(this.DELIVERY);
    }
    if (this.pharmacy.pharmacyserve_list2.length > 0) {
      var pickupPush = [];
      pickupPush = this.getMissing(this.PICKUP, this.pharmacy.pharmacyserve_list2);
      pickupPush = pickupPush.concat(this.pharmacy.pharmacyserve_list2);
      pickupPush.sort(function sortByDay(a, b) {
        let day1 = a.Days.toLowerCase();
        let day2 = b.Days.toLowerCase();
        return sorter[day1] - sorter[day2];
      });
      this.pharmacy.pharmacyserve_list2 = pickupPush;
      this.dataSource2 = new MatTableDataSource(this.pharmacy.pharmacyserve_list2);
    } else {
      this.dataSource2 = new MatTableDataSource(this.PICKUP);
    }

    if (this.pharmacy != null && this.pharmacy.PharmacyLogo != null && this.pharmacy.PharmacyLogo != "" && this.pharmacy.PharmacyLogo != undefined && this.pharmacy.PharmacyLogo != 'data:image/png;base64,') {
      this.base64Image = this.pharmacy.PharmacyLogo;
    }

    if (this.pharmacy != null && this.pharmacy.QrCode != null && this.pharmacy.QrCode != "" && this.pharmacy.QrCode != undefined && this.pharmacy.QrCode != 'data:image/png;base64,') {
      this.QrCode = this.pharmacy.QrCode;
    }

    if (this.pharmacy != null && this.pharmacy.QrCodeTelehealthBooking != null && this.pharmacy.QrCodeTelehealthBooking != "" && this.pharmacy.QrCodeTelehealthBooking != undefined && this.pharmacy.QrCodeTelehealthBooking != 'data:image/png;base64,') {
      this.QrCodeTelehealthBooking = this.pharmacy.QrCodeTelehealthBooking;
    }
    if (this.pharmacy != null && this.pharmacy.WosQrCode != null && this.pharmacy.WosQrCode != "" && this.pharmacy.WosQrCode != undefined && this.pharmacy.WosQrCode != 'data:image/png;base64,') {
      this.WosQrCode = this.pharmacy.WosQrCode;
    }
    this.formCreation();
  }

  async getImages(fileLoader) {
    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      var reader: any = new FileReader();
      // reader._realReader.onload = (event: any) => {
      //   that.base64Image = reader._realReader.result;
      // };
      reader.addEventListener("load", function () {
        that.base64Image = reader.result;
        that.pharmacyForm.controls['PharmacyLogo'].setValue(reader.result);
      }, false);
      that.pharmacyForm.controls['PharmacyLogo'].markAsDirty();
      if (file) {
        that.pharmacy.PharmacyLogoName = file.name;
        reader.readAsDataURL(file);
        var regex = new RegExp("(.*?)\.(jpg|png|bmp|jpeg|gif)$");
        if (!(regex.test(file.name.toLowerCase()))) {
          that.pharmacy.PharmacyLogoName = ""; that.pharmacyForm.controls['PharmacyLogo'].setValue("");
          that.base64Image = ""; that.apiServices.showSnack('Sorry, Invalid file format.');
        }
      }
    }
  }

  addBnk() {
    var that = this;
    this.dialog.open(BankDetailsComponent, {
      data: {
        PharmacyId: this.pharmacy.PharmacyId
      },
      disableClose: true,
      height: 'auto',
      maxHeight: '45vw',
      maxWidth: '80vw',
      width: 'auto',
      minWidth: '40vw',
    }).afterClosed().subscribe(async res => {
      if (res) {
        this.modalData.StripeDetailsubmitted = res.acc.details_submitted;
        this.cdref.detectChanges();
      }

    });
  }

  GenerateQRImage() {
    if (this.QFlag) { this.apiServices.showSnack("Please wait loading..."); return true; }
    this.QFlag = true;
    this.apiServices.GetList(this.url + 'GenerateQRImage?id=' + this.modalData.PharmacyId).subscribe((res: any) => {
      if (res != null) {
        this.QrCode = res.QrCode;
        this.pharmacyForm.get('QrCode').setValue(res.QrCode);
      }
      this.QFlag = false;
    }, err => {
      this.QFlag = false;
    });
  }

  GenerateQRWOSImage() {
    if (this.QFlag) { this.apiServices.showSnack("Please wait loading..."); return true; }
    this.QFlag = true;
    this.apiServices.GetList(this.url + 'GenerateQRWOSImage?id=' + this.modalData.PharmacyId).subscribe((res: any) => {
      if (res != null) {
        this.WosQrCode = res.WosQrCode;
        this.pharmacyForm.get('WosQrCode').setValue(res.WosQrCode);
      }
      this.QFlag = false;
    }, err => {
      this.QFlag = false;
    });
  }

  GenerateQRImageTelehealth() {
    if (this.QFlag) { this.apiServices.showSnack("Please wait loading..."); return true; }
    var email = this.pharmacyForm.controls['Email1'].value;
    if (email == null || email == undefined || email == "") {
      this.apiServices.showSnack("Email 1 is required."); return;
    }
    this.QFlag = true;
    var encodedStringBtoA = btoa(encodeURIComponent(email));
    this.apiServices.GetList(this.url + 'GenerateQRImageTelehealth?id=' + this.modalData.PharmacyId + "&encode=" + encodedStringBtoA).subscribe((res: any) => {
      if (res != null) {
        this.QrCodeTelehealthBooking = res.QrCodeTelehealthBooking;
        this.modalData.TelehealthBranchUrl = res.TelehealthBranchUrl;
        this.pharmacyForm.get('QrCodeTelehealthBooking').setValue(res.QrCodeTelehealthBooking);
      }
      this.QFlag = false;
    }, err => {
      this.QFlag = false;
    });
  }

  onFaxchange(faxno) {
    faxno = this.commonServices.validDigRep(faxno);
    if (faxno != null && faxno != "" && faxno != undefined) {
      var dt = this.commonServices.faxNoValid(faxno);
      if (faxno.charAt(0) != 0 && faxno.length >= 1) {
        this.faxMask = this.commonServices.auX(faxno);
        this.faxLength = 11;
        if (faxno.length != this.faxLength && dt != 2) { this.pharmacyForm.controls['FaxId'].setValidators([Validators.minLength(11)]); this.pharmacyForm.controls['FaxId'].setErrors({ 'incorrect': true }); }
      }
      else if (faxno.charAt(0) == 0 && faxno.length > 1) {
        this.faxMask = this.commonServices.auX(faxno);
        this.faxLength = 12;
        if (faxno.length != this.faxLength && dt != 2) { this.pharmacyForm.controls['FaxId'].setValidators([Validators.minLength(11)]); this.pharmacyForm.controls['FaxId'].setErrors({ 'incorrect': true }); }
      } else {
        this.pharmacyForm.get('FaxId').setValidators(null); this.pharmacyForm.get('FaxId').setErrors(null);
      }
    }
    else {
      this.pharmacyForm.controls['FaxId'].setErrors({ 'incorrect': true });
    }
  }

  onChangeByMob(mobno, e) {
    mobno = this.commonServices.validDigRep(mobno);
    if (mobno != null && mobno != "" && mobno != undefined) {
      var dt = this.commonServices.validAUMobNo(mobno);
      if ((mobno.charAt(0) != 0 && mobno.length == 1) || (mobno.charAt(0) != 0 && mobno.length >= 8)) {
        if (e == 1) {
          this.mobMask2 = this.commonServices.auX(mobno);
          this.MobLength2 = 11;
          if (mobno.length != this.MobLength2 && dt != 2) { this.pharmacyForm.controls['Phoneno2'].setValidators([Validators.minLength(11)]); this.pharmacyForm.controls['Phoneno2'].setErrors({ 'incorrect': true }); }
        } else {
          this.mobMask = this.commonServices.auX(mobno);
          this.MobLength = 11;
          if (mobno.length != this.MobLength && dt != 2) { this.pharmacyForm.controls['Phoneno1'].setValidators([Validators.minLength(11)]); this.pharmacyForm.controls['Phoneno1'].setErrors({ 'incorrect': true }); }
        }
      }
      else if ((mobno.charAt(0) == 0 && mobno.length == 2) || (mobno.charAt(0) == 0 && mobno.length >= 9)) {
        if (e == 1) {
          this.mobMask2 = this.commonServices.auX(mobno);
          this.MobLength2 = 12;
          if (mobno.length != this.MobLength2 && dt != 2) { this.pharmacyForm.controls['Phoneno2'].setValidators([Validators.minLength(12)]); this.pharmacyForm.controls['Phoneno2'].setErrors({ 'incorrect': true }); }
        } else {
          this.mobMask = this.commonServices.auX(mobno);
          this.MobLength = 12;
          if (mobno.length != this.MobLength && dt != 2) { this.pharmacyForm.controls['Phoneno1'].setValidators([Validators.minLength(12)]); this.pharmacyForm.controls['Phoneno1'].setErrors({ 'incorrect': true }); }
        }
      }
    }
    else if (e != 1) {
      this.pharmacyForm.controls['Phoneno1'].setErrors({ 'incorrect': true });
    }
  }

  ngAfterViewInit() {
    this.autoCompletedLocation();
  }

  getMissing(a, b) {
    var missings = [];
    var matches = false;
    for (var i = 0; i < a.length; i++) {
      matches = false;
      for (var e = 0; e < b.length; e++) {
        if (a[i].Days === b[e].Days) matches = true;
      }
      if (!matches) missings.push(a[i]);
    }
    return missings;
  }

  getPosition = () => {
    var latitude, longitude;
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position.coords);
      }, (err) => {
        reject(err);
      });
    })
  }

  async getCurrentLocation(lat, lon): Promise<any> {
    let coords = await this.getPosition();
    this.pharmacyForm.get('Latitude').setValue(coords['latitude']);
    this.pharmacyForm.get('Longitude').setValue(coords['longitude']);
    this.pharmacy.Latitude = coords['latitude'];
    this.pharmacy.Longitude = coords['longitude'];
  }

  repeatstr(ch, n): any {
    let result = '';
    while (n-- > 0) {
      result += ch;
    }
    return result;
  }

  getPharmacyById() {
    // this.spinner.show();
    this.loaderService.display(true);
    this.apiServices.GetById(this.url + this.id).subscribe(res => {
      this.pharmacy = new PharmacyModel(res);
      this.formCreation();
      // this.spinner.hide();
      this.loaderService.display(false);
    }, error => {
      // this.spinner.hide();
      this.loaderService.display(false);
      this.commonServices.customError(1);
    });
  }

  Paste(e) {
    debugger
  }

  formCreation() {
    this.pharmacyForm = this._formBuilder.group({
      DDOnlineReasonId: new FormControl(this.pharmacy.DDOnlineReasonId),
      PharmacyLogo: new FormControl(this.pharmacy.PharmacyLogo),
      PharmacyLogoName: new FormControl(this.pharmacy.PharmacyLogoName),
      PharmacyName: new FormControl(this.pharmacy.PharmacyName, [
        Validators.required
      ]),
      ContactPersonName: new FormControl(this.pharmacy.ContactPersonName, [
        Validators.required
      ]),
      PharmacyGrpId: new FormControl(this.pharmacy.PharmacyGrpId, [
        Validators.required
      ]),
      Email1: new FormControl(this.pharmacy.Email1, [
        Validators.required, Validators.email, Validators.pattern(this.commonServices.emailPattern)
      ]),
      Email2: new FormControl(this.pharmacy.Email2, [Validators.email, Validators.pattern(this.commonServices.emailPattern)]),
      Phoneno1: new FormControl(this.pharmacy.Phoneno1, [Validators.required]),
      Phoneno2: new FormControl(this.pharmacy.Phoneno2),
      Address: new FormControl(this.pharmacy.Address),
      City: new FormControl(this.pharmacy.City),
      StateId: new FormControl(this.pharmacy.StateId),
      CountryId: new FormControl(this.pharmacy.CountryId),
      Pincode: new FormControl(this.pharmacy.Pincode, [
        Validators.required
      ]),
      FaxId: new FormControl(this.pharmacy.FaxId, [Validators.required]),
      // PharmacyNotes: new FormControl(this.pharmacy.PharmacyNotes),
      CreatedBy: new FormControl(this.pharmacy.CreatedBy),
      OpeningHours: new FormControl(this.pharmacy.OpeningHours),
      ClosingHours: new FormControl(this.pharmacy.ClosingHours),
      CreatedOn: new FormControl(this.pharmacy.CreatedOn),
      ModifiedOn: new FormControl(this.pharmacy.ModifiedOn),
      AvailableDelivery: new FormControl(this.pharmacy.AvailableDelivery),
      AvailablePickup: new FormControl(this.pharmacy.AvailablePickup),
      ConvenienceFee: new FormControl(this.pharmacy.ConvenienceFee),
      ReturnPrescriptionFee: new FormControl(this.pharmacy.ReturnPrescriptionFee),
      StripeConnectId: new FormControl(this.pharmacy.StripeConnectId),
      IsPharmacyDelivery: new FormControl(this.pharmacy.IsPharmacyDelivery),
      StoreId: new FormControl(this.pharmacy.StoreId),
      PaymentProcessingFee: new FormControl(this.pharmacy.PaymentProcessingFee),
      PharmacyOffSet: new FormControl(this.pharmacy.PharmacyOffSet),
      TransactionFee: new FormControl(this.pharmacy.TransactionFee),
      OFees: new FormControl(this.pharmacy.OFees),
      PerScriptFee: new FormControl(this.pharmacy.PerScriptFee),
      QrCode: new FormControl(this.pharmacy.QrCode),
      EncodePharmacyName: new FormControl(this.pharmacy.EncodePharmacyName),
      QrCodeTelehealthBooking: new FormControl(this.pharmacy.QrCodeTelehealthBooking),
      DoorDashStoreId: new FormControl(this.pharmacy.DoorDashStoreId),
      UberEatsStoreId: new FormControl(this.pharmacy.UberEatsStoreId),
      OnDemandPrice: new FormControl(this.pharmacy.OnDemandPrice),
      MedicalCertificatePrice: new FormControl(this.pharmacy.MedicalCertificatePrice),
      OnDemandCode: new FormControl(this.pharmacy.OnDemandCode),
      MedicalCertificateCode: new FormControl(this.pharmacy.MedicalCertificateCode),
      WosQrCode: new FormControl(this.pharmacy.WosQrCode),
      OTCDB: new FormControl(this.pharmacy.OTCDB),
      ServiceFee: new FormControl(this.pharmacy.ServiceFee, [
        Validators.required
      ]),
      DeliveryCharge: new FormControl(this.pharmacy.DeliveryCharge, [
        Validators.required
      ]),
      CreateOrderDeliveryFee: new FormControl(this.pharmacy.CreateOrderDeliveryFee, [Validators.required]),
      LongDistanceDeliveryFee: new FormControl(this.pharmacy.LongDistanceDeliveryFee),
      VendorId: new FormControl(this.pharmacy.VendorId),
      Latitude: new FormControl(this.pharmacy.Latitude, [
        Validators.required
      ]),
      Longitude: new FormControl(this.pharmacy.Longitude, [
        Validators.required
      ]),
      IsDDOnline: new FormControl(this.pharmacy.IsDDOnline),
      IsUEOnline: new FormControl(this.pharmacy.IsUEOnline),
      DDOTCPercentage: new FormControl(this.pharmacy.DDOTCPercentage),
      UEOTCPercentage: new FormControl(this.pharmacy.UEOTCPercentage),
      IsDD: new FormControl(this.pharmacy.IsDD),
      IsUE: new FormControl(this.pharmacy.IsUE)
    })
  }

  onSave(): void {
    var mobno = this.commonServices.validDigRep(this.pharmacyForm.value.Phoneno1); var dt = this.commonServices.validAUMobNo(mobno);
    if (dt == 2) {
      if (this.pharmacyForm.value.Phoneno1.charAt(0) != 0) { this.pharmacyForm.controls['Phoneno1'].setValue("0" + mobno); }
      else {
        this.pharmacyForm.controls['Phoneno1'].setValue(mobno);
      }
    }
    if (this.pharmacyForm.value.Phoneno2 != null && this.pharmacyForm.value.Phoneno2 != undefined && this.pharmacyForm.value.Phoneno2 != "") {
      var mobno2 = this.commonServices.validDigRep(this.pharmacyForm.value.Phoneno2); var dt2 = this.commonServices.validAUMobNo(mobno2);
      if (dt2 == 2) {
        if (this.pharmacyForm.value.Phoneno2.charAt(0) != 0) { this.pharmacyForm.controls['Phoneno2'].setValue("0" + mobno2); } else {
          this.pharmacyForm.controls['Phoneno2'].setValue(mobno);
        }
      }
    }

    if ((this.pharmacyForm.controls['DoorDashStoreId'].value != '' && this.pharmacyForm.controls['IsDDOnline'].value == false) && (this.pharmacyForm.controls['DDOnlineReasonId'].value == 0 || this.pharmacyForm.controls['DDOnlineReasonId'].value == null)) {
      this.apiServices.showSnack('Please select DoorDash reason');
      return;
    }

    // if (this.pharmacyForm.value.LongDistanceDeliveryFee !== "" && parseFloat(this.pharmacyForm.value.LongDistanceDeliveryFee) >= 0.01) {
    //   this.pharmacyForm.get("LongDistanceDeliveryFee").setValue(this.pharmacyForm.value.LongDistanceDeliveryFee);
    // } else {
    //   if (this.pharmacyForm.value.LongDistanceDeliveryFee == "") {
    //     this.pharmacyForm.get('Phoneno1').setErrors(null);
    //     this.apiServices.showSnack("Long distance delivery fee is required"); return;
    //   }
    //   else if (parseFloat(this.pharmacyForm.value.LongDistanceDeliveryFee) < 0.01) {
    //     this.pharmacyForm.get('Phoneno1').setErrors(null);
    //     this.apiServices.showSnack("Please enter valid long distance delivery fee"); return;
    //   }
    // }

    var fno = this.commonServices.validDigRep(this.pharmacyForm.value.FaxId); var ft = this.commonServices.faxNoValid(fno);
    if (ft == 2) {
      if (this.pharmacyForm.value.FaxId.charAt(0) != 0) { this.pharmacyForm.controls['FaxId'].setValue("0" + fno); }
      else {
        this.pharmacyForm.controls['FaxId'].setValue(fno);
      }
    }
    if (this.pharmacyForm.value.OTCDB == 1 && this.modalData.PharmacyId != null) {
      this.pharmacyForm.controls['OTCDB'].setValue(this.pharmacy.PharmacyId);
    }

    var encodedStringBtoA = btoa(encodeURIComponent(this.pharmacyForm.value.Email1));
    this.pharmacy.EncodePharmacyName = encodedStringBtoA;
    this.pharmacyForm.controls['EncodePharmacyName'].setValue(encodedStringBtoA);
    this.pharmacy.CreatedBy = this.loginDetails.UserId;
    this.pharmacyForm.addControl('CreatedBy', new FormControl(this.pharmacy.CreatedBy));
    if (this.pharmacy.PharmacyId !== 0) {
      this.pharmacyForm.addControl('PharmacyId', new FormControl(this.pharmacy.PharmacyId));
    }
    if (this.dataSource != null) {
      this.pharmacyForm.value.pharmacyServingsList = this.dataSource.data;
    }
    if (this.dataSource2.data != null) {
      this.pharmacyForm.value.pharmacyServingsList2 = this.dataSource2.data;
    }

    if (this.pharmacyForm.value.ReturnPrescriptionFee == null || this.pharmacyForm.value.ReturnPrescriptionFee == "" || this.pharmacyForm.value.ReturnPrescriptionFee == undefined) {
      this.pharmacyForm.value.ReturnPrescriptionFee = 0;
    }
    if (this.pharmacyForm.value.OnDemandPrice == null || this.pharmacyForm.value.OnDemandPrice == "" || this.pharmacyForm.value.OnDemandPrice == undefined) {
      this.pharmacyForm.value.OnDemandPrice = 0;
    }
    if (this.pharmacyForm.value.MedicalCertificatePrice == null || this.pharmacyForm.value.MedicalCertificatePrice == "" || this.pharmacyForm.value.MedicalCertificatePrice == undefined) {
      this.pharmacyForm.value.MedicalCertificatePrice = 0;
    }
    this.pharmacyForm.value.CreatedBy = this.loginDetails.UserId;
    // this.pharmacyForm.value.PharmacyLogo = this.base64Image == '/assets/packapill-icons/user/girl-2.png' ? "" : this.base64Image;
    this.pharmacyForm.value.PharmacyLogoName = this.pharmacy.PharmacyLogoName;
    this.pharmacyForm.value.DDOTCPercentage = this.pharmacyForm.value.DDOTCPercentage == null || this.pharmacyForm.value.DDOTCPercentage == "" ? 0 : this.pharmacyForm.value.DDOTCPercentage;
    this.pharmacyForm.value.UEOTCPercentage = this.pharmacyForm.value.UEOTCPercentage == null || this.pharmacyForm.value.UEOTCPercentage == "" ? 0 : this.pharmacyForm.value.UEOTCPercentage;
    this.commonServices.visibility = "shown"; this.edited = false; this.commonServices.backDrpCls();
    this.apiServices.Post(this.pharmacyForm.value, this.url + "Post").subscribe(
      response => {
        this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden"; this.dialogRef.close(response);
      },
      (error: any) => {
        console.log(error);
        this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden";
        this.commonServices.customError(10); this.dialogRef.close(null);
      });
  }

  saveShedule(response: any) {
    this.dataSource.data.forEach(element => {
      element['PharmacyId'] = response.id;
    });
    this.apiServices.Post(this.dataSource.data, this.url + 'Schedule').subscribe(res => {
      this.dialogRef.close(res);
    }, err => {
      this.dialogRef.close(response.list);
    })
  }

  changeDDOnline(value) {
    if (value) {
      this.pharmacyForm.controls['DDOnlineReasonId'].setValue(0);
    }
  }

  setDecimal(flag, e) {
    var val = e.target.value || 0;
    if (val == null || val == undefined) {
      return false;
    }
    val = parseFloat(val).toFixed(2);
    if (flag == 1) {
      this.pharmacyForm.get('ServiceFee').setValue(val);
    } else if (flag == 2) {
      this.pharmacyForm.get('DeliveryCharge').setValue(val);
    }
    else if (flag == 3) {
      this.pharmacyForm.get('ConvenienceFee').setValue(val);
    }
    else if (flag == 4) {
      this.pharmacyForm.get('PaymentProcessingFee').setValue(val);
    } else if (flag == 6) {
      this.pharmacyForm.get('ReturnPrescriptionFee').setValue(val);
    } else if (flag == 7) {
      this.pharmacyForm.get('PerScriptFee').setValue(val);
    } else if (flag == 8) {
      this.pharmacyForm.get('OFees').setValue(val);
    } else if (flag == 9) {
      this.pharmacyForm.get('DDOTCPercentage').setValue(val);
    }
    else if (flag == 10) {
      this.pharmacyForm.get('UEOTCPercentage').setValue(val);
    }
    else if (flag == 11) {
      this.pharmacyForm.get("CreateOrderDeliveryFee").setValue(val);
    }
    else if (flag == 12) {
      this.pharmacyForm.get("LongDistanceDeliveryFee").setValue(val);
    }
    else {
      this.pharmacyForm.get('TransactionFee').setValue(val);
    }
  }

  removeSpaces(val) {
    var text = this.commonServices.removeSpaces(val);
    this.pharmacyForm.get('StripeConnectId').setValue(text);
  }

  changeOpeningFormat(val, i): void {
    debugger
    this.dataSource.data[i].OpeningFormat = val;
  }

  closeDialog(): void {
    this.dialogRef.close();
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

  autoCompletedLocation() {
    //set google maps defaults
    this.zoom = 4;
    //create search FormControl
    this.searchControl = new FormControl();

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
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.pharmacy.Latitude = place.geometry.location.lat();
          this.pharmacyForm.get('Latitude').setValue(this.pharmacy.Latitude);
          this.pharmacy.Longitude = place.geometry.location.lng();
          this.pharmacyForm.get('Longitude').setValue(this.pharmacy.Longitude);
          this.pharmacy.Address = place['formatted_address'];
          this.pharmacyForm.get('Address').setValue(this.pharmacy.Address);

          this.pharmacy.Pincode = this.getPostCode(place);
          this.pharmacyForm.get('Pincode').setValue(this.pharmacy.Pincode);

          this.pharmacy.City = this.getCity(place);
          this.pharmacyForm.get('City').setValue(this.pharmacy.City);

          var stateid = this.getState(place);
          var filter = this.statesList.filter(function (val) { return val.code == stateid });
          if (filter.length > 0) {
            this.pharmacy.StateId = filter[0].id;
            this.pharmacyForm.get('StateId').setValue(this.pharmacy.StateId);
          }

          this.pharmacy.CountryId = 1;
          this.pharmacyForm.get('CountryId').setValue(this.pharmacy.CountryId);

        });
      });
    });
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

  // getDistrict(place) {
  //   const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
  //     state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
  //   return state;
  // }

  // getAutoCountry(place) {
  //   const COMPONENT_TEMPLATE = { country: 'long_name' },
  //     country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
  //   return country;
  // }

  getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }

  copyUrl(url: any) {
    navigator.clipboard.writeText(url);
    this.apiServices.showSnack("Link copied");
  }
}

const sorter = {
  // "sunday": 0, // << if sunday is first day of week
  "sunday": 1,
  "monday": 2,
  "tuesday": 3,
  "wednesday": 4,
  "thursday": 5,
  "friday": 6,
  "saturday": 7
}
