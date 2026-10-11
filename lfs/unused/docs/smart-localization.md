# Smart Localization Suite

Production-ready, editor-first localization workflow for Unity (TextMeshPro). Translate your UI text in-editor via your preferred provider (DeepL, Azure, Google, Amazon, MyMemory, Smartling, LibreTranslate, IBM, Yandex), with per-language locking, placeholder safety checks, usage counters, and a clean Inspector.

> Looking for a free starter? **Smart Localization Lite** ships MyMemory-only with a simplified UI. The Suite version adds 8+ providers, richer settings, diagnostics, and extensibility.

---

## Highlights

* **One-click translate** from your source language to all configured targets
* **Provider-agnostic**: MyMemory, LibreTranslate, Google Cloud, Azure Translator, Amazon Translate, DeepL, IBM Watson, Yandex Cloud, Smartling (via proxy)
* **Locked fields** stay untouched by auto-translate
* **Placeholder safety**: warns when `{tokens}` differ from the source
* **Search & filters** in the Inspector (missing / unlocked)
* **Daily usage tracking** (Editor-side) with a progress bar for MyMemory
* **Project Settings UI** with logo + custom background & provider configuration
* **Dashboard** window with quick scene stats and CSV import/export
* **Zero runtime dependency on providers** (translation happens in the Editor)

---

## Requirements

* Unity **2021.3 LTS** or newer
* TextMeshPro (TMP)
* Internet access **in the Editor** for translating

---

## Install & Folders

```
Assets/
  SmartLocalizationSuite/
    Editor/
      Scripts/...
      Textures/
        inspector_bg.png     (Inspector background)
        settings_bg.png      (Project Settings background)
        logo_header.png      (Square logo for header)
    Resources/
      LocalizationSettings.asset  (auto-created)
    Runtime/
      Scripts/...
```

If the `Resources/LocalizationSettings.asset` is missing, it is created automatically.

### Branding assets (optional)

Place your images in **`Assets/SmartLocalizationSuite/Editor/Textures/`** with the exact filenames:

* `logo_header.png` – shown in Project Settings header (square works best)
* `settings_bg.png` – full-bleed background in Project Settings
* `inspector_bg.png` – full-bleed background in the component Inspector

**Inspector background dim:** the editor keeps a dim overlay value in a pref. Default ≈ 0.24.

```csharp
UnityEditor.EditorPrefs.SetFloat("SmartLocalizationSuite.InspectorBgDim", 0.35f); // 0..0.6
```

---

## Quick Start

1. **Open Project Settings → Smart Localization Suite**
2. In **Languages**, add your ISO codes (e.g. `en`, `fr`, `de`). Set **Source**, **Default**, and **Current**.
3. In **Provider**, choose a translation provider and fill credentials if required.
4. Add **LocalizedTMP** to any `TMP_Text` in your scene and fill the **source** text.
5. Click **Translate** in the Inspector to auto-fill unlocked target languages.

---

## Using the Component

* **Source language** is taken from settings, or you can override per component.
* **Search & Filter** bar helps focus missing or unlocked entries.
* **Delete** clears a target value (disabled when locked).
* **Placeholders**: If the source contains tokens like `{player}` / `{0}` / `{name}`, the Inspector warns when target tokens don’t match.

---

## Runtime API

This package does not call providers at runtime. You only switch languages.

```csharp
using SmartLocalizationSuite;

LocalizationService.CurrentLanguage = "fr"; // Raises language-changed event
```

LocalizedTMP components refresh automatically on change.

---

## Providers & Credentials

Supported providers (editor-time): **MyMemory, LibreTranslate, Google Cloud, Azure Translator, Amazon Translate, DeepL, IBM Watson LT, Yandex Cloud, Smartling**.

Use the **Test provider** button in Project Settings to validate credentials.

---

## MyMemory Daily Credits

* Without email: local soft cap **5,000** characters/day
* With a valid contact email: local soft cap **50,000** characters/day

---

## Dashboard & CSV

Open **Smart Localization Suite → Dashboard** for scene-level stats. Export or import a CSV:

```
entryId,lang,text
0f6...c21,en,"Hello"
0f6...c21,fr,"Bonjour"
```

* **Export CSV (scene)**: dumps all LocalizedTMP entries for configured languages
* **Import CSV (merge)**: merges by `entryId` and `lang` (respects locks when using the component API)

---

## Extending Providers

Providers implement a standard async API, making it easy to add your own under `Editor/Scripts/Translation/Providers/`.

---

## Known Limits & Notes

* Translations are **serial** by default; for heavy usage, batching is recommended.
* Placeholder check compares token sets between source and target; it doesn’t rewrite tokens.
* Dashboard bulk translation is basic—ideal for small edits; heavy workflows benefit from CSV import/export.
* Runtime contains no HTTP calls; all networking is editor-time only.

---

## Troubleshooting

* **Nothing translates**: ensure the source text is not empty and at least one **unlocked** target exists.
* **Auth/HTTP errors**: use **Test provider** and check Console for details.
* **Quota warnings (MyMemory)**: the Inspector explains partial translation and remaining quota.
* **Placeholders mismatch**: align tokens in target to match the source exactly.

---

## Upgrade from Lite

* Remove the `Assets/SmartLocalizationLite/` folder.
* Install the Suite package under `Assets/SmartLocalizationSuite/`.
* Re-assign the **LocalizedTMP** component if you previously used `SmartLocalizationLite.LocalizedTMP`.
* Your text data can be migrated via CSV.

---

## License & Third-Party Services

This tool integrates with external translation providers you configure. Usage, billing, and data handling are subject to their respective terms and policies.

---

## Support

For questions, bugs, or ideas, contact via your store purchase channel with:

* Unity version, platform
* Provider used & settings
* Error logs / Console output
* A minimal repro scene or GIF

— **Smart Localization Suite**
