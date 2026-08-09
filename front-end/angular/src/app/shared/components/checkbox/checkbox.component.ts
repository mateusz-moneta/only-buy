import { ChangeDetectionStrategy, Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  public readonly checked = input<boolean | undefined>(undefined);
  public readonly disabled = input(false);
  public readonly label = input('');

  public readonly changeValue = output<boolean>();

  protected currentValue = false;
  protected isDisabled = false;

  private onChange: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected get checkboxDisabled(): boolean {
    return this.disabled() || this.isDisabled;
  }

  protected get isChecked(): boolean {
    return this.checked() ?? this.currentValue;
  }

  writeValue(value: boolean | null): void {
    this.currentValue = value ?? false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  protected onBlur(): void {
    this.onTouched();
  }

  protected onInput(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.currentValue = checked;
    this.onChange(checked);
    this.changeValue.emit(checked);
  }
}
