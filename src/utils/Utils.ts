class Utils {
 
 static numDigitsAfterDecimal(value: number):number {
  if(value){
   return (value.toString().split('.')[1] || '').length;
  }
  else return 0;
 }
 static isNumber(value:string|number|boolean):number|null{
  const number = parseFloat(String(value));
  if(isNaN(number)){
   return null;
  }
  return number;
 }
}
export {Utils}