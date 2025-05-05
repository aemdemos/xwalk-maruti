/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // If the first child contains a <p>, convert it to an <h2> with the correct class
  const firstRow = block.children[0];
  if (firstRow && firstRow.querySelector('p')) {
    const p = firstRow.querySelector('p');
    const h2 = document.createElement('h2');
    h2.className = 'privacy-policy-title';
    h2.textContent = p.textContent;
    p.replaceWith(h2);
  }

  [...block.children].forEach((row, idx, arr) => {
    // Find the first two non-empty children (label and body)
    const children = [...row.children].filter(child => child.innerHTML.trim() !== '');
    if (children.length < 2) return; // skip if not enough content

    const label = children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    // Add custom icon
    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.innerHTML = '<span class="icon-plus">+</span>';
    summary.appendChild(icon);

    // decorate accordion item body
    const body = children[1];
    body.className = 'accordion-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);

    // Toggle icon and allow only one open at a time
    summary.addEventListener('click', (e) => {
      if (details.open) return;
      arr.forEach((otherRow, otherIdx) => {
        const otherDetails = block.children[otherIdx];
        if (otherDetails && otherDetails.tagName === 'DETAILS' && otherDetails !== details) {
          otherDetails.removeAttribute('open');
          const otherIcon = otherDetails.querySelector('.accordion-icon');
          if (otherIcon) {
            otherIcon.innerHTML = '<span class="icon-plus">+</span>';
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