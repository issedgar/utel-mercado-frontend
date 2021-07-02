import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICard } from '../../interfaces/mercado-libre.interface';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
    @Input() data!: ICard;
    @Input() isModal: boolean = false;

    constructor(
        public ngbActiveModal : NgbActiveModal
    ) { }

    ngOnInit(): void {
    }

}
