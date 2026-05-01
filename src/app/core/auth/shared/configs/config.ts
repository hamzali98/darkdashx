import { CustomInputConfig } from "@app/shared/components/generic-input/generic-input";

export class AuthInputConfigs {

    loginEmail: CustomInputConfig = {
        ngclass: 'py-1 pt-2 lg:pt-6   ',
        type: 'email',
        required: true,
        autocomplete: 'username',
        label: 'Email',
        labelFor: 'email',
        labelIcon: 'assets/icons/white/email.svg',       // asset path e.g. 'assets/icons/white/password.svg'
        placeholder: 'ENTER_EMAIL',
        inputId: 'email',
        inputName: 'email',
        errorMessage: 'EMAIL_REQUIRED!',
    }

    loginPassword: CustomInputConfig = {
        ngclass: 'py-1 pt-2 lg:pt-6   ',
        type: 'password',
        required: true,
        autocomplete: 'current-password',
        label: 'PASSWORD',
        labelFor: 'password',
        labelIcon: 'assets/icons/white/password.svg',       // asset path e.g. 'assets/icons/white/password.svg'
        placeholder: 'ENTER_PASSWORD',
        inputId: 'password',
        inputName: 'password',
        errorMessage: 'Password Required!',
    }
    userName: CustomInputConfig = {
        ngclass: 'py-1 pt-2 lg:pt-6   ',
        type: 'text',
        required: true,
        autocomplete: 'username',
        label: 'USERNAME',
        labelFor: 'username',
        labelIcon: 'assets/icons/white/usericon.svg',       // asset path e.g. 'assets/icons/white/password.svg'
        placeholder: 'Enter username',
        inputId: 'username',
        inputName: 'username',
        errorMessage: 'Username Required!',
        errorMessage2: 'Username should be between 6 to 15 characters',
    }

    email: CustomInputConfig = {
        ngclass: 'py-1 pt-2 lg:pt-6   ',
        type: 'email',
        required: true,
        autocomplete: 'email',
        label: 'Email',
        labelFor: 'email',
        labelIcon: 'assets/icons/white/email.svg',       // asset path e.g. 'assets/icons/white/password.svg'
        placeholder: 'ENTER_EMAIL',
        inputId: 'email',
        inputName: 'email',
        errorMessage: 'EMAIL_REQUIRED!',
        errorMessage2: 'EMAIL_INVALID!',
    }
    password: CustomInputConfig = {
        ngclass: 'py-1 pt-2 lg:pt-6   ',
        type: 'password',
        required: true,
        showStrength: true,
        autocomplete: 'current-password',
        label: 'PASSWORD',
        labelFor: 'password',
        labelIcon: 'assets/icons/white/password.svg',       // asset path e.g. 'assets/icons/white/password.svg'
        placeholder: 'ENTER_PASSWORD',
        inputId: 'password',
        inputName: 'password',
        errorMessage: 'Password Required!',
    }
    confirmPassword: CustomInputConfig = {
        ngclass: 'py-1 pt-2 lg:pt-6',
        type: 'password',
        required: true,
        autocomplete: 'current-password',
        label: 'Confirm Password',
        labelFor: 'cpassword',
        labelIcon: 'assets/icons/white/cpass.svg',       // asset path e.g. 'assets/icons/white/password.svg'
        placeholder: 'Re-enter Password',
        inputId: 'cpassword',
        inputName: 'cpassword',
        errorMessage: 'Password for confirmation Required!',
        errorMessage2: 'Password not matched',
    }

    rememberMe: CustomInputConfig = {
        ngclass: '',
        label:'REMEMBER_ME',
        labelFor: 'remember',
        type: 'checkbox',
        inputId: 'remember',
        inputName: 'remember',
        errorMessage: '',

    }
}