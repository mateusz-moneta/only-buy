import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  forwardRef,
  input,
} from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { QuillModules } from 'ngx-quill/config';
import { BaseInput } from '@shared/abstracts';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, QuillModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextEditorComponent extends BaseInput<string> {
  public readonly disabled = input<boolean>(false);
  public readonly label = input<string>('');
  public readonly modules = input<QuillModules>({
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  });
  public readonly placeholder = input<string>('');

  protected get isControlDisabled(): boolean {
    return this.disabled() || this.isDisabled;
  }
}
