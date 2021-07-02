import { Component,  EventEmitter,  OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MercadoLibreService } from 'src/app/services/mercado-libre.service';
import { IFilter } from '../../interfaces/mercado-libre.interface';

declare var $:any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
    @Output() checkFilter: EventEmitter<IFilter[]> = new EventEmitter();

    public subs: Subscription | undefined = undefined;
    public filters: IFilter[] = [];
    
    constructor( private service: MercadoLibreService ) { }
    
    ngOnDestroy(): void {
        if(this.subs) {
            this.subs.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.subs = this.service.loadFilter$.subscribe( filters => {
            this.filters = filters.filter( f => f.id === 'ITEM_CONDITION');            
            this.filters.forEach( f => {
                if( f.values && f.values.length > 0) {
                    f.values.forEach( v => {
                        v.checked = false;
                    })
                }
            });
        });


    }

    closeSidebar() {
        if( window.matchMedia("(max-width: 991px)").matches) {
            $('.sidebar-offcanvas').toggleClass('active')
        }
    }

    changeStatus(e: any) {
        this.checkFilter.emit(this.filters);
    }

}
