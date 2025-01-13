import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiServices } from '../../../../../../../app/views/services/api.services';
import { CommonServices } from '../../../../../../../app/views/services/common';
declare var google: any;

@Component({
  selector: '[delivery-address]',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss']
})
export class DeliveryAddressComponent implements OnInit {
  @Input('delivery-address') delData: any;
  @Input('cond-data') condata: any;
  @Output() sendBackData = new EventEmitter<string>();
  valueChange = false;
  constructor(
    // private _formBuilder: FormBuilder,

    public apiServices: ApiServices,
    private cdRef: ChangeDetectorRef,
    public commonServices: CommonServices,
  ) { }

  ngOnInit() {
    // console.log(this.condata);

  }
  async onManualKeyup(flag: any, e: any) {
    this.sendBackData.emit(this.delData);

  }
}
