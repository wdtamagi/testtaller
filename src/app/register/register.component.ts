import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { AlertService } from '../login/alert.service';
import { UserService } from '../user/user.service';
import { AuthenticationService } from '../login/authentication.service';
import { PasswordValidation } from '../user/password-validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  loading = false;
	form: FormGroup;

  constructor(
		private router: Router,
		private userService: UserService,
		private authenticationService: AuthenticationService,
		private alertService: AlertService,
		private fb: FormBuilder) {
			this.form = fb.group({
				senha: ['', Validators.required],
				repeat: ['', Validators.required]
			}, {
				validator: PasswordValidation.MatchPassword
			})
		}

	ngOnInit() {
		if (localStorage.getItem('currentUser')) {
      this.model = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

	save() {
		if (this.model._id)
			this.update();
		else
			this.register();
	}

  register() {
		this.loading = true;
		this.userService.create(this.model)
			.subscribe(
				data => {
					this.alertService.success('Registro realizado com sucesso!', true);
					this.login();
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});
  }

	update() {
		this.loading = true;
		this.userService.update(this.model)
			.subscribe(
				data => {
					this.alertService.success('Registro atualizado com sucesso!', true);
					this.router.navigate(['/']);
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});
  }

	login() {
    this.authenticationService.login(this.model.email, this.model.senha)
      .subscribe(
        data => {
          this.router.navigate(['/']);
          if (localStorage.getItem('currentUser')) this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
