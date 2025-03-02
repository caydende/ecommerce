import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../core/services/auth/auth.service';
import { Component, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive,RouterLink,SweetAlert2Module],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly toastrService = inject(ToastrService)
  readonly  cartService = inject(CartService)

  isLogin = input<boolean>(true)

  ngOnInit(): void {
    if(this.isLogin()){
          this.cartService.getUserCart().subscribe({
      next:(res)=> {
        console.log(res)
        localStorage.setItem('cartId' , res.cartId)
        this.cartService.cartItemsNum.set(res.numOfCartItems)
      }
    })
    }

  }

  showAlert() {
    Swal.fire({
      title: "Are you sure you want to log-out?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Log out!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logged out!",
          text: "You have been successfully logged out",
          icon: "success",});
          this.authService.logOut()
          this.toastrService.success('Your account have been successfully Logged out','Fresh Cart')
      }
    });
  }



}
