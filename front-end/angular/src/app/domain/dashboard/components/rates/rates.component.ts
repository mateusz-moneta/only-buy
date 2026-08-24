import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrl: './rates.component.scss',
  standalone: true,
})
export class RatesComponent {
  public readonly confirmedRating = input<number>(0);
  public readonly ratingCount = input<number>(0);

  public readonly selectRates = output<number>();

  protected readonly rating = signal<number>(0);

  protected handleMouseEnter(hoveredRating: number): void {
    this.rating.set(hoveredRating);
    console.log(hoveredRating);
  }

  protected handleMouseLeave(): void {
    this.rating.set(0);
  }

  protected handleClick(clickedRating: number): void {
    this.rating.set(clickedRating);
    this.selectRates.emit(clickedRating);
  }
}
