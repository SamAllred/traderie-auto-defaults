// ==UserScript==
// @name         Traderie Auto Defaults
// @namespace    https://traderie.com/
// @version      33.2
// @description  Automatically applies user-defined default values (Game Version, Platform, Ladder, Mode, Region) when creating Diablo II Resurrected listings on Traderie.
// @author       Samarty Pants
// @license      MIT
// @match        https://traderie.com/diablo2resurrected/listings/create*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL  https://raw.githubusercontent.com/SamAllred/traderie-auto-defaults/main/traderie-auto-defaults.user.js
// @updateURL    https://raw.githubusercontent.com/SamAllred/traderie-auto-defaults/main/traderie-auto-defaults.user.js
// ==/UserScript==

/*
===============================================================================
Traderie Auto Defaults
-------------------------------------------------------------------------------
Author: Samarty Pants

Purpose:
Automatically applies configurable default dropdown selections when creating
Diablo II Resurrected listings on Traderie.

Why This Exists:
Re-entering the same default values for every listing is dumb.
This script eliminates repetitive manual input.

Core Features:
• Persistent user configuration via Tampermonkey menu
• React-compatible dropdown interaction (pointer lifecycle safe)
• Case-insensitive matching
• Portal-safe listbox detection
• Game Version applied first to prevent re-render conflicts
• Clean menu-driven instructions (no intrusive popups)

Usage:
1. Click the Tampermonkey extension icon.
2. Select "⚙️ Configure Traderie Defaults".
3. Enter the exact dropdown text shown on Traderie.
4. Refresh the page.
5. Select an item — defaults apply automatically.

Not affiliated with Traderie.

-------------------------------------------------------------------------------
Changelog:
v33.1  - Metadata cleanup and documentation refinement
v33.0  - Added configurable menu system and instructions
v25+   - Stable React pointer lifecycle implementation
===============================================================================
*/
(function () {
    'use strict';

    console.log("Traderie script active");

    // ---------- SETTINGS ----------
    const DEFAULTS = {
        gameVersion: GM_getValue("gameVersion", "Reign of the Warlock"),
        platform: GM_getValue("platform", "PC"),
        ladder: GM_getValue("ladder", "Non Ladder"),
        mode: GM_getValue("mode", "softcore"),
        region: GM_getValue("region", "Americas")
    };

    // ---------- MENU: CONFIGURE ----------
    GM_registerMenuCommand("⚙️ Configure Traderie Defaults", () => {

        const gameVersion = prompt("Game version:", DEFAULTS.gameVersion);
        const platform = prompt("Platform:", DEFAULTS.platform);
        const ladder = prompt("Ladder:", DEFAULTS.ladder);
        const mode = prompt("Mode:", DEFAULTS.mode);
        const region = prompt("Region:", DEFAULTS.region);

        if (gameVersion !== null) GM_setValue("gameVersion", gameVersion);
        if (platform !== null) GM_setValue("platform", platform);
        if (ladder !== null) GM_setValue("ladder", ladder);
        if (mode !== null) GM_setValue("mode", mode);
        if (region !== null) GM_setValue("region", region);

        alert("Defaults saved. Refresh page.");
    });

    // ---------- MENU: INSTRUCTIONS ----------
    GM_registerMenuCommand("📖 Instructions", () => {
        alert(
`Traderie Auto Defaults

HOW TO USE:
1. Click the Tampermonkey extension icon.
2. Select "⚙️ Configure Traderie Defaults".
3. Enter the EXACT dropdown text shown on Traderie.
4. Refresh the page.
5. Select an item — defaults apply automatically.

NOTES:
• Matching is case-insensitive.
• If a dropdown opens but does not select,
  verify the exact wording in Traderie.
• Game version is applied first because
  it may re-render other fields.
`
        );
    });

    // ---------- CORE LOGIC ----------
    let lastItem = null;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function realClick(element) {
        element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
        element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        element.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
        element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }

    async function waitForListbox() {
        for (let i = 0; i < 20; i++) {
            const listbox = document.querySelector('[role="listbox"]');
            if (listbox) return listbox;
            await sleep(50);
        }
        return null;
    }

    async function selectReactOption(labelText, valueText) {

        const blocks = document.querySelectorAll(".listing-option-select");

        for (let block of blocks) {

            const label = block.childNodes[0]?.textContent?.trim();
            if (!label || !label.toLowerCase().includes(labelText.toLowerCase())) continue;

            const control = block.querySelector(".Select__control");
            if (!control) return;

            realClick(control);

            const listbox = await waitForListbox();
            if (!listbox) return;

            const options = listbox.querySelectorAll('[role="option"]');

            for (let option of options) {

                const optionText = option.textContent.trim().toLowerCase();
                const targetText = valueText.trim().toLowerCase();

                if (optionText.includes(targetText)) {
                    realClick(option);
                    await sleep(100);
                    return;
                }
            }
        }
    }

    async function applyDefaults() {

        await sleep(200);

        await selectReactOption("Game version", DEFAULTS.gameVersion);
        await selectReactOption("Platform", DEFAULTS.platform);
        await selectReactOption("Ladder", DEFAULTS.ladder);
        await selectReactOption("Mode", DEFAULTS.mode);
        await selectReactOption("Region", DEFAULTS.region);
    }

    function startWatching() {

        setInterval(async () => {

            const selects = document.querySelectorAll(".Select__single-value");

            if (selects.length < 2) return;

            const itemNode = selects[1];
            const itemName = itemNode.textContent.trim();

            if (!itemName) return;
            if (itemName === lastItem) return;

            lastItem = itemName;

            await applyDefaults();

        }, 300);
    }

    window.addEventListener("load", () => {
        setTimeout(startWatching, 800);
    });

})();
