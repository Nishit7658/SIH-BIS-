import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FASTAPI_BASE = "http://127.0.0.1:8000";

async function proxy(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const targetPath = (params.path || []).join("/");
    const url = new URL(req.url);
    const targetUrl = `${FASTAPI_BASE}/api/${targetPath}${url.search}`;

    const headers = new Headers();
    req.headers.forEach((val, key) => {
      if (key !== "host" && key !== "connection" && key !== "content-length") {
        headers.set(key, val);
      }
    });

    const options: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = await req.arrayBuffer();
      // @ts-ignore
      options.duplex = "half";
    }

    const response = await fetch(targetUrl, options);

    const responseHeaders = new Headers();
    response.headers.forEach((val, key) => {
      responseHeaders.set(key, val);
    });

    const responseData = await response.arrayBuffer();

    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: `FastAPI Proxy Connection Error: ${err.message}` } },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
