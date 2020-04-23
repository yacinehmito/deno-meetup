/// <reference lib="dom" />

import { assert } from 'https://deno.land/std/testing/asserts.ts';
import { spinLogos } from './script.ts'

Deno.test('spinLogos adds the spin class to the logos', () => {
  const logo = { classList: new Set() };
  (window as any).document.querySelectorAll = () => [logo];
  spinLogos();
  assert(logo.classList.has('spin'));
});
