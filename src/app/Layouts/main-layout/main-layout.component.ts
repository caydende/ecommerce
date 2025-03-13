import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, NgZone, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../core/services/auth/auth.service';


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent,],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',

})
export class MainLayoutComponent implements OnInit{
  private readonly authService = inject(AuthService)


  getUserId(){
    this.authService.saveUserData()
  }
  ngOnInit(): void {
    this.getUserId()
  }
}
