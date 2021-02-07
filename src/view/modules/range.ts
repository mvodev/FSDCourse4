class Range {
 private range: HTMLDivElement;
 constructor() {
  const div = document.createElement('div');
  div.classList.add('fsd-slider__range');
  this.range = div;
 }
 getRange(): HTMLDivElement {
  return this.range;
 }
}
export {Range}