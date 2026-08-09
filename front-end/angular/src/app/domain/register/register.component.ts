import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RegisterFormBuilder } from './builders';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, FilesUploaderComponent, InputComponent } from '@shared/components';
import { AuthStore } from '@core/state';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    FilesUploaderComponent,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly authStore = inject(AuthStore);

  protected readonly form = RegisterFormBuilder.build();

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { avatar, email, password, username } = this.form.value;

    if (!email || !password || !username) {
      return;
    }

    this.authStore.register({
      email,
      password,
      username,
    });
  }
}
