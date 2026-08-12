import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ButtonComponent } from '@shared/components';

@Component({
  selector: 'app-files-uploader',
  standalone: true,
  templateUrl: './files-uploader.component.html',
  styleUrl: './files-uploader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
})
export class FilesUploaderComponent {
  public readonly accept = input<string>('');
  public readonly chooseImageMessage = input<string>(
    'Choose image for avatar to upload (PNG, JPG)'
  );
  public readonly emptyMessage = input<string>(
    'No file currently selected for upload'
  );
  public readonly multiple = input<boolean>(false);
  public readonly name = input.required<string>();
  public readonly placeholder = input<string>('Select file');

  public readonly changeFiles = output<File[]>();

  private readonly fileInput =
    viewChild<ElementRef<HTMLInputElement>>('fileInput');

  files: File[] = [];

  protected getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  protected openFileDialog(): void {
    this.fileInput()?.nativeElement.click();
  }

  protected onDelete(index: number) {
    this.files = this.files.filter((_, i) => i !== index);

    this.changeFiles.emit(this.files);
  }

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.files = [...(input.files ?? [])];

    this.changeFiles.emit(this.files);
  }
}
