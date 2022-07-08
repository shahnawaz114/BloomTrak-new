import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Pipe({
  name: 'customDateTime'
})
export class CustomDateTimePipe extends 
        DatePipe  implements PipeTransform {
  transform(value: any, args?: any): any  {
    return super.transform(value, moment.unix(value).format("MM-DD-YYYY"));
  }

}
