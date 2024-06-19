import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudinaryResponse } from '../interfaces/CloudinaryResponse';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private cloudinaryUrl = environment.cloudinaryUrl;
  private uploadPreset = 'crud-task-app';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<CloudinaryResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<CloudinaryResponse>(this.cloudinaryUrl, formData);
  }
}
