# Future-Ready Architecture

This document outlines how the app's data structure supports future features without breaking V1.

## ✅ Current V1 Implementation

### Guest-Only Local Storage
- All data stored locally in AsyncStorage
- No network dependency
- Fully functional offline
- Device-specific storage

### Data Structure (MediaItem)
```typescript
{
  id: string;              // Unique identifier
  title: string;           // Item title
  category: CategoryId;    // Category
  photoUri: string;        // Local file path
  notes?: string;          // Optional notes
  createdAt: string;       // Creation timestamp
  updatedAt: string;       // Last update timestamp
  
  // Sync-ready fields (already in place)
  localOnly: boolean;      // Currently true for all items
  syncStatus: 'synced' | 'pending' | 'conflict' | 'local';
  userId?: string;         // Reserved for future user accounts
  deviceId: string;        // Device identifier
  version: number;         // Conflict resolution
  deletedAt?: string;      // Soft delete for sync
}
```

## 🚀 Future Feature Support

### 1. User Accounts & Authentication

**What's Already Prepared:**
- `userId` field in MediaItem (optional, unused in V1)
- `AuthContext` with guest/authenticated modes
- `utils/migration.ts` for migrating guest data to user accounts

**When Adding User Accounts:**
```typescript
// Login flow will:
1. User logs in/signs up
2. Get userId from backend
3. Migrate existing guest data to user account
4. Update all items with userId
5. Mark items for cloud sync

// No data structure changes needed!
const migratedItems = migrateGuestDataOnLogin(guestItems, userId, deviceId);
```

**Migration Utilities Available:**
- `migrateGuestDataToUser()` - Assigns userId to all guest items
- `backupGuestData()` - Creates safety backup before migration
- `getMigrationStatus()` - Track migration progress
- `getGuestDataBackup()` - Recover if migration fails

### 2. Cloud Sync

**What's Already Prepared:**
- `syncStatus` field tracking sync state
- `version` field for conflict resolution
- `updatedAt` for timestamp comparison
- `deletedAt` for soft deletes
- `deviceId` for multi-device sync
- `utils/sync.ts` with sync utilities

**New Fields Added for Future Use:**
```typescript
{
  cloudStorageUrl?: string;    // Cloud URL after upload
  thumbnailUrl?: string;       // Cloud thumbnail URL
  originalFileName?: string;   // Original file name
  fileSize?: number;           // File size in bytes
  mimeType?: string;           // MIME type
}
```

**Sync Utilities Available:**
- `prepareItemsForSync()` - Filter items needing sync
- `mergeItems()` - Merge local and remote changes
- `markItemsAsSynced()` - Update after successful sync
- `getLastSyncTimestamp()` - Track last sync time

**Sync Strategy:**
```typescript
// When cloud sync is enabled:
1. Upload local items to cloud
2. Get cloudStorageUrl from backend
3. Update items with cloud URLs
4. Mark as synced
5. Handle conflicts using version numbers
6. Keep local copies for offline access
```

### 3. Social Sharing

**New Fields Added:**
```typescript
{
  sharedWith?: string[];       // User IDs with access
  shareToken?: string;         // Public share token
  isPublic?: boolean;          // Public vs private share
}
```

**Sharing Utilities Available:**
- `shareItem()` - Generate share link
- `prepareItemForSharing()` - Add sharing metadata
- `generateShareToken()` - Create secure token
- `revokeSharing()` - Remove sharing access
- `canUserAccessItem()` - Check permissions
- `filterSharedItems()` - Filter by access

**Sharing Strategy:**
```typescript
// Public sharing:
const { shareUrl, shareToken } = await shareItem(item, {
  isPublic: true,
});
// Returns: https://app.example.com/shared/{token}

// Private sharing:
const { shareUrl } = await shareItem(item, {
  isPublic: false,
  sharedWith: ['user-123', 'user-456'],
});
```

### 4. Backups

**New Fields Added:**
```typescript
{
  backupStatus?: 'none' | 'queued' | 'backing-up' | 'backed-up' | 'failed';
  lastBackupAt?: string;       // Last successful backup
}
```

**Backup Utilities Available:**
- `createLocalBackup()` - Full local backup
- `restoreFromLocalBackup()` - Restore from backup
- `prepareExportData()` - Export as JSON
- `importData()` - Import from JSON
- `getBackupMetadata()` - Backup statistics
- `updateBackupMetadata()` - Track backup info

**Backup Strategy:**
```typescript
// Local backup (V1):
await createLocalBackup(items);

// Future cloud backup:
1. Mark items as 'queued'
2. Upload to cloud storage
3. Update with 'backed-up' status
4. Record lastBackupAt timestamp

// Export/Import:
const json = await prepareExportData(items);
// User can save/share this file
const imported = await importData(json);
```

### 5. Enhanced Metadata

**New Fields Added:**
```typescript
{
  tags?: string[];             // Custom tags
  location?: {                 // Geolocation
    latitude: number;
    longitude: number;
    address?: string;
  };
  metadata?: {                 // Rich metadata
    width?: number;
    height?: number;
    duration?: number;
    exif?: Record<string, any>;
  };
}
```

**Future Features Enabled:**
- Tag-based filtering and search
- Location-based organization
- Map view of items
- Image dimensions for layouts
- Video duration display
- EXIF data preservation

## 🔄 Migration Path: Guest → Authenticated User

### Step-by-Step Process

1. **User Clicks "Sign Up" or "Login"**
```typescript
const { loginWithAccount } = useAuth();
await loginWithAccount(userId);
```

2. **Automatic Data Migration**
```typescript
// Happens automatically in background:
const guestItems = await loadMediaItems();
const migratedItems = await migrateGuestDataOnLogin(
  guestItems,
  userId,
  deviceId
);
```

3. **Items Updated With User Info**
```typescript
// Each item now has:
{
  ...existingData,
  userId: 'user-123',
  syncStatus: 'pending',  // Ready for cloud sync
  version: version + 1,
  updatedAt: new Date().toISOString(),
}
```

4. **Backup Created (Safety Net)**
```typescript
// Guest data backed up before migration
const backup = await getGuestDataBackup();
// Can restore if something goes wrong
```

5. **Ready for Cloud Sync**
```typescript
// All items marked as 'pending' will sync on next opportunity
const itemsToSync = prepareItemsForSync(migratedItems);
// Send to backend API (when implemented)
```

## 🎯 Zero Breaking Changes

### Why This Works

1. **Optional Fields**
   - All new fields are optional (`?`)
   - Existing code continues working
   - New features add data incrementally

2. **Backward Compatible**
   - V1 items work without new fields
   - Default values handle missing data
   - Graceful degradation

3. **Progressive Enhancement**
   - Features activate as fields populate
   - No flag day required
   - Smooth user experience

4. **Type Safety**
   - TypeScript ensures correct usage
   - Compiler catches breaking changes
   - Refactoring is safe

### Example: Adding Cloud Sync

```typescript
// V1 code (still works):
const items = useMediaContext().items;

// V2 code (cloud sync added):
const items = useMediaContext().items;
// Same code! But items now have:
// - cloudStorageUrl
// - syncStatus = 'synced'
// - userId populated

// Display cloud-synced indicator:
{item.cloudStorageUrl && <CloudIcon />}

// Fallback to local if offline:
const imageUri = item.cloudStorageUrl || item.photoUri;
```

## 📊 Data Flow Scenarios

### Scenario 1: Guest User (V1)
```
User creates item
  ↓
Save to AsyncStorage with:
  - localOnly: true
  - syncStatus: 'local'
  - userId: undefined
  ↓
Item stored on device only
```

### Scenario 2: User Logs In (Future)
```
Guest user logs in
  ↓
Migrate all items:
  - Add userId
  - Set syncStatus: 'pending'
  - Increment version
  ↓
Backup guest data (safety)
  ↓
Ready for cloud sync
```

### Scenario 3: Cloud Sync Active (Future)
```
User creates item
  ↓
Save locally immediately
  - syncStatus: 'pending'
  ↓
Upload to cloud in background
  ↓
Update with cloudStorageUrl
  - syncStatus: 'synced'
  - localOnly: false
  ↓
Works offline (local copy)
Works online (cloud copy)
```

### Scenario 4: Multi-Device Sync (Future)
```
Device A creates item
  ↓
Sync to cloud (version: 1)
  ↓
Device B downloads item
  ↓
Device B edits item (version: 2)
  ↓
Device A syncs changes
  ↓
Conflict resolved by version number
```

## 🛡️ Data Integrity Guarantees

1. **No Data Loss**
   - Guest data backed up before migration
   - Local copies retained after cloud sync
   - Soft deletes preserve history

2. **Conflict Resolution**
   - Version numbers for conflict detection
   - Timestamp-based tie-breaking
   - User can review conflicts (future)

3. **Offline First**
   - All operations work offline
   - Sync happens opportunistically
   - Queue mechanism for pending changes

4. **Recovery Options**
   - Local backups
   - Cloud backups (future)
   - Export/import functionality
   - Guest data recovery

## 📝 Implementation Checklist for Future Features

### When Adding User Accounts:
- [ ] Implement authentication API
- [ ] Call `migrateGuestDataOnLogin()` after login
- [ ] Update UI to show account status
- [ ] Add account settings screen
- [ ] Test migration flow thoroughly

### When Adding Cloud Sync:
- [ ] Set up cloud storage (Firebase/S3/etc)
- [ ] Implement upload/download API
- [ ] Use `prepareItemsForSync()` to get pending items
- [ ] Use `mergeItems()` for conflict resolution
- [ ] Update items with `cloudStorageUrl`
- [ ] Test offline/online transitions

### When Adding Social Sharing:
- [ ] Create share endpoint on backend
- [ ] Use `shareItem()` to generate links
- [ ] Implement share token validation
- [ ] Add share UI components
- [ ] Handle permissions with `canUserAccessItem()`

### When Adding Backups:
- [ ] Use `createLocalBackup()` for auto-backup
- [ ] Implement cloud backup service
- [ ] Add export/import UI
- [ ] Test restore functionality
- [ ] Add backup status indicators

## 🎓 Summary

The app is fully prepared for future expansion:

✅ **Data structure** includes all necessary fields
✅ **Utilities** are ready for migration, sync, sharing, backup
✅ **Zero breaking changes** to V1 code
✅ **Type-safe** with TypeScript
✅ **Offline-first** architecture maintained
✅ **Guest data** seamlessly migrates to user accounts
✅ **Conflict resolution** strategy in place
✅ **Backup safety nets** implemented

When you're ready to add these features, the foundation is solid and waiting!
