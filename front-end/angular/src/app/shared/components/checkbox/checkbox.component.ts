import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ErrorsComponent } from '@shared/components';
import { BaseInput } from '../../abstracts';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  imports: [ErrorsComponent],
})
export class CheckboxComponent extends BaseInput<boolean> {
  public readonly checked = input<boolean | undefined>();
  public readonly label = input('');
  public readonly disabled = input(false);

  public readonly changeValue = output<boolean>();

  protected get isChecked(): boolean {
    return this.checked() ?? this.currentValue ?? false;
  }

  protected get isControlDisabled(): boolean {
    return this.disabled() || this.isDisabled;
  }

  protected onInput(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.currentValue = checked;
    this.onChange(checked);
    this.changeValue.emit(checked);
  }
}
