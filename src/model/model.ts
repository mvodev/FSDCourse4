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
  step:1,
  isRange: false,
  isVertical: false,
  hideThumbLabel: false
  };
  constructor(settings: ISettings) {
    super();
    this.settings = Object.assign({},this.defaultSettings);
    console.log(JSON.stringify(this.settings));
    this.validateSettings(settings);
    console.log(JSON.stringify(this.settings));
  }
  getSettings(): string {
    return JSON.stringify(this.settings);
  }
  updateSettings(settings: ISettings):void {
    this.validateSettings(settings);
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
  private validateSettings(settings: ISettings):void {
    const validatedMin = Utils.isNumber(settings.min);
    const validatedMax = Utils.isNumber(settings.max);
    const validatedFrom = Utils.isNumber(settings.from);
    const validatedTo = Utils.isNumber(settings.to);
    const validatedStep = Utils.isNumber(settings.step);
    const validatedIsRange = Utils.isBoolean(settings.isRange);
    const validatedIsVertical = Utils.isBoolean(settings.isVertical);
    const validatedHideThumbLabel = Utils.isBoolean(settings.hideThumbLabel);
    this.settings.isRange = validatedIsRange;
    if(validatedMin!==undefined){
      if (validatedMin >= this.settings.max) {
        console.error('unacceptable value,min value in settings more than max value');
      }
      else{
        this.settings.min = validatedMin;
      }
    }
    if(validatedMax!==undefined){
      if(validatedMax<=this.settings.min){
        console.error('unacceptable value,max value in settings lower than min value');
      }
      else{
        this.settings.max = validatedMax;
      }
    }
    if(validatedFrom!==undefined){
      if(validatedFrom<this.settings.min){
        console.error('from must be more than min');
        this.settings.from = this.settings.min;
      }
      else if (validatedFrom > this.settings.max){
          console.error('from must be lower than max');
          this.settings.from = this.settings.min;
      }
      else if(validatedIsRange){
        if(this.settings.to!==undefined){
          if (validatedFrom >= this.settings.to) {
            console.error('from must be lower than to');
            this.settings.from = this.settings.min;
          }
        }
        else this.settings.from = validatedFrom;
      }
      
    }
    if(validatedTo!==undefined){
      if(validatedTo>this.settings.max){
        console.error('to must be lower than max');
        this.settings.to = this.settings.max;
      }
      else if(validatedTo<=this.settings.min){
        console.error('to must be lower than max');
        this.settings.to = this.settings.max;
      }
      else if(validatedIsRange){
        if(validatedTo<=this.settings.from){
          console.error('to must be lower than max');
          this.settings.to = this.settings.max;
        }
        else{
          this.settings.to = validatedTo;
        }
      }
    }
    if(validatedStep!==undefined){
      if(validatedStep<0){
        console.error('step must be positive');
      }
      else if(validatedStep>(Math.abs(this.settings.max-this.settings.min))){
        console.error('step must be lower than difference between max and min');
      }
      else{
        this.settings.step = validatedStep;
      }
    }
    this.settings.isVertical = validatedIsVertical;
    this.settings.hideThumbLabel = validatedHideThumbLabel;
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