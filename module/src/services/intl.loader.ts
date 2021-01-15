import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class IntlLoader {
  abstract getMessages(lang: string): Observable<any>;
}

export class IntlStaticLoader implements IntlLoader {
  constructor(private http: HttpClient, private prefix = 'i18n', private suffix = '.json') {
  }

  /**
   * Gets the messages from the server
   * @param lang
   * @returns {any}
   */
  public getMessages(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}/${lang}${this.suffix}`);
  }
}
