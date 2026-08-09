import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SnackbarService } from '../../services';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
  protected readonly snackbarService = inject(SnackbarService);
}
