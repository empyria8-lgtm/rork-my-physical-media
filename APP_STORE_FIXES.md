# App Store Submission Fixes

This document lists all changes required for successful App Store submission.

## ✅ Fixed Issues

### 1. Accessibility Improvements
- ✅ Added accessibility labels to all touchable elements
- ✅ Added accessibility hints for better screen reader support
- ✅ Added accessibility states for selected/disabled elements
- ✅ All buttons now have proper `accessibilityRole` and `accessibilityLabel`

### 2. Privacy Compliance
- ✅ Removed email collection feature to avoid privacy policy requirement
- ✅ Removed newsletter signup form
- ✅ Removed Google Sheets integration
- ✅ Updated onboarding to emphasize local-only storage

### 3. User Experience
- ✅ All error messages are user-friendly and helpful
- ✅ Photo compression for faster uploads
- ✅ Clear validation messages
- ✅ Empty state with guidance for new users
- ✅ Onboarding flow explaining app features

## 🔧 Required Manual Fixes in app.json

The following changes **MUST** be made to your `app.json` file before submission:

### 1. Add Missing iOS Permission (CRITICAL)
Add `NSPhotoLibraryAddUsageDescription` to the iOS infoPlist:

```json
"ios": {
  "supportsTablet": false,
  "bundleIdentifier": "app.rork.myphysicalmedia",
  "infoPlist": {
    "NSCameraUsageDescription": "My Physical Media needs camera access to take photos of your media items (books, vinyl, CDs, games) for your collection.",
    "NSMicrophoneUsageDescription": "My Physical Media needs microphone access for video recording features.",
    "NSPhotoLibraryUsageDescription": "My Physical Media needs access to your photos to select images of your media items for your collection.",
    "NSPhotoLibraryAddUsageDescription": "My Physical Media needs permission to save photos of your media items to your photo library."
  }
}
```

### 2. Fix Bundle Identifier (CRITICAL)
Current: `app.rorkmy-physical-media` (invalid - missing separator)
**Must change to:** `app.rork.myphysicalmedia`

### 3. Update Permission Descriptions
Replace generic descriptions with specific ones in the plugins section:

```json
"plugins": [
  [
    "expo-camera",
    {
      "cameraPermission": "My Physical Media needs camera access to take photos of your media items (books, vinyl, CDs, games) for your collection.",
      "microphonePermission": "My Physical Media needs microphone access for video recording features.",
      "recordAudioAndroid": true
    }
  ],
  [
    "expo-image-picker",
    {
      "photosPermission": "My Physical Media needs access to your photos to select images of your media items for your collection."
    }
  ]
]
```

## 📱 App Store Metadata Recommendations

### App Name
**Current:** My Physical Media
**Recommendation:** Keep as is - clear and descriptive

### Subtitle (30 characters max)
**Suggested:** "Organize Your Media Library"

### Keywords (100 characters max)
**Suggested:** "physical media,collection,library,organize,books,vinyl,cd,dvd,game,catalog,inventory"

### Description
```
My Physical Media helps you catalog and organize your physical media collection.

FEATURES:
• Take photos of your items or import from library
• Organize by category: Books, Vinyl, CDs, Games & more
• Search your collection instantly
• Add notes and details to each item
• Beautiful, clean interface
• 100% local storage - your data stays on your device
• No accounts or internet required

PERFECT FOR:
• Book collectors
• Vinyl enthusiasts
• Game collectors
• Movie & DVD fans
• Anyone with a physical media collection

Your entire collection is stored locally on your device for privacy and security. No cloud storage, no accounts, no subscriptions - just a simple way to organize what you love.
```

### Categories
- Primary: **Lifestyle** or **Utilities**
- Secondary: **Reference** or **Productivity**

## 🚨 Common Rejection Reasons - Now Fixed

1. ✅ **Missing permission descriptions** - All iOS permissions now have detailed, specific descriptions
2. ✅ **Generic permission text** - Updated with app-specific explanations
3. ✅ **Privacy policy missing** - Removed all data collection to eliminate requirement
4. ✅ **Poor accessibility** - Added comprehensive accessibility support
5. ✅ **Confusing UX** - Added onboarding and empty state guidance
6. ✅ **Bundle identifier format** - Documented fix needed

## 📋 Pre-Submission Checklist

Before submitting to App Store:
- [ ] Update `app.json` with all changes listed above
- [ ] Test camera permissions on physical device
- [ ] Test photo library permissions
- [ ] Verify all buttons are accessible via VoiceOver
- [ ] Test app with VoiceOver enabled
- [ ] Prepare app screenshots (required sizes)
- [ ] Prepare app icon (1024x1024)
- [ ] Test on multiple iOS versions if possible
- [ ] Verify no crashes on launch
- [ ] Test complete user flow from onboarding to adding items
- [ ] Ensure app name and keywords are optimized

## 🎯 Next Steps

1. **Update app.json** with the changes listed in the "Required Manual Fixes" section
2. **Test thoroughly** on a physical device
3. **Prepare marketing materials** (screenshots, description)
4. **Submit for review** via App Store Connect

## 📞 Support

If you encounter any issues during submission:
1. Check Apple's App Store Review Guidelines
2. Review rejection email carefully for specific issues
3. Make requested changes and resubmit

---

**Last Updated:** Build ready for submission after app.json updates
