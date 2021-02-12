import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IntlService } from '../services/intl.service';
import { FormatService } from '../services/format.service';
import { AbstractI18nComponent } from './abstractI18n';

@Component({
  selector: 'FormattedNumber',
  template: `{{ result }}`,
})
export class FormattedNumberComponent
  extends AbstractI18nComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() value: number;
  @Input() options: Object;

  constructor(intlService: IntlService, formatService: FormatService) {
    super(intlService, formatService);
  }

  updateValue(): void {
    this.result = this.formatService.formatNumber(this.value, this.options);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] || changes['options']) {
      this.updateValue();
    }
  }
}
