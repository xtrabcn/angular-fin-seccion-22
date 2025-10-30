import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/interfaces/product.interface';
import { FormUtils } from '@utils/form-utis';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();

  router = inject(Router);
  fb = inject(FormBuilder);

  productsService = inject(ProductsService);

  wasSaved = signal(false);

  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  imagesToCarousel = computed(()=> {
    const currentProductImages = [...this.product().images, ...this.tempImages()];
    return currentProductImages;
  });


  productForm = this .fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes:[['']],
    images:[[]],
    tags: [''],
    gender:['men',  [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  sizes = ['XS', 'S', 'M', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue( formLike: Partial<Product>){
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',')});
    // this.productForm.patchValue(formLike as any);
  }

  onSizeClicked(size: string){

    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)){
      currentSizes.splice(currentSizes.indexOf(size),1);
    }else{
      currentSizes.push(size);
    }

    this.productForm.patchValue({sizes: currentSizes});

  }

  async onSubmit(){
    const isValid = this.productForm.valid;

    if (!isValid) return;
    // console.log(this.productForm.value, {isValid});

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags
        ?.toLowerCase()
        .split(',')
        .map((tag)=>tag.trim()) ?? [],
    }

    // console.log({productLike});

    if (this.product().id==="new"){
      const product = await firstValueFrom(
        //creando un observable y ya hace directamente la subscripcion y lo hace con el submit en async
        this.productsService.createProduct(productLike,this.imageFileList)
      );

      this.router.navigate(['/admin/product',product.id]);

      // this.productsService.createProduct(productLike).subscribe(
      //   product => {
      //     console.log('Producto creado');
      //     this.router.navigate(['/admin/product',product.id]);

      //     this.wasSaved.set(true);
      //   }
      // );
    }else{
       await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      );

      // Modificado al usar firstValeuForm
      // this.productsService
      //   .updateProduct(this.product().id, productLike)
      //   .subscribe(
      //     product => {
      //       console.log('Producto actualizado');
      //     }
      //   );
    }

    this.wasSaved.set(true);
    setTimeout(() =>{
      this.wasSaved.set(false);
    }, 3000);
  }

  onFilesChanged(event: Event){
    const fileList = (event.target as HTMLInputElement).files;
    // this.tempImages.set([]);
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from (fileList ?? [] ).map(
      file => URL.createObjectURL(file)
    );
    // console.log(fileList);
    console.log(imageUrls);

    this.tempImages.set(imageUrls);
  }
 }
