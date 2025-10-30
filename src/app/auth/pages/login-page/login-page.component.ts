import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '@auth/services/auth.services';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  fb = inject(FormBuilder);

  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

  loginForm = this.fb.group(
    {
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
    }
  )

   onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;

    //console.log({email,password});

    // this.authService.login(email!, password!).subscribe( resp =>{
    //     console.log(resp);
    // });

    this.authService.login(email!, password!).subscribe((isAuthenticated) =>{
      if (isAuthenticated){
        this.router.navigateByUrl('/');
        return;

      }
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);

    });



  }


 }
