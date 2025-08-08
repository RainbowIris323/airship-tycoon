import ItemManager from "Code/ItemManager/ItemManager";
import IslandComponent from "./IslandComponent";
import { BlockItemRegistry, BlockItemSaveRegistry, BlockItemWorldRegistry } from "Code/ItemManager/ItemTypes";
import { Player } from "@Easy/Core/Shared/Player/Player";

export class World {
    private size: Vector3 = new Vector3(30, 30, 20);
    private island: IslandComponent;
    private BlockNames: {
        [id: number]: string,
    } = {}
    private BlockIds: {
        [name: string]: number,
    } = {}
    private BlockSaves: {
        [id: number]: { default: BlockItemSaveRegistry, bin: {[key: number]: BlockItemSaveRegistry | undefined} }
    } = {}
    private BlockWorlds: {
        [id: number]: { default: BlockItemWorldRegistry, bin: {[key: number]: BlockItemWorldRegistry | undefined} },
    } = {}
    private BlockHealth: {
        [id: number]: { default: number, bin: {[key: number]: number | undefined} },
    } = {}
    private Blocks: {
        [x: number]: {
            [y: number]: {
                [z: number]: WorldBlockData | undefined,
            };
        }
    } = {}

    public GetBlockAt(pos: Vector3): WorldBlockData | undefined {
        if (!(pos.x in this.Blocks)) return;
        if (!(pos.y in this.Blocks)) return;
        if (!(pos.z in this.Blocks)) return;
        return this.Blocks[pos.x][pos.y][pos.z];
    }

    public SetBlockAt(data: WorldBlockData | undefined, pos: Vector3): void {
        if (!(pos.x in this.Blocks)) this.Blocks[pos.x] = {};
        if (!(pos.y in this.Blocks)) this.Blocks[pos.y] = {};
        this.Blocks[pos.x][pos.y][pos.z] = data;
    }

    public DeleteBlockDataAt(pos: Vector3): void {
        const oldData = this.GetBlockAt(pos);
        if (!oldData) return;
        if ("saveRef" in oldData) this.BlockSaves[oldData.type].bin[oldData.saveRef!] = undefined;
        if ("worldRef" in oldData) this.BlockWorlds[oldData.type].bin[oldData.worldRef!] = undefined;
        if ("healthRef" in oldData) this.BlockHealth[oldData.type].bin[oldData.healthRef!] = undefined;
        this.SetBlockAt(undefined, pos);
    }

    private GetNextId(bin: {[id: number]: unknown}): number {
        let id = 0;
        while (true) {
            id++
            if (id in bin && bin[id] !== undefined) continue;
            break;
        }
        return id;
    }

    public InitializeBlockDataAt(block: number, pos: Vector3): void {
        const data: WorldBlockData = {
            type: block,
        }
        if (block in this.BlockSaves) {
            const id = this.GetNextId(this.BlockSaves[block].bin);
            this.BlockSaves[block].bin[id] = this.BlockSaves[block].default;
            data["saveRef"] = id;
        }
        if (block in this.BlockWorlds) {
            const id = this.GetNextId(this.BlockWorlds[block].bin);
            this.BlockWorlds[block].bin[id] = this.BlockWorlds[block].default;
            data["worldRef"] = id;
        }

        this.SetBlockAt(data, pos);
    }

    public CreateBlockAt(block: number, pos: Vector3): void {
        this.island.voxelWorld.WriteVoxelAt(pos, block, true);
        this.InitializeBlockDataAt(block, pos);
    }

    public PlaceBlockAt(player: Player, pos: Vector3): void {
        const toolName = player.character?.heldItem?.itemDef.displayName;
        if (!toolName) return;
        if (!ItemManager.Get().TryGetBlock(toolName)) return print("Failed block");
        if (this.GetBlockAt(pos)) return print("Failed position");
        if (!ItemManager.Get().TryTakePlayerItems(player, toolName, 1)) return print("Failed inventory");
        this.CreateBlockAt(this.BlockIds[toolName], pos);
        print(`Placed ${toolName} at ${pos}`);
    }

    public DamageBlockAt(player: Player, damage: number, pos: Vector3): number | undefined {
        const blockData = this.GetBlockAt(pos);
        if (!blockData) return;
        if (!("healthRef" in blockData)) {
            if (!(blockData.type in this.BlockHealth)) return;
            const id = this.GetNextId(this.BlockHealth[blockData.type].bin);
            this.BlockHealth[blockData.type].bin[id] = this.BlockHealth[blockData.type].default;
            blockData["healthRef"] = id;
        }

        this.BlockHealth[blockData.type].bin[blockData["healthRef"]!]! -= damage;
        if (this.BlockHealth[blockData.type].bin[blockData["healthRef"]!]! <= 0) {
            this.island.voxelWorld.WriteVoxelAt(pos, 0, true);
            this.DeleteBlockDataAt(pos);
            ItemManager.Get().GivePlayerBlockDrop(player, this.BlockNames[blockData.type]);
            print(`Broke ${this.BlockNames[blockData.type]} with ${damage} damage`);
            return;
        }
        print(`Hit ${this.BlockNames[blockData.type]} for ${damage} damage, Health: ${this.BlockHealth[blockData.type].bin[blockData["healthRef"]!]!}`);
        this.SetBlockAt(blockData, pos);
    }

    public PlayerHitBlockAt(player: Player, pos: Vector3): void {
        const block = this.GetBlockAt(pos);
        if (!block) return;
        const toolName = player.character?.heldItem?.itemDef.displayName;
        if (!toolName) return;
        const toolItem = ItemManager.Get().TryGetTool(toolName);
        if (!toolItem) return;
        const blockItem = ItemManager.Get().GetItem<BlockItemRegistry>(this.BlockNames[block.type]).data;
        const damageRatio = toolItem.data.type === blockItem.effectiveTool ? 1 : 0.25;
        this.DamageBlockAt(player, damageRatio * toolItem.data.damage, pos);
    }

    public constructor(island: IslandComponent) {
        this.island = island;
    }

    public RegisterBlocks(): void {
        this.island.voxelWorld.voxelWorldFile.blockIdToScopeName.forEach((scopedName) => {
            if (scopedName.id === 0) return;
            const name = scopedName.name.split(":")[1];
            this.BlockNames[scopedName.id] = name;
            this.BlockIds[name] = scopedName.id;

            const data = ItemManager.Get().GetItem<BlockItemRegistry>(name).data
            if ("save" in data && data.save !== undefined) {
                this.BlockSaves[scopedName.id] = {
                    default: data.save,
                    bin: {}
                }
            }

            if ("world" in data && data.world !== undefined) {
                this.BlockWorlds[scopedName.id] = {
                    default: data.world,
                    bin: {}
                }
            }

            if ("health" in data && data.health !== undefined) {
                this.BlockHealth[scopedName.id] = {
                    default: data.health,
                    bin: {}
                }
            }
        });
    }

    public TestDefault(): void {
        this.island.voxelWorld.LoadWorldFromSaveFile(this.island.voxelWorld.voxelWorldFile);

        const startTime = DateTime.now();
        let blockCount = 0;

        const startPos = this.size.div(-2);

        for (let x = startPos.x; x < startPos.x + this.size.x; x++) {
            this.Blocks[x] = {}
            for (let y = startPos.y; y < startPos.y + this.size.y; y++) {
                this.Blocks[x][y] = {}
                for (let z = startPos.z; z < startPos.z + this.size.z; z++) {
                    const position = new Vector3(x, y, z);
                    const voxelData = this.island.voxelWorld.ReadVoxelAt(position);
                    const block = VoxelWorld.VoxelDataToBlockId(voxelData);
                    if (block === 0) continue;
                    this.InitializeBlockDataAt(block, position);
                    blockCount++;
                }
            }
        }

        const endTime = DateTime.now();
        print(`Finished registering world data in ${math.round((endTime.TimestampMilliseconds - startTime.TimestampMilliseconds) / 10) / 100} seconds with ${blockCount} blocks`);
    }

    public InBounds(pos: Vector3): boolean {
        const startPos = this.island.bedrock.position.sub(this.size.div(2).add(new Vector3(2, 2, 2)));
        const endPos = this.island.bedrock.position.add(this.size.div(2).add(new Vector3(2, 2, 2)));

        if (pos.x < startPos.x) return false;
        if (pos.y < startPos.y) return false;
        if (pos.z < startPos.z) return false;
        if (pos.x > endPos.x) return false;
        if (pos.y > endPos.y) return false;
        if (pos.z > endPos.z) return false;
        return true;
    }
}