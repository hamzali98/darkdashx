import { inject } from "@angular/core";
import { CustomInputConfig } from "@app/shared/components/generic-input/generic-input";
import { ListService } from "@app/shared/services/list-service/list-service";


export class InputConfigs {

    private listService = inject(ListService);

    productNameConfig: CustomInputConfig = {
        ngclass: 'pt-0 border-b border-b-gray-500/20',
        type: 'text',
        required: true,
        label: 'PRODUCT_NAME',
        labelFor: 'productname',
        labelIcon: 'assets/icons/white/product.svg',       // asset path e.g. 'assets/icons/white/password.svg'
        placeholder: 'EPN',
        inputId: 'productname',
        inputName: 'productname',
        errorMessage: 'PNR',
        hintMessage: 'EPN',
    };

    productCategoryConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-b-gray-500/20',
        type: 'select',
        required: true,
        label: 'CATEGORY',
        labelFor: 'category',
        labelIcon: 'assets/icons/white/category.svg',
        placeholder: 'SCAT',
        inputId: 'category',
        inputName: 'category',
        errorMessage: 'CATR',
        hintMessage: 'SCAT',
        selectOptions: this.listService.getProductList(),
    }

    productCompanyConfig: CustomInputConfig = {
        ngclass: 'pt-6',
        type: 'select',
        required: true,
        label: 'COMPANY',
        labelFor: 'company',
        labelIcon: 'assets/icons/white/bag.svg',
        placeholder: 'SCMP',
        inputId: 'company',
        inputName: 'company',
        errorMessage: 'CMP',
        hintMessage: 'SCMP',
        selectOptions: this.listService.getCompanyList(),
    }

}