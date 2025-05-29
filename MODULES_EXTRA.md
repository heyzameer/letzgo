Week 1:  Core Auth + User Basics

Module 1 Backend
- User Signup (Registration)
 - User Login (Authentication)
 - Captain Signup (Registration)
 - Captain Login (Authentication)
 - JWT for authentication and authorization (token-based) 
- Bcrypt for password hashing and verification 
- Express-validator for input validation
 - User profile retrieval (protected route)
 - Captain profile retrieval (protected route) 
- User logout with JWT blacklist (token invalidation)
 - Captain logout with JWT blacklist (token invalidation)
 - MongoDB with Mongoose for data storage
 - Token blacklist model for logout/session invalidation
 - Cookie-parser for handling cookies 
- CORS enabled for cross-origin requests 
- Environment variable management with dotenv.
Module 2  - Frontend 
- User Signup (Registration) page and form 
- User Login page and form
 - User Logout functionality
 - User protected routes (UserProtectWrapper)
 - User context for global user state management 
- Captain Signup (Registration) page and form 
- Captain Login page and form
 - Captain Logout functionality
 - Captain protected routes (CaptainProtectWrapper) 
- Captain context for global captain state management 
- Home page for users
 - Home page for captains 
- Start/landing page 
- Axios for API requests 
- React Router for navigation and route protection 
- Tailwind CSS for styling 
- Error handling and validation feedback in forms
 - Token storage and usage for authentication (localStorage)



✅ Week 2: Ride Booking + User,Driver Core
 Captain Features (Frontend)
- Captain Home Page
- Captain Dashboard
- Captain Ride Notification Panel
- Captain Ride Accept
- Captain Ride Confirm
- Finish Ride Panel
- Payment Handling for Completed Rides

Rider/User Features (Frontend)	
- Rider Home Page
- Location Search Panel
- Location Suggestion Dropdown
- Choose Vehicle Panel
- Confirm Ride Panel
- Looking for Driver Panel
- User On Ride Panel (active ride status and tracking)

---

✅ **Week 3: Maps, Fare, Ride Flow, and Enhancements (Planned Tasks)**

### **Backend:**

* Integrate Google Maps API for geocoding, distance calculation, and autocomplete
* Implement `/api/maps/get-coordinate` for converting address to latitude/longitude
* Implement `/api/maps/get-distance-time` to return distance and ETA between two points
* Implement `/api/maps/get-suggestions` for address autocomplete functionality
* Create `/api/rides/get-fare` endpoint to dynamically calculate fare based on distance and duration
* Enhance ride model to include OTP, fare, and ride status fields
* Add ride creation endpoint with proper validation and OTP generation
* Modularize ride service logic to handle fare calculation, ride confirmation, start, and end flows
* Improve error handling and validation across all ride and map-related endpoints

### **Frontend:**

* Integrate dynamic fare fetching into the ride booking flow
* Use Google Maps-based suggestions for pickup and destination input fields
* Add animated UI panels for vehicle selection, ride confirmation, and driver search states
* Implement smooth real-time transitions for ride panels using GSAP
* Connect ride creation frontend logic to corresponding backend endpoints
* Enhance error and loading state feedback during the ride booking process
* Modularize UI components for ride flow (e.g., `VehiclePanel`, `ConfirmRide`, `LookingForDriver`, `WaitingForDriver`)
* Add context providers for managing and sharing user and captain data across components

---


---
Backend
- **Socket.io integration for real-time communication:**
  - Server-side socket setup and initialization
  - User and captain join events to track socket IDs
  - Real-time location update handling for captains
  - Utility to send targeted socket messages (e.g., ride notifications)

Frontend
- **Socket.io client integration:**
  - Socket context/provider for global access
  - Real-time connection and disconnection handling
  - Ready for real-time ride status and notification events



---

### **Week 4 (Planned Tasks)**

#### **Backend:**

* Implement captain and user socket connection and real-time location updates using Socket.io
* Store captain location in MongoDB to enable proximity-based ride matching
* Handle ride status transitions: pending, accepted, ongoing, completed, and cancelled
* Add OTP verification logic for ride start (user provides OTP to captain)
* Implement ride end/completion logic with status update and notifications for both captain and user
* Populate ride endpoints with user and captain details for enhanced frontend integration
* Add error handling for invalid ride status transitions and OTP mismatches
* Modularize and document all backend endpoints in the README file

#### **Frontend:**

* Integrate Google Maps live tracking for user and captain using `@react-google-maps/api`
* Enable real-time ride status updates via `socket.io-client` (e.g., ride-confirmed, ride-started)
* Display and verify ride OTP in *WaitingForDriver* and *CaptainRiding* flows
* Implement ride completion UI and backend API call in *FinishRide* component
* Add persistent authentication and profile fetching for both user and captain during app load
* Improve protected route wrappers with redirection on invalid or expired tokens
* Enhance error and loading state handling in key flows (login, signup, ride, etc.)
* Refine UI/UX for ride panels, captain dashboard, and ride details screens
* Add context providers for managing global state (user and captain)
* Modularize and reuse UI components across ride and captain flows
* Improve form validation and user feedback in login, signup, and ride creation forms
* Add vehicle type selection and validation in captain signup and ride booking

---
