import { BlockItemRegistry } from "../ItemTypes";

const globalBlockData: Pick<BlockItemRegistry["data"], "category"> = {
    category: "Block",
}

export const BlockRegistries: BlockItemRegistry[] = [
    {
        displayName: "Grass",
        data: {
            ...globalBlockData,
            description: "You need to touch grass!",
            effectiveTool: "Shovel",
            health: 10,
        }
    },
    {
        displayName: "Soil",
        data: {
            ...globalBlockData,
            description: "Plant, harvest, slurp",
            effectiveTool: "Shovel",
            health: 10,
        }
    },
    {
        displayName: "Dirt",
        data: {
            ...globalBlockData,
            description: "Dogs love it!",
            effectiveTool: "Shovel",
            health: 10,
        }
    },
    {
        displayName: "Gravel",
        data: {
            ...globalBlockData,
            description: "Don't stand under it!",
            effectiveTool: "Shovel",
            health: 10,
        }
    },
    {
        displayName: "Sand",
        data: {
            ...globalBlockData,
            description: "Crushing gravel since the 50's",
            effectiveTool: "Shovel",
            health: 10,
        }
    },
    {
        displayName: "Bedrock",
        data: {
            ...globalBlockData,
            description: "Mine it? well i mean you can try...",
            droppedItems: [["Stone", [[1], [100]]]]
        }
    },
    {
        displayName: "Stone",
        data: {
            ...globalBlockData,
            description: "Crush it, build with it, cut it, you can do anything with it!",
            effectiveTool: "Pickaxe",
            health: 10,
        }
    },
    {
        displayName: "Stone Deposit",
        data: {
            ...globalBlockData,
            description: "Crush it, build with it, cut it, you can do anything with it!",
            effectiveTool: "Pickaxe",
            droppedItems: [["Stone", [[4, 5, 6], [25, 50, 25]]], ["Stone Deposit", [[1], [100]]]],
            health: 40,
        }
    },
    {
        displayName: "Oak Wood",
        data: {
            ...globalBlockData,
            description: "Fire!",
            effectiveTool: "Axe",
            health: 10,
        }
    },
    {
        displayName: "Oak Plank",
        data: {
            ...globalBlockData,
            description: "Planks? now wheres my crafting table!",
            effectiveTool: "Axe",
            health: 10,
        }
    },
    {
        displayName: "Oak Stair",
        data: {
            ...globalBlockData,
            description: "No be like my cat... never move",
            effectiveTool: "Axe",
            health: 10,
        }
    },
    {
        displayName: "Oak Slab",
        data: {
            ...globalBlockData,
            description: "A wise man once said 'less is more' but he also called someone an idiot sandwich",
            effectiveTool: "Axe",
            health: 10,
        }
    },
]