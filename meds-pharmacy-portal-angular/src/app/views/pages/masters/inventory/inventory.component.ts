import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { InventoryModel } from '../../modals/inventory.model';
import * as XLSX from 'xlsx';
import { animation } from '../../../../directives/transition.directive';
import { ApiServices } from '../../../services/api.services';
import { CommonServices } from '../../../services/common';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { GlobalConstant } from '../../globals/globalvariables';
import { InventoryDialogComponent } from '../../dialogs/inventory-dialog/inventory-dialog.component';
import { ExportService } from '../../../common-dialogs/export.service';
import { SubheaderService } from '../../../../core/_base/layout';
import { LoaderService } from '../../../../views/services/loader.service';

@Component({
  selector: 'pp-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  animations: [animation],
  host: { '[@animation]': '' }
})
export class InventoryComponent implements OnInit {

  // Import To Excel
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  // ===================

  url = 'Inventory/';
  displayedColumns: string[] = ['DrugName', 'GeneralPrice', 'ConcessionPrice', 'EntitlementPrice', 'SpecialDispensePrice', 'PreferredGenericUPI', 'Price', 'Quantity', 'actions'];
  totalLength = 0;

  dataSource: MatTableDataSource<any> | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  Spinnermessage = 'fetching data';
  sub_cat_list: any;
  fullData: any;
  tempInventoryList = [];
  phamracyGroupList = [];
  TempfullData: any;
  pharmacyList = [];
  TemppharmacyList = [];
  searchPhamracyData = [];
  searchPhamracyGrpData = [];
  PharmacyGrp = 0;
  PharmacyName = '0';
  constructor(
    private dialog: MatDialog,
    private apiService: ApiServices,
    private commonServices: CommonServices,
    private loaderService: LoaderService,
    // private notificationService: NotificationsComponent,
    private _subheaderService: SubheaderService,
    private spinner: NgxSpinnerService,
    private exportService: ExportService
  ) {
    this.commonServices.visibility = "shown";
  }

  ngOnInit() {
    this._subheaderService.setTitle("Inventory");
    this.getInvetories();
  }

  getInvetories() {
    this.apiService.GetList(this.url + 'GetList').subscribe((res: any) => {
      this.pharmacyList = res.pharmacy_list; this.TemppharmacyList = res.pharmacy_list;
      this.PharmacyGrp = res.pharmacygroup_list.length > 0 ? res.pharmacygroup_list[0].PharmacyGrpId : 0;
      var PharmacyGrp = this.PharmacyGrp; this.tempInventoryList = res.inventorylist;

      var filterPharmacy = this.TemppharmacyList.filter(function (val) { return val.PharmacyGrpId == PharmacyGrp });
      this.pharmacyList = filterPharmacy; this.PharmacyName = '0';
      if (filterPharmacy.length > 0) {
        this.PharmacyName = filterPharmacy[0].PharmacyId;
      }
      this.fullData = res; this.phamracyGroupList = res.pharmacygroup_list;
      this.TempfullData = res;
      this.searchPhamracyData = res.pharmacy_list; this.searchPhamracyGrpData = res.pharmacygroup_list;
      if (this.PharmacyName != null) {
        var pharmacyid = this.PharmacyName;
        var filterList = this.fullData.inventorylist.filter(function (val) { return val.PharmacyId == pharmacyid });
        this.fullData.inventorylist = filterList;
      }
      this.loadDataSource(this.fullData.inventorylist);
      this.commonServices.visibility = "hidden";
    }, err => {
      this.commonServices.customError(1);
      this.commonServices.visibility = "hidden";
    });
    // this.loaderService.display(false);
  }

  loadDataSource(res: any) {
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalLength = res.length;
    // this.spinner.hide();
    console.log(this.dataSource);
  }

  openDialog(modalData): void {
    console.log(modalData);
    console.log(this.fullData);

    this.dialog.open(InventoryDialogComponent, {
      // data: { data: modalData, fullData: this.fullData },
      data: { data: modalData, fullData: this.fullData },

      width: '75%',
      disableClose: true
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadDataSource(res);
      }
      this.commonServices.visibility = "hidden";
    })
  }

  // openDialog(modalData): void {
  //   this.dialog.open(InventoryDialogComponent, {
  //     data: { data: modalData, fullData: this.fullData },
  //     height: '60%',
  //     width: '70%',
  //     disableClose: true
  //   }).afterClosed().subscribe(res => {
  //     if (res) {
  //       this.loadDataSource(res);
  //     }
  //   })
  // }

  searchPharmacyGrpFilter(value, flag) {
    let data = [];
    this.searchPhamracyGrpData.filter(order => {
      if (order.PharmacyGrpName.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        data.push(order);
      }
    });
    this.phamracyGroupList = data;
  }

  fetchByPharmacyGrp(data) {
    var filterPharmacy = this.TemppharmacyList.filter(function (val) { return val.PharmacyGrpId == data.value });
    this.pharmacyList = filterPharmacy;
    if (filterPharmacy.length > 0) {
      this.PharmacyName = filterPharmacy[0].PharmacyId;
      this.fetchByPharmacy(this.PharmacyName);
    }
    else {
      this.pharmacyList = this.TemppharmacyList;
      this.PharmacyName = '0'; this.loadDataSource(this.tempInventoryList);
    }
  }

  fetchByPharmacy(data) {
    var filterPharmacy = [];
    if (data == '0') {
      var id = this.PharmacyGrp; var list = [];
      var filter = this.pharmacyList.filter(function (val) { return val.PharmacyGrpId == id });
      filter.forEach(element => {
        var Pharmacy = this.tempInventoryList.filter(function (val) { return val.PharmacyId == element.PharmacyId });
        if (Pharmacy.length > 0) {
          list = list.concat(Pharmacy);
        }
      });
      filterPharmacy = list;
    } else {
      filterPharmacy = this.tempInventoryList.filter(function (val) { return val.PharmacyId == data });
    }
    this.loadDataSource(filterPharmacy);
  }

  searchPharmacyFilter(value, flag) {
    let data = [];
    this.searchPhamracyData.filter(order => {
      if (order.PharmacyName.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        data.push(order);
      }
    });
    this.pharmacyList = data;
  }

  fetchData(data) {
    // debugger
    //this.selectedStateId = "";
    if (data.value != "All") {
      this.commonServices.visibility = "shown";
      var PHfilter = this.phamracyGroupList.filter(function (val) { return val.PharmacyGrpId == data.value });
      if (PHfilter.length > 0 && PHfilter[0].PharmacyGrpName != null && PHfilter[0].PharmacyGrpName != "") {
        // this.spinner.show();
        this.loaderService.display(true);
        this.apiService.GetList(this.url + 'GetByFilterList?name=' + PHfilter[0].PharmacyGrpName).subscribe((res: any) => {
          this.fullData.inventorylist = res; this.loadDataSource(this.fullData); this.commonServices.visibility = "hidden";
        }, err => {
          // this.spinner.hide();
          this.commonServices.customError(1);
          this.commonServices.visibility = "hidden";
        });
      }
    }

    // var pushList = [];
    // if (data.value != "All") {
    //   var PHfilter = this.TempfullData.pharmacy_list.filter(function (val) { return val.PharmacyGrpid == data.value });
    //   if (PHfilter.length > 0) {
    //     PHfilter.forEach(element => {
    //       var filter = this.TempfullData.inventorylist.filter(function (val) { return val.PharmacyId == element.PharmacyId });
    //       if (filter.length > 0) {
    //         pushList.push(filter[0]);
    //       }
    //     });
    //     this.dataSource = new MatTableDataSource(pushList);
    //   } else {
    //     this.dataSource = new MatTableDataSource(pushList);
    //   }
    // }
    // else {
    //   this.dataSource = new MatTableDataSource(this.TempfullData.inventorylist);
    // }
  }

  deleteInventory(_item: InventoryModel) {
    let isConfirm = confirm('Are you sure to delete this inventory?');
    if (isConfirm) {
      this.Spinnermessage = 'Deleting';
      // this.spinner.show();
      this.loaderService.display(true);
      this.apiService.Delete(this.url + _item.InventoryId).subscribe(res => {
        this.loadDataSource(res);
        // this.notificationService.showNotification(GlobalConstant.deleted, 1);
        // this.spinner.hide();
        this.loaderService.display(false);
      }, error => {
        // this.notificationService.showNotification(error, 2);
        // this.spinner.hide();
        this.commonServices.customError(5);
        this.loaderService.display(false);
      });
    }
  }

  applyFilter(value, flag) {
    if (flag) {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    } else {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
  }

  export() {
    this.exportService.exportExcel(this.dataSource.data, 'inventory');
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.setTable(data);
    };
    reader.readAsBinaryString(target.files[0]);
  }
  setTable(data) {
    const columns = data[0];
    const rows = [];
    let newarray = [];
    let thing;
    for (let i = 1; i < data.length; i++) {
      rows.push(data[i]);
    }

    for (var y = 0; y < rows.length; y++) {
      thing = {};
      for (var i = 0; i < columns.length; i++) {
        thing[columns[i]] = rows[y][i];
      }
      newarray.push(thing)
    }
    this.insertOnTable(newarray);
  }
  insertOnTable(newarray: any[]) {
    this.apiService.Post(newarray, this.url + 'import').subscribe(res => {
      this.fullData = res;
      this.loadDataSource(res);
      // this.notificationService.showNotification('Data Updated In To Table', 1);
    }, err => {
      this.commonServices.customError(2);
      // this.notificationService.showNotification(err, 2);
    });
  }

}
