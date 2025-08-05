import { Airship } from "@Easy/Core/Shared/Airship";
import { Game } from "@Easy/Core/Shared/Game";
import CharacterParentComponent from "./CharacterParentComponent";

export default class ShipComponent extends AirshipBehaviour {
    public rigidbody: Rigidbody;
    public speed: 1;
    public orbitForce = 10;
    public radius = 20;
    public springStrength = 50;
    public center = new Vector3(0, 0, 0);
    
    private d = 0;

    protected FixedUpdate(): void {
        if (!Game.IsServer()) return;
        let active = false;
        Airship.Characters.GetCharacters().forEach((char) => {
            if (char.gameObject.GetAirshipComponent<CharacterParentComponent>()?.parent !== undefined) active = true;
        })
        if (!active) {
            this.rigidbody.velocity = new Vector3(0, 0, 0);
            return;
        }
        const toCenter = this.center.sub(this.gameObject.transform.position);
        const radialDir = toCenter.normalized;

        const tangentialDir = Vector3.Cross(Vector3.up, radialDir).normalized;

        this.rigidbody.AddForce(tangentialDir.mul(this.orbitForce), ForceMode.Force);

        const distanceFromRadius = toCenter.magnitude - this.radius;
        const springForce = radialDir.mul(distanceFromRadius).mul(this.springStrength);
        this.rigidbody.AddForce(springForce, ForceMode.Force);
        /**
        const flatVelocity = new Vector3(this.rigidbody.velocity.x, 0, this.rigidbody.velocity.z);
        if (flatVelocity.magnitude > 0.01)
        {
            const lookRot = Quaternion.LookRotation(flatVelocity, Vector3.up);
            this.rigidbody.MoveRotation(lookRot);
        }
        */
    }
}
