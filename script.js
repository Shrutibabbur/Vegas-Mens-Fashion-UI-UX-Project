// ===================== CART STATE =====================
let cart = [];

// ===================== CART OPEN/CLOSE =====================
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  renderCart();
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

// ===================== ADD TO CART =====================
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartCount();
  showToast(`"${name}" added to cart!`);
}

// ===================== REMOVE FROM CART =====================
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartCount();
  renderCart();
}

// ===================== CHANGE QTY =====================
function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(name);
  } else {
    renderCart();
    updateCartCount();
  }
}

// ===================== UPDATE BADGE =====================
function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

// ===================== RENDER CART =====================
function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';

  let html = '';
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-qty">
          <button onclick="changeQty('${item.name}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.name}', 1)">+</button>
        </div>
        <div class="cart-item-price">₹${subtotal.toLocaleString('en-IN')}</div>
      </div>
    `;
  });

  container.innerHTML = html;
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString('en-IN');

  // Build WhatsApp message
  let msg = "Hello! I'd like to order the following from Vegas Men's Fashion:\n\n";
  cart.forEach(item => {
    msg += `• ${item.name} x${item.qty} = ₹${(item.price * item.qty).toLocaleString('en-IN')}\n`;
  });
  msg += `\nTotal: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm my order.`;

  const encodedMsg = encodeURIComponent(msg);
  document.getElementById('whatsappOrderBtn').href = `https://wa.me/918378917281?text=${encodedMsg}`;
}

// ===================== BUY NOW (single product) =====================
function orderNow(name, price) {
  const msg = `Hello! I'd like to order:\n• ${name} - ₹${price}\n\nPlease confirm.`;
  window.open(`https://wa.me/918378917281?text=${encodeURIComponent(msg)}`);
}

// ===================== LEGACY ORDER FUNCTION =====================
function order() {
  window.open("https://wa.me/918378917281");
}

// ===================== TOAST NOTIFICATION =====================
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===================== ADD PRODUCT (admin) =====================
function addProduct() {
  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const img = document.getElementById("pimg").value;

  if (!name || !price || !img) {
    alert("Fill all fields");
    return;
  }

  const div = document.createElement('div');
  div.className = 'product-card';
  div.innerHTML = `
    <div class="product-img-wrap">
      <img src="${img}" alt="${name}" />
    </div>
    <div class="product-info">
      <h3>${name}</h3>
      <div class="product-footer">
        <span class="price">₹${parseInt(price).toLocaleString('en-IN')}</span>
        <div class="product-actions">
          <button class="btn-cart" onclick="addToCart('${name}', ${price})">Add to Cart</button>
          <button class="btn-wa" onclick="orderNow('${name}', ${price})">Buy Now</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("productContainer").appendChild(div);
}
