import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, AlertController, ToastController, MenuController, Platform } from 'ionic-angular';

import { map, take, debounceTime } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
import { UsersFireService } from '../../providers/users-fire-service';

@IonicPage({
	name: 'page-auth',
	segment: 'auth',
	priority: 'high'
})

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html'
})
export class AuthPage implements OnInit {
  public onLoginForm: FormGroup;
  public onRegisterForm: FormGroup;
  auth: string = "login";

  constructor(
		private _fb: 					FormBuilder,
		public nav: 					NavController,
		public forgotCtrl: 		AlertController,
		public menu:					MenuController,
		public toastCtrl: 		ToastController,
		public afAuth: 				AngularFireAuth,
		private facebook: 		Facebook,
    private platform: 		Platform,
		private usersService: UsersFireService
	) {
		this.menu.swipeEnable(false);
		this.menu.enable(false);
  }

  ngOnInit() {
    this.onLoginForm = this._fb.group({
      'email': ['',
        [ Validators.required,Validators.email ]
      ],
      'password': ['', [
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(25)
			]]
    });

		this.onRegisterForm = this._fb.group({
		  'fullName': ['', Validators.compose([
		    Validators.required
		  ])],
			'email': ['',
				[ Validators.required,Validators.email ]
			],
			'password': ['', [
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(25)
			]]
		});
  }

  // go to register page
  // register() {
  //   this.nav.setRoot(RegisterPage);
  // }

	goToHome() {
		this.nav.setRoot('page-home');
	}

	loginFacebook() {
		if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return this.afAuth.auth
					.signInWithCredential(facebookCredential)
					.then(res => {
						this.usersService.saveUser({

						}).then(user => {
							this.goToHome();
						});
					})
					.catch(error => {
						console.error('Erro no login pelo facebook');
					});
      })
    } else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
					debugger;
					this.usersService.saveUser({
						uid: 					res.user.uid,
						displayName: 	res.user.displayName,
						email: 				res.user.email,
						photoUrl: 		res.user.photoURL
					}).then(user => {
						this.goToHome();
					});
				})
				.catch(error => {
					debugger;
					this.toast(error.message);
				});
    }
  }

  // login and go to home page
  login() {
    const form = this.onLoginForm;
		if (form.valid) {
			this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(form.value.email, form.value.password)
			.then(res => {
				this.goToHome();
			})
			.catch(error => {
				// show toast with error message
				this.toast(error.message);
			})
		}
  }

	signup() {
		const form = this.onRegisterForm;
		if (form.valid) {
			this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(form.value.email, form.value.password)
			.then(res => {
				this.usersService.saveUser({
					uid: 					res.user.uid,
					displayName: 	form.value.fullName,
					email: 				res.user.email,
				}).then(user => {
					// update user's displayName
					res.user.updateProfile({
						displayName: form.value.fullName
					});

					res.user.sendEmailVerification();
					this.goToHome();
				});
			})
			.catch(error => {
				// show toast with error message
				this.toast(error.message);
			})
		}
	}

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
						console.log(data);
						this.afAuth.auth.sendPasswordResetEmail(data.email)
							.then(() => {
								this.toast("Verifique seu email.");
							})
							.catch(error => {
								console.log(error);
								this.toast(error.message);
							});
          }
        }
      ]
    });
    forgot.present();
  }

	toast(message) {
		let toast = this.toastCtrl.create({
			message: 	message,
			duration: 3000,
			position: 'middle',
			cssClass: 'dark-trans',
			closeButtonText: 'OK',
			showCloseButton: true
		});
		toast.present();
	}

}
