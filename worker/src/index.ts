interface Env {
	AUTH_PASS: string;
	AUTH_USER: string;
	ASSETS: Fetcher;
}

function unauthorizedResponse() {
	return new Response("Unauthorized", {
		status: 401,
		headers: {
			"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
			"Content-Type": "text/plain",
			"WWW-Authenticate": 'Basic realm="mpp-docs"',
		},
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (!env.AUTH_PASS) {
			return new Response("Missing AUTH_PASS", {
				status: 500,
				headers: {
					"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
					"Content-Type": "text/plain",
				},
			});
		}

		const expectedUser = env.AUTH_USER || "eng";
		const expectedPass = env.AUTH_PASS;

		const authHeader = request.headers.get("Authorization");
		if (!authHeader || !authHeader.startsWith("Basic ")) {
			return unauthorizedResponse();
		}

		let authenticated = false;
		try {
			const credentials = atob(authHeader.slice(6));
			const [user, pass] = credentials.split(":");
			if (user === expectedUser && pass === expectedPass) {
				authenticated = true;
			}
		} catch {
			authenticated = false;
		}

		if (!authenticated) {
			return unauthorizedResponse();
		}

		const response = await env.ASSETS.fetch(request);
		const headers = new Headers(response.headers);
		headers.set("Cache-Control", "private, no-store");

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	},
};
