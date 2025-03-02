import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import {  SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe , RouterLink , SweetAlert2Module,],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)

  cartDetails:ICart  = {} as ICart
  removeToasterCount:number = 0
  ngOnInit(): void {
    this.getUserCart();
    


  }
  
    showAlert(confirmBtn:string,finishText:string, cond:boolean , prodId:string) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: confirmBtn
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: finishText,
            icon: "success"
          });if(cond){
            this.removeCartItem(prodId)
          }else if(!cond){
            this.clearCart()
          }
        }
      });
    }
  
    getUserCart(): void{
    this.cartService.getUserCart().subscribe({
      next:(res)=>{
        this.removeToasterCount = res.numOfCartItems
        console.log(res.data)
        this.cartDetails  = res.data;
      }
    })
  }
  removeCartItem(itemId:string): void{
    this.cartService.removeSpecificeProduct(itemId).subscribe({
      next:(res)=> {
        console.log(res)
        if(res.status === 'success'){
        this.toastrService.success("Item successfully removed" , "Fresh Cart")
        this.cartDetails = res.data
        this.cartService.cartItemsNum.update(value => value - 1)
        }

      },
    })
  }
  updateQuantity(updCount:number , id:string , mess:string ):void{
    this.cartService.updateQuantity(updCount , id).subscribe({
      next:(res)=> {
        console.log(res)
        if(this.removeToasterCount > res.numOfCartItems){
          this.toastrService.success(`Item successfully removed ` , "Fresh Cart")
          this.removeToasterCount = res.numOfCartItems
        }else{
          this.toastrService.success(`Item quantity successfully ${mess} ` , "Fresh Cart")
        }
        this.cartDetails = res.data
      },
    })
  }

  clearCart():void{
    
    this.cartService.clearCartItems().subscribe({
      next:(res)=>{
        if(res.message === "success"){
          this.cartDetails = {} as ICart
          this.cartService.cartItemsNum.set(0)
        }
      }
    })
  }

}
