import { Component, input, output } from '@angular/core';
import { ButtonType, Variant } from './models';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  standalone: true,
})
export class Button {
  public readonly type = input<ButtonType>('button');
  public readonly variant = input<Variant>('primary');

  public readonly callback = output<void>();
}
