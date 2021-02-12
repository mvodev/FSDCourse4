import { ISettings } from '../model/ISettings';
import { Slider } from './modules/Slider';
import { Messages } from '../utils/Messages';
import { Constants } from '../utils/Constants';
import { EventObservable } from '../observers/EventObservable';
class View extends EventObservable {
  private slider: Slider;
  private settings: ISettings;
  private rootElem: HTMLDivElement;
  private thumbInPercentage: number;
  private resPercentage: number;
  constructor(settings: ISettings, root: HTMLDivElement,) {
    super();
    this.settings = settings;
    this.rootElem = root;
    this.slider = new Slider(this.rootElem, this.settings, Constants.NUMBER_OF_MARKING);
    if (this.settings.isVertical) {
      this.thumbInPercentage = Math.abs(this.getThumbFrom().offsetHeight / this.slider.getRange().offsetHeight) * 100;
    }
    else {
      this.thumbInPercentage = Math.abs(this.getThumbFrom().offsetWidth / this.slider.getRange().offsetWidth) * 100;
    }
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
        let newTop = event.clientY - shift - that.getRange().getBoundingClientRect().top;
        if (data === "thumbTo") {
          const fromPos = that.getThumbFrom().getBoundingClientRect().top - (that.getRange().getBoundingClientRect().top - that.getThumbLengthInPx() / 2);
          if (newTop < fromPos) {
            newTop = fromPos;
          }
        }
        else {
          if (newTop < -that.getThumbFrom().offsetWidth / 2) {
            newTop = -that.getThumbFrom().offsetWidth / 2;
          }
        }
          let bottom = that.getSliderLengthInPx() - that.getThumbLengthInPx() / 4;
          if (that.settings.isRange) {
            const toPos = that.getThumbTo().getBoundingClientRect().top - (that.getRange().getBoundingClientRect().top - that.getThumbLengthInPx() / 4);
            if(data==="thumbFrom"){
              bottom = toPos;
            }
          }
          if (newTop > bottom) {
            newTop = bottom;
          }
          that.resPercentage = that.convertFromPxToPercent(newTop);
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
      console.log('horizontal mode');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      // eslint-disable-next-line no-inner-declarations
      function onMouseMove(e: MouseEvent) {
        let newLeft = e.clientX - shift - that.getRange().getBoundingClientRect().left;
        console.log('new left='+newLeft);
        if(data==="thumbTo"){
          const fromPos = that.getThumbFrom().getBoundingClientRect().left - (that.getRange().getBoundingClientRect().left - that.getThumbLengthInPx() / 2);
          if (newLeft < fromPos ) {
            newLeft = fromPos;
          }
        }
        else{
          if (newLeft < -that.getThumbFrom().offsetWidth / 2) {
            newLeft = -that.getThumbFrom().offsetWidth / 2;
          }
        }
        let rightEdge = that.getSliderLengthInPx() - that.getThumbFrom().offsetWidth / 4;
        
        if (that.settings.isRange) {
          const toPos = that.getThumbTo().getBoundingClientRect().left - (that.getRange().getBoundingClientRect().left - that.getThumbLengthInPx() / 4);
          if(data==="thumbFrom"){
            rightEdge = toPos;
          }
        }
        console.log('right edge=' + rightEdge);
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
        that.resPercentage = that.convertFromPxToPercent(newLeft);
        targetElem.style.left = that.resPercentage + '%';
        if (data === "thumbFrom") {
          that.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: that.resPercentage }));
        }
        else if (data === "thumbTo") {
          that.notifyObservers(Messages.SET_TO, JSON.stringify({ to: that.resPercentage }));
        }
        console.log('resPercentage='+that.resPercentage+" targetElem"+targetElem);
      }
      // eslint-disable-next-line no-inner-declarations
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
      
    }
    this.setColoredRange();
  }
  private getRangeLabel(): HTMLDivElement {
    return this.slider.getRangeLabel();
  }
  getSlider():Slider {
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
  refreshView(msg: Messages, s: ISettings):void {
    if (msg === Messages.INIT) {
      this.render();
    }
    if (msg === Messages.INIT || msg === Messages.UPDATE) {
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
        this.slider.getColoredRange().style.top = (this.getThumbFrom().getBoundingClientRect().top - 2 * this.getThumbLengthInPx()) + 'px';
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
  private handleFromThumb(e: MouseEvent) {
    e.preventDefault();
    if (this.settings.isVertical) {
      const shiftY = e.clientY - this.getThumbFrom().getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      // eslint-disable-next-line no-inner-declarations
      function onMouseMove(event: MouseEvent) {
        let newTop = event.clientY - shiftY - that.getRange().getBoundingClientRect().top;
        if (newTop < - that.getThumbLengthInPx() / 2) {
          newTop = - that.getThumbLengthInPx() / 2;
        }
        let bottom = that.getSliderLengthInPx() - that.getThumbLengthInPx() / 4;
        if (that.settings.isRange) {
          const toPos = that.getThumbTo().getBoundingClientRect().top - (that.getRange().getBoundingClientRect().top - that.getThumbLengthInPx() / 4);
          bottom = toPos;
        }
        if (newTop > bottom) {
          newTop = bottom;
        }
        that.resPercentage = that.convertFromPxToPercent(newTop);
        that.getThumbFrom().style.top = that.resPercentage + '%';
        that.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: that.resPercentage, min: that.settings.min, max: that.settings.max }));
        that.setColoredRange();
      }

      // eslint-disable-next-line no-inner-declarations
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
    else {
      const shiftX = e.clientX - this.getThumbFrom().getBoundingClientRect().left;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      // eslint-disable-next-line no-inner-declarations
      function onMouseMove(e: MouseEvent) {
        let newLeft = e.clientX - shiftX - that.getRange().getBoundingClientRect().left;
        if (newLeft < -that.getThumbFrom().offsetWidth / 2) {
          newLeft = -that.getThumbFrom().offsetWidth / 2;
        }
        let rightEdge = that.getSliderLengthInPx() - that.getThumbFrom().offsetWidth / 4;
        if (that.settings.isRange) {
          const toPos = that.getThumbTo().getBoundingClientRect().left - (that.getRange().getBoundingClientRect().left - that.getThumbLengthInPx() / 4);
          rightEdge = toPos;
        }
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
        that.resPercentage = that.convertFromPxToPercent(newLeft);
        that.getThumbFrom().style.left = that.resPercentage + '%';
        that.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: that.resPercentage, min: that.settings.min, max: that.settings.max }));
        that.setColoredRange();
      }
      // eslint-disable-next-line no-inner-declarations
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
  }
  private handleToThumb(e: MouseEvent) {
    e.preventDefault();
    if (this.settings.isVertical) {
      const shiftY = e.clientY - this.getThumbTo().getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      // eslint-disable-next-line no-inner-declarations
      function onMouseMove(event: MouseEvent) {
        let newTop = event.clientY - shiftY - that.getRange().getBoundingClientRect().top;
        const fromPos = that.getThumbFrom().getBoundingClientRect().top - (that.getRange().getBoundingClientRect().top - that.getThumbLengthInPx() / 2);
        if (newTop < fromPos) {
          newTop = fromPos;
        }
        const bottom = that.getSliderLengthInPx() - that.getThumbFrom().offsetWidth / 4;
        if (newTop > bottom) {
          newTop = bottom;
        }
        that.resPercentage = that.convertFromPxToPercent(newTop);
        that.getThumbTo().style.top = that.resPercentage + '%';
        that.notifyObservers(Messages.SET_TO, JSON.stringify({ from: 0, to: that.resPercentage, min: that.settings.min, max: that.settings.max }));
        that.setColoredRange();
      }

      // eslint-disable-next-line no-inner-declarations
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
    else {
      const shiftX = e.clientX - this.getThumbTo().getBoundingClientRect().left;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      // eslint-disable-next-line no-inner-declarations
      function onMouseMove(e: MouseEvent) {
        let newLeft = e.clientX - shiftX - that.getRange().getBoundingClientRect().left;
        const fromPos = that.getThumbFrom().getBoundingClientRect().left - (that.getRange().getBoundingClientRect().left - that.getThumbLengthInPx() / 2);
        if (newLeft < fromPos) {
          newLeft = fromPos;
        }
        const rightEdge = that.getSliderLengthInPx() - that.getThumbFrom().offsetWidth / 4;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
        that.resPercentage = that.convertFromPxToPercent(newLeft);
        that.getThumbTo().style.left = that.resPercentage + '%';
        that.notifyObservers(Messages.SET_TO, JSON.stringify({ from: 0, to: that.resPercentage, min: that.settings.min, max: that.settings.max }));
        that.setColoredRange();
      }
      // eslint-disable-next-line no-inner-declarations
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
  }
  private handleRange(e: MouseEvent) {
    if (this.settings.isVertical) {//vertical mode
      const shiftY = e.clientY - this.getRange().getBoundingClientRect().top;
      const fromPos = this.getThumbFrom().getBoundingClientRect().top - (this.getRange().getBoundingClientRect().top - this.getThumbLengthInPx() / 2);
      if (this.settings.isRange) {
        const toPos = this.getThumbTo().getBoundingClientRect().top - (this.getRange().getBoundingClientRect().top - this.getThumbLengthInPx() / 2);
        if (shiftY < fromPos) {
          this.resPercentage = this.convertFromPxToPercent(shiftY);
          this.getThumbFrom().style.top = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage, to: 0, min: this.settings.min, max: this.settings.max }));
          this.setColoredRange();
        }
        else if (shiftY > toPos) {
          this.resPercentage = this.convertFromPxToPercent(shiftY);
          this.getThumbTo().style.top = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage, from: 0, min: this.settings.min, max: this.settings.max }));
          this.setColoredRange();
        }
        else if (shiftY >= fromPos && shiftY <= toPos) {
          const pivot = (toPos - fromPos);
          if (shiftY < pivot) {
            this.resPercentage = this.convertFromPxToPercent(shiftY);
            this.getThumbFrom().style.top = this.resPercentage + '%';
            this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage, to: 0, min: this.settings.min, max: this.settings.max }));
            this.setColoredRange();
          }
          else if (shiftY >= pivot) {
            this.resPercentage = this.convertFromPxToPercent(shiftY);
            this.getThumbTo().style.top = this.resPercentage + '%';
            this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage, from: 0, min: this.settings.min, max: this.settings.max }));
            this.setColoredRange();
          }
        }
      }
      else {
        if (shiftY < fromPos) {
          this.resPercentage = this.convertFromPxToPercent(shiftY);
          this.getThumbFrom().style.top = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage, to: 0, min: this.settings.min, max: this.settings.max }));
          this.setColoredRange();
        }
        else {   //vertical mode single thumb 
          this.resPercentage = this.convertFromPxToPercent(shiftY);
          this.getThumbFrom().style.top = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage, to: 0, min: this.settings.min, max: this.settings.max }));
          this.setColoredRange();
        }
      }
    } else { //horizontal mode
      const shiftX = e.clientX - this.getRange().getBoundingClientRect().left;
      const fromPos = this.getThumbFrom().getBoundingClientRect().left - (this.getRange().getBoundingClientRect().left - this.getThumbLengthInPx() / 2);
      if (this.settings.isRange) {
        const toPos = this.getThumbTo().getBoundingClientRect().left - (this.getRange().getBoundingClientRect().left - this.getThumbLengthInPx() / 2);
        if (shiftX < fromPos) {
          this.resPercentage = this.convertFromPxToPercent(shiftX);
          this.getThumbFrom().style.left = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage, to: 0, min: this.settings.min, max: this.settings.max }));
          this.setColoredRange();
        }
        else if (shiftX > toPos) {
          this.resPercentage = this.convertFromPxToPercent(shiftX);
          this.getThumbTo().style.left = this.resPercentage + '%';
          this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage, from: 0, min: this.settings.min, max: this.settings.max }));
          this.setColoredRange();
        }
        else if (shiftX >= fromPos && shiftX <= toPos) {
          const pivot = toPos - fromPos;
          if (shiftX < pivot) {
            this.resPercentage = this.convertFromPxToPercent(shiftX);
            this.getThumbFrom().style.left = this.resPercentage + '%';
            this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage, to: 0, min: this.settings.min, max: this.settings.max }));
            this.setColoredRange();
          }
          else if (shiftX >= pivot) {
            this.resPercentage = this.convertFromPxToPercent(shiftX);
            this.getThumbTo().style.left = this.resPercentage + '%';
            this.notifyObservers(Messages.SET_TO, JSON.stringify({ to: this.resPercentage, from: 0, min: this.settings.min, max: this.settings.max }));
            this.setColoredRange();
          }
        }
      }
      else { //horizontal mode single thumb
        this.resPercentage = this.convertFromPxToPercent(shiftX);
        this.getThumbFrom().style.left = this.resPercentage + '%';
        this.notifyObservers(Messages.SET_FROM, JSON.stringify({ from: this.resPercentage, to: 0, min: this.settings.min, max: this.settings.max }));
        this.setColoredRange();
      }
    }
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
}
export {View}