class RangeLabel {
 private rangeLabelContainer!: HTMLDivElement;
 private minLabel!: HTMLSpanElement;
 private maxLabel!: HTMLSpanElement;

 constructor() {
  this.initComponents();
 }
 render(s: string, numberOfMarking:number):void{
  const {isVertical} = JSON.parse(s);
  this.minLabel = document.createElement('span');
  this.rangeLabelContainer.appendChild(this.minLabel);
  for (let i = 0; i < numberOfMarking; i++) {
   const marking = document.createElement('span');
   if (isVertical) {
    marking.innerText = '-';
   } else marking.innerText = '|';
   this.rangeLabelContainer.appendChild(marking);
  this.maxLabel = document.createElement('span');
  this.rangeLabelContainer.appendChild(this.maxLabel);
  
  }
 }
 getRangeLabel():HTMLDivElement {
  return this.rangeLabelContainer;
 }
 setMinRange(value: number) :void{
  this.minLabel.innerText = '' + value;
 }
 setMaxRange(value: number):void {
  this.maxLabel.innerText = '' + value;
 }
 getMinRange():HTMLSpanElement {
  return this.minLabel;
 }
 getMaxRange():HTMLSpanElement {
  return this.maxLabel;
 }
 private initComponents() {
  this.rangeLabelContainer = document.createElement('div');
  this.rangeLabelContainer.classList.add('fsd-slider__range-label');
  
 }
}
export {RangeLabel}