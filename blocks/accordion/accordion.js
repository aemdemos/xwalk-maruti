/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row, idx, arr) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    // Add custom icon
    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.innerHTML = '<span class="icon-plus">+</span>';
    summary.appendChild(icon);

    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);

    // Toggle icon and allow only one open at a time
    summary.addEventListener('click', (e) => {
      // If already open, let it close
      if (details.open) return;
      // Close all others
      arr.forEach((otherRow, otherIdx) => {
        if (otherIdx !== idx) {
          const otherDetails = block.children[otherIdx];
          if (otherDetails && otherDetails.tagName === 'DETAILS') {
            otherDetails.removeAttribute('open');
            const otherIcon = otherDetails.querySelector('.accordion-icon');
            if (otherIcon) {
              otherIcon.innerHTML = '<span class="icon-plus">+</span>';
            }
          }
        }
      });
    });
    details.addEventListener('toggle', () => {
      const iconSpan = summary.querySelector('.accordion-icon');
      if (details.open) {
        iconSpan.innerHTML = '<span class="icon-minus">&minus;</span>';
      } else {
        iconSpan.innerHTML = '<span class="icon-plus">+</span>';
      }
    });
  });
}