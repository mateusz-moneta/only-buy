import { Component, inject } from '@angular/core';
import { ButtonComponent, InputComponent } from '../../shared/components';
import { LoginFormBuilder } from './builders';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthStore } from '../../core/state';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
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
