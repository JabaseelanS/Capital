import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../../../core/_base/layout';
import { ApiServices } from '../../../../views/services/api.services';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CommonServices } from '../../../../views/services/common';
import { UserGuide } from '../../dialogs/user-guide-dialog/userguide';
@Component({
  selector: 'pp-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  url = 'userguide/';
  logindetails: any;
  userForm: FormGroup;
  usersguide: UserGuide;
  btnval = 0;
  constructor(
    private _formBuilder: FormBuilder,
    private _subheaderService: SubheaderService,
    private apiService: ApiServices,
    private cdRef: ChangeDetectorRef,
    private commonServices: CommonServices,
  ) {
    this.usersguide = new UserGuide();
    this.formCreation();
    this.commonServices.visibility = "shown";
  }

  ngOnInit() {
    this._subheaderService.setTitle("Settings")
    this.loadUserData();

  }

  loadUserData() {
    this.commonServices.visibility = "shown";
    this.apiService.GetList(this.url + "GetByActive").subscribe(res => {
      if (res != null || res != undefined) {
        this.usersguide = new UserGuide(res);
        this.formCreation();
        this.cdRef.detectChanges();
        this.commonServices.visibility = "hidden";
      } else {
        this.btnval = 1;
        this.commonServices.visibility = "hidden";
      }
    }, err => {
      this.commonServices.customError(1);
      this.commonServices.visibility = "hidden";
    });
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

  reset() {
    this.userForm.reset();
    this.usersguide = new UserGuide();
    this.formCreation();
    this.btnval = 1;
    this.cdRef.detectChanges();
  }

  loadFile(fileLoader, flag) {
    var that = this; fileLoader.value = "";
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
        var regex = new RegExp("(.*?)\.(mp4)$");
        if (flag == 1) {
          regex = new RegExp("(.*?)\.(pdf)$");
        }
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
          that.apiService.showSnack('Sorry, Invalid file format.');
        }
      }
    }
    this.userForm.markAsDirty();
  }

  submit() {
    const formData = new FormData(); var data = this.userForm.controls;
    if (data['UserGuide'].value == null || data['UserGuide'].value == "") {
      this.apiService.showSnack("Please upload user guide");
      return;
    }
    if (data['ProcessingPrescriptionOrders'].value == null || data['ProcessingPrescriptionOrders'].value == "") {
      this.apiService.showSnack("Please upload processing prescription orders");
      return;
    }
    if (data['ProcessingOtcOrders'].value == null || data['ProcessingOtcOrders'].value == "") {
      this.apiService.showSnack("Please upload processing OTC orders");
      return;
    }
    if (data['CarerMode'].value == null || data['CarerMode'].value == "") {
      this.apiService.showSnack("Please upload carer mode");
      return;
    }
    if (this.userForm.dirty == false) {
      this.apiService.showSnack("No changes");
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

    this.commonServices.visibility = "shown";
    this.apiService.PostFile(formData, this.url + "UserGuidePost?id=" + data['UserGuideId'].value).subscribe(
      res => {
        if (res.value != null) {
          this.usersguide = new UserGuide(res.value);
          this.formCreation();
          this.cdRef.detectChanges();
          this.btnval = 0;
          this.commonServices.visibility = "hidden";
        }
        this.apiService.showSnack(res.userguide.ErroMessage);
      },
      (error: any) => {
        this.commonServices.visibility = "hidden";
      });

  }
}
