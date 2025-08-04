export default class HideChildrenComponent extends AirshipBehaviour {
    protected Awake(): void {
        for (let i = 0; i < this.gameObject.transform.childCount; i++) this.gameObject.transform.GetChild(i).gameObject.SetActive(false);
    }
};