import { WishlistService } from './../../core/services/wishlist/wishlist.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { ProductsService } from './../../core/services/products/products.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit, inject, WritableSignal } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { signal } from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CarouselModule, CurrencyPipe, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  gridcols: WritableSignal<number> = signal(2);
  gridcols2: WritableSignal<number> = signal(2);
  productDisplayMini: WritableSignal<IProduct[]> = signal([]);
  activeCategorySwap: WritableSignal<string> = signal('');
  userWishlist: WritableSignal<any[]> = signal([]);
  wishCondition: WritableSignal<{ [key: string]: boolean }> = signal({});
  products: WritableSignal<IProduct[]> = signal([]);
  addToCartLoader: WritableSignal<{ [key: string]: boolean }> = signal({});
  stars = new Array(5);
  halfStar(rating:number){
    rating = rating - Math.floor(rating)
    if(rating >= 0.5 ){
      return true
    }else{
      return false
    }
  }

  private readonly toastrService = inject(ToastrService);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router)
  

  getAllProductsData() {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.productsCategorySwap('All');
      },
    });
  }

  addProductToCart(id: string) {
    this.addToCartLoader.set({ [id]: true });
    this.cartService.addToCart(id).subscribe({
      next: (res) => {
        localStorage.setItem('cartId' , res.cartId)
        this.addToCartLoader.set({ [id]: false });
        this.toastrService.success(res.message, 'Trendify').onTap.subscribe(() => {
          this.router.navigate(['/cart'])});
        this.cartService.cartItemsNum.set(res.numOfCartItems);
      },
    });
  }

  getUserWishlist(): void {
    this.wishlistService.getUserWishlist().subscribe({
      next: (res) => {
        this.userWishlist.set(res.data.length === 0 ? ['placeHolder'] : res.data);
      },
    });
  }

  isInWishlist(prodId: string): boolean {
    return this.userWishlist().some((wish: { _id: string; }) => wish._id === prodId);
  }

  addToWishlist(prodId: string): void {
    this.wishCondition.set({ [prodId]: true });
    this.wishlistService.addToWishlist(prodId).subscribe({
      next: (res) => {
        this.getUserWishlist();
        this.wishCondition.set({ [prodId]: false });
        this.toastrService.success(res.message, 'Trendify').onTap.subscribe(() => {
          this.router.navigate(['/wishlist'])});;
      },
    });
  }

  removeFromWishlist(id: string) {
    this.wishCondition.set({ [id]: true });
    this.wishlistService.removeFromWishlist(id).subscribe({
      next: (res) => {
        this.getUserWishlist();
        this.wishCondition.set({ [id]: false });
        this.toastrService.success(res.message, 'Trendify');
      },
    });
  }

  getSpecificCategoryType(categoryName: string): void {
    this.productDisplayMini.set(
      this.products().filter((product: any) => product.category.name.includes(categoryName))
    );
  }

  productsCategorySwap(activeSwap: string): void {
    this.activeCategorySwap.set(activeSwap);
    if (activeSwap === 'All') activeSwap = '';
    this.gridcols2.set(activeSwap === 'Women' ? this.gridcols() * 2 : activeSwap === '' ? this.gridcols() + 6 : this.gridcols());
    this.getSpecificCategoryType(activeSwap);
  }

  ngOnInit(): void {
    this.updateGridCols();
    this.getAllProductsData();
    this.getUserWishlist();
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 4000,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-chevron-left main-color space text-2xl border-[#8B5E35] hover:scale-110 transition-all ease-in-out duration-500 "></i>',
      '<i class="border-[#8B5E35] fa fa-chevron-right hover:scale-110 transition-all ease-in-out duration-500 main-color text-2xl"></i>',
    ],
    responsive: {
      0: { items: 3, nav: false },
      768: { items: 5, nav: true },
      1024: { items: 6, nav: true },
      1200: { items: 8, nav: true },
    },
  };

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateGridCols();
  }

  updateGridCols(): void {
    const width = window.innerWidth;
    this.gridcols.set(
      width >= 1536 ? 6 :  
      width >= 1280 ? 5 :  
      width >= 1024 ? 4 : 
      width >= 768 ? 3 : 2 
    );
  }
}
