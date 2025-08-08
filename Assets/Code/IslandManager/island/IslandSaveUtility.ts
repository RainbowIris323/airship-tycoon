export default class IslandSaveUtility {

    private static versions: {
        [version: number]: (last: IslandDataKnown) => IslandDataKnown
    } = {
        0: () => ({
            version: 0,
            profileId: 0,
            world: "",
        })
    }

    public static UpdateSave(save: IslandDataKnown): IslandData["save"] {
        if (!(save.version + 1 in this.versions)) return save as IslandData["save"];
        return this.UpdateSave(this.versions[save.version + 1](save));
    }

    public static GetDefaultSave(): IslandData["save"] {
        return (this.UpdateSave(this.versions[0]({} as IslandDataKnown)));
    }
}