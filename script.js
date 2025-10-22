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
const productDiscountValue = document.querySelector("#product-discount-value"); //- Скидка на товар (строка `product-discount-row`, значения `discount-percent-text`, `product-discount-value`)
const promoDiscountValue = document.querySelector("#promo-discount-value"); //- Промокод (строка `promo-discount-row`, значения `promo-code-text`, `promo-discount-value`)
const loyaltyDiscountValue = document.querySelector("#loyalty-discount-value"); //- Скидка лояльности (строка `loyalty-discount-row`, значения `loyalty-discount-text`, `loyalty-discount-value`)
const totalSavings = document.querySelector("#total-savings");
const finalPrice = document.querySelector("#final-price");
const cashbackValue = document.querySelector("#cashback-value"); //- Кэшбэк (строка `cashback-row`, значение `cashback-value`)
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

function increaceQuantity() {
  let currValue = parseInt(quantity.value);
  if (currValue < 100) {
    quantity.value = currValue + 1;
  }
}

function decreaceQuantity() {
  let currValue = parseInt(quantity.value);
  if (currValue > 1) {
    quantity.value = currValue - 1;
  }
}

increaseBtn.addEventListener("click", increaceQuantity);
decreaseBtn.addEventListener("click", decreaceQuantity);

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

  const currPromoCode = PROMO_CODES[parsedPromoCode]; //новое

  if (currPromoCode) {
    appliedPromoCode = parsedPromoCode;
    showPromoMessage("Промокод применен", "success");
    promoCode.disabled = true; //новое
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

const priceCurr = parseFloat(originalPrice.value);
const quantityCurr = parseInt(quantity.value);
const currDiscountPercent = parseInt(discountPercent.value);
// const currTextOption = discountPercent.options[discountPercent.selectedIndex].text;
const currLoyaltyLevel = loyaltyLevel.value;

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
  const priceCurr = parseFloat(originalPrice.value);
  const quantityCurr = parseInt(quantity.value);
  const currDiscountPercent = parseInt(discountPercent.value);
  // const currTextOption = discountPercent.options[discountPercent.selectedIndex].text;
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

  result.classList.remove("hidden");
  baseTotalNode.textContent = baseTotal + " ₽";

  const afterDiscount = (baseTotal * currDiscountPercent) / 100;
  let currentTotal = baseTotal - afterDiscount;

  console.log(currentTotal);

  if (appliedPromoCode !== null) {
    if (PROMO_CODES[appliedPromoCode].type === "fixed") {
      const min = Math.min(PROMO_CODES[appliedPromoCode].value, currentTotal);
      if (min === PROMO_CODES[appliedPromoCode].value) {
        const afterValuePromo = currentTotal - PROMO_CODES[appliedPromoCode].value;
        console.log(afterValuePromo);
      } else {
        currentTotal = 0;
        console.log(currentTotal);
      }
    } else if (PROMO_CODES[appliedPromoCode].type === "shipping") {
      hasFreeShipping = true;
    } else if (PROMO_CODES[appliedPromoCode].type === "percent") {
      const afterPercentPromo = currentTotal - (currentTotal * PROMO_CODES[appliedPromoCode].value) / 100;
      console.log(afterPercentPromo);
    }
  }
}
