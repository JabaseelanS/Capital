import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiServices } from '../../../../services/api.services';
import { CommonServices } from '../../../../services/common';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { RowSelectedEvent } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community';
import { GlobalConstant } from '../../../globals/globalvariables';
import { AlertDialogComponent } from '../../../dialogs/alert-dialog/alert.dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'pp-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  gridApi: GridApi;
  options: any = [];
  filteredData: any = [];
  url = "ProductList/";
  rowData: any[] = [];
  tempreportdata: any[] = [];
  sortedData: any;
  categoryNames: any = [];
  tempCategory: any = [];
  subCategoryNames: any = [];
  tempSubcategorylist: any = [];
  ColumnApi: GridApi;
  isRowSelected: boolean = false;
  filterText = "";
  excludedIds = [0, 1, 2, 3, 4, 8, 9, 10];
  filteredArray: any = [];
  categoryfield = "";
  subcategoryfield = "";
  tempsubCategory: any = [];
  categoryId: any;
  selectedCategoryName: string
  selectedSubCategoryName: string
  PageNumber: number = 1;
  Pagesize: number = 500;
  totalPages: number;
  currentPageNumber: number;
  startRow: number = 1;
  endRow: number = 10;
  totalCount: number;
  tempCount: number;
  selectedField: any = [];
  loading: boolean = false;
  isRowSelectedColumnVisible: boolean = false;
  filter: string
  columnDefs = [];
  ischeckboxes: any;
  enableCateogry: boolean = false;
  isActive: boolean = true;
  categoryfilterText = "";
  subcategoryfilterText = "";
  stillsearching: boolean;
  FilterDropdownColumn = [
    { field: 'BarcodeNumber', Id: 1 },
    { field: 'ProductName', Id: 2 },
    { field: 'CategoryName', Id: 3 },
    { field: 'SubcategoryName', Id: 4 },
    { field: 'IsActive', Id: 5 },
    { field: 'IsDDCatalog', Id: 6 },
    { field: 'IsUECatalog', Id: 7 },
    { field: 'Image', Id: 8 },
  ];


  gridOptions = {
    defaultColDef: {
      sortable: true,
    },
    pagination: true,
    paginationPageSize: 10,
    rowHeight: 50,
    onRowSelected: this.onRowSelected.bind(this),
    rowSelection: 'multiple',
  };

  constructor(public apiservice: ApiServices, public commonservices: CommonServices, public subheaderService: SubheaderService, private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog) { }

  ngOnInit() {
    this.subheaderService.setTitle('ProductList');
    this.loadData(false);
    this.getColumnDefs();
    this.columnDefs.forEach(columnDef => {
      if (!this.excludedIds.includes(columnDef.Id)) {
        this.options.push({ Id: columnDef.Id, name: columnDef.headerName });
      }
    });
    this.isRowSelected = false;
    this.changeDetectorRef.detectChanges();
  }

  loadData(flag) {
    if (flag) {
      this.rowData = []; this.filteredData = [];
      this.isRowSelected = false; this.enableCateogry = false;
      this.categoryfield = "";
      this.subcategoryfield = "";
      this.selectedField = ""; this.filterText = "";
      this.PageNumber = 1

    }
    this.commonservices.visibility = "shown";
    this.apiservice.Get(`${this.url}GetProductList?pageNumber=${this.PageNumber}&pageSize=${this.Pagesize}&Flag=${1}&Ids=${''}&active=${this.isActive}`).subscribe(
      (data: any) => {
        if (data.flag === 1) {
          this.rowData = JSON.parse(JSON.stringify(this.rowData.concat(data.reportData)));
          this.tempreportdata = data.reportData;
          this.filteredData = JSON.parse(JSON.stringify(this.filteredData.concat(data.reportData)));
          this.totalCount = data.totalCount;
          this.tempCount = data.totalCount;
          this.setDropDownValues(data._catList, data._subCatList);
        } else {
          this.commonservices.customError(1);
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.commonservices.customError(1);
      },
      () => {
        this.commonservices.visibility = "hidden";
      }
    );
  }

  onPaginationChanged() {
    this.getTotalPageNumber();
    var currentPageNumber = this.gridApi ? this.gridApi.paginationGetCurrentPage() + 1 : 0;
    if (this.gridApi) {
      this.startRow = (currentPageNumber - 1) * this.gridApi.paginationGetPageSize() + 1;
      this.endRow = this.startRow + this.gridApi.paginationGetPageSize() - 1;
    }
    if (currentPageNumber == this.totalPages - 1 || (currentPageNumber === this.totalPages && this.totalPages != 1)) {
      if (this.filterText.trim() == "" && this.tempreportdata.length > 0) {
        this.PageNumber = this.PageNumber + 1;
        this.loadData(false);
      }
    }
  }

  getTotalPageNumber() {
    if (this.gridApi) {
      this.totalPages = this.gridApi.paginationGetTotalPages();
      return this.totalPages;
    }
    return 0;
  }

  SelectCategory(event: any) {
    const subcategoriesForSelectedCategory = this.subCategoryNames.filter(category => category.CategoryId === event);
    this.tempsubCategory = subcategoriesForSelectedCategory;
    this.tempSubcategorylist = this.tempsubCategory;
    this.updateCategoryValues();
    this.subcategoryfield = "";
  }


  updateCategoryValues() {
    const selectedCategory = this.categoryNames.find(category => category.id === this.categoryfield);
    this.selectedCategoryName = selectedCategory ? selectedCategory.name : "";
    const selectedNodes = this.gridApi.getSelectedNodes();
    selectedNodes.forEach(node => {
      node.data.CategoryName = this.selectedCategoryName;
    });
    this.isRowSelected = selectedNodes.length! != 0 ? true : false;
    this.gridApi.refreshCells();
  }


  SelectSubCategory() {
    const selectedCategory = this.subCategoryNames.find(subcategory => subcategory.Id === this.subcategoryfield);
    this.selectedSubCategoryName = selectedCategory ? selectedCategory.name : "";
    const selectedNodes = this.gridApi.getSelectedNodes();
    selectedNodes.forEach(node => {
      node.data.SubcategoryName = this.selectedSubCategoryName;
    });
    this.isRowSelected = selectedNodes.length! != 0 ? true : false;
    this.gridApi.refreshCells();
  }

  setDropDownValues(catlist, subcatlist) {
    this.categoryNames = catlist.map(category => ({ id: category.Id, name: category.Name }));
    this.tempCategory = this.categoryNames;
    this.subCategoryNames = subcatlist.map(subcategory => ({ Id: subcategory.Id, name: subcategory.Name, CategoryId: subcategory.CategoryId }));
  }

  onGridReady(params: any) {
    params.api.setColumnDefs(this.columnDefs);
    params.api.gridOptions = this.gridOptions;
    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
  }

  onCellClicked = (event: any) => {
    this.enableCateogry = true;

    if (event.colDef.Id == 1 || event.colDef.Id == 2 || event.colDef.Id == 8 || event.colDef.Id == 3 || event.colDef.Id == 4) {
      this.isRowSelected = false;
      this.categoryfield = "";
      this.subcategoryfield = "";
      this.selectedField = ""; this.tempsubCategory = [];
      this.tempSubcategorylist = [];
    }

    if (event.colDef.Id == 1 || event.colDef.Id == 2 || event.colDef.Id == 8) {
      this.gridApi.refreshCells();
      return;
    }

    const checkboxColumns = ['IsActive', 'Islive', 'IsDDCatalog', 'IsUECatalog'];
    const isCheckboxClick = event.column.colDef.cellEditor === 'agCheckboxCellEditor';
    if (checkboxColumns.includes(event.colDef.field) && isCheckboxClick) {
      this.ischeckboxes = event.node.data;
      this.ischeckboxes[event.colDef.field] = !this.ischeckboxes[event.colDef.field];
      this.isRowSelected = true;
      this.gridApi.refreshCells();
    }
  }

  onRowSelected(event: RowSelectedEvent) {
    this.enableCateogry = true;
    this.gridApi.refreshCells({ force: true });
    const selectedNodes = this.gridApi.getSelectedNodes();
    if (selectedNodes.length == 0) {
      this.enableCateogry = false;
      this.categoryfield = "";
      this.subcategoryfield = "";
      this.selectedField = ""; this.isRowSelected = false;
    }
  }

  onShort(data) {
    this.sortedData = data.sort((a, b) => {
      const categoryA = a.CategoryName || '';
      const categoryB = b.CategoryName || '';
      if (categoryA === categoryB) {
        return 0;
      }
      if (categoryA !== '' && categoryB === '') {
        return -1;
      }
      if (categoryA === '' && categoryB !== '') {
        return 1;
      }
      return categoryA.localeCompare(categoryB);
    });
  }


  getColumnDefs(): any[] {
    this.columnDefs = [
      this.isRowSelectedColumnVisible ? {
        headerName: '',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        Id: 0,
        width: 40,
      } : null,
      { headerName: 'Bar Code', field: 'BarcodeNumber', Id: 1, width: this.isRowSelectedColumnVisible ? 205 : 210 },
      {
        headerName: 'Name', field: 'ProductName', Id: 2, width: 500
      },
      {
        headerName: 'Category',
        field: 'CategoryName',
        enableRowGroup: true,
        Id: 3,
        width: 214
      },
      {
        headerName: 'SubCategory',
        field: 'SubcategoryName',
        Id: 4,
        width: 214
      },
      {
        headerName: 'Active', field: 'IsActive', cellRenderer: params => {
          return `<input class="checkbox-bg-clr" type="checkbox" ${params.value ? 'checked' : ''}  'enabled'}>`;
        },
        cellEditor: 'agCheckboxCellEditor', Id: 5,
        width: this.isRowSelectedColumnVisible ? 145 : 155
      },
      {
        headerName: 'DoorDash', field: 'IsDDCatalog', cellRenderer: params => {
          return `<input class="checkbox-bg-clr" type="checkbox" ${params.value ? 'checked' : ''} 'enabled'}>`;
        }, cellEditor: 'agCheckboxCellEditor', Id: 6, width: this.isRowSelectedColumnVisible ? 145 : 155
      },
      {
        headerName: 'Uber Eats', field: 'IsUECatalog', cellRenderer: params => {
          return `<input class="checkbox-bg-clr" type="checkbox" ${params.value ? 'checked' : ''}  'enabled'>`;
        }, cellEditor: 'agCheckboxCellEditor', Id: 7, width: this.isRowSelectedColumnVisible ? 145 : 155
      },
      { headerName: 'Image', field: 'ImageCount', Id: 8, width: this.isRowSelectedColumnVisible ? 145 : 150 },

    ].filter(Boolean);
    return this.columnDefs;
  }

  onFilterTextBoxChanged() {
    if (this.filterText.length > 3 && !this.stillsearching) {
      this.stillsearching = true;
      this.categoryfield = "";
      this.subcategoryfield = "";
      this.selectedField = "";
      this.enableCateogry = false;
      this.tempsubCategory = [];
      this.isRowSelected = false;
      this.loading = true;
      this.gridApi.setRowData([]);
      this.gridApi.showLoadingOverlay();
      this.filter = this.filterText.trim();
      if (this.filter == "" || this.filter == null) {
        this.loading = false; this.gridApi.hideOverlay(); this.stillsearching = false;
        return this.apiservice.showSnack("search field is empty");
      }
      var query = "FilterSearch?searchquery=" + this.filter + "&active=" + this.isActive;
      this.apiservice.Get(this.url + query).subscribe((data: any) => {
        if (data.flag == true && this.filterText.length != 0) {
          this.isRowSelectedColumnVisible = true;
          this.stillsearching = false;
          this.rowData = data.reportData;
          this.filteredArray = data.reportData;
          this.totalCount = this.rowData.length;
          this.gridApi.setRowData(this.rowData);
          if (this.filter.trim() != this.filterText.trim() && this.filterText.length > 3) {
            this.loading = true;
            this.gridApi.setRowData([]);
            this.gridApi.showLoadingOverlay();
            this.onFilterTextBoxChanged(); return;
          }
        }
        this.gridApi.setColumnDefs(this.getColumnDefs());
        this.loading = false;
        this.gridApi.hideOverlay();
        this.refreshGrid();
      }, error => {
        console.error('API Error:', error);
        this.commonservices.customError(1);
        this.loading = false;
        this.gridApi.hideOverlay();
      });
    }

    if (this.filterText.trim() == "" || this.filterText.trim().length <= 0 || this.filterText.trim() == null) {
      this.rowData = []; this.stillsearching = false;
      this.totalCount = this.tempCount;
      this.filteredArray = [];
      this.isRowSelectedColumnVisible = false;
      this.isRowSelected = false;
      this.categoryfield = "";
      this.subcategoryfield = "";
      this.selectedField = "";
      this.enableCateogry = false;
      this.tempSubcategorylist = [];
      this.refreshGrid();
      this.rowData = JSON.parse(JSON.stringify(this.filteredData));
      this.gridApi.setRowData(this.rowData);
      this.gridApi.setColumnDefs(this.getColumnDefs());
      this.refreshGrid();
      return;
    }
  }

  toggleSelection(option: any) {
    const selectedNodes = this.gridApi.getSelectedNodes();
    var checkedStatus = this.selectedField.includes(option.Id);
    selectedNodes.forEach((row: any) => {
      var i: any = this.filteredArray.findIndex((a: any) => a.Id == row.data.Id);
      var columnConfig = this.FilterDropdownColumn.find(column => column.Id === option.Id);
      var fieldName = columnConfig ? columnConfig.field : option.name;
      this.filteredArray[i][fieldName] = checkedStatus;
      this.isRowSelected = true;
      this.refreshGrid();
    });

    // if (this.selectedField.length <= 0 && this.categoryfield == "" && this.subcategoryfield == "") {
    //   this.isRowSelected = false;
    // }
  }

  checkSubValue() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    var selectedrow = selectedNodes.length
    for (const item of selectedNodes) {
      const selectedCategory = this.categoryNames.find(category => category.name === item.data.CategoryName);
      item.data.CategoryId = selectedCategory ? selectedCategory.id : 0;
      const selectedSubCategory = this.subCategoryNames.find(subcategory => subcategory.name === item.data.SubcategoryName);
      item.data.SubId = selectedSubCategory ? selectedSubCategory.Id : 0;
      if (this.categoryfield != "") {
        const subCategoryExist = this.subCategoryNames.find(subcategory => subcategory.Id === item.data.SubId);
        var existValue = !subCategoryExist || subCategoryExist.CategoryId === item.data.CategoryId;
        if (!existValue) {
          this.apiservice.showSnack('You selected a category, so please select a subcategory as well.');
          return;
        }
      }
    }
    this.alertDialog(selectedrow)
  }

  bulkRowUpdate() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    let updatedData = selectedNodes.map(item => ({
      Id: item.data.Id,
      CategoryId: item.data.CategoryId !== null ? item.data.CategoryId : 0,
      SubId: item.data.SubId !== null ? item.data.SubId : 0,
      IsActive: item.data.IsActive != null ? item.data.IsActive : 0,
      IsLive: item.data.Islive != null ? item.data.Islive : 0,
      IsDDCatalog: item.data.IsDDCatalog != null ? item.data.IsDDCatalog : 0,
      IsUECatalog: item.data.IsUECatalog != null ? item.data.IsUECatalog : 0,
    }));
    this.PageNumber = 1; this.Pagesize = 500;
    var values = { Products: updatedData };
    this.commonservices.visibility = "shown";
    const requestUrl = `${this.url}SaveProduct?PageNumber=${this.PageNumber}&pageSize=${this.Pagesize}&Flag=${2}&filtersearch=${this.filter}&active=${this.isActive}`;

    this.apiservice.Post(values, requestUrl).subscribe((data: any) => {
      if (data.flag == 1) {
        this.rowData = data.reportData;
        this.filteredData = data.reportData;
        this.gridApi.setRowData(this.rowData);
        // data.reportData.forEach((row: any) => {
        //   var respnserowdata = this.rowData.findIndex(updatedItem => updatedItem.Id === row.Id);
        //   var filterdata = this.filteredArray.findIndex(updatedItem => updatedItem.Id === row.Id);
        //   var indexId = this.filteredData.findIndex(updatedItem => updatedItem.Id === row.Id);
        //   if (respnserowdata >= 0 && filterdata >= 0) {
        //     this.rowData[respnserowdata] = row;
        //     this.filteredArray[filterdata] = row;
        //     this.gridApi.setRowData(this.rowData);
        //   }
        //   this.filteredData[indexId] = row;
        // });
        this.totalCount = this.tempCount;
        this.filteredArray = [];
        this.categoryfield = "";
        this.subcategoryfield = "";
        this.selectedField = "";
        this.isRowSelectedColumnVisible = false;
        this.tempsubCategory = [];
        this.gridApi.setColumnDefs(this.getColumnDefs());
        this.refreshGrid();
        this.gridApi.deselectAll();
        this.isRowSelected = false;
        this.commonservices.visibility = "hidden";
        this.apiservice.showSnack(GlobalConstant.updated);
      }
    }, error => {
      console.error('API Error:', error);
      this.commonservices.customError(1);
    });
  }

  refreshGrid() {
    if (this.gridApi) {
      this.gridApi.refreshCells({ force: true });
    }
  }

  alertDialog(data) {
    this.dialog.open(AlertDialogComponent, {
      disableClose: true,
      data: {
        title: "Bulk Update",
        message: "Do you want to update " + data + " " + "records ?",
        btnCancelText: "No",
        btnOkText: "Yes"
      },
      width: "380px",
    }).afterClosed().subscribe(val => {

      if (val == 'Show') {
        this.bulkRowUpdate();
      }
      else {
        return;
      }
    })
  }

  reset() {
    this.enableCateogry = false;
    this.filterText = "";
    this.categoryfield = "";
    this.subcategoryfield = "";
    this.tempSubcategorylist = [];
    this.rowData = this.filteredData;
    this.totalCount = this.tempCount;
    this.filteredArray = [];
    this.isRowSelectedColumnVisible = false;
    this.gridApi.setColumnDefs(this.getColumnDefs());
    this.isRowSelected = false;
    this.selectedField = "";
    this.tempsubCategory = [];
    this.rowData = JSON.parse(JSON.stringify(this.filteredData));
    this.refreshGrid();
    this.gridApi.deselectAll();
  }
  searchFilterBycategory(value) {
    let data = [];
    this.tempCategory.filter(val => {
      if (val.name.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        data.push(val);
      }
    })
    this.categoryNames = data;
  }
  searchFilterBysubcategory(value) {
    let data = [];
    this.tempSubcategorylist.filter(val => {
      if (val.name.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        data.push(val);
      }
    })
    this.tempsubCategory = data;
  }
  onSelectOpened(event: boolean) {
    if (!event) {
      this.categoryfilterText = "";
      this.subcategoryfilterText = "";
      this.categoryNames = this.tempCategory;
      this.tempsubCategory = this.tempSubcategorylist;
    }

  }
}
