import {
  AfterViewInit,
  DestroyRef,
  Directive,
  Injector,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ValidationErrors,
} from '@angular/forms';

@Directive()
export abstract class BaseInput<T>
  implements AfterViewInit, ControlValueAccessor
{
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  protected currentValue: T | undefined;
  protected isDisabled = false;

  protected readonly control = signal<FormControl<T> | null>(null);
  protected ngControl: NgControl | null = null;

  protected readonly showError = signal(false);

  protected onChange: (value: T) => void = () => {};
  protected onTouched: () => void = () => {};

  protected abstract get isControlDisabled(): boolean;

  protected get errors(): ValidationErrors | null | undefined {
    return this.ngControl?.control?.errors;
  }

  ngAfterViewInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
    this.control.set((this.ngControl?.control as FormControl) ?? null);

    this.control()
      ?.events.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ source }) => {
        this.showError.set(source.invalid && source.touched);
      });
  }

  writeValue(value: T | null): void {
    this.currentValue = value ?? undefined;
  }

  registerOnChange(fn: (value: T) => void): void {
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
}
