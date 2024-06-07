import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudinaryResponse } from '../interfaces/CloudinaryResponse';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/personal-johan/upload';
  private uploadPreset = 'crud-task-app';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<CloudinaryResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<CloudinaryResponse>(this.cloudinaryUrl, formData);
  }
}
