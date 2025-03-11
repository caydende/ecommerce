import { Component, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ICategory } from '../../shared/interfaces/icategory';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../core/services/products/products.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, RouterLink, NgClass, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private readonly toastrService = inject(ToastrService);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  currentPage = signal(1);
  itemsPerPage = signal(8);
  gridcols = signal(2);
  productDisplayMini: WritableSignal<IProduct[]> = signal([]);
  activeCategorySwap = signal('');
  userWishlist: WritableSignal<any[]> = signal([]);
  wishCondition = signal<{ [key: string]: boolean }>({});
  products: WritableSignal<IProduct[]> = signal([]);
  categories: WritableSignal<ICategory[]> = signal([]);
  buttonClick = signal(false);
  buttonClick2 = signal(false);
  stars = new Array(5);
  addToCartLoader = signal<{ [key: string]: boolean }>({});

  ngOnInit(): void {
    this.updateGridCols();
    this.getAllProductsData();
    this.getUserWishlist();
  }
  

  get totalPages(): number {
    return Math.ceil(this.productDisplayMini().length / this.itemsPerPage());
  }

  paginatedProducts(): IProduct[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.productDisplayMini().slice(start, start + this.itemsPerPage());
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  updateValue(minPrice: number, maxPrice: number): void {
    if (Number.isNaN(maxPrice)) maxPrice = 6000;
    if (Number.isNaN(minPrice)) minPrice = 0;

    if (minPrice > maxPrice) {
      maxPrice = minPrice + 1;
      this.toastrService.warning('Please enter a valid price range!', 'Fresh Cart');
    } else if (maxPrice < minPrice) {
      minPrice = maxPrice - 1;
      this.toastrService.warning('Please enter a valid price range!', 'Fresh Cart');
    }

    this.productDisplayMini.set(this.products().filter(product => product.price >= minPrice && product.price <= maxPrice));
  }

  toggleButton(num?: number): void {
    if (num === 1) {
      this.buttonClick.set(!this.buttonClick());
    } else {
      this.buttonClick2.set(!this.buttonClick2());
    }
  }

  getAllProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.productsCategorySwap('All');
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
      }
    });
  }

  getUserWishlist(): void {
    this.wishlistService.getUserWishlist().subscribe({
      next: (res) => {
        this.userWishlist.set(res.data.length === 0 ? ['placeHolder'] : res.data);
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

  getSpecificCategoryType(categoryName: string): void {
    this.productDisplayMini.set(this.products().filter(product => product.category.name.includes(categoryName)));
  }

  productsCategorySwap(activeSwap: string): void {
    this.currentPage.set(1);
    this.activeCategorySwap.set(activeSwap);
    this.getSpecificCategoryType(activeSwap === 'All' ? '' : activeSwap);
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
