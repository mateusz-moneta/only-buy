import { Component, input, output, signal } from '@angular/core';
import { Role } from '@core/models';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
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
