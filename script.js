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
const baseTotal = document.querySelector("#base-total");
const productDiscountValue = document.querySelector("#product-discount-value"); //- Скидка на товар (строка `product-discount-row`, значения `discount-percent-text`, `product-discount-value`)
const promoDiscountValue = document.querySelector("#promo-discount-value"); //- Промокод (строка `promo-discount-row`, значения `promo-code-text`, `promo-discount-value`)
const loyaltyDiscountValue = document.querySelector("#loyalty-discount-value"); //- Скидка лояльности (строка `loyalty-discount-row`, значения `loyalty-discount-text`, `loyalty-discount-value`)
const totalSavings = document.querySelector("#total-savings");
const finalPrice = document.querySelector("#final-price");
const cashbackValue = document.querySelector("#cashback-value"); //- Кэшбэк (строка `cashback-row`, значение `cashback-value`)
const freeShippingBadge = document.querySelector("#free-shipping-badge");

const errors = document.querySelector("#error");

const DISCOUNT_PERCENTS = {
  none: { discount: 0, description: "Без скидки" },
  season: { discount: 5, description: "Сезонная распродажа" },
  blackFriday: { discount: 10, description: "Black Friday" },
  bithdayStore: { discount: 15, description: "День рождения магазина" },
  newYear: { discount: 20, description: "Новогодняя акция" },
  liquidation: { discount: 30, description: "Ликвидация остатков" },
  markdown: { discount: 50, description: "Уценка" },
};

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

let applyedPromoCode = null;

function applyPromoCode() {
  let parsedPromoCode = promoCode.value.trim().toUpperCase();

  if (!parsedPromoCode) {
    showPromoMessage("Введите промокод");
    return;
  } else {
    promoMessage.classList.add("hidden");
    promoMessage.textContent = "";
  }

  const currPromoCode = PROMO_CODES[parsedPromoCode]; //новое

  if (currPromoCode) {
    applyedPromoCode = parsedPromoCode;
    showPromoMessage("Промокод применен", "success");
    promoCode.disabled = true; //новое
    applyPromoBtn.textContent = "Отменить";
    applyPromoBtn.classList.add("red-bcg");
  } else {
    applyedPromoCode = null;
    showPromoMessage("Промокод не найден", "error");
  }
}

function resetPromoCode() {
  applyedPromoCode = null;
  promoCode.value = "";
  promoCode.disabled = false;
  promoMessage.classList.add("hidden");
  applyPromoBtn.textContent = "Применить";
  applyPromoBtn.classList.remove("red-bcg");
}

function showPromoMessage(message, type) {
  promoMessage.classList.remove("hidden");
  promoMessage.textContent = "";
  const promoMessageCurr = document.createElement("p");
  promoMessageCurr.textContent = message;
  promoMessageCurr.classList.add(type);
  promoMessage.appendChild(promoMessageCurr);
}

applyPromoBtn.addEventListener("click", () => {
  if (applyPromoBtn.textContent === "Применить") {
    applyPromoCode();
  } else resetPromoCode();
});
