# Security Features & Configuration Guide

This guide outlines security practices and database schema validation rules configured for the TaskFlow application to prevent unauthorized data access and data corruption.

---

## 1. Schema-Validated Firestore Security Rules

To prevent corrupted or malicious documents (e.g. text instead of number, negative amounts) from being written to your database, you should configure schema validation rules.

Replace your rules in the Firebase console with the following code:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if the client is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if the authenticated user matches the owner ID of the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Validation rules for Transactions
    match /transactions/{documentId} {
      allow read: if isAuthenticated() && (resource == null || isOwner(resource.data.userId));
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
      
      allow create, update: if isAuthenticated() 
        && isOwner(request.resource.data.userId)
        && request.resource.data.amount is number
        && request.resource.data.amount > 0
        && request.resource.data.type in ['income', 'expense']
        && request.resource.data.category is string
        && request.resource.data.date is string
        && (!request.resource.data.keys().contains('description') || request.resource.data.description is string);
    }

    // Validation rules for Bills
    match /bills/{documentId} {
      allow read: if isAuthenticated() && (resource == null || isOwner(resource.data.userId));
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
      
      allow create, update: if isAuthenticated() 
        && isOwner(request.resource.data.userId)
        && request.resource.data.amount is number
        && request.resource.data.amount >= 0
        && request.resource.data.status in ['pending', 'in-progress', 'done']
        && request.resource.data.priority in ['low', 'medium', 'high']
        && request.resource.data.title is string
        && request.resource.data.dueDate is string;
    }

    // Validation rules for Wants
    match /wants/{documentId} {
      allow read: if isAuthenticated() && (resource == null || isOwner(resource.data.userId));
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
      
      allow create, update: if isAuthenticated() 
        && isOwner(request.resource.data.userId)
        && request.resource.data.amount is number
        && request.resource.data.amount >= 0
        && request.resource.data.status in ['wanted', 'bought']
        && request.resource.data.priority in ['low', 'medium', 'high']
        && request.resource.data.title is string;
    }
  }
}
```

---

## 2. Firebase Console Security Configurations

Ensure the following settings are configured on your Firebase dashboard to lock down your credentials:

### A. Authorized Domains Restrictions
Since frontend clients carry the Firebase API key in plaintext, prevent other domains from spoofing your project:
1. Go to **Authentication -> Settings -> Authorized Domains**.
2. Restrict the active list to only `localhost` and your hosting domain `taskflow-5c04d.web.app`.

### B. Email Enumeration Protection
1. Go to **Authentication -> Settings -> User Actions**.
2. Enable **Email enumeration protection** to enforce standardized generic auth errors.

---

## 3. Client-Side Coding Precautions
* **JSX Escaping**: React inherently escapes variables inside curly braces `{}` before rendering them, mitigating Cross-Site Scripting (XSS) injection vectors.
* Avoid raw HTML bypasses like `dangerouslySetInnerHTML` on any user-submitted strings.
