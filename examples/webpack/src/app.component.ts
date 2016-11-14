import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IntlService } from 'ng2-intl';

@Component({
  selector: 'my-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './src/app.component.html'
})
export class AppComponent {
  date = Date.now();
  realDate = new Date();

  constructor(private intlService: IntlService) {
    intlService.addLangs(['en', 'fr']);
    intlService.setDefaultLang('en');
    intlService.start();
    intlService.use('fr');
  }
}
