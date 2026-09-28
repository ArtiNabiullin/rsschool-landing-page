let activeOverlay = null;

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProductModal();
  }
});

export function openProductModal(product) {
  let selectedSize = Object.keys(product.sizes)[0];
  const selectedAdditives = new Set();

  closeProductModal();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeProductModal();
    }
  });

  const modal = document.createElement("section");
  modal.className = "product-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const button = document.createElement("button");
  button.className = "product-modal__close";
  button.type = "button";
  button.textContent = "×";
  button.addEventListener("click", closeProductModal);
  button.setAttribute("aria-label", "Close modal");

  const image = document.createElement("img");
  image.className = "product-modal__image";
  image.src = product.image;
  image.alt = product.name;

  const content = document.createElement("div");
  content.className = "product-modal__content";

  const title = document.createElement("h2");
  title.className = "product-modal__title";
  title.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-modal__description";
  description.textContent = product.description;

  const price = document.createElement("p");
  price.className = "product-modal__price";
  price.textContent = `$${product.price}`;

  const sizeSection = document.createElement("section");
  sizeSection.className = "product-modal__options";

  const sizeTitle = document.createElement("p");
  sizeTitle.className = "product-modal__options-title";
  sizeTitle.textContent = "Size";

  const sizeList = document.createElement("div");
  sizeList.className = "product-modal__options-list";

  const sizeButtons = [];

  Object.entries(product.sizes).forEach(([key, value]) => {
    const sizeButton = document.createElement("button");

    sizeButton.type = "button";
    sizeButton.className = "product-modal__option";
    sizeButton.dataset.size = key;
    sizeButton.textContent = `${key.toUpperCase()} — ${value.size} +$${value["add-price"]}`;

    sizeButton.addEventListener("click", () => {
      selectedSize = key;
      updateModal();
    });

    sizeButtons.push(sizeButton);
    sizeList.append(sizeButton);
  });

  sizeSection.append(sizeTitle, sizeList);

  const additivesSection = document.createElement("section");
  additivesSection.className = "product-modal__options";

  const additivesTitle = document.createElement("p");
  additivesTitle.className = "product-modal__options-title";
  additivesTitle.textContent = "Additives";

  const additivesList = document.createElement("div");
  additivesList.className = "product-modal__options-list";

  const additiveButtons = [];

  product.additives.forEach((additive) => {
    const additiveButton = document.createElement("button");

    additiveButton.type = "button";
    additiveButton.className = "product-modal__option";
    additiveButton.dataset.additive = additive.name;
    additiveButton.textContent = `${additive.name} +$${additive["add-price"]}`;

    additiveButton.addEventListener("click", () => {
      if (selectedAdditives.has(additive.name)) {
        selectedAdditives.delete(additive.name);
      } else {
        selectedAdditives.add(additive.name);
      }

      updateModal();
    });

    additiveButtons.push(additiveButton);
    additivesList.append(additiveButton);
  });

  additivesSection.append(additivesTitle, additivesList);

  function updateModal() {
    sizeButtons.forEach((sizeButton) => {
      sizeButton.classList.toggle(
        "is-active",
        sizeButton.dataset.size === selectedSize,
      );
    });

    additiveButtons.forEach((additiveButton) => {
      additiveButton.classList.toggle(
        "is-active",
        selectedAdditives.has(additiveButton.dataset.additive),
      );
    });

    const additivesPrice = product.additives
      .filter((additive) => selectedAdditives.has(additive.name))
      .reduce((sum, additive) => {
        return sum + Number(additive["add-price"]);
      }, 0);

    const totalPrice =
      Number(product.price) +
      Number(product.sizes[selectedSize]["add-price"]) +
      additivesPrice;

    price.textContent = `$${totalPrice.toFixed(2)}`;
  }

  updateModal();

  content.append(title, description, sizeSection, additivesSection, price);
  modal.append(button, image, content);
  overlay.append(modal);

  document.body.append(overlay);
  button.focus();
  activeOverlay = overlay;
  document.body.classList.add("modal-open");
}

export function closeProductModal() {
  if (!activeOverlay) return;

  activeOverlay.remove();
  activeOverlay = null;
  document.body.classList.remove("modal-open");
}
