import { ProductsService } from './../../core/services/products/products.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SimilarProductsComponent } from '../../shared/components/business/similar-products/similar-products.component';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, DatePipe, SimilarProductsComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  private readonly toastrService = inject(ToastrService);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly activatedRoute = inject(ActivatedRoute);

  itemsNumber: WritableSignal<number> = signal(1);
  detailsProd: WritableSignal<IProduct> = signal({} as IProduct);
  mainImg: WritableSignal<string> = signal('');
  userWishlist: WritableSignal<any[]> = signal([]);
  wishCondition: WritableSignal<{ [key: string]: boolean }> = signal({});
  products: WritableSignal<IProduct[]> = signal([]);
  imgChangeNumber: WritableSignal<number> = signal(0);
  currentDate: WritableSignal<Date> = signal(new Date());
  shippingDate: WritableSignal<Date> = signal(new Date());
  addToCartLoader: WritableSignal<{ [key: string]: boolean }> = signal({});
  stars = new Array(5);

  ngOnInit(): void {
    this.currentDate.set(new Date(this.currentDate().setDate(this.currentDate().getDate() + 2)));
    this.getUserWishlist();
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        
        const prodId = params.get('id');
        if (prodId) {
          this.productsService.getSpecificProduct(prodId).subscribe({
            next: (res) => {
              this.detailsProd.set(res.data);
              this.mainImg.set(res.data?.imageCover);
            }
          });
        }
      }
    });
  }

  changeImgUrl(imgUrl: string): void {
    this.mainImg.set(imgUrl);
  }changeImgUrl2():void{
    if(this.imgChangeNumber() == 3){
      this.imgChangeNumber.set(0)
    }
    this.imgChangeNumber.update((value) =>value+1)
    this.mainImg.set(this.detailsProd().images[this.imgChangeNumber()])
  }


  addProductToCart(id: string, addedNumber: number): void {
    if (addedNumber < 1) addedNumber = 1;
    if (addedNumber > 1) addedNumber += 1;

    this.addToCartLoader.set({ [id]: true });
    this.cartService.addToCart(id).subscribe({
      next: (res) => {
        localStorage.setItem('cartId' , res.cartId)
        this.cartService.updateQuantity(addedNumber, id).subscribe();
        this.addToCartLoader.set({ [id]: false });
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
    return this.userWishlist().some((wish) => wish._id === prodId);
  }

  addToWishlist(prodId: string): void {
    this.wishCondition.set({ [prodId]: true });
    this.wishlistService.addToWishlist(prodId).subscribe({
      next: (res) => {
        this.getUserWishlist();
        this.wishCondition.set({ [prodId]: false });
        this.toastrService.success(res.message, 'Fresh Cart');
      }
    });
  }

  removeFromWishlist(id: string): void {
    this.wishCondition.set({ [id]: true });
    this.wishlistService.removeFromWishlist(id).subscribe({
      next: (res) => {
        this.getUserWishlist();
        this.wishCondition.set({ [id]: false });
        this.toastrService.success(res.message, 'Fresh Cart');
      }
    });
  }

  updateQuantity(increase: boolean): void {
    if (increase) {
      if (this.itemsNumber() < this.detailsProd()?.quantity!) {
        this.itemsNumber.set(this.itemsNumber() + 1);
      } else {
        this.toastrService.warning(
          `We only have ${this.detailsProd()?.quantity} of this product`,
          'Fresh Cart'
        );
      }
    } else {
      if (this.itemsNumber() > 1) {
        this.itemsNumber.set(this.itemsNumber() - 1);
      } else {
        this.toastrService.warning("You can't go below one", 'Fresh Cart');
      }
    }
  }
}
