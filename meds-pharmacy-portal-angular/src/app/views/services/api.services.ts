import { Injectable, Output, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter } from 'events';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StateDb } from '../../core/_base/layout/server/fake-api/fake-db/state';
import { LoaderService } from './loader.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ApiServices {
  orderDetail: any;
  orderStatus = [{ id: 1, value: 'Awaiting review' }, { id: 2, value: 'Ready for fulfilment' }, { id: 3, value: 'Packing order' }, { id: 4, value: 'Ready to dispatch' }, { id: 5, value: 'Order Completed' }, { id: 6, value: 'Order confirmed' },
  { id: 7, value: 'Send order to admin' }, { id: 8, value: 'Order cancelled' }, { id: 9, value: 'Order refunded' }];

  totalLength = 0;
  dataSource: MatTableDataSource<any> | null;
  dataSourcePh: MatTableDataSource<any> | null;
  public progress: number;
  public message: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() public onUploadFinished = new EventEmitter();
  // token: any;
  // username: any;
  jsonParseReviver: (this: any, key: string, value: any) => any;
  products: any;
  discount: any;
  categories: any[];
  activeMaterials: any[];
  pharmacies: any[];
  pharmacyGrp: any[];
  customers: any[];
  orders: any[];
  dataSourceOrder: MatTableDataSource<any>;
  ordershistory: any;
  dataSourceOrderHistory: MatTableDataSource<unknown>;
  citydata: any;
  // statedata: any;
  sub_categories: any[];
  stateData: any;
  countryData: any;
  excel: any[];
  data2: any;
  custIdByGobal = 0;
  phIdByGobal = 0;
  OTCImagePath = 'https://passets.hola.health/';
  // InviteCount: BehaviorSubject<any> = new BehaviorSubject<any>({ invitecount: 0 });
  constructor(public http: HttpClient, public snackbar: MatSnackBar, public router: Router, private spinner: NgxSpinnerService, private loaderService: LoaderService,) {
  }

  versionAlert(userid, username) {
    if (confirm("Updated version available. Are you want to reload the page?")) {
      var model = {
        UserId: userid,
        UserName: username
      }
      this.Post(model, "").subscribe(
        response => {

        },
        (error: any) => {

        });
    } else {

    }
  }

  changeFormate(value: string): any { // change date format dd/mm/yyyy to mm/dd/yyyy
    var dateString = value; // Oct 23
    var dateParts = dateString.split("/");
    var year = new Date().getFullYear(); var date = new Date().getDate(); var month = new Date().getMonth() + 1;
    if (parseInt(dateParts[2]) == year) {
      if (parseInt(dateParts[1]) >= month) {
        if (parseInt(dateParts[1]) > month) { return 'no valid'; }
        if (parseInt(dateParts[0]) > date) { return 'no valid'; }
      }
    }
    if (dateParts[0] == '00' || dateParts[1] == '00' || dateParts[1] > '12' || dateParts[0] > '31') {
      return 'no valid';
    }

    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0] + 1);
    return dateObject;
  }

  async GetProduct() {
    // this.spinner.show();
    this.loaderService.display(true);
    await this.http.get<any[]>('Product').toPromise().then(res => {
      this.products = res;
    }, error => {
      // this.spinner.hide();
      this.loaderService.display(false);
    });
    await this.http.get<any[]>('SubCategory').toPromise().then(res => {
      this.sub_categories = res;
      for (let i = 0; i < this.products.length; i++) {
        if (this.sub_categories) {
          this.getSubCategory(this.products[i]);
        }
      }
    });
    await this.http.get<any[]>('ActiveMaterial').toPromise().then(res => {
      this.activeMaterials = res;
      for (let i = 0; i < this.products.length; i++) {
        if (this.activeMaterials) {
          this.getActiveMaterial(this.products[i]);
        }
      }
    }
    );
    this.dataSource = new MatTableDataSource(this.products);
    // this.spinner.hide()
    this.loaderService.display(false);
  }
  public getStatus(id) {
    var filter = this.orderStatus.filter(function (val) { return val.id == id });
    if (filter.length > 0) {
      return filter[0].value;
    }
    return '';
    //   if (id != this.orderStatus.) {

    // }
  }

  public pushNotifyPost(data, url, secretkey) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': secretkey
      })
    };
    return this.http.post<any>(url, data, httpOptions);
  }

  public pushNotifyPost1(data, url, secretkey) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': secretkey
      })
    };
    return this.http.post<any>(url, data, httpOptions);
  }

  async GetOrderHistory() {
    // this.spinner.show();
    this.loaderService.display(true);
    await this.http.get<any[]>('Order/OrderHistory').toPromise().then(res => {
      this.ordershistory = res;
    }, error => {
      // this.spinner.hide();
      this.loaderService.display(false);
    });
    await this.http.get<any[]>('Pharmacy').toPromise().then(res => {
      this.pharmacies = res;
      for (let i = 0; i < this.ordershistory.length; i++) {
        if (this.pharmacies) {
          this.addPharmacyName(this.ordershistory[i]);
        }
      }
    });
    this.dataSourceOrderHistory = new MatTableDataSource(this.ordershistory);
    // this.spinner.hide()
    this.loaderService.display(false);
  }
  addPharmacyName(data: any) {
    var list = this.pharmacies.filter(a => a.PharmacyId === data.PharmacyId);
    if (list.length > 0) {
      data.PharmacyName = list[0].PharmacyName;
    }
    return '';
  }

  public download(fileUrl: string) {
    return this.http.get(fileUrl, {
      reportProgress: true,
      responseType: 'blob',
    });
  }


  async GetOrders() {
    // this.spinner.show();
    this.loaderService.display(true);
    await this.http.get<any[]>('Order').toPromise().then(res => {
      this.orders = res;
    }, error => {
      // this.spinner.hide();
      this.loaderService.display(false);

    });
    await this.http.get<any[]>('Customer').toPromise().then(res => {
      this.customers = res;
      for (let i = 0; i < this.orders.length; i++) {
        if (this.customers) {
          this.addCustomer(this.orders[i]);
        }
      }
    });
    await this.http.get<any[]>('Product').toPromise().then(res => {
      this.products = res;
      for (let i = 0; i < this.orders.length; i++) {
        if (this.products) {
          this.addProductName(this.orders[i]);
        }
      }
    });
    this.dataSourceOrder = new MatTableDataSource(this.orders);
    // this.spinner.hide()
    this.loaderService.display(false);
  }
  addProductName(data: any) {
    var list = this.products.filter(a => a.ProductId === data.ProductId);
    if (list.length > 0) {
      data.ProductName = list[0].ProductName;
    }
    return '';
  }
  addCustomer(data: any) {
    var list = this.customers.filter(a => a.CustomerId === data.OrderById);
    if (list.length > 0) {
      data.OrderByName = list[0].CustomerFullname;
    }
    return '';
  }
  async GetPharmacy() {
    // this.spinner.show();
    this.loaderService.display(true);
    await this.http.get<any[]>('Pharmacy').toPromise().then(res => {
      this.pharmacies = res;
    }, error => {
      // this.spinner.hide();
      this.loaderService.display(false);
    });

    await this.http.get<any[]>('PharmacyGroups').toPromise().then(res => {
      this.pharmacyGrp = res;
      for (let i = 0; i < this.pharmacies.length; i++) {
        if (this.pharmacyGrp) {
          this.addPharmacyGrp(this.pharmacies[i]);
        }
      }
    });
    this.dataSourcePh = new MatTableDataSource(this.pharmacies);
    // this.spinner.hide()
    this.loaderService.display(false);
  }

  // async GetExcelInfo() {
  //   this.spinner.show()
  //   await this.http.get<any[]>('ExcelInfo').toPromise().then(res => {
  //     this.excel = res;
  //   }, error => {
  //     this.spinner.hide();
  //   });
  // }


  addPharmacyGrp(data: any) {
    var list = this.pharmacyGrp.filter(model => model.PharmacyGrpId === data.PharmacyGrpId);
    if (list.length > 0) {
      data.PharmacyGrpName = list[0].PharmacyGrpName;
    }
    return '';
  }
  // addStateList(data: any) {
  //   var list = this.statedata.filter(model => model.StateId === data(StateDb.state.id));
  //   if (list.length > 0) {
  //     data.name = list[0].name;
  //   }
  //   return '';
  // }

  getActiveMaterial(data: any) {
    var list = this.activeMaterials.filter(model => model.ActiveMaterialId === data.ActiveMaterialId);
    if (list.length > 0) {
      data.ActiveMaterialName = list[0].ActiveMaterialName;
    }
    return '';
  }

  getDiscount(data: any) {
    var list = this.discount.filter(model => model.DiscountId === data.DiscountId);
    if (list.length > 0) {
      data.DiscountCouponCode = list[0].DiscountCouponCode;
    }
    return '';
  }

  getSubCategory(data) {
    var list = this.sub_categories.filter(model => model.SubcategoryId === data.SubcategoryId);
    if (list.length > 0) {
      data.SubcategoryName = list[0].SubcategoryName;
    }
    return '';
  }

  getCategory(data) {
    var list = this.categories.filter(model => model.CategoryId === data.CategoryId);
    if (list.length > 0) {
      data.CategoryName = list[0].CategoryName;
    }
    return '';
  }

  public Post(data, url) {
    return this.http.post<any>(url, data);
  }

  public PostFile(data, url) {
    return this.http.post<any>(url, data, { reportProgress: true, responseType: 'json' });
  }

  async GetListCustomer(url) {
    await this.http.get<any[]>(url).toPromise().then(res => {
      this.dataSource = new MatTableDataSource(res);
    });
  }

  async GetListPharmacy(url) {
    await this.http.get<any[]>(url).toPromise().then(res => {
      this.dataSource = new MatTableDataSource(res);
    });
  }
  public GetList(url) {
    return this.http.get<any[]>(url);
  }
  public GetById(url) {
    return this.http.get<any>(url);
  }

  public Put(data, url) {
    return this.http.put<any>(url, data);
  }

  public Delete(url) {
    return this.http.delete<any>(url);
  }

  public BulkDelete(url, data) {
    return this.http.put<any>(url, data);
  }
  public Get(url) {
    return this.http.get<any[]>(url);
  }
  public logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  async FindByCountryId() {
    await this.http.get('country/').toPromise().then((res: any) => {
      this.countryData = res;
    });

  }

  async FindByStateId() {
    return this.http.get('state/').toPromise().then((res: any) => {
      this.stateData = res;
    });
  }

  showSnack(msg): void {
    this.snackbar.open(msg, 'Close', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['success']
    });
  }

  showSnackBy(msg, css): void {
    this.snackbar.open(msg, 'Close', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [css]
    });
  }

}
