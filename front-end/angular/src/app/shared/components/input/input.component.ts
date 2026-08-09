import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Injector,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputType } from './models';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  private readonly injector = inject(Injector);

  protected ngControl: NgControl | null = null;

  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly type = input<InputType>('text');

  protected readonly showError = signal<boolean>(false);

  disabled = false;
  value = '';

  protected get errors() {
    return this.ngControl?.control?.errors;
  }

  ngAfterViewInit() {
    this.ngControl = this.injector.get(NgControl);

    this.ngControl.control?.events.subscribe(({ source }) => {
      this.showError.set(source.invalid && source.touched);
    });
  }

  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
