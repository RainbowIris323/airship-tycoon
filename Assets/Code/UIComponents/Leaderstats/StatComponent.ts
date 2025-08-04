import { Game } from "@Easy/Core/Shared/Game";

export default class StatComponent extends AirshipBehaviour {
    public text: TMP_Text;
    public name: string;

    public DoUpdate(value: string): void {
        if (!Game.IsClient()) return;
        this.text.text = value;
    }
}