import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { Role } from '@core/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-avatar',
  imports: [RouterLink],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AvatarComponent {
  public readonly role = input<Role>('STANDARD');
  public readonly src = input<string>('');

  public readonly logout = output<void>();

  protected readonly isOpenMenu = signal<boolean>(false);

  protected closeMenu(): void {
    this.isOpenMenu.set(false);
  }

  protected openMenu(): void {
    this.isOpenMenu.set(true);
  }
}
