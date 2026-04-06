import { inject } from "@angular/core";
import { CustomInputConfig } from "@app/shared/components/generic-input/generic-input";
import { ListService } from "@app/shared/services/list-service/list-service";


export class InputConfigs {

    private listService = inject(ListService);

    productNameConfig: CustomInputConfig = {
        ngclass: 'pt-0 border-b border-border/20',
        type: 'text',
        required: true,
        label: 'PRODUCT_NAME',
        labelFor: 'productname',
        labelIcon: 'assets/icons/white/product.svg',       // asset path e.g. 'assets/icons/white/password.svg'
        placeholder: 'EPN',
        inputId: 'productname',
        inputName: 'productname',
        errorMessage: 'PNR',
    };

    productCategoryConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-border/20',
        type: 'select',
        required: true,
        label: 'CATEGORY',
        labelFor: 'category',
        labelIcon: 'assets/icons/white/category.svg',
        placeholder: 'SCAT',
        inputId: 'category',
        inputName: 'category',
        errorMessage: 'CATR',
        selectOptions: this.listService.getProductList(),
    };

    productPriceConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-border/20',
        type: 'number',
        required: true,
        label: 'PRICE',
        labelFor: 'price',
        labelIcon: 'assets/icons/white/dollar.svg',
        placeholder: 'EPRC',
        inputId: 'price',
        inputName: 'price',
        errorMessage: 'PRC',
        min: 1,
        max: 9999,
        step: 0.5,
    };

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
        selectOptions: this.listService.getCompanyList(),
    };

    productExpiryConfig: CustomInputConfig = {
        ngclass: 'pt-0 border-b border-border/20',
        type: 'date',
        required: true,
        label: 'EXPIRY',
        labelFor: 'productexpiry',
        labelIcon: 'assets/icons/white/expiry.svg',
        placeholder: 'SEXP',
        inputId: 'productexpiry',
        inputName: 'productexpiry',
        errorMessage: 'EXP',
        minDate: new Date().toISOString().split('T')[0],
    };

    productRegConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-border/20',
        type: 'text',
        required: true,
        label: 'REG_NO',
        labelFor: 'regno',
        labelIcon: 'assets/icons/white/regno.svg',
        placeholder: 'EREG',
        inputId: 'regno',
        inputName: 'regno',
        errorMessage: 'REG',
    };

    productMfgConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-border/20',
        type: 'date',
        required: true,
        label: 'MFG',
        labelFor: 'mfg',
        labelIcon: 'assets/icons/white/mfg.svg',
        placeholder: 'SMFG',
        inputId: 'mfg',
        inputName: 'mfg',
        errorMessage: 'MFGR',
        minDate: '2023-01-01',
    }

    productStockConfig: CustomInputConfig = {
        ngclass: 'pt-6',
        type: 'number',
        required: true,
        label: 'STOCK',
        labelFor: 'stock',
        labelIcon: 'assets/icons/white/stock.svg',
        placeholder: 'ESTK',
        inputId: 'stock',
        inputName: 'stock',
        errorMessage: 'STK',
        min: 0,
        max: 9999,
    }

}