import { ISettings } from '../model/ISettings';
import { Slider } from './modules/Slider';
import { Messages } from '../utils/Messages';
import { Constants } from '../utils/Constants';
import { EventObservable } from '../observers/EventObservable';
import { defaultSettings } from '../model/defaultSettings';
import { IViewSettings } from '../model/IViewSettings';
class View extends EventObservable {
  private slider: Slider;
  private viewSettings: IViewSettings;
  private rootElem: HTMLDivElement;
  private resPercentage: number;

  constructor(root: HTMLDivElement) {
    super();
    this.viewSettings = Object.assign({},defaultSettings);
    this.rootElem = root;
    this.slider = new Slider(this.rootElem, Constants.NUMBER_OF_MARKING);
    this.resPercentage = 0;
  }
  private render(s:IViewSettings):void {
    this.slider.render(JSON.stringify(s));
    if (this.viewSettings.hideThumbLabel) {
      this.slider.getThumbLabelFrom().hideLabel();
      if (this.viewSettings.isRange) {
        this.slider.getThumbLabelTo().hideLabel();
      }
    }
    if (this.viewSettings.isVertical) {
      this.slider.setVertical();
    }
    this.bindEvents();
  }
  bindEvents():void {
    this.getThumbFrom().addEventListener('mousedown', this.handleThumb.bind(this, "thumbFrom"));
    this.getRangeLabel().addEventListener('mousedown',this.handleRange.bind(this));
    if (this.viewSettings.isRange) {
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
    if(this.viewSettings.isVertical){
      shift = e.clientY - targetElem.getBoundingClientRect().top;
    }
    else{
      shift = e.clientX - targetElem.getBoundingClientRect().left;
    }
    if (this.viewSettings.isVertical) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      // eslint-disable-next-line no-inner-declarations
      function onMouseMove(event: MouseEvent) {
        let newPos = event.clientY - shift - that.getRange().getBoundingClientRect().top;
        if (data === "thumbTo") {
          const fromPos = that.getThumbFrom().getBoundingClientRect().top - (that.getRange().getBoundingClientRect().top - that.getSlider().getThumbLengthInPx() / 2);
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
            if(data==="thumbFrom"){
              bottom = toPos;
            }
          }
          if (newPos > bottom) {
            newPos = bottom;
          }
          that.dispatchEvent(newPos,data);
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
        
        if (that.viewSettings.isRange) {
          const toPos = that.getThumbTo().getBoundingClientRect().left - (that.getRange().getBoundingClientRect().left - that.getThumbLengthInPx() / 4);
          if(data==="thumbFrom"){
            rightEdge = toPos;
          }
        }
        if (newPos > rightEdge) {
          newPos = rightEdge;
        }
        that.dispatchEvent(newPos,data);
      }
      // eslint-disable-next-line no-inner-declarations
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
      
    }
    this.setColoredRange();
  }
  getThumbLengthInPx():number {
    return this.getSlider().getThumbLengthInPx();
  }

  refreshView(msg: Messages, s: ISettings):void {
    if (msg === Messages.INIT) {
      this.updateViewSettings(s);
      this.render(this.viewSettings);
    }
    if (msg === Messages.INIT || msg === Messages.UPDATE) {
      this.updateViewSettings(s);
      if (!s.hideThumbLabel) {
        this.slider.getThumbLabelFrom().showLabel();
        this.setThumbToValue(s,'thumbFrom');
        if (s.isRange) {
          this.setThumbToValue(s,'thumbTo');
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


  private handleRange(e: MouseEvent) {
    let shift:number,fromPos:number;
    if(this.viewSettings.isVertical){
      shift = e.clientY - this.getRange().getBoundingClientRect().top;
      fromPos = this.getThumbFrom().getBoundingClientRect().top - (this.getRange().getBoundingClientRect().top - this.getThumbLengthInPx() / 2);
    }
    else{
      shift = e.clientX - this.getRange().getBoundingClientRect().left;
      fromPos = this.getThumbFrom().getBoundingClientRect().left - (this.getRange().getBoundingClientRect().left - this.getThumbLengthInPx() / 2);
    }
    if (this.viewSettings.isVertical) {//vertical mode
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
    } else { //horizontal mode
      
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
            this.dispatchEvent(shift,"thumbTo");
          }
        }
      }
      else { //horizontal mode single thumb
        this.dispatchEvent(shift,"thumbFrom");
      }
    }
    this.setColoredRange();
    
  }
  private setColoredRange():void{
    this.getSlider().setColoredRange();
  }
  private convertFromPxToPercent(valueInPX: number) {
    return +((valueInPX / this.getSliderLengthInPx()) * 100).toFixed(2);
  }

  private convertFromValueToPercent(s:ISettings,value: number): number {
    return +((100 / Math.abs(s.max - s.min)) * (Math.abs(value - s.min))).toFixed(2);
  }
  private dispatchEvent(shift:number,type:string){
    this.resPercentage = this.convertFromPxToPercent(shift);
    if(type==="thumbFrom"){
      if(this.viewSettings.isVertical){
        this.getThumbFrom().style.top = this.resPercentage + '%';
      }
      else{
        this.getThumbFrom().style.left = this.resPercentage + '%';
      }
      this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage }));
    }
    else{
      if (this.viewSettings.isVertical) {
        this.getThumbTo().style.top = this.resPercentage + '%';
      }
      else {
        this.getThumbTo().style.left = this.resPercentage + '%';
      }
      this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage }));
    }
  }
  private setThumbToValue(s:ISettings,type: string) :void{
    if (type === 'thumbFrom') {
      if (this.viewSettings.isVertical) {
        this.getThumbFrom().style.top = this.convertFromValueToPercent(s,s.from) + '%';
      }
      else {
        this.getThumbFrom().style.left = this.convertFromValueToPercent(s,s.from) + '%';
      }
      this.setColoredRange();
    }
    else {
      if (this.viewSettings.isVertical) {
        this.getThumbTo().style.top = 
          this.convertFromValueToPercent(s,s.to !== undefined ? s.to : s.from) + '%';
      }
      else {
        this.getThumbTo().style.left 
        = this.convertFromValueToPercent(s,s.to!==undefined?s.to:s.from) + '%';
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
    if (this.viewSettings.isVertical) {
      return this.getRange().offsetHeight + this.getThumbFrom().offsetHeight;
    }
    else {
      return this.getRange().offsetWidth + this.getThumbFrom().offsetWidth;
    }
  }
  
  private getThumbLengthInPercentage() {
    if (this.viewSettings.isVertical) {
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
    this.viewSettings = Object.assign(this.viewSettings, s);
  }
}

export {View}