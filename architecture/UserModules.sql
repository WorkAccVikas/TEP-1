-- UserHierarchies: Represents hierarchical relationships between users (e.g., vendors and drivers)
CREATE TABLE
    UserHierarchies (
        parentId UUID REFERENCES Users (userId), -- Parent user
        childId UUID REFERENCES Users (userId), -- Sub-user
        path TEXT, -- Path for hierarchy traversal (e.g., '/admin/vendor/driver')
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Track hierarchy creation date
        PRIMARY KEY (parentId, childId)
    );

-- Optional: Indexing parent-child pairs for faster lookups
CREATE INDEX idx_user_hierarchies_parentId ON UserHierarchies (parentId);

CREATE INDEX idx_user_hierarchies_childId ON UserHierarchies (childId);

-- Revised Users table with direct reference to UserSubscriptions for clarity
CREATE TABLE
    Users (
        userId UUID PRIMARY KEY, -- Unique identifier
        parentUserId UUID REFERENCES Users (userId), -- Parent user (optional)
        userTypeId UUID REFERENCES UserTypes (typeId), -- Foreign key to UserTypes
        firstName VARCHAR NOT NULL,
        lastName VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        phone VARCHAR,
        role VARCHAR CHECK (
            role IN ('admin', 'vendor', 'driver', 'user', 'self')
        ) NOT NULL,
        subscriptionId UUID REFERENCES UserSubscriptions (userSubscriptionId), -- Reference to the active subscription
        companyId UUID REFERENCES Companies (companyId), -- Associated company
        language VARCHAR DEFAULT 'en', -- User's preferred language
        timezone VARCHAR DEFAULT 'UTC', -- User's preferred timezone
        deletedAt TIMESTAMP, -- Soft delete column
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- UserSubscriptions: Tracks user subscriptions to different plans
-- UserSubscriptions: Add support for renewal and auto-renewal
CREATE TABLE
    UserSubscriptions (
        userSubscriptionId UUID PRIMARY KEY,
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- User subscribing
        subscriptionId UUID REFERENCES Subscriptions (subscriptionId), -- Subscription plan
        startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Start date of subscription
        endDate TIMESTAMP, -- End date (NULL if ongoing)
        renewalDate TIMESTAMP, -- Renewal date (for auto-renewal logic)
        isActive BOOLEAN DEFAULT TRUE, -- Whether the subscription is active
        autoRenew BOOLEAN DEFAULT FALSE, -- Flag for auto-renewal
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Feature Toggles: Enables dynamic feature activation
CREATE TABLE
    FeatureToggles (
        toggleId UUID PRIMARY KEY,
        featureName VARCHAR NOT NULL, -- Name of the feature
        isEnabled BOOLEAN DEFAULT TRUE, -- Whether the feature is enabled
        description TEXT, -- Description of the feature
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Subscriptions: Defines available subscription plans
CREATE TABLE
    Subscriptions (
        subscriptionId UUID PRIMARY KEY, -- Unique subscription ID
        planName VARCHAR NOT NULL, -- Name of the plan (e.g., 'Basic', 'Premium')
        price DECIMAL(10, 2) NOT NULL, -- Monthly/annual price
        version INT DEFAULT 1, -- Versioning for subscription plans
        features JSONB, -- JSON of features/permissions included in the plan
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Subscriptions_Features: Maps Features to Subscriptions
CREATE TABLE
    Subscriptions_Features (
        subscriptionId UUID NOT NULL REFERENCES Subscriptions (subscriptionId) ON DELETE CASCADE,
        toggleId UUID NOT NULL REFERENCES FeatureToggles (toggleId) ON DELETE CASCADE,
        PRIMARY KEY (subscriptionId, toggleId)
    );

-- UserTypes: Stores user type details with associated permissions
CREATE TABLE
    UserTypes (
        typeId UUID PRIMARY KEY, -- Unique type ID
        typeName VARCHAR NOT NULL, -- Name of the user type (e.g., 'Admin', 'Driver', 'Vendor')
        typeCategory VARCHAR CHECK (typeCategory IN ('role', 'permissions', 'status')), -- Type of categorization (e.g., based on role, permissions, or status)
        description TEXT, -- Optional description of the user type
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the type was created
    );

-- Permissions: Defines available permissions for features in the system
CREATE TABLE
    Permissions (
        permissionId UUID PRIMARY KEY, -- Unique permission ID
        permissionName VARCHAR NOT NULL, -- Name of the permission (e.g., 'Manage Drivers')
        featureName VARCHAR, -- Optional: Feature this permission is tied to
        description TEXT, -- Description of the permission
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- RolePermissions: Defines role-specific permissions
CREATE TABLE
    RolePermissions (
        roleId UUID REFERENCES UserTypes (typeId) ON DELETE CASCADE,
        permissionId UUID REFERENCES Permissions (permissionId) ON DELETE CASCADE,
        PRIMARY KEY (roleId, permissionId)
    );

-- UserTypePermissions: Defines default permissions for each user type
CREATE TABLE
    UserTypePermissions (
        userTypeId UUID REFERENCES UserTypes (typeId) ON DELETE CASCADE, -- Foreign key to UserTypes
        permissionId UUID REFERENCES Permissions (permissionId) ON DELETE CASCADE, -- Foreign key to Permissions
        PRIMARY KEY (userTypeId, permissionId) -- Composite primary key
    );

-- AuditLogs: Logs user actions for tracking and compliance
CREATE TABLE
    AuditLogs (
        logId UUID PRIMARY KEY,
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- User performing the action
        action VARCHAR NOT NULL, -- Description of the action
        metadata JSONB, -- Optional data related to the action
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- ActivityLogs: Tracks user activity for analytics purposes
CREATE TABLE
    ActivityLogs (
        activityLogId UUID PRIMARY KEY,
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- User performing the activity
        activityType VARCHAR NOT NULL, -- Type of activity (e.g., 'Login', 'Subscription Upgrade')
        details JSONB, -- Additional details related to the activity
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );