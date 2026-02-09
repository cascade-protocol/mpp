// [!region imports]
import { Mpay, tempo } from "mpay/client";
import { privateKeyToAccount } from "viem/accounts";

// [!endregion imports]

// [!region account]
const account = privateKeyToAccount("0x...");
// [!endregion account]

// [!region fetch]
const mpay = Mpay.create({
	polyfill: false,
	methods: [tempo.charge({ account })],
});
// [!endregion fetch]

// [!region usage]
const _response = await mpay.fetch("https://api.example.com/resource");
// [!endregion usage]