import {Injectable} from '@angular/core';
import dishes from './mock-dishes';

@Injectable()
export class DishService {

	dishes: Array<any> = dishes;

  findAll() {
      return this.dishes;
  }

  findById(id) {
      return Promise.resolve(this.dishes[id - 1]);
  }

  getItem(id) {
    for (var i = 0; i < this.dishes.length; i++) {
      if (this.dishes[i].id === parseInt(id)) {
        return this.dishes[i];
      }
    }
    return null;
  }

}
