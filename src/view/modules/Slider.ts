import { Range } from './range';
import { Messages } from '../../utils/Messages';
import { Thumb } from './thumb';
import { ThumbLabel } from './thumbLabel';
import { RangeLabel } from './rangeLabel';
import { ColoredRange } from './coloredRange';
import { ISettings } from '../../model/ISettings';
import { defaultSettings } from '../../model/defaultSettings';
import { EventObservable } from '../../observers/EventObservable';
class Slider extends EventObservable{
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
private resPercentage: number;
constructor(rootElem: HTMLDivElement, numberOfMarking: number) {
  super();
  this.viewSettings = Object.assign({},defaultSettings);
  this.rootElem = rootElem;
  this.numberOfMarking = numberOfMarking;
  this.resPercentage = 0;
  this.initSliderComponents();
}
render(settings:string) :void{
  this.viewSettings = Object.assign(this.viewSettings,JSON.parse(settings));
  this.container.classList.add('fsd-slider');
  this.container.appendChild(this.range.getRange());
  this.range.getRange().appendChild(this.coloredRange.getColoredRange());
  this.range.getRange().appendChild(this.thumbFrom.getThumb());
  this.rangeLabel.render(settings,this.numberOfMarking);
  this.thumbFrom.getThumb().appendChild(this.thumbLabelFrom.getThumbLabelContainer());
  if (this.viewSettings.isRange) {
    this.thumbTo.getThumb().appendChild(this.thumbLabelTo.getThumbLabelContainer());
    this.range.getRange().appendChild(this.thumbTo.getThumb());
  }
  this.container.appendChild(this.rangeLabel.getRangeLabel());
  this.rootElem.appendChild(this.container);
  this.bindEvents();
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
 bindEvents(): void {
  this.getRangeLabel().addEventListener('mousedown', this.handleRange.bind(this));
  this.getThumbFrom().addEventListener('mousedown', this.handleThumb.bind(this, "thumbFrom"));
  if (this.viewSettings.isRange) {
    this.getThumbTo().addEventListener('mousedown', this.handleThumb.bind(this, "thumbTo"));
  }
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
 
 setColoredRange(): void {
  this.coloredRange.setColoredRange(
      this.viewSettings,
      this.getThumbFrom(),
      this.getThumbTo(),
      this.getRange(),
      this.getThumbLengthInPx());
  }
  getThumbLengthInPx() :number{
    return this.getThumbFrom().offsetHeight;
  }
  private handleThumb(data: string, e: MouseEvent): void {
    e.preventDefault();
    let targetElem: HTMLDivElement = this.getThumbFrom();
    if (data === "thumbTo") {
      targetElem = this.getThumbTo();
    }
    let shift: number;
    if (this.viewSettings.isVertical) {
      shift = e.clientY - targetElem.getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
   // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
   // eslint-disable-next-line no-inner-declarations
    function onMouseMove(event: MouseEvent) {
      let newPos = event.clientY - shift - that.getRange().getBoundingClientRect().top;
      if (data === "thumbTo") {
      const fromPos = that.getThumbFrom().getBoundingClientRect().top - (that.getRange().getBoundingClientRect().top - that.getThumbLengthInPx() / 2);
      if (newPos < fromPos) {
        newPos = fromPos;
      }
      }
      else {
        if (newPos < -that.getThumbFrom().offsetWidth / 2) {
          newPos = -that.getThumbFrom().offsetWidth / 2;
        }
      }
      let bottom = that.getSliderLengthInPx() - that.getThumbLengthInPx() / 4;
      if (that.viewSettings.isRange) {
        const toPos = that.getThumbTo().getBoundingClientRect().top - (that.getRange().getBoundingClientRect().top - that.getThumbLengthInPx() / 4);
      if (data === "thumbFrom") {
        bottom = toPos;
      }
      }
      if (newPos > bottom) {
        newPos = bottom;
      }
      that.dispatchEvent(newPos, data);
    }
   // eslint-disable-next-line no-inner-declarations
    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }
    }
    else {
    shift = e.clientX - targetElem.getBoundingClientRect().left;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
   //eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
   //eslint-disable-next-line no-inner-declarations
    function onMouseMove(e: MouseEvent) {
      let newPos = e.clientX - shift - that.getRange().getBoundingClientRect().left;
      if (data === "thumbTo") {
        const fromPos = that.getThumbFrom().getBoundingClientRect().left - (that.getRange().getBoundingClientRect().left - that.getThumbLengthInPx() / 2);
      if (newPos < fromPos) {
        newPos = fromPos;
      }
      }
      else {
        if (newPos < -that.getThumbFrom().offsetWidth / 2) {
        newPos = -that.getThumbFrom().offsetWidth / 2;
        }
      }
      let rightEdge = that.getSliderLengthInPx() - that.getThumbFrom().offsetWidth / 4;
      if (that.viewSettings.isRange) {
        const toPos = that.getThumbTo().getBoundingClientRect().left - (that.getRange().getBoundingClientRect().left - that.getThumbLengthInPx() / 4);
      if (data === "thumbFrom") {
        rightEdge = toPos;
      }
      }
      if (newPos > rightEdge) {
        newPos = rightEdge;
      }
      that.dispatchEvent(newPos, data);
      }
   // eslint-disable-next-line no-inner-declarations
    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }
  }
  this.setColoredRange();
}
private handleRange(e: MouseEvent) {
  let shift: number, fromPos: number;
  if (this.viewSettings.isVertical) {
    shift = e.clientY - this.getRange().getBoundingClientRect().top;
    fromPos = this.getThumbFrom().getBoundingClientRect().top - (this.getRange().getBoundingClientRect().top - this.getThumbLengthInPx() / 2);
    if (this.viewSettings.isRange) {
    const toPos = this.getThumbTo().getBoundingClientRect().top - (this.getRange().getBoundingClientRect().top - this.getThumbLengthInPx() / 2);
    if (shift < fromPos) {
      this.dispatchEvent(shift, "thumbFrom");
    }
    else if (shift > toPos) {
      this.dispatchEvent(shift, "thumbTo");
    }
    else if (shift >= fromPos && shift <= toPos) {
      const pivot = (toPos - fromPos);
      if (shift < pivot) {
      this.dispatchEvent(shift, "thumbFrom");
      }
      else if (shift >= pivot) {
        this.dispatchEvent(shift, "thumbTo");
      }
    }
    }
    else {
      if (shift < fromPos) {
        this.dispatchEvent(shift, "thumbFrom");
      }
      else {   //vertical mode single thumb 
        this.dispatchEvent(shift, "thumbFrom");
      }
    }
  }
  else {
    shift = e.clientX - this.getRange().getBoundingClientRect().left;
    fromPos = this.getThumbFrom().getBoundingClientRect().left - (this.getRange().getBoundingClientRect().left - this.getThumbLengthInPx() / 2);
    if (this.viewSettings.isRange) {
      const toPos = this.getThumbTo().getBoundingClientRect().left - (this.getRange().getBoundingClientRect().left - this.getThumbLengthInPx() / 2);
    if (shift < fromPos) {
      this.dispatchEvent(shift, "thumbFrom");
    }
    else if (shift > toPos) {
      this.dispatchEvent(shift, "thumbTo");
    }
    else if (shift >= fromPos && shift <= toPos) {
      const pivot = toPos - fromPos;
      if (shift < pivot) {
        this.dispatchEvent(shift, "thumbFrom");
      }
      else if (shift >= pivot) {
        this.dispatchEvent(shift, "thumbTo");
      }
    }
    }
    else { //horizontal mode single thumb
      this.dispatchEvent(shift, "thumbFrom");
    }
  }
  this.setColoredRange();
}
private convertFromPxToPercent(valueInPX: number) {
  return +((valueInPX / this.getSliderLengthInPx()) * 100).toFixed(2);
}
private getSliderLengthInPx() {
  if (this.viewSettings.isVertical) {
    return this.getRange().offsetHeight + this.getThumbFrom().offsetHeight;
  }
  else {
    return this.getRange().offsetWidth + this.getThumbFrom().offsetWidth;
  }
}
private dispatchEvent(shift: number, type: string) {
  this.resPercentage = this.convertFromPxToPercent(shift);
  if (type === "thumbFrom") {
    if (this.viewSettings.isVertical) {
      this.getThumbFrom().style.top = this.resPercentage + '%';
    }
    else {
      this.getThumbFrom().style.left = this.resPercentage + '%';
    }
  this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage }));
  }
  else {
    if (this.viewSettings.isVertical) {
      this.getThumbTo().style.top = this.resPercentage + '%';
    }
    else {
      this.getThumbTo().style.left = this.resPercentage + '%';
    }
    this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage }));
  }
  this.setColoredRange();
}
getRange(): HTMLDivElement {
  return this.range.getRange();
}
getThumbFrom(): HTMLDivElement {
  return this.thumbFrom.getThumb();
}
getThumbTo(): HTMLDivElement {
  return this.thumbTo.getThumb();
}
getThumbLabelFrom(): ThumbLabel {
  return this.thumbLabelFrom;
}
getThumbLabelTo(): ThumbLabel {
  return this.thumbLabelTo;
}
getColoredRange(): HTMLDivElement {
  return this.coloredRange.getColoredRange();
}
setMaxRange(value: number): void {
  this.rangeLabel.setMaxRange(value);
}
setMinRange(value: number): void {
  this.rangeLabel.setMinRange(value);
}
setValueToLabelThumbFrom(value: number): void {
  this.thumbLabelFrom.setValueToLabel(value);
}
setValueToLabelThumbTo(value: number): void {
  this.thumbLabelTo.setValueToLabel(value);
}
getRangeLabel(): HTMLDivElement {
  return this.rangeLabel.getRangeLabel();
}
}
export {Slider}