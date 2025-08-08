interface IslandDataKnown {
    version: number;
    world: string;
    [key: string]: unknown;
}

interface WorldBlockData {
    type: number,
    healthRef?: number,
    worldRef?: number,
    saveRef?: number,
}

interface IslandData {
    save: {
        version: number;
        profileId: number;
        world: string;
    }
}