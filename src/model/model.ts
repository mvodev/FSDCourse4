import { Messages } from '../utils/Messages';
import { IModelFacade } from './IModelFacade';
import { ISettings } from './ISettings';
import { EventObservable } from '../observers/EventObservable';
import { Utils } from '../utils/Utils';
import {defaultSettings} from './defaultSettings';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

class Model extends EventObservable implements IModelFacade {
  private settings: ISettings
  
  constructor(settings: ISettings) {
    super();
    this.settings = Object.assign({},defaultSettings);
    this.validateSettings(settings);
  }
  getSettings(): string {
    return JSON.stringify(this.settings);
  }
  updateSettings(settings: ISettings):void {
    this.validateSettings(settings);
    this.notifyObservers(Messages.UPDATE, this.getSettings(),0);
  }
  getMin(): number {
      return this.settings.min;
  }
  getMax() :number{
    return this.settings.max;
  }
  setFrom(valueInPercent: number, thumbWidthInPercent:number): void {
    this.settings.from = this.convertFromPercentToValue(valueInPercent,thumbWidthInPercent);
  }
  getFrom(): number {
  return this.settings.from;
  }
  setTo(valueInPercent: number, thumbWidthInPercent:number): void {
    this.settings.to = this.convertFromPercentToValue(valueInPercent, thumbWidthInPercent);
  }
  getTo() :number{
    return this.settings.to;
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
    const validatedIsVertical = Utils.isBoolean(settings.isVertical);
    const validatedHideThumbLabel = Utils.isBoolean(settings.hideThumbLabel);
    
    this.settings.isRange = settings.isRange ? Utils.isBoolean(settings.isRange):this.settings.isRange;
    if(validatedMin!==undefined){
      if (validatedMin >= this.settings.max) {
        new ErrorMessage('unacceptable value,min value in settings more than max value','validate settings method of Model');
      }
      else if(validatedMin>this.settings.from){
        new ErrorMessage('unacceptable value,min value in settings more than from value', 'validate settings method of Model');
      }
      else{
        this.settings.min = validatedMin;
      }
    }
    if(validatedMax!==undefined){
      if(validatedMax<=this.settings.min){
        new ErrorMessage('unacceptable value,max value in settings lower than min value', 'validate settings method of Model');
      }
      else if (validatedMax<=this.settings.to&&this.settings.isRange){
        new ErrorMessage('unacceptable value,max value in settings lower than to value', 'validate settings method of Model');
      }
      else if (validatedMax <= this.settings.from){
        new ErrorMessage('unacceptable value,max value in settings lower than from value', 'validate settings method of Model');
      }
      else{
        this.settings.max = validatedMax;
      }
    }
    if(validatedFrom!==undefined){
      const max = this.settings.isRange?this.settings.to:this.settings.max;
      if(validatedFrom<=this.settings.min+this.settings.step||validatedFrom>=max+this.settings.step){
        new ErrorMessage('from is invalid', 'validate settings method of Model');
        this.settings.from = this.settings.min;
      }
      else{
        this.settings.from = validatedFrom;
      }
    }
    if(validatedTo!==undefined){
      if(validatedTo>this.settings.max){
        new ErrorMessage('to must be lower than max', 'validate settings method of Model');
      }
      else if(validatedTo<=this.settings.min){
        new ErrorMessage('to must be lower than max', 'validate settings method of Model');
      }
      else if(this.settings.isRange){
        if(validatedTo<=this.settings.from){
          new ErrorMessage('to must be lower than max', 'validate settings method of Model');
        }
        else{
          this.settings.to = validatedTo;
        }
      }
    }
    else{
      if(this.settings.isRange){
        if (this.settings.to!==undefined){
          if (this.settings.to<=settings.from){
            this.settings.to = this.settings.max;
            new ErrorMessage('to must be more than from', 'validate settings method of Model');
          }
        }
      }
    }
    if(validatedStep!==undefined){
      if(validatedStep<0){
        new ErrorMessage('step must be positive', 'validate settings method of Model');
      }
      else if(validatedStep>(Math.abs(this.settings.max-this.settings.min))){
        new ErrorMessage('step must be lower than difference between max and min', 'validate settings method of Model');
      }
      else{
        this.settings.step = validatedStep;
      }
    }
    if(settings.isVertical!==undefined){
      this.settings.isVertical = validatedIsVertical;
    }
    if(settings.hideThumbLabel!==undefined){
      this.settings.hideThumbLabel = validatedHideThumbLabel;
    }
  }
  
  private convertFromPercentToValue(valueInPercent: number,thumbWidthInPercent:number) {
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
    const diapason = Math.abs(this.getMax() - this.getMin());
    const res = Math.round(+((diapason * valueInPercent / (100 - thumbWidthInPercent)) + this.getMin()).toFixed(Utils.numDigitsAfterDecimal(this.getStep())) * del) / del;
    if (res < this.getMin()) return this.getMin();
    if (res > this.getMax()) return this.getMax();
    return res;
  }
}
export { Model }