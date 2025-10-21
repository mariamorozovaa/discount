const originalPrice = document.querySelector("#original-price");

const quantity = document.querySelector("#quantity");

const plusBtn = document.querySelector("#increase-btn");
const minusBtn = document.querySelector("#decrease-btn");
const applyBtn = document.querySelector("#apply-promo-btn");
const calculateBtn = document.querySelector("#calculate-btn");

const discountPercent = document.querySelector("#discount-percent");
const promocode = document.querySelector("#promo-code");
const loyaltyLevel = document.querySelector("#loyalty-level");

const result = document.querySelector("#result");

const baseTotal = document.querySelector("#base-total");
const productDiscountValue = document.querySelector("#product-discount-value");
const promoDiscountValue = document.querySelector("#promo-discount-value");
const loyaltyDiscountValue = document.querySelector("#loyalty-discount-value");
const totalSavings = document.querySelector("#total-savings");
const finalPrice = document.querySelector("#final-price");
const cashbackValue = document.querySelector("#cashback-value");
const freeShippingBadge = document.querySelector("#free-shipping-badge");

const PROMO_CODES = {
  WELCOME2024: { type: "fixed", value: 500, description: "Скидка 500руб для новых клиентов" },
  FREESHIP: { type: "shipping", value: 0, description: "Бесплатная доставка" },
  SAVE10: { type: "percent", value: 10, description: "скидка 10%" },
  VIP20: { type: "percent", value: 20, description: "скидка 20% для вип клиентов" },
};

const LOYALTY_LEVELS = {
  none: { cashback: 0, extradiscount: 0 },
  bronze: { cashback: 3, extradiscount: 0 },
  silver: { cashback: 5, extradiscount: 2 },
  gold: { cashback: 7, extradiscount: 5 },
};

let applyedPromocode = null;

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

plusBtn.addEventListener("click", increaceQuantity);
minusBtn.addEventListener("click", decreaceQuantity);
