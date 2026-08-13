const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;
const gallery = [
  img("photo-1522708323590-d24dbb6b0267"),
  img("photo-1560448204-e02f11c3d0e2"),
  img("photo-1505693416388-ac5ce068fe85"),
  img("photo-1502672260266-1c1ef2d93688"),
  img("photo-1493809842364-78817add7ffb"),
  img("photo-1586023492125-27b2c045efd7")
];
const rooms = [
  {
    id: "sunrise-pg",
    name: "Sunrise Boys PG",
    type: "PG",
    rent: 6500,
    deposit: 1e4,
    city: "Pune",
    college: "COEP Technological University",
    distance: "0.8 km from college",
    sharing: "Double",
    verified: true,
    rating: 4.8,
    reviews: 42,
    images: [gallery[0], gallery[1], gallery[2], gallery[3]],
    facilities: ["WiFi", "Food", "Parking", "Attached Bathroom", "Laundry"],
    description: "Bright double-sharing rooms with home-style meals, high speed WiFi and 24x7 water supply. Walking distance from campus gate no. 2.",
    owner: { name: "Rakesh Deshmukh", phone: "+91 98230 11223", since: "2021" }
  },
  {
    id: "green-nest-flat",
    name: "Green Nest 2BHK Flat",
    type: "Flat",
    rent: 12e3,
    deposit: 24e3,
    city: "Pune",
    college: "MIT World Peace University",
    distance: "1.4 km from college",
    sharing: "Triple",
    verified: true,
    rating: 4.6,
    reviews: 28,
    images: [gallery[1], gallery[4], gallery[5], gallery[0]],
    facilities: ["WiFi", "AC", "Parking", "Balcony", "Attached Bathroom"],
    description: "Fully furnished 2BHK in a gated society with lift, power backup and covered parking. Ideal for a group of three students.",
    owner: { name: "Sneha Kulkarni", phone: "+91 90280 44551", since: "2019" }
  },
  {
    id: "campus-corner",
    name: "Campus Corner Girls PG",
    type: "PG",
    rent: 7800,
    deposit: 12e3,
    city: "Nagpur",
    college: "VNIT Nagpur",
    distance: "600 m from college",
    sharing: "Single",
    verified: true,
    rating: 4.9,
    reviews: 61,
    images: [gallery[2], gallery[3], gallery[1], gallery[5]],
    facilities: ["WiFi", "Food", "AC", "CCTV", "Housekeeping"],
    description: "Secure girls-only PG with biometric entry, CCTV coverage, warden support and nutritious veg meals thrice a day.",
    owner: { name: "Anita Sharma", phone: "+91 99700 88123", since: "2020" }
  },
  {
    id: "study-hub-hostel",
    name: "Study Hub Hostel",
    type: "Hostel",
    rent: 5200,
    deposit: 6e3,
    city: "Mumbai",
    college: "VJTI Mumbai",
    distance: "2.1 km from college",
    sharing: "Triple",
    verified: false,
    rating: 4.2,
    reviews: 17,
    images: [gallery[3], gallery[0], gallery[4], gallery[2]],
    facilities: ["WiFi", "Food", "Study Room", "Laundry"],
    description: "Budget friendly hostel with a dedicated 24-hour study room, mess facility and easy local train connectivity.",
    owner: { name: "Imran Sayyed", phone: "+91 98191 55220", since: "2022" }
  },
  {
    id: "urban-stay-flat",
    name: "Urban Stay Studio",
    type: "Flat",
    rent: 15500,
    deposit: 3e4,
    city: "Bengaluru",
    college: "RV College of Engineering",
    distance: "1.1 km from college",
    sharing: "Single",
    verified: true,
    rating: 4.7,
    reviews: 35,
    images: [gallery[4], gallery[5], gallery[2], gallery[1]],
    facilities: ["WiFi", "AC", "Parking", "Gym", "Attached Bathroom"],
    description: "Premium studio apartment with modular kitchen, work desk, gym access and 100 Mbps fibre broadband included.",
    owner: { name: "Karthik Rao", phone: "+91 96860 77410", since: "2018" }
  },
  {
    id: "shanti-niwas",
    name: "Shanti Niwas Room",
    type: "Room",
    rent: 4500,
    deposit: 5e3,
    city: "Nashik",
    college: "K. K. Wagh Institute",
    distance: "1.8 km from college",
    sharing: "Double",
    verified: true,
    rating: 4.4,
    reviews: 21,
    images: [gallery[5], gallery[1], gallery[3], gallery[0]],
    facilities: ["WiFi", "Parking", "Attached Bathroom"],
    description: "Peaceful independent room on the first floor of an owner-occupied bungalow with a separate entrance.",
    owner: { name: "Vijay Patil", phone: "+91 94220 33019", since: "2023" }
  }
];
const facilityOptions = [
  "WiFi",
  "Parking",
  "Food",
  "AC",
  "Attached Bathroom"
];
const cities = ["Pune", "Mumbai", "Nagpur", "Bengaluru", "Nashik"];
const colleges = [
  "COEP Technological University",
  "MIT World Peace University",
  "VNIT Nagpur",
  "VJTI Mumbai",
  "RV College of Engineering",
  "K. K. Wagh Institute"
];
const testimonials = [
  {
    name: "Aditi Joshi",
    role: "2nd Year, COEP",
    quote: "I found a verified PG 10 minutes from campus in two days flat and paid zero brokerage. The photos were exactly what I got."
  },
  {
    name: "Rohan Mehta",
    role: "Final Year, VJTI",
    quote: "The roommate matching quiz is scarily accurate. My flatmate and I matched at 94% and we have had zero conflicts."
  },
  {
    name: "Fatima Shaikh",
    role: "1st Year, VNIT",
    quote: "As a first year student moving cities, the verified badge and student reviews gave my parents real peace of mind."
  }
];
const faqs = [
  {
    q: "Do I have to pay any brokerage on RoomSathi?",
    a: "No. RoomSathi connects you directly with verified owners, so there is zero brokerage on every listing."
  },
  {
    q: "How are listings verified?",
    a: "Our team checks owner identity documents and property photos before a listing receives the verified badge."
  },
  {
    q: "How does roommate matching work?",
    a: "You answer a short lifestyle questionnaire covering budget, food, study hours and cleanliness. We score compatibility and show your best matches."
  },
  {
    q: "Can I book a visit before paying anything?",
    a: "Yes. Every room detail page has a Book Visit option so you can see the place in person first."
  },
  {
    q: "Is RoomSathi free for students?",
    a: "Completely free. Owners list for free too, and we never charge a commission on rent."
  }
];
const roommateMatches = [
  {
    name: "Nikhil Verma",
    college: "COEP Technological University",
    budget: 7e3,
    match: 95,
    tags: ["Vegetarian", "Non-smoker", "Early riser", "Very tidy"],
    avatar: "https://i.pravatar.cc/160?img=13"
  },
  {
    name: "Arjun Nair",
    college: "MIT World Peace University",
    budget: 8500,
    match: 88,
    tags: ["Eggetarian", "Non-smoker", "Night owl", "Tidy"],
    avatar: "https://i.pravatar.cc/160?img=33"
  },
  {
    name: "Siddharth Rane",
    college: "VJTI Mumbai",
    budget: 6e3,
    match: 81,
    tags: ["Vegetarian", "Non-drinker", "Balanced", "Average tidy"],
    avatar: "https://i.pravatar.cc/160?img=52"
  }
];
const notifications = [
  { title: "Visit confirmed", body: "Sunrise Boys PG visit scheduled for Saturday 11:00 AM.", time: "2h ago" },
  { title: "New match", body: "Nikhil Verma matches your lifestyle at 95%.", time: "1d ago" },
  { title: "Price drop", body: "Green Nest 2BHK reduced rent by \u20B91,000.", time: "3d ago" }
];
const roomReviews = [
  { name: "Prathamesh K.", rating: 5, text: "Clean rooms, great food and the owner is very responsive.", date: "Mar 2026" },
  { name: "Sana M.", rating: 4, text: "Good location and WiFi. Water pressure could be better in summer.", date: "Feb 2026" },
  { name: "Devang S.", rating: 5, text: "Stayed for two years. Genuinely feels like home.", date: "Dec 2025" }
];
const adminUsers = [
  { name: "Aditi Joshi", email: "aditi@student.in", city: "Pune", status: "Active", joined: "12 Jan 2026" },
  { name: "Rohan Mehta", email: "rohan@student.in", city: "Mumbai", status: "Active", joined: "03 Feb 2026" },
  { name: "Fatima Shaikh", email: "fatima@student.in", city: "Nagpur", status: "Pending", joined: "21 Feb 2026" },
  { name: "Karan Bhatt", email: "karan@student.in", city: "Pune", status: "Suspended", joined: "09 Mar 2026" }
];
const monthlyStats = [
  { month: "Jan", students: 220, rooms: 40 },
  { month: "Feb", students: 310, rooms: 55 },
  { month: "Mar", students: 420, rooms: 68 },
  { month: "Apr", students: 380, rooms: 72 },
  { month: "May", students: 520, rooms: 90 },
  { month: "Jun", students: 610, rooms: 105 }
];
const inr = (n) => `\u20B9${n.toLocaleString("en-IN")}`;
export {
  adminUsers,
  cities,
  colleges,
  facilityOptions,
  faqs,
  inr,
  monthlyStats,
  notifications,
  roomReviews,
  roommateMatches,
  rooms,
  testimonials
};
