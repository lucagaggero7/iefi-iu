import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

declare const lucide: any;

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent implements AfterViewInit {
  constructor(public router: Router) { }
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}
