interface IModelFacade {
 getMin(): number;
 getMax(): number;
 showThumbLabel(): boolean;
 setFrom(pos: number): void;
 getFrom(): number;
 setTo(value: number): void;
 getTo(): number | undefined;
 isRange(): boolean;
 isVertical(): boolean;
 getStep(): number;
}
export { IModelFacade }
