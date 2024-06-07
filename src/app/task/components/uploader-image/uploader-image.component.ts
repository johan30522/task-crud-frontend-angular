import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { CloudinaryResponse } from '../../interfaces/CloudinaryResponse';
import { ImageRequest,Image } from '../../interfaces/image.interface';

@Component({
  selector: 'task-uploader-image',
  templateUrl: './uploader-image.component.html',
  styleUrl: './uploader-image.component.css'
})
export class UploaderImageComponent implements OnInit{

  @Input()
  public taskId!: number;
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  errorMessage: string | null = null;

  public image: Image | null = null;



  constructor(
    private taskService: TaskService,
    private imageUploadService: ImageUploadService
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

  public isEdit(): boolean {
    return this.image !== undefined;
  }

  

  public onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.errorMessage = null;

    console.log('fileType', file.type);
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imageUrl = reader.result;
      reader.readAsDataURL(file);
    } else {
      this.errorMessage = 'Por favor, seleccione un archivo de imagen válido.';
      // limpia el input file
      event.target.value = '';
    }
  }

  public onUpload(): void {
    if (this.selectedFile) {
      this.imageUploadService.uploadImage(this.selectedFile).subscribe(
        (response: CloudinaryResponse) => {
          console.log('Imagen subida a Cloudinary', response);
          const image: ImageRequest = {
            name: this.selectedFile?.name!,
            imageUrl: response.secure_url,
            imageId: response.public_id,
            taskId: this.taskId
          };

          console.log('Imagen a guardar en el backend', image)

          this.taskService.saveImage(image).subscribe(
            backendResponse => {
              console.log('Imagen guardada en el backend', backendResponse);
            },
            backendError => {
              console.error('Error guardando la imagen en el backend', backendError);
            }
          );
        },
        error => {
          console.error('Error subiendo la imagen a Cloudinary', error);
        }
      );
    }
  }
  public onRemoveImage() {
    this.selectedFile = null;
    this.imageUrl = null;
  }

  public triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

}
