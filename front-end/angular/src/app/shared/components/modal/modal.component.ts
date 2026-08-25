import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  public readonly closeOnBackdrop = input(true);
  public readonly open = input(false);
  public readonly title = input<string>();

  public readonly closed = output<void>();

  protected close(): void {
    this.closed.emit();
  }

  protected onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }
}
