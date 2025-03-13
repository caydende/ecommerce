import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {AbstractControl, FormControl, FormGroup , ReactiveFormsModule, Validators  } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule , CommonModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent implements OnInit{
  readonly toastrService = inject(ToastrService)
  private readonly  authService = inject(AuthService)
  private readonly router = inject(Router)
  gridcols = signal(2);
  shakeFields: { [key: string]: boolean } = {};
  colorFields: { [key: string]: boolean } = {};
  showWarning:WritableSignal<boolean> = signal(false)
  fieldTextType:WritableSignal<{ [key: string]: boolean }>  = signal({ '': false })


  ngOnInit(): void {
    this.updateGridCols()
  }

  changVisible(btn: string): void {
    this.fieldTextType.update(state => ({
      ...state,  
      [btn]: !state[btn] 
    }));
  }

  checkError(field: string) {
    if (this.login.get(field)?.errors && this.login.get(field)?.touched) {
      this.shakeFields[field] = true;
      this.colorFields[field] = true;
      this.showWarning.set(false)
      setTimeout(() => this.shakeFields[field] = false, 500);
      setTimeout(() => this.colorFields[field] = false, 1500);
    }
  }


  wrongInput(field:string ,message:string):void{
    if(!this.showWarning()){
          this.toastrService.warning(message,'Fresh Cart' )
          this.login.get(field)?.markAsUntouched();
    }
  }



  login: FormGroup = new FormGroup({
    email:new FormControl(null, [Validators.required , Validators.email]),
    password:new FormControl(null, [Validators.required , Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
  })

  submitForm(){
    if(this.login.valid){
      this.authService.sendLogin(this.login.value).subscribe({
        next : (res) => {
          this.toastrService.success(res.message , "Fresh Cart")
          console.log(res);
          if(res.message === "success"){

            setTimeout(() => {
                localStorage.setItem('authToken' , res.token)

                this.authService.saveUserData()

                this.router.navigate(["/home"])
            }, 1000);
          }
        },
      })
    }else{
            this.toastrService.warning("Please fill out this form correctly!!","Fresh Cart")
          }
  }


  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateGridCols();
  }

  updateGridCols(): void {
    const width = window.innerWidth;
    this.gridcols.set(width >= 1024 ? 4 : width >= 768 ? 3 : 2);
  }
}
