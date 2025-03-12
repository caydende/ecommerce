import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService)
  step = 3;

  shakeFields: { [key: string]: boolean } = {};
  colorFields: { [key: string]: boolean } = {};
  showWarning:WritableSignal<boolean> = signal(false)
  fieldTextType:WritableSignal<{ [key: string]: boolean }>  = signal({ '': false })


  changVisible(btn: string): void {
    this.fieldTextType.update(state => ({
      ...state,  
      [btn]: !state[btn] 
    }));
  }

  wrongInput(field:string ,message:string):void{
    if(!this.showWarning()){
          this.toastrService.warning(message,'Fresh Cart')
          if(this.step === 1){
            this.verifyEmail.get(field)?.markAsUntouched(); 
          }else if(this.step === 2){
            this.verifyCode.get(field)?.markAsUntouched(); 
          }else{
            this.resetPassword.get(field)?.markAsUntouched(); 
          }

    }
  }



  verifyEmail: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)])
  });

  resetPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    ])
  });


  verifyEmailSub(): void {
    let emailVal = this.verifyEmail.get("email")?.value
    this.resetPassword.get("email")?.patchValue(emailVal)
    if (this.verifyEmail.valid) {
      this.authService.forgotVerifyEmail(this.verifyEmail.value).subscribe({
        next: (res: any) => {

          console.log(res);
          if (res.statusMsg === 'success') {          
            this.toastrService.success("A code is sent to Your email " , "Fresh Cart")
            this.step = 2;
          }
        },
      });
    }
  }

  verifyCodeSub(): void {
    if (this.verifyCode.valid) {
      this.authService.forgotVerifyCode(this.verifyCode.value).subscribe({
        next: (res: any) => {

          console.log(res);
          if (res.status === 'Success') {          
            this.toastrService.success("Your code has been successfully verified" , "Fresh Cart")
            this.step = 3;
          }
        },
        error: (err) => console.log(err)
      });
    }
  }

  newPasswordSub(): void {
    if (this.resetPassword.valid) {
      this.authService.resetPassword(this.resetPassword.value).subscribe({
        next: (res: any) => {
          this.toastrService.success("Your password has been successfully changed"  , "Fresh Cart")
            console.log(res);
            localStorage.setItem('authToken', res.token);
            this.authService.saveUserData();
            this.router.navigate(['/home']);
        },
      });
    }
  }

  checkError(field: string) {
    const formControls = [this.verifyEmail, this.verifyCode, this.resetPassword];
    const hasError = formControls.some(form => form.get(field)?.errors && form.get(field)?.touched);

    if (hasError) {
      this.shakeFields[field] = true;  
      this.colorFields[field] = true; 
      this.showWarning.set(false)
      setTimeout(() => this.shakeFields[field] = false, 500); 
      setTimeout(() => this.colorFields[field] = false, 1500); 
    }
  }
}
