import { Range } from './range';
import { Thumb } from './thumb';
import { ThumbLabel } from './thumbLabel';
import { RangeLabel } from './rangeLabel';
import { ColoredRange } from './coloredRange';
import { ISettings } from '../../model/ISettings';
import { defaultSettings } from '../../model/defaultSettings';
class Slider {

 private thumbFrom!: Thumb;
 private thumbTo!: Thumb;
 private range!: Range;
 private thumbLabelFrom!: ThumbLabel;
 private thumbLabelTo!: ThumbLabel;
 private rangeLabel!: RangeLabel;
 private rootElem!: HTMLDivElement;
 private container!: HTMLDivElement;
 private coloredRange!: ColoredRange;
 private viewSettings: ISettings;
 private numberOfMarking: number;

 constructor(rootElem: HTMLDivElement, numberOfMarking: number) {
  this.viewSettings = Object.assign({},defaultSettings);
  this.rootElem = rootElem;
  this.numberOfMarking = numberOfMarking;
  this.initSliderComponents();
 }

 render(s:string) :void{
  this.viewSettings = Object.assign(this.viewSettings,JSON.parse(s));
  this.container.classList.add('fsd-slider');
  this.container.appendChild(this.range.getRange());
  this.range.getRange().appendChild(this.coloredRange.getColoredRange());
  this.range.getRange().appendChild(this.thumbFrom.getThumb());
  this.rangeLabel.render(s,this.numberOfMarking);
  this.thumbFrom.getThumb().appendChild(this.thumbLabelFrom.getThumbLabelContainer());
  if (this.viewSettings.isRange) {
   this.thumbTo.getThumb().appendChild(this.thumbLabelTo.getThumbLabelContainer());
   this.range.getRange().appendChild(this.thumbTo.getThumb());
  }
  this.container.appendChild(this.rangeLabel.getRangeLabel());
  this.rootElem.appendChild(this.container);
 }
 
 getRange():HTMLDivElement {
  return this.range.getRange();
 }
 getThumbFrom():HTMLDivElement {
  return this.thumbFrom.getThumb();
 }
 getThumbTo() :HTMLDivElement{
  return this.thumbTo.getThumb();
 }
 getThumbLabelFrom() :ThumbLabel{
  return this.thumbLabelFrom;
 }
 getThumbLabelTo():ThumbLabel {
  return this.thumbLabelTo;
 }
 getColoredRange():HTMLDivElement {
  return this.coloredRange.getColoredRange();
 }
 setMaxRange(value: number) :void{
  this.rangeLabel.setMaxRange(value);
 }
 setMinRange(value: number) :void{
  this.rangeLabel.setMinRange(value);
 }
 setValueToLabelThumbFrom(value: number):void {
  this.thumbLabelFrom.setValueToLabel(value);
 }
 setValueToLabelThumbTo(value: number) :void{
  this.thumbLabelTo.setValueToLabel(value);
 }
 getRangeLabel(): HTMLDivElement {
  return this.rangeLabel.getRangeLabel();
 }
 setVertical():void {
  this.container.classList.add('fsd-slider_is_vertical');
  this.range.getRange().classList.add('fsd-slider__range_is_vertical');
  this.coloredRange.getColoredRange().classList.add('fsd-slider__colored-range_is_vertical');
  this.rangeLabel.getRangeLabel().classList.add('fsd-slider__range-label_is_vertical');
  this.thumbLabelFrom.getThumbLabelContainer().classList.add('fsd-slider__thumb-label_is_vertical');
  if (this.viewSettings.isRange) {
   this.thumbLabelTo.getThumbLabelContainer().classList.add('fsd-slider__thumb-label_is_vertical');
  }
 }
 private initSliderComponents() {
  this.thumbTo = new Thumb('fsd-slider__thumb-to');
  this.thumbLabelTo = new ThumbLabel();
  this.thumbFrom = new Thumb('fsd-slider__thumb-from');
  this.thumbLabelFrom = new ThumbLabel();
  this.range = new Range();
  this.coloredRange = new ColoredRange();
  this.rangeLabel = new RangeLabel();
  this.container = document.createElement('div');
 }
 setColoredRange(): void {
  if (this.viewSettings.isRange) {
   if (this.viewSettings.isVertical) {
    this.getColoredRange().style.top = (this.getThumbFrom().getBoundingClientRect().top) - this.getRange().getBoundingClientRect().top + this.getThumbLengthInPx() / 2 + 'px';
    this.getColoredRange().style.height = (this.getThumbTo().getBoundingClientRect().top - this.getThumbFrom().getBoundingClientRect().top + this.getThumbLengthInPx() / 2) + 'px';
   }
   else {
    this.getColoredRange().style.left = (this.getThumbFrom().getBoundingClientRect().left - this.getRange().getBoundingClientRect().left) + 'px';
    this.getColoredRange().style.width = (this.getThumbTo().getBoundingClientRect().left - (this.getThumbFrom().getBoundingClientRect().left - this.getThumbLengthInPx() / 2)) + 'px';
   }
  }
  else {
   if (this.viewSettings.isVertical) {
    this.getColoredRange().style.height = (this.getThumbFrom().getBoundingClientRect().top - (this.getRange().getBoundingClientRect().top - this.getThumbLengthInPx() / 2)) + 'px';
   }
   else {
    this.getColoredRange().style.width = (this.getThumbFrom().getBoundingClientRect().left - (this.getRange().getBoundingClientRect().left - this.getThumbLengthInPx() / 2)) + 'px';
   }
  }
 }
 getThumbLengthInPx() :number{
  if (this.viewSettings.isVertical) {
   return this.getThumbFrom().offsetHeight;
  }
  else {
   return this.getThumbFrom().offsetWidth;
  }
 }
}
export {Slider}