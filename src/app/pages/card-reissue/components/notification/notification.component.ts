import { notifications } from './const';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  @Input() message: string;
  timer = true;
  notifications = notifications;

  ngOnInit(): void {
    setTimeout(() => {
      this.timer = false;
    }, 5000);
  }

  get getState(){
    return notifications[this.message];
  }
}
