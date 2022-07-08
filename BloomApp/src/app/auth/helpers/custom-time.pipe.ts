import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'customTime'
})
export class CustomTimePipe extends 
DatePipe  implements PipeTransform {
transform(value: any): any  {
  let dt =  moment.unix(value).format("LT");
   return dt
}

}


