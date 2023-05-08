import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss']
})
export class BaseFormComponent implements OnInit {
  baseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.baseForm = this.fb.group({
      formChildren: this.fb.group({
        baseFieldChild: []
      })
    });
  }


  ngOnInit(): void {

  }

  send() {
    console.warn(this.baseForm.value);
  }
}
