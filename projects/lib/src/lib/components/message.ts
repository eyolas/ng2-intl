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
  selector: 'FormattedMessage',
  template: `{{ result }}`,
})
export class FormattedMessageComponent
  extends AbstractI18nComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() id: string;
  @Input() defaultMessage: string;
  @Input() values: Object;

  constructor(intlService: IntlService, formatService: FormatService) {
    super(intlService, formatService);
  }

  updateValue(): void {
    const { id, defaultMessage } = this;
    this.formatService
      .formatMessageAsync({ id, defaultMessage }, this.values)
      .subscribe((msg: string | undefined) => {
        if (typeof msg === 'string') {
          this.result = msg;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] || changes['values']) {
      this.updateValue();
    }
  }
}
