import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonType, Variant } from './models';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public readonly styleClass = input<string>('');
  public readonly type = input<ButtonType>('button');
  public readonly variant = input<Variant>('primary');

  public readonly callback = output<void>();
}
