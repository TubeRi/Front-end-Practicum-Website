import serverless from "serverless-http";

export function createWebHandler(app) {
  const invoke = serverless(app);
  return async function handler(request, context) {
    const url = new URL(request.url);
    const result = await invoke(
      {
        httpMethod: request.method,
        path: url.pathname,
        headers: Object.fromEntries(request.headers),
        multiValueQueryStringParameters: Object.fromEntries(
          [...new Set(url.searchParams.keys())].map((key) => [
            key,
            url.searchParams.getAll(key),
          ]),
        ),
        body: ["GET", "HEAD"].includes(request.method)
          ? null
          : await request.text(),
        isBase64Encoded: false,
        requestContext: { identity: { sourceIp: context.ip } },
      },
      {},
    );
    const headers = new Headers(result.headers);
    for (const [name, values] of Object.entries(
      result.multiValueHeaders || {},
    )) {
      headers.delete(name);
      for (const value of values) headers.append(name, value);
    }
    return new Response(
      result.isBase64Encoded ? Buffer.from(result.body, "base64") : result.body,
      { status: result.statusCode, headers },
    );
  };
}
