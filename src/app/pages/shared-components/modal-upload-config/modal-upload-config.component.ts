import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-upload-config',
  templateUrl: './modal-upload-config.component.html',
  styleUrls: ['./modal-upload-config.component.scss']
})
export class ModalUploadConfigComponent implements OnInit {
  form: FormGroup;
  autoID = false;
  errorJson: string;
  tips = ['{{col0}} => valor columna 1 del csv',
    'Hola {{col0}}, te hemos enviado un mensaje a {{col0}} => concatenar columnas y texto',
    '{{line}} => linea actual del csv',
    '{{length}} => total de lineas del csv',
    '\\\\2+2\\\\ => operacion matematica, valor 4',
    '\\\\{{col0}} + {{col0}}\\\\ => operacion matematica, devuelve la suma de ambas columnas',
    '\\\\new Date()\\\\ => ejecucion javascript',
    'Para las push, el campo -Objeto creado, debe tener las variables "group" y "rut"'
  ];
  pushParamsTips = ['"actualGroup": 0',
    '"hasToPerformTest": false',
    '"numberOfGroups": "\\\\Math.ceil({{length}} / 5000)\\\\"',
    '"rutsUploaded": "{{length}}"',
    '"status": "immediate"',
    '"uploadedRuts": true'
  ];

  constructor(public dialogRef: MatDialogRef<ModalUploadConfigComponent>
    , @Inject(MAT_DIALOG_DATA) public dataFather: any) {
  }

  ngOnInit() {
    this.errorJson = '';
    this.form = new FormGroup(
      {
        idConfig: new FormControl({value: '', disabled: this.dataFather !== null}, [Validators.required]),
        objectCreated: new FormControl(''),
        automaticId: new FormControl(''),
        collection: new FormControl('', [Validators.required]),
        onLoaded: new FormControl(''),
        document: new FormControl(''),
        parameters: new FormControl(''),
        overlaps: new FormControl(''),
        documentId: new FormControl(''),
        convertType: new FormControl('')
      }
    );
    this.prepareForm();
    this.autoID = this.form.getRawValue().automaticId;
  }

  prepareForm() {
    if (this.dataFather) {
      const [onLoaded, document, parameters] = this.checkOnLoaded();
      this.form.patchValue({
        idConfig: this.dataFather.idConfig,
        objectCreated: this.delBackSlashField(JSON.stringify(this.dataFather.objectCreated, null, 2)),
        automaticId: this.dataFather.automaticId,
        collection: this.dataFather.collection,
        overlaps: this.dataFather.overlaps,
        onLoaded: this.delBackSlashField(JSON.stringify(onLoaded, null, 2)),
        document,
        parameters,
        documentId: this.dataFather.documentId,
        convertType: this.dataFather.convertType
      });
    }
  }

  checkAutoID() {
    if (this.autoID) {
      this.form.get('documentId').setValue('');
    }
  }

  checkOnLoaded() {
    const onLoaded = this.dataFather.onLoaded;
    if (onLoaded && onLoaded[0]) {
      const document = onLoaded[0].document;
      const parameters = this.delBackSlashField(JSON.stringify(onLoaded[0].parameters, null, 2));
      return [onLoaded, document, parameters];
    }
    return [onLoaded, '', ''];
  }

  validateJson(control) {
    const formControl = this.form.get(control);
    let newJson = formControl.value;
    if (newJson === null || typeof newJson === 'undefined' || newJson === '') {
      return;
    }
    try {
      const controlJson = JSON.parse(newJson);
      newJson = JSON.stringify(controlJson, null, 2);
      formControl.setValue(newJson);
      this.createOnLoaded();
    } catch (err) {
      console.log(err);
      this.errorJson = 'Json no válido';
      formControl.setErrors({incorrect: true});
    }
  }

  createOnLoaded() {
    const onLoaded = [{
      document: this.form.getRawValue().document,
      parameters: JSON.parse(this.form.getRawValue().parameters)
    }];
    const formControl = this.form.get('onLoaded');
    const newJson = JSON.stringify(onLoaded, null, 2);
    formControl.setValue(newJson);
  }

  saveChanges() {
    this.checkAutoID();
    if (this.form.valid) {
      const idDocument = this.dataFather !== null ? this.dataFather.idConfig : null;
      const data = this.prepareDataToSend(this.form.getRawValue());
      console.log(data);
      this.dialogRef.close({btnPressed: 'accept', docId: idDocument, form: data});
    }
  }

  prepareDataToSend(formRawValue: any) {
    const data = {
      idConfig: formRawValue.idConfig,
      objectCreated: this.addBackSlashField(formRawValue.objectCreated),
      automaticId: formRawValue.automaticId,
      collection: formRawValue.collection,
      onLoaded: this.addBackSlashField(formRawValue.onLoaded),
      overlaps: formRawValue.overlaps,
      documentId: formRawValue.documentId,
      convertType: formRawValue.convertType
    };
    return data;
  }

  closeDialog() {
    this.dialogRef.close({btnPressed: 'cancel'});
  }

  addBackSlashField(field) {
    if (field !== null && field !== '' && typeof field !== 'undefined') {
      field = field.replaceAll('\\', '\\\\');
      field = JSON.parse(field);
    }
    return field;
  }

  delBackSlashField(field) {
    if (field !== null && field !== '' && typeof field !== 'undefined') {
      field = field.replaceAll('\\\\', '\\');
    }
    return field;
  }
}
