import { Messages } from '../utils/Messages';
interface IObserver {
 handleEvent(msg: Messages, s: string):void;
}
export {IObserver}