/* ==========================================================================
   Pintfield shop catalog — walk-up menu + online order specialties
   Prices follow a local creamery pattern (scoops, cakes, cupcakes, cookies).
   ========================================================================== */
(function (global) {
  "use strict";

  var SHOPS = ["Gettysburg", "New Oxford", "McSherrystown"];

  var WALKUP = [
    {
      id: "favorites",
      title: "Favorites",
      note: "Walk-up window. Dairy-free add $1.00 per scoop.",
      items: [
        { name: "1 scoop", price: 3.99, detail: "Cake cone, sugar cone, or cup" },
        { name: "2 scoops", price: 5.21, detail: "The default Pintfield stack" },
        { name: "3 scoops", price: 6.59, detail: "Wobble recommended" },
        { name: "Dairy-free add-on", price: 1.0, detail: "Per scoop, any size" },
        { name: "Broken cones", price: 2.59, detail: "For the pup, or the kid who dropped one" }
      ]
    },
    {
      id: "drinks",
      title: "Drinks",
      items: [
        { name: "Shake", price: 8.99, detail: "Any flavor from today’s case" },
        { name: "Malt shake", price: 9.43, detail: "Shake + malt" },
        { name: "Root beer float", price: 8.99, detail: "Sweet cream + root beer" },
        { name: "Bottled water", price: 1.0, detail: "" }
      ]
    },
    {
      id: "extras",
      title: "Toppings & sides",
      items: [
        { name: "Toppings", price: 0.72, detail: "Sparkle dust, rainbow sprinkles, whip & cherry" },
        { name: "Sides", price: 0.99, detail: "Reese’s Pieces, Reese’s Cups, Oreos, M&M’s, malt" }
      ]
    },
    {
      id: "packed-menu",
      title: "Take-home pints",
      note: "Grab from the freezer or we’ll pack from the case.",
      items: [
        { name: "Prepackaged pint", price: 6.59, detail: "From the grab-and-go freezer" },
        { name: "Fresh-packed pint", price: 7.59, detail: "Scooped from today’s case" },
        { name: "Dairy-free pint", price: 12.0, detail: "Coconut or oat base" },
        { name: "Dozen cake cones", price: 10.16, detail: "Empty cones for a party" }
      ]
    }
  ];

  var CATEGORIES = [
    { id: "cakes", label: "Ice cream cakes", blurb: "All ice cream, white buttercream, chocolate or peanut-butter drizzle. 3-day notice." },
    { id: "cupcakes", label: "Cupcakes", blurb: "Same churn, smaller celebration. Flavor follows the scoop." },
    { id: "cookies", label: "Ice cream cookies", blurb: "Sandwich cookies packed with a scoop. Order a single or a box." },
    { id: "packed", label: "Cups & pints", blurb: "Pre-scooped cups and take-home pints from today’s case." },
    { id: "bulk", label: "Bulk & parties", blurb: "Gallons need 7 days. Perfect for reunions and team dinners." },
    { id: "pups", label: "Pup treats", blurb: "For the other regulars at the window." }
  ];

  var PRODUCTS = [
    {
      id: "cake-small",
      category: "cakes",
      name: "Small ice cream cake",
      price: 26,
      swatch: "#ff8fb8",
      blurb: "6-inch round. Feeds up to 9. Written message optional.",
      noticeDays: 3,
      options: ["sizeLocked", "flavor", "drizzle", "message", "goodies", "pickup"]
    },
    {
      id: "cake-medium",
      category: "cakes",
      name: "Medium ice cream cake",
      price: 43,
      swatch: "#c9b6ff",
      blurb: "8-inch round. Feeds up to 18.",
      noticeDays: 3,
      options: ["sizeLocked", "flavor", "drizzle", "message", "goodies", "pickup"]
    },
    {
      id: "cake-large",
      category: "cakes",
      name: "Large ice cream cake",
      price: 55,
      swatch: "#ffe14a",
      blurb: "9×13 rectangle. Feeds up to 25. All sales final.",
      noticeDays: 3,
      options: ["sizeLocked", "flavor", "drizzle", "message", "goodies", "pickup"]
    },
    {
      id: "cupcake-1",
      category: "cupcakes",
      name: "Ice cream cupcake",
      price: 6,
      swatch: "#19c98a",
      blurb: "One cupcake. Flavor of the scoop, piled high.",
      noticeDays: 3,
      options: ["flavor", "drizzle", "pickup"]
    },
    {
      id: "cupcake-6",
      category: "cupcakes",
      name: "Half-dozen cupcakes",
      price: 34,
      swatch: "#ff6b9d",
      blurb: "Six cupcakes, one flavor or mix two.",
      noticeDays: 3,
      options: ["flavor", "flavor2", "drizzle", "pickup"]
    },
    {
      id: "cupcake-12",
      category: "cupcakes",
      name: "Dozen cupcakes",
      price: 64,
      swatch: "#5b4dff",
      blurb: "Twelve cupcakes. Classroom / hotel-room hero.",
      noticeDays: 3,
      options: ["flavor", "flavor2", "drizzle", "pickup"]
    },
    {
      id: "cookie-1",
      category: "cookies",
      name: "Ice cream sandwich cookie",
      price: 13.2,
      swatch: "#c47a2c",
      blurb: "Two cookies, one scoop. Order for pickup.",
      noticeDays: 1,
      options: ["flavor", "cookie", "pickup"]
    },
    {
      id: "cookie-4",
      category: "cookies",
      name: "Box of 4 sandwich cookies",
      price: 48,
      swatch: "#8b5a2b",
      blurb: "Four packed sandwiches. Stash in the freezer.",
      noticeDays: 1,
      options: ["flavor", "cookie", "pickup"]
    },
    {
      id: "pint-fresh",
      category: "packed",
      name: "Fresh-packed pint",
      price: 7.59,
      swatch: "#f4e4c1",
      blurb: "Packed from today’s case.",
      noticeDays: 0,
      options: ["flavor", "pickup"]
    },
    {
      id: "pint-df",
      category: "packed",
      name: "Dairy-free pint",
      price: 12,
      swatch: "#fff4d6",
      blurb: "Coconut or oat. Still a real pint.",
      noticeDays: 0,
      options: ["flavorDf", "pickup"]
    },
    {
      id: "snack-cup",
      category: "packed",
      name: "Pre-scooped snack cup",
      price: 6.59,
      swatch: "#ffb347",
      blurb: "Grab-and-go cup, packed from the case.",
      noticeDays: 0,
      options: ["flavor", "pickup"]
    },
    {
      id: "df-cup",
      category: "packed",
      name: "Dairy-free snack cup",
      price: 13.2,
      swatch: "#3ddc97",
      blurb: "Dairy-free, packed to go.",
      noticeDays: 0,
      options: ["flavorDf", "pickup"]
    },
    {
      id: "gallon",
      category: "bulk",
      name: "Gallon tub",
      price: 42.45,
      swatch: "#4a2c1a",
      blurb: "One flavor. 7-day notice so we can churn enough.",
      noticeDays: 7,
      options: ["flavor", "pickup"]
    },
    {
      id: "gallon-big",
      category: "bulk",
      name: "2.5 gallon tub",
      price: 99.45,
      swatch: "#2c1810",
      blurb: "Reunion size. 7-day notice.",
      noticeDays: 7,
      options: ["flavor", "pickup"]
    },
    {
      id: "cones-dozen",
      category: "bulk",
      name: "Dozen cake cones",
      price: 10.16,
      swatch: "#e8a45a",
      blurb: "Empty cones for a DIY scoop bar.",
      noticeDays: 0,
      options: ["pickup"]
    },
    {
      id: "bone",
      category: "pups",
      name: "Bone Appetit",
      price: 2.83,
      swatch: "#d4a574",
      blurb: "Pup-safe frozen treat.",
      noticeDays: 0,
      options: ["pickup"]
    },
    {
      id: "pupcake",
      category: "pups",
      name: "Pupcake",
      price: 6.6,
      swatch: "#c9a06a",
      blurb: "A tiny cake for a very good dog.",
      noticeDays: 3,
      options: ["pickup"]
    }
  ];

  var DRIZZLES = ["None", "Chocolate", "Peanut butter"];
  var COOKIES = ["Chocolate chip", "Sugar", "Chocolate sandwich", "Peanut butter"];
  var GOODIES = [
    { label: "None", extra: 0 },
    { label: "Rainbow sprinkles", extra: 0 },
    { label: "Cookie dough balls", extra: 3 },
    { label: "Crushed Oreos", extra: 3 },
    { label: "Chopped Reese’s cups", extra: 3 },
    { label: "Graduation cap + sprinkles", extra: 3 },
    { label: "Unicorn / star / rainbow", extra: 3 }
  ];

  function flavorNames(tag) {
    var lib = (global.Pintfield && global.Pintfield.LIBRARY) || [];
    var names = lib.filter(function (f) {
      if (!tag) return f.tags.indexOf("classic") !== -1 || f.tags.indexOf("seasonal") !== -1;
      return f.tags.indexOf(tag) !== -1;
    }).map(function (f) { return f.name; });
    if (names.length) return names;
    return ["Adams County Sweet Cream", "Peach Orchard Swirl", "Mint Chip Parade", "Double Dutch Chocolate"];
  }

  global.PintfieldShop = {
    SHOPS: SHOPS,
    WALKUP: WALKUP,
    CATEGORIES: CATEGORIES,
    PRODUCTS: PRODUCTS,
    DRIZZLES: DRIZZLES,
    COOKIES: COOKIES,
    GOODIES: GOODIES,
    flavorNames: flavorNames,
    byId: function (id) {
      for (var i = 0; i < PRODUCTS.length; i++) {
        if (PRODUCTS[i].id === id) return PRODUCTS[i];
      }
      return null;
    }
  };
})(window);
