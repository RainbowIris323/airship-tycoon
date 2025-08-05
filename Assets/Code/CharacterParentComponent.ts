import { Game } from "@Easy/Core/Shared/Game";

export default class CharacterParentComponent extends AirshipBehaviour {
    public parent: GameObject | undefined;
    private lastPos: Vector3 | undefined = undefined;
    private lastRot: Vector3 | undefined = undefined;
    private rb: Rigidbody;
    
    protected Start(): void {
        this.rb = this.gameObject.GetComponent<Rigidbody>()!;
    }

    protected FixedUpdate(): void {
        if (!Game.IsServer()) return;
        if (!this.parent) return;
        const lastPos = this.lastPos ?? this.parent.transform.position;
        const lastRot = this.lastRot ?? this.parent.transform.rotation.eulerAngles
        const newRot = this.parent.transform.rotation.mul(Quaternion.Inverse(Quaternion.Euler(lastRot.x, lastRot.y, lastRot.z)).mul(this.rb.rotation).eulerAngles);

        this.rb.position = this.parent.transform.rotation.mul(Quaternion.Euler(lastRot.x, lastRot.y, lastRot.z)).mul(this.rb.position.sub(lastPos)).add(this.parent.transform.position);
        this.rb.rotation = Quaternion.Euler(newRot.x, newRot.y, newRot.z);
        
        this.lastPos = this.parent.transform.position;
        this.lastRot = this.parent.transform.rotation.eulerAngles;
    }
}