import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pages = input(0);
  currentPage = input<number>(1);

  // inicializar con un valor que podria cambiar de inicio
  activePage = linkedSignal(this.currentPage);
  // activePage = signal(this.currentPage());

  getPagesList = computed(() => {
    return Array.from({ length: this.pages()}, (_, i) => i + 1 );
  })

 }
