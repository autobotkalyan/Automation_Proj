# Chase.com Website - Comprehensive Test Plan

## Executive Summary

This test plan covers the Chase.com website, a major financial services platform offering banking, credit cards, mortgages, auto loans, and investment products. The testing focuses on homepage functionality, credit cards marketplace, navigation, authentication, and user workflows.

### Key Areas Tested:
- Homepage navigation and structure
- Sign-in authentication widget
- Credit cards marketplace (creditcards.chase.com)
- Product catalog and card comparisons
- Navigation menus and dropdowns
- Mobile responsiveness
- Footer links and legal information

### Test Environment:
- **Base URL**: https://www.chase.com/
- **Credit Cards URL**: https://creditcards.chase.com/
- **Browser Support**: Chromium, Firefox, WebKit
- **Framework**: Playwright
- **Starting State**: Fresh browser session, no cached data

---

## Test Scenarios

### 1. Homepage Functionality

#### 1.1 Homepage Loads Successfully
**Steps:**
1. Navigate to https://www.chase.com/
2. Wait for page to fully load

**Expected Results:**
- Page loads with status 200
- Page title: "Credit Card, Mortgage, Banking, Auto | Chase Online | Chase.com"
- Main heading "Chase home page" visible
- Sign-in widget loads
- Navigation menu displays correctly

#### 1.2 Customer Type Navigation
**Steps:**
1. Navigate to homepage
2. Locate customer type tabs (Personal/Business/Commercial)
3. Verify "Personal" is selected by default
4. Click "Business" link

**Expected Results:**
- Three customer types visible: Personal, Business, Commercial
- "Personal" marked as "current product"
- Business link navigates to /business
- Commercial link opens https://www.jpmorgan.com/commercial-banking

#### 1.3 Main Navigation Menu Items
**Steps:**
1. Verify all main navigation items are present
2. Count the number of menu items

**Expected Results:**
- Menu includes: Checking, Savings & CDs, Credit cards, Home loans, Auto, Investing by J.P. Morgan, Education & goals, Travel
- All menu items are clickable
- Proper spacing and alignment

#### 1.4 Utility Navigation
**Steps:**
1. Locate utility navigation in top right
2. Verify all utility links

**Expected Results:**
- "Schedule a meeting" link present
- "Customer service" dropdown available
- "Español" language toggle visible
- "Search" functionality accessible

---

### 2. Sign-In Widget

#### 2.1 Sign-In Widget Display
**Steps:**
1. Navigate to homepage
2. Wait 3 seconds for widget to load
3. Verify all form elements

**Expected Results:**
- Heading "Welcome" displayed
- Username textbox present (empty)
- Password textbox present (empty)
- "Show Password" button available
- "Remember me" checkbox present
- "Use token" link available
- "Sign in" button enabled
- "Forgot username/password?" link present
- "Not Enrolled? Sign Up Now." link present

#### 2.2 Password Show/Hide Toggle
**Steps:**
1. Enter text in password field
2. Click "Show Password" button
3. Verify password becomes visible
4. Click button again to hide

**Expected Results:**
- Password initially masked
- Clicking "Show" reveals password text
- Button toggles between "Show" and "Hide"
- Password can be toggled on/off multiple times

#### 2.3 Invalid Login Attempt
**Steps:**
1. Enter invalid username
2. Enter invalid password
3. Click "Sign in" button
4. Observe error handling

**Expected Results:**
- Error message displayed (may vary due to anti-bot detection)
- Form remains accessible for retry
- Username and password fields still present
- No successful authentication occurs

---

### 3. Credit Cards Navigation

#### 3.1 Access Credit Cards Menu
**Steps:**
1. Navigate to homepage
2. Click "Credit cards" menu item
3. Verify dropdown expands

**Expected Results:**
- Menu expands showing options
- "Explore credit cards" option visible
- "See if you're pre-approved" option visible
- "Personal credit cards" option visible
- "Business credit cards" option visible

#### 3.2 Navigate to Credit Cards Marketplace
**Steps:**
1. Click "Credit cards" menu
2. Click "Explore credit cards"
3. Wait for page to load

**Expected Results:**
- Page navigates to https://creditcards.chase.com/
- Page title: "Credit Cards - Compare Credit Card Offers and Apply Online | Chase"
- Hero carousel visible
- Product sections load

---

### 4. Credit Cards Marketplace

#### 4.1 Marketplace Homepage Structure
**Steps:**
1. Navigate to https://creditcards.chase.com/
2. Verify page structure and sections

**Expected Results:**
- Header with Chase Credit Cards logo
- "Sign in" link in header
- Navigation bar with: All Cards, Check for Offers, Card Finder, Card Categories, Card Brands
- Hero carousel with promotional offers
- Three main sections:
  - "Our Most Popular Rewards Cards"
  - "Our Most Popular Travel Cards"
  - "Our Most Popular Business Cards"
- "Help Me Choose" section
- "Just browsing?" section
- Footer with links

#### 4.2 Hero Carousel Functionality
**Steps:**
1. Observe hero carousel on marketplace homepage
2. Verify carousel contains promotional slides
3. Test pause/play buttons

**Expected Results:**
- Carousel displays promotional offers
- Auto-rotates between slides
- Pause button stops rotation
- Play button resumes rotation
- Slide indicators show current position

#### 4.3 Rewards Cards Section
**Steps:**
1. Scroll to "Our Most Popular Rewards Cards"
2. Verify cards displayed

**Expected Results:**
- Section heading visible
- "View all Rewards Cards" link present
- Three cards displayed:
  1. Chase Sapphire Preferred® (with "NEW OFFER" badge)
  2. Chase Freedom Unlimited®
  3. Chase Freedom Flex®
- Each card shows:
  - Card image
  - Card name with proper trademark symbols
  - Bonus offer (e.g., "Earn 75,000 bonus points")
  - Key benefits (3 bullet points)
  - Annual fee information
  - "Apply Now" button
  - "See details" link
  - Compare checkbox

#### 4.4 Travel Cards Section
**Steps:**
1. Scroll to "Our Most Popular Travel Cards"
2. Verify cards displayed

**Expected Results:**
- Section heading visible
- "View all Travel Cards" link present
- Three cards displayed:
  1. The New Chase Sapphire Reserve®
  2. Marriott Bonvoy Boundless®
  3. Southwest Rapid Rewards® Plus (with "LIMITED-TIME OFFER" badge)
- Each card includes complete information
- Travel-specific benefits highlighted

#### 4.5 Business Cards Section
**Steps:**
1. Scroll to "Our Most Popular Business Cards"
2. Verify cards displayed

**Expected Results:**
- Section heading visible
- "View all Business Cards" link present
- Three cards displayed:
  1. The New Sapphire Reserve For Business℠ (with "NEW OFFER EXTENDED" badge)
  2. Ink Business Preferred®
  3. Ink Business Unlimited®
- Business-specific benefits shown
- Compare checkbox labeled "Business Card"

#### 4.6 Card Application Flow
**Steps:**
1. Select any credit card
2. Click "Apply Now" button
3. Verify new window opens

**Expected Results:**
- Button opens application in new window
- URL navigates to secure.chase.com/web/oao/application/card
- Application form loads
- Secure HTTPS connection maintained

#### 4.7 Card Details Navigation
**Steps:**
1. Select any credit card
2. Click "See details" link
3. Verify product page loads

**Expected Results:**
- Link opens product detail page
- URL includes card-specific path
- Comprehensive card information displayed
- Page includes benefits, terms, fees, rewards structure

#### 4.8 Card Comparison Functionality
**Steps:**
1. Select compare checkboxes for 2-3 cards
2. Verify comparison state

**Expected Results:**
- Checkboxes toggle between empty and checked
- Each checkbox labeled with card type (Personal/Business)
- Cannot compare Personal and Business cards together
- Question mark (?) button provides help tooltip

---

### 5. Navigation Dropdowns

#### 5.1 Card Categories Dropdown
**Steps:**
1. On creditcards.chase.com
2. Click "Card Categories" button
3. Verify dropdown contents

**Expected Results:**
- Dropdown displays complete list:
  - Featured Cards (9)
  - All Cards (40)
  - Newest Offers (11)
  - Business (11)
  - Travel (31)
  - Cash Back (10)
  - No Annual Fee (14)
  - Airline (15)
  - Hotel (10)
  - Rewards (39)
  - Dining (12)
  - Refer-A-Friend (10)
  - Balance Transfer (3)
  - New to Credit
  - Check for Offers
- Each shows card count
- All links functional

#### 5.2 Card Brands Dropdown
**Steps:**
1. On creditcards.chase.com
2. Click "Card Brands" button
3. Review available brands

**Expected Results:**
- Dropdown displays all brands:
  - Chase Sapphire® (3)
  - Chase Freedom® (3)
  - Slate Edge
  - Southwest (5)
  - United (6)
  - Marriott Bonvoy® (3)
  - Avios (3)
  - Disney® (2)
  - IHG® (3)
  - World of Hyatt (2)
  - Chase for Business (5)
  - Amazon (2)
  - Aeroplan
  - DoorDash
  - Instacart
- Trademark symbols display correctly
- All links clickable

---

### 6. "Help Me Choose" Section

#### 6.1 Help Me Choose Display
**Steps:**
1. Navigate to creditcards.chase.com
2. Scroll to "HELP ME CHOOSE" section
3. Verify content

**Expected Results:**
- Heading "HELP ME CHOOSE" visible
- Subheadings:
  - "Choosing a credit card can be confusing."
  - "Chase can help."
- Question: "What type of card are you looking for?"
- Two buttons: Personal and Business
- Visual icons differentiate card types

#### 6.2 Personal Card Selection
**Steps:**
1. Click "Personal" button in Help Me Choose
2. Verify navigation

**Expected Results:**
- Navigates to /card-finder?cfb=1
- Card finder opens with Personal filter selected
- Tracking parameters included

#### 6.3 Business Card Selection
**Steps:**
1. Click "Business" button in Help Me Choose
2. Verify navigation

**Expected Results:**
- Navigates to /card-finder?cfb=25
- Card finder opens with Business filter selected
- Tracking parameters included

---

### 7. "Just Browsing" Section

#### 7.1 Just Browsing Display
**Steps:**
1. Scroll to "Just browsing?" section
2. Review content

**Expected Results:**
- Image/icon displays
- Heading "Just browsing?" visible
- Description: "See our full range of credit card offerings here."
- "Explore all cards" button present

#### 7.2 Explore All Cards
**Steps:**
1. Click "Explore all cards" button
2. Verify navigation

**Expected Results:**
- Navigates to /all-credit-cards
- All cards catalog page loads
- Complete list of 40+ cards displays

---

### 8. Footer Information

#### 8.1 Footer Credit Card Links
**Steps:**
1. Scroll to footer
2. Review "Credit Cards" section

**Expected Results:**
- Section titled "Credit Cards"
- Links to all major categories:
  - Featured Cards, All Cards, Newest Offers, Cash Back, Balance Transfer, Travel, Business, Rewards, Airline, Hotel, Dining, No Annual Fee, No Foreign Transaction Fee, 0% Intro APR, Visa, MasterCard, EMV Cards with Chip, Refer-A-Friend, Check for Offers
- Each link navigates correctly

#### 8.2 Footer More Chase Products
**Steps:**
1. Review "More Chase Products" section
2. Test links

**Expected Results:**
- Links to:
  - Credit Journey
  - Checking Accounts
  - Saving Accounts
  - Certificates of Deposits
  - Mortgages
  - Auto Loans
  - Planning & Investments
- All links open in new window

#### 8.3 Footer Resources
**Steps:**
1. Review "Resources" section
2. Test navigation

**Expected Results:**
- Links to:
  - Online Banking
  - Mobile Banking
  - Cardmember agreements
  - Credit card news
  - Credit Card Glossary
  - Ultimate Rewards®
  - FAQ
  - Credit Card Education
  - Schedule a meeting
- All links functional

#### 8.4 Social Media Links
**Steps:**
1. Locate social media icons
2. Verify all platforms

**Expected Results:**
- "Follow us:" text present
- Icons for: Facebook, Instagram, Twitter (X), YouTube, LinkedIn, Pinterest
- Each icon clickable
- Links to Chase official pages

#### 8.5 Legal Footer Links
**Steps:**
1. Review legal footer
2. Test links

**Expected Results:**
- Links include:
  - About Chase
  - J.P. Morgan
  - JPMorgan Chase & Co.
  - Careers
  - Privacy
  - Security
  - Terms of use
  - Accessibility
  - Site map
  - AdChoices
- All links functional

#### 8.6 Copyright and FDIC Information
**Steps:**
1. Review bottom of footer
2. Verify compliance information

**Expected Results:**
- Copyright: "© 2025 JPMorgan Chase & Co."
- "Member FDIC" text displayed
- Equal Housing Opportunity logo and text
- All compliance badges visible

---

### 9. Mobile Navigation

#### 9.1 Hamburger Menu
**Steps:**
1. Resize viewport to mobile width or use mobile device
2. Locate hamburger menu icon
3. Click to open

**Expected Results:**
- Hamburger menu icon visible in mobile view
- Clicking opens side menu
- Menu slides in from left or overlays page
- Close button (X) visible

#### 9.2 Mobile Menu Contents
**Steps:**
1. Open hamburger menu
2. Review menu structure

**Expected Results:**
- "Skip to main content" link
- "Skip Side Menu" link
- Navigation items organized by category
- All links accessible
- Menu scrollable if needed

---

### 10. Special Offers and Promotions

#### 10.1 Promotional Badges
**Steps:**
1. Review card listings
2. Identify special offer badges

**Expected Results:**
- Badges display on applicable cards:
  - "NEW OFFER"
  - "NEW OFFER EXTENDED"
  - "LIMITED-TIME OFFER"
- Badges visually distinct
- Positioned prominently on card

#### 10.2 Pre-Approval Offers
**Steps:**
1. Locate pre-approval promotional content
2. Click "Get started" button

**Expected Results:**
- Pre-approval messaging clear
- "Click here to see if you have a pre-approved offer available – with no impact to your credit score"
- Button opens secure application page
- New window maintains security

#### 10.3 Bonus Points with Strikethrough
**Steps:**
1. Review card offers
2. Locate increased bonus offers

**Expected Results:**
- Original amount shown with strikethrough
- Example: "Earn 60,000 ~~strikethrough~~ 75,000 bonus points"
- New amount emphasized
- Visually clear value increase

---

### 11. Accessibility

#### 11.1 Skip Links
**Steps:**
1. Navigate to page
2. Press Tab key
3. Verify skip links appear

**Expected Results:**
- "Skip to main content" link appears first
- "Skip Side Menu" link available where applicable
- Links visible when focused
- Pressing Enter jumps to target

#### 11.2 Keyboard Navigation
**Steps:**
1. Navigate page using only keyboard
2. Tab through all interactive elements

**Expected Results:**
- Tab moves through all links, buttons, form fields
- Focus indicator visible on current element
- Tab order logical (top to bottom, left to right)
- All interactive elements reachable

#### 11.3 Screen Reader Labels
**Steps:**
1. Use screen reader to navigate
2. Verify proper announcements

**Expected Results:**
- Images have alt text
- Links announce destination
- Buttons announce action
- Form fields have proper labels
- Landmark roles properly used

---

### 12. Performance

#### 12.1 Page Load Time
**Steps:**
1. Clear cache
2. Navigate to homepage
3. Measure load time

**Expected Results:**
- Page loads in under 3 seconds on broadband
- First Contentful Paint under 1.5 seconds
- No blocking resources

#### 12.2 Image Loading
**Steps:**
1. Navigate to credit cards marketplace
2. Observe card images loading

**Expected Results:**
- Images load progressively
- No broken image links
- Proper image optimization
- Lazy loading for below-fold content

---

### 13. Security

#### 13.1 HTTPS Connection
**Steps:**
1. Navigate to any page
2. Verify secure connection

**Expected Results:**
- All pages load via HTTPS
- SSL certificate valid
- No mixed content warnings
- Padlock icon shows in browser

#### 13.2 Privacy Policy
**Steps:**
1. Locate Privacy link in footer
2. Click to open
3. Review policy page

**Expected Results:**
- Privacy link easily accessible
- Policy page loads
- Clear data handling practices described
- Contact information provided

---

### 14. Cross-Browser Compatibility

#### 14.1 Chrome/Chromium
**Steps:**
1. Open site in Chrome
2. Test core functionality

**Expected Results:**
- All features work correctly
- No console errors
- Proper rendering

#### 14.2 Firefox
**Steps:**
1. Open site in Firefox
2. Test core functionality

**Expected Results:**
- All features work correctly
- Consistent with Chrome experience
- No Firefox-specific issues

#### 14.3 Safari/WebKit
**Steps:**
1. Open site in Safari
2. Test core functionality

**Expected Results:**
- All features work correctly
- WebKit-specific CSS applied properly
- No Safari-specific issues

---

## Test Execution Guidelines

### Prerequisites
- Playwright installed (latest version)
- Node.js v16+
- Test environment configured
- Network access to chase.com
- No VPN/proxy that triggers anti-bot detection

### Test Execution
- Run tests in headed mode for visual verification
- Use headless mode for CI/CD
- Execute across all browsers (Chromium, Firefox, WebKit)
- Configure reasonable timeouts (30-60s for page loads)
- Use proper waits (waitForSelector, waitForLoadState)

### Anti-Bot Detection
Chase.com implements bot detection that may show alternative error pages during automated testing. Tests should handle multiple valid outcomes:
- Standard expected behavior
- "Site isn't working" error page
- Rate limiting messages

### Reporting
- Capture screenshots on failure
- Log network requests for debugging
- Generate HTML reports
- Track test execution time

---

## Priority Matrix

### P0 - Critical (Must Pass)
- Homepage loads successfully
- Sign-in widget displays correctly
- Credit cards marketplace loads
- Card application flow initiates
- Navigation menus function
- HTTPS security maintained

### P1 - High (Should Pass)
- All card sections display correctly
- Compare functionality works
- "Help Me Choose" navigation
- Footer links functional
- Mobile menu works

### P2 - Medium (Nice to Have)
- Hero carousel auto-rotation
- Promotional badges display
- Social media links work
- Keyboard navigation smooth

### P3 - Low (Optional)
- Performance optimizations
- Minor visual elements
- Tracking parameters present

---

## Known Issues

1. **Anti-Bot Detection**: Chase may trigger bot detection during automated testing, showing different error pages. This is expected behavior.

2. **Dynamic Content**: Hero carousel and promotional offers change regularly. Tests should be flexible to accommodate content updates.

3. **Session Management**: Some features require authentication and cannot be fully tested without valid credentials.

---

## Test Coverage Summary

**Total Scenarios**: 50+ detailed test scenarios

**Coverage Areas**:
- ✅ Homepage navigation
- ✅ Authentication widget
- ✅ Credit cards marketplace
- ✅ Product catalog
- ✅ Card comparison
- ✅ Navigation dropdowns
- ✅ Footer links
- ✅ Mobile responsiveness
- ✅ Accessibility
- ✅ Security
- ✅ Cross-browser compatibility

---

## Appendix: Key URLs

### Main Pages
- Homepage: https://www.chase.com/
- Credit Cards: https://creditcards.chase.com/
- Secure Login: https://secure.chase.com/web/auth/
- Commercial Banking: https://www.jpmorgan.com/commercial-banking

### Card Categories
- All Cards: https://creditcards.chase.com/all-credit-cards
- Newest Offers: https://creditcards.chase.com/newest-offers-credit-cards
- Rewards: https://creditcards.chase.com/rewards-credit-cards
- Travel: https://creditcards.chase.com/travel-credit-cards
- Business: https://creditcards.chase.com/business-credit-cards
- Cash Back: https://creditcards.chase.com/cash-back-credit-cards

### Tools
- Card Finder: https://creditcards.chase.com/card-finder
- Pre-Approval: https://creditcards.chase.com/check-for-preapproved-offers

---

**Test Plan Version**: 1.0  
**Created**: November 24, 2025  
**Status**: Ready for Implementation
