import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { UsersService } from './services';
import { UsersStore } from './state';
import { DatePipe, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { STANDARD_DATE } from '@core/constants';
import {
  ButtonComponent,
  CheckboxComponent,
  SpinnerComponent,
} from '@shared/components';
import { Router } from '@angular/router';
import { AuthStore } from '@core/state';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonComponent,
    DatePipe,
    NgOptimizedImage,
    SpinnerComponent,
    TitleCasePipe,
    CheckboxComponent,
  ],
  providers: [UsersService, UsersStore],
})
export class UsersComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly usersStore = inject(UsersStore);

  protected readonly loading = this.usersStore.isLoading;
  protected readonly standardDate = STANDARD_DATE;
  protected readonly users = this.usersStore.users;

  protected readonly currentUsername = computed(() => {
    const user = this.authStore.user();

    return user?.username ?? '';
  });

  public ngOnInit(): void {
    this.usersStore.loadUsers();
  }

  protected goToDashboard(): void {
    this.router.navigate(['/']);
  }

  protected onChangeValue(id: string, active: boolean): void {
    this.usersStore.updateUserActive({
      active,
      id,
    });
  }
}
