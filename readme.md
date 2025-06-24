This script tracks the most viewed merchant categories across /merchants/ pages and displays a "Most Viewed Merchant" widget section on the homepage (/) 

Features
Stores shop title, image, availability, and timestamp in localStorage.

Increments view count each time a merchant category page is visited.

On homepage (/), finds the most viewed merchant and displays a custom widget under a target Elementor section.

File Structure
merchant-widget.js (this script)

Injected HTML/CSS rendered dynamically via renderWidget()

How It Works
On Merchant Pages (/merchants/slug)
Looks for elements with a class containing merchant_category

Extracts:

Shop title (.elementor-heading-title.elementor-size-default)

Shop image and alt text

Availability (checks for "in-store" or "online")

Stores visit data in localStorage under merchantViewHistory

On Homepage (/)
Checks for merchantViewHistory in localStorage

Determines the most viewed merchant by comparing viewCount

Injects a custom widget after the Elementor section with data-id="59c92fe4"

DOM Requirements
Ensure your pages contain:
.elementor-heading-title.elementor-size-default
<img> tag inside a container with a class like merchant_category
On homepage: a section with data-id="59c92fe4" as the injection point

Example localStorage Format

{
  "3Gen Auto Repairs": {
    "viewCount": 1,
    "storeInformation": [
      {
        "title": "3Gen Auto Repairs",
        "image": ".................",
        "imageAlt": "",
        "isInStore": true,
        "isOnline": true,
        "timeStamp": "Jun 24, 2025, 05:14 PM"
      },
	   {
        "title": "3Gen Auto Repairs",
        "image": ".................",
        "imageAlt": "",
        "isInStore": true,
        "isOnline": true,
        "timeStamp": "Jun 24, 2025, 05:16 PM"
      }
    ]
  }
}

Notes
If data-id="59c92fe4" changes in Elementor, update the selector in the script (targetSection).