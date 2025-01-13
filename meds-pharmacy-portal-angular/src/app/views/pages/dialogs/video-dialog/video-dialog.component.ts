import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonServices } from '../../../../../app/views/services/common';

@Component({
  selector: 'pp-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VideoDialogComponent>, @Inject(MAT_DIALOG_DATA) public videoToplay: any, public commonsservices: CommonServices) {
  }

  ngOnInit() {
    this.commonsservices.visibility = "shown";
    this.commonsservices.backDrpCls();
    setTimeout(() => {
      this.commonsservices.visibility = "hidden";
      document.getElementsByClassName("cdk-overlay-container")[0].setAttribute('style', 'opacity:1;');
    }, 3500);
  }
  closeIt() {
    this.dialogRef.close();
  }
}
