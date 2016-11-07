import { OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { IntlService, LangChangeEvent, FormatService } from '../services';

export abstract class AbstractI18nComponent implements OnInit, OnDestroy {
  result: string;
  onLangChange: EventEmitter<LangChangeEvent>;

  constructor(protected intlService: IntlService, protected formatService: FormatService) { }

  abstract updateValue(): void

  ngOnInit() {

    // set the value
    this.updateValue();

    // if there is a subscription to onLangChange, clean it
    this._dispose();

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChange) {
      this.onLangChange = this.intlService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateValue();
      });
    }
  }

  /**
  * Clean any existing subscription to change events
  * @private
  */
  _dispose(): void {
    if (typeof this.onLangChange !== 'undefined') {
      this.onLangChange.unsubscribe();
      this.onLangChange = undefined;
    }
  }

  ngOnDestroy(): void {
    this._dispose();
  }
}
