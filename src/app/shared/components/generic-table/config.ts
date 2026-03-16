import { CustomInputConfig } from "../generic-input/generic-input";

export class GenericTableInputConfigs {

    masterCheckbox : CustomInputConfig = {
        ngclass: '', 
        type: 'checkbox', 
        inputId: 'masterchkbox', 
        inputName: 'masterchkbox', 
        errorMessage: '',
    }
    rowCheckbox : CustomInputConfig = {
        ngclass: '', 
        type: 'checkbox', 
        inputId: 'childchkbox', 
        inputName: 'childchkbox', 
        errorMessage: '',
    }
}