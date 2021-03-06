import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax';
import { catchError, map, take, tap } from 'rxjs/operators';
import { IFilter } from '../interfaces/mercado-libre.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MercadoLibreService {

    public loadFilter: BehaviorSubject<IFilter[]> = new BehaviorSubject<IFilter[]>([]);
    public loadFilter$: Observable<IFilter[]> = this.loadFilter.asObservable();

    set filter( data: IFilter[] ) {
        this.loadFilter.next(data);
    }

    get filter(): IFilter[] {
        return this.loadFilter.value;
    }

    constructor() { }


    getCategories(): Observable<any> {
        const url = `${ environment.baseApi }api/search/categories`;
        return ajax(url).pipe(
            take(1),
            map( (resp: AjaxResponse ) => resp.response.data ),
            catchError((e: AjaxError) => throwError(e.response))
        )
    }
    
    getItems(offset: number, q: string | null, sort: string | null, category: string | null, filters: string | null): Observable<any> {
        let query = '';        
        if(category && category !== '') {
            if(query !== '') { query += '&'; }
            query += `category=${ category }`;
        }
        

        if(q && q !== '') {
            if(query !== '') { query += '&'; }
            query += `q=${ q }`;
        }
        if(sort && sort !== '') {
            if(query !== '') { query += '&'; }
            query += `sort=${ sort }`;
        }

        if(filters && filters !== '') {
            if(query !== '') { query += '&'; }
            query += `${ filters }`;
        }
        if(offset) {
            if(query !== '') { query += '&'; }
            query += `offset=${ offset }`;
        }
        
        const url = `${ environment.baseApi }api/search?${ query }`;
        console.log('????',  url);
        return ajax(this.replaceSpecial(url)).pipe(
            take(1),
            tap( val => console.log('tap1', val)),
            map( (resp: AjaxResponse ) => resp.response.data ),
            catchError((e: AjaxError) => throwError(e.response))
        );        
    }

    replaceSpecial(str: string): string {
        str = str.replace(/??/g, 'a');
        str = str.replace(/??/g, 'e');
        str = str.replace(/??/g, 'i');
        str = str.replace(/??/g, 'o');
        str = str.replace(/??/g, 'u');
        str = str.replace(/??/g, 'n');
        str = str.replace(/??/g, 'A');
        str = str.replace(/??/g, 'E');
        str = str.replace(/??/g, 'I');
        str = str.replace(/??/g, 'O');
        str = str.replace(/??/g, 'U');
        str = str.replace(/??/g, 'N');
        return str;

    }
}
