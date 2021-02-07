class Utils {
 // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
 static numDigitsAfterDecimal(value: number) {
  if(value){
   // eslint-disable-next-line prefer-const
   let afterDecimalStr = value.toString().split('.')[1] || '';
   return afterDecimalStr.length;
  }
  else return 0;
 }
}
export {Utils}