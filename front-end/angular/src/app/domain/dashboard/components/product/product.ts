import { Component, input, output, signal } from '@angular/core';
import { Button } from '../../../../shared/components';
import { Rates } from '../rates/rates';
import { ProductImage } from '../../../../core/models';

@Component({
  selector: 'app-product',
  imports: [Button, Rates],
  templateUrl: './product.html',
  styleUrl: './product.scss',
  standalone: true,
})
export class Product {
  public readonly confirmedRating = input<number>(0);
  public readonly description = input<string>('');
  public readonly images = input<ProductImage[]>([]);
  public readonly isPromo = input<boolean>();
  public readonly name = input<string>();

  public readonly selectRates = output<number>();
  public readonly showDetails = output<void>();

  protected readonly imageIndex = signal<number>(0);
}
