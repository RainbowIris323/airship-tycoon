import { Airship } from "@Easy/Core/Shared/Airship";
import { Game } from "@Easy/Core/Shared/Game";

export default class PlayerNameComponent extends AirshipBehaviour {
    public userImage: RawImage;
    public text: TMP_Text;
    
    public DoUpdate(userId: string): void {
        if (!Game.IsClient()) return;
        const user = Airship.Players.FindByUserId(userId);
        if (user === undefined) return;
        user.GetProfileImageTextureAsync().andThen((texture) => {
            if (texture === undefined) return;
            this.userImage.texture = texture;
        });
        this.text.text = user.username;
    }
}