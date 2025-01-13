import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, PageEvent } from '@angular/material';
import { CommonServices } from '../../../services/common';
import { UserGuideDialogComponent } from '../../dialogs/user-guide-dialog/user-guide-dialog.component';
import { ApiServices } from '../../../../views/services/api.services';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { GlobalConstant } from '../../globals/globalvariables';
import { LoaderService } from '../../../../views/services/loader.service';
import { forEach, indexOf } from 'lodash';

@Component({
  selector: 'pp-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  url = 'userguide/';
  useDefault: boolean;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  userguideassets = [];
  tempuserguideassets = [];
  pageSize = 5;
  lowValue: number = 0;
  highValue: number = 10;
  length: number;
  isToggled = false;
  userdetails: any;
  data: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private commonServices: CommonServices, private loaderService: LoaderService, private apiServices: ApiServices, private layoutUtilsService: LayoutUtilsService,
    private dialog: MatDialog,) { }

  ngOnInit() {

    this.apiServices.Get(this.url).subscribe((res: any) => {
      if (res != null) {
        this.userguideassets = res;
        this.tempuserguideassets = res;
        this.commonServices.visibility = "hidden";

      }
    }, error => {
      this.commonServices.visibility = "hidden";
    });
  }

  AddUserGuide(data) {
    this.commonServices.visibility = "hidden";
    this.dialog.open(UserGuideDialogComponent, {
      data: { data },
      disableClose: true,
      height: 'auto',
      width: '900px',
    }).afterClosed().subscribe((res: any) => {
      if (res != null) {
        this.userguideassets = res; this.tempuserguideassets = res;
        this.commonServices.visibility = "hidden";
      }
      else { this.commonServices.visibility = "hidden"; }
    });
  }

  setPagin(evd) {
    var eve = {
      previousPageIndex: 1,
      pageIndex: 0,
      pageSize: 10,
      length: evd
    }
    this.paginator.firstPage();
    this.getPaginatorData(eve);
  }

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  applyFilter(value) {
    console.log(value);
    this.pageSize = this.tempuserguideassets.length; // 8;
    if (value == undefined || value == null || value == "") {
      var pharmDataSource = this.tempuserguideassets;
      this.userguideassets = pharmDataSource.slice(0, this.pageSize);
      if (pharmDataSource.length > 100) {
        this.pageSizeOptions.push(pharmDataSource.length);
      }
    } else {
      var filter = this.tempuserguideassets.filter(function (val) {
        return (val.UserGuide != null && val.UserGuide.toLowerCase().includes(value.trim().toLowerCase()) != false) || (val.ProcessingPrescriptionOrders != null && val.ProcessingPrescriptionOrders.toLowerCase().includes(value.trim().toLowerCase()) != false)
          || (val.ProcessingOtcOrders != null && val.ProcessingOtcOrders.toLowerCase().includes(value.trim().toLowerCase()) != false) || (val.CarerMode != null && val.CarerMode.toLowerCase().includes(value.trim().toLowerCase()) != false)
      });
      this.userguideassets = filter.slice(0, this.pageSize);
      this.length = filter.length;
      this.setPagin(this.length);
      if (this.length > 100) {
        this.pageSizeOptions.push(filter.length);
      }
    }
  }

  changeStatus(value) {
    const title: string = 'User Guide Status';
    const description: string = 'Are you sure you want to change the status?';
    const waitDesciption: string = 'Status is being changed...';

    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loaderService.display(true); value.Flag = true;
        this.apiServices.Post(value, this.url + 'Delete').subscribe(res => {
          if (res.flag == 3) {
            const title: string = 'User Guide Status';
            const description: string = 'Are you sure you want to change the status?';
            const waitDesciption: string = 'Status is being changed...';
            const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
            dialogRef.afterClosed().subscribe(res => {
              if (res) {
                this.loaderService.display(true); value.Flag = false;
                this.apiServices.Post(value, this.url + 'Delete').subscribe(res => {
                  this.apiServices.showSnack(res.data.ErroMessage); this.userguideassets = res.list; this.setUserGuide();
                });
              }
              else { value.IsActive = !value.IsActive }
            });
          } else { this.apiServices.showSnack(res.data.ErroMessage); this.userguideassets = res.list; this.setUserGuide(); }
        }, error => {
          this.loaderService.display(false);
          this.commonServices.customError(1);
        });
      } else { value.IsActive = !value.IsActive; }
    });
  }

  setUserGuide() {
    var list = this.userguideassets.filter(function (val) { return val.IsActive; });
    if (list.length > 0) {
      localStorage.removeItem("userguide");
      localStorage.setItem('userguide', JSON.stringify(list[0]));
    }
  }
}
