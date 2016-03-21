/**
 * Main entry-point and API for Forge.
 *
 * This file is transpiled to ES5 for usage through NPM. It is also made
 * available as an AMD/CommonJS module in `dist/forge.js`, or attached
 * to `window.Forge` when included on a page as a script tag.
 */

import './footer';
import './footnote';
import './jump-scroll';
import './navigation';
import Messages from './messages';
import './scroll-indicator';
import './tabs';

// Additional custom feature-detection test(s)
import './feature-detect/label-click';

// Export public API
export default { Messages };
