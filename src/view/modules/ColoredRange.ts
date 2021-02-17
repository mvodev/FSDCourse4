import { IViewSettings } from "../../model/IViewSettings";

class ColoredRange {
 private coloredRange: HTMLDivElement;
 constructor() {
  this.coloredRange = document.createElement('div');
  this.coloredRange.classList.add('fsd-slider__colored-range');
 }
 getColoredRange(): HTMLDivElement {
  return this.coloredRange;
 }
 setColoredRange(
  viewSettings:IViewSettings,
  thumbFrom:HTMLDivElement,
  thumbTo:HTMLDivElement,
  range:HTMLDivElement,
  thumbLength:number) :void {
  if (viewSettings.isRange) {
   if (viewSettings.isVertical) {
    this.getColoredRange().style.top = (thumbFrom.getBoundingClientRect().top) - range.getBoundingClientRect().top + thumbLength / 2 + 'px';
    this.getColoredRange().style.height = (thumbTo.getBoundingClientRect().top - thumbFrom.getBoundingClientRect().top + thumbLength / 2) + 'px';
   }
   else {
    this.getColoredRange().style.left = (thumbFrom.getBoundingClientRect().left - range.getBoundingClientRect().left) + 'px';
    this.getColoredRange().style.width = (thumbTo.getBoundingClientRect().left - (thumbFrom.getBoundingClientRect().left - thumbLength / 2)) + 'px';
   }
  }
  else {
   if (viewSettings.isVertical) {
    this.getColoredRange().style.height = (thumbFrom.getBoundingClientRect().top - (range.getBoundingClientRect().top - thumbLength / 2)) + 'px';
   }
   else {
    this.getColoredRange().style.width = (thumbFrom.getBoundingClientRect().left - (range.getBoundingClientRect().left - thumbLength / 2)) + 'px';
   }
  }
 }
}
export {ColoredRange}