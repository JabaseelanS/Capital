import { Directive, ElementRef, HostListener, Injectable, ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment.prod';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { GlobalConstant } from '../pages/globals/globalvariables';
import { ApiServices } from './api.services';
import { MatDialog } from '@angular/material';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class CommonServices {
    reportlist: any = [
        { id: 1, reportname: "Order" },
        { id: 2, reportname: "Script" },
        { id: 3, reportname: "Customer" },
        { id: 4, reportname: "Pharmacies" }
    ];
    helpwiseSettingsScript: any;
    helpwiseScript: any;
    ddpage: boolean = false;
    imgRotateIndex = 0;
    loginExpired: boolean = false;
    expiryIntrval: any;
    orderExpireId: any;
    printdata: any
    isPage: number;
    isImgLoaded = false;
    PrescTabLength: number;
    // printy = 465
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,8}$";
    visibility: string = 'hidden';
    IsDownload: boolean = false;
    public AU4 = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/,];
    public AU3 = [/[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/,];
    public tempMask = [/[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
    public tempMask1 = [/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,];
    orderStatusList = [{ id: 1, value: 'Awaiting review' }, { id: 2, value: 'Ready for fulfilment' }, { id: 4, value: 'Ready for dispatch' }, { id: 5, value: 'Order Completed' }, { id: 6, value: 'Order confirmed' }, { id: 10, value: 'Out for delivery' },
    { id: 8, value: 'Order cancelled' }, { id: 9, value: 'Order refunded' }];
    MarketPlace = [{ id: 1, text: "Uber Eats" }, { id: 2, text: "Doordash" }, { id: 3, text: "Toll" }, { id: 4, text: "Sherpa" }, { id: 5, text: "Zoom2U" },];
    orderStatusListAdmin = [{ id: 1, value: 'Awaiting review' }, { id: 2, value: 'Ready for fulfilment' }, { id: 4, value: 'Ready for dispatch' }, { id: 6, value: 'Order confirmed' }, { id: 10, value: 'Out for delivery' },
    { id: 9, value: 'Order refunded' }];

    NotificationText = "";
    currentMessage = new BehaviorSubject(null);
    firebaseToken = new BehaviorSubject(null);
    cancelStatusList = [{ id: 1, UserName: "Item out of stock" }, { id: 2, UserName: "Item is S8 medication" }, { id: 6, UserName: "Invalid Prescription" }, { id: 3, UserName: "Order not paid within 12 hours" }, { id: 4, UserName: "Customer unresponsive" }, { id: 5, UserName: "Other (please provide detail)" }];
    appcancelStatusList = [{ id: 1, text: "Provided incorrect address or item details", IsSelect: false }, { id: 2, text: "Medication price too high", IsSelect: false }, { id: 3, text: "Pharmacy processing time too long", IsSelect: false },
    { id: 4, text: "Couldn't be home to receive delivery", IsSelect: false }, { id: 5, text: "Other (please provide detail)", IsSelect: false }];
    IsOrderdata = false;
    PrescriptionTabData: any = {
        orderDtlList: [],
        orderModel: [],
        orderDtlModel: [],
        customerModel: [],
        pharmacyModel: []
    };
    isValid = false;
    apiInviteCount = 0;
    private InviteCount = new Subject<number>();
    constructor(private router: Router, private dialog: MatDialog, private apiServices: ApiServices, private angularFireMessaging: AngularFireMessaging, private angularFireAuth: AngularFireAuth, public datePipe: DatePipe, private imageCompress: NgxImageCompressService,
        public titleCasePipe: TitleCasePipe) {
        // console.log(this.printdata);

        this.angularFireMessaging.messaging.subscribe(
            (_messaging: any) => {
                _messaging._next = (payload: any) => {
                    // this.notifier.notify('success', "Order created successfully for" + payload);
                    console.log(payload);
                }
            }
        )
    }

    // AU04 / AU4 / AU0X / AUX  Mask
    auX(mob) {
        if (mob.charAt(0) == '4') {
            return this.AU3;
        }
        else if (mob.charAt(0) == '0' && mob.charAt(1) == '4') {
            return this.AU4;
        }
        else if (mob != '' || mob != null || mob != undefined) {
            return mob != "" && mob.charAt(0) != '0' ? this.tempMask : this.tempMask1;
        }
    }

    // AU Mask Length
    auML(mob) {
        return mob == "" || mob.charAt(0) == '0' ? 12 : 11;
    }

    public downloadFile(data) {
        // const downloadedFile = new Blob([data], { type: data.type });
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        a.download = data.FileName;
        a.href = data.B64string; // URL.createObjectURL(downloadedFile);
        // a.target = '_blank';
        a.click();
        document.body.removeChild(a);
    }

    triggerLogout(tkn) {
        var count = 0;
        const helper = new JwtHelperService();
        const timeout = helper.getTokenExpirationDate(tkn).valueOf();
        this.expiryIntrval = setInterval(() => {
            var curDate = Date.now();
            if (curDate >= timeout) {
                clearInterval(this.expiryIntrval);
                this.router.navigate(['/auth/login']);
                this.visibility = "hidden";
                this.loginExpired = true;
                this.customError(1);
                // console.log('Im logged out');
            } else {
                // console.log('Logout Counting', count++);
            }
        }, 1000);
    }

    PrintPrescV2(row, h) {
        if (h != null) {
            var arr = []
            var k: any;
            var kt = row.IsUploadType == 9 ? row.Base64 : "../../../../../../assets/packapillassets/" + h.PharmacyId + "/" + row.PrescriptionFilename + ".png";
            this.imageCompress.compressFile(kt, 50, 50).then(
                result => {
                    k = result;
                    h.Base64Path = k;
                    arr.push(h);
                    console.log(arr);
                    this.printdata = arr;
                    this.visibility = "hidden";
                }).catch(err => {
                    this.visibility = "hidden";
                    console.log('1', err);
                });
        } else {
            console.log("error");
            this.visibility = "hidden";
        }
    }

    convertNum(num) {
        if (num == null || num == undefined) {
            return '';
        }
        num = num.toString();
        var regex: RegExp = new RegExp(/(\d{2})(\d{4})(\d*)/);
        if (num.charAt(0) != 0) {
            num = "0" + num;
        }
        if (num.charAt(0) == '0' && num.charAt(1) == '4') {
            regex = (/(\d{4})(\d{3})(\d*)/);
        }
        else if (num.charAt(0) == '4') {
            regex = (/(\d{3})(\d{3})(\d*)/);
        }
        else if (num.charAt(0) == '0') {
            regex = (/(\d{2})(\d{4})(\d*)/);
        }
        else if (num.charAt(0) != '0') {
            regex = (/(\d{1})(\d{4})(\d*)/);
        }
        const match = num.match(regex);
        if (match) {
            return `${match[1]} ${match[2]} ${match[3]}`;
        }
        return num;
    }

    checkMaskNum(num) {
        if (num == null || num == undefined) {
            return '';
        }
        num = num.toString();
        var regex: RegExp = new RegExp(/(\d{2})(\d{4})(\d*)/);
        if (num.charAt(0) == '0' && num.charAt(1) == '4') {
            regex = (/(\d{4})(\d{3})(\d*)/);
        }
        else if (num.charAt(0) == '4') {
            regex = (/(\d{3})(\d{3})(\d*)/);
        }
        else if (num.charAt(0) == '0') {
            regex = (/(\d{2})(\d{4})(\d*)/);
        }
        else if (num.charAt(0) != '0') {
            regex = (/(\d{1})(\d{4})(\d*)/);
        }
        const match = num.match(regex);
        if (match) {
            return `${match[1]} ${match[2]} ${match[3]}`;
        }
        return num;
    }

    //Door Dash Status
    getStat(stat) {
        if (stat == "picked_up" || stat == "Picked_up") {
            return "Picked Up";
        }
        else {
            return this.titleCasePipe.transform(stat);
        }
    }

    customError(val) {
        if (this.loginExpired) {
            this.apiServices.showSnack(GlobalConstant.sessionExpired);
            this.dialog.closeAll();
            localStorage.clear();
            clearInterval(this.expiryIntrval);
        }
        else if (val == 1) {
            this.apiServices.showSnack(GlobalConstant.fetch);
        }
        else if (val == 2) {
            this.apiServices.showSnack(GlobalConstant.savefailed);
        }
        else if (val == 3) {
            this.apiServices.showSnack(GlobalConstant.refundfailed);
        }
        else if (val == 4) {
            this.apiServices.showSnack(GlobalConstant.transferfailed);
        }
        else if (val == 5) {
            this.apiServices.showSnack(GlobalConstant.delete);
        }
        else if (val == 6) {
            this.apiServices.showSnack(GlobalConstant.medUpdate);
        }
        else if (val == 7) {
            this.apiServices.showSnack(GlobalConstant.medDelete);
        }
        else if (val == 8) {
            this.apiServices.showSnack(GlobalConstant.expFailed);
        }
        else if (val == 9) {
            this.apiServices.showSnack(GlobalConstant.downFailed);
        }
        else if (val == 10) {
            this.apiServices.showSnack(GlobalConstant.savefail);
        }
        else {
            this.apiServices.showSnack(GlobalConstant.fetch);
        }
    }

    sendMessage(message: number) {
        this.InviteCount.next(message);
    }

    getMessage(): Observable<any> {
        return this.InviteCount.asObservable();
    }

    setAutoFillOff(event: any) {
        if (event) {
            event.target.attributes['autocomplete'].value = 'chrome-off';
        }
    }

    faxNoValid(mob) {
        var aufrmt = "^0[2378][0-9]{8}";
        if (mob == null || mob == "" || mob == undefined) {
            return 1;
        }
        if (mob.length == 9 && mob.charAt(0) != 0) {
            mob = "0" + mob;
        }
        if (mob.match(aufrmt)) {
            return 2;
        }
        else {
            return 3;
        }
    }

    validAUMobNo(mob) {
        // var aufrmt = "^04[0-9]{8}";
        var aufrmt = "^0[23478][0-9]{8}";
        if (mob == null || mob == "" || mob == undefined) {
            return 1;
        }
        if (mob.length == 9 && mob.charAt(0) != 0) {
            mob = "0" + mob;
        }
        if (mob.match(aufrmt)) {
            return 2;
        }
        else {
            return 3;
        }
    }

    validByMobileNo(mob) {
        var aufrmt = "^04[0-9]{8}";
        if (mob == null || mob == "" || mob == undefined) {
            return 1;
        }
        if (mob.length == 9 && mob.charAt(0) != 0) {
            mob = "0" + mob;
        }
        if (mob.match(aufrmt)) {
            return 2;
        }
        else {
            return 3;
        }
    }

    validByEmail(email) {
        email = email.replace(/^\s+|\s+$/gm, '');
        var mailformat = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (email == undefined || email == "" || email == null) {
            return 1;
        }
        if (email.match(mailformat)) {
            let domain = email.split('@')[1];
            let domaincount = domain.split(".").length - 1;
            if (domaincount < 3) {
                return 2;
            } else {
                return 3;
            }
        } else {
            return 3;
        }
    }

    validByEmailNo(email) {
        email = email.replace(/^\s+|\s+$/gm, '');
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    repeatValidation(data: any, flag) {
        if (data.TotalRepeats != undefined && data.TotalRepeats != null && data.TotalRepeats != "") {
            data.TotalRepeats = parseInt(data.TotalRepeats || 0);
        }
        if (flag == 1) {
            if (data.TotalRepeats == undefined || data.TotalRepeats == null || data.TotalRepeats == "") {
                data.RemainingRepeats = ""; data.DaysRemaining = ""; data.TotalRepeats = "";
                return 0;
            }
            if (data.TotalRepeats <= 0 || data.TotalRepeats.toString().length > 2) {
                data.TotalRepeats = "";
                return 0;
            }
            if (data.RemainingRepeats != undefined && data.RemainingRepeats != null && data.RemainingRepeats != "" && data.RemainingRepeats > data.TotalRepeats) {
                data.RemainingRepeats = ""; data.DaysRemaining = ""; data.TotalRepeats = "";
                return 0;
            }
        } else if (flag == 3) {
            if (data.DaysRemaining != undefined && data.DaysRemaining != null && data.DaysRemaining != "") {
                data.DaysRemaining = parseInt(data.DaysRemaining || 0);
            }
            if (data.DaysRemaining <= 0 || data.DaysRemaining.toString().length > 3) {
                data.DaysRemaining = "";
                return 0;
            }
            if (data.TotalRepeats == undefined || data.TotalRepeats == null || data.TotalRepeats == "" || data.RemainingRepeats == undefined || data.RemainingRepeats == null || data.RemainingRepeats == "") {
                data.DaysRemaining = "";
                return 1;
            }
        } else {
            if (data.TotalRepeats == undefined || data.TotalRepeats == null || data.TotalRepeats == "") {
                data.RemainingRepeats = ""; data.DaysRemaining = "";
                return 2;
            }

            if (data.RemainingRepeats == undefined || data.RemainingRepeats == null || data.RemainingRepeats == "") {
                data.RemainingRepeats = ""; //data.DaysRemaining = "";
            }

            if (data.RemainingRepeats != undefined && data.RemainingRepeats != null && data.RemainingRepeats != "") {
                var filter = this.repeatValidationBY(parseInt(data.TotalRepeats), parseInt(data.RemainingRepeats || 0));
                if (filter == 1) {
                    data.RemainingRepeats = "";
                    return 3;
                } else if (filter == 2) {
                    data.RemainingRepeats = "";
                    return;
                }
            }
        }
    }

    repeatValidationBY(total, remaining) {
        if (remaining.toString().length > 2) {
            return 2;
        }
        if (remaining <= 0) {
            return 2;
        }
        if (remaining > total) {
            return 1;
        }
        return 3;
    }

    backDrpCls() {
        var clsstr = document.getElementsByClassName("cdk-overlay-container")[0].children[0].className;
        document.getElementsByClassName("cdk-overlay-container")[0].children[0].className = clsstr.replace(/cdk-overlay-dark-backdrop/g, "cdk-overlay-backdrop");
        document.getElementsByClassName("cdk-overlay-container")[0].setAttribute('style', 'opacity:0;');
    }

    backaddCls() {
        var clsstr = document.getElementsByClassName("cdk-overlay-container")[0].children[0].className;
        document.getElementsByClassName("cdk-overlay-container")[0].children[0].className = clsstr.replace(/cdk-overlay-backdrop |cdk-overlay-dark-backdrop |cdk-overlay-backdrop-showing | .*]/g, " cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing");
        document.getElementsByClassName("cdk-overlay-container")[0].setAttribute('style', 'opacity:1;');
        // console.log(clsstr);
    }

    backSetCls(f) {
        if (f) {
            this.backDrpCls();
            var clstrin = document.getElementsByClassName('cdk-overlay-pane kt-mat-dialog-container__wrapper')[0].className;
            document.getElementsByClassName('cdk-overlay-pane kt-mat-dialog-container__wrapper')[0].className = clstrin.replace(/cdk-overlay-pane kt-mat-dialog-container__wrapper/g, "cdk-overlay-pane kt-mat-dialog-container__wrapper d-nonmat");
        } else {
            document.getElementsByClassName("cdk-overlay-container")[0].setAttribute('style', 'opacity:1;');
            var clsstr1 = document.getElementsByClassName("cdk-overlay-container")[0].children[0].className;
            document.getElementsByClassName("cdk-overlay-container")[0].children[0].className = clsstr1.replace(/cdk-overlay-backdrop cdk-overlay-backdrop-showing/g, "cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing");
            var clstrin2 = document.getElementsByClassName('cdk-overlay-pane kt-mat-dialog-container__wrapper')[0].className;
            document.getElementsByClassName('cdk-overlay-pane kt-mat-dialog-container__wrapper')[0].className = clstrin2.replace(/cdk-overlay-pane kt-mat-dialog-container__wrapper d-nonmat/g, "cdk-overlay-pane kt-mat-dialog-container__wrapper");
        }
    }

    onImageLoad(index) {
        // this.loading = false;
        // console.log(document.getElementById('loadSImg ' + index));
        if (document.getElementById('loadSImg ' + index)) {
            var ldimg = document.getElementById('loadSImg ' + index).className;
            document.getElementById('loadSImg ' + index).className = ldimg.replace(/dis-blk/g, 'dis-non');
            // console.log("After loadimg ", document.getElementById('loadSImg ' + index).className);

            var srimg = document.getElementById('srcSImg ' + index).className;
            document.getElementById('srcSImg ' + index).className = srimg.replace(/dis-non /g, 'dis-blk ');
            // console.log("After srcImg ", document.getElementById('srcSImg ' + index).className);
            this.isImgLoaded = true;
        }
    }

    checkCreateRow(results) {
        if (results != null && results != undefined) {
            results.forEach(element => {
                element.rowCreate = false;
            });
        }
    }

    checkValidation(ordermodel: any, prescriptionDetailsDataSource: any, statusId) {
        var rowCreate = ordermodel.rowCreate;
        let isValid = true;
        if (statusId != 6) {
            return true;
        } else if (ordermodel.rowCreate || (ordermodel.orderDetails != null && ordermodel.orderDetails.length > 0)) {
            var list = [];
            if (ordermodel.rowCreate) {
                list = prescriptionDetailsDataSource.rowsSubject.value;
                if (prescriptionDetailsDataSource.rowsSubject.value.length <= 0) { return false; }
            } else {
                list = ordermodel.orderDetails;
            }
            list.forEach(element => {
                if (ordermodel.rowCreate) { element = element.currentData; }
                element.Price = element.Price != null && element.Price != "" && element.Price != undefined ? parseFloat(element.Price || 0) : "";
                element.Quantity = parseFloat(element.Quantity || 0);
                if (element.IsStock == undefined || element.IsStock == null || !element.IsStock) {
                    if (element.MedicineName == null || element.MedicineName == undefined || element.MedicineName.trim() === '' || element.Price == null || element.Price == undefined || element.Price === '') {
                        isValid = false;
                    }
                    // if ((element.IsUploadType != null && element.IsUploadType != 5) && (element.OrderScriptId == null || element.OrderScriptId == undefined || element.OrderScriptId == '')) {
                    //     isValid = false;
                    // }
                    if (element.Quantity == null || element.Quantity == undefined || element.Quantity == '' || element.Quantity <= 0) {
                        isValid = false;
                    }
                    if (element.FamilyId == null || element.FamilyId == undefined || element.FamilyId == '' && element.FamilyId != 0) {
                        isValid = false;
                    }
                    if (element.Repeats != null && element.Repeats != undefined && element.Repeats == 1) {
                        if (element.TotalRepeats == null || element.TotalRepeats == undefined || element.TotalRepeats === '' || element.RemainingRepeats == null || element.RemainingRepeats === undefined
                            || element.RemainingRepeats == "" || element.DaysRemaining == null || element.DaysRemaining == undefined || element.DaysRemaining == '') {
                            isValid = false;
                        }
                    }
                }
            });
            return isValid;
        } else {
            return false;
        }
    }

    errorProfileImage(e) {
        e.target.src = '/assets/logo/Pharmacy-icon.svg';
    }

    checkMedicineValidate(list) {
        let isValid = true;
        list.forEach(element => {
            // element.Price = parseFloat(element.Price || 0);
            let p = +element.Price;
            element.Price = element.Price != null && element.Price != "" && element.Price != undefined ? p.toFixed(2) : "";
            if (element.MedicineName == null || element.MedicineName == undefined || element.MedicineName.trim() === '' || element.Price == null || element.Price == undefined || element.Price === '') {
                isValid = false;
            }
            if ((element.Quantity == null || element.Quantity == undefined || element.Quantity == '' || element.Quantity <= 0)) {
                isValid = false;
            }
            // if (element.OrderScriptId == null || element.OrderScriptId == undefined || element.OrderScriptId.trim() === '') {
            //     isValid = false;
            // }
            // if ((element.IsUploadType != null && element.IsUploadType != 5) && (element.OrderScriptId == null || element.OrderScriptId == undefined || element.OrderScriptId == '')) {
            //     isValid = false;
            // }
            // if ((element.IsUploadType != null && (element.IsUploadType == 12 || element.IsUploadType == 13)) && (element.OrderScriptId == null || element.OrderScriptId == undefined || element.OrderScriptId == '')) {
            //     isValid = true;
            // }
            if (element.FamilyId == null || element.FamilyId == undefined || element.FamilyId == '' && element.FamilyId != 0) {
                isValid = false;
            }
            if (element.Repeats != null && element.Repeats != undefined && element.Repeats == 1) {
                if (element.TotalRepeats == null || element.TotalRepeats == undefined || element.TotalRepeats === '' || element.RemainingRepeats == null || element.RemainingRepeats === undefined
                    || element.RemainingRepeats == "" || element.DaysRemaining == null || element.DaysRemaining == undefined || element.DaysRemaining == '') {
                    isValid = false;
                }
            } else {
                element.DaysRemaining = element.DaysRemaining || 0; element.RemainingRepeats = element.RemainingRepeats || 0; element.TotalRepeats = element.TotalRepeats || 0;
            }
            if (element.OriginalPrice == "" || element.OriginalPrice == undefined || element.OriginalPrice == null) {
                element.OriginalPrice = 0;
            }
            element.TotalDays = 0;
            element.IsUploadType = element.IsMedicineStatus == 1 ? 5 : 5;
        });
        return { isValid, list };
    }

    preSelectDropDown(row, rowdetails) {
        if (row.rowsSubject.value.length <= 1 && rowdetails.length <= 1) {
            row.rowsSubject.value[0].currentData.FamilyId = rowdetails[0].FamilyId;
        }
    }

    removeSpaces(val) {
        return val.trim();
    }

    validateNumberBy(evt: any) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 49 || charCode > 57))
            return false;
        return true;
    }

    validateNumber(evt: any) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    validateOnlyNumber(evt: any) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        var enteredVal = evt.target.value;
        var isVal = false;
        if (enteredVal !== '') {
            isVal = /\./.test(enteredVal);
        }
        if (isVal == false) {
            if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
        } else {
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
        }
    }

    validateDigit(evt: any) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        var enteredVal = evt.target.value;
        var isVal = false;
        if (enteredVal !== '') {
            isVal = /\./.test(enteredVal);
        }
        if (isVal == true) {
            let str = enteredVal.substring(0, enteredVal.indexOf('.'));
            if (str.length > 5) {
                return false;
            }
        } else if (charCode != 46 && isVal == false && enteredVal.length > 4) {
            return false;
        }
        // string.substring(0, string.indexOf(character));
        if (isVal == false) {
            if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
        } else {
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
        }
    }

    setEmpty(val) {
        if (val.Repeats == 2) {
            val.TotalDays = '';
            val.RemainingRepeats = '';
            val.TotalRepeats = '';
            val.DaysRemaining = '';
            val.RepeatInterval = '';
        }
        else {
            return;
        }
    }

    setAge(now: Date, selDate: Date) {
        let age = 0;
        let nowM = now.getMonth() + 1;
        let selM = selDate.getMonth() + 1;
        let nowD = now.getDate();
        let selD = selDate.getDate();
        let nowY = now.getFullYear();
        let selY = selDate.getFullYear();
        if (nowM == selM) {
            if (selD > nowD) {
                age = nowY - selY;
                age = age - 1;
            } else {
                age = nowY - selY;
            }
        } else if (selM > nowM) {
            age = nowY - selY;
            age = age - 1;
        } else {
            age = nowY - selY;
        }
        return age;
    }

    setValidDate(dateString: string): any {
        if (dateString != undefined && dateString != null && dateString != "") {
            let cDate = new Date();
            let cDateString = this.datePipe.transform(cDate, 'yyyy');
            let yearString = cDateString[0] + cDateString[1];
            let dateStringNew = dateString[0] + dateString[1] + '/02/' + yearString + dateString[3] + dateString[4];
            let fulDate = new Date(dateStringNew);
            return fulDate;
        }
        return "";
    }

    isNotValidExp(MedicareValidTo: any) {
        MedicareValidTo = MedicareValidTo.replace(/_/g, '');
        let date = new Date();
        let cYear = date.getFullYear().toString();
        let cMonth = date.getMonth() + 1;
        let enteredMon = MedicareValidTo[0] + MedicareValidTo[1];
        if (enteredMon == '00') {
            return true;
        }
        let enteredYea = (MedicareValidTo[3] == undefined ? "" : MedicareValidTo[3]) + (MedicareValidTo[4] == undefined ? "" : MedicareValidTo[4]); // + MedicareValidTo[5] + MedicareValidTo[6];
        cYear = cYear[2] + cYear[3];
        if (enteredMon > 12) {
            return true;
        }

        if (enteredYea.length < 2) {
            return true;
        }

        if (enteredYea < cYear) {
            return true;
        }

        if (enteredYea > cYear) {
            return false;
        }

        if (enteredYea == cYear) {
            if (enteredMon >= cMonth) {
                return false;
            }
            return true;
        }
        if (MedicareValidTo == '') {
            return 2;
        }

        return true;
    }

    isNotValidDob(Dob: string) {
        // debugger
        // const controls = Dob;
        let dob = Dob;
        let d = this.changeFormate(Dob);
        dob = dob.replace('_', '');
        if (dob.length == 10) {
            if (d != 'no valid') {
                var fromdate = this.datePipe.transform(d, 'dd MMM, y');
            } else {
                return true;
            }
            var now = new Date();
            var selDate = new Date(fromdate)
            var age = now.getFullYear() - selDate.getFullYear();
            if (age >= 0) {
                return false;
            } else {
                return true;
            }
        } else if (dob.length == 0) {
            return 2;
        }
        else {
            return true;
        }
    }

    changeFormate(value: string): any { // change date format dd/mm/yyyy to mm/dd/yyyy
        var dateString = value; // Oct 23

        var dateParts = dateString.split("/");
        if (+dateParts[2] < 1753) {
            return 'no valid'
        }
        if (dateParts[0] == '00' || dateParts[1] == '00') {
            return 'no valid'
        }
        if (dateParts[1] == '02') {
            if (dateParts[0] == '30' || dateParts[0] == '31') {
                return 'no valid'
            }
        } if (+dateParts[1] > 12) {
            return 'no valid'
        } if (this.checkDateNotValid(dateParts)) {
            return 'no valid'
        }
        // month is 0-based, that's why we need dataParts[1] - 1
        var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        return dateObject;
    }

    checkDateNotValid(dateParts) {
        if (dateParts[1] === '01' || dateParts[1] === '03' || dateParts[1] === '05' || dateParts[1] === '07' || dateParts[1] === '08' || dateParts[1] === '10' || dateParts[1] === '12') {
            if (+dateParts[0] > 31) {
                return true;
            }
        } else if (+dateParts[0] > 30) {
            return true;
        }
        return false;
    }

    getOrderStatus(data, orderStatusList) {
        var filter = orderStatusList.filter(function (a) { return a.id == data.IsOrderStatus });
        if (filter.length > 0) {
            if (data.IsOrderStatus == 4 && data.DeliverBy == 2) {
                return "Ready for pickup";
            }
            // if (data.DeliverBy == 1 && data.IsOrderStatus == 13 && data.IsUploadType == 1 && data.IsOrderStatus == filter[0].id) {
            //     return "Courier returning prescription";
            // }
            return filter[0].value;
        }
    }

    getDeliveryType(id): any {
        if (id === 2) {
            return 'Pickup';
        }
        else if (id === 3) {
            return 'Next business day delivery'
        }
        return 'Delivery';
    }

    getPayment(data): any {
        if (data) {
            return 'Paid';
        }
        return 'UnPaid';
    }

    selectMedicineBy(flag, val, list, medicineList, orderModel, userdetails) {
        list.currentData.IsMedicineStatus = 2; list.currentData.PriceVersion = 0;
        list.currentData.Price = ''; list.currentData.OriginalPrice = '';
        var filter = medicineList.filter(function (row) { return row.MedicineName == val });
        if (filter.length > 0) {
            list.currentData.IsMedicineStatus = 1;
            // if ((userdetails.RoleId != 2 && userdetails.RoleId != 3) || (orderModel.IsUploadType != 13 && orderModel.IsUploadType != 12)) {
            //     list.currentData.Price = filter[0].GeneralPrice;
            //     list.currentData.OriginalPrice = filter[0].GeneralPrice;
            // }
            list.currentData.Price = (filter[0].GeneralPrice != null && filter[0].GeneralPrice != "") || filter[0].GeneralPrice == 0 ? filter[0].GeneralPrice.toFixed(2) : "";
            list.currentData.OriginalPrice = (filter[0].GeneralPrice != null && filter[0].GeneralPrice != "") || filter[0].GeneralPrice == 0 ? filter[0].GeneralPrice.toFixed(2) : "";;
            list.currentData.OrderScriptId = filter[0].BarCode;
            list.currentData.Barcode = filter[0].BarCode;
            list.currentData.PriceVersion = filter[0].Version;
            list.currentData.DrugScheduleB = filter[0].DrugScheduleB;
        }
    }

    getOrderStatusByBtn1(data) {
        if (data.IsOrderStatus == 1) {
            return "Confirm Order";
        }
        else if (data.IsOrderStatus == 2) {
            return "Fullfil Order";
        }
        else if (data.IsOrderStatus == 4) {
            if (data.DeliverBy == 2) { return "Complete Order"; }
            return "Dispatch Order";
        }
    }

    getOrderStatusByBtn(data) {
        if (data.IsOrderStatus == 1) {
            return "Confirm Order";
        }
        else if (data.IsOrderStatus == 2) {
            if (data.DeliverBy == 1 || data.DeliverBy == 3) {
                return "Request Delivery";
            } else {
                return "Ready for Pickup"
            }
        }
        else if (data.IsOrderStatus == 4) {
            if (data.DeliverBy == 2) { return "Complete Order"; }
            return "Awaiting Courier";
        } else if (data.IsOrderStatus == 6) {
            return "Order confirmed";
        } else if (data.IsOrderStatus == 11) {
            // if (data.DeliverBy == 2) { return "Complete Order"; }
            return "Courier Arrived";
        } else if (data.IsOrderStatus == 10) {
            // if (data.DeliverBy == 2) { return "Complete Order"; }
            return "Out for Delivery";
        } else if (data.IsOrderStatus == 12) {
            // if (data.DeliverBy == 2) { return "Complete Order"; }
            return "Order Returned";
        } else if (data.IsOrderStatus == 13) {
            // if (data.DeliverBy == 2) { return "Complete Order"; }
            return "Order Complete";
        }
        else if (data.IsOrderStatus == 16) {
            if (data.DeliverBy == 2) { return "Complete Order"; }
        }
    }

    filterOrderBy(row, familyList, flag) {
        if (familyList != null) {
            var filter = familyList.filter(function (val) { return val.FamilyId == row.FamilyId });
            if (filter.length > 0) {
                var data = filter[0];
                if (flag == 1) {
                    return data.MedicareNo;
                } else if (flag == 2) {
                    return data.Name;
                } else {
                    return data.ConcessionNo;
                }

            }
        }
    }

    getEntitlementType(id, EntitlementTypes): any {
        let _list = EntitlementTypes.filter(a => a.id === id);
        if (_list.length !== 0) {
            return _list[0].value;
        }
        return '';
    }

    validDigRep(med) {
        return med.replace(/ |_|-/g, '');
    }

    preciseRound(num, dec) {
        if ((typeof num !== 'number') || (typeof dec !== 'number'))
            return num;

        var num_sign = num >= 0 ? 1 : -1;
        var fixedTotal = (Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec);
        return fixedTotal;
    }

    copyInputMessage(val) {
        if (val != null && val != "" && val != null) {
            // if (val.indexOf('/scripts/') != -1 || val.indexOf('/Scripts/') != -1 || val.indexOf('/SCRIPTS/') != -1) {
            //     var text = val.split("/scripts/");
            //     if (text.length > 0) {
            //         val = text[1];
            //     }
            // }
            const selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = val;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
        }
    }

    sendWebPush(model) {
        return {
            notification: {
                title: 'Hola Health',
                icon: 'https://www.holameds.com/wp-content/uploads/2020/03/favion.png',
                body: "", //'Order ' + '#' + model.OrderNo + ' is Cancelled.',
                data: {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1,
                    "url": this.getUrl(model.PharmacyId)
                },
                actions: [{
                    "action": "Open",
                    "title": "Hola Health"
                }]
            }
        };
    }

    getUrl(PharmacyId): string {
        let endUrl = 'prescription-orders';
        if (PharmacyId == 10002) {
            endUrl = 'test-orders';
        }
        if (environment.apiEndpoint === 'http://aapi.hlhlth.app/api') {
            return environment.portalURL1 + '' + endUrl;
        } else {
            return environment.portalURL1 + '' + endUrl;
        }
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
        return "";
    }

    getUnit(place) {
        const COMPONENT_TEMPLATE1 = { subpremise: 'long_name' },
            city1 = this.getAddrComponent(place, COMPONENT_TEMPLATE1);
        return city1;
    }

    getStreetNumber(place) {
        const COMPONENT_TEMPLATE = { street_number: 'long_name' },
            city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
        return city;
    }

    getStreetName(place) {
        const COMPONENT_TEMPLATE = { route: 'long_name' },
            city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
        return city;
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

    getStreetshortName(place) {
        const COMPONENT_TEMPLATE = { route: 'short_name' },
            city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
        return city;
    }

    getStatesList() {
        return [
            {
                "name": "New South Wales",
                "code": "NSW",
                "id": 1
            },
            {
                "name": "Victoria",
                "code": "VIC",
                "id": 2
            },
            {
                "name": "Queensland",
                "code": "QLD",
                "id": 3
            },
            {
                "name": "Tasmania",
                "code": "TAS",
                "id": 4
            },
            {
                "name": "South Australia",
                "code": "SA",
                "id": 5
            },
            {
                "name": "Western Australia",
                "code": "WA",
                "id": 6
            },
            {
                "name": "Northern Territory",
                "code": "NT",
                "id": 7
            },
            {
                "name": "Australian Capital Territory",
                "code": "ACT",
                "id": 8
            }
        ]
    }

    helpWiseByChat() {
        var userdetails = JSON.parse(localStorage.getItem('userdetails'))
        if (userdetails != null && userdetails.RoleId == 3) {

            var existingHelpwiseScript = document.getElementById('helpwisescript');
            if (existingHelpwiseScript) {
                existingHelpwiseScript.parentNode.removeChild(existingHelpwiseScript);
            }

            var existingHelpwiseSettingsScript = document.getElementById('helpwise');
            if (existingHelpwiseSettingsScript) {
                existingHelpwiseSettingsScript.parentNode.removeChild(existingHelpwiseSettingsScript);
            }
            var head = document.getElementsByTagName('head')[0];
            this.helpwiseSettingsScript = document.createElement('script');
            this.helpwiseSettingsScript.id = "helpwise";
            this.helpwiseSettingsScript.text = `
            helpwiseSettings = {
                widget_id: '657431d3491aa',
                align: 'right',
                user_id: '${userdetails.UserId}',
                firstname: '${userdetails.FirstName}',
                lastname: '${userdetails.LastName}',
                email: '${userdetails.UserEmail}',
            };
        `;
            head.appendChild(this.helpwiseSettingsScript);
            this.helpwiseScript = document.createElement('script');
            this.helpwiseScript.id = "helpwisescript";
            this.helpwiseScript.src = "https://cdn.helpwise.io/assets/js/livechat.js?v=" + new Date().getTime();
            head.appendChild(this.helpwiseScript);
        }
    }

    helpWiseByClass(displayValue) {
        var styleElement = document.createElement('style');
        styleElement.textContent = `.helpwise_chat_widget_launcher .hw-widgetLauncherContainer.right { display: ${displayValue}; }`;
        document.head.appendChild(styleElement);
    }

    getCountryList() {
        return [{
            "name": "Australia",
            "code": "AUS",
            "id": 1
        }]
    }

    getDaysByDay(day) {
        switch (day) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
            default:
                break;
        }
    }

    async requestPermission() {
        await this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                console.log('111111', token);
                this.firebaseToken.next(token);
            },
            (err) => {
                console.error('Unable to get permission to notify.', err);
            }
        );
    }
    async receiveMessage() {
        await this.angularFireMessaging.messages.subscribe(
            (payload) => {
                debugger
                // console.log("new message received. ", payload);
                // this.currentMessage.next(payload);
            },
            (err) => {
                debugger
                console.error('Unable to get permission to notify.', err);
            })
    }

    SignIn(email: string, password: string) {
        this.angularFireAuth
            .auth
            .signInWithEmailAndPassword(email, password)
            .then(res => {
                console.log('Successfully signed in!');
            })
            .catch(err => {
                console.log('Something is wrong:', err.message);
            });
    }

    // getPrintdata() {
    //     console.log(this.printdata);

    //     return this.printdata
    // }

    AmexCardnumber(inputtxt) {
        var cardno = /^3[47]/;
        return cardno.test(inputtxt);
    }

    VisaCardnumber(inputtxt) {
        var cardno = /^4/;
        return cardno.test(inputtxt);
    }

    MasterCardnumber(inputtxt) {
        var cardno = /^5[1-5]/;
        return cardno.test(inputtxt);
    }

    DiscoverCardnumber(inputtxt) {
        var cardno = /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/;
        return cardno.test(inputtxt);
    }

    DinerClubCardnumber(inputtxt) {
        var cardno = /^30[0-5]/;
        return cardno.test(inputtxt);
    }

    DinerInterClubCardnumber(inputtxt) {
        var cardno = /^36/;
        return cardno.test(inputtxt);
    }

    JCBCardnumber(inputtxt) {
        var cardno = /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/;
        return cardno.test(inputtxt);
    }


}


//////////////////////////////////////////////// Allow Number only //////////////////////////////////
@Directive({
    selector: '[myNumberOnly]'
})
export class NumberOnlyDirective {
    // Allow decimal numbers. The \. is only allowed once to occur
    public regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    public specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

    constructor(public el: ElementRef) {
    }

    @HostListener('input', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        const initalValue = this.el.nativeElement.value;
        this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
        if (initalValue !== this.el.nativeElement.value) {
            event.stopPropagation();
        }
    }
}

@NgModule({
    imports: [],
    declarations: [NumberOnlyDirective],
    exports: [NumberOnlyDirective],
    providers: [],
})
export class commonNumberOnlyModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: commonNumberOnlyModule,
            providers: []
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: commonNumberOnlyModule
        };
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////// End
