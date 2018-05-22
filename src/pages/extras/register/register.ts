import {Component, OnInit} from "@angular/core";
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {IonicPage, NavController, MenuController} from "ionic-angular";

@IonicPage({
  name: 'page-register',
  segment: 'extras/register'
})

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

  constructor(private _fb: FormBuilder, public nav: NavController, public menu: MenuController,) {
    this.menu.swipeEnable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this._fb.group({
      fullName: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  // register and go to home page
  register() {
    this.nav.setRoot('page-custom-pages');
  }

  // go to login page
  login() {
    this.nav.setRoot('page-login-list');
  }
}
