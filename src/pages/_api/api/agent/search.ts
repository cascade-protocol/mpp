import { env } from "cloudflare:workers";
import { Expires } from "mpay/server";
import { mpay } from "../../../../mpay.server";

// Search API - $0.002 per request
export async function GET(request: Request) {
	const url = new URL(request.url);
	const query = url.searchParams.get("q") || "coffee";

	const result = await mpay.charge({
		amount: "2000", // 0.002 USD (6 decimals)
		currency: env.DEFAULT_CURRENCY!,
		recipient: env.DEFAULT_RECIPIENT!,
		expires: Expires.minutes(5),
		description: `Search: ${query}`,
	})(request);

	if (result.status === 402) return result.challenge;

	// Simulated search results
	return result.withReceipt(
		Response.json({
			query,
			results: [
				{
					id: "place_001",
					name: "Blue Bottle Coffee",
					rating: 4.8,
					distance: "0.3 mi",
					price: "$$",
				},
				{
					id: "place_002",
					name: "Sightglass Coffee",
					rating: 4.6,
					distance: "0.5 mi",
					price: "$$",
				},
				{
					id: "place_003",
					name: "Ritual Coffee Roasters",
					rating: 4.5,
					distance: "0.8 mi",
					price: "$$",
				},
			],
			cost: "$0.002",
		}),
	);
}
