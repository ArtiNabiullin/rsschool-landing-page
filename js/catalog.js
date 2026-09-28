let products = [];
let activeCategory = "coffee";
let currentPage = 1;

export function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "main-container-grid__card";

  const image = document.createElement("img");
  image.className = "main-container-grid__card--image";
  image.src = product.image;
  image.alt = product.name;

  const content = document.createElement("div");
  content.className = "main-container-grid__wrapper";

  const title = document.createElement("h2");
  title.className = "main-container-grid__card--title";
  title.textContent = product.name;

  const details = document.createElement("div");
  details.className = "main-container-grid__card--wrapper";

  const description = document.createElement("p");
  description.className = "main-container-grid__card--text";
  description.textContent = product.description;

  const price = document.createElement("p");
  price.className = "main-container-grid__card--price";
  price.textContent = `$${product.price}`;

  details.append(description, price);
  content.append(title, details);
  card.append(image, content);

  return card;
}

export async function initCatalog() {
  const catalog = document.querySelector(".main-container-grid");
  const pagination = document.querySelector(".catalog-pagination");
  const tabs = document.querySelectorAll("[data-category]");

  if (!catalog || !pagination) return;

  try {
    const response = await fetch("./json/products.json");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    products = await response.json();

    function renderProducts() {
      const activeProducts = products.filter(
        (product) => product.category === activeCategory,
      );
      const productsPerPage = getProductsPerPage();
      const totalPages = Math.ceil(activeProducts.length / productsPerPage);
      const start = (currentPage - 1) * productsPerPage;
      const visibleProducts = activeProducts.slice(
        start,
        start + productsPerPage,
      );
      catalog.replaceChildren(...visibleProducts.map(createProductCard));

      renderPagination(totalPages);
    }

    renderProducts();

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activeCategory = tab.dataset.category;

        tabs.forEach((item) => {
          item.classList.toggle(
            "is-active",
            item.dataset.category === activeCategory,
          );
        });
        currentPage = 1;
        renderProducts();
      });
    });

    function getProductsPerPage() {
      return window.innerWidth > 950 ? 8 : 4;
    }

    function renderPagination(totalPages) {
      pagination.replaceChildren();

      if (totalPages <= 1) return;
      for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.className = "catalog-pagination__button";
        button.type = "button";
        button.textContent = page;

        pagination.append(button);

        if (page === currentPage) {
          button.classList.add("is-active");
        }

        button.addEventListener("click", () => {
          currentPage = page;
          renderProducts();
        });
      }
    }

    let previousProductsPerPage = getProductsPerPage();

    window.addEventListener("resize", () => {
      const nextProductsPerPage = getProductsPerPage();

      if (nextProductsPerPage === previousProductsPerPage) return;

      previousProductsPerPage = nextProductsPerPage;
      currentPage = 1;
      renderProducts();
    });
  } catch (error) {
    console.error("Не удалось загрузить товары:", error);
  }
}
