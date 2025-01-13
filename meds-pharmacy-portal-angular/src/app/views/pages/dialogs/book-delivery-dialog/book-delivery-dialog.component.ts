import { MapsAPILoader } from "@agm/core";
import { ThrowStmt } from "@angular/compiler";
import { ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { threadId } from "worker_threads";
import { ApiServices } from "../../../../../app/views/services/api.services";
import { CommonServices } from "../../../../../app/views/services/common";
import { DeletePopupComponent } from "../delete-popup/delete-popup.component";
import { DeliveryBookingModel } from "./book-delivery.model";
import { DatePipe } from "@angular/common";
import { AlertDialogComponent } from "../alert-dialog/alert.dialog.component";

declare var google: any;
@Component({
	selector: "pp-book-delivery-dialog",
	templateUrl: "./book-delivery-dialog.component.html",
	styleUrls: ["./book-delivery-dialog.component.scss"],
})
export class BookDeliveryDialogComponent implements OnInit {
	bookDeliveryForm: FormGroup;
	public zoom: number;
	public searchControl: FormControl;
	public searchControl2: FormControl;
	showDropdown = false;
	show = false;
	url = "DoorDash/";
	checkContactless: boolean = false;
	selectedOption: boolean = false;
	deliveryBookModel: DeliveryBookingModel;
	read = false;
	MobLength = 12;
	MinLength2 = 10;
	MinLength1 = 10;
	bkDis = false;
	public mobMask = [/[0-9]/, /[0-9]/, /[0 - 9]/, /[0-9]/, " ", /[0-9]/, /[0-9]/, /[0-9]/, " ", /[0-9]/, /[0-9]/, /[0-9]/];
	MobLength1 = 12;
	public mobMask1 = [/[0-9]/, /[0-9]/, /[0 - 9]/, /[0-9]/, " ", /[0-9]/, /[0-9]/, /[0-9]/, " ", /[0-9]/, /[0-9]/, /[0-9]/];
	condata = {
		show: false,
		placehdat: "",
	};
	PickupAddressModel = {
		City: "",
		State: "",
		DeliveryStreetNumber: "",
		Pincode: "",
		DeliveryUnit: "",
		location: {
			lng: 0,
			lat: 0,
		},
		DeliveryStreetName: "",
		ShortStreetName: "",
		Country: "",
	};
	DropAddressModel = {
		City: "",
		State: "",
		DeliveryStreetNumber: "",
		Pincode: "",
		DeliveryUnit: "",
		location: {
			lng: 0,
			lat: 0,
		},
		DeliveryStreetName: "",
		ShortStreetName: "",
		Country: "",
	};
	PickupDetailAddress = {
		city: "",
		state: "",
		street: "",
		streetnumber: "",
		streetname: "",
		zip_code: "",
		unit: "",
		location: {
			lng: 0,
			lat: 0,
		},
	};
	DropDetailAddress = {
		city: "",
		state: "",
		street: "",
		streetnumber: "",
		streetname: "",
		zip_code: "",
		unit: "",
		location: {
			lng: 0,
			lat: 0,
		},
	};
	CusomerDetail = {
		phone_number: "",
		first_name: "",
		last_name: "",
		email: "",
		should_send_notifications: false,
	};

	// Sherpa timing drop down list
	// deliveryOptions = [
	//   {
	//     "delivery_option": 5,
	//     "delivery_option_name": "1 Hour Delivery",
	//     "price": 18.1
	//   },
	//   {
	//     "delivery_option": 0,
	//     "delivery_option_name": "2 Hour Delivery",
	//     "price": 16.3
	//   },
	//   {
	//     "delivery_option": 1,
	//     "delivery_option_name": "4 Hour Delivery",
	//     "price": 14.67
	//   }
	// ]

	uberdirectdropoffeta: any;
	doordashdropoffeta: any;
	@ViewChild("searchPickup", { static: true }) public searchPickupElementRef: ElementRef;
	@ViewChild("searchDropoff", { static: true }) public searchDropElementRef: ElementRef;

	@Input() adressType: string;
	deliveryquote: any = [];
	selectedDeliveryPartnerId: any;
	sherpadeliveryoptionName: any;
	sherpadeliveryoptionId: any;
	sherpadeliveryoptionPrice: any;
	sherpaError: any;
	uperDirectError: any;
	DDError: any;
	sherpadeliveryOption: any = [];
	deliverypartner: any = [];
	IsUber: boolean = false;
	IsSherpa: boolean = false;
	IsDD: boolean = false;
	deliveryBookingId = 0;
	constructor(public dialogRef: MatDialogRef<BookDeliveryDialogComponent>, @Inject(MAT_DIALOG_DATA) public bnData: any, private cdf: ChangeDetectorRef, public apiServices: ApiServices, public commonService: CommonServices, public fb: FormBuilder, private dialog: MatDialog, public mapsAPILoader: MapsAPILoader, public datePipe: DatePipe, public ngZone: NgZone) {
		this.deliveryBookModel = new DeliveryBookingModel();
	}
	ngOnInit() {
		this.IsUber = this.bnData.IsUber;
		this.IsDD = this.bnData.IsDD;

		this.deliveryBookModel = this.bnData.Dbook;
		this.deliverypartner = this.bnData.Dpartner;
		this.sherpadeliveryOption = this.bnData.deliveryOptions;
		// this.bnData.Dbook.SherpaDeliverFor = "2025-01-03T13:30:00"; // new
		this.sherpaError = this.bnData.Dbook.SherpaErrorMsg;
		console.log("sherpaErrorMsg", this.sherpaError);
		this.DDError = this.bnData.Dbook.DDErrorMsg;
		console.log("DDError", this.DDError);
		this.uperDirectError = this.bnData.Dbook.ErroMessage;
		console.log("uperError", this.uperDirectError);

		this.uberdirectdropoffeta = this.bnData.Dbook.DropoffEta;
		this.doordashdropoffeta = this.bnData.Dbook.DoordashDropoffEta;
		if (this.bnData.Dbook.InvalidUdQuot != null && this.bnData.Dbook.InvalidDdQuot != null && this.bnData.Dbook.InvalidSherpaQuot != null) {
			this.apiServices.showSnack("DoorDash:" + this.bnData.Dbook.InvalidDdQuot + "\n" + "Uber Direct:" + this.bnData.Dbook.InvalidUdQuot + "\n" + "Sherpa:" + this.bnData.Dbook.InvalidSherpaQuot);
		} else if (this.bnData.Dbook.InvalidUdQuot != null && this.bnData.Dbook.InvalidDdQuot != null) {
			this.apiServices.showSnack("Uber Direct:" + this.bnData.Dbook.InvalidUdQuot + "\n" + "DoorDash:" + this.bnData.Dbook.InvalidDdQuot);
		} else if (this.bnData.Dbook.InvalidDdQuot != null && this.bnData.Dbook.InvalidSherpaQuot != null) {
			this.apiServices.showSnack("DoorDash:" + this.bnData.Dbook.InvalidDdQuot + "\n" + "Sherpa:" + this.bnData.Dbook.InvalidSherpaQuot);
		} else if (this.bnData.Dbook.InvalidSherpaQuot != null && this.bnData.Dbook.InvalidUdQuot != null) {
			this.apiServices.showSnack("Sherpa:" + this.bnData.Dbook.InvalidSherpaQuot + "\n" + "Uber Direct:" + this.bnData.Dbook.InvalidUdQuot);
		} else {
			if (this.bnData.Dbook.InvalidUdQuot != null) {
				this.apiServices.showSnack(this.bnData.Dbook.InvalidUdQuot);
			} else if (this.bnData.Dbook.InvalidDdQuot != null) {
				this.apiServices.showSnack(this.bnData.Dbook.InvalidDdQuot);
			} else if (this.bnData.Dbook.InvalidSherpaQuot != null) {
				this.apiServices.showSnack(this.bnData.Dbook.InvalidSherpaQuot);
			}
		}
		// if (this.bnData.Dbook.InvalidDdQuot != null) {
		//   this.apiServices.showSnack(this.bnData.Dbook.InvalidDdQuot);
		// }

		if (this.bnData.Dbook.ErrorFlag == 1 || this.bnData.Dbook.DDErrorFlag == 1 || this.bnData.Dbook.SherpaErrorFlag == 1) {
			this.selectedDeliveryPartnerId = this.bnData.Dbook.DeliveryBookingId > 0 ? this.bnData.Dbook.DeliveryPartnerId : 0;
			this.bnData.Dbook.DropoffEta = this.bnData.Dbook.DropoffEta != null ? this.datePipe.transform(new Date(this.bnData.Dbook.DropoffEta), "hh.mm a - d MMMM y", this.bnData.Dbook.DeliveryBookingId == 0 ? "UTC" : "") : this.bnData.Dbook.DropoffEta;
			this.bnData.Dbook.DoordashDropoffEta = this.bnData.Dbook.DoordashDropoffEta != null ? this.datePipe.transform(new Date(this.bnData.Dbook.DoordashDropoffEta), "hh.mm a - d MMMM y", this.bnData.Dbook.DeliveryBookingId == 0 ? "UTC" : "") : this.bnData.Dbook.DoordashDropoffEta;
			this.bnData.Dbook.SherpaDeliverFor = this.bnData.Dbook.SherpaDeliverFor != null ? this.datePipe.transform(new Date(this.bnData.Dbook.SherpaDeliverFor), "hh.mm a - d MMMM y", this.bnData.Dbook.DeliveryBookingId == 0 ? "UTC" : "") : this.bnData.Dbook.SherpaDeliverFor;
		}
		if (this.deliveryBookModel.DeliveryBookingId != null && this.deliveryBookModel.DeliveryBookingId > 0) {
			this.checkContactless = this.bnData.Dbook.IsContactLess;
			this.show = true;
			this.condata.show = true;
			// this.show = this.deliveryBookModel.CurrentStatus == "Awaiting Booking Details" || this.deliveryBookModel.CurrentStatus == "Book Delivery" ? false : true;
		}
		this.MobLength = this.commonService.auML(this.commonService.convertNum(this.deliveryBookModel.PickupContactMobile));
		this.mobMask = this.commonService.auX(this.commonService.convertNum(this.deliveryBookModel.PickupContactMobile));
		this.MobLength1 = this.commonService.auML(this.commonService.convertNum(this.deliveryBookModel.DropoffContactMobile));
		this.mobMask1 = this.commonService.auX(this.commonService.convertNum(this.deliveryBookModel.DropoffContactMobile));
		if (this.deliveryBookModel.PickupAddress != "") {
			// console.log(this.PickupAddressModel);
			this.PickupAddressModel.DeliveryUnit = this.deliveryBookModel.PickupUnit == "" || this.deliveryBookModel.PickupUnit == " " || this.deliveryBookModel.PickupUnit == null ? "" : this.deliveryBookModel.PickupUnit;
			if (this.deliveryBookModel.CurrentStatus == null || this.deliveryBookModel.CurrentStatus == "") {
				this.getLatLngAddress(this.deliveryBookModel.PickupAddress, 1, true);
			} else {
				this.PickupAddressModel.DeliveryStreetName = this.deliveryBookModel.PickupStreet == "" || this.deliveryBookModel.PickupStreet == " " || this.deliveryBookModel.PickupStreet == null ? "" : this.deliveryBookModel.PickupStreet;
				this.PickupAddressModel.DeliveryStreetNumber = this.deliveryBookModel.PickupStreetNumber == "" || this.deliveryBookModel.PickupStreetNumber == " " || this.deliveryBookModel.PickupStreetNumber == null ? "" : this.deliveryBookModel.PickupStreetNumber; //_that.commonService.getStreetNumber(results[0]).toString().trim();
				this.PickupAddressModel.City = this.deliveryBookModel.PickupCity == "" || this.deliveryBookModel.PickupCity == " " || this.deliveryBookModel.PickupCity == null ? "" : this.deliveryBookModel.PickupCity;
				this.PickupAddressModel.State = this.deliveryBookModel.PickupState == "" || this.deliveryBookModel.PickupState == " " || this.deliveryBookModel.PickupState == null ? "" : this.deliveryBookModel.PickupState;
				this.PickupAddressModel.Pincode = this.deliveryBookModel.PickupZipCode == "" || this.deliveryBookModel.PickupZipCode == " " || this.deliveryBookModel.PickupZipCode == null ? "" : this.deliveryBookModel.PickupZipCode;
			}
		}
		if (this.deliveryBookModel.DropoffAddress != "") {
			// console.log(this.DropAddressModel);
			if (this.deliveryBookModel.CurrentStatus == null || this.deliveryBookModel.CurrentStatus == "") {
				this.getLatLngAddress(this.deliveryBookModel.DropoffAddress, 2, true);
			} else {
				this.DropAddressModel.DeliveryUnit = this.deliveryBookModel.DropoffUnit == "" || this.deliveryBookModel.DropoffUnit == " " || this.deliveryBookModel.DropoffUnit == null ? "" : this.deliveryBookModel.DropoffUnit;
				this.DropAddressModel.DeliveryStreetName = this.deliveryBookModel.DropoffStreet == "" || this.deliveryBookModel.DropoffStreet == " " || this.deliveryBookModel.DropoffStreet == null ? "" : this.deliveryBookModel.DropoffStreet;
				this.DropAddressModel.DeliveryStreetNumber = this.deliveryBookModel.DropoffStreetNumber == "" || this.deliveryBookModel.DropoffStreetNumber == " " || this.deliveryBookModel.DropoffStreetNumber == null ? "" : this.deliveryBookModel.DropoffStreetNumber;
				this.DropAddressModel.City = this.deliveryBookModel.DropoffCity == "" || this.deliveryBookModel.DropoffCity == " " || this.deliveryBookModel.DropoffCity == null ? "" : this.deliveryBookModel.DropoffCity;
				this.DropAddressModel.State = this.deliveryBookModel.DropoffState == "" || this.deliveryBookModel.DropoffState == " " || this.deliveryBookModel.DropoffState == null ? "" : this.deliveryBookModel.DropoffState;
				this.DropAddressModel.Pincode = this.deliveryBookModel.DropoffZipCode == "" || this.deliveryBookModel.DropoffZipCode == " " || this.deliveryBookModel.DropoffZipCode == null ? "" : this.deliveryBookModel.DropoffZipCode;
			} // this.getLatLngAddress(this.deliveryBookModel.DropoffAddress, 2);
		}
		this.formInit();
		this.autoCompletedLocation();
		this.autoCompletedLocation2();
		this.commonService.backaddCls();
		this.deliveryBookingId = this.bnData.Dbook.DeliveryBookingId ? this.bnData.Dbook.DeliveryBookingId : 0;
		if (this.deliveryBookingId > 0) {
			if (this.bnData.deliveryOptions.length > 0) {
				this.selectoption(this.bnData.deliveryOptions[0]);
			}
		}
		this.commonService.visibility = "hidden";
	}
	ngAfterViewInit() {
		const defaultSherpaOption = this.sherpadeliveryOption.find((item) => item.delivery_option === 0);
		if (defaultSherpaOption && !this.bnData.Dbook.DeliveryBookingId) {
			this.selectoption(defaultSherpaOption);
		}
	}

	onRadioChange(partnerId: any) {
		if (this.show) {
			return false;
		}
		console.log("Delivery partner Id", partnerId);
		this.selectedDeliveryPartnerId = partnerId.DeliveryPartnerId;
		if (partnerId.DeliveryPartnerId == "3") {
			this.showDropdown = !this.showDropdown;
		} else {
			this.showDropdown = false;
		}

		if (this.bnData.Dbook.SherpaErrorMsg != null || this.bnData.Dbook.SherpaErrorMsg != undefined) {
			this.showDropdown = false;
		}
	}

	selectoption(timingprice: any) {
		console.log("timingprice", timingprice);
		this.sherpadeliveryoptionId = timingprice.delivery_option;
		console.log("DeliveryoptionId", this.sherpadeliveryoptionId);
		this.sherpadeliveryoptionName = timingprice.delivery_option_name;
		console.log("sherpaTimingPrice", this.sherpadeliveryoptionName);
		this.sherpadeliveryoptionPrice = timingprice.price;
		this.selectedOption = true;
	}

	getValue(id) {
		// var name = (list == 1 ? this.commonService.getStatesList() : this.commonService.getCountryList()).forEach(element => { if(element.id.toString() == id){return element.name}});
		var arr = this.commonService.getStatesList();
		arr.forEach((element) => {
			if (element.id.toString() == id) {
				id = element.code;
			}
		});
		return id;
	}

	formInit() {
		this.bookDeliveryForm = this.fb.group({
			DeliveryPartnerId: new FormControl(this.deliveryBookModel.DeliveryPartnerId),
			DeliveryPartnerName: new FormControl(this.deliveryBookModel.DeliveryPartnerName),
			PickupContactName: new FormControl(this.deliveryBookModel.PickupContactName),
			PickupAddress: new FormControl(this.deliveryBookModel.PickupAddress),
			PickupTime: new FormControl(this.deliveryBookModel.PickupTime),
			ContainsAlcohol: new FormControl(this.deliveryBookModel.ContainsAlcohol),
			PickupContactMobile: new FormControl(this.commonService.checkMaskNum(this.deliveryBookModel.PickupContactMobile)),
			PickupInstructions: new FormControl(this.deliveryBookModel.PickupInstructions), //(this.deliveryBookModel.PickupInstructions)
			DropoffFirstName: new FormControl(this.deliveryBookModel.DropoffFirstName),
			DropoffContactMobile: new FormControl(this.commonService.checkMaskNum(this.deliveryBookModel.DropoffContactMobile)),
			DropOffInstructions: new FormControl(this.deliveryBookModel.DropoffInstructions), //this.deliveryBookModel.DropoffInstructions
			DropoffAddress: new FormControl(this.deliveryBookModel.DropoffAddress),
			DropoffTime: new FormControl(this.deliveryBookModel.DropoffTime),
			DropoffLastName: new FormControl(this.deliveryBookModel.DropoffLastName),
			DropoffEmail: new FormControl(this.deliveryBookModel.DropoffEmail, [Validators.required, Validators.email, Validators.pattern(this.commonService.emailPattern)]),
			OrderValue: new FormControl(this.deliveryBookModel.OrderValue),
			ExternalBusinessName: new FormControl(),
			ExternalStoreId: new FormControl(),
		});
	}

	autoCompletedLocation() {
		//set google maps defaults
		this.zoom = 4;
		this.searchControl = new FormControl();
		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchPickupElementRef.nativeElement, {
				componentRestrictions: { country: "AUS" },
				types: [this.adressType], // 'establishment' / 'address' / 'geocode'
			});
			this.read = new google.maps.places.AutocompleteService();
			autocomplete.addListener("place_changed", (val) => {
				this.ngZone.run(() => {
					//get the place result
					const place = autocomplete.getPlace();
					// console.log(place);
					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					this.zoom = 12;
					var dtn = this.commonService.getStreetNumber(place).toString();
					this.PickupDetailAddress.location.lat = place.geometry.location.lat().toString();
					this.PickupDetailAddress.location.lng = place.geometry.location.lng().toString();
					this.PickupDetailAddress.unit = this.commonService.getUnit(place);
					// this.PickupDetailAddress.street = this.commonService.getStreetName(place);
					this.PickupDetailAddress.street = dtn ? dtn + ", " + this.commonService.getStreetName(place) : this.commonService.getStreetName(place);
					this.PickupDetailAddress.streetnumber = this.commonService.getStreetNumber(place);
					this.PickupDetailAddress.streetname = this.commonService.getStreetName(place);
					this.PickupDetailAddress.zip_code = this.commonService.getPostCode(place);
					this.PickupDetailAddress.state = this.commonService.getState(place);
					this.PickupDetailAddress.city = this.commonService.getCity(place);
					this.PickupAddressModel.DeliveryStreetNumber = this.commonService.getStreetNumber(place);
					this.PickupAddressModel.DeliveryStreetName = this.commonService.getStreetName(place);
					this.PickupAddressModel.City = this.commonService.getCity(place);
					this.PickupAddressModel.State = this.commonService.getState(place);
					this.PickupAddressModel.Pincode = this.commonService.getPostCode(place);
					this.PickupAddressModel.DeliveryUnit = this.commonService.getUnit(place);
					this.PickupAddressModel.location.lat = place.geometry.location.lat();
					this.PickupAddressModel.location.lng = place.geometry.location.lng();
					this.deliveryBookModel.PickupAddress = place["formatted_address"];
					this.deliveryBookModel.PickupState = this.PickupAddressModel.State;
					this.deliveryBookModel.PickupCity = this.PickupAddressModel.City;
					this.deliveryBookModel.PickupZipCode = this.PickupAddressModel.Pincode;
					this.deliveryBookModel.PickupStreet = this.PickupDetailAddress.streetname;
					this.deliveryBookModel.PickupStreetNumber = this.PickupDetailAddress.streetnumber;
					this.deliveryBookModel.PickupLatitude = this.PickupAddressModel.location.lat;
					this.deliveryBookModel.PickupLongitude = this.PickupAddressModel.location.lng;
					this.deliveryBookModel.PickupUnit = this.PickupDetailAddress.unit; // chk == true ? _that.commonService.getUnit(results[0]) : _that.deliveryBookModel.PickupUnit;// _that.commonService.getUnit(results[0]);//_that.PickupAddressModel.DeliveryUnit;
					this.bookDeliveryForm.get("PickupAddress").setValue(this.deliveryBookModel.PickupAddress);
					this.deliveryBookModel.ChangeDetPickupAddress = true;
				});
			});
		});
	}

	autoCompletedLocation2() {
		//set google maps defaults
		this.zoom = 4;
		//create search FormControl
		this.searchControl2 = new FormControl();
		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchDropElementRef.nativeElement, {
				componentRestrictions: { country: "AUS" },
				types: [this.adressType], // 'establishment' / 'address' / 'geocode'
			});
			autocomplete.addListener("place_changed", (val) => {
				this.ngZone.run(() => {
					//get the place result
					const place = autocomplete.getPlace();
					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					this.zoom = 12;
					var stn = this.commonService.getStreetNumber(place).toString();
					this.DropDetailAddress.location.lat = place.geometry.location.lat().toString();
					this.DropDetailAddress.location.lng = place.geometry.location.lng().toString();
					this.DropDetailAddress.unit = this.commonService.getUnit(place);
					this.DropDetailAddress.street = stn ? stn + ", " + this.commonService.getStreetName(place) : this.commonService.getStreetName(place);
					this.DropDetailAddress.zip_code = this.commonService.getPostCode(place);
					this.DropDetailAddress.state = this.commonService.getState(place);
					this.DropDetailAddress.city = this.commonService.getCity(place);
					this.DropDetailAddress.streetnumber = this.commonService.getStreetNumber(place);
					this.DropDetailAddress.streetname = this.commonService.getStreetName(place);
					this.DropAddressModel.DeliveryStreetNumber = this.commonService.getStreetNumber(place);
					this.DropAddressModel.DeliveryStreetName = this.commonService.getStreetName(place);
					this.DropAddressModel.City = this.commonService.getCity(place);
					this.DropAddressModel.State = this.commonService.getState(place);
					this.DropAddressModel.Pincode = this.commonService.getPostCode(place);
					this.DropAddressModel.DeliveryUnit = this.commonService.getUnit(place);
					this.DropAddressModel.location.lat = place.geometry.location.lat();
					this.DropAddressModel.location.lng = place.geometry.location.lng();
					this.deliveryBookModel.DropoffAddress = place["formatted_address"];
					this.deliveryBookModel.DropoffStreet = this.DropDetailAddress.streetname;
					this.deliveryBookModel.DropoffStreetNumber = this.DropDetailAddress.streetnumber;
					this.deliveryBookModel.DropoffUnit = this.DropDetailAddress.unit; // chk == true ? _that.commonService.getUnit(results[0]) : _that.deliveryBookModel.DropoffUnit;// _that.commonService.getUnit(results[0]);// _that.DropAddressModel.DeliveryUnit;
					this.deliveryBookModel.DropoffZipCode = this.DropDetailAddress.zip_code;
					this.deliveryBookModel.DropoffCity = this.DropDetailAddress.city;
					this.deliveryBookModel.DropoffState = this.DropDetailAddress.state;
					this.deliveryBookModel.DropoffLatitude = this.DropDetailAddress.location.lat;
					this.deliveryBookModel.DropoffLongitude = this.DropDetailAddress.location.lng;
					this.bookDeliveryForm.get("DropoffAddress").setValue(this.deliveryBookModel.DropoffAddress);
					this.deliveryBookModel.ChangeDetDropoffAddress = true;
				});
			});
		});
	}

	async getLatLngAddress(address, is, chk) {
		let _that = this;
		const geocoder = new google.maps.Geocoder();
		var request = {
			address: address,
			componentRestrictions: {
				country: "au",
			},
		};
		await geocoder.geocode(request, async function (results, status) {
			_that.ngZone.run(() => {
				if (status == google.maps.GeocoderStatus.OK && address != " ") {
					var cite = _that.commonService.getCity(results[0]);
					var stn = _that.commonService.getStreetNumber(results[0]);
					var streetName = _that.commonService.getStreetName(results[0]);
					var state = _that.commonService.getState(results[0]);
					var postcode = _that.commonService.getPostCode(results[0]);
					var unit = _that.commonService.getUnit(results[0]);
					var lat = results[0].geometry.location.lat();
					var lng = results[0].geometry.location.lng();

					if (is == 1) {
						if (_that.PickupAddressModel != null) {
							if (stn != null && stn != undefined && stn != "" && _that.PickupAddressModel.DeliveryStreetNumber != null && _that.PickupAddressModel.DeliveryStreetNumber != undefined && _that.PickupAddressModel.DeliveryStreetNumber != "" && _that.PickupAddressModel.DeliveryStreetNumber.trim() != stn.trim()) {
								_that.PickupDetailAddress.streetnumber = "";
								_that.PickupAddressModel.DeliveryStreetNumber = "";
								stn = "";
							}

							if (streetName != null && streetName != undefined && streetName != "" && _that.PickupAddressModel.DeliveryStreetName != null && _that.PickupAddressModel.DeliveryStreetName != undefined && _that.PickupAddressModel.DeliveryStreetName != "" && _that.PickupAddressModel.DeliveryStreetName.toLowerCase().trim() != streetName.toLowerCase().trim()) {
								_that.PickupDetailAddress.streetname = "";
								_that.PickupAddressModel.DeliveryStreetName = "";
								streetName = "";
							}

							if (cite != null && cite != undefined && cite != "" && _that.PickupAddressModel.City != null && _that.PickupAddressModel.City != undefined && _that.PickupAddressModel.City != "" && _that.PickupAddressModel.City.toLowerCase().trim() != cite.toLowerCase().trim()) {
								_that.PickupDetailAddress.city = "";
								_that.PickupAddressModel.City = "";
								cite = "";
							}
						}
						_that.PickupDetailAddress.street = stn ? stn + ", " + streetName : streetName;
						_that.PickupDetailAddress.streetname = streetName;
						_that.PickupDetailAddress.streetnumber = stn;
						_that.PickupDetailAddress.city = cite;
						_that.PickupDetailAddress.state = state;
						_that.PickupDetailAddress.zip_code = postcode;
						_that.PickupDetailAddress.unit = chk == true ? unit : _that.deliveryBookModel.PickupUnit; //_that.deliveryBookModel.PickupUnit; //_that.commonService.getUnit(results[0]);
						_that.PickupDetailAddress.location.lat = lat;
						_that.PickupDetailAddress.location.lng = lng;
						_that.deliveryBookModel.PickupAddress = results[0].formatted_address;
						_that.deliveryBookModel.PickupStreet = streetName;
						_that.deliveryBookModel.PickupStreetNumber = stn;
						_that.deliveryBookModel.PickupUnit = chk == true ? unit : _that.deliveryBookModel.PickupUnit; // _that.commonService.getUnit(results[0]);//_that.PickupAddressModel.DeliveryUnit;
						_that.PickupAddressModel.DeliveryStreetName = streetName;
						_that.PickupAddressModel.DeliveryStreetNumber = stn; //_that.commonService.getStreetNumber(results[0]).toString().trim();
						_that.PickupAddressModel.City = cite;
						_that.PickupAddressModel.State = state;
						_that.PickupAddressModel.Pincode = postcode;
						_that.PickupAddressModel.DeliveryUnit = _that.deliveryBookModel.PickupUnit; //_that.commonService.getUnit(results[0]);
						_that.PickupAddressModel.location.lat = lat;
						_that.PickupAddressModel.location.lng = lng;
						_that.bookDeliveryForm.get("PickupAddress").setValue(_that.deliveryBookModel.PickupAddress);
					} else if (is == 2) {
						if (_that.DropAddressModel != null) {
							if (stn != null && stn != undefined && stn != "" && _that.DropAddressModel.DeliveryStreetNumber != null && _that.DropAddressModel.DeliveryStreetNumber != undefined && _that.DropAddressModel.DeliveryStreetNumber != "" && _that.DropAddressModel.DeliveryStreetNumber.trim() != stn.trim()) {
								_that.DropDetailAddress.streetnumber = "";
								_that.DropAddressModel.DeliveryStreetNumber = "";
								stn = "";
							}

							if (streetName != null && streetName != undefined && streetName != "" && _that.DropAddressModel.DeliveryStreetName != null && _that.DropAddressModel.DeliveryStreetName != undefined && _that.DropAddressModel.DeliveryStreetName != "" && _that.DropAddressModel.DeliveryStreetName.toLowerCase().trim() != streetName.toLowerCase().trim()) {
								_that.DropDetailAddress.streetname = "";
								_that.DropAddressModel.DeliveryStreetName = "";
								streetName = "";
							}

							if (cite != null && cite != undefined && cite != "" && _that.DropAddressModel.City != null && _that.DropAddressModel.City != undefined && _that.DropAddressModel.City != "" && _that.DropAddressModel.City.toLowerCase().trim() != cite.toLowerCase().trim()) {
								_that.DropDetailAddress.city = "";
								_that.DropAddressModel.City = "";
								cite = "";
							}
						}

						_that.DropDetailAddress.street = stn ? stn + ", " + streetName : streetName;
						_that.DropDetailAddress.streetname = streetName;
						_that.DropDetailAddress.streetnumber = stn;
						_that.DropDetailAddress.city = cite;
						_that.DropDetailAddress.state = state;
						_that.DropDetailAddress.zip_code = postcode;
						_that.DropDetailAddress.unit = chk == true ? unit : _that.deliveryBookModel.DropoffUnit; //_that.deliveryBookModel.DropoffUnit;//_that.commonService.getUnit(results[0]);
						_that.DropDetailAddress.location.lat = lat;
						_that.DropDetailAddress.location.lng = lng;
						_that.deliveryBookModel.DropoffAddress = results[0].formatted_address;
						_that.deliveryBookModel.DropoffStreet = streetName;
						_that.deliveryBookModel.DropoffStreetNumber = stn;
						_that.deliveryBookModel.DropoffUnit = chk == true ? unit : _that.deliveryBookModel.DropoffUnit; // _that.commonService.getUnit(results[0]);// _that.DropAddressModel.DeliveryUnit;
						_that.DropAddressModel.DeliveryStreetName = streetName;
						_that.DropAddressModel.DeliveryStreetNumber = stn ? stn : "";
						_that.DropAddressModel.City = cite;
						_that.DropAddressModel.State = state;
						_that.DropAddressModel.Pincode = postcode;
						_that.DropAddressModel.DeliveryUnit = _that.deliveryBookModel.DropoffUnit; // _that.commonService.getUnit(results[0]);
						_that.DropAddressModel.location.lat = lat;
						_that.DropAddressModel.location.lng = lng;
						_that.bookDeliveryForm.get("DropoffAddress").setValue(_that.deliveryBookModel.DropoffAddress);
					}
				} else {
					if (is == 1) {
						_that.PickupDetailAddress.street = "";
						_that.PickupDetailAddress.streetname = "";
						_that.PickupDetailAddress.streetnumber = "";
						_that.PickupDetailAddress.city = "";
						_that.PickupDetailAddress.state = "";
						_that.PickupDetailAddress.zip_code = "";
						_that.PickupDetailAddress.unit = "";
						_that.PickupDetailAddress.location.lat = null;
						_that.PickupDetailAddress.location.lng = null;
						_that.deliveryBookModel.PickupAddress = "";
						_that.deliveryBookModel.PickupStreet = "";
						_that.deliveryBookModel.PickupStreetNumber = "";
						_that.deliveryBookModel.PickupUnit = "";
						_that.PickupAddressModel.DeliveryStreetName = "";
						_that.PickupAddressModel.DeliveryStreetNumber = ""; //_that.commonService.getStreetNumber(results[0]).toString().trim();
						_that.PickupAddressModel.City = "";
						_that.PickupAddressModel.State = "";
						_that.PickupAddressModel.Pincode = "";
						_that.PickupAddressModel.DeliveryUnit = "";
						_that.PickupAddressModel.location.lat = null;
						_that.PickupAddressModel.location.lng = null;
					} else if (is == 2) {
						_that.DropDetailAddress.street = "";
						_that.DropDetailAddress.streetname = "";
						_that.DropDetailAddress.streetnumber = "";
						_that.DropDetailAddress.city = "";
						_that.DropDetailAddress.state = "";
						_that.DropDetailAddress.zip_code = "";
						_that.DropDetailAddress.unit = "";
						_that.DropDetailAddress.location.lat = null;
						_that.DropDetailAddress.location.lng = null;
						_that.deliveryBookModel.DropoffAddress = "";
						_that.deliveryBookModel.DropoffStreet = "";
						_that.deliveryBookModel.DropoffStreetNumber = "";
						_that.deliveryBookModel.DropoffUnit = "";
						_that.DropAddressModel.DeliveryStreetName = "";
						_that.DropAddressModel.DeliveryStreetNumber = "";
						_that.DropAddressModel.City = "";
						_that.DropAddressModel.State = "";
						_that.DropAddressModel.Pincode = "";
						_that.DropAddressModel.DeliveryUnit = "";
						_that.DropAddressModel.location.lat = null;
						_that.DropAddressModel.location.lng = null;
					}
				}
			});
		});
	}

	setBkdrpCls() {
		this.commonService.backaddCls();
		this.commonService.visibility = "hidden";
	}

	addBkdrpcls() {
		this.commonService.visibility = "shown";
		this.commonService.backDrpCls();
	}

	async precievedItem(dat: any) {
		var un = dat.DeliveryUnit ? dat.DeliveryUnit : "";
		var sn = dat.DeliveryStreetNumber ? dat.DeliveryStreetNumber : "";
		var delad = un + " " + sn + " " + this.PickupAddressModel.DeliveryStreetName + ", " + this.PickupAddressModel.City + ", " + this.PickupAddressModel.State + ", " + this.PickupAddressModel.Pincode;
		if ((dat.DeliveryStreetName != "" && dat.DeliveryStreetName != undefined && dat.DeliveryStreetName != null) || (dat.City != "" && dat.City != undefined && dat.City != null) || (dat.State != "" && dat.State != undefined && dat.State != null) || (dat.Pincode != "" && dat.Pincode != undefined && dat.Pincode != null)) {
			this.PickupAddressModel.DeliveryStreetNumber = dat.DeliveryStreetNumber.toString();
			this.PickupAddressModel.DeliveryStreetName = dat.DeliveryStreetName.toString();
			this.PickupAddressModel.City = dat.City.toString();
			this.PickupAddressModel.Pincode = dat.Pincode.toString();
			this.PickupAddressModel.State = dat.State.toString();
			this.PickupAddressModel.DeliveryUnit = un;

			this.PickupDetailAddress.streetnumber = dat.DeliveryStreetNumber.toString();
			this.PickupDetailAddress.streetname = dat.DeliveryStreetName.toString();
			this.PickupDetailAddress.city = dat.City.toString();
			this.PickupDetailAddress.zip_code = dat.Pincode.toString();
			this.PickupDetailAddress.state = dat.State.toString();
			this.PickupDetailAddress.unit = un;
		}
		this.deliveryBookModel.PickupAddress = delad;
		this.deliveryBookModel.PickupUnit = un;
	}

	async drecievedItem(dat: any) {
		var un = dat.DeliveryUnit ? dat.DeliveryUnit : "";
		var sn = dat.DeliveryStreetNumber ? dat.DeliveryStreetNumber : "";
		var delad = un + " " + sn + " " + this.DropAddressModel.DeliveryStreetName + ", " + this.DropAddressModel.City + ", " + this.DropAddressModel.State + ", " + this.DropAddressModel.Pincode;
		if ((dat.DeliveryStreetName != "" && dat.DeliveryStreetName != undefined && dat.DeliveryStreetName != null) || (dat.City != "" && dat.City != undefined && dat.City != null) || (dat.State != "" && dat.State != undefined && dat.State != null) || (dat.Pincode != "" && dat.Pincode != undefined && dat.Pincode != null)) {
			this.DropAddressModel.DeliveryStreetNumber = dat.DeliveryStreetNumber.toString();
			this.DropAddressModel.DeliveryStreetName = dat.DeliveryStreetName.toString();
			this.DropAddressModel.City = dat.City.toString();
			this.DropAddressModel.Pincode = dat.Pincode.toString();
			this.DropAddressModel.State = dat.State.toString();
			this.DropAddressModel.DeliveryUnit = un;

			this.DropDetailAddress.streetnumber = dat.DeliveryStreetNumber.toString();
			this.DropDetailAddress.streetname = dat.DeliveryStreetName.toString();
			this.DropDetailAddress.city = dat.City.toString();
			this.DropDetailAddress.zip_code = dat.Pincode.toString();
			this.DropDetailAddress.state = dat.State.toString();
			this.DropDetailAddress.unit = un;
		}
		this.deliveryBookModel.DropoffAddress = delad;
		this.deliveryBookModel.DropoffUnit = un;
	}

	onPasting(event: ClipboardEvent) {
		let clipboardData = event.clipboardData;
		let pastedText = clipboardData.getData("text");
		if (pastedText != "" && pastedText != null && pastedText != undefined) {
			pastedText = pastedText.replace(/undefined/gi, "").replace(/^\s+|\s+$/g, "");
			this.bookDeliveryForm.controls["DropoffEmail"].setValue(this.bookDeliveryForm.value.DropoffEmail.replace(pastedText));
			setTimeout(() => {
				document.getElementById("dpoffEmail").blur();
			}, 50);
			this.cdf.detectChanges();
		}
	}

	removeSpace() {
		this.bookDeliveryForm.controls["DropoffEmail"].setValue(this.bookDeliveryForm.value.DropoffEmail.replace(/undefined/gi, "").replace(/^\s+|\s+$/g, ""));
		this.cdf.detectChanges();
	}

	async bookDelivery(data, sherpadeliveryoptionId, stat) {
		console.log("SherpadeliveryoptionId", sherpadeliveryoptionId);
		this.deliveryBookModel.PickupDetAddress = this.PickupDetailAddress;
		this.deliveryBookModel.DropoffDetAddress = this.DropDetailAddress;

		if (this.deliveryBookModel.PickupAddress != null && this.deliveryBookModel.PickupAddress != "") {
			if (this.PickupDetailAddress.streetnumber.toString().trim() == "" || this.PickupDetailAddress.streetnumber == null || this.PickupAddressModel.DeliveryStreetNumber.toString().trim() == "" || this.PickupAddressModel.DeliveryStreetName == null) {
				this.setBkdrpCls();
				this.apiServices.showSnack("Pickup address street number is required.");
				this.bkDis = false;
				return;
			}

			if (this.PickupDetailAddress.street.toString().trim() == "" || this.PickupDetailAddress.street == null || this.PickupAddressModel.DeliveryStreetName.toString().trim() == "" || this.PickupAddressModel.DeliveryStreetName == null) {
				this.setBkdrpCls();
				this.apiServices.showSnack("Pickup address street name is required.");
				this.bkDis = false;
				return;
			}

			if (this.PickupDetailAddress.city.toString().trim() == "" || this.PickupDetailAddress.city == null || this.PickupAddressModel.City.toString().trim() == "" || this.PickupAddressModel.City == null) {
				this.setBkdrpCls();
				this.apiServices.showSnack("Pickup address suburb is required.");
				this.bkDis = false;
				return;
			}

			if (this.PickupDetailAddress.state.toString().trim() == "" || this.PickupDetailAddress.state == null || this.PickupAddressModel.State.toString().trim() == "" || this.PickupAddressModel.State == null) {
				this.setBkdrpCls();
				this.apiServices.showSnack("Pickup address state is required.");
				this.bkDis = false;
				return;
			}

			if (this.PickupDetailAddress.zip_code.toString().trim() == "" || this.PickupDetailAddress.zip_code == null || this.PickupAddressModel.Pincode.toString().trim() == "" || this.PickupAddressModel.Pincode == null) {
				this.setBkdrpCls();
				this.apiServices.showSnack("Pickup address postcode is required.");
				this.bkDis = false;
				return;
			}

			await this.getLatLngAddress(this.deliveryBookModel.PickupAddress, 1, true);
			var stri1 = this.deliveryBookModel.PickupStreetNumber + "" + this.deliveryBookModel.PickupStreet + "" + this.deliveryBookModel.PickupState + "" + this.deliveryBookModel.PickupCity + "" + this.deliveryBookModel.PickupZipCode;
			stri1 = stri1
				.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
				.replace(/\s/g, "")
				.trim()
				.toLowerCase();
			var manualSAdd = this.PickupAddressModel.DeliveryStreetNumber + " " + this.PickupAddressModel.ShortStreetName + ", " + this.PickupAddressModel.City + " " + this.PickupAddressModel.State + " " + this.PickupAddressModel.Pincode; // + " " + this.PickupAddressModel.Country;
			manualSAdd = manualSAdd
				.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
				.replace(/\s/g, "")
				.trim()
				.toLowerCase();
			var manualLAdd = this.PickupAddressModel.DeliveryStreetNumber + " " + this.PickupAddressModel.DeliveryStreetName + ", " + this.PickupAddressModel.City + " " + this.PickupAddressModel.State + " " + this.PickupAddressModel.Pincode; // + " " + this.PickupAddressModel.Country;
			manualLAdd = manualLAdd
				.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
				.replace(/\s/g, "")
				.trim()
				.toLowerCase();
			if (manualSAdd != stri1 && manualLAdd != stri1) {
				if (this.PickupDetailAddress.streetnumber.toString().trim() != this.PickupAddressModel.DeliveryStreetNumber.toString().trim() || this.PickupAddressModel.DeliveryStreetNumber == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Pickup address street number is invalid.");
					this.bkDis = false;
					return;
				}
				if (this.PickupDetailAddress.streetname.toString().trim().toLowerCase() != this.PickupAddressModel.DeliveryStreetName.toString().trim().toLowerCase() || this.PickupAddressModel.DeliveryStreetName == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Pickup address street name is invalid.");
					this.bkDis = false;
					return;
				}
				if (this.PickupDetailAddress.city.toString().trim().toLowerCase() != this.PickupAddressModel.City.toString().trim().toLowerCase() || this.PickupAddressModel.City == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Pickup address suburb is invalid.");
					this.bkDis = false;
					return;
				}
				if (this.PickupDetailAddress.state.toString().trim().toLowerCase() != this.PickupAddressModel.State.toString().trim().toLowerCase() || this.PickupAddressModel.State == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Pickup address state is invalid.");
					this.bkDis = false;
					return;
				}
				if (this.PickupDetailAddress.zip_code.toString().trim().toLowerCase() != this.PickupAddressModel.Pincode.toString().trim().toLowerCase() || this.PickupAddressModel.Pincode == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Pickup address postcode is invalid.");
					this.bkDis = false;
					return;
				}
			} else {
				await this.getLatLngAddress(this.deliveryBookModel.PickupAddress, 1, false);
			}
		}

		if (this.deliveryBookModel.DropoffAddress != null && this.deliveryBookModel.DropoffAddress != "") {
			if (this.DropDetailAddress.streetnumber.toString().trim() == "" || this.DropDetailAddress.streetnumber == null || this.DropAddressModel.DeliveryStreetNumber.toString().trim() == "") {
				this.setBkdrpCls();
				this.apiServices.showSnack("Dropoff address street number is required.");
				this.bkDis = false;
				return;
			}
			if (this.DropDetailAddress.street.toString().trim() == "" || this.DropDetailAddress.street == null || this.DropAddressModel.DeliveryStreetName.toString().trim() == "" || this.DropAddressModel.DeliveryStreetName == null) {
				this.setBkdrpCls();
				this.apiServices.showSnack("Dropoff address street name is required.");
				this.bkDis = false;
				return;
			}
			if (this.DropDetailAddress.city.toString().trim() == "" || this.DropDetailAddress.city == null || this.DropAddressModel.City.toString().trim() == "" || this.DropAddressModel.City == null) {
				this.setBkdrpCls();
				this.apiServices.showSnack("Dropoff address suburb is required.");
				this.bkDis = false;
				return;
			}
			if (this.DropDetailAddress.state.toString().trim() == "" || this.DropDetailAddress.state == null || this.DropAddressModel.State.toString().trim() == "" || this.DropAddressModel.State == null) {
				this.setBkdrpCls();
				this.apiServices.showSnack("Dropoff address state is required.");
				this.bkDis = false;
				return;
			}
			if (this.DropDetailAddress.zip_code.toString().trim() == "" || this.DropDetailAddress.zip_code == null || this.DropAddressModel.Pincode.toString().trim() == "" || this.DropAddressModel.Pincode == null) {
				this.setBkdrpCls();
				this.apiServices.showSnack("Dropoff address postcode is required.");
				this.bkDis = false;
				return;
			}
			await this.getLatLngAddress(this.deliveryBookModel.DropoffAddress, 2, true);
			var stri1 = this.deliveryBookModel.DropoffStreetNumber + "" + this.deliveryBookModel.DropoffStreet + "" + this.deliveryBookModel.DropoffState + "" + this.deliveryBookModel.DropoffCity + "" + this.deliveryBookModel.DropoffZipCode;
			stri1 = stri1
				.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
				.replace(/\s/g, "")
				.trim()
				.toLowerCase();
			var manualSAdd = this.DropAddressModel.DeliveryStreetNumber + " " + this.DropAddressModel.ShortStreetName + ", " + this.DropAddressModel.City + " " + this.DropAddressModel.State + " " + this.DropAddressModel.Pincode; // + " " + this.DropAddressModel.Country;
			manualSAdd = manualSAdd
				.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
				.replace(/\s/g, "")
				.trim()
				.toLowerCase();
			var manualLAdd = this.DropAddressModel.DeliveryStreetNumber + " " + this.DropAddressModel.DeliveryStreetName + ", " + this.DropAddressModel.City + " " + this.DropAddressModel.State + " " + this.DropAddressModel.Pincode; // + " " + this.DropAddressModel.Country;
			manualLAdd = manualLAdd
				.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
				.replace(/\s/g, "")
				.trim()
				.toLowerCase();
			if (manualSAdd != stri1 && manualLAdd != stri1) {
				if (this.DropDetailAddress.streetnumber.toString().trim() != this.DropAddressModel.DeliveryStreetNumber.toString().trim() || this.DropAddressModel.DeliveryStreetNumber == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Dropoff address street number is invalid.");
					this.bkDis = false;
					return;
				}
				if (this.DropDetailAddress.streetname.toString().trim().toLowerCase() != this.DropAddressModel.DeliveryStreetName.toString().trim().toLowerCase() || this.DropAddressModel.DeliveryStreetName == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Dropoff address street name is invalid.");
					this.bkDis = false;
					return;
				}
				if (this.DropDetailAddress.city.toString().trim().toLowerCase() != this.DropAddressModel.City.toString().trim().toLowerCase() || this.DropAddressModel.City == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Dropoff address suburb is invalid.");
					this.bkDis = false;
					return;
				}
				if (this.DropDetailAddress.state.toString().trim().toLowerCase() != this.DropAddressModel.State.toString().trim().toLowerCase() || this.DropAddressModel.State == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Dropoff address state is invalid.");
					this.bkDis = false;
					return;
				}
				if (this.DropDetailAddress.zip_code.toString().trim().toLowerCase() != this.DropAddressModel.Pincode.toString().trim().toLowerCase() || this.DropAddressModel.Pincode == "") {
					this.setBkdrpCls();
					this.apiServices.showSnack("Dropoff address postcode is invalid.");
					this.bkDis = false;
					return;
				}
			} else {
				await this.getLatLngAddress(this.deliveryBookModel.DropoffAddress, 2, false);
			}
		}
		this.deliveryBookModel.PickupContactName = data.PickupContactName;
		this.deliveryBookModel.ExternalDeliveryId = this.bnData.Dbook.ExternalDeliveryId;
		this.deliveryBookModel.DeliveryPartnerId = this.selectedDeliveryPartnerId;
		this.deliveryBookModel.PickupContactMobile = data.PickupContactMobile;
		if (this.selectedDeliveryPartnerId == 1) {
			this.deliveryBookModel.PickupInstructions = data.PickupInstructions;
		} else {
			this.deliveryBookModel.PickupInstructions = data.PickupInstructions == null || data.PickupInstructions == "" ? "" : "Order No : " + this.bnData.Dbook.ExternalDeliveryId + " " + String.fromCharCode(13, 10) + "Name : " + data.DropoffFirstName + " " + data.DropoffLastName + String.fromCharCode(13, 10) + data.PickupInstructions;
		}
		this.CusomerDetail.first_name = data.DropoffFirstName;
		this.CusomerDetail.last_name = data.DropoffLastName;
		this.CusomerDetail.email = data.DropoffEmail;
		this.CusomerDetail.phone_number = data.DropoffContactMobile;
		this.deliveryBookModel.DropoffInstructions = data.DropOffInstructions;
		this.deliveryBookModel.DropoffNotification = false;
		this.deliveryBookModel.ContainsAlcohol = data.ContainsAlcohol == true ? true : false;
		this.deliveryBookModel.Customer = this.CusomerDetail;
		console.log("after setting   ", this.deliveryBookModel);
		this.deliveryBookModel.IsContactLess = this.checkContactless;
		this.deliveryBookModel.SherpaDeliveryoption = sherpadeliveryoptionId;
		if (this.selectedDeliveryPartnerId == 1) {
			this.deliveryBookModel.DeliveryPartnerName = "Uber Direct";

			this.deliveryBookModel.Fee = this.bnData.Dbook.Fee;
		} else if (this.selectedDeliveryPartnerId == 2) {
			this.deliveryBookModel.DeliveryPartnerName = "Doordash";
		} else if (this.selectedDeliveryPartnerId == 3) {
			this.deliveryBookModel.DeliveryPartnerName = "Sherpa";
		}

		this.deliveryBookModel.DropoffEta = this.uberdirectdropoffeta;
		this.deliveryBookModel.DoordashDropoffEta = this.doordashdropoffeta;

		if (this.IsDD || this.IsUber || this.IsSherpa) {
			if (this.selectedDeliveryPartnerId == 1) {
				this.url = "UberDirect/bookUDDelivery";
			} else if (this.selectedDeliveryPartnerId == 2) {
				this.url = "DoorDash/bookDDDelivery";
			} else if (this.selectedDeliveryPartnerId == 3) {
				this.url = "Sherpa/bookSDDelivery";
			} else {
				this.apiServices.showSnack("Please select delivery partner");
				return;
			}
		} else {
			this.url = "DoorDash/bookDDDelivery";
		}

		this.bkDis = true;
		this.addBkdrpcls();
		//Post Call for Respsective Delivery Partner
		this.apiServices.Post(this.deliveryBookModel, this.url).subscribe(
			(res: any) => {
				if ((res.ErroMessage == null || res.ErroMessage == "") && res.DeliveryBookingId > 0) {
					this.dialogRef.close(res);
					this.setBkdrpCls();
					if (this.selectedDeliveryPartnerId == 1) {
						this.udresp(res);
					} else {
						this.dddelveryresp(res);
					}
				} else {
					this.bkDis = false;
					this.setBkdrpCls();
					// if (this.deliveryBookModel.ChangeDetDropoffAddress || this.deliveryBookModel.ChangeDetPickupAddress) {
					//   if (res.Fee > 0) {
					//     this.alertDialog(res, stat);
					//   }
					//   else {
					//     this.bnData.Dbook.DropoffEta = this.uberdirectdropoffeta != null ? this.datePipe.transform(new Date(this.uberdirectdropoffeta), 'hh.mm a - d MMMM y', this.bnData.Dbook.DeliveryBookingId == 0 ? 'UTC' : '') : this.uberdirectdropoffeta;
					//     this.bnData.Dbook.DoordashDropoffEta = this.doordashdropoffeta != null ? this.datePipe.transform(new Date(this.doordashdropoffeta), 'hh.mm a - d MMMM y', this.bnData.Dbook.DeliveryBookingId == 0 ? 'UTC' : '') : this.doordashdropoffeta;
					//     this.apiServices.showSnack(res.ErroMessage);
					//   }
					// }
					// else {
					this.bnData.Dbook.DropoffEta = this.uberdirectdropoffeta != null ? this.datePipe.transform(new Date(this.uberdirectdropoffeta), "hh.mm a - d MMMM y", this.bnData.Dbook.DeliveryBookingId == 0 ? "UTC" : "") : this.uberdirectdropoffeta;
					this.bnData.Dbook.DoordashDropoffEta = this.doordashdropoffeta != null ? this.datePipe.transform(new Date(this.doordashdropoffeta), "hh.mm a - d MMMM y", this.bnData.Dbook.DeliveryBookingId == 0 ? "UTC" : "") : this.doordashdropoffeta;
					this.deliveryBookModel.QuoteId = res.QuoteId;
					this.apiServices.showSnack(res.ErroMessage);
					// }
				}
			},
			(error) => {
				this.bkDis = false;
				this.setBkdrpCls();
				if (this.selectedDeliveryPartnerId != 1 && stat == "Awaiting Booking Details") {
					this.apiServices.showSnack("Delivery update failed.");
				} else {
					this.apiServices.showSnack("Delivery booking failed.");
				}
			}
		);
	}

	alertDialog(data, stat) {
		var that = this;
		this.dialog
			.open(AlertDialogComponent, {
				disableClose: true,
				data: {
					title: "New Quote",
					message: "You have changed your address and new quote fee is " + data.Fee / 100 + ". Do you want to book delivery?",
					btnCancelText: "No",
					btnOkText: "Yes",
				},
				width: "380px",
			})
			.afterClosed()
			.subscribe((val) => {
				if (val == "Show") {
					this.bkDis = true;
					this.addBkdrpcls();
					this.deliveryBookModel.QuoteId = data.QuoteId;
					this.deliveryBookModel.DropoffEta = data.DropoffEta;
					this.deliveryBookModel.Fee = data.Fee;
					this.bnData.Dbook.QuoteId = data.QuoteId;
					this.bnData.Dbook.DropoffEta = data.DropoffEta;
					this.bnData.Dbook.Fee = data.Fee;
					this.deliveryBookModel.ChangeDetDropoffAddress = false;
					this.deliveryBookModel.ChangeDetPickupAddress = false;
					if (data.Fee != 0) {
						this.apiServices.Post(this.deliveryBookModel, this.url).subscribe(
							(res: any) => {
								if ((res.ErroMessage == null || res.ErroMessage == "") && res.DeliveryBookingId > 0) {
									this.dialogRef.close(res);
									this.setBkdrpCls();
									if (this.selectedDeliveryPartnerId == 1) {
										this.udresp(res);
									} else {
										this.dddelveryresp(res);
									}
								} else {
									this.bkDis = false;
									this.setBkdrpCls();
									if (res.ErroMessage != null) {
										this.deliveryBookModel.DropoffEta = res.DropoffEta != null ? this.datePipe.transform(new Date(res.DropoffEta), "hh.mm a - d MMMM y", this.bnData.Dbook.DeliveryBookingId == 0 ? "UTC" : "") : res.DropoffEta;
										this.bnData.Dbook.DropoffEta = res.DropoffEta != null ? this.datePipe.transform(new Date(res.DropoffEta), "hh.mm a - d MMMM y", this.bnData.Dbook.DeliveryBookingId == 0 ? "UTC" : "") : res.DropoffEta;
										this.deliveryBookModel.QuoteId = res.QuoteId;
										this.bnData.Dbook.QuoteId = res.QuoteId;
										this.apiServices.showSnack(res.ErroMessage);
									}
								}
							},
							(error) => {
								this.bkDis = false;
								this.setBkdrpCls();
								if (this.selectedDeliveryPartnerId != 1 && stat == "Awaiting Booking Details") {
									this.apiServices.showSnack("Delivery update failed.");
								} else {
									this.apiServices.showSnack("Delivery booking failed.");
								}
							}
						);
					} else {
						this.bkDis = false;
						this.setBkdrpCls();
						this.apiServices.showSnack(data.ErroMessage);
					}
				} else {
					this.bnData.Dbook.DropoffEta = this.uberdirectdropoffeta != null ? this.datePipe.transform(new Date(this.uberdirectdropoffeta), "hh.mm a - d MMMM y", this.bnData.Dbook.DeliveryBookingId == 0 ? "UTC" : "") : this.uberdirectdropoffeta;
					this.bnData.Dbook.DoordashDropoffEta = this.doordashdropoffeta != null ? this.datePipe.transform(new Date(this.doordashdropoffeta), "hh.mm a - d MMMM y", this.bnData.Dbook.DeliveryBookingId == 0 ? "UTC" : "") : this.doordashdropoffeta;
					this.deliveryBookModel.ChangeDetDropoffAddress = true;
					this.deliveryBookModel.ChangeDetPickupAddress = true;
				}
			});
	}

	dddelveryresp(res: any) {
		if (res.CurrentStatus == "assigned") {
			this.apiServices.showSnack("Delivery is already in assigned status.");
		} else if (res.CurrentStatus == "Awaiting Booking Details" && res.IsCreated == 1) {
			this.apiServices.showSnack("Delivery is already in awaiting booking details status.");
		} else if (res.CurrentStatus == "Awaiting Booking Details") {
			this.apiServices.showSnack("Delivery has been partially booked.");
		} else if (res.CurrentStatus == "scheduled" && res.IsCreated == 1) {
			this.apiServices.showSnack("Delivery is already in scheduled status.");
		} else if (res.CurrentStatus == "picked_up") {
			this.apiServices.showSnack("Delivery is already in picked up status.");
		} else if (res.CurrentStatus == "delivered") {
			this.apiServices.showSnack("Delivery is already in delivered status.");
		} else {
			this.apiServices.showSnack("Delivery booked successfully.");
		}
	}

	udresp(res) {
		if (res.CurrentStatus == "pickup" && res.CourierImminent == 0) {
			this.apiServices.showSnack("Courier is assigned and moving towards the pickup");
		} else if (res.CurrentStatus == "pickup" && res.CourierImminent == 1) {
			this.apiServices.showSnack("Courier is 1 minute away from the pickup");
		} else if (res.CurrentStatus == "pickup_complete") {
			this.apiServices.showSnack("Courier completed the pickup");
		} else if (res.CurrentStatus == "dropoff" && res.CourierImminent == 0) {
			this.apiServices.showSnack("Courier is moving towards the dropoff");
		} else if (res.CurrentStatus == "dropoff" && res.CourierImminent == 1) {
			this.apiServices.showSnack("Courier is 1 minute away from the dropoff");
		} else if (res.CurrentStatus == "delivered") {
			this.apiServices.showSnack("Courier has completed the delivery");
		} else if (res.CurrentStatus == "canceled") {
			this.apiServices.showSnack("Delivery has been canceled");
		} else {
			this.apiServices.showSnack("Delivery booked successfully.");
		}
	}

	onChangeByMob(mobno, n) {
		mobno = this.commonService.validDigRep(mobno);
		if (mobno != null && mobno != "" && mobno != undefined && n == 1) {
			var dt = this.commonService.validAUMobNo(mobno);
			if (mobno.charAt(0) != 0 && mobno.length >= 3) {
				mobno = "0" + mobno;
				this.bookDeliveryForm.controls["PickupContactMobile"].setValue(mobno);
			}
			if ((mobno.charAt(0) != 0 && mobno.length >= 1) || (mobno.charAt(0) != 0 && mobno.length >= 8)) {
				this.mobMask = this.commonService.auX(mobno);
				this.MobLength = 11;
				if (mobno.length != this.MobLength && dt != 2) {
					this.bookDeliveryForm.controls["PickupContactMobile"].setValidators([Validators.minLength(11)]);
					this.bookDeliveryForm.controls["PickupContactMobile"].setErrors({ pattern: true });
				}
			} else if ((mobno.charAt(0) == 0 && mobno.length >= 2) || (mobno.charAt(0) == 0 && mobno.length >= 9)) {
				this.mobMask = this.commonService.auX(mobno);
				this.MobLength = 12;
				if (mobno.length != this.MobLength && dt != 2) {
					this.bookDeliveryForm.controls["PickupContactMobile"].setValidators([Validators.minLength(11)]);
					this.bookDeliveryForm.controls["PickupContactMobile"].setErrors({ pattern: true });
				}
			}
		} else if (mobno != null && mobno != "" && mobno != undefined && n == 2) {
			var dt = this.commonService.validAUMobNo(mobno);
			if (mobno.charAt(0) != 0 && mobno.length >= 3) {
				mobno = "0" + mobno;
				this.bookDeliveryForm.controls["DropoffContactMobile"].setValue(mobno);
			}
			if ((mobno.charAt(0) != 0 && mobno.length >= 1) || (mobno.charAt(0) != 0 && mobno.length >= 8)) {
				this.mobMask1 = this.commonService.auX(mobno);
				this.MobLength1 = 11;
				if (mobno.length != this.MobLength1 && dt != 2) {
					this.bookDeliveryForm.controls["DropoffContactMobile"].setValidators([Validators.minLength(11)]);
					this.bookDeliveryForm.controls["DropoffContactMobile"].setErrors({ pattern: true });
				}
			} else if ((mobno.charAt(0) == 0 && mobno.length >= 2) || (mobno.charAt(0) == 0 && mobno.length >= 9)) {
				this.mobMask1 = this.commonService.auX(mobno);
				this.MobLength1 = 12;
				if (mobno.length != this.MobLength1 && dt != 2) {
					this.bookDeliveryForm.controls["DropoffContactMobile"].setValidators([Validators.minLength(11)]);
					this.bookDeliveryForm.controls["DropoffContactMobile"].setErrors({ pattern: true });
				}
			}
		} else if (mobno == "" && n == 1) {
			this.bookDeliveryForm.controls["PickupContactMobile"].setErrors({ required: true });
		} else if (mobno == "" && n == 2) {
			this.bookDeliveryForm.controls["DropoffContactMobile"].setErrors({ required: true });
		}
	}

	cancelDelivery(id) {
		//var id = "488ebe3b-866f-413f-b9ae-52fabd569c2d"
		var d = {
			data: "Do you want to cancel this delivery ?",
		};
		this.dialog
			.open(DeletePopupComponent, {
				disableClose: true,
				data: d,
				width: "auto",
				maxWidth: "445px",
				minWidth: "375px",
				height: "200px",
			})
			.afterClosed()
			.subscribe((val) => {
				if (val == "Show") {
					this.commonService.visibility = "shown";
					this.commonService.backDrpCls();
					if (this.selectedDeliveryPartnerId == 1) {
						this.url = "UberDirect/";
					} else if (this.selectedDeliveryPartnerId == 3) {
						this.url = "Sherpa/";
					} else {
						this.url = "DoorDash/";
					}
					this.apiServices.GetById(this.url + "cancelDelivery?deliveryId=" + id).subscribe(
						(res: any) => {
							if ((res.ErroMessage == null || res.ErroMessage == "") && res.BookingStatus == "cancelled") {
								res.CurrentStatus = "Book Delivery";
								res.BookingReference = "";
								this.dialogRef.close(res);
								this.commonService.backaddCls();
								this.commonService.visibility = "hidden";
								this.commonService.ddpage = false;
								this.apiServices.showSnack("Delivery cancelled successfully.");
							} else {
								this.commonService.backaddCls();
								this.commonService.visibility = "hidden";
								if (res.ErroMessage != null) {
									this.apiServices.showSnack(res.ErroMessage);
									console.log("Error", res.ErroMessage);
								}
							}
						},
						(error) => {
							this.commonService.backaddCls();
							this.commonService.visibility = "hidden";
						}
					);
				} else {
				}
			});
	}
}
