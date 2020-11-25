import { Model } from '../model/Model';
import { View } from '../view/View';
export class Controller {

  private view: View;
  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
  }
  initialize() {
    this.view.render();
    if (this.model.showThumbLabel) {
      this.setThumbToValue('thumbFrom');
      if (this.model.isRange()) {
        this.setThumbToValue('thumbTo');
      }
    }
    this.view.refreshView();
    this.view.setValueToMinRange(this.model.getMin());
    this.view.setValueToMaxRange(this.model.getMax());
  }

  bindEvents() {
    this.view.getThumbFrom().onmousedown = this.mouseFromHandler.bind(this);
    this.view.getRangeLabel().onmousedown = this.mouseRangeHandler.bind(this);
    if (this.model.isRange()) {
      this.view.getThumbTo().onmousedown = this.mouseToHandler.bind(this);
    }
  }
  start() {
    this.initialize();
    this.bindEvents();
    this.view.refreshView();
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
  setThumbToValue(type: string) {
    if (type === 'thumbFrom') {
      if (this.isVerticalSlider()) {
        let valueToThumb: number = this.getPosInPxFromValue(this.model.getFrom());
        this.view.getThumbFrom().style.top = valueToThumb + 'px';
        this.model.setFromInPx(valueToThumb);
        this.refreshView();
      }
      else {
        let valueToThumb = this.getPosInPxFromValue(this.model.getFrom());
        this.view.getThumbFrom().style.left = valueToThumb + 'px';
        this.model.setFromInPx(valueToThumb);
        this.refreshView();
      }
    }
    else {
      if (this.isVerticalSlider()) {
        let valueToThumb = this.getPosInPxFromValue(this.model.getTo());
        this.view.getThumbTo().style.top = valueToThumb + 'px';
        this.model.setToInPx(valueToThumb);
        this.view.refreshView();
      }
      else {
        let valueToThumb = this.getPosInPxFromValue(this.model.getTo());
        this.view.getThumbTo().style.left = valueToThumb + 'px';
        this.model.setToInPx(valueToThumb);
        this.view.refreshView();
      }
    }
  }
  mouseFromHandler(e: MouseEvent) {
    e.preventDefault();
    if (this.isVerticalSlider()) {
      let shiftY = e.clientY - this.view.getThumbFrom().getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      let sliderRange = this.view.getRange();
      let thumb = this.view.getThumbFrom();
      let that = this;

      function onMouseMove(event: MouseEvent) {
        let newTop = event.clientY - shiftY - sliderRange.getBoundingClientRect().top;
        if (newTop < 0) {
          newTop = 0;
        }
        let bottom = that.view.getSliderLengthInPx();
        if (that.isRangeSlider()) {
          bottom = that.model.getToInPx();
        }
        if (newTop > bottom) {
          newTop = bottom;
        }

        //thumb.style.top = newTop + 'px';
        that.model.setFromInPx(newTop);

        that.setValueToThumb();
        that.view.refreshView();
      }

      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
    else {
      let shiftX = e.clientX - this.view.getThumbFrom().getBoundingClientRect().left;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      let sliderRange = this.view.getRange();
      let thumb = this.view.getThumbFrom();
      let that = this;

      function onMouseMove(e: MouseEvent) {
        let newLeft = e.clientX - shiftX - sliderRange.getBoundingClientRect().left;
        if (newLeft < 0) {
          newLeft = 0;
        }
        let rightEdge = that.view.getSliderLengthInPx();
        if (that.isRangeSlider()) {
          rightEdge = that.model.getToInPx();
        }
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
        //thumb.style.left = newLeft + 'px';
        that.model.setFromInPx(newLeft);
        that.setValueToThumb();
        that.view.refreshView();
      }
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
  }

  mouseToHandler(e: MouseEvent) {
    e.preventDefault();
    if (this.isVerticalSlider()) {
      let shiftY = e.clientY - this.view.getThumbTo().getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      let sliderRange = this.view.getRange();

      let thumb = this.view.getThumbTo();
      let that = this;

      function onMouseMove(event: MouseEvent) {
        let newTop = event.clientY - shiftY - sliderRange.getBoundingClientRect().top;
        if (newTop < that.model.getFromInPx()) {
          newTop = that.model.getFromInPx() + 1;
        }
        let bottom = sliderRange.offsetHeight - thumb.offsetHeight;

        if (newTop > bottom) {
          newTop = bottom;
        }

        //thumb.style.top = newTop + 'px';
        that.model.setToInPx(newTop);
        that.setValueToThumb();
        that.refreshView();
      }

      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
    else {
      let shiftX = e.clientX - this.view.getThumbTo().getBoundingClientRect().left;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      let sliderRange = this.view.getRange();
      let thumb = this.view.getThumbTo();
      let that = this;

      function onMouseMove(e: MouseEvent) {
        let newLeft = e.clientX - shiftX - sliderRange.getBoundingClientRect().left;
        if (newLeft < that.model.getFromInPx()) {
          newLeft = that.model.getFromInPx() + 1;
        }
        let rightEdge = sliderRange.offsetWidth - thumb.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
        //thumb.style.left = newLeft + 'px';
        that.model.setToInPx(newLeft);
        that.setValueToThumb();
        that.refreshView();
      }
      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
  }
  mouseRangeHandler(e: MouseEvent) {
    if (this.isVerticalSlider()) {
      if (this.model.isRange()) {
        let shiftY = e.clientY - this.view.getRange().getBoundingClientRect().top;
        if (shiftY < this.model.getFromInPx()) {
          this.model.setFromInPx(shiftY);
          this.setValueToThumb();
          this.refreshView();
        }
        else if (shiftY > this.model.getToInPx()) {
          this.model.setToInPx(shiftY);
          this.setValueToThumb();
          this.refreshView();
        }
        else if (shiftY >= this.model.getFromInPx() && shiftY <= this.model.getToInPx()) {
          let pivot = (this.model.getToInPx() - this.model.getFromInPx());
          if (shiftY < pivot) {
            this.model.setFromInPx(shiftY);
            this.setValueToThumb();
            this.refreshView();
          }
          else if (shiftY >= pivot) {
            this.model.setToInPx(shiftY);
            this.setValueToThumb();
            this.refreshView();
          }
        }
      }
      else {
        let shiftY = e.clientY - this.view.getRange().getBoundingClientRect().top;
        this.model.setFromInPx(shiftY);
        this.setValueToThumb();
        this.refreshView();
      }
    } else {
      let shiftX = e.clientX - this.view.getRange().getBoundingClientRect().left;
      if (this.model.isRange()) {
        if (shiftX < this.model.getFromInPx()) {
          this.model.setFromInPx(shiftX);
          this.setValueToThumb();
          this.refreshView();
        }
        else if (shiftX > this.model.getToInPx()) {
          this.model.setToInPx(shiftX);
          this.setValueToThumb();
          this.refreshView();
        }
        else if (shiftX >= this.model.getFromInPx() && shiftX <= this.model.getToInPx()) {
          let pivot = (this.model.getToInPx() - this.model.getFromInPx());
          if(shiftX<pivot){
            this.model.setFromInPx(shiftX);
            this.setValueToThumb();
            this.refreshView();
          }
          else if (shiftX >= pivot){
            this.model.setToInPx(shiftX);
            this.setValueToThumb();
            this.refreshView();
          }
        }
      }
      else {
        this.model.setFromInPx(shiftX);
        this.setValueToThumb();
        this.refreshView();
      }

    }
  }
  setValueToThumb() {
    if (this.withThumbLabel()) {
      if (this.isVerticalSlider()) {
        this.model.setFrom(this.getValueFromPosInPx(this.model.getFromInPx()));
        if (this.isRangeSlider()) {
          this.model.setTo(this.getValueFromPosInPx(this.model.getToInPx()));
        }
      }
      else {
        this.model.setFrom(this.getValueFromPosInPx(this.model.getFromInPx()));
        if (this.isRangeSlider()) {
          this.model.setTo(this.getValueFromPosInPx(this.model.getToInPx()));
        }
      }
    }
  }
  getPosInPxFromValue(value: number): number {
    return this.view.getSliderLengthInPx() / Math.abs(this.model.getMax() - this.model.getMin()) * (Math.abs(value - this.model.getMin()));
  }
  getValueFromPosInPx(valueInPx: number): number {
    return +(Math.floor(valueInPx /
      (
        this.view.getSliderLengthInPx()
        /
        (
          (Math.abs(this.model.getMax() - this.model.getMin())) / this.model.getStep()
        )

      )) * this.model.getStep()
      + this.model.getMin()).toFixed(this.numDigitsAfterDecimal(this.model.getStep()));
  }
  refreshView() {
    this.view.refreshView();
  }
  numDigitsAfterDecimal(value: number) {
    let afterDecimalStr = value.toString().split('.')[1] || ''
    return afterDecimalStr.length
  }
}
