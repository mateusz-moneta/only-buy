import { Component } from '@angular/core';
import { Button, Input } from '../../shared/components';
import { LoginFormBuilder } from './builders';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [Button, Input, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login {
  protected readonly form = LoginFormBuilder.build();

  protected onSubmit(): void {}
}
