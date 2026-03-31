/*
 * #Mikael: note that this component contains erros ("button" within "a", multiple
 * id="view-item" and id="add-to-cart" on the final page) but considering that
 * this code is PROVIDED BY THE CLIENT, I adapt to the code instead of correcting
 * the errors myself (I can flag the errors verbally).
 * 
 * Changes made:
 * - Removed the class "result-hit" in the wraping "a", to enable capturing a
 * click on individual components within "result-hit", particularly useful to
 * capture the clicks on the buttons "View" and "Add to cart".
 * - Added the data attribute "data-action" to the button "Add to cart" to enable
 * separating the clic on "Add to cart" from other clics (corresponding to "view")
 * to still enabling the access to the "view product" page by clicking anywhere
 * on the product (to maintain a high click rate, particularly for mobile users),
 * and to drive the appropriate conversion in Insight.
 * - Added the data attributes "data-object-id", "data-position" and "data-query-id"
 * to the main container.
 * 
 */

const resultHit = hit => `<a class="" data-object-id="${hit.objectID}" data-position="${hit.__position}" data-query-id="${hit.__queryID}">
  <div class="result-hit__image-container">
    <img class="result-hit__image" src="${hit.image}" />
  </div>
  <div class="result-hit__details">
    <h3 class="result-hit__name">${hit._highlightResult.name.value}</h3>
    <p class="result-hit__price">$${hit.price}</p>
  </div>
  <div class="result-hit__controls">
    <button id="view-item" class="result-hit__view">View</button>
    <button id="add-to-cart" class="result-hit__cart" data-action="add-to-cart">Add To Cart</button>
  </div>
</a>`;

export default resultHit;
