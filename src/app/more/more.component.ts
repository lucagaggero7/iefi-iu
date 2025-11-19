import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [CommonModule, SideMenuComponent],
  templateUrl: './more.component.html',
  styleUrl: './more.component.css'
})
export class MoreComponent {
  servicios = [
    {
      icon: '💻',
      title: 'Desarrollo de Software',
      desc: 'Creamos soluciones a medida para empresas, desde sistemas de gestión hasta aplicaciones web y móviles.'
    },
    {
      icon: '☕',
      title: 'Automatización de Restaurantes',
      desc: 'Optimizamos procesos de pedidos, stock y atención al cliente en restaurantes y cafeterías.'
    },
    {
      icon: '🏫',
      title: 'Soluciones Educativas',
      desc: 'Desarrollamos plataformas y herramientas para instituciones educativas, incluyendo gestión de alumnos y contenidos digitales.'
    },
    {
      icon: '🔐',
      title: 'Seguridad y Soporte IT',
      desc: 'Implementamos medidas de seguridad y ofrecemos soporte técnico continuo para proteger tus sistemas.'
    }
  ];
}
