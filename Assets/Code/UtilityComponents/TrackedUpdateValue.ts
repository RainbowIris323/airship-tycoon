export default class TrackedNumberValue {
    private value: number;
    private connections: Map<number, (value: number, oldValue: number) => void> = new Map<number, (value: number, oldValue: number) => void>();
    private nextId = 0;
    
    public constructor(value: number) {
        this.value = value;
    }

    public GetValue(): number {
        return this.value;
    }

    public SetValue(value: number): [value: number, oldValue: number] {
        if (value === this.value) return [value, value];
        return this.OnChanged(value, this.value)
    }

    public ModifyValue(change: number): [value: number, oldValue: number] {
        if (this.value === this.value + change) return [this.value, this.value];
        return this.OnChanged(this.value + change, this.value)
    }

    /**
     * Tries to modify the value will fail if the new value fails any checks.
     */
    public TryModifyValue(change: number, checks: Array<(value: number) => boolean>): [success: boolean, value: number, oldValue: number] {
        const value = this.value + change;
        for (let i = 0; i < checks.size(); i++) {
            if (checks[i](value) === false) return [false, value, this.value];
        }
        if (this.value === this.value + change) return [true, value, this.value];
        return [true, ...this.OnChanged(this.value + change, this.value)];
    }

    private OnChanged(value: number, oldValue: number): [value: number, oldValue: number] {
        this.value = value;
        this.connections.forEach((func) => {
            func(value, oldValue);
        });
        print(`Fired ${this.connections.size()} callbacks | TrackedNumberValue.OnChanged`);
        return [value, oldValue];
    }

    public Connect(func: (value: number, oldValue: number) => void): number {
        this.nextId++
        this.connections.set(this.nextId, func);
        print(`Connected callback id:${this.nextId} | TrackedNumberValue.Connect`);
        return this.nextId;
    }

    public Disconnect(id: number): ((value: number, oldValue: number) => void) | undefined {
        const func = this.connections.get(id);
        this.connections.delete(id);
        print(`Disconnected callback id:${id} | TrackedNumberValue.Disconnect`);
        return func;
    }
};