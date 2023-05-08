import { Injectable } from '@angular/core';
import { Collapsible } from '@apps/models/collapsible';

@Injectable()
export class CollapsibleService {
  collapsibles: Collapsible[];

  constructor() {
    this.collapsibles = [];
  }

  getCollapsible(): Collapsible[] {
    const verify = localStorage.getItem('collapsibles');
    if(verify === undefined || verify === null || verify === ''){
      this.collapsibles = [];
    } else {
      this.collapsibles = JSON.parse(localStorage.getItem('collapsibles'));
    }
    return this.collapsibles;
  }
  verifyPrioriryUpdate(id: any, priority: number){
    let checkPriority;
    const backup = JSON.parse(localStorage.getItem('collapsibles'));
    for (const iterator of backup) {
      if (id === iterator.id && priority === iterator.priority) {
        checkPriority = 'update';
        return checkPriority;
      } else {
        checkPriority = 'duplicated';
      }
    }

    if(checkPriority === 'duplicated'){
      for (const iterator of backup) {
        if(priority === iterator.priority) {
          checkPriority = 'duplicated';
          return checkPriority;
        } else {
          checkPriority = 'update';
        }
      }
    }
    return checkPriority;
  }

  verifyPriority(priority: number){
    let findPriority = true;
    const verify = localStorage.getItem('collapsibles');
    if (verify === ''){
      findPriority = true;
    } else {
      JSON.parse(localStorage.getItem('collapsibles')).find(item => {
        if(item.priority === priority){
          findPriority = false;
        }
      });
    }
    return findPriority;
  }

  createId(){
    let counter = 0;
    const verify = localStorage.getItem('collapsibles');
    if( verify === null || verify === undefined || verify === ''){
      counter = 1;
    } else {
      counter =  JSON.parse(localStorage.getItem('collapsibles')).length;
      counter++;
    }
    return counter;
  }

  addCollapsible(collapsible: Collapsible): void {
    this.collapsibles.unshift(collapsible);
    let collapsibless;
    const verify = localStorage.getItem('collapsibles');
    if(verify === ''){
      collapsibless = [];
      collapsibless.unshift(collapsible);
      localStorage.setItem('collapsibles', JSON.stringify(collapsibless));
    } else {
      collapsibless = JSON.parse(localStorage.getItem('collapsibles'));
      collapsibless.unshift(collapsible);
      localStorage.setItem('collapsibles', JSON.stringify(collapsibless));
    }
  }

  removeCollapsible(collapsible: Collapsible) {
    if (this.collapsibles.length >= 0){
      for(let i = 0; i < this.collapsibles.length; i++){
        if(collapsible === this.collapsibles[i]) {
          this.collapsibles.splice(i,1);
          localStorage.setItem('collapsibles', JSON.stringify(this.collapsibles));
        }
      }
    }
  }

}
