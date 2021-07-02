import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, AfterViewInit {
    @ViewChild('searchBar') searchBar!: NgModel;
    @ViewChild('orderItem') orderItem!: NgModel;

    @Input() disabledSort: boolean = false;
    
    @Output() value: EventEmitter<string> = new EventEmitter();
    @Output() orderBy: EventEmitter<string> = new EventEmitter();
    @Output() clear: EventEmitter<boolean> = new EventEmitter();
    

    public text: string | undefined = undefined;
    public sort = '';

    constructor() { }
    ngAfterViewInit(): void {
        this.searchBar.valueChanges!.pipe( debounceTime(600) ).subscribe(e => this.value.emit(e));
        this.orderItem.valueChanges!.subscribe(e => this.orderBy.emit(e));
        
    }

    ngOnInit(): void {}

    clearItems() {
        this.text = '';
        this.clear.emit(true)
    }

}
