import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInput } from '@shared/abstracts';
import { ErrorsComponent } from '@shared/components';

@Component({
  selector: 'app-textarea',
  imports: [ErrorsComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent extends BaseInput<string> {
  public readonly disabled = input<boolean>(false);
  public readonly label = input<string>('');
  public readonly name = input<string>('');
  public readonly placeholder = input<string>('');

  protected get isControlDisabled(): boolean {
    return this.disabled() || this.isDisabled;
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.currentValue = value;
    this.onChange(value);
  }
}
