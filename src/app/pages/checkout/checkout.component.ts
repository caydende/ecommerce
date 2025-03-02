import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../../core/services/orders/orders.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  private readonly formBuilder = inject(FormBuilder)
  private readonly toastrService = inject(ToastrService)
  private readonly ordersService = inject(OrdersService)
  checkOutForm!:FormGroup
  shakeFields: { [key: string]: boolean } = {};
  cartId = localStorage.getItem("cartId")

  ngOnInit(): void {
    this.inItForm()
  }

  
  inItForm():void{
    this.checkOutForm = this.formBuilder.group({
      details:[null , [Validators.required]],
      phone:[null , [Validators.required , Validators.pattern('01[0125][0-9]{8}')]],
      city:[null , [Validators.required]]
    })
  }

  checkError(field: string) {
    if (this.checkOutForm.get(field)?.errors && this.checkOutForm.get(field)?.touched) {
      this.shakeFields[field] = true;  // Add shake effect
      setTimeout(() => this.shakeFields[field] = false, 500); 
    }
  }
  submitForm():void{
    if(this.checkOutForm.valid){
      this.ordersService.checkOut(this.cartId ! , this.checkOutForm.value).subscribe({
        next:(res)=>{
          if(res.status === "success"){
            console.log(res)
            open(res.session.url , "_self")
          }
        }
      })
    }else{
      this.toastrService.info("Please complete the form before submite" , "Fresh Cart")
    }
  }
}
