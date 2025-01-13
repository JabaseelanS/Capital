import { trigger, state, style } from '@angular/animations';
import { Component, OnInit, Inject, Injectable, ChangeDetectorRef, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../services/common';
import { ApiServices } from '../../services/api.services';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'kt-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      state('rotated1', style({ transform: 'rotate(180deg)' })),
      state('rotated2', style({ transform: 'rotate(270deg)' })),
    ])
  ]
})
export class ImageDialogComponent implements OnInit {
  header = "View Prescription";
  isType = 0;
  eToken = "";
  imagePath: any = "../../../../../../assets/img/imageloader.gif";
  loading = true;
  state: string = 'default';
  imageload = false;
  // commonServices.imgRotateIndex = 0;
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    private cdf: ChangeDetectorRef,
    public commonServices: CommonServices,
    private apiServices: ApiServices,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    // this.imagePath = 'https://effigis.com/wp-content/uploads/2015/02/DigitalGlobe_QuickBird_60cm_8bit_RGB_DRA_Boulder_2005JUL04_8bits_sub_r_1.jpg';
    // this.commonServices.isImgLoaded = false;
    // this.ngxUiLoaderService.start();
    // this.imageload = false;
  }

  ngOnInit() {
    // this.imagePath = this.data.image;
    this.isType = this.data.record.IsUploadType;
    this.eToken = this.data.record.EToken;
    this.state = this.data.stte;
    if (this.data.record.IsUploadType == 2) {
      this.header = "QR Scanner";
    } else if (this.data.record.IsUploadType == 6 || this.data.record.IsUploadType == 10) {
      this.header = "Electronic Prescription";
    }
    this.imagePath = this.data.image == null || this.data.image == '' ? "../../../../../../assets/img/imageloader.gif" : this.data.image;
  }

  ngAfterViewInit() {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onImageLoad() {
    this.imageload = true;
  }

  getClassName(): any {
    if (this.commonServices.imgRotateIndex == 1) {
      return 'rotate90';
    } else if (this.commonServices.imgRotateIndex == 2) {
      return 'rotate180';
    } else if (this.commonServices.imgRotateIndex == 3) {
      return 'rotate270';
    } else if (this.commonServices.imgRotateIndex == 4) {
      return 'rotate360';
    }
  }

}
