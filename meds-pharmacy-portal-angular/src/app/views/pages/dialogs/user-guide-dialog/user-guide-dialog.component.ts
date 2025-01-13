import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CommonServices } from '../../../../views/services/common';
import { ApiServices } from '../../../../views/services/api.services';
import { UserGuide } from './userguide';
@Component({
  selector: 'pp-user-guide-dialog',
  templateUrl: './user-guide-dialog.component.html',
  styleUrls: ['./user-guide-dialog.component.scss']
})
export class UserGuideDialogComponent implements OnInit {
  userForm: FormGroup;
  url = 'UserGuide/';
  Base64: any;
  fileArray: File[] = [];
  usersguide: any;
  edited = true;
  userdetails: any;
  formdata = new FormData();
  constructor(
    public dialogRef: MatDialogRef<UserGuideDialogComponent>,
    public _formBuilder: FormBuilder,
    public commonServices: CommonServices,
    public apiServices: ApiServices,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {
  }

  ngOnInit() {
    this.userdetails = JSON.parse(localStorage.getItem("userdetails"));
    this.usersguide = new UserGuide(this.modalData.data);
    this.formCreation()

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  formCreation() {
    this.userForm = this._formBuilder.group({
      UserGuideId: new FormControl(this.usersguide.UserGuideId),
      UserGuide: new FormControl(this.usersguide.UserGuide),
      ProcessingPrescriptionOrders: new FormControl(this.usersguide.ProcessingPrescriptionOrders),
      ProcessingOtcOrders: new FormControl(this.usersguide.ProcessingOtcOrders),
      CarerMode: new FormControl(this.usersguide.CarerMode),
      Base64UserGuide: new FormControl(this.usersguide.Base64UserGuide),
      Base64ProcessingPrescriptionOrders: new FormControl(this.usersguide.Base64ProcessingPrescriptionOrders),
      Base64CarerMode: new FormControl(this.usersguide.Base64CarerMode),
      Base64ProcessingOtcOrders: new FormControl(this.usersguide.Base64ProcessingOtcOrders)
    });
  }

  loadFile(fileLoader, flag) {
    var that = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0]; var reader: any = new FileReader();
      if (flag == 1) {
        that.userForm.controls['UserGuide'].setValue(file.name);
        that.userForm.controls['Base64UserGuide'].setValue(fileLoader.files);
      }
      else if (flag == 2) {
        that.userForm.controls['Base64ProcessingPrescriptionOrders'].setValue(fileLoader.files);
        that.userForm.controls['ProcessingPrescriptionOrders'].setValue(file.name);
      }
      else if (flag == 3) {
        that.userForm.controls['Base64ProcessingOtcOrders'].setValue(fileLoader.files);
        that.userForm.controls['ProcessingOtcOrders'].setValue(file.name);
      }
      else {
        that.userForm.controls['Base64CarerMode'].setValue(fileLoader.files);
        that.userForm.controls['CarerMode'].setValue(file.name);
      }

      if (file) {
        reader.readAsDataURL(file);
        var regex = new RegExp("(.*?)\.(pdf|mp4)$");
        if (!(regex.test(file.name.toLowerCase()))) {
          this.value = "";
          if (flag == 1) {
            that.userForm.controls['UserGuide'].setValue('');
            that.userForm.controls['Base64UserGuide'].setValue('');
          }
          else if (flag == 2) {
            that.userForm.controls['ProcessingPrescriptionOrders'].setValue('');
            that.userForm.controls['Base64ProcessingPrescriptionOrders'].setValue('');
          }
          else if (flag == 3) {
            that.userForm.controls['ProcessingOtcOrders'].setValue('');
            that.userForm.controls['Base64ProcessingOtcOrders'].setValue('');
          }
          else if (flag == 4) {
            that.userForm.controls['CarerMode'].setValue('');
            that.userForm.controls['Base64CarerMode'].setValue('');
          }
          that.apiServices.showSnack('Sorry, Invalid file format.');
        }
      }
    }
  }

  submit() {
    const formData = new FormData(); var data = this.userForm.controls;
    if (data['UserGuide'].value == null || data['UserGuide'].value == "") {
      this.apiServices.showSnack("Please upload user guide");
      return;
    }
    if (data['ProcessingPrescriptionOrders'].value == null || data['ProcessingPrescriptionOrders'].value == "") {
      this.apiServices.showSnack("Please upload processing prescription orders");
      return;
    }
    if (data['ProcessingOtcOrders'].value == null || data['ProcessingOtcOrders'].value == "") {
      this.apiServices.showSnack("Please upload processing OTC orders");
      return;
    }
    if (data['CarerMode'].value == null || data['CarerMode'].value == "") {
      this.apiServices.showSnack("Please upload carer mode");
      return;
    }
    if (data['UserGuide'].value != null && data['UserGuide'].value != "" && data['Base64UserGuide'].value.length > 0) {
      formData.append('file1', data['Base64UserGuide'].value[0], "UserGuide");
    }

    if (data['ProcessingPrescriptionOrders'].value != null && data['ProcessingPrescriptionOrders'].value != "" && data['Base64ProcessingPrescriptionOrders'].value.length > 0) {
      formData.append('file1', data['Base64ProcessingPrescriptionOrders'].value[0], "ProcessingPrescriptionOrders");
    }

    if (data['ProcessingOtcOrders'].value != null && data['ProcessingOtcOrders'].value != "" && data['Base64ProcessingOtcOrders'].value.length > 0) {
      formData.append('file1', data['Base64ProcessingOtcOrders'].value[0], "ProcessingOtcOrders");
    }

    if (data['CarerMode'].value != null && data['CarerMode'].value != "" && data['Base64CarerMode'].value.length > 0) {
      formData.append('file1', data['Base64CarerMode'].value[0], "CarerMode");
    }

    this.commonServices.visibility = "shown"; this.edited = false; this.commonServices.backDrpCls();
    this.apiServices.PostFile(formData, this.url + "Post?id=" + data['UserGuideId'].value).subscribe(
      res => {
        this.commonServices.backSetCls(false); this.commonServices.visibility = "hidden"; this.dialogRef.close(res.value);
      },
      (error: any) => {
        this.commonServices.visibility = "hidden"; this.dialogRef.close(null);
      });

  }
}