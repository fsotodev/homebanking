import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '@apps/services/firebase.service';
import { parse } from 'papaparse';
import { UtilsService } from '@apps/services/utils.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-insurance-card',
  templateUrl: './insurance-card-rut.html',
  styleUrls: ['./insurance-card-rut.scss'],
})
export class InsuranceCardRutComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  myFilesInfo = [];
  form: FormGroup;
  ruts: any;
  uploadDisabled = false;
  message: string;
  isUploaded: boolean;
  loading = false;
  percUsersCommitedCard: number;
  constructor( public firebaseService: FirebaseService,
    private utils: UtilsService,
    private fb: FormBuilder,
    private router: Router) {
    this.createForm();
  }
  ngOnInit(): void {}

  get fields() {
    return this.form.get('fields') as FormArray;
  }

  get collection() {
    return this.form.get('collection') as FormArray;
  }
  public getFileDetails(event): void {
    this.uploadDisabled = !this.uploadDisabled;
    this.getFileName(event);
    this.getParseRuts(event);
  }

  public resetInputFile(): void {
    this.uploadDisabled = !this.uploadDisabled;
    this.myFilesInfo = [];
    this.fileInput.nativeElement.value = '';
  }

  public addField(): void {
    const group = this.fb.group({
      field: [{ value: '', disabled: false }, [Validators.required]],
      value: [{ value: '', disabled: false }, [Validators.required]],
    });
    this.fields.push(group);
  }

  public goHome() {
    this.router.navigate(['/home']);
  }

  public deleteFields(i: number): void {
    this.fields.removeAt(i);
  }

  public hasError(index: number, fieldName: string): boolean {
    return this.invalid(index, fieldName) && this.touched(index, fieldName);
  }

  public uploadRuts(): void {
    this.loading = true;
    const fields = this.transformData();
    this.firebaseService
      .updloadInsuranceRuts(
        this.collection.value,
        this.ruts,
        fields,
        this.commit
      )
      .then(async () => {
        this.loading = false;
        this.form.reset({});
        this.fields.clear();
        this.resetInputFile();
        this.message = 'success';
        this.isUploaded = true;
      })
      .catch((error) => {
        this.loading = false;
        console.error(error);
        this.message = 'error';
        this.isUploaded = true;
      });
    this.isUploaded = false;
  }

  private commit = (percUsersCommitedCard: number) => {
    this.percUsersCommitedCard = percUsersCommitedCard;
  };

  private getFileName(event): void {
    for (const file of event.target.files) {
      const name = file.name;
      this.myFilesInfo.push({ name });
    }
  }

  private getParseRuts(event): void {
    parse(event.target.files.item(0), {
      complete: async (result) => {
        const formatRuts = await this.utils.formatRutsCsvData(result.data);
        this.ruts = formatRuts;
      },
    });
  }

  private createForm(): void {
    this.form = this.fb.group({
      collection: ['', Validators.required],
      fields: this.fb.array([]),
    });
  }

  private transformData(): { [key: string]: any } {
    const properties = {};
    this.fields.value.map((data) => {
      properties[data.field] = data.value;
    });
    return properties;
  }

  private invalid(index: number, fieldName: string): boolean {
    return (this.form.get('fields') as FormArray).controls[index].get(fieldName)
      .invalid;
  }

  private touched(index: number, fieldName: string): boolean {
    return (this.form.get('fields') as FormArray).controls[index].get(fieldName)
      .touched;
  }
}
