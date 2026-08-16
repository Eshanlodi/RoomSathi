
const gallery = [
  "/room1.jpeg",
  "/room2.jpeg",
  "/room3.jpeg",
  "/room4.jpeg",
  "/room5.jpeg",
  "/room6.jpeg"
];

const rooms = [
  {
    id: "stanza-living-verona-house",
    name: "Stanza Living Verona House",
    type: "",
    rent: 10000,
    city: "Indore",
    college: "IPS Academy",
    distance: "350 m near IPS Academy",
    sharing: "Single",
    verified: true,
    rating: 4.1,
    reviews: 12,
    images: [gallery[0]],
    facilities: ["WiFi", "Food", "Parking", "Attached Bathroom", "Laundry"],
    description: "Bright double-sharing rooms with home-style meals, high speed WiFi and 24x7 water supply. Walking distance from campus gate no. 2.",
    owner: { name: "Jitedra Rathore", phone: "+91 9452180999", since: "2024" }
  },
  {
    id: "netguru-boys-hostel",
    name: "Netguru Boys Hostel",
    type: "",
    rent: 8000,
    city: "Indore",
    college: "DAVV",
    distance: "1.9 km from DAVV college",
    sharing: "Single",
    verified: true,
    rating: 3,
    reviews: 20,
    images: [gallery[1]],
    facilities: ["WiFi", "AC", "Parking", "Balcony", "Attached Bathroom"],
    description: "Budget-friendly boys hostel in a residential area with mess, WiFi and laundry facilities, suitable for students looking for affordable accommodation near DAVV.",
    owner: { name: "Gattu Bhaiya", phone: "+91 9226335110", since: "2023" }
  },
  {
    id: "parmar-guest-house-and-hostel",
    name: "Parmar Guest House and Hostel",
    type: "",
    rent: 7500,
    city: "Indore",
    college: "Medicaps University",
    distance: " 2.2km from Medicaps University",
    sharing: "",
    verified: true,
    rating: 4.1,
    reviews: 15,
    images: [gallery[2]],
    facilities: ["WiFi", "Food", "AC", "CCTV", "Housekeeping"],
    description: "Guest house and hostel accommodation offering a comfortable stay for students, with food, parking and convenient access to local transport and daily-need shops.",
    owner: { name: "Vikas Parmar", phone: "9826045060", since: "2020" }
  },
  {
    id: "your-space",
    name: "Your Space Sharma Boys Hostel",
    type: "Hostel",
    rent: 10000,
    city: "Indore",
    college: "Prestige College",
    distance: " 500 m from Prestige college",
    sharing: "Triple",
    verified: false,
    rating: 4.1,
    reviews: 17,
    images: [gallery[3]],
    facilities: ["WiFi", "Food", "Study Room", "Laundry"],
    description: "Budget friendly hostel with a dedicated 24-hour study room, mess facility and easy local transport connectivity.",
    owner: { name: "Imran Sayyed", phone: "+91 98191 55220", since: "2022" }
  },
  {
    id: "Indore hostel",
    name: "Indore hostel",
    type: "Flat",
    rent: 11000,
    deposit: 0,
    city: "Indore",
    college: "Allen Institute",
    distance: "1.4 km from Allen carrier palasiya",
    sharing: "Double",
    verified: true,
    rating: 4.00,
    reviews: 35,
    images: [gallery[4]],
    facilities: ["WiFi", "AC", "Parking", "Gym", "Attached Bathroom"],
    description: "Student-friendly hostel located near the Allen coaching area, suitable for coaching students with easy access to food outlets, local shops and transport.",
    owner: { name: "Rohit Jain", phone: "+91 96860 77410", since: "2023" }
  },
  {
    id: "Grahum गृहम hostel",
    name: "Grahum गृहम hostel",
    type: "Room",
    rent: 7500,
    deposit: 0,
    city: "Indore",
    college: "Chameli devi group of institutions",
    distance: "650 m from Chameli devi group of institutions",
    sharing: "Double",
    verified: false,
    rating: 4.4,
    reviews: 21,
    images: [gallery[5]],
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
const cities = ["Indore"];
const colleges = [
  "IPS Academy",
  "DAVV",
  "Medicaps University",
  "Prestige College",
  "Allen Institute",
  "Chameli devi group of institutions"
];
const testimonials = [
  {
    name: "Rahul Sharma",
    role: "2nd Year, IPS Academy",
    quote:
      "RoomSathi ki help se mujhe IPS Academy ke paas affordable room mila. Verified owner aur room details dekhna bahut useful raha."
  },
  {
    name: "Aditya Verma",
    role: "1st Year, DAVV",
    quote:
      "DAVV ke paas room search karna easy ho gaya. Photos, rent, distance aur facilities ek hi jagah mil gayi."
  },
  {
    name: "Neha Patel",
    role: "3rd Year, Medicaps University",
    quote:
      "Verified listings ki wajah se room choose karte waqt confidence raha. Location aur facilities ki information bhi helpful thi."
  }
];

const faqs = [
  {
    q: "Do I have to pay any brokerage on RoomSathi?",
    a:
      "No. RoomSathi connects students directly with room and hostel owners, so students do not have to pay brokerage on RoomSathi listings."
  },
  {
    q: "How are listings verified?",
    a:
      "Our team checks owner identity documents, property details and room information before a listing receives the verified badge."
  },
  {
    q: "Which colleges are currently available?",
    a:
      "Currently, RoomSathi provides listings around IPS Academy, DAVV, Medicaps University, Prestige College, Allen Institute and Chameli Devi Group of Institutions in Indore."
  },
  {
    q: "Can I book a visit before paying anything?",
    a:
      "Yes. Students can contact the owner and schedule a room visit before making any payment."
  },
  {
    q: "Is RoomSathi free for students?",
    a:
      "Yes. RoomSathi is free for students to search and explore available rooms and hostels."
  }
];

const roommateMatches = [
  {
    name: "Rahul Sharma",
    college: "IPS Academy",
    budget: 8000,
    match: 95,
    tags: [
      "Vegetarian",
      "Non-smoker",
      "Early riser",
      "Very tidy"
    ],
    avatar: "https://i.pravatar.cc/160?img=13"
  },
  {
    name: "Aditya Verma",
    college: "DAVV",
    budget: 7500,
    match: 91,
    tags: [
      "Eggetarian",
      "Non-smoker",
      "Night owl",
      "Tidy"
    ],
    avatar: "https://i.pravatar.cc/160?img=33"
  },
  {
    name: "Neha Patel",
    college: "Medicaps University",
    budget: 7000,
    match: 87,
    tags: [
      "Vegetarian",
      "Non-smoker",
      "Balanced",
      "Tidy"
    ],
    avatar: "https://i.pravatar.cc/160?img=47"
  },
  {
    name: "Mohit Jain",
    college: "Prestige College",
    budget: 9000,
    match: 84,
    tags: [
      "Vegetarian",
      "Non-smoker",
      "Early riser",
      "Average tidy"
    ],
    avatar: "https://i.pravatar.cc/160?img=52"
  }
];

const notifications = [
  {
    title: "Visit confirmed",
    body:
      "Your visit for Stanza Living Verona House near IPS Academy is confirmed.",
    time: "2h ago"
  },
  {
    title: "New room match",
    body:
      "A new room matching your budget is available near DAVV.",
    time: "1d ago"
  },
  {
    title: "New listing",
    body:
      "A new hostel has been listed near Medicaps University.",
    time: "2d ago"
  },
  {
    title: "Room verified",
    body:
      "Indore Hostel near Allen Institute has been verified.",
    time: "3d ago"
  }
];

const roomReviews = [
  {
    name: "Rahul S.",
    rating: 5,
    text:
      "Room was clean and the location was very convenient for IPS Academy. Owner was also responsive.",
    date: "Mar 2026"
  },
  {
    name: "Aditya V.",
    rating: 4,
    text:
      "Good hostel near DAVV. WiFi and parking facilities are useful for students.",
    date: "Feb 2026"
  },
  {
    name: "Neha P.",
    rating: 5,
    text:
      "Good location near Medicaps University. Food and housekeeping facilities were helpful.",
    date: "Jan 2026"
  },
  {
    name: "Mohit J.",
    rating: 4,
    text:
      "Affordable accommodation near college with good connectivity and basic facilities.",
    date: "Dec 2025"
  }
];

const adminUsers = [
  {
    name: "Rahul Sharma",
    email: "rahul@student.in",
    city: "Indore",
    status: "Active",
    joined: "12 Jan 2026"
  },
  {
    name: "Aditya Verma",
    email: "aditya@student.in",
    city: "Indore",
    status: "Active",
    joined: "03 Feb 2026"
  },
  {
    name: "Neha Patel",
    email: "neha@student.in",
    city: "Indore",
    status: "Pending",
    joined: "21 Feb 2026"
  },
  {
    name: "Mohit Jain",
    email: "mohit@student.in",
    city: "Indore",
    status: "Active",
    joined: "09 Mar 2026"
  }
];

const monthlyStats = [
  {
    month: "Jan",
    students: 120,
    rooms: 18
  },
  {
    month: "Feb",
    students: 180,
    rooms: 25
  },
  {
    month: "Mar",
    students: 240,
    rooms: 32
  },
  {
    month: "Apr",
    students: 310,
    rooms: 41
  },
  {
    month: "May",
    students: 390,
    rooms: 52
  },
  {
    month: "Jun",
    students: 470,
    rooms: 64
  }
];

const inr = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

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