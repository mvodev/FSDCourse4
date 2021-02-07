import { IObservable } from "./IObservable";
//import { IObserver } from "./IObserver";
import { Messages } from '../utils/Messages';

class EventObservable implements IObservable {
 private observers: Array<any>;
 constructor() {
  this.observers = [];
 }
 addObserver(o: any):void {
  this.observers.push(o);
 }
 removeObserver(o: any):void {
  this.observers.filter(subscriber => subscriber !== o);
 }
 notifyObservers(msg: Messages, settings: string):void {
  this.observers.forEach(elem => {
   if(elem){
    elem.handleEvent(msg, settings)
   }
   });
 }
}
export {EventObservable}