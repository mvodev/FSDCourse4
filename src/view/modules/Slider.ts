import { Range } from './range';
import { Thumb } from './thumb';
import { ThumbLabel } from './thumbLabel';
import { RangeLabel } from './rangeLabel';
import { ColoredRange } from './coloredRange';
export class Slider {

 private thumbFrom: Thumb;
 private thumbTo: Thumb;
 private range: Range;
 private thumbLabelFrom: ThumbLabel;
 private thumbLabelTo: ThumbLabel;
 private rangeLabel: RangeLabel;
 private rootElem: HTMLDivElement;
 private container: HTMLDivElement;
 private coloredRange: ColoredRange;
 private isRange: boolean | undefined;

 constructor(rootElem: HTMLDivElement, isRange?: boolean | undefined) {
  this.isRange = isRange;
  this.rootElem = rootElem;
  this.thumbTo = new Thumb();
  this.thumbLabelTo = new ThumbLabel(this.thumbTo.getThumb());
  this.thumbFrom = new Thumb();
  this.range = new Range();
  this.coloredRange = new ColoredRange();
  this.thumbLabelFrom = new ThumbLabel(this.thumbFrom.getThumb());
  this.rangeLabel = new RangeLabel();
  this.container = document.createElement('div');
 }

 render() {
  this.container.classList.add('fsd-slider');
  this.container.appendChild(this.range.getRange());
  this.range.getRange().appendChild(this.coloredRange.getColoredRange());
  this.range.getRange().appendChild(this.thumbFrom.getThumb());
  this.thumbFrom.getThumb().appendChild(this.thumbLabelFrom.getThumbLabelContainer());
  if (this.isRange) {
   this.thumbTo.getThumb().appendChild(this.thumbLabelTo?.getThumbLabelContainer());
   this.range.getRange().appendChild(this.thumbTo.getThumb());
  }
  this.container.appendChild(this.rangeLabel.getRangeLabel());
  this.rootElem.appendChild(this.container);
 }
 getRange() {
  return this.range.getRange();
 }
 getThumbFrom() {
  return this.thumbFrom.getThumb();
 }
 getThumbTo() {
  return this.thumbTo.getThumb();
 }
 getThumbLabelFrom() {
  return this.thumbLabelFrom;
 }
 getThumbLabelTo() {
  return this.thumbLabelTo;
 }
 getColoredRange() {
  return this.coloredRange;
 }
 setWidthToColoredRange(value: number, isVertical: boolean | undefined) {
  if (isVertical) {
   this.coloredRange.getColoredRange().style.height = value + this.thumbFrom.getThumb().offsetHeight / 4 + 'px';
  }
  else {
   this.coloredRange.getColoredRange().style.width = value + this.thumbFrom.getThumb().offsetWidth / 4 + 'px';
  }
 }
 setMaxRange(value: number) {
  this.rangeLabel.setMaxRange(value);
 }
 setMinRange(value: number) {
  this.rangeLabel.setMinRange(value);
 }
 setValueToLabelThumbFrom(value: number) {
  this.thumbLabelFrom.setValueToLabel(value);
 }
 setValueToLabelThumbTo(value: number) {
  this.thumbLabelTo.setValueToLabel(value);
 }
 setVertical() {
  this.container.classList.add('fsd-slider_is_vertical');
  this.range.getRange().classList.add('fsd-slider_is_vertical');
  this.coloredRange.getColoredRange().classList.add('fsd-slider__colored-range_is_vertical');
  this.rangeLabel.getRangeLabel().classList.add('fsd-slider__range-label_is_vertical');
  this.thumbLabelFrom.getThumbLabelContainer().classList.add('fsd-slider__thumb-label_is_vertical');
 }
}