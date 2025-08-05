import { Airship } from "@Easy/Core/Shared/Airship";
import { Game } from "@Easy/Core/Shared/Game";
import CharacterParentComponent from "./CharacterParentComponent";

export default class AssignPlayerParentOnTouch extends AirshipBehaviour {
    public parent: GameObject;
    protected OnCollisionEnter(collision: Collision): void {
        if (!Game.IsServer()) return;
        const char = Airship.Characters.FindByCollider(collision.collider);
        if (char === undefined) return;
        char.gameObject.GetAirshipComponent<CharacterParentComponent>()!.parent = this.parent;
    }
}