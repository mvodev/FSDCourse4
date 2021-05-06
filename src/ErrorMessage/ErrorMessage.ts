class ErrorMessage{
 private message:string;
 constructor(message:string){
  this.message = message;
  this.showMessage();
 }
 showMessage():void {
  console.error(this.message);
 }
}
export default ErrorMessage;