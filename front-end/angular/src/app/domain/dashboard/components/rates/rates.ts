import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-rates',
  imports: [],
  templateUrl: './rates.html',
  styleUrl: './rates.scss',
  standalone: true,
})
export class Rates {
  public readonly confirmedRating = input<number>(0);

  public readonly selectRates = output<number>();

  protected readonly rating = signal<number>(0);

  protected handleMouseEnter(hoveredRating: number) {
    this.rating.set(hoveredRating);
  }

  protected handleMouseLeave(): void {
    this.rating.set(0);
  }

  protected handleClick(clickedRating: number): void {
    this.rating.set(clickedRating);
    this.selectRates.emit(clickedRating);
  }
}
