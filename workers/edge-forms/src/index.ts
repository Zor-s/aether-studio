/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Env {
  TURNSTILE_SECRET_KEY: string;
}

const worker = {
  async fetch(
    _request: Request,
    _env: Env,
    _ctx: unknown
  ): Promise<Response> {
    return new Response("Edge-Forms Worker Skeleton", { status: 200 });
  },
};

export default worker;
