import {Component, forwardRef, OnInit} from '@angular/core';
import {
  FormGroup,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormBuilder, ControlValueAccessor, AbstractControl, ValidationErrors, FormControl
} from '@angular/forms';

type ChangeCallbackFn<T> = (value: T) => void;
type TouchCallbackFn = () => void;


@Component({
  selector: 'app-base-fields',
  templateUrl: './base-fields.component.html',
  styleUrls: ['./base-fields.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseFieldsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BaseFieldsComponent),
      multi: true
    }
  ]
})

export class BaseFieldsComponent implements ControlValueAccessor, OnInit {
  baseFieldsForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.baseFieldsForm = this.fb.group(
      {
        idCampaign:  new FormControl('', Validators.compose([ Validators.maxLength(35), Validators.minLength(1), Validators.required])),
        priority: new FormControl('', Validators.compose([ Validators.required])),
        isCustom: new FormControl(false),
        activePWA: new FormControl(false),
        totem: new FormControl(false),
        allUsers: new FormControl(false)
      }
    );
  }

  async ngOnInit() {
  }

  /*
  * Sobre escribe metodo de validacion de formulario de forms
  * */
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.baseFieldsForm.valid) {
      return null;
    }
    return { invalidForm: { valid: false, message: 'baseFieldForms fields are invalid' } };
  }

  /*
  * Metodos de implementacion ControlValueAccessor
  * */
  writeValue(val: any): void {
    if (val) {
      this.baseFieldsForm.setValue(val, { emitEvent: false });
    }
  }

  registerOnChange(fn: ChangeCallbackFn<any>): void {
    this.baseFieldsForm.valueChanges.subscribe(fn);
  }

  onTouched: () => void = () => { };
  registerOnTouched(fn: TouchCallbackFn): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.baseFieldsForm.disable();
    } else {
      this.baseFieldsForm.enable();
    }
  }

}
