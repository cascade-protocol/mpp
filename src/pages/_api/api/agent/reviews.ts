import { env } from "cloudflare:workers";
import { Expires } from "mpay/server";
import { mpay } from "../../../../mpay.server";

// Reviews aggregation API - $0.003 per request
export async function GET(request: Request) {
	const url = new URL(request.url);
	const placeId = url.searchParams.get("place") || "place_001";

	const result = await mpay.charge({
		amount: "3000", // 0.003 USD (6 decimals)
		currency: env.DEFAULT_CURRENCY!,
		recipient: env.DEFAULT_RECIPIENT!,
		expires: Expires.minutes(5),
		description: `Reviews for ${placeId}`,
	})(request);

	if (result.status === 402) return result.challenge;

	// Simulated reviews
	return result.withReceipt(
		Response.json({
			placeId,
			summary:
				"Excellent specialty coffee with a focus on single-origin beans. Known for their pour-over and espresso drinks.",
			sentiment: "very_positive",
			highlights: [
				"pour-over",
				"single-origin",
				"minimalist vibe",
				"friendly staff",
			],
			reviewCount: 2847,
			averageRating: 4.8,
			cost: "$0.003",
		}),
	);
}
