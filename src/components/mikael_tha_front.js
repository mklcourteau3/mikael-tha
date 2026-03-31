/*
 * #Mikael: script built to handle clicks on products in the results list. Note
 * that the buttons "View" and "Add to cart" are clickable, but also the clicks
 * on other items of the products in the search results list are still captured,
 * this is to help increasing the click rate (particularly for small devices
 * users, who very often tap products pictures rather than clicking small buttons).
 * 
 */

const hitsContainer = document.getElementById('hits');

hitsContainer.addEventListener('click', (event) => {
  const addToCartBtn = event.target.closest('[data-action="add-to-cart"]');

  const hit = event.target.closest('a');
  if (!hit) return;

  const objectId = hit.dataset.objectId;
  const position = hit.dataset.position*1; // #Mikael: *1 avoids passing a string, which generates an error on Algolia side.
  const queryId = hit.dataset.queryId;

  if (addToCartBtn) {
    // #Mikael: send conversion to the server.
    // was for dev only -> fetch('http://localhost:3000/conversion', {
    fetch('/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectId, position, queryId })
    })
    .then(() => console.log('conversion sent to the server'))
    .catch(err => console.error('Error:', err));
    return;
  }

  // #Mikael: send the click to the server.
  // was for dev only -> fetch('http://localhost:3000/click', {
  fetch('/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ objectId, position, queryId })
  })
  .then(() => console.log('Clic sent to the server'))
  .catch(err => console.error('Error:', err));
});