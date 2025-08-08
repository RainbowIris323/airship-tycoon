import { Game } from "@Easy/Core/Shared/Game";
import IslandComponent from "./island/IslandComponent";
import { RandomUtil } from "@Easy/Core/Shared/Util/RandomUtil";

export default class IslandManager extends AirshipSingleton {
    private islands: IslandComponent[] = [];
    public RegisterIsland(island: IslandComponent): void {
        this.islands.push(island);
    }
    public GetPlayerIsland(userId: string): IslandComponent | undefined {
        return this.islands.find((island) => island.owner === userId);
    }
    public AssignPlayerIsland(userId: string): void {
        if (!Game.IsServer()) return;

        const unownedIslands = this.islands.filter((island) => island.owner === undefined);
        print(unownedIslands);
        const island = RandomUtil.FromArray(unownedIslands);
        print(island);
        island.Load(userId);
    }
}