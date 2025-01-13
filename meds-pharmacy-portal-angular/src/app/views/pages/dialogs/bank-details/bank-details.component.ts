import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../../../app/views/services/common';
import { ApiServices } from '../../../../../app/views/services/api.services';
import { GlobalConstant } from '../../globals/globalvariables';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'pp-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  url = 'PharmacyStripe/';
  bsb: number;
  ahn: string = "";
  can: number;
  an: number;
  bankForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<BankDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public bnData: any,
    public apiServices: ApiServices,
    private commonService: CommonServices, public fb: FormBuilder,) {


  }

  ngOnInit() {
    this.formInit();
  }

  closeDialog(): void {
    this.dialogRef.close();
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  addBnkAcc(e) {
    if (this.bankForm.controls['AccountName'].value == null || this.bankForm.controls['AccountName'].value == "" || this.bankForm.controls['AccountName'].value == undefined) {
      this.bankForm.controls['AccountName'].markAsTouched();
      e.preventDefault();
      return;
    }
    if (this.bankForm.controls['TSelect'].value == null || this.bankForm.controls['TSelect'].value == '' || this.bankForm.controls['TSelect'].value == undefined) {
      this.bankForm.controls['TSelect'].markAsTouched();
      return;
    }
    if (this.bankForm.controls['BSB'].value == null || this.bankForm.controls['BSB'].value == undefined) {
      this.bankForm.controls['BSB'].markAsTouched();
      return;
    }


    if (this.bankForm.controls['AccountNumber'].value == null || this.bankForm.controls['AccountNumber'].value == undefined) {
      this.bankForm.controls['AccountNumber'].markAsTouched();
      e.preventDefault();
      return;
    }
    if (this.bankForm.controls['ConfirmNumber'].value == null || this.bankForm.controls['ConfirmNumber'].value == undefined || this.bankForm.controls['ConfirmNumber'].value.length < 5) {
      this.bankForm.controls['ConfirmNumber'].markAsTouched();
      e.preventDefault();
      return;
    }
    if (this.bankForm.controls['AccountNumber'].value.toString().trim().toLowerCase() != this.bankForm.controls['ConfirmNumber'].value.toString().trim().toLowerCase()) {
      this.bankForm.controls['ConfirmNumber'].setErrors({ mustMatch: true }); return;
    }

    var ba = {
      country: 'AU',
      currency: 'aud',
      routing_number: this.bankForm.controls['BSB'].value,
      account_number: this.bankForm.controls['AccountNumber'].value,
      account_holder_name: this.bankForm.controls['AccountName'].value,
      // account_holder_type: 'individual',
      account_holder_type: this.bankForm.controls['TSelect'].value,
    };
    var id = (this.bnData != null || this.bnData != undefined) && (this.bnData.PharmacyId != null || this.bnData.PharmacyId != 0 || this.bnData.PharmacyId != undefined) ? this.bnData.PharmacyId : 0;
    this.commonService.visibility = "shown";
    this.commonService.backDrpCls();
    (<any>window).Stripe.bankAccount.createToken(ba, (status: number, response: any) => {
      console.log('Res ', response, 'status', status);
      if (status == 200 && !response.used) {
        this.apiServices.GetList(this.url + 'AddBankAcc?bankId=' + response.id + '&pharmid=' + id).subscribe((rese: any) => {
          if ((rese.acc != null && rese.acc.external_accounts.data.length == 1 && !rese.flag)) {
            this.dialogRef.close(rese);
            this.commonService.backaddCls();
            this.commonService.visibility = "hidden";
            this.apiServices.showSnack("Bank Details added successfully");
          } else if (rese.flag) {
            this.dialogRef.close();
            this.commonService.backaddCls();
            this.commonService.visibility = "hidden";
            this.apiServices.showSnack("Bank Limit Exceeds");
          }
          else {
            this.commonService.backaddCls();
            this.commonService.visibility = "hidden";
            this.apiServices.showSnack("Unable to add Bank Details");
          }
          this.commonService.visibility = "hidden";
        }, error => {
          this.commonService.backaddCls();
          this.commonService.visibility = "hidden";
          this.commonService.customError(1);
        });
      }
      else if (response.used) {
        this.commonService.backaddCls();
        this.commonService.visibility = "hidden";
        this.apiServices.showSnack("Bank account is already used.");
      } else {
        this.commonService.backaddCls();
        this.commonService.visibility = "hidden";
        this.apiServices.showSnack("Invalid Bank Details");
      }
    }, error => {
      debugger
      this.commonService.backaddCls();
      this.commonService.visibility = "hidden";
      this.commonService.customError(1);
    });
  }

  formInit() {
    this.bankForm = this.fb.group({
      TSelect: new FormControl(),
      BSB: new FormControl(),
      AccountNumber: new FormControl(),
      ConfirmNumber: new FormControl(),
      AccountName: new FormControl()
    },
      {
        validator: this.MustMatch('AccountNumber', 'ConfirmNumber')
      });
  }
  // convenience getter for easy access to form fields
  get f() { return this.bankForm.controls; }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];


      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
        matchingControl.setErrors({ mustMatch: false });
      }

    }
  }

}
