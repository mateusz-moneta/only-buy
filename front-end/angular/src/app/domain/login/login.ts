import { Component, inject } from '@angular/core';
import { Button, Input } from '../../shared/components';
import { LoginFormBuilder } from './builders';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthStore } from '../../core/state';

@Component({
  selector: 'app-login',
  imports: [Button, Input, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login {
  private readonly authStore = inject(AuthStore);

  protected readonly form = LoginFormBuilder.build();

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { password, username } = this.form.value;

    if (!password || !username) {
      return;
    }

    this.authStore.login({
      password,
      username,
    });
  }
}
