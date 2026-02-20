# Traderie Auto Defaults

Automatically applies user-defined default dropdown selections when creating Diablo II Resurrected listings on Traderie.

##  Features

- Persistent configurable defaults
- React-compatible dropdown interaction
- Case-insensitive matching
- Game Version applied first to prevent re-render conflicts
- Clean Tampermonkey menu configuration
- No intrusive popups

##  Why This Exists

Re-entering the same default values for every listing is repetitive and inefficient.
This script automates that process.

##  Installation

### Method 1 – Manual Install

1. Install Tampermonkey browser extension.
2. Open `traderie-auto-defaults.user.js`.
3. Click **Install** in Tampermonkey.

### Method 2 – Install via Raw GitHub (optional)

1. Open the raw file: https://raw.githubusercontent.com/SamAllred/traderie-auto-defaults/main/traderie-auto-defaults.user.js
2. Tampermonkey will prompt to install.

## Configuration

1. Click the Tampermonkey icon.
2. Select **⚙️ Configure Traderie Defaults**.
3. Enter the exact dropdown text used on Traderie.
4. Refresh the page.

## Notes

- Matching is case-insensitive.
- If a dropdown opens but does not select, verify the exact wording.
- Not affiliated with Traderie.

## License

MIT License
