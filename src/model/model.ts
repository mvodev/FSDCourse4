import { Messages } from '../utils/Messages';
import { IModelFacade } from './IModelFacade';
import { ISettings } from './ISettings';
import { EventObservable } from '../observers/EventObservable';
import { Utils } from '../utils/Utils';
class Model extends EventObservable implements IModelFacade {
  private settings: ISettings
  private defaultSettings: ISettings = {
  min: 0,
  max: 10,
  from: 5,
  step:0,
  isRange: false,
  isVertical: false,
  hideThumbLabel: false
  };
  constructor(settings: ISettings) {
    super();
    this.settings = Object.assign(this.defaultSettings, settings);
    this.validateSettings(this.settings);
  }
  getSettings(): string {
    return JSON.stringify(this.settings);
  }
  updateSettings(settings: ISettings):void {
    if (settings.min) {
      this.settings.min = settings.min;
    }
    if (settings.max) {
      this.settings.max = settings.max;
    }
    if (settings.from) {
      this.settings.from = settings.from;
    }
    if (settings.to) {
      this.settings.to = settings.to;
    }
    if (settings.hideThumbLabel === true || settings.hideThumbLabel === false) {
      this.settings.hideThumbLabel = settings.hideThumbLabel;
    }
    this.validateSettings(this.settings);
    this.notifyObservers(Messages.UPDATE, JSON.stringify(this.settings));
  }
  getMin(): number {
      return this.settings.min;
  }
  getMax() :number{
    return this.settings.max;
  }
  showThumbLabel(): boolean {
    return !this.settings.hideThumbLabel;
  }
  setFrom(valueInPercent: number): void {
    this.settings.from = this.convertFromPercentToValue(valueInPercent);
  }
  getFrom(): number {
  return this.settings.from;
  }
  setTo(valueInPercent: number): void {
    this.settings.to = this.convertFromPercentToValue(valueInPercent);
  }
  getTo(): number | undefined {
    return this.settings.to;
  }
  isRange(): boolean {
    return this.settings.isRange !== undefined ? this.settings.isRange:false;
  }
  isVertical():boolean {
    return this.settings.isVertical!==undefined?this.settings.isVertical:false;
  }
  getStep() :number{
    return this.settings.step ? this.settings.step : 0;
  }
  private validateSettings(settings: ISettings) {
    if (settings.min >= settings.max) {
      console.error('unacceptable value,min value in settings more than max value');
      this.settings.min = settings.from - 10;
    }
    if (!settings.to && settings.isRange) {
      this.settings.to = settings.max;
      console.error('unacceptable value,`to` value must be established');
    }
    if (+settings.from < +settings.min) {
      console.error('unacceptable value,from must be more than min');
      this.settings.from = settings.min;
    }
    if (+settings.from > +settings.max) {
      console.error('unacceptable value,from must be lower than max');
      this.settings.from = settings.min;
    }
    if(settings.to){
      if(settings.isRange){
        if(settings.to<settings.min){
          this.settings.to = settings.max;
          console.error('unacceptable value,`to` value must be between min and max');
        }
      }
    }
    if(settings.to){
      if(settings.isRange){
        if(settings.to<settings.from){
          console.error('unacceptable value,`to` value must be more than from');
          this.settings.to = this.settings.max;
        }
      }
    }
    if (this.getStep() < 0) {
      console.error('unacceptable value,`step` value must be positive number');
      this.settings.step = this.settings.step * (-1);
    }
    if (this.getStep() > Math.abs(this.getMax() - this.getMin())) {
      console.error('unacceptable value,`step` value must be lower than difference between max and min');
      this.settings.step = +(Math.abs(this.getMax() - this.getMin()) / 2).toFixed(1);
    }
    if(settings.isRange){
      if(settings.to){
        if(settings.to>settings.max){
          console.error('unacceptable value,to must be lower than max');
          this.settings.to = settings.max;
        }
      }
    }
    if(settings.isRange){
      if(settings.to){
        if(settings.from>settings.to){
          console.error('unacceptable value,from must be lower than to');
          this.settings.to = this.settings.from + this.settings.step ? this.settings.step : 0;
        }
      }
    }
  }
  private convertFromPercentToValue(valueInPercent: number) {
    if (valueInPercent <= 0) {
      return this.getMin();
    }
    if (valueInPercent >= 100) {
      return this.getMax();
    }
    let del = 1;
    if (this.getStep() != 0) {
      del = 1.0 / this.getStep();
    }
    const res = Math.round(+((Math.abs(this.getMax() - this.getMin()) * valueInPercent / 100) + this.getMin()).toFixed(Utils.numDigitsAfterDecimal(this.getStep())) * del) / del;
    if (res < this.getMin()) return this.getMin();
    if (res > this.getMax()) return this.getMax();
    return res;
  }
}
export { Model }