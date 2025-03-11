import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  schemas:[NO_ERRORS_SCHEMA]
})
export class AuthLayoutComponent {

}
