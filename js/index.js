/**
 * Main entry-point and API for Neue.
 *
 * Include this file in modern ES6 build systems. This is also made
 * available as an AMD/CommonJS module in `dist/neue.js`, or attached
 * to `window.Neue` when included on a page as a script tag.
 */

import "./footer";
import "./footnote";
import "./jump-scroll";
import "./navigation";
import Messages from "./messages";
import "./scroll-indicator";
import "./tabs";

// Export public API
export default { Messages };
