/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./controller/Controller.ts":
/*!**********************************!*\
  !*** ./controller/Controller.ts ***!
  \**********************************/
/*! namespace exports */
/*! export Controller [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Controller": () => /* binding */ Controller
/* harmony export */ });
class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.isUpdated = false;
    this.result = {
      min: 0,
      max: 0,
      from: 0
    };
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
  }

  isUpdate() {
    return this.isUpdated;
  }

  setIsUpdate(value) {
    this.isUpdated = value;
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

  update(newSettings) {
    this.model.updateSettings(newSettings);

    if (this.model.showThumbLabel) {
      this.setThumbToValue('thumbFrom');

      if (this.model.isRange()) {
        this.setThumbToValue('thumbTo');
      }
    }

    this.setIsUpdate(true);
    this.view.refreshView();
  }

  isVerticalSlider() {
    return this.model.isVertical();
  }

  isRangeSlider() {
    return this.model.isRange();
  }

  withThumbLabel() {
    return this.model.showThumbLabel();
  }

  setThumbToValue(type) {
    if (type === 'thumbFrom') {
      if (this.isVerticalSlider()) {
        this.view.getThumbFrom().style.top = this.getPosInPercentFromValue(this.model.getFrom()) + '%';
        this.model.setFromInPx(this.getPosInPxFromValue(this.model.getFrom()));
        this.refreshView();
      } else {
        this.view.getThumbFrom().style.left = this.getPosInPercentFromValue(this.model.getFrom()) + '%';
        this.model.setFromInPx(this.getPosInPxFromValue(this.model.getFrom()));
        this.refreshView();
      }
    } else {
      if (this.isVerticalSlider()) {
        this.view.getThumbTo().style.top = this.getPosInPercentFromValue(this.model.getTo()) + '%';
        this.model.setToInPx(this.getPosInPxFromValue(this.model.getTo()));
        this.view.refreshView();
      } else {
        this.view.getThumbTo().style.left = this.getPosInPercentFromValue(this.model.getTo()) + '%';
        this.model.setToInPx(this.getPosInPxFromValue(this.model.getTo()));
        this.view.refreshView();
      }
    }
  }

  mouseFromHandler(e) {
    e.preventDefault();

    if (this.isVerticalSlider()) {
      let shiftY = e.clientY - this.view.getThumbFrom().getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      let sliderRange = this.view.getRange();
      let thumb = this.view.getThumbFrom();
      let that = this;

      function onMouseMove(event) {
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

        that.model.setFromInPx(newTop);
        that.setValueToThumb();
        that.view.refreshView();
        that.callOnChange();
      }

      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    } else {
      let shiftX = e.clientX - this.view.getThumbFrom().getBoundingClientRect().left;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      let sliderRange = this.view.getRange();
      let thumb = this.view.getThumbFrom();
      let that = this;

      function onMouseMove(e) {
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

        that.model.setFromInPx(newLeft);
        that.setValueToThumb();
        that.view.refreshView();
        that.callOnChange();
      }

      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
  }

  mouseToHandler(e) {
    e.preventDefault();

    if (this.isVerticalSlider()) {
      let shiftY = e.clientY - this.view.getThumbTo().getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      let sliderRange = this.view.getRange();
      let thumb = this.view.getThumbTo();
      let that = this;

      function onMouseMove(event) {
        let newTop = event.clientY - shiftY - sliderRange.getBoundingClientRect().top;

        if (newTop < that.model.getFromInPx()) {
          newTop = that.model.getFromInPx() + 1;
        }

        let bottom = sliderRange.offsetHeight - thumb.offsetHeight;

        if (newTop > bottom) {
          newTop = bottom;
        }

        that.model.setToInPx(newTop);
        that.setValueToThumb();
        that.refreshView();
        that.callOnChange();
      }

      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    } else {
      let shiftX = e.clientX - this.view.getThumbTo().getBoundingClientRect().left;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      let sliderRange = this.view.getRange();
      let thumb = this.view.getThumbTo();
      let that = this;

      function onMouseMove(e) {
        let newLeft = e.clientX - shiftX - sliderRange.getBoundingClientRect().left;

        if (newLeft < that.model.getFromInPx()) {
          newLeft = that.model.getFromInPx() + 1;
        }

        let rightEdge = sliderRange.offsetWidth - thumb.offsetWidth;

        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }

        that.model.setToInPx(newLeft);
        that.setValueToThumb();
        that.refreshView();
        that.callOnChange();
      }

      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
  }

  mouseRangeHandler(e) {
    if (this.isVerticalSlider()) {
      if (this.model.isRange()) {
        let shiftY = e.clientY - this.view.getRange().getBoundingClientRect().top;

        if (shiftY < this.model.getFromInPx()) {
          this.model.setFromInPx(shiftY);
          this.setValueToThumb();
          this.refreshView();
        } else if (shiftY > this.model.getToInPx()) {
          this.model.setToInPx(shiftY);
          this.setValueToThumb();
          this.refreshView();
        } else if (shiftY >= this.model.getFromInPx() && shiftY <= this.model.getToInPx()) {
          let pivot = this.model.getToInPx() - this.model.getFromInPx();

          if (shiftY < pivot) {
            this.model.setFromInPx(shiftY);
            this.setValueToThumb();
            this.refreshView();
          } else if (shiftY >= pivot) {
            this.model.setToInPx(shiftY);
            this.setValueToThumb();
            this.refreshView();
          }
        }
      } else {
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
        } else if (shiftX > this.model.getToInPx()) {
          this.model.setToInPx(shiftX);
          this.setValueToThumb();
          this.refreshView();
        } else if (shiftX >= this.model.getFromInPx() && shiftX <= this.model.getToInPx()) {
          let pivot = this.model.getToInPx() - this.model.getFromInPx();

          if (shiftX < pivot) {
            this.model.setFromInPx(shiftX);
            this.setValueToThumb();
            this.refreshView();
          } else if (shiftX >= pivot) {
            this.model.setToInPx(shiftX);
            this.setValueToThumb();
            this.refreshView();
          }
        }
      } else {
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

        if (this.isUpdate()) {
          this.model.setFromInPx(this.getPosInPxFromValue(this.model.getFrom()));
        }

        if (this.isRangeSlider()) {
          this.model.setTo(this.getValueFromPosInPx(this.model.getToInPx()));

          if (this.isUpdate()) {
            this.model.setToInPx(this.getPosInPxFromValue(this.model.getTo()));
          }
        }

        this.callOnChange();
      } else {
        this.model.setFrom(this.getValueFromPosInPx(this.model.getFromInPx()));

        if (this.isUpdate()) {
          this.model.setFromInPx(this.getPosInPxFromValue(this.model.getFrom()));
        }

        if (this.isRangeSlider()) {
          this.model.setTo(this.getValueFromPosInPx(this.model.getToInPx()));

          if (this.isUpdate()) {
            this.model.setToInPx(this.getPosInPxFromValue(this.model.getTo()));
          }
        }

        this.callOnChange();
      }
    }
  }

  getPosInPercentFromValue(value) {
    let res = 100 / Math.abs(this.model.getMax() - this.model.getMin()) * Math.abs(value - this.model.getMin());
    return res;
  }

  getPosInPxFromValue(value) {
    return this.view.getSliderLengthInPx() / Math.abs(this.model.getMax() - this.model.getMin()) * Math.abs(value - this.model.getMin());
  }

  getValueFromPosInPx(valueInPx) {
    return +(Math.floor(valueInPx / (this.view.getSliderLengthInPx() / (Math.abs(this.model.getMax() - this.model.getMin()) / this.model.getStep()))) * this.model.getStep() + this.model.getMin()).toFixed(this.numDigitsAfterDecimal(this.model.getStep()));
  }

  refreshView() {
    this.view.refreshView();
  }

  numDigitsAfterDecimal(value) {
    let afterDecimalStr = value.toString().split('.')[1] || '';
    return afterDecimalStr.length;
  }

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

/***/ }),

/***/ "./model/Model.ts":
/*!************************!*\
  !*** ./model/Model.ts ***!
  \************************/
/*! namespace exports */
/*! export Model [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Model": () => /* binding */ Model
/* harmony export */ });
class Model {
  constructor(settings) {
    this.settings = Object.assign({}, settings);
    this.validateSettings(this.settings);
  }

  updateSettings(settings) {
    this.settings = Object.assign(this.settings, settings);
    this.validateSettings(this.settings);
  }

  getMin() {
    return this.settings.min;
  }

  getMax() {
    return this.settings.max;
  }

  getOnChangeCallback() {
    return this.settings.onChange;
  }

  showThumbLabel() {
    return !this.settings.hideThumbLabel;
  }

  setFrom(pos) {
    this.settings.from = pos;
  }

  getFrom() {
    return this.settings.from;
  }

  setTo(value) {
    this.settings.to = value;
  }

  getTo() {
    return this.settings.to;
  }

  getFromInPx() {
    return this.settings.fromInPx;
  }

  setFromInPx(value) {
    this.settings.fromInPx = value;
  }

  getToInPx() {
    return this.settings.toInPx;
  }

  setToInPx(value) {
    this.settings.toInPx = value;
  }

  isRange() {
    return this.settings.isRange;
  }

  isVertical() {
    return this.settings.isVertical;
  }

  getStep() {
    return this.settings.step ? this.settings.step : 1;
  }

  validateSettings(settings) {
    if (settings.min >= settings.max) {
      console.error('unacceptable value,min value in settings more than max value');
      this.settings.min = settings.max - 10;
    }

    if (!settings.to && settings.isRange) {
      this.settings.to = settings.max;
      console.error('unacceptable value,`to` value must be established');
    }

    if (settings.from < settings.min) {
      console.error('unacceptable value,from must be more than min');
      this.settings.from = settings.min;
    }

    if (settings.from > settings.max) {
      console.error('unacceptable value,from must be lower than max');
      this.settings.from = settings.min;
    }

    if (settings.to < settings.min) {
      this.settings.to = settings.max;
      console.error('unacceptable value,`to` value must be between min and max');
    }

    if (settings.isRange && settings.to > settings.max) {
      console.error('unacceptable value,to must be lower than max');
      this.settings.to = settings.max;
    }

    if (settings.isRange && settings.from >= settings.to) {
      console.error('unacceptable value,from must be lower than to');
      this.settings.to = this.settings.from + this.settings.step ? this.settings.step : 0;
    }

    if (settings.onStart && typeof settings.onStart != 'function') {
      console.error('unacceptable value,callback must be function');
      this.settings.onStart = undefined;
    }

    if (settings.onChange && typeof settings.onChange != 'function') {
      console.error('unacceptable value,callback onChange must be function');
      this.settings.onChange = undefined;
    }

    if (settings.onUpdate && typeof settings.onUpdate != 'function') {
      console.error('unacceptable value,callback onUpdate must be function');
      this.settings.onUpdate = undefined;
    }

    if (settings.onDestroy && typeof settings.onDestroy != 'function') {
      console.error('unacceptable value,callback onUpdate must be function');
      this.settings.onDestroy = undefined;
    }
  }

}

/***/ }),

/***/ "./view/View.ts":
/*!**********************!*\
  !*** ./view/View.ts ***!
  \**********************/
/*! namespace exports */
/*! export View [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "View": () => /* binding */ View
/* harmony export */ });
/* harmony import */ var _modules_Slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/Slider */ "./view/modules/Slider.ts");
;
class View {
  constructor(model, root) {
    this.numberOfMarking = 10;
    this.model = model;
    this.rootElem = root;
    this.slider = new _modules_Slider__WEBPACK_IMPORTED_MODULE_0__.Slider(this.rootElem, this.model, this.numberOfMarking);
    this.isUpdated = false;
  }

  setIsUpdate(value) {
    this.isUpdated = value;
  }

  isUpdate() {
    return this.isUpdated;
  }

  render() {
    this.slider.render();

    if (!this.model.showThumbLabel()) {
      this.slider.getThumbLabelFrom().hideLabel();
    }

    if (this.model.isVertical()) {
      this.slider.setVertical();
    }
  }

  getRangeLabel() {
    return this.slider.getRangeLabel();
  }

  getSliderLengthInPx() {
    if (this.model.isVertical()) {
      return this.getRange().offsetHeight - this.getThumbFrom().offsetHeight;
    } else {
      return this.getRange().offsetWidth - this.getThumbFrom().offsetWidth;
    }
  }

  getRange() {
    return this.slider.getRange();
  }

  getThumbFrom() {
    return this.slider.getThumbFrom();
  }

  setValueToThumbLabelTo(value) {
    this.slider.setValueToLabelThumbTo(value);
  }

  getThumbTo() {
    return this.slider.getThumbTo();
  }

  refreshView() {
    this.slider.setMinRange(this.model.getMin());
    this.slider.setMaxRange(this.model.getMax());
    this.slider.setValueToLabelThumbFrom(this.model.getFrom());

    if (this.model.isRange()) {
      this.slider.setValueToLabelThumbTo(this.model.getTo());

      if (this.model.isVertical()) {
        this.getThumbTo().style.top = this.model.getToInPx() / this.getRange().clientHeight * 100 + '%';
        this.getThumbFrom().style.top = this.model.getFromInPx() / this.getRange().clientHeight * 100 + '%';
      } else {
        this.getThumbTo().style.left = this.model.getToInPx() / this.getRange().clientWidth * 100 + '%';
        this.getThumbFrom().style.left = this.model.getFromInPx() / this.getRange().clientWidth * 100 + '%';
      }
    } else {
      if (this.model.isVertical()) {
        this.getThumbFrom().style.top = this.model.getFromInPx() / this.getRange().offsetHeight * 100 + '%';
      } else {
        this.getThumbFrom().style.left = this.model.getFromInPx() / this.getRange().clientWidth * 100 + '%';
      }
    }

    this.setColoredRange();
  }

  setColoredRange() {
    let that = this;

    if (this.model.isRange()) {
      if (this.model.isVertical()) {
        let thumbHalf = this.slider.getThumbFrom().offsetHeight / 2;
        let height = (this.model.getToInPx() + thumbHalf - this.model.getFromInPx()) / this.getRange().offsetHeight * 100 + '%';
        let top = this.model.getFromInPx() / this.getRange().offsetHeight * 100 + '%';
        this.slider.getColoredRange().style.top = top;
        this.slider.getColoredRange().style.height = height;
      } else {
        let thumbHalf = this.slider.getThumbFrom().offsetWidth / 2;
        let width = (this.model.getToInPx() + thumbHalf - this.model.getFromInPx()) / this.getRange().offsetWidth * 100 + '%';
        let left = this.model.getFromInPx() / this.getRange().offsetWidth * 100 + '%';
        this.slider.getColoredRange().style.left = left;
        this.slider.getColoredRange().style.width = width;
      }
    } else {
      if (this.model.isVertical()) {
        let thumbHalf = this.slider.getThumbFrom().offsetHeight / 2;
        let height = (this.model.getFromInPx() + thumbHalf) / this.getRange().clientHeight * 100 + '%';
        this.slider.getColoredRange().style.height = height;
      } else {
        let thumbHalf = this.slider.getThumbFrom().offsetWidth / 2;
        let width = (this.model.getFromInPx() + thumbHalf) / this.getRange().clientWidth * 100 + '%';
        this.slider.getColoredRange().style.width = width;
      }
    }
  }

}

/***/ }),

/***/ "./view/modules/Slider.ts":
/*!********************************!*\
  !*** ./view/modules/Slider.ts ***!
  \********************************/
/*! namespace exports */
/*! export Slider [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Slider": () => /* binding */ Slider
/* harmony export */ });
/* harmony import */ var _range__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./range */ "./view/modules/range.ts");
/* harmony import */ var _thumb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./thumb */ "./view/modules/thumb.ts");
/* harmony import */ var _thumbLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./thumbLabel */ "./view/modules/thumbLabel.ts");
/* harmony import */ var _rangeLabel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rangeLabel */ "./view/modules/rangeLabel.ts");
/* harmony import */ var _coloredRange__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./coloredRange */ "./view/modules/coloredRange.ts");
;




class Slider {
  constructor(rootElem, model, numberOfMarking) {
    this.model = model;
    this.rootElem = rootElem;
    this.numberOfMarking = numberOfMarking;
    this.numberOfMarking = this.numberOfMarking;
    this.thumbTo = new _thumb__WEBPACK_IMPORTED_MODULE_1__.Thumb('fsd-slider__thumb-to');
    this.thumbLabelTo = new _thumbLabel__WEBPACK_IMPORTED_MODULE_2__.ThumbLabel(this.thumbTo.getThumb());
    this.thumbFrom = new _thumb__WEBPACK_IMPORTED_MODULE_1__.Thumb('fsd-slider__thumb-from');
    this.thumbLabelFrom = new _thumbLabel__WEBPACK_IMPORTED_MODULE_2__.ThumbLabel(this.thumbFrom.getThumb());
    this.range = new _range__WEBPACK_IMPORTED_MODULE_0__.Range();
    this.coloredRange = new _coloredRange__WEBPACK_IMPORTED_MODULE_4__.ColoredRange();
    this.rangeLabel = new _rangeLabel__WEBPACK_IMPORTED_MODULE_3__.RangeLabel(this.numberOfMarking, this.model.isVertical());
    this.container = document.createElement('div');
  }

  render() {
    this.container.classList.add('fsd-slider');
    this.container.appendChild(this.range.getRange());
    this.range.getRange().appendChild(this.coloredRange.getColoredRange());
    this.range.getRange().appendChild(this.thumbFrom.getThumb());
    this.thumbFrom.getThumb().appendChild(this.thumbLabelFrom.getThumbLabelContainer());

    if (this.model.isRange()) {
      this.thumbTo.getThumb().appendChild(this.thumbLabelTo?.getThumbLabelContainer());
      this.range.getRange().appendChild(this.thumbTo.getThumb());
    }

    this.container.appendChild(this.rangeLabel.getRangeLabel());
    this.rootElem.appendChild(this.container);
  }

  getRange() {
    return this.range.getRange();
  }

  getThumbFrom() {
    return this.thumbFrom.getThumb();
  }

  getThumbTo() {
    return this.thumbTo.getThumb();
  }

  getThumbLabelFrom() {
    return this.thumbLabelFrom;
  }

  getThumbLabelTo() {
    return this.thumbLabelTo;
  }

  getColoredRange() {
    return this.coloredRange.getColoredRange();
  }

  setMaxRange(value) {
    this.rangeLabel.setMaxRange(value);
  }

  setMinRange(value) {
    this.rangeLabel.setMinRange(value);
  }

  setValueToLabelThumbFrom(value) {
    this.thumbLabelFrom.setValueToLabel(value);
  }

  setValueToLabelThumbTo(value) {
    this.thumbLabelTo.setValueToLabel(value);
  }

  getRangeLabel() {
    return this.rangeLabel.getRangeLabel();
  }

  setVertical() {
    this.container.classList.add('fsd-slider_is_vertical');
    this.range.getRange().classList.add('fsd-slider__range_is_vertical');
    this.coloredRange.getColoredRange().classList.add('fsd-slider__colored-range_is_vertical');
    this.rangeLabel.getRangeLabel().classList.add('fsd-slider__range-label_is_vertical');
    this.thumbLabelFrom.getThumbLabelContainer().classList.add('fsd-slider__thumb-label_is_vertical');

    if (this.model.isRange()) {
      this.thumbLabelTo.getThumbLabelContainer().classList.add('fsd-slider__thumb-label_is_vertical');
    }
  }

}

/***/ }),

/***/ "./view/modules/coloredRange.ts":
/*!**************************************!*\
  !*** ./view/modules/coloredRange.ts ***!
  \**************************************/
/*! namespace exports */
/*! export ColoredRange [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColoredRange": () => /* binding */ ColoredRange
/* harmony export */ });
class ColoredRange {
  constructor() {
    this.coloredRange = document.createElement('div');
    this.coloredRange.classList.add('fsd-slider__colored-range');
  }

  getColoredRange() {
    return this.coloredRange;
  }

}

/***/ }),

/***/ "./view/modules/range.ts":
/*!*******************************!*\
  !*** ./view/modules/range.ts ***!
  \*******************************/
/*! namespace exports */
/*! export Range [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Range": () => /* binding */ Range
/* harmony export */ });
class Range {
  constructor() {
    let div = document.createElement('div');
    div.classList.add('fsd-slider__range');
    this.range = div;
  }

  getRange() {
    return this.range;
  }

}

/***/ }),

/***/ "./view/modules/rangeLabel.ts":
/*!************************************!*\
  !*** ./view/modules/rangeLabel.ts ***!
  \************************************/
/*! namespace exports */
/*! export RangeLabel [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RangeLabel": () => /* binding */ RangeLabel
/* harmony export */ });
class RangeLabel {
  constructor(numberOfMarking, isVertical) {
    this.rangeLabelContainer = document.createElement('div');
    this.rangeLabelContainer.classList.add('fsd-slider__range-label');
    this.minLabel = document.createElement('span');
    this.rangeLabelContainer.appendChild(this.minLabel);

    for (let i = 0; i < numberOfMarking; i++) {
      let marking = document.createElement('span');

      if (isVertical) {
        marking.innerText = '-';
      } else marking.innerText = '|';

      this.rangeLabelContainer.appendChild(marking);
    }

    this.maxLabel = document.createElement('span');
    this.rangeLabelContainer.appendChild(this.maxLabel);
  }

  getRangeLabel() {
    return this.rangeLabelContainer;
  }

  setMinRange(value) {
    this.minLabel.innerText = '' + value;
  }

  setMaxRange(value) {
    this.maxLabel.innerText = '' + value;
  }

}

/***/ }),

/***/ "./view/modules/thumb.ts":
/*!*******************************!*\
  !*** ./view/modules/thumb.ts ***!
  \*******************************/
/*! namespace exports */
/*! export Thumb [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Thumb": () => /* binding */ Thumb
/* harmony export */ });
class Thumb {
  constructor(className) {
    this.thumb = document.createElement('div');
    this.thumb.classList.add(className);
  }

  getThumb() {
    return this.thumb;
  }

}

/***/ }),

/***/ "./view/modules/thumbLabel.ts":
/*!************************************!*\
  !*** ./view/modules/thumbLabel.ts ***!
  \************************************/
/*! namespace exports */
/*! export ThumbLabel [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ThumbLabel": () => /* binding */ ThumbLabel
/* harmony export */ });
class ThumbLabel {
  constructor(thumbRootElen) {
    let div = document.createElement('div');
    let divValue = document.createElement('div');
    this.thumbLabelContainer = div;
    this.thumbLabelContainer.classList.add('fsd-slider__thumb-label');
    this.thumbLabelValue = divValue;
    this.thumbLabelValue.classList.add('fsd-slider__thumb-label-value');
    this.thumbLabelContainer.appendChild(this.thumbLabelValue);
  }

  getThumbLabelContainer() {
    return this.thumbLabelContainer;
  }

  setValueToLabel(value) {
    this.thumbLabelValue.innerText = '' + value;
  }

  hideLabel() {
    this.thumbLabelContainer.style.display = 'none';
  }

  showLabel() {
    this.thumbLabelContainer.style.display = 'block';
  }

}

/***/ }),

/***/ "./index.scss":
/*!********************!*\
  !*** ./index.scss ***!
  \********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./fsdSlider.js":
/*!**********************!*\
  !*** ./fsdSlider.js ***!
  \**********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view/View */ "./view/View.ts");
/* harmony import */ var _model_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model/Model */ "./model/Model.ts");
/* harmony import */ var _controller_Controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controller/Controller */ "./controller/Controller.ts");
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "../node_modules/jquery/dist/jquery.js");
;


(function ($) {
 var FsdSlider = function (root, settings) {
  this.root = root;
  var defaultSettings = {
   min: 0,
   max: 10,
   from: 5,
   isRange: false,
   isVertical: false,
   hideThumbLabel: false,
   callback: undefined,
  };
  let unionSettings = $.extend(defaultSettings, settings);
  let model = new _model_Model__WEBPACK_IMPORTED_MODULE_1__.Model(unionSettings);
  let view = new _view_View__WEBPACK_IMPORTED_MODULE_0__.View(model, this.root);
  this.controller = new _controller_Controller__WEBPACK_IMPORTED_MODULE_2__.Controller(view, model);
  this.init();
 };
 FsdSlider.prototype = {
  init: function () {
   this.controller.start();
  },
  update: function (newSettings) {
   this.controller.update(newSettings);
  },
 };
 $.fn.fsdSlider = function (settings) {
  return this.each(function () {
   if (!$.data(this, "fsdSlider")) {
    $.data(this, "fsdSlider", new FsdSlider(this, settings));
   }
  });
 };
})(jQuery);

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ "./index.scss");
/* harmony import */ var _fsdSlider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fsdSlider */ "./fsdSlider.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "../node_modules/jquery/dist/jquery.js");
;

var $sl1 = $('.slider');
$sl1.fsdSlider({
 min: -15,
 max: -10,
 from: -14,
 step: 0.2,
 to: -11,
 isVertical: true,
 hideThumbLabel: false,
 isRange: true,
 onChange: callback,
});
var sl1_instance = $sl1.data("fsdSlider");
sl1_instance.update({ min: 0, max: 22, from: -5, });
var $sl2 = $('.slider2');
$sl2.fsdSlider({
 min: 5,
 max: 50,
 from: 7,
 step: 0.5,
 to: -11,
 isVertical: false,
 isRange: false,
 hideThumbLabel: false,
 onChange: callback2,
});
var sl2_instance = $sl2.data('fsdSlider');
sl2_instance.update({ min: 0, max: 6, from: 3, step: 1, });
function callback(result) {
 $('.slider__input').val(result.from + '' + result.to);
}
var $sl2_input = $('.slider2__input');
function callback2(result2) {
 $sl2_input.val(result2.from);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./index.js","vendors-node_modules_jquery_dist_jquery_js"]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = () => {
/******/ 		
/******/ 		};
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = () => {
/******/ 		
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = () => {
/******/ 		
/******/ 			}
/******/ 			chunkLoadingGlobal = chunkLoadingGlobal.slice();
/******/ 			for(var i = 0; i < chunkLoadingGlobal.length; i++) webpackJsonpCallback(chunkLoadingGlobal[i]);
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// run startup
/******/ 	return __webpack_require__.x();
/******/ })()
;
//# sourceMappingURL=main.f46bb04b780cd6408aa3.js.map