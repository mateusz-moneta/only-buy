import { Component } from '@angular/core';
import { RegisterFormBuilder } from './builders';
import { ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../shared/components';

@Component({
  selector: 'app-register',
  imports: [Button, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
})
export class Register {
  protected readonly form = RegisterFormBuilder.build();

  protected onSubmit(): void {}
}
