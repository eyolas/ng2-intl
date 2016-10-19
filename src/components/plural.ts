import { Component, OnInit, Input, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { IntlService, LangChangeEvent, FormatService } from '../services';
import { AbstractI18nComponent } from './abstractI18n';

@Component({
  selector: 'FormattedPlural',
  template: `{{result}}`
})
export class FormattedPluralComponent extends AbstractI18nComponent implements OnInit, OnDestroy, OnChanges {
  @Input() value: string;
  @Input() options: Object;
  @Input() other: string;
  @Input() zero?: string;
  @Input() one?: string;
  @Input() two?: string;
  @Input() few?: string;
  @Input() many?: string;

  constructor(intlService: IntlService, formatService: FormatService) {
    super(intlService, formatService);
  }

  updateValue(): void {
    const props: {[k: string]: any} = Object.assign({},
      {
        other: this.other,
        zero: this.zero,
        one: this.one,
        two: this.two,
        few: this.few,
        many: this.many
      },
      this.options
    );

    let pluralCategory = this.formatService.formatPlural(this.value, props);
    this.result = props[pluralCategory] || this.other;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] || changes['options'] || changes['other'] || changes['plurals']) {
      this.updateValue();
    }
  }
}
