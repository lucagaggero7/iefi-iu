import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe, NgFor } from '@angular/common';
import { SideMenuComponent } from "../side-menu/side-menu.component";

interface MenuItem {
  id: string;
  label: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-web1',
  standalone: true,
  imports: [FormsModule, CommonModule, DecimalPipe, NgFor, SideMenuComponent],
  templateUrl: './web1.component.html',
  styleUrls: ['./web1.component.css']
})
export class Web1Component {

  menu = [
    {
      categoria: 'Entradas',
      abierta: false,
      items: [
        { id: 'empanadas', label: 'Empanadas', price: 1800, quantity: 0 },
        { id: 'choripan', label: 'Choripán', price: 2200, quantity: 0 }
      ]
    },
    {
      categoria: 'Platos principales',
      abierta: false,
      items: [
        { id: 'milanesa', label: 'Milanesa con papas', price: 3500, quantity: 0 },
        { id: 'lomito', label: 'Lomito completo', price: 4200, quantity: 0 },
        { id: 'asado', label: 'Asado porción', price: 5000, quantity: 0 },
        { id: 'fideos', label: 'Fideos con tuco', price: 2500, quantity: 0 }
      ]
    },
    {
      categoria: 'Bebidas',
      abierta: false,
      items: [
        { id: 'agua', label: 'Agua mineral', price: 1000, quantity: 0 },
        { id: 'gaseosa', label: 'Gaseosa 500ml', price: 1500, quantity: 0 },
        { id: 'cerveza', label: 'Cerveza Quilmes', price: 2500, quantity: 0 },
        { id: 'vino', label: 'Vino tinto (copa)', price: 3000, quantity: 0 }
      ]
    },
    {
      categoria: 'Postres',
      abierta: false,
      items: [
        { id: 'flan', label: 'Flan con dulce', price: 1800, quantity: 0 }
      ]
    }
  ];

  // ✓ Aplana todas las categorías en una sola lista como antes
  get menuItems(): MenuItem[] {
    return this.menu.flatMap(c => c.items);
  }

  readonly IMPUESTO_TASA = 0.18;

  mensajeError = '';
  mostrarModalError = false;

  totalVenta = 0;
  totalImpuesto = 0;
  mostrarModal = false;

  calcularTotales(): void {
    let total = 0;

    this.menuItems.forEach((item: MenuItem) => {
      const cant = item.quantity || 0;
      total += cant * item.price;
    });

    this.totalVenta = total;
    this.totalImpuesto = total * this.IMPUESTO_TASA;
  }

  abrirResumen(): void {
    const totalCantidades = this.menuItems.reduce(
      (acc: number, item: MenuItem) => acc + (item.quantity || 0),
      0
    );

    if (totalCantidades === 0) {
      this.mensajeError = 'Ingrese un producto';
      this.mostrarModalError = true;
      return;
    }

    this.calcularTotales();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.limpiar();
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
  }

  limpiar(): void {
    this.menuItems.forEach((i: MenuItem) => i.quantity = 0);
    this.totalVenta = 0;
    this.totalImpuesto = 0;
  }

  get gananciaNeta(): number {
    return this.totalVenta - this.totalImpuesto;
  }

  toggleCategoria(cat: any) {
    cat.abierta = !cat.abierta;
  }
}
