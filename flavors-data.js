/* ==========================================================================
   Pintfield Creamery — flavor library + Scoop Board storage
   Homepage, Flavors, and the owner Scoop Board all share this file.
   Scheduled lineups auto-publish when a visitor loads the site on/after
   that date (local time). In production this would live in a CMS.
   ========================================================================== */
(function (global) {
  "use strict";

  var STORAGE_KEY = "pintfield-scoop-board-v1";
  var PIN = "17325";

  var LIBRARY = [
    { id: "sweet-cream", name: "Adams County Sweet Cream", color: "#fff6e0", ink: "#3a2418", tags: ["classic"], blurb: "The house base. Farm milk, extra yolks, a pinch of sea salt." },
    { id: "vanilla-bean", name: "Vanilla Bean", color: "#f4e4c1", ink: "#3a2418", tags: ["classic"], blurb: "Speckled Madagascar vanilla. The scoop everyone underestimates." },
    { id: "chocolate", name: "Double Dutch Chocolate", color: "#4a2c1a", ink: "#fff6e0", tags: ["classic"], blurb: "Two cocoas, fudge ripple, zero apologies." },
    { id: "strawberry", name: "Pick-Your-Own Strawberry", color: "#ff6b9d", ink: "#3a2418", tags: ["classic", "seasonal"], blurb: "Adams County berries folded into pink cream." },
    { id: "peach", name: "Peach Orchard Swirl", color: "#ffb347", ink: "#3a2418", tags: ["classic", "seasonal"], blurb: "Ripe peach ribbons through sweet cream." },
    { id: "blackberry", name: "Blackberry Bramble", color: "#4a1f4a", ink: "#fff6e0", tags: ["classic"], blurb: "Tart berries, a little jam, a lot of purple." },
    { id: "mint-chip", name: "Mint Chip Parade", color: "#3ddc97", ink: "#14301f", tags: ["classic"], blurb: "Cool mint, dark chocolate shards, parade-float energy." },
    { id: "cookie-dough", name: "Cookie Dough Heap", color: "#e8c48a", ink: "#3a2418", tags: ["classic"], blurb: "Edible dough nuggets. We are not shy." },
    { id: "cookies-cream", name: "Cookies n' Cream", color: "#e8e4de", ink: "#3a2418", tags: ["classic"], blurb: "Crushed chocolate cookies in vanilla cream." },
    { id: "cookie-monster", name: "Blue Monster", color: "#4d7cff", ink: "#fff6e0", tags: ["classic"], blurb: "Bright blue cream, cookie chunks, kid-famous." },
    { id: "birthday", name: "Birthday Cake", color: "#ffd1e8", ink: "#3a2418", tags: ["classic"], blurb: "Cake batter, rainbow sprinkles, instant party." },
    { id: "cotton", name: "Cotton Candy Cloud", color: "#c9b6ff", ink: "#3a2418", tags: ["classic"], blurb: "Carnival sugar, spun-pink finish." },
    { id: "bubblegum", name: "Bubblegum Pop", color: "#ff7ad9", ink: "#3a2418", tags: ["classic"], blurb: "Nostalgia in a cone. Yes, it is that pink." },
    { id: "butter-pecan", name: "Butter Pecan", color: "#d4a574", ink: "#3a2418", tags: ["classic"], blurb: "Toasted pecans, brown-butter cream." },
    { id: "moose", name: "Moose Tracks", color: "#c4a882", ink: "#3a2418", tags: ["classic"], blurb: "Peanut butter cups + fudge in vanilla." },
    { id: "reeses", name: "Reese's Supreme", color: "#c47a2c", ink: "#fff6e0", tags: ["classic"], blurb: "Peanut butter ice cream, cups, chocolate swirl." },
    { id: "pb-cookie", name: "Peanut Butter Cookie Dough", color: "#d9a441", ink: "#3a2418", tags: ["classic"], blurb: "Two doughs. One scoop. Chaos." },
    { id: "oreo-dough", name: "Oreo n' Dough", color: "#6b5344", ink: "#fff6e0", tags: ["classic"], blurb: "Cookies, dough, vanilla. The triple threat." },
    { id: "salty-caramel", name: "Salty Caramel", color: "#c47a3b", ink: "#fff6e0", tags: ["classic"], blurb: "Burnt sugar, flaky salt, slow melt." },
    { id: "sea-salt-cookie", name: "Sea Salt Cookie Crunch", color: "#b8895a", ink: "#3a2418", tags: ["classic"], blurb: "Cookie pieces, caramel, salt crystals." },
    { id: "turtle", name: "Turtle", color: "#7a4a28", ink: "#fff6e0", tags: ["classic"], blurb: "Pecan, caramel, chocolate. The whole pond." },
    { id: "rocky", name: "Rocky Road", color: "#5c3a2a", ink: "#fff6e0", tags: ["classic"], blurb: "Marshmallow, almonds, chocolate highway." },
    { id: "smores", name: "S'mores Campfire", color: "#c9a06a", ink: "#3a2418", tags: ["classic"], blurb: "Graham, chocolate, toasted marshmallow swirl." },
    { id: "coffee", name: "Caramel Macchiato", color: "#6b4423", ink: "#fff6e0", tags: ["classic"], blurb: "Espresso ice cream, caramel ribbon." },
    { id: "espresso", name: "Espresso Shot", color: "#2c1810", ink: "#fff6e0", tags: ["classic"], blurb: "Straight coffee. For the 9pm scoop crowd." },
    { id: "lemon", name: "Lincoln Square Lemon", color: "#ffe566", ink: "#3a2418", tags: ["classic"], blurb: "Bright citrus, poppyseed crunch." },
    { id: "orange-cream", name: "Orange Creamsicle", color: "#ff9f43", ink: "#3a2418", tags: ["classic"], blurb: "The truck-stop classic, churned here." },
    { id: "raspberry", name: "Raspberry Cheesecake", color: "#e0567a", ink: "#fff6e0", tags: ["classic"], blurb: "Cheesecake chunks, raspberry ripple." },
    { id: "red-velvet", name: "Red Velvet Cake", color: "#c0394a", ink: "#fff6e0", tags: ["classic"], blurb: "Cocoa-cake ice cream, cream cheese swirl." },
    { id: "pistachio", name: "Pistachio Grove", color: "#8fbf6a", ink: "#1e3018", tags: ["classic"], blurb: "Real nuts. Green on purpose." },
    { id: "coconut", name: "Coconut Paradise", color: "#f0e6d8", ink: "#3a2418", tags: ["classic"], blurb: "Toasted coconut in tropical cream." },
    { id: "banana", name: "Banana Cream Pie", color: "#f5d76e", ink: "#3a2418", tags: ["classic"], blurb: "Banana, vanilla wafer crunch, whipped swirl." },
    { id: "apple-pie", name: "Apple Butter Pie", color: "#c45c26", ink: "#fff6e0", tags: ["classic", "seasonal"], blurb: "Adams County apple butter, cinnamon crust bits." },
    { id: "dirt", name: "Dirt Cup", color: "#5a3d2b", ink: "#fff6e0", tags: ["classic"], blurb: "Chocolate, cookie soil, gummy worms if you ask nice." },
    { id: "fluffer", name: "Fluffernutter", color: "#f3e0b8", ink: "#3a2418", tags: ["classic"], blurb: "Peanut butter + marshmallow. Recess energy." },
    { id: "heath", name: "Chocolate Heath", color: "#8b5a2b", ink: "#fff6e0", tags: ["classic"], blurb: "Toffee crunch through chocolate cream." },
    { id: "brownie", name: "Brownie Batter", color: "#5c3317", ink: "#fff6e0", tags: ["classic"], blurb: "Underbaked brownie ice cream. Legal here." },
    { id: "cake-batter", name: "Cake Batter", color: "#ffc4d6", ink: "#3a2418", tags: ["classic"], blurb: "The batter you weren't supposed to eat." },
    { id: "almond-joy", name: "Almond Joy", color: "#6b3f2a", ink: "#fff6e0", tags: ["classic"], blurb: "Coconut, almond, chocolate coating swirl." },
    { id: "peppermint", name: "Peppermint Patty", color: "#d6fff0", ink: "#14301f", tags: ["classic"], blurb: "Mint patty chunks in dark chocolate cream." },
    { id: "df-chocolate", name: "Cocoa Island (DF)", color: "#3d2418", ink: "#fff6e0", tags: ["dairy-free"], blurb: "Coconut-milk chocolate. Properly fudgy." },
    { id: "df-mango", name: "Mango Splash (DF)", color: "#ffb347", ink: "#3a2418", tags: ["dairy-free"], blurb: "Ripe mango, lime, dairy-free cream." },
    { id: "df-berry", name: "Very Berry (DF)", color: "#c44569", ink: "#fff6e0", tags: ["dairy-free"], blurb: "Strawberry-raspberry oat cream." },
    { id: "df-vanilla", name: "Vanilla Sky (DF)", color: "#fff4d6", ink: "#3a2418", tags: ["dairy-free"], blurb: "Clean vanilla, coconut base." },
    { id: "nsa-vanilla", name: "Vanilla Dream (NSA)", color: "#efe6c9", ink: "#3a2418", tags: ["nsa"], blurb: "No sugar added. Still a real scoop." },
    { id: "nsa-chocolate", name: "Chocolate Heart (NSA)", color: "#4a3020", ink: "#fff6e0", tags: ["nsa"], blurb: "Cocoa-forward, no sugar added." },
    { id: "nsa-coffee", name: "Black Coffee (NSA)", color: "#2a1a12", ink: "#fff6e0", tags: ["nsa"], blurb: "Espresso ice cream, no sugar added." },
    { id: "nsa-berry", name: "Berry Patch (NSA)", color: "#a33b5c", ink: "#fff6e0", tags: ["nsa"], blurb: "Mixed berry, no sugar added." },
    { id: "ltd-peeps", name: "Peeps Parade", color: "#ffe066", ink: "#3a2418", tags: ["limited"], blurb: "Marshmallow chick swirl. Spring only." },
    { id: "ltd-cadbury", name: "Cadbury Creme", color: "#f4e8a8", ink: "#3a2418", tags: ["limited"], blurb: "Fondant core, chocolate shell pieces." },
    { id: "ltd-pb-egg", name: "Peanut Butter Egg", color: "#e8b84a", ink: "#3a2418", tags: ["limited"], blurb: "The Easter egg, churned into a pint." }
  ];

  var DEFAULT_REGULAR = [
    "sweet-cream","vanilla-bean","chocolate","strawberry","peach","blackberry","mint-chip","cookie-dough",
    "cookies-cream","cookie-monster","birthday","cotton","butter-pecan","moose","reeses","pb-cookie",
    "salty-caramel","sea-salt-cookie","turtle","rocky","smores","coffee","lemon","orange-cream",
    "raspberry","red-velvet","pistachio","banana","apple-pie","dirt","fluffer","brownie"
  ];
  var DEFAULT_DF = ["df-chocolate","df-mango","df-berry","df-vanilla"];
  var DEFAULT_NSA = ["nsa-vanilla","nsa-chocolate","nsa-coffee","nsa-berry"];

  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function byId(id) {
    for (var i = 0; i < LIBRARY.length; i++) {
      if (LIBRARY[i].id === id) return LIBRARY[i];
    }
    return null;
  }

  function defaultLineup(date) {
    return {
      date: date || todayISO(),
      featured: "peach",
      note: "Peach Orchard Swirl is running hot today — we churned an extra batch at 6am.",
      regular: DEFAULT_REGULAR.slice(),
      dairyFree: DEFAULT_DF.slice(),
      nsa: DEFAULT_NSA.slice()
    };
  }

  function emptyBoard() {
    return {
      published: defaultLineup(),
      schedule: [
        {
          date: nextDays(2),
          featured: "apple-pie",
          note: "Apple Butter Pie takes the featured scoop — orchard week.",
          regular: DEFAULT_REGULAR.slice(),
          dairyFree: DEFAULT_DF.slice(),
          nsa: DEFAULT_NSA.slice()
        }
      ]
    };
  }

  function nextDays(n) {
    var d = new Date();
    d.setDate(d.getDate() + n);
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function loadRaw() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyBoard();
      var data = JSON.parse(raw);
      if (!data || !data.published) return emptyBoard();
      if (!Array.isArray(data.schedule)) data.schedule = [];
      return data;
    } catch (e) {
      return emptyBoard();
    }
  }

  function saveRaw(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function applySchedule(data) {
    var today = todayISO();
    var due = (data.schedule || []).filter(function (item) {
      return item && item.date && item.date <= today;
    }).sort(function (a, b) {
      return a.date < b.date ? -1 : 1;
    });
    if (!due.length) return data;
    var latest = due[due.length - 1];
    data.published = latest;
    data.schedule = (data.schedule || []).filter(function (item) {
      return item.date > today;
    });
    saveRaw(data);
    return data;
  }

  function getBoard() {
    return applySchedule(loadRaw());
  }

  function hydrate(ids) {
    return (ids || []).map(byId).filter(Boolean);
  }

  function formatPretty(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  global.Pintfield = {
    LIBRARY: LIBRARY,
    PIN: PIN,
    STORAGE_KEY: STORAGE_KEY,
    byId: byId,
    todayISO: todayISO,
    formatPretty: formatPretty,
    defaultLineup: defaultLineup,
    emptyBoard: emptyBoard,
    getBoard: getBoard,
    loadRaw: loadRaw,
    saveRaw: saveRaw,
    hydrate: hydrate,
    cloneLineup: function (lineup) {
      return JSON.parse(JSON.stringify(lineup));
    }
  };
})(window);
