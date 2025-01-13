import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SubheaderService } from '../../../../core/_base/layout';
import { ApiServices } from '../../../../views/services/api.services';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PharmacyUserModel } from '../../modals/pharmacy-user.model';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../views/services/loader.service';
import { CommonServices } from '../../../../views/services/common';
import { GlobalConstant } from '../../globals/globalvariables';

@Component({
  selector: 'pp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponentP implements OnInit {
  url = 'PharmacyUser/';
  dataSource: MatTableDataSource<any>;
  logindetails: any;
  userForm: FormGroup;
  userModel: PharmacyUserModel;
  userdetails: any;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _subheaderService: SubheaderService,
    private apiService: ApiServices,
    private notificationService: NotificationsComponent,
    private spinner: NgxSpinnerService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private commonServices: CommonServices,
  ) {
    this.userModel = new PharmacyUserModel();
    // this.logindetails = JSON.parse(localStorage.getItem("logindetails"));
    this.formCreation();
    this.commonServices.visibility = "shown";
  }

  ngOnInit() {
    this._subheaderService.setTitle("User Profile")
    this.loadUserData();

  }

  loadUserData() {
    // this.commonServices.visibility = "shown";
    let logindetails = JSON.parse(localStorage.getItem("logindetails"));
    if (logindetails == null || logindetails == undefined) {

      localStorage.clear(); this.router.navigate(['/auth/login']);
      this.commonServices.visibility = "hidden";
      return;
    }
    this.apiService.GetList(this.url + logindetails.UserEmail).subscribe(res => {
      if (res != null || res != undefined) {
        this.userdetails = res;
        this.userModel = new PharmacyUserModel(res);
        this.formCreation();
        this.cdRef.detectChanges();
        this.commonServices.visibility = "hidden";
      } else {
        localStorage.clear(); this.router.navigate(['/auth/login']);
      }
    }, err => {
      this.commonServices.customError(1);
      this.commonServices.visibility = "hidden";
    });
  }

  formCreation() {
    this.userForm = this._formBuilder.group({
      UserName: new FormControl(this.userModel.UserName),
      UserEmail: new FormControl(this.userModel.UserEmail),
      UserPassword: new FormControl(this.userModel.UserPassword),
      FirstName: new FormControl(this.userModel.FirstName),
      LastName: new FormControl(this.userModel.LastName),
      Address: new FormControl(this.userModel.Address1),
      City: new FormControl(this.userModel.City),
      Country: new FormControl(this.userModel.Address2),
      Pincode: new FormControl(this.userModel.Pincode),
      // AboutMe: new FormControl(this.userModel.City),
    })
  }

}
