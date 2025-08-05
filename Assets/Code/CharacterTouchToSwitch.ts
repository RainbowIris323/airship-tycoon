import { Airship } from "@Easy/Core/Shared/Airship";
import Character from "@Easy/Core/Shared/Character/Character";
import { Game } from "@Easy/Core/Shared/Game";

export default class CharacterTouchToSwitch extends AirshipBehaviour {
    public rb: Rigidbody;
    private char: Character;
    protected OnCollisionEnter(collision: Collision): void {
        const char = Airship.Characters.FindByCollider(collision.collider);
        if (char === undefined) return;
        print(char)
        this.char = char;
    }
    protected FixedUpdate(dt: number): void {
        this.char?.movement.SetVelocity(this.rb.velocity);
    }
}
