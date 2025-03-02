import { WishlistService } from './../../core/services/wishlist/wishlist.service';
import { CurrencyPipe } from '@angular/common';
import { CategoriesService } from './../../core/services/categories/categories.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductsService } from './../../core/services/products/products.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, inject, input, OnInit, PLATFORM_ID } from '@angular/core';
import { ICategory } from '../../shared/interfaces/icategory';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  imports: [RouterLink , CarouselModule,CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit{
  userWishlist:any[] = []
  wishCondtion: { [key: string]: boolean } = {}
  gridcols = 2

  stars = new Array(5)
  addToCartLoader:{ [key: string]: boolean} ={ }
  halfstar(rating:number){
    rating = rating - Math.floor(rating)
    if(rating >= 0.5 ){
      return true
    }else{
      return false
    }
  }
  private readonly toastrService = inject(ToastrService)
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  products:IProduct[] = []
  categories:ICategory[] = []

  getAllCategoriesData(){
    this.categoriesService.getAllCategories().subscribe(
      {
        next: (res)=> {
          this.categories = res.data
          console.log(res.data)
        },
        error: (err)=> {
          console.log(err)
        }
      }
    )
  }


  getAllProductsData(){
    this.productsService.getAllProducts().subscribe(
      {
        next: (res)=> {
          this.products = res.data
        },
        error: (err)=> {
          console.log(err)
        }
      }
    )
  }
  addProductToCart(id:string){
    this.addToCartLoader = {[id] : true}
    this.cartService.addToCart(id).subscribe({
      next:(res)=>{
        this.addToCartLoader = {[id] : false}
        this.toastrService.success(res.message , "Fresh Cart")
        this.cartService.cartItemsNum.set(res.numOfCartItems)
        console.log(res)
      }
    })
  }

  getUserWishlist():void{
    this.wishlistService.getUserWishlist().subscribe({
      next:(res)=>{
        if(res.data.length === 0){
          this.userWishlist = ['placeHolder']
        }else{
          this.userWishlist = res.data
        }

        console.log(res.data)
      }
    })
  }

  isInWishlist(prodId: string): boolean {
    return this.userWishlist.some(wish => wish._id === prodId);
  }

  addToWishlist(prodId:string):void{
    this.wishCondtion = {[prodId] : true}
    this.wishlistService.addToWishlist(prodId).subscribe({
      next:(res)=>{
        this.getUserWishlist()
        this.wishCondtion = {[prodId] : false}
        console.log(this.wishCondtion)
        this.toastrService.success(res.message , "Fresh Cart")
      }
    })
  }
  removeFromWishlist(id:string){
    this.wishCondtion = {[id] : true}
    this.wishlistService.removeFromWishlist(id).subscribe({
      next:(res)=>{
        this.getUserWishlist()
        this.wishCondtion = {[id] : false}
        this.toastrService.success(res.message , "Fresh Cart")
      }
    })
  }

  ngOnInit(): void {
    this.updateGridCols();
    this.getAllProductsData();
    this.getAllCategoriesData();
    this.getUserWishlist();
  }


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay:true,
    autoplayHoverPause:true,
    autoplayTimeout:4000,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa fa-chevron-left main-color"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {

      400: {
        items: 4
      },

      940: {
        items: 6
      },
      1200:{
        items:8
      }
    },
    nav: true,

  }
@HostListener('window:resize', ['$event'])
onResize(event?: any) {
  this.updateGridCols();
}
updateGridCols(): void {
  const width = window.innerWidth;

  if (width >= 1024) {
    this.gridcols = 4;
  } else if (width >= 768) {
    this.gridcols = 3;
  } else {
    this.gridcols = 2;
  }
  }
}

