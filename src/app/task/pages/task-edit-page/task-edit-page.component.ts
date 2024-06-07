import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../interfaces/Task.interface';
import { TaskService } from '../../services/task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskStatus } from '../../interfaces/Task.interface'; // 
import { UploaderImageCropperComponent } from '../../components/uploader-image-cropper/uploader-image-cropper.component';
import { NgFor, NgIf } from '@angular/common';
import { ValidatorService } from '../../../shared/services/validator.service';
@Component({
  selector: 'app-task-edit-page',
  templateUrl: './task-edit-page.component.html',
  styleUrl: './task-edit-page.component.css',
  standalone: true,
  imports: [UploaderImageCropperComponent,NgIf,NgFor,ReactiveFormsModule]
})
export class TaskEditPageComponent implements OnInit{
  
  @Input()
  public task!: Task;
  @Output()
  public readonly successfulTransaction = new EventEmitter<boolean>();
  
  public submitAttempt!: boolean;

  constructor(
    private taskService: TaskService,
    private modalService: NgbModal,
    private validatorService: ValidatorService
  ) {
  }

  
  public isEdit(): boolean {
    return this.task !== undefined;
  }
  
  public taskForm = new FormGroup({
    name: new FormControl<string>('',Validators.required),
    status: new FormControl<TaskStatus>(TaskStatus.Pendiente, Validators.required)
  });
  
  isValidField(field: string) {
    return this.validatorService.isValidField(this.taskForm, field);
  }
  getErrorMessage(field: string): string | null {
    return this.validatorService.getErrorMessage(this.taskForm, field);
  }

  ngOnInit(): void {

    if (this.isEdit()) {
      this.taskForm.reset(this.task);
    }

  }

  get currentTask(): Task {
    return this.taskForm.value as Task;
  }

  public get taskStatusValues(): string[] {
    return Object.values(TaskStatus);
  }

  public onSubmit(): void {
    this.submitAttempt = true;
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    if (this.isEdit()) {
      this.taskService.updateTask(this.currentTask).subscribe(() => {
        this.successfulTransaction.emit(true);
        this.closeModal();
      });
    } else {
      this.taskService.createTask(this.currentTask).subscribe(() => {
        this.successfulTransaction.emit(true);
        this.closeModal();
      });
    }
  }

  public onCancel(): void {
    this.successfulTransaction.emit(false);
  }

  public closeModal(): void {
    this.modalService.dismissAll();
  }

  public updateParent(): void {
    this.successfulTransaction.emit(true);
  }




}
