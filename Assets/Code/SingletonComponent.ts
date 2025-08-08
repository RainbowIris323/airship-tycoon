import GameManager from "./GameManager/GameManager";
import IslandManager from "./IslandManager/IslandManager";
import ItemManager from "./ItemManager/ItemManager";
import PlayerManager from "./PlayerManager/PlayerManager";

export default class SingletonComponent extends AirshipBehaviour {
    protected Awake(): void {
        GameManager.Get();
        IslandManager.Get();
        ItemManager.Get();
        PlayerManager.Get();
    }
}