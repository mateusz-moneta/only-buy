import { Component, forwardRef, input } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { BaseInput } from '@shared/abstracts';

@Component({
  selector: 'app-search',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchComponent),
      multi: true,
    },
  ],
  standalone: true,
})
export class SearchComponent extends BaseInput<string> {
  public readonly disabled = input<boolean>(false);
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
