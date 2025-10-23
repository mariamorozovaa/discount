const originalPrice = document.querySelector("#original-price");

const increaseBtn = document.querySelector("#increase-btn");
const decreaseBtn = document.querySelector("#decrease-btn");
const quantity = document.querySelector("#quantity");

const discountPercent = document.querySelector("#discount-percent");

const promoCode = document.querySelector("#promo-code");
const applyPromoBtn = document.querySelector("#apply-promo-btn");
const promoMessage = document.querySelector("#promo-message");

const loyaltyLevel = document.querySelector("#loyalty-level");

const calculateBtn = document.querySelector("#calculate-btn");

const result = document.querySelector("#result");
const baseTotalNode = document.querySelector("#base-total");

const productDiscountValue = document.querySelector("#product-discount-value");
const productDiscountRow = document.querySelector("#product-discount-row");
const discountPercentText = document.querySelector("#discount-percent-text");

const promoDiscountValue = document.querySelector("#promo-discount-value");
const promoDiscountRow = document.querySelector("#promo-discount-row");
const promoCodeText = document.querySelector("#promo-code-text");

const loyaltyDiscountValue = document.querySelector("#loyalty-discount-value");
const loyaltyDiscountRow = document.querySelector("#loyalty-discount-row");
const loyaltyDiscountText = document.querySelector("#loyalty-discount-text");

const totalSavings = document.querySelector("#total-savings");
const finalPrice = document.querySelector("#final-price");

const cashbackValue = document.querySelector("#cashback-value");
const cashbackRow = document.querySelector("#cashback-row");

const freeShippingBadge = document.querySelector("#free-shipping-badge");

const errors = document.querySelector("#error");

const PROMO_CODES = {
  WELCOME2024: { type: "fixed", value: 500, description: "Скидка 500₽ для новых клиентов" },
  FREESHIP: { type: "shipping", value: 0, description: "Бесплатная доставка" },
  SAVE10: { type: "percent", value: 10, description: "Дополнительная скидка 10%" },
  VIP20: { type: "percent", value: 20, description: "Скидка 20% для VIP клиентов" },
};

const LOYALTY_LEVELS = {
  none: { cashback: 0, extraDiscount: 0 },
  bronze: { cashback: 3, extraDiscount: 0 },
  silver: { cashback: 5, extraDiscount: 2 },
  gold: { cashback: 7, extraDiscount: 5 },
};

function increaseQuantity() {
  let currValue = parseInt(quantity.value);
  if (currValue < 100) {
    quantity.value = currValue + 1;
  }
}

function decreaseQuantity() {
  let currValue = parseInt(quantity.value);
  if (currValue > 1) {
    quantity.value = currValue - 1;
  }
}

increaseBtn.addEventListener("click", increaseQuantity);
decreaseBtn.addEventListener("click", decreaseQuantity);

let appliedPromoCode = null;

function applyPromoCode() {
  let parsedPromoCode = promoCode.value.trim().toUpperCase();

  if (!parsedPromoCode) {
    showPromoMessage("Введите промокод", "error");
    return;
  } else {
    promoMessage.classList.add("hidden");
    promoMessage.textContent = "";
  }

  const currPromoCode = PROMO_CODES[parsedPromoCode];

  if (currPromoCode) {
    appliedPromoCode = parsedPromoCode;
    showPromoMessage("Промокод применен", "success");
    promoCode.disabled = true;
    applyPromoBtn.textContent = "Отменить";
    applyPromoBtn.classList.add("red-bcg");
  } else {
    appliedPromoCode = null;
    showPromoMessage("Промокод не найден", "error");
  }
}

function resetPromoCode() {
  appliedPromoCode = null;
  promoCode.value = "";
  promoCode.disabled = false;
  promoMessage.classList.add("hidden");
  promoMessage.textContent = "";
  applyPromoBtn.textContent = "Применить";
  applyPromoBtn.classList.remove("red-bcg");
}

function showPromoMessage(message, type) {
  promoMessage.classList.remove("hidden", "success", "error");
  promoMessage.textContent = "";
  promoMessage.textContent = message;
  promoMessage.classList.add(type);
}

applyPromoBtn.addEventListener("click", () => {
  if (applyPromoBtn.textContent === "Применить") {
    applyPromoCode();
  } else resetPromoCode();
});

function validateInputs(price, quantity) {
  if (isNaN(price)) {
    return "Введите стоимость товара";
  } else if (price <= 0) {
    return "Стоимость должна быть больше нуля";
  } else if (price > 1000000) {
    return "Максимальная стоимость товара: 1 000 000 ₽";
  } else if (quantity < 1 || quantity > 100) {
    return "Количество должно быть от 1 до 100";
  } else {
    return null;
  }
}

calculateBtn.addEventListener("click", () => {
  try {
    calculateFinalPrice();
  } catch (err) {
    errors.textContent = err.message;
  }
});

function calculateFinalPrice() {
  resetAllRows();
  const priceCurr = parseFloat(originalPrice.value);
  const quantityCurr = parseInt(quantity.value);
  const currDiscountPercent = parseInt(discountPercent.value);
  const currLoyaltyLevel = loyaltyLevel.value;
  const errorCurr = validateInputs(priceCurr, quantityCurr);
  let hasFreeShipping = false;

  if (errorCurr) {
    errors.textContent = errorCurr;
    errors.classList.remove("hidden");
    return;
  } else {
    errors.textContent = "";
    errors.classList.add("hidden");
  }

  const baseTotal = priceCurr * quantityCurr;
  console.log("baseTotal", baseTotal);

  result.classList.remove("hidden");
  baseTotalNode.textContent = baseTotal.toLocaleString("ru-RU") + " ₽";

  const afterDiscount = (baseTotal * currDiscountPercent) / 100;

  if (afterDiscount) {
    productDiscountRow.style.display = "flex";
    discountPercentText.textContent = currDiscountPercent;
    productDiscountValue.textContent = afterDiscount.toLocaleString("ru-RU");
  }

  let currentTotal = baseTotal - afterDiscount;
  console.log("afterPercentDiscount", currentTotal);

  if (appliedPromoCode !== null) {
    if (PROMO_CODES[appliedPromoCode].type === "fixed") {
      const min = Math.min(PROMO_CODES[appliedPromoCode].value, currentTotal);
      promoDiscountRow.style.display = "flex";
      promoCodeText.textContent = appliedPromoCode;
      promoDiscountValue.textContent = min.toLocaleString("ru-RU");

      currentTotal = currentTotal - min;
      console.log("afterFixedPromo", currentTotal);
    } else if (PROMO_CODES[appliedPromoCode].type === "shipping") {
      hasFreeShipping = true;
      promoDiscountRow.style.display = "none";
    } else if (PROMO_CODES[appliedPromoCode].type === "percent") {
      promoDiscountRow.style.display = "flex";
      promoCodeText.textContent = appliedPromoCode;
      promoDiscountValue.textContent = ((currentTotal * PROMO_CODES[appliedPromoCode].value) / 100).toLocaleString("ru-RU");
      currentTotal = currentTotal - (currentTotal * PROMO_CODES[appliedPromoCode].value) / 100;
      console.log("afterPercentPromo", currentTotal);
    }
  } else {
    console.log("PromoCode is empty");
  }

  const currCashback = LOYALTY_LEVELS[currLoyaltyLevel].cashback;
  const currExtraDisc = LOYALTY_LEVELS[currLoyaltyLevel].extraDiscount;

  let afterExtraDisc = (currentTotal * currExtraDisc) / 100;
  currentTotal = currentTotal - afterExtraDisc;
  console.log("afterExtraDisc", currentTotal);

  if (currExtraDisc !== 0) {
    loyaltyDiscountRow.style.display = "flex";
    loyaltyDiscountText.textContent = currExtraDisc;
    loyaltyDiscountValue.textContent = afterExtraDisc.toLocaleString("ru-RU");
  }

  let finalCashBack = (currentTotal * currCashback) / 100;
  console.log("CashBack", finalCashBack);
  cashbackRow.style.display = "flex";
  cashbackValue.textContent = finalCashBack;
  if (finalCashBack === 0) {
    cashbackRow.style.display = "none";
  }

  totalSavings.textContent = (
    parseFloat(promoDiscountValue.textContent) +
    parseFloat(productDiscountValue.textContent) +
    afterExtraDisc
  ).toLocaleString("ru-RU");
  finalPrice.textContent = (baseTotal - parseFloat(totalSavings.textContent)).toLocaleString("ru-RU");
  finalPrice.textContent += " ₽";
  totalSavings.textContent += " ₽";

  if (hasFreeShipping === true) {
    freeShippingBadge.style.display = "flex";
  }
}

function resetAllRows() {
  productDiscountRow.style.display = "none";
  promoDiscountRow.style.display = "none";
  loyaltyDiscountRow.style.display = "none";
  cashbackRow.style.display = "none";
  freeShippingBadge.style.display = "none";

  productDiscountValue.textContent = "0";
  promoDiscountValue.textContent = "0";
  loyaltyDiscountValue.textContent = "0";
  cashbackValue.textContent = "0";

  totalSavings.textContent = "0";
  finalPrice.textContent = "0";
}
