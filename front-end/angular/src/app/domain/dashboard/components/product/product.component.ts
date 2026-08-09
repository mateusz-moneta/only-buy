import { Component, input, output, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components';
import { RatesComponent } from '../rates/rates.component';
import { ProductImage } from '@core/models';
import { SafeHtmlPipe } from '@shared/pipes';

@Component({
  selector: 'app-product',
  imports: [ButtonComponent, RatesComponent, SafeHtmlPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  standalone: true,
})
export class ProductComponent {
  public readonly confirmedRating = input<number>(0);
  public readonly description = input<string>('');
  public readonly images = input<ProductImage[]>([]);
  public readonly isPromo = input<boolean>();
  public readonly name = input<string>();

  public readonly selectRates = output<number>();
  public readonly showDetails = output<void>();

  protected readonly imageIndex = signal<number>(0);
}
