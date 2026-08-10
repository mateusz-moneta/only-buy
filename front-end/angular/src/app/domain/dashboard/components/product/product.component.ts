import { NgOptimizedImage } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { ProductImage } from '@core/models';
import { ButtonComponent } from '@shared/components';
import { SafeHtmlPipe } from '@shared/pipes';
import { handleImageError } from '@shared/utils';
import { RatesComponent } from '../rates/rates.component';

@Component({
  selector: 'app-product',
  imports: [ButtonComponent, RatesComponent, SafeHtmlPipe, NgOptimizedImage],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  standalone: true,
})
export class ProductComponent {
  public readonly confirmedRating = input<number>(0);
  public readonly description = input<string>('');
  public readonly images = input<ProductImage[]>([]);
  public readonly isAdmin = input<boolean>(false);
  public readonly isPromo = input<boolean>();
  public readonly name = input<string>();

  public readonly remove = output<void>();
  public readonly selectRates = output<number>();
  public readonly showDetails = output<void>();

  protected readonly imageIndex = signal<number>(0);

  protected onImageError(event: Event): void {
    handleImageError(event);
  }
}
