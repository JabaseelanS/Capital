import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DetailsDialog } from '../../tabs/tabs/tabs.component';
@Component({
  selector: 'pp-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  @Input() selectedScript: any;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    console.log(this.selectedScript);
  }



}
