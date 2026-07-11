/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Env {
  PORTFOLIO_BUCKET: unknown; // Will bind R2Bucket later
}

const worker = {
  async fetch(
    _request: Request,
    _env: Env,
    _ctx: unknown
  ): Promise<Response> {
    return new Response("Subdomain Router Worker Skeleton", { status: 200 });
  },
};

export default worker;
