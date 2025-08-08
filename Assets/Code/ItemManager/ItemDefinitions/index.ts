import { ItemRegistry } from "../ItemTypes";
import { BlockRegistries } from "./Blocks";
import { ToolRegistries } from "./Tools";

export const ItemRegistries: ItemRegistry[] = [
    ...ToolRegistries,
    ...BlockRegistries,
]