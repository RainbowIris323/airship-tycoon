import { Game } from "@Easy/Core/Shared/Game";
import { Tween } from "@Easy/Core/Shared/Tween/Tween";

export default class OceanComponent extends AirshipBehaviour {
    public chunkScale: number = 1;
    public sizeX: number = 50;
    public sizeY: number = 50;
    public waterPrefab: GameObject;
    public floor: GameObject;
    public midWater: GameObject;

    override Awake(): void {
        if (!Game.IsServer()) return;
        this.waterPrefab.transform.localScale = new Vector3(this.chunkScale, 1, this.chunkScale);
        const globalSizeX = this.sizeX * this.chunkScale;
        const globalSizeY = this.sizeY * this.chunkScale;

        this.floor.transform.localScale = new Vector3(globalSizeX, this.floor.transform.localScale.y, globalSizeY);
        this.midWater.transform.localScale = new Vector3(globalSizeX, this.midWater.transform.localScale.y, globalSizeY);

        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                const globalX = globalSizeX / 2 - x * this.chunkScale;
                const globalY = globalSizeY / 2 - y * this.chunkScale;
                const part = Instantiate(this.waterPrefab, this.gameObject.transform);
                part.transform.position = new Vector3(globalX, part.transform.position.y, globalY);
            }
        }
    }

    protected Start(): void {
        
    }
}
