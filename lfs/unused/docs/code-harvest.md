# Code Harvest

**Harvest and export your Unity scripts in seconds. Ready for AI tools, CI/CD, and automation.**

---

## Short Summary

Code Harvest creates clean, structured, and "AI-friendly" exports of your Unity project scripts.
You can instantly prepare your code for ChatGPT, backup, documentation, delivery — or even automate it in your CI/CD pipelines.

---

## Description

**Code Harvest** collects and exports your Unity scripts into readable `.txt`, `.md`, `.json`, or `.zip` files.
Its flexible interface lets you choose what to export, how to format it, and where to save it.
Use the Unity editor UI or the built-in HTTP API to trigger exports from scripts, terminals, or automation tools.

All exports are saved in `Assets/ScriptExports/`.

---

## Technical Highlights

* 🚀 One-click export of all your scripts.
* 📁 Folder inclusion/exclusion filters.
* 📄 Supports `.txt`, `.md`, `.json`, `.zip`.
* 📆 Clean file structure with optional tree summary.
* 🧐 AI-friendly format for ChatGPT and assistants.
* 💻 Local HTTP API to automate everything.
* 🔧 Supports CI/CD pipelines with `curl` or scripts.
* 🎯 Export only selected files or extensions.
* 🧪 Zero impact on runtime — Editor-only tool.

---

## Installation

1. Open **Unity > Window > Package Manager**
2. Click the **+** and choose **"Add package from disk..."**
3. Select the `package.json` in this folder
4. Access the tool via `Tools > 📦 Code Harvest`

---

## How to Use

### ✅ From the Unity Editor

1. **Choose folders** to include/exclude
2. **Filter by extension** (`.cs`, `.shader`, etc.)
3. **Scan and select** files
4. **Choose format**: txt, md, json, zip
5. **Click Export** — done!
6. Find the file in `Assets/ScriptExports/`

---

### 🌐 From the HTTP API

The API runs automatically on `http://localhost:8080`.
It lets you export scripts via browser, curl, Postman, Unity pre-build hooks, or CI runners.

#### ✅ Available Endpoints

| Method | Endpoint   | Description                             |
| ------ | ---------- | --------------------------------------- |
| GET    | `/status`  | Returns API status/version              |
| GET    | `/scripts` | Returns list of scripts (with filters)  |
| GET    | `/export`  | Triggers a full export (with options)   |
| POST   | `/export`  | Triggers export from a custom file list |

---

### 📅 GET /export Example

```bash
curl "http://localhost:8080/export?format=txt&return=info"
```

Options:

| Param        | Type         | Default  | Description                          |
| ------------ | ------------ | -------- | ------------------------------------ |
| `format`     | string       | `txt`    | `txt`, `md`, `json`, or `zip`        |
| `include`    | CSV list     | `Assets` | Folder(s) to include                 |
| `exclude`    | CSV list     | -        | Folder(s) to skip                    |
| `ext`        | CSV list     | `.cs`    | File extensions to export            |
| `outputPath` | string       | -        | Custom file path to write the export |
| `silent`     | `true/false` | false    | Disables Unity console logs          |
| `return`     | `"info"`     | -        | Returns JSON result instead of file  |

---

### 📄 POST /export Example

```bash
curl -X POST http://localhost:8080/export?format=md&return=info ^
     -H "Content-Type: application/json" ^
     -d "@entries.json"
```

**entries.json:**

```json
{
  "format": "md",
  "entries": [
    { "path": "Assets/Scripts/MyScript.cs" },
    { "path": "Assets/Utils/Helper.cs" }
  ]
}
```

---

### 🥪 Sample Use Cases

* ✅ Unity prebuild export
* ✅ GitHub Actions, GitLab CI
* ✅ Script backup on project close
* ✅ Static code analysis pipelines
* ✅ Export on button click in custom tools

---

## FAQ

**Q: Where are exports saved?**
A: In `Assets/ScriptExports/` by default. You can also set a custom path.

**Q: Does it modify my files?**
A: No. It reads and copies content, nothing is touched.

**Q: Can I export shaders or other files?**
A: Yes, just add `.shader`, `.compute`, etc. to the extension filter.

**Q: Can I use this in CI/CD?**
A: Absolutely. Use the `curl` or `Invoke-RestMethod` examples above.

---

## Support

Feel free to contact me: [jules.gilli@live.fr](mailto:jules.gilli@live.fr)

---

© Code Harvest 2025 · JulesTools · MIT License
