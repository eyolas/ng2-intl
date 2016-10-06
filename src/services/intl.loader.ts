import { Http, Response } from '@angular/http';
import {Observable} from "rxjs/Observable";

export abstract class IntlLoader {
    abstract getMessages(lang: string): Observable<any>;
}

export class IntlStaticLoader implements IntlLoader {
    constructor(private http: Http, private prefix: string = "i18n", private suffix: string = ".json") {
    }

    /**
     * Gets the messages from the server
     * @param lang
     * @returns {any}
     */
    public getMessages(lang: string): Observable<any> {
        return this.http.get(`${this.prefix}/${lang}${this.suffix}`)
            .map((res: Response) => res.json());
    }
}
