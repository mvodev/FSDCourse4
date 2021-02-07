interface ISettings {
 min: number;
 max: number;
 from: number;
 to?: number|undefined;
 step: number;
 isVertical?: boolean;
 isRange?: boolean;
 hideThumbLabel?: boolean;
}
export {ISettings}
