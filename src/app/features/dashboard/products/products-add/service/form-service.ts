import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  
  fB = inject(FormBuilder);

  productForm = this.fB.group({
    status : [false],
    basic_info: this.fB.group({
      product_name: ['', Validators.required],
      product_category: ['', Validators.required],
      product_price: [''],
      product_company: ['', Validators.required],
    }),
    detail_info: this.fB.group({
      product_expiry: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      product_regno: ['', Validators.required],
      product_mfg: ['', Validators.required],
      product_stock: ['', Validators.required],
    }),
    
  })

  getForm() {
    return this.productForm;
  }

  resetForm(){
    this.productForm.reset();
  }
}
