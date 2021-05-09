import { IViewSettings } from "../../model/IViewSettings";
import { ClassNaming } from '../../utils/ClassNaming';

class RangeLabel{
 private rangeLabelContainer!: HTMLDivElement;
 private minLabel!: HTMLSpanElement;
 private maxLabel!: HTMLSpanElement;
 private viewSettings!:IViewSettings;

 constructor() {
  this.initComponents();
 }
 render(settings: string, numberOfMarking:number):void{
  this.viewSettings = JSON.parse(settings);
  this.minLabel = document.createElement('span');
  this.rangeLabelContainer.appendChild(this.minLabel);
  for (let i = 0; i < numberOfMarking; i++) {
   const marking = document.createElement('span');
   if (this.viewSettings.isVertical) {
    marking.innerText = '-';
   } else marking.innerText = '|';
   this.rangeLabelContainer.appendChild(marking);
  this.maxLabel = document.createElement('span');
  this.rangeLabelContainer.appendChild(this.maxLabel);
  }
 }
 getRangeLabel():HTMLDivElement {
  return this.rangeLabelContainer;
 }
 setMinRange(value: number) :void{
  this.minLabel.innerText = '' + value;
 }
 setMaxRange(value: number):void {
  this.maxLabel.innerText = '' + value;
 }
 private initComponents() {
  this.rangeLabelContainer = document.createElement('div');
  this.rangeLabelContainer.classList.add(ClassNaming.RANGE_LABEL);
 }
}
export {RangeLabel}