import { Component, HostListener, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { IProduct } from '../../shared/interfaces/iproduct';
import { SimilarProductsComponent } from "../../shared/components/business/similar-products/similar-products.component";

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, SweetAlert2Module, DatePipe, SimilarProductsComponent, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  products: WritableSignal<IProduct[]> = signal([]);
  gridcols: WritableSignal<number> = signal(2);
  currentDate: WritableSignal<Date> = signal(new Date());
  cartDetails: WritableSignal<ICart> = signal({} as ICart);
  removeToasterCount: WritableSignal<number> = signal(0);

  ngOnInit(): void {
    this.getUserCart();
    this.currentDate.set(new Date(this.currentDate().setDate(this.currentDate().getDate() + 2)));
  }

  showAlert(confirmBtn: string, finishText: string, cond: boolean, prodId: string) {
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
        });
        cond ? this.removeCartItem(prodId) : this.clearCart();
      }
    });
  }

  getUserCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.removeToasterCount.set(res.numOfCartItems);
        this.cartDetails.set(res.data);
      }
    });
  }

  removeCartItem(itemId: string): void {
    this.cartService.removeSpecificeProduct(itemId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success("Item successfully removed", "Fresh Cart");
          this.cartDetails.set(res.data);
          this.cartService.cartItemsNum.update(value => value - 1);
        }
      }
    });
  }

  updateQuantity(updCount: number, id: string, mess: string): void {
    this.cartService.updateQuantity(updCount, id).subscribe({
      next: (res) => {
        if (this.removeToasterCount() > res.numOfCartItems) {
          this.toastrService.success(`Item successfully removed`, "Fresh Cart");
          this.removeToasterCount.set(res.numOfCartItems);
        } else {
          this.toastrService.success(`Item quantity successfully ${mess}`, "Fresh Cart");
        }
        this.cartDetails.set(res.data);
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCartItems().subscribe({
      next: (res) => {
        if (res.message === "success") {
          this.cartDetails.set({} as ICart);
          this.cartService.cartItemsNum.set(0);
        }
      }
    });
  }
}
