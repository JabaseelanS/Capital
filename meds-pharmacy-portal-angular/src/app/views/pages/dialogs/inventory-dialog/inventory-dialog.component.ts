import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { TableDataSource, ValidatorService } from 'angular4-material-table';

import { InventoryValidatorService } from './inventory-validator';
import { animation } from '../../../../directives/transition.directive';
import { InventoryModel } from '../../modals/inventory.model';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { GlobalConstant } from '../../globals/globalvariables';
import { ApiServices } from '../../../services/api.services';
import { CommonServices } from '../../../services/common';
import { LoaderService } from '../../../../views/services/loader.service';
import { InventoryPharmModel } from '../../modals/inventory-pharm-model';
import { InventoryCls } from './inventory';


@Component({
  selector: 'pp-inventory-dialog',
  providers: [
    { provide: ValidatorService, useClass: InventoryValidatorService }
  ],
  templateUrl: './inventory-dialog.component.html',
  styleUrls: ['./inventory-dialog.component.scss'],
  animations: [animation],
  host: { '[@animation]': '' }
})
export class InventoryDialogComponent implements OnInit {

  url = 'Inventory/Post';
  inventoryForm: FormGroup;
  pharmacyList = [];
  searchPhamracyData = [];
  pharmacy: any;
  // inventory: any;
  loadedData: InventoryCls[];
  inventoryModelData: InventoryModel
  buttonEnabled = false;
  inventoryTypes = [
    {
      InventoryTypeName: 'Carrying Costs',
      InventoryTypeId: 1
    }, {
      InventoryTypeName: 'Shortage Costs',
      InventoryTypeId: 2
    }, {
      InventoryTypeName: 'Replenishment costs',
      InventoryTypeId: 3
    }
  ]
  displayedColumns = ['DrugName', 'BarCode', 'GeneralPrice', 'ConcessionPrice', 'EntitlementPrice', 'SpecialDispensePrice', 'PreferredGenericUPI', 'InventoryTypeId', 'Price', 'Quantity', 'actionsColumn'];

  @Input() inventoryList = [
    // { ProductPicName: '', ProductName: '', ProductDescription: 0, ProductQuantity: '', ProductType: '', ProductDetails: '', ProductBuyprice: 0, ProductSellprice: 0, ActiveMaterialId: '' },
  ];
  @Output() inventoryListChange = new EventEmitter<InventoryCls[]>();

  dataSource: TableDataSource<InventoryCls>;
  inventoryPharmModel: InventoryPharmModel;

  constructor(
    public dialogRef: MatDialogRef<InventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    private _formBuilder: FormBuilder,
    private inventoryValidator: ValidatorService,
    private apiService: ApiServices,
    private commonServices: CommonServices,
    private loaderService: LoaderService

  ) {
    // this.dataSource = new TableDataSource<any>(this.inventoryList, InventoryModel, this.inventoryValidator);
    this.inventoryPharmModel = new InventoryPharmModel();
    this.inventoryModelData = new InventoryModel();
    // this.formCreation();
  }

  ngOnInit() {
    this.commonServices.backSetCls(false); this.searchPhamracyData = this.modalData.fullData.pharmacy_list;
    this.pharmacyList = this.modalData.fullData.pharmacy_list;
    if (this.modalData.data) {
      this.inventoryList.push(this.modalData.data);
      this.pharmacy = this.modalData.data.PharmacyId;

      if (this.inventoryList.length !== 0) {
        this.buttonEnabled = true;
      }
    }
    this.dataSource = new TableDataSource<any>(this.inventoryList, InventoryCls, this.inventoryValidator);
    this.dataSource.datasourceSubject.subscribe(inventoryList => {
      this.inventoryListChange.emit(inventoryList);
      this.loadedData = inventoryList;
      console.log(this.loadedData);
    });
    this.inventoryPharmModel = new InventoryPharmModel(this.modalData.data);
    this.inventoryModelData = new InventoryModel(this.modalData.data);
    this.formCreation();

  }
  formCreation() {
    this.inventoryForm = this._formBuilder.group({
      PharmacyId: new FormControl(this.inventoryPharmModel.PharmacyId, [Validators.required]),
      DrugName: new FormControl(this.inventoryModelData.DrugName),
      Quantity: new FormControl(this.inventoryModelData.Quantity),
      BarCode: new FormControl(this.inventoryModelData.BarCode),
      InventoryTypeId: new FormControl(this.inventoryModelData.InventoryId),
      Price: new FormControl(this.inventoryModelData.Price),
      GeneralPrice: new FormControl(this.inventoryModelData.GeneralPrice),
      ConcessionPrice: new FormControl(this.inventoryModelData.ConcessionPrice),
      EntitlementPrice: new FormControl(this.inventoryModelData.EntitlementPrice),
      SpecialDispensePrice: new FormControl(this.inventoryModelData.SpecialDispensePrice),
      PreferredGenericUPI: new FormControl(this.inventoryModelData.PreferredGenericUPI),
      CreatedOn: new FormControl(this.inventoryModelData.CreatedOn),
      ModifiedOn: new FormControl(this.inventoryModelData.ModifiedOn),
    })
  }
  onChange() {
    this.buttonEnabled = true
  }

  getDisabled(): any {

    if (this.modalData && this.modalData.data && (this.loadedData === undefined || null)) {
      return true;
    } else if (!this.modalData.data && (!this.loadedData)) {
      return true;
    }
    return false;
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

  onSave(): void {
    if (this.modalData && this.modalData.data && this.modalData.data.InventoryId !== '') {
      this.loadedData[0]['InventoryId'] = this.modalData.data.InventoryId;
    }
    this.commonServices.visibility = "shown";
    this.apiService.Post(this.loadedData, this.url).subscribe(
      response => {
        // this.spinner.hide();

        if (this.modalData && this.modalData.data && this.modalData.data.InventoryId !== '') {
          // this.notiService.showNotification(GlobalConstant.updated, 1);
        } else {
          // this.notiService.showNotification(GlobalConstant.saved, 1);
        }
        this.dialogRef.close(response);
      },
      (error: any) => {
        this.commonServices.customError(2);
        this.dialogRef.close(null);
      });
  }

}
