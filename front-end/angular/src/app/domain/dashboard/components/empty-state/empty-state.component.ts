import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-empty-state',
  imports: [TranslocoDirective],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  standalone: true,
})
export class EmptyStateComponent {}
