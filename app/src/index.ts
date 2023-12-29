export interface Env {
	ORIGIN_HOST: string;
	WEBHOOK_URL: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// If you wish to validate the request, please add it here.

		const responseHeaders = new Headers({
			'Access-Control-Allow-Origin': env.ORIGIN_HOST !== '' ? env.ORIGIN_HOST : '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Max-Age': '86400',
		});

		switch (request.method) {
			case 'OPTIONS':
				return new Response(null, { status: 204, headers: responseHeaders });
			case 'POST':
				try {
					const init = {
						body: await request.text(),
						method: 'POST',
						headers: {
							'content-type': 'application/json;charset=UTF-8',
						},
					};
					const response = await fetch(env.WEBHOOK_URL, init);
					const result = JSON.stringify(await response.json());
					return new Response(result, { status: response.status, headers: responseHeaders });
				} catch (e) {
					return new Response('someting error occuered', { status: 500, headers: responseHeaders });
				}
			default:
				return new Response(null, { status: 405, headers: responseHeaders });
		}
	},
};
