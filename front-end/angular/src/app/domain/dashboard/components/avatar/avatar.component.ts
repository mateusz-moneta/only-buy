import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Role } from '@core/models';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AvatarComponent {
  public readonly avatar = input<string | null>(null);
  public readonly role = input<Role>('STANDARD');

  public readonly logout = output<void>();

  protected readonly isOpenMenu = signal<boolean>(false);

  protected closeMenu(): void {
    this.isOpenMenu.set(false);
  }

  protected openMenu(): void {
    this.isOpenMenu.set(true);
  }
}
