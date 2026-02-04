// RPC configuration for Tempo Moderato (testnet)
const RPC_URL = "https://rpc.moderato.tempo.xyz";
// alphaUSD on Moderato
const DEFAULT_CURRENCY = "0x20c0000000000000000000000000000000000001";

// Helper to make RPC calls
async function rpcCall(method: string, params: unknown[]) {
	const response = await fetch(RPC_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			jsonrpc: "2.0",
			method,
			params,
			id: 1,
		}),
	});
	return response.json();
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { action, address } = body;

		if (action === "fund") {
			if (!address || !address.startsWith("0x")) {
				return Response.json({ error: "Invalid address" }, { status: 400 });
			}

			// Call the Tempo faucet RPC method
			const result = await rpcCall("tempo_fundAddress", [address]);

			if (result.error) {
				console.error("[Wallet API] Faucet error:", result.error);
				return Response.json({ error: result.error.message }, { status: 500 });
			}

			return Response.json({ success: true, txHash: result.result });
		}

		if (action === "balance") {
			if (!address || !address.startsWith("0x")) {
				return Response.json({ error: "Invalid address" }, { status: 400 });
			}

			// Get token balance via eth_call
			const result = await rpcCall("eth_call", [
				{
					to: DEFAULT_CURRENCY,
					data: `0x70a08231000000000000000000000000${address.slice(2)}`, // balanceOf(address)
				},
				"latest",
			]);

			if (result.error) {
				if (result.error.message?.includes("Uninitialized")) {
					return Response.json({ balance: "0" });
				}
				return Response.json({ error: result.error.message }, { status: 500 });
			}

			const balance = BigInt(result.result || "0x0");
			return Response.json({ balance: balance.toString() });
		}

		return Response.json({ error: "Invalid action" }, { status: 400 });
	} catch (error) {
		return Response.json(
			{ error: error instanceof Error ? error.message : "Request failed" },
			{ status: 500 },
		);
	}
}
