import DropComponent from "./DropComponent";

export default class ConveyorBeltComponent extends AirshipBehaviour {
    public speed: number = 5;
    public direction: Vector3 = this.transform.forward;

    protected OnCollisionStay(collision: Collision): void {

        const drop = collision.gameObject.GetAirshipComponent<DropComponent>();
        if (drop === undefined) return;

        const rigidBody = collision.rigidbody;
        if (rigidBody === undefined) return;

        const forceDirection = this.direction.mul(this.speed);
        rigidBody.linearVelocity = forceDirection;
    };
};