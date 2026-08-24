import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrl: './rates.component.scss',
  standalone: true,
})
export class RatesComponent {
  public readonly isAuthenticated = input<boolean>(false);
  public readonly confirmedRating = input<number>(0);
  public readonly ratingCount = input<number>(0);

  public readonly selectRates = output<number>();

  protected readonly rating = signal<number>(0);

  protected handleMouseEnter(hoveredRating: number): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.rating.set(hoveredRating);
  }

  protected handleMouseLeave(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.rating.set(0);
  }

  protected handleClick(clickedRating: number): void {
    this.rating.set(clickedRating);
    this.selectRates.emit(clickedRating);
  }
}
