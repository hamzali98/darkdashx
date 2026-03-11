import { CustomInputConfig } from "@app/shared/components/generic-input/generic-input";

export class ProfileConfig {

    usernameInputConfig: CustomInputConfig = {
        ngclass: '',
        label: 'USERNAME',
        labelFor: 'username',
        type: 'text',
        inputId: 'username',
        inputName: 'username',
        errorMessage: '',
        placeholder: 'USERNAME',
        required: true,
    }
    emailInputConfig: CustomInputConfig = {
        ngclass: '',
        label: 'EMAIL',
        labelFor: 'email',
        type: 'email',
        inputId: 'email',
        inputName: 'email',
        errorMessage: '',
        placeholder: 'EMAIL',
        required: true,
    }
}