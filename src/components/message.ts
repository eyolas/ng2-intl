import { Component, OnInit, Input, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { IntlService, LangChangeEvent, FormatService } from '../services';
import { AbstractI18nComponent } from './abstractI18n';

@Component({
  selector: 'FormattedMessage',
  template: `<span>{{result}}</span>`
})
export class FormattedMessageComponent extends AbstractI18nComponent implements OnInit, OnDestroy, OnChanges {
  @Input() id: string;
  @Input() values: Object;

  constructor(intlService: IntlService, formatService: FormatService) {
    super(intlService, formatService);
   }

  updateValue(): void {
    this.intlService.get(this.id).subscribe((msg: string) => {
      if (msg !== undefined) {
        this.result = this.formatService.formatMessage(msg, this.values);
      } else {
        this.result = this.id;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] || changes['values']) {
      this.updateValue();
    }
  }
}
