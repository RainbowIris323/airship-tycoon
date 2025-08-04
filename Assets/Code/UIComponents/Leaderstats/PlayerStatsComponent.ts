import PlayerNameComponent from "./PlayerNameComponent";
import StatComponent from "./StatComponent";

export default class PlayerStatsComponent extends AirshipBehaviour {
    public playerNameComponent: PlayerNameComponent;
    public statComponents: Array<StatComponent> = [];

    public DoStart(userId: string): void {
        this.playerNameComponent.DoUpdate(userId);
    }

    public DoUpdate(stats: Map<string, string>): void {
        this.statComponents.forEach((stat) => {
            stat.DoUpdate(stats.get(stat.name) ?? "N/A");
        })
    }
}