import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SubheaderService } from '../../../../core/_base/layout';
import { ApiServices } from '../../../../../app/views/services/api.services';
import { CommonServices } from '../../../../../app/views/services/common';
import { forEach } from 'lodash';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { PopupComponent } from './popup/popup.component';
import { GlobalConstant } from '../../globals/globalvariables';
import { Observable } from 'rxjs/internal/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'pp-upload-drug-images',
  templateUrl: './upload-drug-images.component.html',
  styleUrls: ['./upload-drug-images.component.scss']
})
export class UploadDrugImagesComponent implements OnInit {
  isShow: boolean = false;
  isPopup: boolean = false;
  url = 'UploadDrugImages/';
  userdetails: any;
  barcode: string;
  product: any = [];
  temparray: any = [];
  data: any = [];
  Key: any = [];
  myarray: any = [];
  upload: boolean = false;
  ImageCount: any = [];
  isDirty: boolean = false; // Track unsaved changes

  submitted = false;
  private hasUnsavedData = false;
  private unsubscribe = new Subject<void>();

  constructor(private _subheaderService: SubheaderService, private apiServices: ApiServices, public commonServices: CommonServices,
    private layoutUtilsService: LayoutUtilsService, private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userdetails = JSON.parse(localStorage.getItem("userdetails"));
    this._subheaderService.setTitle("Upload Drug Images");
    this.temparray = [];
  }


  loadFile(fileLoader, imageIndex, flag, product) {
    const that = this;
    fileLoader.click();
    fileLoader.value = "";
    fileLoader.onchange = function () {
      const files = fileLoader.files;
      let unsupportedFileCount = 0;
      var filelength = files.length;
      for (let i = 0; i < filelength; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.addEventListener("load", function () {
          const Base64 = reader.result;
          const FileName = file.name;
          const ContentType = file.type;
          if (ContentType === "image/jpeg" || ContentType === "image/jpg") {
            if (flag !== 1) {
              const index = product.S3Objects[imageIndex];
              if (index && index.Key) {
                const existingObjectIndex = that.myarray.findIndex(item => item.Index === imageIndex);
                if (existingObjectIndex !== -1) {
                  that.myarray[existingObjectIndex] = { FileName, ContentType, Base64, Key: index.Key, Index: imageIndex }; that.temparray = that.myarray;
                } else {
                  that.myarray.splice(imageIndex, 0, { FileName, ContentType, Base64, Key: index.Key, Index: imageIndex }); that.temparray = that.myarray;
                }
              }
            } else {
              that.myarray.splice(imageIndex, 0, { FileName, ContentType, Base64, Key: "", Index: imageIndex });
              that.temparray = that.myarray;
              if (unsupportedFileCount > 0 && i + 1 == filelength) {
                var files = unsupportedFileCount == 1 ? 'file' : 'files';
                that.apiServices.showSnack(`${unsupportedFileCount} unsupported ${files} uploaded. Supported file formats: JPG, JPEG`);
              }
            }
          } else {
            unsupportedFileCount++;
            if (unsupportedFileCount > 0 && i + 1 == filelength) {
              var files = unsupportedFileCount == 1 ? 'file' : 'files';
              that.apiServices.showSnack(`${unsupportedFileCount} unsupported ${files} uploaded. Supported file formats: JPG, JPEG`);
            }
          }
        }, false);

        if (file) {
          reader.readAsDataURL(file);
        }
      }

    };
  }

  call() {
    var length = this.myarray.filter(x => x.Key == "").length
    var msg = '';
    var msg = length == 1 ? " Uploaded " + length + " File " : (length > 1 ? " Uploaded " + length + " Files " : "");
    return msg;
  }

  loadUsersList(barcode) {
    const code = barcode.trim();
    if (code === "" || code === undefined) {
      this.myarray = [];
      this.commonServices.visibility = "hidden";
      return;
    }
    const api = "getList?barcode=" + code;
    const processResponse = (response) => {
      if (response.ErrorFlag === 1) {
        this.isShow = true;
        this.data = response.data;
        this.product = response.response;
        this.ImageCount = this.product.S3Objects;
        this.apiServices.showSnack(response.ErrorMsg);
      } else {
        this.isShow = false;
        this.apiServices.showSnack(response.ErrorMsg);
      }
      this.commonServices.visibility = "hidden";
    };

    if (this.isShow) {
      const dialogRef = this.dialogElement();
      dialogRef.afterClosed().subscribe(res => {
        if (res === 'true') {
          this.isPopup = false;
          this.commonServices.visibility = "shown";
          this.apiServices.Get(this.url + api).subscribe((response: any) => {
            processResponse(response);
          });
        } else {
          this.myarray = [];
          this.commonServices.visibility = "hidden";
        }
      });
    } else {
      this.commonServices.visibility = "shown";
      this.apiServices.Get(this.url + api).subscribe((response: any) => {
        processResponse(response);
      });
    }
  }


  showImage(index, flag) {
    let image = '';
    if (flag == 1) {
      if (this.ImageCount[index] != undefined) {
        if (this.data.ImageCount >= this.ImageCount.length) {
          image = this.apiServices.OTCImagePath + this.ImageCount[index].Key;
        }
        else {
          this.ImageCount.length = this.data.ImageCount;
          image = this.apiServices.OTCImagePath + this.ImageCount[index].Key;
        }

      }
      const object = this.myarray.find(x => x.Index == index);
      if (object && object.Base64) {
        return object.Base64;
      } else {
        return image;
      }
    } else if (flag == 2) {
      const object = this.myarray.find(x => x.Index == index);
      if (object !== undefined) {
        this.myarray.splice(this.myarray.indexOf(object), 1);
      }
      image = this.apiServices.OTCImagePath + this.ImageCount[index].Key;
      return image;
    }
    return image;
  }

  save() {
    this.commonServices.visibility = "shown";
    this.apiServices.Post(this.myarray, this.url + "uploadImagesinS3?barcode=" + this.data.Ean + "&imageversion=" + this.data.ImageVersion + "&imagecount=" + this.data.ImageCount
    ).subscribe((response) => {
      if (response != null) {
        debugger;
        this.isShow = true;
        this.data = response.data; this.product = response.response;
        this.ImageCount = this.product.S3Objects;
        this.myarray = [];
        this.apiServices.showSnack("Image saved successfully");
        this.commonServices.visibility = "hidden";
      } else {
        this.commonServices.visibility = "hidden";
        this.commonServices.customError(1);
      }
    },
      error => {
        this.commonServices.customError(1);
        this.commonServices.visibility = "hidden";
      });

  }

  clear(imageIndex) {
    this.myarray.splice(imageIndex, 1);
  }

  deleteByEan(i) {
    const title: string = 'Delete image';
    const description: string = 'Are you sure you want to delete this image?';
    const waitDesciption: string = 'Image is being deleted...';
    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (this.myarray.length != 0) {
          var index = this.myarray.some(item => item.Index === i);
          if (index) {
            this.showImage(i, 2)
          } else {
            this.deleteApi(i, 1);
          }
        } else {
          this.deleteApi(i, 2);
        }

      } else {
        return;
      }
    });
  }


  deleteApi(i, flag) {
    this.commonServices.visibility = "shown";
    var data = this.product.S3Objects[i];
    if (data != null && data != "" && data != undefined) {
      const index = data.Key.indexOf("products/o/") + "products/o/".length;
      if (index >= 0 && index < data.Key.length) {
        var remaining = data.Key.substring(index);
      }
      this.apiServices.GetList(this.url + "deleteByEan?barcode=" + this.barcode + "&key=" + remaining).subscribe((res: any) => {
        if (res != null) {
          this.isShow = true;
          this.data = res.data; this.product = res.response;
          this.ImageCount = this.product.S3Objects;
          if (flag == 1) {
            this.myarray = this.temparray;
          }
          this.apiServices.showSnack("Image deleted successfully");
          this.commonServices.visibility = "hidden";
        }
      }, error => {
        this.commonServices.customError(5);
        this.commonServices.visibility = "hidden";
      });
    } else {
      this.commonServices.customError(5); this.commonServices.visibility = "hidden";
    }
  }

  PopUp() {
    const dialogRef = this.dialogElement();
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'true') {
        this.isPopup = false;
        return;
      } else {
        // this.barcode = "";
        // this.isShow = false;
        this.myarray = [];
        this.commonServices.visibility = "hidden";
        return;
      }
    });
  }

  dialogElement() {
    this.isPopup = true;
    return this.dialog.open(PopupComponent, {
      width: '440px',
      disableClose: true
    });
  }

  // @HostListener('document:click', ['$event'])
  // onclick(event) {
  //   if (this.myarray.length > 0) {
  //     if (event.target.matches('div')) {
  //       if (this.isPopup) {
  //         return;
  //       }
  //       if ((event.target.id === 'lookbtn' || event.target.id === 'savebutton' || event.target.id === 'imagebutton' || event.target.id === 'clearbutton' || event.target.id === 'erasebutton') && event.target.id === "") {
  //         return;
  //       }
  //       this.isPopup = true;
  //       this.PopUp();
  //     }
  //   } else {
  //     return;
  //   }
  // }

  @HostListener("window:beforeunload", ["$event"])
  canDeactivate(event: BeforeUnloadEvent): boolean | void {
    if (this.myarray.length > 0) {
      this.PopUp();
      return false;
    }
    return true;
  }
}

