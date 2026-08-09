import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterFormBuilder } from './builders';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, FilesUploaderComponent, InputComponent } from '../../shared/components';

@Component({
  selector: 'app-register',
  imports: [ButtonComponent, InputComponent, ReactiveFormsModule, FilesUploaderComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  protected readonly form = RegisterFormBuilder.build();

  protected onSubmit(): void {}
}
