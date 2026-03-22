# Technical Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  React.js SPA    │  │   Redux Store    │  │ Context API   │ │
│  │  (Components)    │  │  (State Mgmt)    │  │ (Auth/Theme)  │ │
│  └────────┬─────────┘  └──────────────────┘  └───────────────┘ │
│           │                                                      │
│  ┌────────▼─────────────────────────────────────────────────┐  │
│  │          Tailwind CSS + Dark Mode Support                │  │
│  └────────┬───────────────────────────────────────────────┬─┘  │
│           │                                               │     │
│  ┌────────▼───────────────────┬──────────────────────────▼──┐  │
│  │   Firebase Auth Service     │   Firebase Service Layer    │  │
│  │   • Email/Password Login    │   • Firestore Operations   │  │
│  │   • Session Management      │   • Real-time Listeners    │  │
│  │   • Role Validation         │   • Cloud Storage Access   │  │
│  └────────┬───────────────────┴──────────────────────────┬──┘  │
└───────────┼──────────────────────────────────────────────┼────┘
            │                                              │
┌───────────▼──────────────────────────────────────────────▼────┐
│                    Firebase Backend Layer                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Firebase    │  │  Firestore   │  │Cloud Storage │       │
│  │   Auth       │  │  Database    │  │  (Images)    │       │
│  │              │  │              │  │              │       │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤       │
│  │ • Email/Pass │  │ • Collections│  │ • Buckets    │       │
│  │ • Custom     │  │ • Indexes    │  │ • Signed     │       │
│  │   Claims     │  │ • Real-time  │  │   URLs       │       │
│  │ • Sessions   │  │   Updates    │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                │
│  ┌──────────────────────────┐  ┌──────────────────────┐      │
│  │  Cloud Functions         │  │  Security Rules      │      │
│  │  • Auto-reorder tasks    │  │  • Firestore Rules   │      │
│  │  • Sales summaries       │  │  • Storage Rules     │      │
│  │  • Inventory checks      │  │  • RBAC Enforcement  │      │
│  │  • Email notifications   │  │                      │      │
│  └──────────────────────────┘  └──────────────────────┘      │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         Firebase Monitoring & Logging                │    │
│  │         • Performance Monitoring                     │    │
│  │         • Cloud Logging                             │    │
│  │         • Error Reporting                          │    │
│  │         • Uptime Checks                            │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom extensions
- **State Management**: 
  - Redux Toolkit for complex state
  - Context API for auth and theme
- **Routing**: React Router v6
- **Charts**: Recharts for data visualization
- **UI Components**: Lucide Icons, Framer Motion
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Data Export**: PapaParse

### Backend (Firebase)
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **File Storage**: Cloud Storage
- **Serverless Compute**: Cloud Functions (Node.js 18)
- **Hosting**: Firebase Hosting
- **CDN**: Firebase CDN (Automatic)
- **Monitoring**: Cloud Logging, Cloud Monitoring

### Development Tools
- **Package Manager**: npm
- **Linter**: ESLint
- **Version Control**: Git
- **CI/CD**: Firebase CLI

## Data Flow Architecture

### Authentication Flow
```
User Login
    ↓
Firebase Auth
    ↓
Get Custom Claims (Role)
    ↓
Store in AuthContext
    ↓
Allow/Deny Access to Routes
    ↓
Fetch User-Specific Data
```

### Product Management Flow
```
User Action (Add/Edit/Delete Product)
    ↓
Validate Input (Frontend)
    ↓
Call Firebase Service
    ↓
Firestore Write with Rules Check
    ↓
Cloud Function Trigger
    ↓
Update Inventory Movements
    ↓
Check Stock Levels
    ↓
Create Notifications if needed
    ↓
Update Redux State
    ↓
Update UI
```

### Real-time Updates
```
User A Makes Change
    ↓
Firestore Update
    ↓
Firestore Listener Triggers
    ↓
Update Redux State
    ↓
User B Sees Live Update
```

## Security Architecture

### Authentication Security
- Firebase Auth handles password hashing
- Custom claims for role-based access
- Session persistence with local storage
- Automatic token refresh

### Authorization (RBAC)
```javascript
Super Admin (Level 3)
├── View All Data
├── Create/Edit/Delete Users
├── Configure System
└── Access All Reports

Store Manager (Level 2)
├── Manage Products
├── Create Purchase Orders
├── View Sales
└── Access Store Reports

Staff (Level 1)
├── Record Sales
├── View Products
└── Basic Reporting
```

### Database Security
- Firestore Security Rules enforce RBAC
- Field-level access control
- Collection-level permissions
- Real-time rule validation

### Data Protection
- HTTPS encryption in transit
- At-rest encryption (Firebase default)
- Sensitive data field encryption
- Regular automated backups

## Scalability Considerations

### Horizontal Scaling
- Firebase auto-scales infrastructure
- CDN distributes static assets globally
- Firestore handles concurrent users
- Cloud Functions scale automatically

### Vertical Scaling
- Firestore Capacity Mode for predictable pricing
- Index optimization for query performance
- Cloud Storage regional distribution
- Caching at application level

### Performance Optimization
- Code splitting with React lazy loading
- Image optimization and CDN caching
- Firestore composite indexes
- Query optimization with where clauses
- Batch writes for bulk operations

## Disaster Recovery

### Backup Strategy
- Firestore automated backups (daily)
- Manual backup exports (weekly)
- Version control for code (Git)
- Environment variable backup

### Recovery Procedures
1. **Database Recovery**: Restore from backup
2. **Code Recovery**: Deploy previous version from Git
3. **User Data Recovery**: Restore from Firestore backups
4. **Configuration Recovery**: Re-deploy with env variables

## Monitoring & Observability

### Metrics Tracked
- Page load time (CWV metrics)
- API response time
- Firestore read/write operations
- Function execution time
- Error rates and logs
- User activity logs

### Alerts
- Firebase hosting down
- Firestore quota exceeded
- Function execution errors
- Authentication failures
- Database growth threshold

### Logging
- Application logs (Console)
- Firestore audit logs
- Cloud Function logs
- Activity logs (Application)
- Error reporting

## Cost Optimization

### Firebase Pricing Model
- **Auth**: Free up to 50k users
- **Firestore**: Pay per read/write/delete
- **Storage**: Pay per GB
- **Functions**: Free tier available
- **Hosting**: 10GB free storage, 360K free hosting

### Cost Reduction Strategies
- Composite indexes for efficient queries
- Scheduled data cleanup/archival
- Caching layer for frequently accessed data
- Batch operations instead of individual writes
- Optimize Cloud Function runtime
- Use Firestore cap on billing

## Deployment Pipeline

```
Development Branch
    ↓
npm run build
    ↓
npm run preview (QA)
    ↓
firebase deploy (staging)
    ↓
Test on staging
    ↓
Merge to main
    ↓
firebase deploy --prod
    ↓
Post-deployment verification
    ↓
Monitor production
```

## API Response Time Targets

| Operation | Target | Critical |
|-----------|--------|----------|
| Login | < 2s | 5s |
| Load Dashboard | < 2s | 5s |
| List Products | < 1s | 3s |
| Add Product | < 1s | 3s |
| Search Products | < 500ms | 2s |
| Get Reports | < 2s | 5s |
| Export Data | < 5s | 10s |

## Design Patterns Used

### State Management
- Redux for global state
- Context API for auth/theme
- Local component state for UI transients
- Firestore as source of truth

### API Design
- Service layer abstraction
- Error handling middleware
- Request/response validation
- Automatic retry logic

### UI Patterns
- Card-based layouts
- Modal dialogs for forms
- Table with filtering/search
- Real-time list updates
- Loading states

### Code Organization
- Feature-based folder structure
- Separation of concerns
- Reusable components
- Custom hooks
- Utility functions

## Future Architecture Improvements

1. **GraphQL API** for optimized data fetching
2. **Caching Layer** (Redis/In-memory)
3. **Message Queue** for async operations
4. **ML Models** for inventory forecasting
5. **Mobile Native App** with same backend
6. **Microservices** if scale requires
7. **Event-driven Architecture** with Pub/Sub
8. **Advanced Analytics** pipeline

---

**Architecture Version**: 1.0  
**Last Updated**: March 2024
