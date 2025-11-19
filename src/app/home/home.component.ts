import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SideMenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
