import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

import Swal from 'sweetalert2'
import { MercadoLibreService } from '../../services/mercado-libre.service';
import { ICategory, IFilter, IItems } from '../../interfaces/mercado-libre.interface';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild('search') searchBox!: SearchBarComponent;
    
    public categories: Array<ICategory> = [];
    public itemData: IItems | undefined = undefined;

    public val = {
        category: '',
        sort: '',
        search: '',
        filter: '',
        page: 0
    };        
    public buffFilter: IFilter[] = [];
    public loading = true;
            
    constructor(
        private service: MercadoLibreService
    ) { }

    ngAfterViewInit(): void {
        this.searchBox.value.subscribe( sr => {
            if(sr) {
                this.val.category = '';
                this.val.filter = '';
                this.val.page = 0;
                this.itemData = undefined;
                this.service.filter = [];
                this.getItems(this.val.page, sr, this.val.sort, this.val.category, this.val.filter);
                this.val.search = sr;
            }
        });
        this.searchBox.orderBy.subscribe(sort => {
            this.val.sort = sort;            
            if(this.itemData && this.itemData.results && this.itemData.results.length > 0 ){
                this.val.page = 0;
                this.getItems(this.val.page, this.val.search, this.val.sort, this.val.category, this.val.filter);
            }            
        });
    }

    ngOnInit(): void {
        this.openWait();
        console.log(111);
        if(this.categories.length <= 0) {
            this.loading = true;
            this.service.getCategories().subscribe((data: Array<ICategory>) => {
                console.log(333, this.itemData);
                this.categories = data;
                this.openWait(false);                    
                this.loading = false;
            },
            err => {
                this.openWait(false);
                this.loading = false;
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Ocurrio un error al obtener las categorías' });
            });
        }
    }

    openWait(view: boolean = true) {
        if(view === true) {
            Swal.fire({
                title: 'Espere por favor ...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
        } else {
            Swal.close();
        }
    }

    getItems(offset: number, q: string | null, sort: string | null, category: string | null, filters: string | null) {
        this.openWait();
        if(this.service.filter.length > 0) {
            this.buffFilter = [...this.service.filter];
        }
        this.service.filter = [];
        this.itemData = undefined;
        this.loading = true;
        this.service.getItems(offset, q, sort, category, filters).subscribe(            
            (data: IItems) => {
                this.itemData = data;
                this.service.filter = data.available_filters;

                if(!this.service.filter.find( f => f.id === 'ITEM_CONDITION')) {
                    this.service.filter = [...this.buffFilter];
                    data.available_filters = this.service.filter;
                }
                if(filters && filters !== '') {
                    data.available_filters.forEach( f => {
                        if(f.values && f.values.length > 0) {
                            f.values.forEach( v => {
                                if( filters.indexOf(`${f.id}=${ v.id }`) >= 0 ) { v.checked = true; }                                
                            })
                        }
                    });
                }                
                this.openWait(false);
                this.loading = false;
            },
            err => {
                this.val.search = '';
                this.searchBox.text = '';
                console.error(err);
                this.openWait(false);
                this.loading = false;
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Ocurrio un error al obtener las categorías' });
            }
        )
    }

    getItemCategories(category: string) {
        this.clearItems(true, category);
        this.getItems(this.val.page, null, this.val.sort, category, this.val.filter);
    }

    clearItems(clear: boolean, category: string = '') {        
        if(clear===true) {
            this.val.page = 0;
            this.val.category = category;
            this.val.search = '';
            this.searchBox.text = '';
            this.itemData = undefined;
            this.val.filter = '';
            this.service.filter = [];
        }
    }

    pageSelect(page: number) {
        this.getItems(page, this.val.search, this.val.sort, this.val.category, this.val.filter);
        this.val.page = page;
    }    

    checkFilter(filter: IFilter[]) {
        this.val.page = 0;
        this.val.filter = '';
        filter.forEach( f => {
            if(f.values && f.values.length > 0) {
                f.values.forEach( v => {
                    if(v.checked && v.checked === true) {
                        if(this.val.filter !== '') { this.val.filter += '&'; }
                        this.val.filter += `${f.id}=${v.id}`;
                    }
                });
            }
        });
        this.getItems(this.val.page, this.val.search, this.val.sort, this.val.category, this.val.filter);
    }
}
