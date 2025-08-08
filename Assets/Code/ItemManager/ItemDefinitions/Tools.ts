import { ToolItemRegistry } from "../ItemTypes";

const globalToolData: Pick<ToolItemRegistry["data"], "category"> = {
    category: "Tool",
}

export const ToolRegistries: ToolItemRegistry[] = [
    {
        displayName: "Wooden Axe",
        data: {
            ...globalToolData,
            description: "Used to cut trees",
            type: "Axe",
            damage: 5,
        }
    },
    {
        displayName: "Wooden Shovel",
        data: {
            ...globalToolData,
            description: "Now you can dig under your friends feet",
            type: "Shovel",
            damage: 5,
        }
    },
    {
        displayName: "Wooden Pickaxe",
        data: {
            ...globalToolData,
            description: "Don't mine at night!",
            type: "Pickaxe",
            damage: 5,
        }
    }
]