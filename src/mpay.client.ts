import { Fetch, tempo } from "mpay/client";
import { config } from "./wagmi.config";

export const fetch = Fetch.from({
	methods: [
		tempo({
			client(chainId) {
				return config.getClient({ chainId: chainId as never });
			},
		}),
	],
});
