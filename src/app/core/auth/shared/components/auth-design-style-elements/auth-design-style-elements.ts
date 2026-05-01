import { Component } from '@angular/core';
import { AuthDesignStyleElements2 } from "../auth-design-style-elements2/auth-design-style-elements2";
import { NgTemplateOutlet } from '@angular/common';
import { AuthDesignStyleElements1 } from "../auth-design-style-elements1/auth-design-style-elements1";

@Component({
  selector: 'app-auth-design-style-elements',
  imports: [AuthDesignStyleElements2, AuthDesignStyleElements1],
  templateUrl: './auth-design-style-elements.html',
  styleUrl: './auth-design-style-elements.css',
})
export class AuthDesignStyleElements {

}
