import { Game } from "@Easy/Core/Shared/Game";

export default class DropperComponent extends AirshipBehaviour {
    public timeout: number = 3;
    public drop: GameObject;
    public anchor: GameObject;

    protected Start(): void {
        this.Drop();
    }

    public Drop(): void {
        if (!Game.IsServer()) return;
        if (!this.gameObject.activeSelf) return;
        const newDrop = Instantiate(this.drop);
        newDrop.transform.position = this.anchor.transform.position;
        NetworkServer.Spawn(newDrop);
        task.delay(this.timeout, () => this.Drop());
    }
};