import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthStore } from '@core/state';
import { ButtonComponent, InputComponent } from '@shared/components';
import { LoginFormBuilder } from './builders';

@Component({
  selector: 'app-login',
  imports: [
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    RouterLink,
    TranslocoPipe,
  ],
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
