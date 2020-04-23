// Taken from https://gist.github.com/kitsonk/f8210d2f802a0e5396abda32552be0dc

import {
  green,
  cyan,
  bold,
  yellow,
  red
} from "https://deno.land/std@v0.20.0/fmt/colors.ts";

import {
  Application,
  HttpError,
  send,
  Status
} from "https://deno.land/x/oak/mod.ts";

const app = new Application();

// Error handler middleware
app.use(async (context, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof HttpError) {
      context.response.status = e.status as any;
      if (e.status >= 500) {
        console.log("Server Error:", red(bold(e.message)));
        console.log(e.stack);
      }
      if (e.expose) {
        context.response.body = `<!DOCTYPE html>
        <html>
            <body>
            <h1>${e.status} - ${e.message}</h1>
            </body>
        </html>`;
      } else {
        context.response.body = `<!DOCTYPE html>
        <html>
            <body>
            <h1>${e.status} - ${Status[e.status]}</h1>
            </body>
        </html>`;
      }
    } else if (e instanceof Error) {
      context.response.status = 500;
      context.response.body = `<!DOCTYPE html>
        <html>
            <body>
            <h1>500 - Internal Server Error</h1>
            </body>
        </html>`;
      console.log("Unhandled Error:", red(bold(e.message)));
      console.log(e.stack);
    }
  }
});

// Logger
app.use(async (context, next) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  console.log(
    `${green(context.request.method)} ${cyan(context.request.url)} - ${bold(
      String(rt)
    )}`
  );
});

// Response Time
app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Send static content
app.use(async context => {
  await send(context, context.request.path, {
    root: `${Deno.cwd()}/www`,
    index: "index.html"
  });
});

const address = "127.0.0.1:8000";
console.log(bold("Start listening on ") + yellow(address));
await app.listen(address);
