import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer',
  pure: false,
})
export class TimerPipe implements PipeTransform {

  transform(value: any, fromTime: any): any {

    const startDateTime = value;

    if (!startDateTime) return
    var timeStart = startDateTime;
    var timeEnd = fromTime;
    var hourDiff = timeStart - timeEnd; //in ms

    var minDiff = Math.floor(hourDiff / 60000); //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    console.log(hourDiff, minDiff, hDiff)
    var humanReadable = { hours: hDiff, minutes: minDiff };
    humanReadable.hours = Math.floor(hDiff);
    humanReadable.minutes = minDiff - 60 * humanReadable.hours;
    console.log(value = humanReadable.hours + " h" + ' : ' + humanReadable.minutes + " m")
    return value = humanReadable.hours + " h" + ' : ' + humanReadable.minutes + " m";

  }



}

@NgModule({
  declarations: [
    TimerPipe
  ],
  exports: [
    TimerPipe
  ]
})
export class SharedModule { }