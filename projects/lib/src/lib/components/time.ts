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
  selector: 'FormattedTime',
  template: `{{ result }}`,
})
export class FormattedTimeComponent
  extends AbstractI18nComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() value: string;
  @Input() format: string;
  @Input() options: Object;

  constructor(intlService: IntlService, formatService: FormatService) {
    super(intlService, formatService);
  }

  updateValue(): void {
    const props = Object.assign(
      {},
      {
        format: this.format,
      },
      this.options
    );

    this.result = this.formatService.formatTime(this.value, props);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] || changes['format'] || changes['options']) {
      this.updateValue();
    }
  }
}
