import ProximityPrompt from "@Easy/Core/Shared/Input/ProximityPrompts/ProximityPrompt";
import { Game } from "@Easy/Core/Shared/Game";
import { Network } from "../CoreComponents/Network";

export default class ButtonComponent extends AirshipBehaviour {
    @NonSerialized()
    public owned: boolean = false;
    public name: string = "";
    public price: number = 0;
    public dependencies: Array<GameObject> = [];
    public unlocks: Array<GameObject> = [];
    public prompt: ProximityPrompt;

	override Start(): void {
        if (!Game.IsClient()) return;
        this.prompt.SetObjectText(`${this.name}`);
        this.prompt.SetActionText(`Buy $${this.price}`);
		this.prompt.onActivated.Connect(() => {
            Network.ClientToServer.TycoonButtonPressed.client.FireServer(this.name);
		});
	}
};