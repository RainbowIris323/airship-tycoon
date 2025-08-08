import { PlayerData, PlayerDataKnown } from "./PlayerData";

export default class PlayerSaveUtility {

    private static versions: {
        [version: number]: (last: PlayerDataKnown) => PlayerDataKnown
    } = {
        0: () => ({
            version: 0,
            profileId: 0,
            coins: 0,
            timePlayed: 0,
            blocksBuilt: 0,
            blocksMined: 0,
            itemsCrafted: 0,
        })
    }

    public static UpdateSave(save: PlayerDataKnown): PlayerData["save"] {
        if (!(save.version + 1 in this.versions)) return save as PlayerData["save"];
        return this.UpdateSave(this.versions[save.version + 1](save));
    }

    public static GetDefaultSave(): PlayerData["save"] {
        return (this.UpdateSave(this.versions[0]({} as PlayerDataKnown)));
    }
}