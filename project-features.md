# LetzGo Project Features

## User Features
- User registration with email OTP verification
- User login/logout with JWT authentication
- Forgot password and reset password via OTP
- Profile management (update name, email)
- View ride history with details and status
- Book a ride by selecting pickup, destination, and vehicle type
- Live tracking of ride and driver location
- Payment via Razorpay (online) or cash
- Real-time notifications for ride status (confirmed, started, cancelled, ended)
- Blocked users cannot log in or book rides
- **Multiple ride management:** Users can manage multiple rides, view active and past rides, and cancel rides before they start

## Captain (Driver) Features
- Captain registration with email OTP verification and vehicle details
- Captain login/logout with JWT authentication
- Forgot password and reset password via OTP
- Profile management (update name, email, vehicle info)
- View ride history with details and status
- Accept and confirm rides in real-time
- Start and end rides with OTP verification
- Live tracking and location updates to backend
- Earnings, total rides, and distance tracking
- Blocked captains cannot log in or accept rides
- **Multiple ride management:** Captains can view and manage multiple ride requests, accept/cancel rides, and see ride status updates

## Admin Features
- Admin login/logout with JWT authentication
- View all users, captains, and rides
- Block/unblock users and captains
- Delete users and captains
- Dashboard with ride statistics, revenue, and status breakdown
- Filter rides by date and see summary charts
- Secure admin-only routes and actions
- **Multiple ride management:** Admin can view, filter, and manage all rides, including cancelling rides and monitoring ride statuses

## Common/Technical Features
- Role-based JWT authentication (user, captain, admin)
- Token blacklist for secure logout
- Google Maps integration for address, distance, and suggestions
- Real-time communication via Socket.IO for ride events
- Responsive and modern UI with React and Tailwind CSS
- Modular code structure for backend and frontend
- Environment variable support for secrets and API keys

## Security
- Passwords are hashed with bcrypt
- JWT tokens are signed and checked for role and blacklist
- Sensitive actions require authentication and proper role
- OTPs are used for registration and password reset

## Additional
- Ride fare calculation based on distance and duration
- Vehicle selection with dynamic fare display
- Ride cancellation by user or captain with notifications
- **Multiple ride management:** All roles can handle multiple rides, including viewing, filtering, and cancelling rides as appropriate
- Error handling and user-friendly messages throughout the app

