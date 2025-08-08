import Character from "@Easy/Core/Shared/Character/Character";
import CharacterParentComponent from "./CharacterParentComponent";

interface PlayerDataKnown {
    version: number
    [key: string]: unknown;
}

interface PlayerData {
    character: Character;
    parentComponent: CharacterParentComponent;
    save: {
        version: number;
        profileId: number;
        coins: number;
        timePlayed: number;
        blocksBuilt: number;
        blocksMined: number;
        itemsCrafted: number;
    }
}