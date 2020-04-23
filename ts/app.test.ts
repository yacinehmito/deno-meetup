import { assert } from "https://deno.land/std/testing/asserts.ts";
import { App } from './app.tsx';

Deno.test(function appIsDefined() {
  assert(typeof App() !== 'undefined');
});
