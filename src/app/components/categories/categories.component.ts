import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICategory } from '../../interfaces/mercado-libre.interface';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
    @Input() datas: Array<ICategory> = [];
    @Output() category: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    loadItems(category: string) {
        this.category.emit(category);
    }

}
