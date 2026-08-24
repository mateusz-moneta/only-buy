import { Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-errors',
  imports: [TranslocoPipe],
  templateUrl: './errors.component.html',
  styleUrl: './errors.component.scss',
  standalone: true,
})
export class ErrorsComponent {
  public readonly errors = input<ValidationErrors | null | undefined>();
}
