import { ISettings } from '../model/ISettings';
import { Slider } from './modules/Slider';
import { Messages } from '../utils/Messages';
import { Constants } from '../utils/Constants';
import { EventObservable } from '../observers/EventObservable';
import { defaultSettings } from '../model/defaultSettings';
import { IViewSettings } from '../model/IViewSettings';
import { IObserver } from '../observers/IObserver';
class View extends EventObservable implements IObserver{
  private slider: Slider;
  private viewSettings: IViewSettings;
  private rootElem: HTMLDivElement;
  
  constructor(root: HTMLDivElement) {
    super();
    this.viewSettings = Object.assign({},defaultSettings);
    this.rootElem = root;
    this.slider = new Slider(this.rootElem, Constants.NUMBER_OF_MARKING);
  }
  handleEvent(msg: Messages, s: string): void {
    this.refreshView(msg,JSON.parse(s));
  }
  private render(s:IViewSettings):void {
    this.slider.addObserver(this);
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
  
  private setColoredRange():void{
    this.getSlider().setColoredRange();
  }

  private convertFromValueToPercent(s:ISettings,value: number): number {
    return +((100 / Math.abs(s.max - s.min)) * (Math.abs(value - s.min))).toFixed(2);
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