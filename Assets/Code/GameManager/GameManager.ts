import { Airship } from "@Easy/Core/Shared/Airship";
import { Game } from "@Easy/Core/Shared/Game";
import { Player } from "@Easy/Core/Shared/Player/Player";


export default class GameManager extends AirshipSingleton {
    public Shutdown(reason?: string): void {
        if (!Game.IsServer()) return;

        Airship.Players.GetPlayers().forEach((player) => player.Kick(`${reason !== undefined ? `${reason}! ` : ""}Server Shutdown!`))
    }

    public KickPlayer(player: Player, reason?: string): void {
        if (!Game.IsServer()) return;
        
        player.Kick(`${reason !== undefined ? `${reason}! ` : ""}Kicked From Game!`);
    }
}