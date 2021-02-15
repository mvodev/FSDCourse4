interface IModelFacade {
 getMin(): number;
 getMax(): number;
 setFrom(pos: number): void;
 getFrom(): number;
 setTo(value: number): void;
 getTo(): number;
 getStep(): number;
}
export { IModelFacade }
