/* ==========================================================================
   Pintfield shop — cart, checkout, and customer login
   Tries @netlify/identity when the site is on Netlify with Identity on.
   Falls back to a local demo account so GitHub Pages still works.
   ========================================================================== */
(function () {
  "use strict";

  var CART_KEY = "pintfield-cart-v1";
  var USER_KEY = "pintfield-demo-user";
  var ORDERS_KEY = "pintfield-orders";
  var identityApi = null;

  function money(n) {
    return "$" + Number(n).toFixed(2);
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    paintCartCount();
  }

  function cartCount(items) {
    return (items || loadCart()).reduce(function (sum, line) { return sum + (line.qty || 1); }, 0);
  }

  function cartTotal(items) {
    return (items || loadCart()).reduce(function (sum, line) { return sum + line.price * (line.qty || 1); }, 0);
  }

  function paintCartCount() {
    var n = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = String(n);
    });
  }

  function demoUser() {
    try {
      var raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setDemoUser(user) {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
    paintAccount();
  }

  function paintAccount() {
    var user = window.__pintfieldUser || demoUser();
    document.querySelectorAll("[data-account-link]").forEach(function (el) {
      if (user && (user.email || user.name)) {
        el.textContent = user.name ? user.name.split(" ")[0] : "Account";
        el.setAttribute("title", user.email || "");
      } else {
        el.textContent = "Log in";
      }
    });
  }

  function currentUser() {
    return window.__pintfieldUser || demoUser();
  }

  function addLine(line) {
    var cart = loadCart();
    cart.push(line);
    saveCart(cart);
  }

  function isoPlus(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function selectHTML(name, label, values) {
    var opts = values.map(function (v) {
      var val = typeof v === "string" ? v : v.label;
      return "<option value=\"" + val.replace(/"/g, "&quot;") + "\">" + val + "</option>";
    }).join("");
    return "<label>" + label + "<select name=\"" + name + "\" required>" + opts + "</select></label>";
  }

  function openModal(product) {
    var shop = window.PintfieldShop;
    var flavors = shop.flavorNames();
    var df = shop.flavorNames("dairy-free");
    var minDate = isoPlus(product.noticeDays || 0);
    var extraNote = product.noticeDays
      ? "<p class=\"tiny\">We need " + product.noticeDays + " day" + (product.noticeDays === 1 ? "" : "s") + " to churn this. Need sooner? Check the grab-and-go freezer.</p>"
      : "";

    var fields = "";
    (product.options || []).forEach(function (opt) {
      if (opt === "flavor") fields += selectHTML("flavor", "Ice cream flavor", flavors);
      if (opt === "flavor2") fields += selectHTML("flavor2", "Second flavor (optional mix)", ["Same as first"].concat(flavors));
      if (opt === "flavorDf") fields += selectHTML("flavor", "Dairy-free flavor", df.length ? df : flavors);
      if (opt === "drizzle") fields += selectHTML("drizzle", "Drizzle", shop.DRIZZLES);
      if (opt === "cookie") fields += selectHTML("cookie", "Cookie", shop.COOKIES);
      if (opt === "goodies") {
        fields += "<label>Goodies / extra pizzazz<select name=\"goodies\">";
        shop.GOODIES.forEach(function (g) {
          fields += "<option value=\"" + g.label + "\" data-extra=\"" + g.extra + "\">" + g.label + (g.extra ? " (+" + money(g.extra) + ")" : "") + "</option>";
        });
        fields += "</select></label>";
      }
      if (opt === "message") {
        fields += "<label>Write on the cake? <input name=\"message\" type=\"text\" maxlength=\"40\" placeholder=\"Happy birthday Sam\"></label>";
      }
      if (opt === "pickup") {
        fields += selectHTML("shop", "Pickup shop", shop.SHOPS);
        fields += "<label>Pickup date <input name=\"pickup\" type=\"date\" required min=\"" + minDate + "\" value=\"" + minDate + "\"></label>";
      }
    });

    var modal = document.createElement("div");
    modal.className = "shop-modal";
    modal.innerHTML =
      "<div class=\"shop-modal-card\" role=\"dialog\" aria-labelledby=\"modal-title\">" +
        "<button type=\"button\" class=\"modal-close\" aria-label=\"Close\">×</button>" +
        "<p class=\"sec-kicker\">Add to cart</p>" +
        "<h3 id=\"modal-title\">" + product.name + "</h3>" +
        "<p>" + product.blurb + "</p>" +
        extraNote +
        "<form id=\"config-form\">" +
          fields +
          "<label>Qty <input name=\"qty\" type=\"number\" min=\"1\" max=\"24\" value=\"1\"></label>" +
          "<button class=\"btn btn-primary\" type=\"submit\">Add — " + money(product.price) + "+</button>" +
        "</form>" +
      "</div>";
    document.body.appendChild(modal);
    modal.querySelector(".modal-close").addEventListener("click", function () { modal.remove(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.remove(); });

    modal.querySelector("#config-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      var extra = 0;
      var goodies = fd.get("goodies");
      shop.GOODIES.forEach(function (g) {
        if (g.label === goodies) extra = g.extra;
      });
      var details = [];
      ["flavor", "flavor2", "drizzle", "cookie", "goodies", "message", "shop", "pickup"].forEach(function (k) {
        var v = fd.get(k);
        if (v && String(v).trim() && v !== "Same as first" && v !== "None") details.push(k + ": " + v);
      });
      addLine({
        id: product.id + "-" + Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price + extra,
        qty: Math.max(1, Number(fd.get("qty") || 1)),
        details: details.join(" · "),
        pickup: fd.get("pickup") || "",
        shop: fd.get("shop") || ""
      });
      modal.remove();
      toast("Added to cart");
    });
  }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "shop-toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("in"); }, 10);
    setTimeout(function () { t.remove(); }, 2200);
  }

  function renderMenu() {
    var host = document.getElementById("walkup-menu");
    if (!host || !window.PintfieldShop) return;
    host.innerHTML = window.PintfieldShop.WALKUP.map(function (col) {
      var rows = col.items.map(function (item) {
        return "<li><span><strong>" + item.name + "</strong>" +
          (item.detail ? "<em>" + item.detail + "</em>" : "") +
          "</span><b>" + money(item.price) + "</b></li>";
      }).join("");
      return "<article class=\"menu-col\">" +
        "<h2>" + col.title + "</h2>" +
        (col.note ? "<p>" + col.note + "</p>" : "") +
        "<ul class=\"price-list\">" + rows + "</ul></article>";
    }).join("");
  }

  function renderOrder() {
    var grid = document.getElementById("order-grid");
    var tabs = document.getElementById("order-tabs");
    if (!grid || !window.PintfieldShop) return;
    var shop = window.PintfieldShop;
    var active = "cakes";

    function paint() {
      tabs.querySelectorAll("[data-cat]").forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-cat") === active);
      });
      var cat = shop.CATEGORIES.filter(function (c) { return c.id === active; })[0];
      var intro = document.getElementById("order-intro");
      if (intro && cat) intro.textContent = cat.blurb;
      var CAT_PHOTOS = {
        cakes: "images/treat-cake.jpg",
        cupcakes: "images/scoop-pexels-3.jpg",
        cookies: "images/pexels-eat.jpg",
        packed: "images/scoop-pexels-2.jpg",
        bulk: "images/scoop-sundae.jpg",
        pups: "images/scoop-berry.jpg"
      };
      grid.innerHTML = shop.PRODUCTS.filter(function (p) { return p.category === active; }).map(function (p) {
        var photo = CAT_PHOTOS[p.category] || "images/scoop-vanilla.jpg";
        return "<article class=\"product-card\">" +
          "<div class=\"ph\" style=\"background-image:url('" + photo + "')\"></div>" +
          "<div class=\"body\">" +
            "<h3>" + p.name + "</h3>" +
            "<p class=\"price\">" + money(p.price) + (p.noticeDays ? "+" : "") + "</p>" +
            "<p>" + p.blurb + "</p>" +
            "<button type=\"button\" class=\"btn btn-primary\" data-add=\"" + p.id + "\">Customize &amp; add</button>" +
          "</div></article>";
      }).join("");
      grid.querySelectorAll("[data-add]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          openModal(shop.byId(btn.getAttribute("data-add")));
        });
      });
    }

    if (tabs && !tabs.dataset.ready) {
      tabs.dataset.ready = "1";
      tabs.innerHTML = shop.CATEGORIES.map(function (c) {
        return "<button type=\"button\" class=\"btn\" data-cat=\"" + c.id + "\">" + c.label + "</button>";
      }).join("");
      tabs.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-cat]");
        if (!btn) return;
        active = btn.getAttribute("data-cat");
        paint();
      });
    }
    paint();
  }

  function renderCartPage() {
    var list = document.getElementById("cart-lines");
    if (!list) return;
    var items = loadCart();
    var empty = document.getElementById("cart-empty");
    var panel = document.getElementById("cart-panel");
    if (!items.length) {
      if (empty) empty.hidden = false;
      if (panel) panel.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    if (panel) panel.hidden = false;
    list.innerHTML = items.map(function (line, i) {
      return "<li class=\"cart-line\">" +
        "<div><strong>" + line.name + "</strong>" +
        (line.details ? "<p>" + line.details + "</p>" : "") +
        "</div>" +
        "<div class=\"cart-qty\">" +
          "<button type=\"button\" data-dec=\"" + i + "\" aria-label=\"Less\">−</button>" +
          "<span>" + line.qty + "</span>" +
          "<button type=\"button\" data-inc=\"" + i + "\" aria-label=\"More\">+</button>" +
        "</div>" +
        "<b>" + money(line.price * line.qty) + "</b>" +
        "<button type=\"button\" class=\"btn\" data-del=\"" + i + "\">Remove</button>" +
      "</li>";
    }).join("");
    document.getElementById("cart-subtotal").textContent = money(cartTotal(items));
    document.getElementById("cart-tax").textContent = money(cartTotal(items) * 0.06);
    document.getElementById("cart-grand").textContent = money(cartTotal(items) * 1.06);

    list.querySelectorAll("[data-inc]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cart = loadCart();
        cart[Number(btn.getAttribute("data-inc"))].qty += 1;
        saveCart(cart);
        renderCartPage();
      });
    });
    list.querySelectorAll("[data-dec]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cart = loadCart();
        var i = Number(btn.getAttribute("data-dec"));
        cart[i].qty = Math.max(1, cart[i].qty - 1);
        saveCart(cart);
        renderCartPage();
      });
    });
    list.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cart = loadCart();
        cart.splice(Number(btn.getAttribute("data-del")), 1);
        saveCart(cart);
        renderCartPage();
      });
    });

    var user = currentUser();
    var gate = document.getElementById("pay-gate");
    var pay = document.getElementById("pay-form");
    if (user) {
      if (gate) gate.hidden = true;
      if (pay) {
        pay.hidden = false;
        var email = pay.querySelector("[name=email]");
        var name = pay.querySelector("[name=name]");
        if (email && user.email) email.value = user.email;
        if (name && user.name) name.value = user.name;
      }
    } else {
      if (gate) gate.hidden = false;
      if (pay) pay.hidden = true;
    }
  }

  function bindPayForm() {
    var form = document.getElementById("pay-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!currentUser()) {
        toast("Log in to pay");
        return;
      }
      var items = loadCart();
      if (!items.length) return;
      var fd = new FormData(form);
      var order = {
        id: "PF-" + Date.now().toString(36).toUpperCase(),
        at: new Date().toISOString(),
        email: fd.get("email"),
        name: fd.get("name"),
        shop: fd.get("shop"),
        items: items,
        total: cartTotal(items) * 1.06,
        last4: String(fd.get("card") || "").replace(/\s/g, "").slice(-4)
      };
      var orders = [];
      try { orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch (err) {}
      orders.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      saveCart([]);
      var done = document.getElementById("pay-done");
      if (done) {
        form.hidden = true;
        done.hidden = false;
        done.querySelector("[data-order-id]").textContent = order.id;
        done.querySelector("[data-order-total]").textContent = money(order.total);
      }
    });
  }

  function statusEl(form) {
    return form.querySelector(".form-status");
  }

  function setStatus(form, ok, msg) {
    var el = statusEl(form);
    if (!el) return;
    el.className = "form-status " + (ok ? "ok" : "err");
    el.textContent = msg;
  }

  async function initIdentity() {
    try {
      identityApi = await import("https://esm.sh/@netlify/identity");
      try {
        await identityApi.handleAuthCallback();
      } catch (cbErr) {
        /* Identity not enabled on this host */
      }
      var user = await identityApi.getUser();
      if (user) {
        window.__pintfieldUser = { email: user.email, name: user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name) };
      }
      identityApi.onAuthChange(function (event, u) {
        if (u) {
          window.__pintfieldUser = { email: u.email, name: u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name) };
        } else if (event === "logout") {
          window.__pintfieldUser = null;
        }
        paintAccount();
        renderCartPage();
        renderAccountPage();
      });
    } catch (e) {
      identityApi = null;
    }
    paintAccount();
  }

  function renderAccountPage() {
    var box = document.getElementById("account-app");
    if (!box) return;
    var user = currentUser();
    var logged = document.getElementById("account-logged");
    var forms = document.getElementById("account-forms");
    if (user) {
      if (forms) forms.hidden = true;
      if (logged) {
        logged.hidden = false;
        logged.querySelector("[data-user-email]").textContent = user.email || "";
        logged.querySelector("[data-user-name]").textContent = user.name || "Pintfield regular";
      }
      var ordersHost = document.getElementById("account-orders");
      if (ordersHost) {
        var orders = [];
        try { orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch (e) {}
        var mine = orders.filter(function (o) { return !user.email || o.email === user.email; });
        ordersHost.innerHTML = mine.length
          ? mine.map(function (o) {
              return "<li><strong>" + o.id + "</strong> · " + money(o.total) + " · " + (o.shop || "") + "</li>";
            }).join("")
          : "<li>No pickup orders yet.</li>";
      }
    } else {
      if (forms) forms.hidden = false;
      if (logged) logged.hidden = true;
    }
  }

  function bindAccountForms() {
    var loginForm = document.getElementById("login-form");
    var signupForm = document.getElementById("signup-form");
    var logoutBtn = document.getElementById("logout-btn");

    if (loginForm) {
      loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        var fd = new FormData(loginForm);
        var email = String(fd.get("email") || "").trim();
        var password = String(fd.get("password") || "");
        if (identityApi && identityApi.login) {
          try {
            var user = await identityApi.login(email, password);
            window.__pintfieldUser = { email: user.email, name: user.user_metadata && user.user_metadata.full_name };
            setStatus(loginForm, true, "Welcome back.");
            renderAccountPage();
            paintAccount();
            return;
          } catch (err) {
            /* fall through to demo account */
          }
        }
        setDemoUser({ email: email, name: email.split("@")[0] });
        window.__pintfieldUser = demoUser();
        setStatus(loginForm, true, "Logged in (demo account). On Netlify with Identity enabled, this uses a real login.");
        renderAccountPage();
      });
    }

    if (signupForm) {
      signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        var fd = new FormData(signupForm);
        var email = String(fd.get("email") || "").trim();
        var password = String(fd.get("password") || "");
        var name = String(fd.get("name") || "").trim();
        if (identityApi && identityApi.signup) {
          try {
            var user = await identityApi.signup(email, password, { full_name: name });
            if (user.emailVerified) {
              window.__pintfieldUser = { email: user.email, name: name };
              setStatus(signupForm, true, "Account created. You are logged in.");
            } else {
              setStatus(signupForm, true, "Check your email to confirm, then log in.");
            }
            renderAccountPage();
            paintAccount();
            return;
          } catch (err) {
            /* demo fallback */
          }
        }
        setDemoUser({ email: email, name: name || email.split("@")[0] });
        window.__pintfieldUser = demoUser();
        setStatus(signupForm, true, "Account saved on this device (demo). Enable Netlify Identity for real email accounts.");
        renderAccountPage();
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async function () {
        if (identityApi && identityApi.logout) {
          try { await identityApi.logout(); } catch (e) {}
        }
        window.__pintfieldUser = null;
        setDemoUser(null);
        renderAccountPage();
      });
    }

    document.querySelectorAll("[data-auth-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-auth-tab");
        document.getElementById("login-form").hidden = tab !== "login";
        document.getElementById("signup-form").hidden = tab !== "signup";
        document.querySelectorAll("[data-auth-tab]").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
      });
    });
  }

  paintCartCount();
  paintAccount();
  renderMenu();
  renderOrder();
  bindPayForm();
  bindAccountForms();

  initIdentity().then(function () {
    renderCartPage();
    renderAccountPage();
    paintAccount();
  });
  renderCartPage();
  renderAccountPage();
})();
