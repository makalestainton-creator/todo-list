const menuData = [
  {
    category: "Starters",
    items: [
      {
        id: 1,
        name: "Bruschetta al Pomodoro",
        description:
          "Toasted sourdough, heirloom tomatoes, fresh basil, aged balsamic",
        price: 8.5,
        tag: "Vegetarian",
      },
      {
        id: 2,
        name: "Calamari Fritti",
        description: "Crispy fried squid rings, lemon aioli, chilli flakes",
        price: 11.0,
        tag: "Chef's Pick",
      },
      {
        id: 3,
        name: "Burrata & Prosciutto",
        description:
          "Creamy burrata, cured prosciutto, rocket, truffle oil drizzle",
        price: 13.5,
        tag: null,
      },
    ],
  },
  {
    category: "Mains",
    items: [
      {
        id: 4,
        name: "Grilled Sea Bass",
        description:
          "Pan-seared sea bass fillet, lemon butter sauce, seasonal greens",
        price: 24.0,
        tag: "Chef's Pick",
      },
      {
        id: 5,
        name: "Beef Tenderloin",
        description:
          "200g grass-fed tenderloin, red wine jus, roasted root vegetables",
        price: 32.0,
        tag: "Premium",
      },
      {
        id: 6,
        name: "Mushroom Risotto",
        description:
          "Arborio rice, wild mushrooms, parmesan, white truffle oil",
        price: 18.5,
        tag: "Vegetarian",
      },
      {
        id: 7,
        name: "Chicken Milanese",
        description:
          "Breaded free-range chicken, arugula salad, cherry tomatoes, lemon",
        price: 19.0,
        tag: null,
      },
    ],
  },
  {
    category: "Desserts",
    items: [
      {
        id: 8,
        name: "Tiramisu",
        description:
          "Classic Italian tiramisu, espresso-soaked ladyfingers, mascarpone",
        price: 8.0,
        tag: "House Special",
      },
      {
        id: 9,
        name: "Panna Cotta",
        description: "Vanilla panna cotta, mixed berry coulis, mint",
        price: 7.5,
        tag: null,
      },
      {
        id: 10,
        name: "Chocolate Fondant",
        description: "Warm dark chocolate fondant, vanilla gelato, cocoa dust",
        price: 9.0,
        tag: "Chef's Pick",
      },
    ],
  },
  {
    category: "Drinks",
    items: [
      {
        id: 11,
        name: "House Red Wine",
        description:
          "Smooth Merlot blend, notes of cherry and vanilla — glass / bottle",
        price: 7.0,
        tag: null,
      },
      {
        id: 12,
        name: "Sparkling Water",
        description: "San Pellegrino, 500ml",
        price: 3.5,
        tag: null,
      },
      {
        id: 13,
        name: "Fresh Lemonade",
        description: "House-made, mint and ginger option available",
        price: 4.5,
        tag: "Popular",
      },
    ],
  },
];

// order state
const order = {}; // { itemId: { item, qty } }

function addToOrder(item) {
  if (order[item.id]) {
    order[item.id].qty += 1;
  } else {
    order[item.id] = { item, qty: 1 };
  }
  refreshOrderPanel();
}

function removeFromOrder(itemId) {
  if (!order[itemId]) return;
  order[itemId].qty -= 1;
  if (order[itemId].qty <= 0) delete order[itemId];
  refreshOrderPanel();
}

function getOrderTotal() {
  return Object.values(order).reduce(
    (sum, { item, qty }) => sum + item.price * qty,
    0,
  );
}

function refreshOrderPanel() {
  const panel = document.getElementById("order-panel");
  const badge = document.getElementById("order-badge");
  if (!panel) return;

  const entries = Object.values(order);
  const totalItems = entries.reduce((s, { qty }) => s + qty, 0);

  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "flex" : "none";

  const itemsContainer = panel.querySelector(".order-items");
  const totalEl = panel.querySelector(".order-total-amount");
  const emptyMsg = panel.querySelector(".order-empty");
  const placeBtn = panel.querySelector(".place-order-btn");

  if (entries.length === 0) {
    itemsContainer.innerHTML = "";
    emptyMsg.style.display = "block";
    placeBtn.disabled = true;
    totalEl.textContent = "$0.00";
    return;
  }

  emptyMsg.style.display = "none";
  placeBtn.disabled = false;
  totalEl.textContent = `$${getOrderTotal().toFixed(2)}`;

  itemsContainer.innerHTML = entries
    .map(
      ({ item, qty }) => `
    <div class="order-line">
      <div class="order-line-info">
        <span class="order-line-name">${item.name}</span>
        <span class="order-line-price">$${(item.price * qty).toFixed(2)}</span>
      </div>
      <div class="order-line-controls">
        <button class="qty-btn" data-action="remove" data-id="${item.id}">−</button>
        <span class="qty-count">${qty}</span>
        <button class="qty-btn" data-action="add" data-id="${item.id}">+</button>
      </div>
    </div>
  `,
    )
    .join("");

  // attach qty button listeners
  itemsContainer.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const menuItem = menuData
        .flatMap((c) => c.items)
        .find((i) => i.id === id);
      if (btn.dataset.action === "add") addToOrder(menuItem);
      else removeFromOrder(id);
    });
  });
}

// render
export function renderMenu() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <section class="menu-page">

      <!-- hero banner -->
      <div class="menu-hero">
        <div class="menu-hero-text">
          <p class="menu-hero-sub">Crafted with passion</p>
          <h2 class="menu-hero-title">Our Menu</h2>
        </div>
      </div>

      <!-- layout: menu + order sidebar -->
      <div class="menu-layout">

        <!-- left: categories -->
        <div class="menu-categories">
          ${menuData
            .map(
              (cat) => `
            <div class="menu-category">
              <h3 class="category-title">
                <span class="category-line"></span>
                ${cat.category}
              </h3>
              <div class="menu-grid">
                ${cat.items
                  .map(
                    (item) => `
                  <div class="menu-card">
                    ${item.tag ? `<span class="item-tag">${item.tag}</span>` : ""}
                    <div class="menu-card-body">
                      <div class="menu-card-header">
                        <h4 class="item-name">${item.name}</h4>
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                      </div>
                      <p class="item-desc">${item.description}</p>
                    </div>
                    <button class="add-btn" data-id="${item.id}">
                      + Add to order
                    </button>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <!-- right: order panel -->
        <aside class="order-sidebar">
          <div id="order-panel">
            <div class="order-header">
              <h3>Your Order</h3>
              <span id="order-badge" style="display:none">0</span>
            </div>
            <p class="order-empty">No items yet — browse the menu and add something!</p>
            <div class="order-items"></div>
            <div class="order-footer">
              <div class="order-total">
                <span>Total</span>
                <span class="order-total-amount">$0.00</span>
              </div>
              <button class="place-order-btn" disabled>Place Order</button>
            </div>
          </div>
        </aside>

      </div>
    </section>
  `;

  // attach add-to-order listeners
  content.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const item = menuData.flatMap((c) => c.items).find((i) => i.id === id);
      addToOrder(item);

      // brief visual feedback
      btn.textContent = "✓ Added";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "+ Add to order";
        btn.classList.remove("added");
      }, 900);
    });
  });

  // place order
  content.querySelector(".place-order-btn").addEventListener("click", () => {
    const names = Object.values(order)
      .map(({ item, qty }) => `${qty}× ${item.name}`)
      .join(", ");
    alert(
      `Order placed!\n\n${names}\n\nTotal: $${getOrderTotal().toFixed(2)}\n\nThank you! 🍽️`,
    );
    Object.keys(order).forEach((k) => delete order[k]);
    refreshOrderPanel();
  });
}
