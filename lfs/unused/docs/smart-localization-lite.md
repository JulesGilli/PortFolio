# Smart Localization **Lite** (Free)

A lightweight, plug-and-play localization workflow for TextMeshPro.
Author your UI in one source language, then translate unlocked targets in one click directly from the Inspector—powered by **MyMemory** (free).

> Looking for more power? A **paid “Pro” version** is available with many additional providers (LibreTranslate, Google Cloud, Azure, Amazon Translate, DeepL, IBM Watson, Yandex Cloud, Smartling/Proxy), usage diagnostics, and extended editor polish.

---

## Why Lite?

* **Zero setup**: drop in, add the `LocalizedTMP` component, choose your source & target languages.
* **Translate from the Inspector**: one button to translate all unlocked languages for that entry.
* **Lock any language** to protect manual edits.
* **Daily quota managed for you** (Editor-side): works out of the box, no external keys required.
* **Free provider**: uses **MyMemory** so you can try the workflow without accounts or billing.

---

## Key Features

* `LocalizedTMP` component for TextMeshPro.
* Project-wide **language list** (EN/FR defaults).
* **Source/Default/Current** language management.
* **Per-language lock** and **quick delete** actions.
* **Placeholder safety**: warns when `{tokens}` don’t match the source.
* **Local daily quota**:

  * \~5,000 chars/day by default
  * **\~50,000 chars/day** if you provide a valid email (see below)
* Works in the Editor (translations happen at edit-time). Runtime is just data.

---

## What’s Included (Folders)

```
Assets/SmartLocalizationLite/
  Editor/
    Scripts/
      Inspectors/
        LocalizedTMPEditorLite.cs
      Settings/
        LocalizationSettingsProviderLite.cs
      Translation/
        EditorTranslatorLite.cs
        MyMemoryProviderLite.cs
      Utilities/
        CharQuotaManagerLite.cs
        EditorAssetUtilityLite.cs
  Runtime/
    Scripts/
      LocalizationServiceLite.cs
      LocalizationSettingsLite.cs
      LocalizedTMPLite.cs
      Models.cs
  Resources/
    LocalizationSettingsLite.asset   (auto-created on first use)
```

---

## Quick Start

1. **Import** the package.
2. **Open Project Settings → Smart Localization Lite**
   • Set **Source**, **Default**, and **Current** languages.
   • (Optional) Enter **MyMemory Email** to unlock a higher daily cap.
3. **Select a TextMeshPro object** in your scene and **Add Component → LocalizedTMP**.
4. Enter your **source text**; other languages will get empty fields.
5. Click **Translate** in the Inspector to fill unlocked target languages.
6. **Lock** any language you want to preserve from auto-overwrites.

> Tip: Use the Inspector filters **Only missing** / **Only unlocked** to focus your editing.

---

## MyMemory Email & Quota

* Without email: \~**5k characters/day** (local cap).
* With a valid email: \~**50k characters/day** (local cap raised automatically).
* Where to set it: **Project Settings → Smart Localization Lite → Provider (MyMemory) → Email**.

> MyMemory is a third-party service. Service behavior & limits may change; the local cap in Lite is a convenience and not a guarantee of external service availability.

---

## Limitations (Lite)

* **Only one provider**: MyMemory (no API keys needed).
* **Editor-time translation only** (no automatic runtime calls).
* No bulk dashboards or CSV workflows (kept minimal on purpose).

If you need enterprise providers, usage diagnostics, or more tooling, consider upgrading to **Smart Localization (Pro)**.

---

## Upgrade Path — Pro Version

**Smart Localization (Pro)** adds:

* Providers: **LibreTranslate**, **Google Cloud**, **Azure Translator**, **Amazon Translate**, **DeepL**, **IBM Watson**, **Yandex Cloud**, **Smartling/Proxy**.
* Enhanced **Usage & Diagnostics** view.
* More polished **Project Settings** UI and customization options.

Your Lite data (`LocalizationSettingsLite.asset` and `LocalizedTMP` fields) can be migrated with minimal effort.

---

## Compatibility

* Editor tooling designed for recent LTS Unity versions (TextMeshPro required).
* Pipeline-agnostic (URP/HDRP/Built-in)—works with standard TMP components.

---

## Privacy & Network

* Translation requests send your source text to the MyMemory API to obtain results.
* Do **not** send confidential or sensitive content.
* No analytics or tracking are included in this package.

---

## Support / Feedback

* Found a bug? Have a provider you’d like to see in Pro?
  Please include your Unity version, steps to reproduce, and an Inspector screenshot when reporting.

---

## Changelog

**1.0.0 (Lite)**

* Initial release: Inspector-first workflow, MyMemory provider, quota helper, locks, placeholder checks.

---

### Legal

© 2025 JulesTools. TextMeshPro is © Unity Technologies.
All third-party service names and trademarks are property of their respective owners.
