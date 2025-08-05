import { Game } from "@Easy/Core/Shared/Game";

export default class GameLoaderCompoent extends AirshipBehaviour {
    public selection: string = "dev";
    public gamePrefabs: Array<GameObject> = [];
    private game: GameObject = undefined!;

    override Awake(): void {
        if (!Game.IsServer()) return;

        // Loops though all root items in the scene and removes them unless its valid
        const parent = this.gameObject.transform;
        for (let i = 0; i < parent.GetChildCount(); i++) {
            const child = parent.GetChild(i);
            if (child.gameObject.name === this.selection) {
                this.game = child.gameObject;
                continue;
            }
            Destroy(child.gameObject);
        }

        if (this.game === undefined) { // If the game does not exist in the world or it had the wrong one it will make a new one.
            let prefab: GameObject | undefined = undefined;
            for (let i = 0; i < this.gamePrefabs.size(); i++) {
                if (this.gamePrefabs[i].name !== this.selection) continue;
                prefab = this.gamePrefabs[i];
                break;
            }

            if (prefab === undefined) error(`Could not find game prefab for "${this.selection}", Did you forget to add it to the GameLoader.gamePrefabs?`);
            const builtGame = Instantiate(prefab, this.gameObject.transform);
            builtGame.name = this.selection;
            this.game = builtGame;
        }
    }
}
