import { ISettings } from '../model/ISettings';
import { Slider } from './modules/Slider';
import { Messages } from '../utils/Messages';
import { Constants } from '../utils/Constants';
import { EventObservable } from '../observers/EventObservable';
class View extends EventObservable {
  private slider: Slider;
  private settings: ISettings;
  private rootElem: HTMLDivElement;
  private resPercentage: number;
  constructor(settings: ISettings, root: HTMLDivElement,) {
    super();
    this.settings = settings;
    this.rootElem = root;
    this.slider = new Slider(this.rootElem, this.settings, Constants.NUMBER_OF_MARKING);
    this.resPercentage = 0;
  }
  private render():void {
    this.slider.render();
    if (this.settings.hideThumbLabel) {
      this.slider.getThumbLabelFrom().hideLabel();
      if (this.settings.isRange) {
        this.slider.getThumbLabelTo().hideLabel();
      }
    }
    if (this.settings.isVertical) {
      this.slider.setVertical();
    }
    this.bindEvents();
  }
  bindEvents():void {
    this.getThumbFrom().addEventListener('mousedown', this.handleThumb.bind(this,"thumbFrom"));
    this.getRangeLabel().onmousedown = this.handleRange.bind(this);
    if (this.settings.isRange) {
      this.getThumbTo().addEventListener('mousedown', this.handleThumb.bind(this,"thumbTo"));
    }
  }
  private handleThumb(data:string,e:MouseEvent):void{
    e.preventDefault();
    let targetElem:HTMLDivElement = this.getThumbFrom();
    if(data==="thumbTo"){
      targetElem = this.getThumbTo();
    }
    let shift:number;
    if(this.settings.isVertical){
      shift = e.clientY - targetElem.getBoundingClientRect().top;
    }
    else{
      shift = e.clientX - targetElem.getBoundingClientRect().left;
    }
    if (this.settings.isVertical) {
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
          if (that.settings.isRange) {
            const toPos = that.getThumbTo().getBoundingClientRect().top - (that.getRange().getBoundingClientRect().top - that.getThumbLengthInPx() / 4);
            if(data==="thumbFrom"){
              bottom = toPos;
            }
          }
          if (newPos > bottom) {
            newPos = bottom;
          }
          that.resPercentage = that.convertFromPxToPercent(newPos);
          targetElem.style.top = that.resPercentage + '%';
        if (data === "thumbFrom") {
          that.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: that.resPercentage }));
        }
        else if (data === "thumbTo") {
          that.notifyObservers(Messages.SET_TO, JSON.stringify({ to: that.resPercentage }));
        }
      }
      // eslint-disable-next-line no-inner-declarations
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
      
    }
    else {//horizontal slider view
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      //eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      //eslint-disable-next-line no-inner-declarations
      function onMouseMove(e: MouseEvent) {
        let newPos = e.clientX - shift - that.getRange().getBoundingClientRect().left;
        if(data==="thumbTo"){
          const fromPos = that.getThumbFrom().getBoundingClientRect().left - (that.getRange().getBoundingClientRect().left - that.getThumbLengthInPx() / 2);
          if (newPos < fromPos ) {
            newPos = fromPos;
          }
        }
        else{
          if (newPos < -that.getThumbFrom().offsetWidth / 2) {
            newPos = -that.getThumbFrom().offsetWidth / 2;
          }
        }
        let rightEdge = that.getSliderLengthInPx() - that.getThumbFrom().offsetWidth / 4;
        
        if (that.settings.isRange) {
          const toPos = that.getThumbTo().getBoundingClientRect().left - (that.getRange().getBoundingClientRect().left - that.getThumbLengthInPx() / 4);
          if(data==="thumbFrom"){
            rightEdge = toPos;
          }
        }
        if (newPos > rightEdge) {
          newPos = rightEdge;
        }
        that.resPercentage = that.convertFromPxToPercent(newPos);
        targetElem.style.left = that.resPercentage + '%';
        if (data === "thumbFrom") {
          that.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: that.resPercentage }));
        }
        else if (data === "thumbTo") {
          that.notifyObservers(Messages.SET_TO, JSON.stringify({ to: that.resPercentage }));
        }
      }
      // eslint-disable-next-line no-inner-declarations
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
      
    }
    this.setColoredRange();
  }
 
  refreshView(msg: Messages, s: ISettings):void {
    if (msg === Messages.INIT) {
      this.render();
    }
    if (msg === Messages.INIT || msg === Messages.UPDATE) {
      this.updateViewSettings(s);
      if (!s.hideThumbLabel) {
        this.slider.getThumbLabelFrom().showLabel();
        this.setThumbToValue('thumbFrom');
        if (s.isRange) {
          this.setThumbToValue('thumbTo');
          this.slider.getThumbLabelTo().showLabel();
        }
      }
      else {
        this.slider.getThumbLabelFrom().hideLabel();
        if (s.isRange) {
          this.slider.getThumbLabelTo().hideLabel();
        }
      }
      this.slider.setMinRange(s.min);
      this.slider.setMaxRange(s.max);
      this.slider.setValueToLabelThumbFrom(s.from);
      if (s.isRange) {
        this.slider.setValueToLabelThumbTo(s.to!==undefined?s.to:s.from);

        if (s.isVertical) {
          this.getThumbTo().style.top = (
            (Math.abs((s.to !== undefined ? s.to : s.from) - s.min) / Math.abs(s.max - s.min)) * 100 - this.getThumbLengthInPercentage()) + '%';
          this.getThumbFrom().style.top = (Math.abs(s.from - s.min) / Math.abs(s.max - s.min)) * 100 + '%';
        }
        else {
          this.getThumbTo().style.left = ((Math.abs((s.to !== undefined ? s.to : s.from) - s.min) / Math.abs(s.max - s.min)) * 100 - this.getThumbLengthInPercentage()) + '%';
          this.getThumbFrom().style.left = (Math.abs(s.from - s.min) / Math.abs(s.max - s.min)) * 100 + '%';
        }
        this.setColoredRange();
      }
      else {
        if (s.isVertical) {
          this.getThumbFrom().style.top = (Math.abs(s.from - s.min) / Math.abs(s.max - s.min)) * 100 + '%';
        }
        else {
          this.getThumbFrom().style.left = (Math.abs(s.from - s.min) / Math.abs(s.max - s.min)) * 100 + '%';
        }
        this.setColoredRange();
      }
    }
    else if (msg === Messages.FROM_IS_SET) {
      this.slider.setValueToLabelThumbFrom(s.from);
      this.setColoredRange();
    }
    else if (msg === Messages.TO_IS_SET) {
      this.slider.setValueToLabelThumbTo(s.to!==undefined?s.to:s.from);
      this.setColoredRange();
    }
  }

  private setColoredRange():void {
    if (this.settings.isRange) {
      if (this.settings.isVertical) {
        this.slider.getColoredRange().style.top = (this.getThumbFrom().getBoundingClientRect().top) - this.getRange().getBoundingClientRect().top + this.getThumbLengthInPx() / 2 + 'px';
        this.slider.getColoredRange().style.height = (this.getThumbTo().getBoundingClientRect().top - this.getThumbFrom().getBoundingClientRect().top + this.getThumbLengthInPx() / 2) + 'px';
      }
      else {
        this.slider.getColoredRange().style.left = (this.getThumbFrom().getBoundingClientRect().left - this.getRange().getBoundingClientRect().left) + 'px';
        this.slider.getColoredRange().style.width = (this.getThumbTo().getBoundingClientRect().left - (this.getThumbFrom().getBoundingClientRect().left - this.getThumbLengthInPx() / 2)) + 'px';
      }
    }
    else {
      if (this.settings.isVertical) {
        this.slider.getColoredRange().style.height = (this.getThumbFrom().getBoundingClientRect().top - (this.getRange().getBoundingClientRect().top - this.getThumbLengthInPx() / 2)) + 'px';
      }
      else {
        this.slider.getColoredRange().style.width = (this.getThumbFrom().getBoundingClientRect().left - (this.getRange().getBoundingClientRect().left - this.getThumbLengthInPx() / 2)) + 'px';
      }
    }
  }
  private handleRange(e: MouseEvent) {
    let shift:number;
    if(this.settings.isVertical){
      shift = e.clientY - this.getRange().getBoundingClientRect().top;
    }
    else{
      shift = e.clientX - this.getRange().getBoundingClientRect().left;
    }
    if (this.settings.isVertical) {//vertical mode
      const fromPos = this.getThumbFrom().getBoundingClientRect().top - (this.getRange().getBoundingClientRect().top - this.getThumbLengthInPx() / 2);
      if (this.settings.isRange) {
        const toPos = this.getThumbTo().getBoundingClientRect().top - (this.getRange().getBoundingClientRect().top - this.getThumbLengthInPx() / 2);
        if (shift < fromPos) {
          this.resPercentage = this.convertFromPxToPercent(shift);
          this.getThumbFrom().style.top = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage }));
        }
        else if (shift > toPos) {
          this.resPercentage = this.convertFromPxToPercent(shift);
          this.getThumbTo().style.top = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage}));
        }
        else if (shift >= fromPos && shift <= toPos) {
          const pivot = (toPos - fromPos);
          if (shift < pivot) {
            this.resPercentage = this.convertFromPxToPercent(shift);
            this.getThumbFrom().style.top = this.resPercentage + '%';
            this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage}));
          }
          else if (shift >= pivot) {
            this.resPercentage = this.convertFromPxToPercent(shift);
            this.getThumbTo().style.top = this.resPercentage + '%';
            this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage}));
          }
        }
      }
      else {
        if (shift < fromPos) {
          this.resPercentage = this.convertFromPxToPercent(shift);
          this.getThumbFrom().style.top = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage}));
        }
        else {   //vertical mode single thumb 
          this.resPercentage = this.convertFromPxToPercent(shift);
          this.getThumbFrom().style.top = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage}));
        }
      }
    } else { //horizontal mode
      const fromPos = this.getThumbFrom().getBoundingClientRect().left - (this.getRange().getBoundingClientRect().left - this.getThumbLengthInPx() / 2);
      if (this.settings.isRange) {
        const toPos = this.getThumbTo().getBoundingClientRect().left - (this.getRange().getBoundingClientRect().left - this.getThumbLengthInPx() / 2);
        if (shift < fromPos) {
          this.resPercentage = this.convertFromPxToPercent(shift);
          this.getThumbFrom().style.left = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage}));
        }
        else if (shift > toPos) {
          this.resPercentage = this.convertFromPxToPercent(shift);
          this.getThumbTo().style.left = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage}));
        }
        else if (shift >= fromPos && shift <= toPos) {
          const pivot = toPos - fromPos;
          if (shift < pivot) {
            this.resPercentage = this.convertFromPxToPercent(shift);
            this.getThumbFrom().style.left = this.resPercentage + '%';
            this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage}));
          }
          else if (shift >= pivot) {
            this.resPercentage = this.convertFromPxToPercent(shift);
            this.getThumbTo().style.left = this.resPercentage + '%';
            this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage}));
          }
        }
      }
      else { //horizontal mode single thumb
        this.resPercentage = this.convertFromPxToPercent(shift);
        this.getThumbFrom().style.left = this.resPercentage + '%';
        this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage}));
      }
    }
    this.setColoredRange();
  }

  private convertFromPxToPercent(valueInPX: number) {
    return +((valueInPX / this.getSliderLengthInPx()) * 100).toFixed(2);
  }

  private convertFromValueToPercent(value: number): number {
    return +((100 / Math.abs(this.settings.max - this.settings.min)) * (Math.abs(value - this.settings.min))).toFixed(2);
  }
  private setThumbToValue(type: string) :void{
    if (type === 'thumbFrom') {
      if (this.settings.isVertical) {
        this.getThumbFrom().style.top = this.convertFromValueToPercent(this.settings.from) + '%';
      }
      else {
        this.getThumbFrom().style.left = this.convertFromValueToPercent(this.settings.from) + '%';
      }
      this.setColoredRange();
    }
    else {
      if (this.settings.isVertical) {
        this.getThumbTo().style.top = 
          this.convertFromValueToPercent(this.settings.to !== undefined ? this.settings.to : this.settings.from) + '%';
      }
      else {
        this.getThumbTo().style.left 
        = this.convertFromValueToPercent(this.settings.to!==undefined?this.settings.to:this.settings.from) + '%';
      }
      this.setColoredRange();
    }
  }
  private getRangeLabel(): HTMLDivElement {
    return this.slider.getRangeLabel();
  }
  getSlider(): Slider {
    return this.slider;
  }
  private getSliderLengthInPx() {
    if (this.settings.isVertical) {
      return this.getRange().offsetHeight + this.getThumbFrom().offsetHeight;
    }
    else {
      return this.getRange().offsetWidth + this.getThumbFrom().offsetWidth;
    }
  }
  private getThumbLengthInPx() {
    if (this.settings.isVertical) {
      return this.getThumbFrom().offsetHeight;
    }
    else {
      return this.getThumbFrom().offsetWidth;
    }
  }
  private getThumbLengthInPercentage() {
    if (this.settings.isVertical) {
      return +((this.getThumbFrom().offsetHeight / this.getSliderLengthInPx()) * 100).toFixed(1);
    }
    else {
      return +((this.getThumbFrom().offsetWidth / this.getSliderLengthInPx()) * 100).toFixed(1);
    }
  }
  private getRange() {
    return this.slider.getRange();
  }
  private getThumbFrom() {
    return this.slider.getThumbFrom();
  }

  private getThumbTo() {
    return this.slider.getThumbTo();
  }
  private updateViewSettings(s: ISettings) {
    this.settings = Object.assign(this.settings, s);
  }
}

export {View}