import { Game } from "@Easy/Core/Shared/Game";

export default class DropComponent extends AirshipBehaviour {
    public value: number = 5;
    public lifetime: number = 10;

    protected Start(): void {
        if (!Game.IsServer()) return;
        this.gameObject.AddComponent<Rigidbody>()
        task.delay(this.lifetime, () => {
            if (this.gameObject === undefined) return;
            NetworkServer.Destroy(this.gameObject)
        });
    }
};