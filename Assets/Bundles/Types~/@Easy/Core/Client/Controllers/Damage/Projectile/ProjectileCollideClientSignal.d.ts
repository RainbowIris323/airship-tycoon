/// <reference types="@easy-games/types" />
/// <reference types="@easy-games/types" />
import { Entity } from "../../../../Shared/Entity/Entity";
import { Projectile } from "../../../../Shared/Projectile/Projectile";
export declare class ProjectileCollideClientSignal {
    readonly projectile: Projectile;
    readonly hitPosition: Vector3;
    readonly normal: Vector3;
    readonly velocity: Vector3;
    readonly hitEntity: Entity | undefined;
    constructor(projectile: Projectile, hitPosition: Vector3, normal: Vector3, velocity: Vector3, hitEntity: Entity | undefined);
}
