import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonServices } from '../../../../../views/services/common';

@Component({
  selector: 'pp-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  viewLoading: boolean = false;
  constructor(public dialogRef: MatDialogRef<PopupComponent>,
    private commonServices: CommonServices) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.viewLoading = true;
    this.dialogRef.close('true');
  }
  onYesClick(): void {
    this.dialogRef.close(); // Keep only this row
  }
}
