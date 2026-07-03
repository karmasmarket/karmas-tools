// =====================================
// FLYER TEMPLATE LIBRARY
// Each template defines a background color and a list of starter objects
// that get loaded onto the Fabric canvas when selected.
// Canvas is 1000 x 650.
// =====================================

const TEMPLATES = [
  {
    id: "restaurant",
    category: "Restaurant",
    name: "Restaurant Special",
    background: "#1a1a1a",
    objects: [
      { type: "rect", left: 0, top: 0, width: 1000, height: 650, fill: "#1a1a1a" },
      { type: "rect", left: 0, top: 0, width: 1000, height: 160, fill: "#c0392b" },
      { type: "circle", left: 850, top: -60, radius: 130, fill: "#a8311f" },
      { type: "textbox", left: 50, top: 35, width: 700, text: "TASTE THE DIFFERENCE", fontSize: 44, fill: "#ffffff", fontWeight: "bold", fontFamily: "Georgia", textAlign: "left" },
      { type: "textbox", left: 50, top: 95, width: 600, text: "Fresh ingredients • Bold flavors • Every day", fontSize: 17, fill: "#f7d8d3", fontFamily: "Arial" },
      { type: "rect", left: 50, top: 210, width: 280, height: 200, fill: "#2c2c2c", stroke: "#c0392b", strokeWidth: 2, rx: 10, ry: 10 },
      { type: "textbox", left: 70, top: 270, width: 240, text: "LOGO / PHOTO HERE", fontSize: 14, fill: "#888888", fontFamily: "Arial", textAlign: "center" },
      { type: "textbox", left: 380, top: 220, width: 560, text: "Weekend Special Menu", fontSize: 28, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial" },
      { type: "textbox", left: 380, top: 270, width: 560, text: "Enjoy our chef's signature dishes at a price you'll love", fontSize: 16, fill: "#cccccc", fontFamily: "Arial" },
      { type: "rect", left: 380, top: 340, width: 230, height: 65, fill: "#c0392b", rx: 10, ry: 10 },
      { type: "textbox", left: 410, top: 360, width: 180, text: "ORDER NOW", fontSize: 20, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial" },
      { type: "textbox", left: 50, top: 560, width: 700, text: "Open Daily 10AM – 10PM  |  Call 0800-000-0000", fontSize: 16, fill: "#999999", fontFamily: "Arial" },
    ],
  },
  {
    id: "church",

    category: "Church",

    name: "Sunday Service",

    background: "#fdfaf3",

    objects: [

      { type: "rect", left: 0, top: 0, width: 1000, height: 650, fill: "#fdfaf3" },

      { type: "rect", left: 0, top: 0, width: 1000, height: 220, fill: "#2c3e50" },

      { type: "circle", left: -60, top: -60, radius: 140, fill: "#34495e" },

      { type: "textbox", left: 100, top: 60, width: 800, text: "SUNDAY WORSHIP SERVICE", fontSize: 42, fill: "#ffffff", fontWeight: "bold", fontFamily: "Georgia", textAlign: "center" },

      { type: "textbox", left: 100, top: 130, width: 800, text: "Join us for a time of faith, fellowship & worship", fontSize: 18, fill: "#dce3e8", fontFamily: "Arial", textAlign: "center" },

      { type: "circle", left: 750, top: 280, radius: 90, fill: "#ffffff", stroke: "#2c3e50", strokeWidth: 3 },

      { type: "textbox", left: 700, top: 350, width: 200, text: "LOGO HERE", fontSize: 13, fill: "#888888", fontFamily: "Arial", textAlign: "center" },

      { type: "textbox", left: 100, top: 300, width: 550, text: "Every Sunday", fontSize: 30, fill: "#2c3e50", fontWeight: "bold", fontFamily: "Georgia" },

      { type: "textbox", left: 100, top: 350, width: 550, text: "9:00 AM – 11:30 AM", fontSize: 22, fill: "#555555", fontFamily: "Arial" },

      { type: "textbox", left: 100, top: 400, width: 550, text: "123 Faith Avenue, Your City", fontSize: 16, fill: "#777777", fontFamily: "Arial" },

      { type: "rect", left: 100, top: 470, width: 240, height: 60, fill: "#2c3e50", rx: 8, ry: 8 },

      { type: "textbox", left: 140, top: 488, width: 200, text: "JOIN US", fontSize: 18, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial" },

    ],

  },

  {
    id: "birthday",
    category: "Birthday",
    name: "Birthday Bash",
    background: "#fff0f5",
    objects: [
      { type: "rect", left: 0, top: 0, width: 1000, height: 650, fill: "#fff0f5" },
      { type: "circle", left: 700, top: 40, radius: 100, fill: "#ff6f91" },
      { type: "circle", left: 800, top: 380, radius: 60, fill: "#ffc93c" },
      { type: "triangle", left: 60, top: 50, width: 90, height: 90, fill: "#6bcb77", angle: 15 },
      { type: "triangle", left: 130, top: 120, width: 60, height: 60, fill: "#4d96ff", angle: -10 },
      { type: "textbox", left: 100, top: 230, width: 700, text: "YOU'RE INVITED!", fontSize: 54, fill: "#ff4365", fontWeight: "bold", fontFamily: "Georgia" },
      { type: "textbox", left: 100, top: 320, width: 700, text: "Birthday Celebration", fontSize: 30, fill: "#444444", fontFamily: "Arial" },
      { type: "rect", left: 100, top: 390, width: 320, height: 130, fill: "#ffffff", stroke: "#ff6f91", strokeWidth: 2, rx: 12, ry: 12 },
      { type: "textbox", left: 120, top: 410, width: 280, text: "Saturday, 6:00 PM", fontSize: 20, fill: "#333333", fontWeight: "bold", fontFamily: "Arial" },
      { type: "textbox", left: 120, top: 445, width: 280, text: "Venue Address Here", fontSize: 16, fill: "#666666", fontFamily: "Arial" },
      { type: "textbox", left: 120, top: 475, width: 280, text: "RSVP: 0800-000-0000", fontSize: 16, fill: "#666666", fontFamily: "Arial" },
    ],
  },
  {
    id: "business",
    category: "Business",
    name: "Corporate Poster",
    background: "#ffffff",
    objects: [
      { type: "rect", left: 0, top: 0, width: 1000, height: 650, fill: "#ffffff" },
      { type: "rect", left: 0, top: 0, width: 380, height: 650, fill: "#0d1b2a" },
      { type: "circle", left: 200, top: 480, radius: 150, fill: "#16263b" },
      { type: "rect", left: 50, top: 60, width: 100, height: 100, fill: "#ffffff", stroke: "#778da9", strokeWidth: 1, rx: 8, ry: 8 },
      { type: "textbox", left: 55, top: 95, width: 90, text: "LOGO", fontSize: 13, fill: "#0d1b2a", fontFamily: "Arial", textAlign: "center" },
      { type: "textbox", left: 50, top: 200, width: 290, text: "GROW YOUR BUSINESS", fontSize: 30, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial" },
      { type: "textbox", left: 50, top: 270, width: 290, text: "Strategy. Execution. Results.", fontSize: 16, fill: "#a0aec0", fontFamily: "Arial" },
      { type: "textbox", left: 50, top: 540, width: 290, text: "www.yourbusiness.com", fontSize: 14, fill: "#778da9", fontFamily: "Arial" },
      { type: "textbox", left: 440, top: 90, width: 500, text: "Partner With Confidence", fontSize: 32, fill: "#0d1b2a", fontWeight: "bold", fontFamily: "Georgia" },
      { type: "textbox", left: 440, top: 150, width: 500, text: "We help ambitious companies scale with proven strategy, hands-on execution, and measurable results.", fontSize: 16, fill: "#444444", fontFamily: "Arial" },
      { type: "rect", left: 440, top: 280, width: 220, height: 90, fill: "#0d1b2a", rx: 10, ry: 10 },
      { type: "textbox", left: 460, top: 308, width: 180, text: "Contact Us", fontSize: 22, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial" },
      { type: "textbox", left: 440, top: 400, width: 500, text: "0800-000-0000  |  hello@yourbusiness.com", fontSize: 15, fill: "#666666", fontFamily: "Arial" },
    ],
  },
  {
    id: "realestate",
    category: "Real Estate",
    name: "Property Listing",
    background: "#f4f6f7",
    objects: [
      { type: "rect", left: 0, top: 0, width: 1000, height: 650, fill: "#f4f6f7" },
      { type: "rect", left: 0, top: 0, width: 1000, height: 100, fill: "#1e8449" },
      { type: "textbox", left: 40, top: 30, width: 400, text: "FOR SALE", fontSize: 38, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial" },
      { type: "rect", left: 700, top: 25, width: 240, height: 50, fill: "#ffffff", rx: 25, ry: 25 },
      { type: "textbox", left: 730, top: 40, width: 200, text: "LOGO HERE", fontSize: 14, fill: "#1e8449", fontFamily: "Arial" },
      { type: "rect", left: 60, top: 150, width: 880, height: 260, fill: "#dfe6e9", stroke: "#bbb", strokeWidth: 1, rx: 10, ry: 10 },
      { type: "textbox", left: 400, top: 260, width: 300, text: "PROPERTY PHOTO", fontSize: 18, fill: "#888888", fontFamily: "Arial", textAlign: "center" },
      { type: "textbox", left: 60, top: 440, width: 700, text: "Beautiful 4-Bedroom Home", fontSize: 32, fill: "#1e8449", fontWeight: "bold", fontFamily: "Arial" },
      { type: "textbox", left: 60, top: 490, width: 700, text: "Spacious living • Modern kitchen • Great location", fontSize: 18, fill: "#555555", fontFamily: "Arial" },
      { type: "rect", left: 60, top: 545, width: 260, height: 60, fill: "#1e8449", rx: 8, ry: 8 },
      { type: "textbox", left: 90, top: 562, width: 220, text: "Call: 0800-000-0000", fontSize: 17, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial" },
    ],
  },
  {
    id: "fashion",
    category: "Fashion",
    name: "Fashion Drop",
    background: "#0a0a0a",
    objects: [
      { type: "rect", left: 0, top: 0, width: 1000, height: 650, fill: "#0a0a0a" },
      { type: "rect", left: 350, top: 60, width: 300, height: 350, fill: "#1a1a1a", stroke: "#444", strokeWidth: 1 },
      { type: "textbox", left: 400, top: 220, width: 200, text: "MODEL / PRODUCT PHOTO", fontSize: 14, fill: "#777777", fontFamily: "Arial", textAlign: "center" },
      { type: "textbox", left: 100, top: 440, width: 800, text: "NEW COLLECTION", fontSize: 58, fill: "#ffffff", fontWeight: "bold", fontFamily: "Georgia", textAlign: "center" },
      { type: "textbox", left: 100, top: 525, width: 800, text: "Elevate Your Style", fontSize: 22, fill: "#cccccc", fontFamily: "Arial", textAlign: "center" },
      { type: "rect", left: 400, top: 580, width: 200, height: 55, fill: "#ffffff", rx: 28, ry: 28 },
      { type: "textbox", left: 435, top: 597, width: 140, text: "SHOP NOW", fontSize: 16, fill: "#0a0a0a", fontWeight: "bold", fontFamily: "Arial" },
      { type: "textbox", left: 30, top: 20, width: 300, text: "YOUR BRAND", fontSize: 18, fill: "#ffffff", fontFamily: "Georgia", fontWeight: "bold" },
    ],
  },
  {
    id: "sales",
    category: "Sales",
    name: "Big Sale Poster",
    background: "#fff8e1",
    objects: [
      { type: "rect", left: 0, top: 0, width: 1000, height: 650, fill: "#fff8e1" },
      { type: "circle", left: 350, top: 60, radius: 150, fill: "#ff3b30" },
      { type: "textbox", left: 415, top: 140, width: 220, text: "50%", fontSize: 50, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial", textAlign: "center" },
      { type: "textbox", left: 415, top: 200, width: 220, text: "OFF", fontSize: 26, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial", textAlign: "center" },
      { type: "rect", left: 60, top: 60, width: 130, height: 130, fill: "#ffffff", stroke: "#ff3b30", strokeWidth: 2, rx: 10, ry: 10 },
      { type: "textbox", left: 75, top: 110, width: 100, text: "LOGO", fontSize: 13, fill: "#888888", fontFamily: "Arial", textAlign: "center" },
      { type: "textbox", left: 150, top: 420, width: 700, text: "LIMITED TIME OFFER", fontSize: 32, fill: "#222222", fontWeight: "bold", fontFamily: "Arial", textAlign: "center" },
      { type: "textbox", left: 150, top: 470, width: 700, text: "Shop before it's gone!", fontSize: 19, fill: "#555555", fontFamily: "Arial", textAlign: "center" },
      { type: "rect", left: 400, top: 530, width: 200, height: 60, fill: "#ff3b30", rx: 30, ry: 30 },
      { type: "textbox", left: 430, top: 548, width: 140, text: "SHOP NOW", fontSize: 17, fill: "#ffffff", fontWeight: "bold", fontFamily: "Arial" },
    ],
  },
  {
     id: "event",
    category: "Event",
    name: "Event Announcement",
    background: "#10002b",
    objects: [
      { type: "rect", left: 0, top: 0, width: 1000, height: 650, fill: "#10002b" },
      { type: "circle", left: -80, top: -80, radius: 180, fill: "#240046" },
      { type: "circle", left: 850, top: 480, radius: 160, fill: "#240046" },
      { type: "textbox", left: 80, top: 90, width: 840, text: "LIVE EVENT", fontSize: 58, fill: "#e0aaff", fontWeight: "bold", fontFamily: "Georgia", textAlign: "center" },
      { type: "textbox", left: 80, top: 180, width: 840, text: "An Experience You Won't Forget", fontSize: 20, fill: "#c77dff", fontFamily: "Arial", textAlign: "center" },
      { type: "rect", left: 380, top: 260, width: 240, height: 150, fill: "#240046", stroke: "#e0aaff", strokeWidth: 2, rx: 10, ry: 10 },
      { type: "textbox", left: 410, top: 320, width: 180, text: "EVENT PHOTO", fontSize: 14, fill: "#c77dff", fontFamily: "Arial", textAlign: "center" },
      { type: "textbox", left: 200, top: 450, width: 600, text: "Saturday, 7:00 PM | Venue Name", fontSize: 18, fill: "#dabfff", fontFamily: "Arial", textAlign: "center" },
      { type: "rect", left: 380, top: 510, width: 240, height: 70, fill: "#e0aaff", rx: 35, ry: 35 },
      { type: "textbox", left: 420, top: 532, width: 160, text: "GET TICKETS", fontSize: 18, fill: "#10002b", fontWeight: "bold", fontFamily: "Arial" },
    ],
  },
];

export default TEMPLATES;