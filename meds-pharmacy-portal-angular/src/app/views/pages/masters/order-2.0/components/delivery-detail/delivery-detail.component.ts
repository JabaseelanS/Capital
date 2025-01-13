import { MapsAPILoader } from '@agm/core';
import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonServices } from '../../../../../../views/services/common';
import { ApiServices } from '../../../../../../views/services/api.services';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ChangePharmacyComponent } from '../change-pharmacy/change-pharmacy.component';

declare var google: any;
@Component({
  selector: 'pp-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.scss'],
  providers: [DatePipe]
})
export class DeliveryDetailComponent implements OnInit {
  @Input() order;
  public searchControl: FormControl;
  public zoom: number;
  IsDelivery = "";
  condata = {
    show: false,
    placehdat: '*'
  }
  url = 'PharmacistReviewV2/';
  @Input() adressType: string;
  deliveryBy = 1;
  userdetails: any;
  AddressModel = {
    City: "",
    State: "",
    DeliveryStreetNumber: "",
    Pincode: "",
    DeliveryUnit: "",
    location: {
      lng: 0,
      lat: 0
    },
    DeliveryStreetName: "",
    FullAddress: ''
  };
  @ViewChild("search", { static: true }) public searchElementRef: ElementRef;
  constructor(public commonServices: CommonServices,
    public mapsAPILoader: MapsAPILoader,
    private dialog: MatDialog,
    public cdRef: ChangeDetectorRef,
    public apiServices: ApiServices,
    public router: Router,
    public ngZone: NgZone) { }

  ngOnInit() {
    this.userdetails = JSON.parse(localStorage.getItem("userdetails"));
    if (this.order.DeliverBy == 1 || this.order.DeliverBy == 3) {
      this.autoCompletedLocation();
      this.recievedItem(this.order.deliveryAddressModel, true);
    }

  }

  changePharmacy(data) {
    this.dialog.open(ChangePharmacyComponent, {
      disableClose: true,
      data: data,
      width: ' 500px',
      // height: data.height
    }).afterClosed().subscribe(val => {
      if (val != null) {
        this.changepharmacyByApi(val);
      }
    });
  }

  async recievedItem(dat: any, chk) {
    var un = dat.DeliveryUnit ? dat.DeliveryUnit : '';
    var delad = un + " " + dat.DeliveryStreetNumber + ', ' + dat.DeliveryStreetName + ', ' + dat.City + ', ' + dat.State + ', ' + dat.Pincode
    if (dat.DeliveryStreetNumber != '' && dat.DeliveryStreetNumber != undefined && dat.DeliveryStreetNumber != null && dat.DeliveryStreetName != '' && dat.DeliveryStreetName != undefined && dat.DeliveryStreetName != null && dat.DeliveryCity != '' && dat.DeliveryCity != undefined && dat.DeliveryCity != null && dat.DeliveryState != '' && dat.DeliveryState != undefined && dat.DeliveryState != null && dat.DeliveryPincode != '' && dat.DeliveryPincode != undefined && dat.DeliveryPincode != null) {
      this.AddressModel.DeliveryStreetNumber = dat.DeliveryStreetNumber.toString(); //dat.DeliveryStreetNumber.toString();
      this.AddressModel.DeliveryStreetName = dat.DeliveryStreetName.toString();// dat.DeliveryStreetName.toString();
      this.AddressModel.City = dat.DeliveryCity.toString();
      this.AddressModel.Pincode = dat.DeliveryPincode.toString();// dat.DeliveryPincode.toString();
      this.AddressModel.State = dat.DeliveryState.toString(); //dat.DeliveryState.toString();
      this.AddressModel.DeliveryUnit = dat.DeliveryUnit.toString();// dat.DeliveryUnit.toString();
    }
    if (chk) {
      this.AddressModel.FullAddress = this.order.deliveryAddressModel.DeliveryAdd;
      this.order.deliveryAddressModel.DeliveryAddress = this.order.deliveryAddressModel.DeliveryAdd;
      // this.AddressModel.DeliveryUnit = this.order.deliveryAddressModel.DeliveryUnit;
    } else {
      this.order.deliveryAddressModel.DeliveryAddress = delad;
      this.AddressModel.FullAddress = delad;
    }

  }

  changepharmacyByApi(model) {
    this.commonServices.visibility = "shown";
    this.apiServices.Post(model, this.url + "ChangePharmacy").subscribe(res => {
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      this.apiServices.showSnack(res.ErroMessage);
      if (res.Operation == 1) { this.router.navigate(['/app/masters/live-order-2']); }
    }, error => {
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      this.apiServices.showSnack("Pharmacy updated failed.");
    });
  }

  async changeAddress(model) {
    this.order.deliveryAddressModel.OrderId = this.order.OrderId;

    // if (this.order.deliveryAddressModel.DeliveryAdd != null && this.order.deliveryAddressModel.DeliveryAdd != "" && this.IsDelivery.toString().trim().toLowerCase() != this.order.deliveryAddressModel.DeliveryAdd.toString().trim().toLowerCase()) {
    //   await this.getSelectedLatLng(this.order.deliveryAddressModel.DeliveryAdd);
    // }
    var deliveryadd = this.AddressModel.FullAddress;// this.order.deliveryAddressModel.DeliveryAddress;
    // this.order.deliveryAddressModel.DeliveryAdd = this.AddressModel.FullAddress;

    // if (deliveryadd != null && deliveryadd != "" && this.IsDelivery.toString().trim().toLowerCase() != deliveryadd.toString().trim().toLowerCase()) {
    //   await this.getSelectedLatLng(controls['DeliveryAddress'].value);

    // }

    if (deliveryadd != null && deliveryadd != "" && this.order.deliveryAddressModel.DeliveryAdd.toString().trim().toLowerCase() != this.order.deliveryAddressModel.DeliveryAddress.toString().trim().toLowerCase() || (deliveryadd == null || deliveryadd == "")) {

      if (this.AddressModel.DeliveryStreetNumber == '' || this.AddressModel.DeliveryStreetNumber == undefined || this.AddressModel.DeliveryStreetNumber == null) {

        this.apiServices.showSnack('Please enter a valid street no.'); return;
      }
      if (this.AddressModel.DeliveryStreetName == '' || this.AddressModel.DeliveryStreetName == undefined || this.AddressModel.DeliveryStreetName == null) {
        this.apiServices.showSnack('Please enter a valid street name.'); return;
      }
      if (this.AddressModel.City == '' || this.AddressModel.City == undefined || this.AddressModel.City == null) {
        this.apiServices.showSnack('Please enter a valid suburb.'); return;
      }
      if (this.AddressModel.Pincode == '' || this.AddressModel.Pincode == undefined || this.AddressModel.Pincode == null) {
        this.apiServices.showSnack('Please enter a valid postcode.'); return;
      }
      if (this.AddressModel.State == '' || this.AddressModel.State == undefined || this.AddressModel.State == null) {
        this.apiServices.showSnack('Please enter a valid state.'); return;
      }
      this.order.deliveryAddressModel.DeliveryUnit = this.AddressModel.DeliveryUnit;
      await this.getSelectedLatLng(this.AddressModel.FullAddress);
    }
    this.order.deliveryAddressModel.DeliveryUnit = this.AddressModel.DeliveryUnit;
    if (this.validBy(this.order.deliveryAddressModel.DeliveryAddress, "Delivery address")) { return; }

    if (this.validMBy(this.order.deliveryAddressModel.DeliveryStreetNumber, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (this.validMBy(this.order.deliveryAddressModel.DeliveryStreetName, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    if (this.validMBy(this.order.deliveryAddressModel.DeliveryCity, "Sorry couldn't find this address. Please select from the suggested addresses.")) { return; }

    // console.log(this.order.deliveryAddressModel);

    this.commonServices.visibility = "shown";
    this.apiServices.Post(this.order.deliveryAddressModel, this.url + "ChangeAddress").subscribe(res => {
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      this.apiServices.showSnack(res.ErroMessage);
    }, error => {
      this.commonServices.visibility = "hidden"; this.cdRef.detectChanges();
      this.apiServices.showSnack("Delivery address updated failed.");
    });

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

  autoCompletedLocation() {
    //set google maps defaults
    this.zoom = 4; this.IsDelivery = "";
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
          this.zoom = 12;
          this.order.deliveryAddressModel.DeliveryLattitude = place.geometry.location.lat().toString();
          this.order.deliveryAddressModel.DeliveryLongitude = place.geometry.location.lng().toString();

          this.order.deliveryAddressModel.DeliveryAddress = place['formatted_address'];
          if (this.commonServices.getUnit(place) != '') {
            this.order.deliveryAddressModel.DeliveryAdd = place['formatted_address'];
            this.order.deliveryAddressModel.DeliveryUnit = this.commonServices.getUnit(place);
          }
          // this.order.deliveryAddressModel.DeliveryUnit = this.commonServices.getUnit(place);
          this.order.deliveryAddressModel.DeliveryStreetNumber = this.commonServices.getStreetNumber(place);
          this.order.deliveryAddressModel.DeliveryStreetName = this.commonServices.getStreetName(place);
          this.order.deliveryAddressModel.DeliveryPincode = this.commonServices.getPostCode(place);
          this.order.deliveryAddressModel.DeliveryCity = this.commonServices.getCity(place);
          this.order.deliveryAddressModel.DeliveryState = this.commonServices.getState(place);
          this.AddressModel.DeliveryStreetNumber = this.commonServices.getStreetNumber(place); //dat.DeliveryStreetNumber.toString();
          this.AddressModel.DeliveryStreetName = this.commonServices.getStreetName(place);// dat.DeliveryStreetName.toString();
          this.AddressModel.City = this.commonServices.getCity(place);
          this.AddressModel.Pincode = this.commonServices.getPostCode(place);// dat.DeliveryPincode.toString();
          this.AddressModel.State = this.commonServices.getState(place); //dat.DeliveryState.toString();
          this.AddressModel.DeliveryUnit = this.commonServices.getUnit(place);
          this.AddressModel.FullAddress = place['formatted_address'];
          this.IsDelivery = this.order.deliveryAddressModel.DeliveryAdd;
        });
      });
    });
  }

  async getSelectedLatLng(address): Promise<any> {
    let _that = this;
    var lat = '';
    var lng = '';
    const geocoder = new google.maps.Geocoder();
    var request = {
      address: address,
      componentRestrictions: {
        country: 'au'
      }
    }
    await geocoder.geocode(request, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var cite = _that.commonServices.getCity(results[0]);
        if (cite != null && cite != undefined && cite != "" && address != null && address != undefined && address != "" && address.toLowerCase().indexOf(cite.toLowerCase()) == -1) {
          _that.order.deliveryAddressModel.DeliveryCity = "";
          return;
        }

        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        _that.order.deliveryAddressModel.DeliveryLattitude = lat;
        _that.order.deliveryAddressModel.DeliveryLongitude = lng;
        _that.order.deliveryAddressModel.DeliveryAdd = results[0]['formatted_address'];
        _that.order.deliveryAddressModel.DeliveryAddress = results[0]['formatted_address'];
        if (_that.commonServices.getUnit(results[0]) == '') {
          _that.order.deliveryAddressModel.DeliveryAdd = _that.AddressModel.DeliveryUnit + " " + _that.order.deliveryAddressModel.DeliveryAdd;
        }
        // _that.order.deliveryAddressModel.DeliveryUnit = _that.commonServices.getUnit(results[0]);
        _that.order.deliveryAddressModel.DeliveryStreetNumber = _that.commonServices.getStreetNumber(results[0]);
        _that.order.deliveryAddressModel.DeliveryStreetName = _that.commonServices.getStreetName(results[0]);
        _that.order.deliveryAddressModel.DeliveryPincode = _that.commonServices.getPostCode(results[0]);
        _that.order.deliveryAddressModel.DeliveryCity = _that.commonServices.getCity(results[0]);
        _that.order.deliveryAddressModel.DeliveryState = _that.commonServices.getState(results[0]);
      } else {
        _that.order.deliveryAddressModel.DeliveryAddress = "";
        _that.order.deliveryAddressModel.DeliveryAdd = '';
      }
    });
  }

}
