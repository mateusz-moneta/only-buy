import { Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-errors',
  imports: [],
  templateUrl: './errors.component.html',
  styleUrl: './errors.component.scss',
  standalone: true,
})
export class ErrorsComponent {
  public readonly errors = input<ValidationErrors | null | undefined>();
}
