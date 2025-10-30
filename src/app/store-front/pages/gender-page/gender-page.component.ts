import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';



@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )
  );



  productsResource = rxResource({
    params: () =>({gender: this.gender(), page: this.paginationService.currentPage() }),
    stream: () => {
      return this.productsService.getProducts({
        gender: this.gender(),
        offset: (this.paginationService.currentPage()-1) * 9,


      });
    }
  });

  //   productsResource = rxResource({
  //   params: () => ({ page: this.paginationService.currentPage()}),
  //   stream: () => {
  //     return this.productsService.getProducts({
  //       offset: (this.paginationService.currentPage()-1) * 12,
  //       limit: 12,
  //     });
  //   }
  // });

}
