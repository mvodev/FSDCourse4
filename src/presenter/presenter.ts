import { ISettings } from '../model/ISettings';
import { Model } from '../model/model';
import { View } from '../view/view';
import { Utils } from '../utils/Utils';
import { Messages } from '../utils/Messages';
import { IObserver } from '../observers/IObserver';
export class Presenter implements IObserver {

  private view: View;
  private model: Model;
  private callback: Function;
  private result: ISettings;
  private isUpdated: boolean;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
    this.isUpdated = false;
    this.result = {
      min: 0,
      max: 0,
      from: 0,
    };
  }

  handleEvent(msg: Messages, s: ISettings) {
    if (msg === Messages.INIT) {
      this.initialize();
    }
    else if (msg === Messages.UPDATE) {
      this.view.refreshView(Messages.UPDATE, s);
    }
    else if (msg === Messages.SET_FROM) {
      this.model.setFrom(s.from);
      this.view.refreshView(Messages.FROM_IS_SET, { from: this.model.getFrom(), to: 0, min: 0, max: 0 });
    }
    else if (msg === Messages.SET_TO) {
      this.model.setTo(s.to);
      this.view.refreshView(Messages.TO_IS_SET, { to: this.model.getTo(), from: 0, min: 0, max: 0 });
    }
  }

  initialize() {
    this.view.render();
    this.view.refreshView(Messages.INIT, this.model.getSettings());
  }
  private isUpdate() {
    return this.isUpdated;
  }
  setIsUpdate(value: boolean) {
    this.isUpdated = value;
  }

  update(newSettings: ISettings) {
    this.view.refreshView(Messages.UPDATE, newSettings);

  }
  isVerticalSlider(): boolean | undefined {
    return this.model.isVertical();
  }
  isRangeSlider(): boolean | undefined {
    return this.model.isRange();
  }
  withThumbLabel(): boolean | undefined {
    return this.model.showThumbLabel();
  }

  // getPosInPxFromValue(value: number): number {
  //   return (this.view.getSliderLengthInPx() / Math.abs(this.model.getMax() - this.model.getMin())) * (Math.abs(value - this.model.getMin()));
  // }
  // getValueFromPosInPx(valueInPx: number): number {
  //   return +(Math.floor(valueInPx /
  //     (
  //       this.view.getSliderLengthInPx()
  //       /
  //       (
  //         (Math.abs(this.model.getMax() - this.model.getMin())) / this.model.getStep()
  //       )

  //     )) * this.model.getStep()
  //     + this.model.getMin()).toFixed(Utils.numDigitsAfterDecimal(this.model.getStep()));
  // }
  // refreshView() {
  //   this.view.refreshView(this.model.getSettings());
  // }

  callOnChange() {
    this.result.from = this.model.getFrom();
    if (this.model.isRange) {
      this.result.to = this.model.getTo();
    }
    if (this.model.getOnChangeCallback()) {
      this.model.getOnChangeCallback().call(this, this.result);
    }
  }
}