import { EventObservable } from "../../observers/EventObservable";

class Thumb extends EventObservable{
 private thumb: HTMLDivElement;
 constructor(className:string) {
  super();
  this.thumb = document.createElement('div');
  this.thumb.classList.add(className);
 }
 getThumb(): HTMLDivElement {
  return this.thumb;
 }
}
export {Thumb}