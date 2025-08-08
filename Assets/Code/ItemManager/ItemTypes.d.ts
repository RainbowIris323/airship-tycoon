import { ItemDef } from "@Easy/Core/Shared/Item/ItemDefinitionTypes";

interface ItemRegistry extends Omit<ItemDef, "internalId" | "itemType"> {
    data: {
        category: "Block" | "Tool" | "Currency",
        description: string
    },
}

type ToolType = "Pickaxe" | "Axe" | "Shovel"

interface BlockItemWorldRegistry {
    tick?: (dt, data: unknown, save: {[key: number]: unknown} | undefined) => void,
    onPlace?: (player: Player, position: Vector3, data: unknown, save: {[key: number]: unknown} | undefined) => void,
    onPickup?: (player: Player, position: Vector3, data: unknown, save: {[key: number]: unknown} | undefined) => void,
    onLoad?: (position: Vector3, data: unknown, save: {[key: number]: unknown} | undefined) => void,
    onUnload?: (position: Vector3, data: unknown, save: {[key: number]: unknown} | undefined) => void,
    [key: string]: unknown,
}

interface BlockItemSaveRegistry {[key: number]: unknown}

interface BlockItemRegistry extends ItemRegistry {
    data: {
        category: "Block",
        world?: BlockItemWorldRegistry
        save?: BlockItemSaveRegistry,
        effectiveTool?: ToolType,
        droppedItems?: [item: string, [quantity: number[], weight: number[]]][],
        health?: number,
    } & ItemRegistry["data"],
}

interface ToolItemRegistry extends ItemRegistry {
    data: {
        category: "Tool",
        type: ToolType,
        damage: number
    } & ItemRegistry["data"],
}