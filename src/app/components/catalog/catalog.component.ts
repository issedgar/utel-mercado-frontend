import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IItem, IItems } from '../../interfaces/mercado-libre.interface';
import { CardComponent } from '../card/card.component';

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
    @Input() data!: IItems;
    @Input() category: string = '';
    @Output() clearItems: EventEmitter<boolean> = new EventEmitter();
    @Output() pageSelect: EventEmitter<number> = new EventEmitter();

    public view: string = 'table';

    constructor(
        private modalService: NgbModal
    ) { }

    ngOnInit(): void { }

    clearData() {
        this.clearItems.emit(true);
    }

    pageChange(page: number) {
        this.pageSelect.emit(page - 1);
    }

    openModal(item: IItem) {
        const modalRef = this.modalService.open(CardComponent);
        modalRef.componentInstance.data = item;
        modalRef.componentInstance.isModal = true;
    }

}
