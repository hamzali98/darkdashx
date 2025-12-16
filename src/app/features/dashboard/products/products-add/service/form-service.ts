import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { product } from '../../interface/product-interface';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  
  editing = signal(false);
  editingId = signal('');

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
    
  });

  patchFormData(formdata : product){
    this.editingId.set(formdata.id);
    this.productForm.patchValue({
      status : formdata.status,
      basic_info : {
        product_name: formdata.basic_info.product_name,
        product_category: formdata.basic_info.product_category,
        product_price: formdata.basic_info.product_price,
        product_company: formdata.basic_info.product_company,
      },
      detail_info: {
        product_expiry: formdata.detail_info.product_expiry,
        product_regno: formdata.detail_info.product_regno,
        product_mfg: formdata.detail_info.product_mfg,
        product_stock: formdata.detail_info.product_stock,
      }
    });
  }

  getForm() {
    return this.productForm;
  }

  resetForm(){
    this.productForm.reset();
  }
}
