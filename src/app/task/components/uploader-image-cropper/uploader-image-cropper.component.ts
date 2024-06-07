import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { CloudinaryResponse } from '../../interfaces/CloudinaryResponse';
import { ImageRequest, Image } from '../../interfaces/image.interface';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgIf } from '@angular/common';

@Component({
  selector: 'task-uploader-image-cropper',
  templateUrl: './uploader-image-cropper.component.html',
  styleUrls: ['./uploader-image-cropper.component.css'],
  standalone: true,
  imports: [ImageCropperComponent,NgIf]
})
export class UploaderImageCropperComponent implements OnInit {
  @Input() public taskId!: number;
  @Output() refreshParent: EventEmitter<void> = new EventEmitter<void>();
  


  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  errorMessage: string | null = null;
  croppedImage: string = '';
  imageChangedEvent: Event | null = null;
  isSaving = false;

  public image: Image | null = null;

  constructor(
    private taskService: TaskService,
    private imageUploadService: ImageUploadService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.taskService.getImageByTaskId(this.taskId).subscribe(
      image => {
        this.image = image;
        this.imageUrl = image.imageUrl;
      },
      error => {
        console.error('Error obteniendo la imagen', error);
      }
    );
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }


  imageCropped(event: ImageCroppedEvent): void {
    console.log('Evento de recorte', event);
    
    if (event.blob) {
      this.blobToBase64(event.blob).then((base64: string) => {
        this.croppedImage = base64;
        console.log('Imagen recortada (base64)', this.croppedImage);
      }).catch(error => {
        console.error('Error converting blob to base64', error);
      });
    } else {
      this.croppedImage = '';
      console.log('Imagen recortada', this.croppedImage);
    }
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  isEdit(): boolean {
    return this.image !== undefined;
  }

  imageLoaded(image: LoadedImage): void {
    // show cropper
  }

  cropperReady(): void {
    // cropper ready
  }

  loadImageFailed(): void {
    this.errorMessage = 'Carga de imagen fallida. Por favor, intente con otro archivo.';
  }

  public onUpload(): void {
    if (this.croppedImage) {
      this.isSaving = true;
      console.log('debug 1. Imagen a subir', this.croppedImage)
      const file = this.dataURLtoFile(this.croppedImage, this.selectedFile?.name || 'cropped-image.jpg');
      
      console.log('debug 2. Imagen a subir', file)
      this.imageUploadService.uploadImage(file).subscribe(
        (response: CloudinaryResponse) => {
          console.log('debug 3. Imagen subida a Cloudinary', response);
          const image: ImageRequest = {
            name: response.original_filename + ' - ' + response.asset_id,
            imageUrl: response.secure_url,
            imageId: response.public_id,
            taskId: this.taskId
          };

          console.log('debug 4.Imagen a guardar en el backend', image);

          this.taskService.saveImage(image).subscribe(
            backendResponse => {
              console.log('Imagen guardada en el backend', backendResponse);
              this.imageUrl = backendResponse.imageUrl;
              this.image = backendResponse;
              this.imageChangedEvent = null;
              this.isSaving = false;
              this.refreshParent.emit();
            },
            backendError => {
              console.error('Error guardando la imagen en el backend', backendError);
              this.isSaving = false;
            }
          );
        },
        error => {
          console.error('Error subiendo la imagen a Cloudinary', error);
          this.isSaving = false;
        }
      );
    }
  }

  public onRemoveImage(): void {
    this.selectedFile = null;
    this.imageUrl = null;
    this.croppedImage = '';
    this.imageChangedEvent = null;
  }

  public triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  dataURLtoFile(dataurl: string, filename: string): File {
    console.log('dataurl', dataurl);
    console.log('filename', filename);
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}