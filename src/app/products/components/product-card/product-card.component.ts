import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {

  product = input.required<Product>();

  imageUrl = computed(()=>{
    // if (this.product().images.length=== 0){
    //   return PlaceHolderImage
    // }
    return `http://localhost:3000/api/files/product/${ this.product().images[0]}`;
  });

}
