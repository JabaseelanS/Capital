import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../../../app/views/services/common';
import { ApiServices } from '../../../../../app/views/services/api.services';

// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
// import { loadStripe } from '@stripe/stripe-js';

// const Stripe = window['stripe'];

@Component({
    selector: 'pp-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
    errormessage = "Sorry your payment failed. Please check your card details and try again or contact support.";
    isValid = false;
    isloader = true;
    public cardMask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
    len = 16;
    result = "unknown";
    cardDetails = {
        'name': '',
        'number': '',
        'expMonth': 0,
        'expYear': 0,
        'cvc': '',
        'currency': 'aud',
        'amount': 2000
    };
    maxLength = 3;
    public dateMask = [/[0-1]/, /[\d]/, '/', /[2-9]/, /\d/];
    Expiry = '';

    constructor(
        // @Inject(MAT_DIALOG_DATA) public refundDetails: any,
        public dialogRef: MatDialogRef<PaymentDialogComponent>,
        public commonServices: CommonServices,
        private apiService: ApiServices,
        private cdf: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.commonServices.backSetCls(false);
    }

    ngOnInit(): void {
    }

    checkCardValidation(e) {
        if (this.result == "visa") {
            var removespace = e.replace(/\s/g, "");
            var valueWithoutMaskChars = removespace.replace(/\D+/g, '');
            if (valueWithoutMaskChars.length >= this.len) {
                console.log(e);
                this.cardDetails.number = e.substring(0, e.length - 1);
                // this.cardDetails.number = e.slice(0, -1);
                return false;
            }
        }
    }

    checkNameValidation(e) {
        let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
        // Allow Backspace, tab, end, and home keys
        if (specialKeys.indexOf(e.key) !== -1) {
            return;
        }

        const initalValue = e.currentTarget.value;
        e.currentTarget.value = initalValue.replace(/[^A-Za-z ]*/g, '');
        if (initalValue !== e.currentTarget.value) {
            event.stopPropagation();
        }
    }

    getCreditCardType(id, cardNumbersOnly) {
        this.cardMask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
        this.result = "unknown"; this.len = 16; this.maxLength = 3;
        if (this.commonServices.VisaCardnumber(cardNumbersOnly)) {
            this.result = "visa";
        } else if (this.commonServices.MasterCardnumber(cardNumbersOnly)) {
            this.result = "mastercard";
        } else if (this.commonServices.AmexCardnumber(cardNumbersOnly)) {
            // this.validateAMEXspace(id, cardNumbersOnly);
            this.maxLength = 4; this.result = "americanexpress"; this.len = 15;
            this.cardMask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];
        } else if (this.commonServices.DiscoverCardnumber(cardNumbersOnly)) {
            this.result = "discover";
        } else if (this.commonServices.DinerClubCardnumber(cardNumbersOnly)) {
            this.result = "dinerclub"; this.len = 16;
            this.cardMask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
        } else if (this.commonServices.DinerInterClubCardnumber(cardNumbersOnly)) {
            this.result = "dinerclubInter"; this.len = 14;
            this.cardMask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/];
        } else if (this.commonServices.JCBCardnumber(cardNumbersOnly)) {
            this.result = "jcb";
        }
    }

    validateAMEXspace(id, cardNumbersOnly) {
        let newText = cardNumbersOnly.replace(/_+/g, '');
        newText = newText.replace(/ +/g, '');
        if (id.setSelectionRange) {
            if (newText.length != 5 && newText.length != 9 && newText.length != 13) {
                id.focus();
                if (newText.length > 5) { newText.length = newText.length + 1; }
                id.setSelectionRange(newText.length, newText.length);
            }
        }
    }

    payNow() {
        // this.commonServices.visibility = "shown";
        let exp = this.Expiry;
        this.Expiry = this.Expiry.replace(/\//g, '');
        this.Expiry = this.Expiry.replace(/ +/g, '');
        this.cardDetails.expMonth = Number(this.Expiry[0] + this.Expiry[1]);
        this.cardDetails.expYear = Number(this.Expiry[2] + this.Expiry[3]);
        this.cardDetails.number = this.cardDetails.number.replace(/ +/g, '');
        this.Expiry = exp;
        console.log(this.cardDetails);
        var card = {
            number: this.cardDetails.number,
            exp_month: this.cardDetails.expMonth,
            exp_year: this.cardDetails.expYear,
            cvc: this.cardDetails.cvc,
        };
        this.isValid = false; this.errormessage = "";
        if (card.number == '' || card.number == null) {
            this.apiService.showSnack("Please enter card number");
            return;
        }
        let cardval = card.number.replace(/_+/g, '');
        if (cardval.length != this.len) {
            this.apiService.showSnack("Invalid card number");
            return;
        }

        if (this.cardDetails.name.trim() == '') {
            this.apiService.showSnack("Please enter name");
            return;
        }

        if (this.Expiry == '' || this.Expiry == null) {
            this.apiService.showSnack("Please enter expiry");
            return;
        }
        var cardVal = this.Expiry.indexOf('_');
        if (cardVal != -1) {
            this.apiService.showSnack("Invalid expiry");
            return;
        }

        if (card.cvc == '' || card.cvc == null) {
            this.apiService.showSnack("Please enter CVV");
            return;
        }

        if (card.cvc.length != this.maxLength) {
            this.apiService.showSnack("Invalid CVV");
            return;
        }
        this.isValid = true; this.errormessage = "";
        (<any>window).Stripe.card.createToken(card, (status: number, response: any) => {
            console.log(response); this.commonServices.visibility = "hidden";
            if (status == 200) {
                this.dialogRef.close({ flag: true, paymentData: response, cardDetails: this.cardDetails, Expiry: this.Expiry });
            } else {
                setTimeout(() => {
                    var message = 'Sorry your payment failed. Please check your card details and try again or contact support.';
                    if (response.error.code == 'incorrect_number') {
                        message = "Payment failed due to 'Enter valid card number'. Please contact support if you need assistance";
                    }
                    else {
                        message = 'Payment failed due to ' + response.error.message + '. Please contact support if you need assistance';
                    }
                    this.errormessage = message;
                });
            }
        });
    }
    showErr(message: any) {
        this.apiService.showSnack(message);
    }

    setValue() {
        this.isValid = false; this.errormessage = "";
    }

}