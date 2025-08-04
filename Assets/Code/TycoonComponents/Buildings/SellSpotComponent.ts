import DropComponent from "./DropComponent";
import TycoonOwnedComponent from "../TycoonOwnedComponent";

export default class SellSpotComponent extends TycoonOwnedComponent {
    public sellValueMultiplier: number = 1;

    protected OnCollisionEnter(collision: Collision): void {
        const obj = collision.gameObject;
        const drop = collision.gameObject.GetAirshipComponent<DropComponent>();
        if (drop === undefined) return;
        this.tycoon.money.ModifyValue(drop.value * this.sellValueMultiplier);
        Destroy(obj)
    };
};