import CharacterParentComponent from "./CharacterParentComponent";
import { Airship, Platform } from "@Easy/Core/Shared/Airship";
import { Player } from "@Easy/Core/Shared/Player/Player";
import { Binding } from "@Easy/Core/Shared/Input/Binding";
import { PlayerData, PlayerDataKnown } from "./PlayerData";
import PlayerSaveUtility from "./PlayerSaveUtility";
import { Game } from "@Easy/Core/Shared/Game";
import IslandManager from "Code/IslandManager/IslandManager";
import { ItemStack } from "@Easy/Core/Shared/Inventory/ItemStack";

export default class PlayerManager extends AirshipSingleton {

    private autosaveFrequency = 300;
    private players: { [userId: string]: PlayerData } = {};

    //#region On Start
    protected Start(): void {
        Airship.Players.ObservePlayers((player) => this.OnPlayerConnected(player));
        this.RegisterActions();
        this.Autosave();
    }

    protected Autosave(): void {
        if (!Game.IsServer()) return;

        task.delay(this.autosaveFrequency, () => this.Autosave());
    }

    private RegisterActions(): void {
        if (!Game.IsClient()) return;

        Airship.Input.CreateAction("Primary", Binding.MouseButton(MouseButton.LeftButton));
        Airship.Input.CreateAction("Secondary", Binding.MouseButton(MouseButton.RightButton));
        Airship.Input.CreateAction("View", Binding.Key(Key.F5));

        Airship.Input.OnDown("View").Connect(() => Airship.Camera.ToggleFirstPerson());
    }

    //#endregion

    //#region On Player Join

    private OnPlayerConnected(player: Player): () => void {
        const character = player.SpawnCharacter(new Vector3(0, 0, 0));
        character.movement.rb.constraints = RigidbodyConstraints.FreezeAll;
        const parentComponent = character.gameObject.AddAirshipComponent<CharacterParentComponent>();
        this.players[player.userId] = {
            character: character,
            parentComponent: parentComponent,
            save: PlayerSaveUtility.GetDefaultSave(),
        }

        this.LoadPlayerData(player);
        IslandManager.Get().AssignPlayerIsland(player.userId);

        character.inventory.AddItem(new ItemStack("Wooden Pickaxe"));
        character.inventory.AddItem(new ItemStack("Wooden Shovel"));
        character.inventory.AddItem(new ItemStack("Stone Deposit", 1));

        Airship.Input.OnDown("Primary").Connect(() => this.TempOnPrimary());
        Airship.Input.OnDown("Secondary").Connect(() => this.TempOnSecondary());

        return () => this.OnPlayerDisconnected(player);
    }

    public TempOnPrimary() {
        const island = IslandManager.Get().GetPlayerIsland(Game.localPlayer.userId);
        if (!island) return;

        const ray = Airship.Camera.cameraSystem!.GetActiveCamera().ScreenPointToRay(Input.mousePosition)
        const cast = island.voxelWorld.RaycastVoxel(ray.origin, ray.direction, 30);
        if (!cast.Hit) return;

        const pos = cast.HitPosition.sub(cast.HitNormal.div(1.5)).sub(IslandManager.Get().GetPlayerIsland(Game.localPlayer.userId)!.bedrock.transform.position);
        island.world.PlayerHitBlockAt(Game.localPlayer, new Vector3(math.round(pos.x), math.round(pos.y), math.round(pos.z)));
    }

    public TempOnSecondary() {
        const island = IslandManager.Get().GetPlayerIsland(Game.localPlayer.userId);
        if (!island) return;

        const ray = Airship.Camera.cameraSystem!.GetActiveCamera().ScreenPointToRay(Input.mousePosition)
        const cast = island.voxelWorld.RaycastVoxel(ray.origin, ray.direction, 30);
        if (!cast.Hit) return;

        const pos = cast.HitPosition.add(cast.HitNormal.div(1.5)).sub(IslandManager.Get().GetPlayerIsland(Game.localPlayer.userId)!.bedrock.transform.position);
        island.world.PlaceBlockAt(Game.localPlayer, new Vector3(math.round(pos.x), math.round(pos.y), math.round(pos.z)));
    }

    public async LoadPlayerData(player: Player): Promise<void> {
        if (!Game.IsServer()) return;

        const result = await Platform.Server.DataStore.GetKey<PlayerDataKnown>(
            `PlayerData:${player.userId}`,
        );
        if (!result) return;
        print(`Loaded save for player: ${player.username}`);
        this.players[player.userId]["save"] = PlayerSaveUtility.UpdateSave(result);
    }

    //#endregion

    //#region On Player Leave

    private OnPlayerDisconnected(player: Player): void {
        this.SavePlayerData(player);
        this.players[player.userId] = undefined!;
    }

    public async SavePlayerData(player: Player): Promise<void> {
        if (!Game.IsServer()) return;

        await Platform.Server.DataStore.SetKey(`PlayerData:${player.userId}`, this.players[player.userId]["save"]);
        print(`Saved data for player: ${player.username}`);
    }

    //#endregion

    public GetPlayerData(userId: string): PlayerData {
        return this.players[userId];
    }
}