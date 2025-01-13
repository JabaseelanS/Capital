import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'pp-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input() text: string;
  @Input() content: TemplateRef<any>;
  constructor() { }

  ngOnInit() {
  }

}
