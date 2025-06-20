import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, EMPTY, combineLatest, Subscription, tap, catchError, startWith, count, map, debounceTime, filter } from 'rxjs';

import { Product } from '../product.interface';
import { ProductService } from '../../services/product.service';
import { FavouriteService } from '../../services/favourite.service';
import { AsyncPipe, UpperCasePipe, SlicePipe, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    imports: [RouterLink, AsyncPipe, UpperCasePipe, SlicePipe, CurrencyPipe]
})
export class ProductListComponent implements OnInit {

  title: string = 'Products';
  selectedProduct: Product;

  products$: Observable<Product[]>;
  productsNumber$: Observable<number>;
  mostExpensiveProduct$: Observable<Product>;

  errorMessage;

  constructor(
    private productService: ProductService,
    private favouriteService: FavouriteService,
    private router: Router) {
  }

  loadMore() {
    this.productService.initProducts()
  }

  ngOnInit(): void {
    this.products$ = this
                      .productService
                      .products$;

    this.productsNumber$ = this
                            .products$
                            .pipe(
                              map(products => products.length),
                              startWith(0)
                            )

    this.mostExpensiveProduct$ = this
                                  .productService
                                  .mostExpensiveProduct$;
  }

  get favourites(): number {
    return this.favouriteService.getFavouritesNb();
  }

  // Pagination
  pageSize = 5;
  start = 0;
  end = this.pageSize;
  currentPage = 1;

  previousPage() {
    this.start -= this.pageSize;
    this.end -= this.pageSize;
    this.currentPage--;
    this.selectedProduct = null;
  }

  nextPage() {
    this.start += this.pageSize;
    this.end += this.pageSize;
    this.currentPage++;
    this.selectedProduct = null;
  }

  onSelect(product: Product) {
    this.selectedProduct = product;
    this.router.navigateByUrl('/products/' + product.id);
  }

  reset() {
    this.productService.resetList();
    this.router.navigateByUrl('/products'); // self navigation to force data update
  }

  resetPagination() {
    this.start = 0;
    this.end = this.pageSize;
    this.currentPage = 1;
  }
}
