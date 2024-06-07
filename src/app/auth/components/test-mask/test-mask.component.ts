import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-test-mask',
  templateUrl: './test-mask.component.html',
  styleUrl: './test-mask.component.css'
})
export class TestMaskComponent {
  public maskTestForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.maskTestForm = this.fb.group({
      phone: new FormControl<string>('', [Validators.required])
    });
  }

  get phone() {
    return this.maskTestForm.get('phone');
  }

}
