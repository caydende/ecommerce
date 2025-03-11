import { IProduct } from './../../shared/interfaces/iproduct';
import { CartService } from './../../core/services/cart/cart.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../../core/services/orders/orders.service';
import { ICart } from '../../shared/interfaces/icart';
import { Router } from '@angular/router';
import { SimilarProductsComponent } from '../../shared/components/business/similar-products/similar-products.component';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule, CurrencyPipe, DatePipe, SimilarProductsComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastrService = inject(ToastrService);
  private readonly ordersService = inject(OrdersService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  checkOutForm!: FormGroup;
  cartId = localStorage.getItem("cartId");
  
  shipingType: WritableSignal<boolean> = signal(false);
  paymentType: WritableSignal<boolean> = signal(false);
  gridcols: WritableSignal<number> = signal(2);
  currentDate: WritableSignal<Date> = signal(new Date());
  shipingDate: WritableSignal<Date> = signal(new Date());
  cartDetails: WritableSignal<ICart> = signal({} as ICart);
  showWarning: WritableSignal<boolean> = signal(false);

  shakeFields: { [key: string]: boolean } = {};
  colorFields: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.initForm();
    this.getUserCart();
    this.currentDate.set(new Date(this.currentDate().setDate(this.currentDate().getDate() + 2)));
  }

  updateShiping(type: string): void {
    this.shipingType.set(type === "priority");
  }

  updatePayment(type: string): void {
    this.paymentType.set(type === "card");
  }

  initForm(): void {
    this.checkOutForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern('01[0125][0-9]{8}')]],
      city: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (this.checkOutForm.valid) {
      if (this.paymentType()) {
        this.ordersService.checkOut(this.cartId!, this.checkOutForm.value).subscribe({
          next: (res) => {
            if (res.status === "success") {
              this.cartService.cartItemsNum.set(0)
              open(res.session.url, "_self");
            }
          }
        });
      } else {
        this.ordersService.cashOrder(this.cartId!, this.checkOutForm.value).subscribe({
          next: (res) => {
            if (res.status === "success") {
              this.cartService.cartItemsNum.set(0)
              this.router.navigate(["/home"]);
              this.toastrService.success("Your order has been successfully placed", "Fresh Cart");
            }
          }
        });
      }
    } else {
      this.toastrService.info("Please complete the form before submitting", "Fresh Cart");
    }
  }

  getUserCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateGridCols();
  }

  updateGridCols(): void {
    const width = window.innerWidth;
    this.gridcols.set(width >= 1024 ? 4 : width >= 768 ? 3 : 2);
  }

  checkError(field: string): void {
    if (this.checkOutForm.get(field)?.errors && this.checkOutForm.get(field)?.touched) {
      this.shakeFields[field] = true;
      this.colorFields[field] = true;
      this.showWarning.set(false);
      setTimeout(() => this.shakeFields[field] = false, 500);
      setTimeout(() => this.colorFields[field] = false, 1500);
    }
  }

  wrongInput(field: string, message: string): void {
    if (!this.showWarning()) {
      this.toastrService.warning(message, 'Fresh Cart');
      this.checkOutForm.get(field)?.markAsUntouched();
    }
  }
}
