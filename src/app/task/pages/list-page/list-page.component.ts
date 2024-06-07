import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/Task.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskEditPageComponent } from '../task-edit-page/task-edit-page.component';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit{

  public tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private modalService:NgbModal
  ) { }

  ngOnInit() {
    console.log('ListPageComponent');
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
      console.log(this.tasks);
    });
  }

  private loadItems(){
    this.taskService.getAllTasks().subscribe((items:Task[]) => {
      console.log(items)
      this.tasks = items;
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

}
