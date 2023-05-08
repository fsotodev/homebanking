import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe'
})
export class StatusPipe implements PipeTransform {
  transform(value: boolean, trueParameter: string, falseParameter: string): string {
    return value?trueParameter || 'Activo':falseParameter || 'Inactivo';
  }

}
