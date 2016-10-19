import { Component, OnInit, Input, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { IntlService, LangChangeEvent, FormatService } from '../services';
import { AbstractI18nComponent } from './abstractI18n';

@Component({
  selector: 'FormattedDate',
  template: `{{result}}`
})
export class FormattedDateComponent extends AbstractI18nComponent implements OnInit, OnDestroy, OnChanges {
  @Input() value: string;
  @Input() options: Object;

  constructor(intlService: IntlService, formatService: FormatService) {
    super(intlService, formatService);
   }

  updateValue(): void {
    this.result = this.formatService.formatDate(this.value, this.options);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] || changes['options']) {
      this.updateValue();
    }
  }
}
