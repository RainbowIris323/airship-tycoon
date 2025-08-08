import { Airship } from "@Easy/Core/Shared/Airship";
import { Asset } from "@Easy/Core/Shared/Asset";
import { BlockItemRegistry, ItemRegistry, ToolItemRegistry } from "./ItemTypes";
import { ItemRegistries } from "./ItemDefinitions";
import { Player } from "@Easy/Core/Shared/Player/Player";
import { ItemStack } from "@Easy/Core/Shared/Inventory/ItemStack";

export default class ItemManager extends AirshipSingleton {

    private items: {[name: string]: ItemRegistry} = {};
    private rng = new Random(0);

    protected Awake(): void {
        ItemRegistries.forEach((registry) => this.LoadItem(registry));
    }

    public GetItem<T extends ItemRegistry>(name: string): T {
        return this.items[name] as T;
    }

    public TryGetTool(name: string): ToolItemRegistry | undefined {
        if (!(name in this.items)) return;
        const item = this.items[name] as ToolItemRegistry;
        if (!("category" in item.data) || item.data["category"] !== "Tool") return;
        return item;
    }

    public TryGetBlock(name: string): BlockItemRegistry | undefined {
        if (!(name in this.items)) return;
        const item = this.items[name] as BlockItemRegistry;
        if (!("category" in item.data) || item.data["category"] !== "Block") return;
        return item;
    }

    private LoadItem(item: ItemRegistry): void {
        if (item.accessoryPaths) item.accessoryPaths.forEach((path) => Asset.LoadAsset(path));
        if (item.image) Asset.LoadAsset(item.image);
        Airship.Inventory.RegisterItem(item.displayName, item);
        this.items[item.displayName] = item;
    }

    public GivePlayerBlockDrop(player: Player, blockName: string): void {
        const itemData = this.GetItem<BlockItemRegistry>(blockName).data;
        if ("droppedItems" in itemData) {
            itemData.droppedItems!.forEach((item) => player.character!.inventory.AddItem(new ItemStack(item[0], this.rng.PickItemWeighted(item[1][0], item[1][1])[0] as number)));
            return;
        }
        player.character!.inventory.AddItem(new ItemStack(blockName, 1));
    }

    public TryTakePlayerItems(player: Player, itemName: string, quantity: number): boolean {
        const slot = player.character!.inventory.FindSlotWithItemType(itemName);
        if (slot === undefined) return false;
        const item = player.character!.inventory.GetItem(slot)!;
        if (item.amount < quantity) return false;
        item.SetAmount(item.amount - quantity);
        return true;
    }
}