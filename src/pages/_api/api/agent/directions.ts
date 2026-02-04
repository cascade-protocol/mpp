import { env } from "cloudflare:workers";
import { Expires } from "mpay/server";
import { mpay } from "../../../../mpay.server";

// Directions API - $0.002 per request
export async function GET(request: Request) {
	const url = new URL(request.url);
	const destination = url.searchParams.get("to") || "Blue Bottle Coffee";

	const result = await mpay.charge({
		amount: "2000", // 0.002 USD (6 decimals)
		currency: env.DEFAULT_CURRENCY!,
		recipient: env.DEFAULT_RECIPIENT!,
		expires: Expires.minutes(5),
		description: `Directions to ${destination}`,
	})(request);

	if (result.status === 402) return result.challenge;

	// Simulated directions
	return result.withReceipt(
		Response.json({
			destination,
			duration: "6 min walk",
			distance: "0.3 mi",
			steps: [
				"Head north on Market St",
				"Turn right onto 4th St",
				"Destination will be on your left",
			],
			cost: "$0.002",
		}),
	);
}
