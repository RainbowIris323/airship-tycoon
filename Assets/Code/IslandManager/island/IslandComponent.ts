import IslandSaveUtility from "./IslandSaveUtility";
import PlayerManager from "Code/PlayerManager/PlayerManager";
import { Game } from "@Easy/Core/Shared/Game";
import IslandManager from "../IslandManager";
import { Airship } from "@Easy/Core/Shared/Airship";
import { World } from "./World";

export default class IslandComponent extends AirshipBehaviour {
    public bedrock: Transform;
    public voxelWorld: VoxelWorld;

    @NonSerialized()
    public save: WorldSaveFile;
    public data: IslandData;
    @NonSerialized()
    public owner?: string;
    @NonSerialized()
    public isLoaded: boolean = false;
    public world = new World(this);

    protected Awake(): void {
        IslandManager.Get().RegisterIsland(this);
        this.world.RegisterBlocks();
        this.world.TestDefault();
    }

    public GetSpawnLocation(maxHeight: number = 50): Vector3 {
        let spawn = this.bedrock.position;
        const hasBlock: boolean[] = [];
        while (spawn.y < maxHeight) {
            hasBlock.push(this.voxelWorld.GetVoxelAt(spawn) !== 0);
            spawn = spawn.add(new Vector3(0, 1, 0));
            if (hasBlock[hasBlock.size()]) continue;
            if (hasBlock[hasBlock.size() - 1]) continue;
            if (hasBlock[hasBlock.size() - 2]) continue;
            spawn = spawn.sub(new Vector3(0, 2, 0));
            break;
        }

        return this.voxelWorld.TransformPointToWorldSpace(spawn);;
    }

    public Load(ownerId: string): void {
        if (!Game.IsServer()) return;

        if (this.isLoaded) return;
        this.data = {
            save: IslandSaveUtility.GetDefaultSave(),
        }
        this.SpawnPlayer(ownerId);
        this.owner = ownerId;
        this.CheckForVoid();
        this.isLoaded = true;
    }

    public SpawnPlayer(userId: string): void {
        if (!Game.IsServer()) return;

        const rb = PlayerManager.Get().GetPlayerData(userId).character.gameObject.GetComponent<Rigidbody>()!;
        rb.constraints = RigidbodyConstraints.None;
        rb.position = this.GetSpawnLocation();
    }

    private CheckForVoid(): void {
        if (!Game.IsServer()) return;

        if (!this.owner) return;
        if (!this.world.InBounds(Airship.Players.FindByUserId(this.owner)!.character!.transform.position!)) {
            this.SpawnPlayer(this.owner);
        }
        task.delay(0.5, () => this.CheckForVoid());
    }
}