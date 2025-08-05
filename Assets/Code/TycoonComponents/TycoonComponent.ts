import { Game } from "@Easy/Core/Shared/Game";
import { Network } from "../CoreComponents/Network";
import { Player } from "@Easy/Core/Shared/Player/Player";
import ButtonComponent from "./ButtonComponent";
import TrackedNumberValue from "Code/UtilityComponents/TrackedUpdateValue";

export default class TycoonComponent extends AirshipBehaviour {
    @NonSerialized()
    public money: TrackedNumberValue = new TrackedNumberValue(0);
    public connectionId: number | undefined = undefined;
    @NonSerialized()
    public owner: string | undefined = undefined;
    public buttons: Array<ButtonComponent> = new Array<ButtonComponent>();
    public id: number;
    public invalidButtonMaterial: Material;
    public validButtonMaterial: Material;
    public buttonTickTimeout: number = 1;
    private _buttonTickTime: number = 0;
    private dirtyDependencies: boolean = true;

    protected Start(): void {
        if (!Game.IsServer) return;
        Network.ClientToServer.TycoonButtonPressed.server.OnClientEvent((player: Player, buttonName: string) => this.ButtonActivated(player, buttonName));
        this.dirtyDependencies = true;
        this.Tick();
    }

    protected ButtonActivated(player: Player, buttonName: string): void {
        if (!Game.IsServer) return;
        if (this.owner !== player.userId) return print('Failed to buy due to invalid player.');
        const component = this.buttons.find((button) => button.name === buttonName);
        if (component === undefined) return print('Failed to buy due to invalid component.');
        if (component.owned) return print('Failed to buy due to already owned.');
        for (let i = 0; i < component.dependencies.size(); i++) { //Ensure all required buttons are active
            if (!component.dependencies[i].activeSelf) return print('Failed to buy due to missing dependencies.');
        }
        if (!this.money.TryModifyValue(-component.price, [(value) => value >= 0])[0]) return print('Failed to buy due to low funds.');; //Buy item or fail
        component.unlocks.forEach((a) => {
            a.SetActive(true);
        })
        component.gameObject.SetActive(false);
        component.owned = true;
        this.dirtyDependencies = true;
    }

    protected Update(dt: number): void {
        if (!Game.IsServer()) return;
        this._buttonTickTime += dt;
        if (this._buttonTickTime < this.buttonTickTimeout) return;
        this.Tick();

    }

    public Tick(): void {
        if (!Game.IsServer()) return;
        this.buttons.forEach((button) => this.CheckValidCostButton(button));
        if (this.dirtyDependencies) {
            this.buttons.forEach((button) => this.CheckValidDependenciesButton(button));
            this.dirtyDependencies = false;
        }
        this._buttonTickTime = 0;
    }

    public SetButton(button: ButtonComponent, valid: boolean): void {
        if (!Game.IsServer()) return;
        const buttonTop = button.gameObject.transform.FindChild("button").FindChild("ButtonTop").gameObject;
        buttonTop.GetComponent<Renderer>()!.material = valid ? this.validButtonMaterial : this.invalidButtonMaterial;
    }

    public CheckValidCostButton(button: ButtonComponent): void {
        if (!Game.IsServer()) return;
        if (button.owned) return;
        if (this.money.GetValue() < button.price) return this.SetButton(button, false);
        this.SetButton(button, true);
    }

    public CheckValidDependenciesButton(button: ButtonComponent): void {
        if (!Game.IsServer()) return;
        if (button.owned) return;
        for (let i = 0; i < button.dependencies.size(); i++) { //Ensure all required buttons are active
            if (!button.dependencies[i].activeSelf) {
                button.gameObject.SetActive(false);
                return;
            }
        }
        button.gameObject.SetActive(true);
    }
};