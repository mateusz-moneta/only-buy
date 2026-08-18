import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PaginatorComponent {
  public readonly page = input<number>(1);
  public readonly totalPages = input<number>(1);

  public readonly pageChange = output<number>();

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.page();

    if (total <= 5) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    let start = current - 2;

    if (start < 1) {
      start = 1;
    }

    if (start + 4 > total) {
      start = total - 4;
    }

    return Array.from({ length: 5 }, (_, index) => start + index);
  });

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) {
      return;
    }

    this.pageChange.emit(page);
  }

  protected next(): void {
    this.goToPage(this.page() + 1);
  }

  protected previous(): void {
    this.goToPage(this.page() - 1);
  }
}
