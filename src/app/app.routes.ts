import { BlogComponent } from './pages/blog/blog.component';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './Layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './Layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/authGuard/auth.guard';
import { logedINGuard } from './core/guards/authGuard/loged-in.guard';
import { cartGuard } from './core/guards/cart/cart.guard';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },

  {
    path: "",
    component: AuthLayoutComponent,canActivate:[logedINGuard],
    children: [
      { path: "login", loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
      { path: "register", loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) } , 
      { path: "forgot", loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) }
    ]
  },

  {
    path: "",
    component: MainLayoutComponent,canActivate:[authGuard],
    children: [
      { path: "home", loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), title: 'home' },
      { path: "cart", loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent), title: 'cart' },
      { path: "wishlist", loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent), title: 'Wishlist' },
      { path: "checkout", loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent), title: 'checkout', canActivate:[cartGuard] },
      { path: "details/:id", loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent), title: 'details' },
      { path: "about", loadComponent: () => import('./pages/about-us/about-us.component').then(m => m.AboutUsComponent), title: 'About' },
      { path: "blog", loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent), title: 'Blog' },
      { path: "allorders", loadComponent: () => import('./pages/allorders/allorders.component').then(m => m.AllordersComponent), title: 'Orders' },
      { path: "products", loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent), title: 'products' },
      { path: "**", loadComponent: () => import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent), title: 'notfound' }
    ]
  }
];
