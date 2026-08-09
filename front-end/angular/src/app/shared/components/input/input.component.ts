import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';

import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseInput } from '../../abstracts';
import { InputType } from './models';
import { ErrorsComponent } from '@shared/components';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  imports: [ErrorsComponent],
})
export class InputComponent extends BaseInput<string> {
  public readonly disabled = input<boolean>(false);
  public readonly label = input('');
  public readonly placeholder = input('');
  public readonly step = input<string | undefined>(undefined);
  public readonly type = input<InputType>('text');

  protected get isControlDisabled(): boolean {
    return this.disabled() || this.isDisabled;
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.currentValue = value;
    this.onChange(value);
  }
}
