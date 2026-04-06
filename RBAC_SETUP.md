# RBAC Login System Documentation

## Overview

This Finance Dashboard now includes a complete **Role-Based Access Control (RBAC)** system with a professional login page and admin panel.

## Features

✅ **Three User Roles:**
- **Admin**: Full access to all features + Admin Panel
- **Viewer**: Read-only access to dashboard

✅ **Login System:**
- Pre-configured demo credentials
- Session persistence (localStorage)
- Automatic redirect based on authentication state
- Quick login buttons for testing

✅ **Admin Panel:**
- User management dashboard
- System settings
- Stats and analytics
- Admin-only features

✅ **Protected Components:**
- `ProtectedComponent` - Show content based on required roles
- `AdminOnly` - Show content only to admins
- Easy integration throughout the app

## Demo Credentials

```
Admin Account:
  Username: admin
  Password: admin123
Viewer Account:
  Username: viewer
  Password: viewer123
```

## Architecture

### New Files Created

1. **Context/AuthContext.jsx** - Authentication & role management
2. **Pages/Login.jsx** - Login page with demo credentials
3. **Pages/AdminPanel.jsx** - Admin-only dashboard
4. **Components/ProtectedComponent.jsx** - RBAC helper components

### Updated Files

1. **App.jsx** - Added login/dashboard routing
2. **main.jsx** - Wrapped app with AuthProvider
3. **Components/layout/HeadBar.jsx** - Added user menu & logout
4. **Components/layout/SideBar.jsx** - Added admin icon & logout
5. **Pages/DashBoard.jsx** - Added admin panel navigation
6. **Context/FinanceContext.jsx** - Synced with AuthContext

## Usage

### 1. Using the useAuth Hook

```javascript
import { useAuth } from "../Context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout, hasRole, isAdmin } = useAuth();

  return (
    <div>
      <p>User: {user?.name}</p>
      <p>Role: {user?.role}</p>
      {isAdmin() && <button>Admin Only Button</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Protecting Components with AdminOnly

```javascript
import { AdminOnly } from "../components/ProtectedComponent";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <AdminOnly>
        <AdminSettings />
      </AdminOnly>
    </div>
  );
}
```

### 3. Protecting Components with ProtectedComponent

```javascript
import { ProtectedComponent } from "../components/ProtectedComponent";

function Dashboard() {
  return (
    <ProtectedComponent requiredRoles={["admin", "user"]}>
      <div>Only admin and user can see this</div>
    </ProtectedComponent>
  );
}
```

### 4. Using hasRole for Custom Logic

```javascript
import { useAuth } from "../Context/AuthContext";

function Features() {
  const { hasRole } = useAuth();
  
  return (
    <div>
      {hasRole("admin") && <AdminFeature />}
      {hasRole(["admin", "user"]) && <EditFeature />}
      <ViewFeature />
    </div>
  );
}
```

## Key Methods in AuthContext

### `login(username, password)`
- Authenticates user with provided credentials
- Returns `true` on success, `false` on failure
- Stores user data in localStorage

### `logout()`
- Clears user session
- Removes data from localStorage
- Redirects to login page

### `hasRole(requiredRoles)`
- Check if user has required role(s)
- `requiredRoles` can be string or array
- Returns boolean

### `isAdmin()`
- Quick check if user is admin
- Returns boolean

## Authentication Flow

```
1. User lands on app
2. AuthProvider checks localStorage for saved session
3. If no session → Show Login page
4. User logs in with credentials
5. AuthContext validates credentials locally (for demo)
6. User data + role stored in localStorage
7. App redirects to Dashboard
8. User can click Admin icon (only visible to admins) → Admin Panel
9. Click logout → Clear session and return to login

```

## Extending the System

### Adding New Roles

Edit `/src/Context/AuthContext.jsx`:

```javascript
const DEFAULT_USERS = [
  // ... existing users
  { id: 4, username: "editor", password: "editor123", role: "editor", name: "Editor User" },
];
```

### Connecting to Real API

Replace mock credentials in AuthContext with API call:

```javascript
const login = async (username, password) => {
  try {
    const response = await fetch("YOUR_API/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const userData = await response.json();
    
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }
  } catch (error) {
    setError(error.message);
    return false;
  }
};
```

### Adding JWT Tokens

```javascript
const login = async (username, password) => {
  const response = await fetch("YOUR_API/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
  const { token, user } = await response.json();
  
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
  
  setIsAuthenticated(true);
  setUser(user);
};
```

## Security Notes

⚠️ **For Demo Only**: Current implementation stores credentials in frontend code.

**For Production**:
- Use JWT tokens or session cookies
- Validate tokens on every API request
- Implement token refresh mechanism
- Use HTTPS for all communication
- Never store passwords in localStorage
- Implement CORS properly
- Add rate limiting on login attempts
- Use secure, HttpOnly cookies

## Troubleshooting

**Q: Login page not showing?**
- Check if AuthProvider is wrapping the app in main.jsx
- Verify localStorage isn't storing old session data

**Q: Admin icon not visible?**
- Ensure you're logged in as admin user
- Check isAdmin() function in SideBar.jsx

**Q: Logout not working?**
- Verify logout function is called from HeadBar.jsx
- Check localStorage is being cleared

**Q: Protected components not visible?**
- Verify hasRole() function is correctly checking roles
- Ensure user object has role property

## Files Reference

```
src/
├── Context/
│   ├── AuthContext.jsx          (✨ NEW - Authentication)
│   └── FinanceContext.jsx       (Updated)
├── Pages/
│   ├── Login.jsx                (✨ NEW - Login page)
│   ├── AdminPanel.jsx           (✨ NEW - Admin dashboard)
│   └── DashBoard.jsx            (Updated)
├── components/
│   ├── ProtectedComponent.jsx   (✨ NEW - RBAC helpers)
│   └── layout/
│       ├── HeadBar.jsx          (Updated - User menu)
│       └── SideBar.jsx          (Updated - Admin icon)
├── App.jsx                      (Updated - Routing)
└── main.jsx                     (Updated - AuthProvider)
```
