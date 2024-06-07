import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { Task } from '../interfaces/Task.interface';
import { Observable } from 'rxjs';
import { ImageRequest, Image } from '../interfaces/image.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl: string = environment.baseUrl;


  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  //get all tasks

  public getAllTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.baseUrl}/task`, { headers: this.authService.getHeaders() });
  }

  //get by id
  public getTaskById(id: number): Observable<Task> {
    return this.httpClient.get<Task>(`${this.baseUrl}/task/${id}`, { headers: this.authService.getHeaders() });
  }

  //create task
  public createTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(`${this.baseUrl}/task`, task, { headers: this.authService.getHeaders() });
  }

  //update task
  public updateTask(task: Task): Observable<Task> {
    return this.httpClient.put<Task>(`${this.baseUrl}/task/${task.id}`, task, { headers: this.authService.getHeaders() });
  }

  //delete task
  public deleteTask(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/task/${id}`, { headers: this.authService.getHeaders() });
  }

  //save image
  public saveImage(image:ImageRequest):Observable<Image>{
    return this.httpClient.post<Image>(`${this.baseUrl}/image`, image, { headers: this.authService.getHeaders() });
  }

  //get image by task id
  public getImageByTaskId(id:number):Observable<Image>{
    return this.httpClient.get<Image>(`${this.baseUrl}/image/${id}`, { headers: this.authService.getHeaders() });
  }

}
