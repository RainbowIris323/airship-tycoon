import { NetworkSignal } from "@Easy/Core/Shared/Network/NetworkSignal";

/*
 * These are example remote events. They don't do anything and are just here as an example.
 */
export const Network = {
	ClientToServer: {
		TycoonButtonPressed: new NetworkSignal<[buttonName: string]>("TycoonButtonPressed"),
	},
	ServerToClient: {
		LeaderStatsUpdate: new NetworkSignal<[leaderstats: Map<string, Map<string, string>>]>("LeaderStatsUpdate"),
	},
};
