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
    public animator: Animator | undefined = undefined;
    private pressed: boolean = false;

	override Start(): void {
        if (!Game.IsClient()) return;
        this.prompt.SetObjectText(`${this.name}`);
        this.prompt.SetActionText(`Buy $${this.price}`);
		this.prompt.onActivated.Connect(() => {
            if (this.pressed) return;
            this.pressed = true;
            if (this.animator !== undefined) {
                this.animator.SetTrigger("ButtonPressed");
                task.wait(2);
                this.animator.ResetTrigger("ButtonPressed");
            }
            Network.ClientToServer.TycoonButtonPressed.client.FireServer(this.name);
            this.pressed = false;
		});
	}
};