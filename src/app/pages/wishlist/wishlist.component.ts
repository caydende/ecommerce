import { Component, inject, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  userWishlist: WritableSignal<any[]> = signal([]);
  wishCondition = signal<{ [key: string]: boolean }>({});
  products: WritableSignal<IProduct[]> = signal([]);
  addToCartLoader = signal<{ [key: string]: boolean }>({});
  stars = new Array(5);

  ngOnInit(): void {
    this.getUserWishlist();
  }

  halfstar(rating: number): boolean {
    return rating - Math.floor(rating) >= 0.5;
  }

  addProductToCart(id: string): void {
    this.addToCartLoader.set({ ...this.addToCartLoader(), [id]: true });
    this.cartService.addToCart(id).subscribe({
      next: (res) => {
        localStorage.setItem('cartId' , res.cartId)
        this.addToCartLoader.set({ ...this.addToCartLoader(), [id]: false });
        this.toastrService.success(res.message, 'Trendify').onTap.subscribe(() => {
          this.router.navigate(['/cart'])});;
        this.cartService.cartItemsNum.set(res.numOfCartItems);
      }
    });
  }

  getUserWishlist(): void {
    this.wishlistService.getUserWishlist().subscribe({
      next: (res) => {
        const wishlistData = res.data.length === 0 ? ['placeHolder'] : res.data;
        this.userWishlist.set(wishlistData);
        this.products.set(res.data);
      }
    });
  }

  isInWishlist(prodId: string): boolean {
    return this.userWishlist().some(wish => wish._id === prodId);
  }

  addToWishlist(prodId: string): void {
    this.wishCondition.set({ ...this.wishCondition(), [prodId]: true });
    this.wishlistService.addToWishlist(prodId).subscribe({
      next: (res) => {
        this.getUserWishlist();
        this.wishCondition.set({ ...this.wishCondition(), [prodId]: false });
        this.toastrService.success(res.message, 'Trendify');
      }
    });
  }

  removeFromWishlist(id: string): void {
    this.wishCondition.set({ ...this.wishCondition(), [id]: true });
    this.wishlistService.removeFromWishlist(id).subscribe({
      next: (res) => {
        this.getUserWishlist();
        this.wishCondition.set({ ...this.wishCondition(), [id]: false });
        this.toastrService.success(res.message, 'Trendify');
      }
    });
  }
}
