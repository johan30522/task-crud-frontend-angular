import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../interfaces/Task.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskEditPageComponent } from '../task-edit-page/task-edit-page.component';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit{

  public tasks: Task[] = [];
  public taskStatus = TaskStatus;
  public showToast = false;

  constructor(
    private taskService: TaskService,
    private modalService:NgbModal
  ) { }

  ngOnInit() {
    console.log('ListPageComponent');
    this.loadItems();
  }

  private loadItems(){
    this.taskService.getAllTasks().subscribe({
      next: tasks => {
        this.tasks = tasks;
        console.log(this.tasks);
      },
      error: err => {
        console.error('Failed to load tasks', err);
      }
    });
  }

  createTask() {
    const modalRef = this.modalService.open(TaskEditPageComponent, {
      size:'md',
      centered:true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.successfulTransaction.subscribe(() => {
      this.loadItems();
    });
  }
  deleteteTask() {
    console.log('deleteteTask');
  }

  updateTaskStatus(task: Task,  event: Event) {
    console.log('updateTaskStatus');

    const selecteElement = event.target as HTMLSelectElement;
    const status = selecteElement.value;
    this.taskService.updateTaskStatus(task.id, status).subscribe({
      next: () => {
        console.log('Task status updated');
        task.status = status as TaskStatus;
        this.showSuccessToast();
      },
      error: err => {
        console.error('Failed to update task status', err);
      }
    });
  }

  editTask(task: Task) {
    const modalRef = this.modalService.open(TaskEditPageComponent, {
      size:'md',
      centered:true,
      backdrop: 'static',
      keyboard: false

    });

    modalRef.componentInstance.task = task;
    modalRef.componentInstance.successfulTransaction.subscribe(() => {
      this.loadItems();
    });
  }

  getTaskImageUrl(task: Task): string {
    var imageUrl = task.image?.imageUrl && task.image.imageUrl.length > 0 ? task.image.imageUrl : 'assets/images/no-image.jpg';
    return imageUrl;
  }

  showSuccessToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // El toast se oculta después de 3 segundos
  }
  hideToast() {
    this.showToast = false;
  }

}
