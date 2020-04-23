import { render } from 'https://cdn.pika.dev/preact@10.3.0';
import { App } from './app.tsx';

interface Logo extends EventTarget {
  classList: Set<string>
}

function makeLogo(): Logo {
  const logo = new EventTarget() as any;
  logo.classList = new Set();
  return logo;
}

(window as any).document = {
  querySelectorAll() {
    return [makeLogo(), makeLogo()]
  }
}

const container = document.getElementById("app");
if (container) {
  render(App(), container);
}
