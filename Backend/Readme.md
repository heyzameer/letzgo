# Token Generation and Security Explanation

## How is the token generated?

- The token is generated using [jsonwebtoken (JWT)](https://github.com/auth0/node-jsonwebtoken).
- When a user or captain logs in or registers, the backend calls `.generateAuthToken()` on the user/captain model.
- This method signs a JWT with the user's/captain's `_id` as the payload and uses `process.env.JWT_SECRET` as the secret key.
- Example (user):
  ```js
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  ```
- The token is valid for 24 hours.

## Is the token safe?

- The token is cryptographically signed using a secret (`JWT_SECRET`). As long as the secret is kept safe, the token cannot be forged.
- The token only contains the user's/captain's `_id` (not sensitive data).
- The backend verifies the token on every protected route using the same secret.
- Blacklisted tokens (e.g., after logout) are stored in the database and checked on every request.

## Is it role-based?

- The token itself does **not** contain a role field.
- Role-based access is enforced by using different authentication middlewares:
  - `authUser` for user routes (fetches user by `_id` from token)
  - `authCaptain` for captain routes (fetches captain by `_id` from token)
- Each middleware only allows access to the correct type (user or captain).

## Can a token from one user be used to access a different user?

- **No.**
- The token contains only the `_id` of the user/captain who logged in.
- When a protected route is accessed, the middleware fetches the user/captain by `_id` from the token.
- If a user tries to use another user's token, it will not work because the `_id` will not match.
- If a user tries to use a captain's token on a user route (or vice versa), the middleware will not find a matching user/captain and will reject the request.

# Role-Based Token Implementation

## Current Implementation

- The JWT token only contains the user's or captain's `_id`.
- Role-based access is enforced by separate authentication middlewares (`authUser`, `authCaptain`).
- The token itself does **not** indicate the role.

## Role-Based Token Implementation

**How to implement:**
- When generating the token, include a `role` field in the payload:
  ```js
  // For user
  const token = jwt.sign({ _id: this._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  // For captain
  const token = jwt.sign({ _id: this._id, role: 'captain' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  ```
- In the authentication middleware, decode the token and check the `role` field to enforce access.

**Example Middleware:**
```js
// auth.middleware.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');

exports.authRole = (role) => async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Invalid role' });
        }
        if (role === 'user') {
            req.user = await userModel.findById(decoded._id);
        } else if (role === 'captain') {
            req.captain = await captainModel.findById(decoded._id);
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
```
- Use as: `router.get('/user-route', authRole('user'), ...)`
- Use as: `router.get('/captain-route', authRole('captain'), ...)`

## Differences from Current Implementation

- **Current:** Role is enforced by using different middlewares and fetching user/captain by `_id`.
- **Role-based:** Role is embedded in the token and checked on every request, making it explicit and easier to extend (e.g., for admin roles).

## Benefits

- Explicit role in the token.
- Easier to add more roles (e.g., admin, support).
- Middleware is more generic and scalable.

## Drawbacks

- If a user's role changes, old tokens are still valid until they expire (unless you implement token revocation/blacklist).
- Slightly larger token size.

## Summary

- Role-based tokens add a `role` field to the JWT payload.
- Middleware checks the role on every request.
- This is more explicit and flexible than the current approach.
