import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

loginForm : FormGroup;

constructor(){
  this.loginForm = new FormGroup({
    email : new FormControl("", Validators.required),
    password : new FormControl("", Validators.required),
  });
  this.loginForm.markAllAsTouched();
}

get email (){
  return this.loginForm.get("email");
}

get password () {
  return this.loginForm.get("password")
}

onLoginSubmit(){
  
}

}
