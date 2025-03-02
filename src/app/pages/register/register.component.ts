import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, WritableSignal } from '@angular/core';
import {AbstractControl, FormControl, FormGroup , ReactiveFormsModule, Validators  } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule , CommonModule , RouterLink ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterComponent {

  private readonly  authService = inject(AuthService)
  private readonly router = inject(Router)
  readonly toastrService = inject(ToastrService)



  shakeFields: { [key: string]: boolean } = {};
  colorFields: { [key: string]: boolean } = {};
  showWarning:WritableSignal<boolean> = signal(false)

  checkError(field: string) {
    if (this.register.get(field)?.errors && this.register.get(field)?.touched) {
      this.shakeFields[field] = true;  
      this.colorFields[field] = true; 
      this.showWarning.set(false)
      setTimeout(() => this.shakeFields[field] = false, 500); 
      setTimeout(() => this.colorFields[field] = false, 1500); 
    }
  }



  register: FormGroup = new FormGroup({
    name:new FormControl(null , [Validators.required , Validators.minLength(3) , Validators.maxLength(20)]),
    email:new FormControl(null, [Validators.required , Validators.email]),
    password:new FormControl(null, [Validators.required , Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
    rePassword:new FormControl(null , [Validators.required ]),
    phone:new FormControl(null , [Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),
  } ,{validators : this.confirmPassword})

  submitForm(){
    if(this.register.valid ){
      this.authService.sendRegister(this.register.value).subscribe({
        next : (res) => {
          this.toastrService.success(res.message , "Fresh Cart")
          console.log(res);
          if(res.message === "success"){

            setTimeout(() => {
                this.router.navigate(["/login"])
            }, 1000);
          }
        },
  
      })
    }else{
      this.toastrService.warning("Please fill out this form correctly!!","Fresh Cart")
    }
  }

  confirmPassword( confPassword:AbstractControl){
    const password = confPassword.get("password")?.value
    const repassword = confPassword.get("rePassword")?.value  
    return password === repassword ? null : {mismatch:true}

  }

  wrongInput(field:string ,message:string):void{
    if(!this.showWarning()){
          this.toastrService.warning(message,'Fresh Cart')
          this.register.get(field)?.markAsUntouched(); 
    }

  }
}
