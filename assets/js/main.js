'use strict';

/* <--------------- Global Variables ---------------> */
var navPick = document.querySelector('nav').children[0]; // Navigation
var confirmPage = document.querySelector("#order-info").className; // Checks if user is on confirm page
var qty = document.querySelectorAll('.qty'); // Cart quantity
var formData = ""; // Data in the form
var formLength = ""; // Number of inputs in the form
var formType = ""; // Shipping, Billing, or Payment form
var shippingFormData = ""; // Data from the shipping form
var billingFormData = ""; // Data from the billing form
var paymentFormData = ""; // Data from the payment form
var strPrice = document.querySelectorAll('.price'); // Original prices
var updateCart = document.querySelector('#cart'); // The cart with items, prices, and qty
var updateSummary = document.querySelector('#price-values'); // Displayed prices are changed
var clickBag = ""; // Click bag icon to open cart
var clickX = ""; // Click x icon to close cart
var cont = ""; // Country name for shipping and tax costs
var state = ""; // State name for shipping and tax costs
var sub = 0; // Subtotal
var shipping = 0; // Shipping cost
var tax = 0; // Tax percentage
var sections = document.querySelectorAll(".confirm"); // Sections of the confirm page
var quantity = ""; // Cart quantity for confirm page
var list = ""; // Separate sections of the confirm page
var processed = ""; // Processed button
var save = ""; // Checks to see if user data was saved to the server
var buyInput = ""; // Selects all inputs for the shop all page
var setItem = ""; // Selects items in users cart
var remove = ""; // Sets the remove button for items in a users cart
var removeButton = ""; // Grabs remove button from DOM
var preCart = document.querySelector('#pre-checkout-form'); // Pre-checkout Cart values
var itemList = ""; // List of items in cart
var atcl = ""; // Defines each item
var hdr = ""; // Header for each item
var h = ""; // Name for each item
var para = ""; // Price for each item
var slc = ""; // Select qty for each item
var opt = ""; // Qty value for each item
var fig = ""; // Figure for an image
var image = ""; // Image for items
var rmv = ""; // Button to remove items from cart
var cnfqty = ""; // Qty value for confirm page
var itemIndex = ""; // Index of the item such as a0001 for apple
var footercls = document.querySelector("footer").className; // class of the footer used to select a page
// Used by for statements
var i = 0;
var j = 0;
// Arrays
var shipDataArr = []; // Used by shipping and billing
var paymentDataArr = [];
var normPrice = [];
var updatePrice = [];
var qtyArr = [];
var priceArr = [];
var localPricesArr = [];
var cartItemsArr = [];
var allItemsArr = [];
var selectedItemArr = [];

// Set these variables when on form pages

try {
  if (confirmPage !== "confirm") {
    formData = document.forms[0].children[1].children[0];
    formLength = document.forms[0].length - 2;
    formType = document.forms[0].id;
  }

} catch (e) {
  console.log("Could not set form elements");
}

// Set default nav values when no correct data has been entered
if (formType === 'shipping-form') {
  navPick.children[1].innerHTML = "";
  navPick.children[2].innerHTML = "";

} else if (formType === 'billing-form') {
  navPick.children[2].innerHTML = "";
  formData.children[0].children[0].removeAttribute("hidden");
  formData.children[0].children[1].removeAttribute("hidden");
  formData.children[0].setAttribute("aria-hidden", "false");
}

// Allow users to change qty amount

if (confirmPage !== "items") {
  for (i = 0; i < qty.length; i++) {
    qty[i].removeAttribute("hidden");
  }
}

// Used for styling when JavaScript is present
document.querySelector('html').className = 'js';

// Forward user to confirmation page when pressing the submit button on the payment form
if (formType === "payment-form") {
  document.querySelector("#payment-form").setAttribute("action", "../confirm/");
}


/* <--------------- Shipping Data Storage ---------------> */

// If there is data in the shipping local storage, write to local array and display the data in the form
if (typeof(localStorage.localShippingData) === "string" && formType === 'shipping-form') {
  for (i = 0; i < localStorage.localShippingData.split(",").length; i++) {
    shipDataArr[i] = localStorage.localShippingData.split(",")[i];
  }

  for (i = 0; i < formLength; i++) {
    formData.children[i].children[1].value = localStorage.localShippingData.split(",")[i];
  }

  navPick.children[1].innerHTML = "<a href=\"billing/\">Billing</a>";
  navPick.children[2].innerHTML = "<a href=\"payment/\">Payment</a>";

}

try {
  shippingFormData = document.querySelector('#shipping-form')[0].children[0];
} catch (e) {
  console.log("Could not set shippingFormData variables");
}

try {
  shippingFormData.addEventListener('input', shpData);
} catch (e) {
  console.log("Could not addEventListener to shippingFormData variables");
}

function shpData(x) {
  var type = x.target.parentElement.parentElement.parentElement.name; // Either Shipping or Billing form
  var verifyData = 0; // Verify phone and email formatting
  var checked = ""; // Check for same as shipping
  var atIndex = ""; // The index of @ in the email string
  var dotIndex = ""; // The index of . in the email string
  var phoneNumber = ""; // Digit only phone number

  try {
    checked = document.querySelector('#same-as-shipping').checked;
  } catch (e) {
    console.log("Could not set the checked variable");
  }

  // If checked write shipping data to form
  if (checked === true) {

    for (i = 0; i < localStorage.localShippingData.split(",").length; i++) {
      shipDataArr[i] = localStorage.localShippingData.split(",")[i];

    }

    for (i = 1; i < formLength; i++) {
      formData.children[i].children[1].value = localStorage.localShippingData.split(",")[i-1];
      formData.children[i].children[1].setAttribute("disabled", "true");
    }

    // If not checked just enter Billing data manually
  } else if (checked === false) {

    for (i = 1; i < formLength; i++) {
      shipDataArr[i-1] = formData.children[i].children[1].value;
    }

    for (i = 1; i < formLength; i++) {
      try {
        formData.children[i].children[1].removeAttribute("disabled");
      } catch (e) {
        console.log("Could not enable button");
      }
    }
    // If checked does not exist enter Shipping data manually
  } else {

    for (i = 0; i < formLength; i++) {
      shipDataArr[i] = formData.children[i].children[1].value;
    }

  }

  try {
    if (x.target.checkValidity() === false) {
      x.target.parentElement.querySelector('p').removeAttribute('hidden');
      x.target.classList = "error";
    } else if (x.target.checkValidity() === true) {
      x.target.parentElement.querySelector('p').setAttribute('hidden', 'true');
      x.target.removeAttribute('class');
    }
  } catch (e) {
    console.log("Could not set validation error attribute")
  }

  phoneNumber = shipDataArr[9];
  atIndex = shipDataArr[1].indexOf("@");
  dotIndex = shipDataArr[1].indexOf(".");

  if (x.target.id === "email") {
    // Verify email formatting
    if (dotIndex !== atIndex + 1 && dotIndex !== -1 && dotIndex !== shipDataArr[1].length - 1) {
      x.target.parentElement.querySelector('p').setAttribute('hidden', 'true');
      x.target.removeAttribute('class');
      // If failed, reset verification
    } else {
      x.target.parentElement.querySelector('p').removeAttribute('hidden');
      x.target.classList = "error";
    }
  }

  // Verify phone formatting for both Shipping and Billing
  if (phoneNumber.replace(/\D/g, '').length === 10 && x.target.id === "tel-national") {
    if (type === "shipping-form") {
      shipDataArr[9] = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      formData.children[9].children[1].value = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      x.target.parentElement.querySelector('p').setAttribute('hidden', 'true');
      x.target.removeAttribute('class');

    } else if (type === "billing-form") {
      shipDataArr[9] = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      formData.children[10].children[1].value = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      x.target.parentElement.querySelector('p').setAttribute('hidden', 'true');
      x.target.removeAttribute('class');
    } else {
      x.target.parentElement.querySelector('p').removeAttribute('hidden');
    }
    // If failed, reset verification
  } else if (phoneNumber.replace(/\D/g, '').length !== 10 && x.target.id === "tel-national") {
    x.target.parentElement.querySelector('p').removeAttribute('hidden');
    x.target.classList = "error";
  }

  if (type === "shipping-form") {
    localStorage.setItem("localShippingData", shipDataArr);
  } else if (type === "billing-form") {
    localStorage.setItem("localBillingData", shipDataArr);
  }

}

/* <--------------- Billing Data Storage ---------------> */
try {
  billingFormData = document.querySelector('#billing-form')[0].children[0];
} catch (e) {
  console.log("Could not set billingFormData variables");
}

// If there is data in the billing local storage, write to local array and display the data in the form
if (typeof(localStorage.localBillingData) === "string" && formType === 'billing-form') {
  for (i = 0; i < localStorage.localBillingData.split(",").length; i++) {
    shipDataArr[i] = localStorage.localBillingData.split(",")[i];
  }

  for (i = 1; i < formLength; i++) {
    formData.children[i].children[1].value = localStorage.localBillingData.split(",")[i-1];
  }

}

try {
  billingFormData.addEventListener('input', shpData);
} catch (e) {
  console.log("Could addEventListener to billingFormData variables");
}

/* <--------------- Payment Data Storage ---------------> */

try {
  paymentFormData = document.querySelector('#payment-form')[0].children[0];
} catch (e) {
  console.log("Could not set paymentFormData variables");
}

// If there is data in the payment local storage, write to local array and display the data in the form
if (typeof(localStorage.localPaymentData) === "string" && formType === 'payment-form') {
  for (i = 0; i < localStorage.localPaymentData.split(",").length; i++) {
    shipDataArr[i] = localStorage.localPaymentData.split(",")[i];
  }

  for (i = 0; i < formLength; i++) {
    formData.children[i].children[1].value = localStorage.localPaymentData.split(",")[i];
  }

}

try {
  paymentFormData.addEventListener('input', payData);
} catch (e) {
  console.log("Could not addEventListener to billingFormData variables");
}

function payData(x) {
  var cardDate = ""; // Month and Year values on user's card

  // Change Month and Year type from number to text to allow for "/"
  formData.children[1].children[1].setAttribute("type", "text");

  // Write form data to local array
  for (i = 0; i < formLength; i++) {
    paymentDataArr[i] = formData.children[i].children[1].value;
  }
  // Remove all non-digits from Month and Year value
  cardDate = paymentDataArr[1].replace(/\D/g, '');

  try {
    if (x.target.checkValidity() === false) {
      x.target.parentElement.querySelector('p').removeAttribute('hidden');
      x.target.classList = "error";
    } else if (x.target.checkValidity() === true) {
      x.target.parentElement.querySelector('p').setAttribute('hidden', 'true');
      x.target.removeAttribute('class');
    }
  } catch (e) {
    console.log("Could not set validation error attribute")
  }

  if (paymentDataArr[0].length >= 13 && paymentDataArr[0].length <= 19 &&
      x.target.id === "c-number") {
    x.target.parentElement.querySelector('p').setAttribute('hidden', 'true');
    x.target.removeAttribute('class');
  } else if ((paymentDataArr[0].length < 13 || paymentDataArr[0].length > 19) &&
      x.target.id === "c-number") {
    x.target.parentElement.querySelector('p').removeAttribute('hidden');
    x.target.classList = "error";
  }

  // If Month and Year is 4 digits long, add a "/" between them
  if (cardDate.length === 4 && x.target.id === "exp-date") {
    paymentDataArr[1] = cardDate.replace(/(\d{2})(\d{2})/, "$1/$2");
    formData.children[1].children[1].value = cardDate.replace(/(\d{2})(\d{2})/, "$1/$2");
    x.target.parentElement.querySelector('p').setAttribute('hidden', 'true');
    x.target.removeAttribute('class');
  } else if (cardDate.length !== 4 && x.target.id === "exp-date") {
    x.target.parentElement.querySelector('p').removeAttribute('hidden');
    x.target.classList = "error";
  }

  if (paymentDataArr[2].length === 3 && paymentDataArr[2].length === 4 &&
      x.target.id === "sec-code") {
    x.target.parentElement.querySelector('p').setAttribute('hidden', 'true');
    x.target.removeAttribute('class');
  } else if (paymentDataArr[2].length !== 3 && paymentDataArr[2].length !== 4 &&
      x.target.id === "sec-code") {
    x.target.parentElement.querySelector('p').removeAttribute('hidden');
    x.target.classList = "error";
  }

  // If payment data is verified, enable continue button
  if (paymentDataArr[3].indexOf(' ') > 0 && paymentDataArr[3].indexOf(' ') + 1
      < paymentDataArr[3].length && x.target.id === "c-name") {
    x.target.parentElement.querySelector('p').setAttribute('hidden', 'true');
    x.target.removeAttribute('class');
  } else if ((paymentDataArr[3].indexOf(' ') <= 0 || paymentDataArr[3].indexOf(' ') + 1
      >= paymentDataArr[3].length) && x.target.id === "c-name"){
    x.target.parentElement.querySelector('p').removeAttribute('hidden');
    x.target.classList = "error";
  }
  localStorage.setItem("localPaymentData", paymentDataArr);

}

/* <--------------- Shopping Cart Manipulation ---------------> */

try {
  clickBag = document.querySelector('#bag').children[0];
  clickX = document.querySelector('#x-button').children[0];
  updateCart.setAttribute("aria-hidden", "true");
} catch (e) {
  console.log("Could not load button variables");
}

// Show cart when screen is 720px or 45em wide
window.addEventListener('resize', displayCart);

function displayCart() {
  if (window.matchMedia('(min-width: 45em)').matches) {
    try {
      updateCart.setAttribute("aria-hidden", "false");
      updateCart.className = 'open';
    } catch (e) {
      console.log("Could not open cart");
    }
  }
}


try {
  updateCart.addEventListener('input', updateQty);
} catch (e) {
  console.log("Could not addEventListener to the cart");
}

try {
  preCart.addEventListener('input', updateQty);
} catch (e) {
  console.log("Could not addEventListener to the pre checkout cart");
}

try {
  shippingFormData.addEventListener('input', otherPrice);
} catch (e) {
  console.log("Could not addEventListener to shippingFormData");
}

function updateQty() {

  // Update quantity and price points when quantity of an item changes
  if (confirmPage !== "confirm") {
    sub = 0;
    for (i = 0; i < qty.length; i++) {
      console.log(qty[i].value)
      updatePrice[i] = localStorage.localNormPriceData.split(",")[i] * parseInt(qty[i].value);
      strPrice[i].innerHTML = "$" + updatePrice[i].toFixed(2);
      qtyArr[i] = qty[i].value;
      sub += updatePrice[i];
    }

    localStorage.setItem("localQtyData", qtyArr);

    updateSummary.children[0].children[0].children[1].innerHTML = "$" + sub.toFixed(2);
    try {
      updateSummary.children[3].children[0].children[1].innerHTML = "$" + ((tax * sub) + sub + shipping).toFixed(2);
    } catch (e) {
      console.log("Could not display total")
    }
    if (tax !== 0){
      updateSummary.children[2].children[0].children[1].innerHTML = "$" + (tax * sub).toFixed(2);
    }
  }

}

function otherPrice() {

  if (confirmPage !== "confirm") {
    localPricesArr = [];

    if (formType === "shipping-form") {
      cont = document.querySelector('#shipping-form #country-name').value;
      state = document.querySelector('#shipping-form #address-level1').value;
    }

    try {

      if (cont === "United States") {
        shipping = 10;

        if (state === "Alaska" || state === "Delaware" || state === "Montana" ||
            state === "New Hampshire" || state === "Oregon") {
          tax = 0;

        } else if (state === "Colorado") {
          tax = 0.029;

        } else if (state === "Alabama" || state === "Georgia" || state === "Hawaii" ||
                   state === "New York" || state === "Wyoming") {
          tax = 0.04;

        } else if (state === "Missouri") {
          tax = 0.0423;

        } else if (state === "Virginia") {
          tax = 0.043;

        } else if (state === "Louisiana") {
          tax = 0.0445;

        } else if (state === "Oklahoma" || state === "South Dakota") {
          tax = 0.045;

        } else if (state === "Nevada") {
          tax = 0.046;

        } else if (state === "Utah") {
          tax = 0.047;

        } else if (state === "North Carolina") {
          tax = 0.0475;

        } else if (state === "North Dakota" || state === "Wisconsin") {
          tax = 0.05;

        } else if (state === "New Mexico") {
          tax = 0.0513;

        } else if (state === "Maine" || state === "Nebraska") {
          tax = 0.055;

        } else if (state === "Arizona" || state === "Massachusetts") {
          tax = 0.056;

        } else if (state === "Ohio") {
          tax = 0.0575;

        } else if (state === "California" || state === "Florida" || state === "Idaho" ||
                   state === "Iowa" || state === "Kentucky" || state === "Maryland" ||
                   state === "Michigan" || state === "Pennsylvania" || state === "South Carolina" ||
                   state === "Vermont" || state === "West Virginia") {
          tax = 0.06;

        } else if (state === "Illinois" || state === "Texas") {
          tax = 0.0625;

        } else if (state === "Connecticut") {
          tax = 0.0635;

        } else if (state === "Arkansas" || state === "Kansas" || state === "Washington") {
          tax = 0.065;

        } else if (state === "New Jersey") {
          tax = 0.0663;

        } else if (state === "Minnesota") {
          tax = 0.0688;

        } else if (state === "Indiana" || state === "Mississippi" || state === "Rhode Island" ||
                   state === "Tennessee") {
          tax = 0.07;
        }

      } else if (cont === "Canada") {
        shipping = 15;
        tax = 0.10;

      } else if (cont === "United Kingdom") {
        shipping = 20;
        tax = 0.12;

      } else if (cont === "" || cont === null || cont.length < 4) {
        shipping = 0;
        tax = 0;

      } else {
        shipping = 30;
        tax = 0.15;
      }

      updateSummary.children[0].children[0].children[1].innerHTML = "$" + sub;

      if (cont !== "" || cont !== null || cont.length >= 4) {
        updateSummary.children[1].children[0].children[1].innerHTML = "$" + shipping.toFixed(2);
        updateSummary.children[2].children[0].children[1].innerHTML = "$" + (tax * sub).toFixed(2);
      }

      updateSummary.children[3].children[0].children[1].innerHTML = "$" + ((tax * sub) + sub + shipping).toFixed(2);

      localPricesArr[0] = sub;
      localPricesArr[1] = shipping;
      localPricesArr[2] = tax * sub;
      localPricesArr[3] = ((tax * sub) + sub + shipping);

      updateQty();

      localStorage.setItem("localPriceData", localPricesArr);

    } catch (e) {
      console.log("Could not update prices");
    }
  }

}

try {
  clickBag.addEventListener('click', openCart);
  clickX.addEventListener('click', closeCart);
} catch (e) {
  console.log("Could not addEventListener to buttons");
}

function openCart() {
  updateCart.setAttribute("aria-hidden", "false");
  updateCart.className = 'open';
}

function closeCart() {
  updateCart.setAttribute("aria-hidden", "true");
  updateCart.className = 'closed';
}

/* <--------------- Confirm Data ---------------> */

// If on the confirm page, add price, qty, and form data
if (document.querySelector("#order-info").className === "confirm") {

  for (i = 0; i < sections[0].children[1].childElementCount; i++) {
    quantity = localStorage.localQtyData.split(",")[i];

    console.log(quantity);
    sections[0].children[1].children[i].children[0].children[1].innerHTML = "Qty: " + quantity;
    sections[0].children[1].children[i].children[0].children[2].innerHTML = "$" + localStorage.localNormPriceData.split(",")[i];
  }

  for (i = 1; i < sections.length; i++) {
    list = sections[i].children[1];
    if (i === 1) {
      console.log("check");
      for (j = 0; j < list.childElementCount; j++) {
        list.children[j].children[1].innerHTML = localStorage.localShippingData.split(",")[j];
      }
    }
    if (i === 2) {
      console.log("check");
      for (j = 0; j < list.childElementCount; j++) {
        list.children[j].children[1].innerHTML = localStorage.localBillingData.split(",")[j];
      }
    }
    if (i === 3) {
      console.log("check");
      for (j = 0; j < list.childElementCount; j++) {
        list.children[j].children[1].innerHTML = localStorage.localPaymentData.split(",")[j];
      }
    }
  }
}

/* <--------------- Processed Data ---------------> */

try {
  processed = document.querySelector("#processed")[1];
  save = document.querySelector("#check-to-fail");
} catch (e) {
  console.log("Could not set buttons for confirm page")
}

try {
  processed.addEventListener('click', processData);
} catch (e) {
  console.log("failed to addEventListener to processed button");
}

function processData() {
  // This is where data would be sent to the remote server to be verified and saved
  if (save.checked === false) {
    console.log("Customer data was successfully saved");
    localStorage.clear();
    document.querySelector("#processed").setAttribute("action", "../processed/");

  } else {
    console.log("Failed to save Customer data");
    document.querySelector("#processed").setAttribute("action", "../failed/");
  }
}

/* <--------------- Shop for Items ---------------> */

if (confirmPage === "items") {
  buyInput = document.querySelectorAll('.item-button');
  qty = document.querySelectorAll('.qty');

  for (i = 0; i < buyInput.length-1; i++) {
    if (i % 2 === 0) {
      buyInput[i].type = "button";
      buyInput[i].addEventListener('click', addToCart);
    } else {
      buyInput[i].addEventListener('click', removeFromCart);
    }
  }
}

if (typeof(localStorage.localCartItems) === "string" && footercls === "shopping") {

  cartItemsArr = [];

  for (i = 0; i < localStorage.localCartItems.split(",").length; i++) {
    setItem = document.querySelector("#" + localStorage.localCartItems.split(",")[i]);
    remove = setItem.id.replace("a", "b");
    removeButton = document.querySelector('#' + remove);

    setItem.type = "image";
    setItem.src = "../assets/images/check.png";
    setItem.alt = "Item added to cart";

    cartItemsArr[i] = setItem.id;

    setItem.parentElement.querySelector('.qty').removeAttribute('hidden');
    removeButton.removeAttribute('hidden');
  }
  localStorage.setItem("localCartItems", cartItemsArr);
}

if (footercls === "shopping") {
  for (i = 0; i < qty.length; i++) {
    qty[i].addEventListener('input', storeQty);
  }
}

if (footercls === "shopping" && typeof(localStorage.localQtyData) === "string") {
  for (i = 0; i < cartItemsArr.length; i++) {
    qtyArr[i] = localStorage.localQtyData.split(",")[i];
    document.querySelector('#' + localStorage.localCartItems.split(",")[i]).parentElement.querySelector('.qty').value = qtyArr[i];
  }
}

function storeQty() {
  for (i = 0; i < cartItemsArr.length; i++) {
    qtyArr[i] = document.querySelector('#' + cartItemsArr[i]).parentElement.querySelector('.qty').value;
  }
  localStorage.setItem("localQtyData", qtyArr);
}

function addToCart(a) {
  var itemClicked = a.target;
  remove = itemClicked.id.replace("a", "b");
  removeButton = document.querySelector('#' + remove);

  itemClicked.type = "image";
  itemClicked.src = "../assets/images/check.png";
  itemClicked.alt = "Item added to cart";

  cartItemsArr.push(itemClicked.id);
  qtyArr.push("1");

  localStorage.setItem("localCartItems", cartItemsArr);
  localStorage.setItem("localQtyData", qtyArr);

  itemClicked.parentElement.querySelector('.qty').removeAttribute('hidden');
  removeButton.removeAttribute('hidden');
}

function removeFromCart(b) {
  var itemClicked = b.target;
  var add = itemClicked.id.replace("b", "a");
  var addButton = document.querySelector('#' + add);
  var index = cartItemsArr.indexOf(add);

  addButton.type = "button";
  addButton.removeAttribute('src');
  addButton.removeAttribute('alt');

  cartItemsArr.splice(index, 1);
  localStorage.setItem("localCartItems", cartItemsArr);

  try {
    qtyArr.splice(index, 1);
    localStorage.setItem("localQtyData", qtyArr);
  } catch (e) {
    console.log("Could not remove qty data")
  }

  itemClicked.parentElement.querySelector('.qty').setAttribute('hidden', 'true');
  itemClicked.setAttribute('hidden', 'true');
}

/* <--------------- Pre Checkout ---------------> */

if (footercls === "pre-checkout" || footercls === "shipping" ||
    footercls === "billing" || footercls === "payment" || footercls === "confirm") {

  for (i = 0; i < localStorage.localCartItems.split(",").length; i++) {
    cartItemsArr[i] = localStorage.localCartItems.split(",")[i];
  }

  if (footercls === "shipping") {
    fetch('../assets/items/data-root.txt')
      .then(function pullData(response){
        return response.text();
      })
      .then(function setData(itemData) {
        allItemsArr = itemData.split(/\r?\n/);
        fetchComplete();
      });
  } else {
    fetch('../assets/items/data.txt')
      .then(function pullData(response){
        return response.text();
      })
      .then(function setData(itemData) {
        allItemsArr = itemData.split(/\r?\n/);
        fetchComplete();
      });
  }

}

function fetchComplete() {
  for (i = 0; i < cartItemsArr.length; i++) {

    atcl = document.createElement("article");
    hdr = document.createElement("header");
    h = document.createElement("h4");
    para = document.createElement("p");
    slc = document.createElement("select");
    opt = document.createElement("option");
    fig = document.createElement("figure");
    image = document.createElement("img");
    itemList = document.querySelector(".items");
    rmv = document.createElement("input");
    cnfqty = document.createElement("p");

    itemIndex = parseInt(cartItemsArr[i].replace("a", ""));
    selectedItemArr = allItemsArr[itemIndex-1].split(",");

    atcl.id = "item-" + i;
    hdr.classList = "item-name";
    h.innerHTML = selectedItemArr[0];
    image.src = selectedItemArr[1];
    image.alt = selectedItemArr[2];
    para.classList = "price";
    para.innerHTML = selectedItemArr[3];
    slc.name = "qty";
    slc.classList = "qty";
    rmv.type = "button"
    rmv.id = "r" + i;
    rmv.classList = "remove-button"
    rmv.value = "Remove"
    cnfqty.classList = "qty";

    priceArr.push(parseFloat(selectedItemArr[3].replace("$", "")));
    sub += parseFloat(selectedItemArr[3].replace("$", ""));

    itemList.appendChild(document.createElement("li"));
    document.querySelectorAll(".items li")[i].appendChild(atcl);
    atcl.appendChild(hdr);
    hdr.appendChild(h);
    atcl.appendChild(fig);
    fig.appendChild(image);
    atcl.appendChild(para);

    if (confirmPage !== "confirm") {
      atcl.appendChild(slc);

      for (j = 1; j < 10; j++) {
        opt.value = j.toString();
        opt.innerHTML = j.toString();
        slc.appendChild(opt.cloneNode(true));
      }
      atcl.appendChild(rmv);
      document.querySelectorAll(".remove-button")[i].addEventListener('click', removeItem);
    } else {
      atcl.appendChild(cnfqty);
    }

  }

  updateSummary.children[0].children[0].children[1].innerHTML = "$" + sub.toFixed(2);
  localStorage.setItem("localNormPriceData", priceArr);

  qty = document.querySelectorAll('.qty');

  if (footercls === "pre-checkout" && typeof(localStorage.localQtyData) !== "string") {

    for (i = 0; i < qty.length; i++) {
      qtyArr[i] = qty[i].value;
    }

    localStorage.setItem("localQtyData", qtyArr);

  }

  strPrice = document.querySelectorAll('.price'); // Original prices

  // If qty has been changed update the subtotal

  try {
    sub = 0;
    for (i = 0; i < strPrice.length; i++) {
      qty[i].value = parseInt(localStorage.localQtyData.split(",")[i]);
      if (confirmPage === "confirm") {
        qty[i].innerHTML = "Qty: " + localStorage.localQtyData.split(",")[i];
      }
      updatePrice[i] = localStorage.localNormPriceData.split(",")[i] * parseInt(qty[i].value);
      strPrice[i].innerHTML = "$" + updatePrice[i].toFixed(2);
      sub += updatePrice[i];
    }
  } catch (e) {
    console.log("Could not update prices");
  }

  // If shipping data exist update the country and state names
  if (typeof(localStorage.localShippingData) === "string") {
    cont = localStorage.localShippingData.split(",")[2];
    state = localStorage.localShippingData.split(",")[3];
    otherPrice();
  }

  if (confirmPage !== "confirm") {

    try {
      updateSummary.children[0].children[0].children[1].innerHTML = "$" + sub.toFixed(2);
      updateSummary.children[1].children[0].children[1].innerHTML = "$" + shipping.toFixed(2);
      updateSummary.children[2].children[0].children[1].innerHTML = "$" + (tax * sub).toFixed(2);
      updateSummary.children[3].children[0].children[1].innerHTML = "$" + ((tax * sub) + sub + shipping).toFixed(2);

      localPricesArr[0] = sub;
      localPricesArr[1] = shipping;
      localPricesArr[2] = tax * sub;
      localPricesArr[3] = ((tax * sub) + sub + shipping);

      localStorage.setItem("localPriceData", localPricesArr);
    } catch (e) {
      console.log("Could not set prices");
    }

  } else {
    updateSummary.children[0].children[0].children[1].innerHTML = "$" + parseFloat(localStorage.localPriceData.split(",")[0]).toFixed(2);
    updateSummary.children[1].children[0].children[1].innerHTML = "$" + parseFloat(localStorage.localPriceData.split(",")[1]).toFixed(2);
    updateSummary.children[2].children[0].children[1].innerHTML = "$" + parseFloat(localStorage.localPriceData.split(",")[2]).toFixed(2);
    updateSummary.children[3].children[0].children[1].innerHTML = "$" + parseFloat(localStorage.localPriceData.split(",")[3]).toFixed(2);
  }

}

function removeItem(rbutton) {
  var index = parseInt(rbutton.target.id.replace("r", ""));

  cartItemsArr.splice(index, 1);
  localStorage.setItem("localCartItems", cartItemsArr);

  document.querySelector(".items").children[index].remove();
  priceArr = [];

  for (i = 0; i < document.querySelector(".items").children.length; i++) {
    priceArr[i] = parseFloat(document.querySelectorAll(".price")[i].innerHTML.replace("$", ""));
  }
  localStorage.setItem("localNormPriceData", priceArr);

}
