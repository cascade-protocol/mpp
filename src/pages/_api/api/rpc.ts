// RPC proxy endpoint for Tempo Moderato (testnet)
const RPC_URL = "https://rpc.moderato.tempo.xyz";

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const response = await fetch(RPC_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		const result = await response.json();
		return Response.json(result);
	} catch (error) {
		return Response.json(
			{
				jsonrpc: "2.0",
				error: {
					code: -32603,
					message: error instanceof Error ? error.message : "RPC proxy error",
				},
				id: null,
			},
			{ status: 500 },
		);
	}
}
