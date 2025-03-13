import { Component, HostListener, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';
import { ProductsService } from '../../../../core/services/products/products.service';
import { IProduct } from '../../../interfaces/iproduct';
import { ICart } from '../../../interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-similar-products',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './similar-products.component.html',
  styleUrl: './similar-products.component.scss'
})
export class SimilarProductsComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);

  products: WritableSignal<IProduct[]> = signal([]);
  cartDetails: WritableSignal<ICart> = signal({} as ICart);
  userWishlist: WritableSignal<any[]> = signal([]);
  wishCondition = signal<{ [key: string]: boolean }>({});
  addToCartLoader = signal<{ [key: string]: boolean }>({});
  gridCols = signal<number>(2);
  stars = new Array(5);

  ngOnInit(): void {
    this.getUserCart();
    this.getAllProductsData();
    this.updateGridCols();
    this.getUserWishlist();
  }

  getUserCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
      }
    });
  }

  getAllProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
      }
    });
  }

  addProductToCart(id: string): void {
    this.addToCartLoader.set({ ...this.addToCartLoader(), [id]: true });
    this.cartService.addToCart(id).subscribe({
      next: (res) => {
        localStorage.setItem('cartId' , res.cartId)
        this.addToCartLoader.set({ ...this.addToCartLoader(), [id]: false });
        this.toastrService.success(res.message, 'Fresh Cart');
        this.cartService.cartItemsNum.set(res.numOfCartItems);
        this.cartDetails.set(res.data);
      }
    });
  }

  getUserWishlist(): void {
    this.wishlistService.getUserWishlist().subscribe({
      next: (res) => {
        const wishlistData = res.data.length === 0 ? ['placeHolder'] : res.data;
        this.userWishlist.set(wishlistData);
      }
    });
  }

  isInWishlist(prodId: string): boolean {
    return this.userWishlist().some((wish) => wish._id === prodId);
  }

  addToWishlist(prodId: string): void {
    this.wishCondition.set({ ...this.wishCondition(), [prodId]: true });
    this.wishlistService.addToWishlist(prodId).subscribe({
      next: (res) => {
        this.getUserWishlist();
        this.wishCondition.set({ ...this.wishCondition(), [prodId]: false });
        this.toastrService.success(res.message, 'Fresh Cart');
      }
    });
  }

  removeFromWishlist(id: string): void {
    this.wishCondition.set({ ...this.wishCondition(), [id]: true });
    this.wishlistService.removeFromWishlist(id).subscribe({
      next: (res) => {
        this.getUserWishlist();
        this.wishCondition.set({ ...this.wishCondition(), [id]: false });
        this.toastrService.success(res.message, 'Fresh Cart');
      }
    });
  }

  halfstar(rating: number): boolean {
    return rating - Math.floor(rating) >= 0.5;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateGridCols();
  }

  updateGridCols(): void {
    const width = window.innerWidth;
    this.gridCols.set(
      width >= 1536 ? 6 :  // 2xl (1536px and above)
      width >= 1280 ? 5 :  // xl (1280px and above)
      width >= 1024 ? 4 :  // lg (1024px and above)
      width >= 768 ? 3 : 2 // md (768px and above), otherwise 2
    );
  }
}
