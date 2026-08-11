import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@core/state';
import {
  ButtonComponent,
  FilesUploaderComponent,
  InputComponent,
} from '@shared/components';
import { RegisterFormBuilder } from './builders';

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

  protected onFileChange([file]: File[]): void {
    this.form.controls.avatar.setValue(file, { emitEvent: false });
  }

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
      avatar,
      email,
      password,
      username,
    });
  }
}
