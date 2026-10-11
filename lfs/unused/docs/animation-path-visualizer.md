# Animation Path Visualizer

> **Visualize, edit, and debug the path of any animated GameObject in Unity.**

---

## ✨ Short Summary

**Animation Path Visualizer** is a Unity Editor extension that lets you instantly see, edit, and debug the exact motion path of any GameObject animated with Animation or Animator components.
View all keyframes, inspect spatial tangents, add/move/delete keys directly in the Scene view, and understand your object's motion at a glance.

---

## 📖 Description

Animation Path Visualizer brings animation debugging and polish to a new level for Unity developers, animators, and technical artists.
This modern tool provides a visually appealing Editor window and powerful interactive scene handles, so you can:

* **Display every keyframe and the full path** of any animated object.
* **Edit keyframes spatially** (move in 3D) and temporally (adjust their time).
* **Manipulate tangents** for precise curve shaping—directly in the scene.
* **Add or delete keyframes** with a contextual scene menu (right-click).
* **Visualize velocity** with color gradients for instant speed feedback.
* **Lock selection** and work on multiple objects simultaneously.

Perfect for anyone who needs to *see* and *fine-tune* animation data in Unity without tedious curve panel editing.

---

## 🖼️ Screenshots

**Scene overview:**

![Animation Path Visuazer 02](Resources/Animation Path Visuazer 02.png)

**UI window and path details:**

![Animation Path Visuazer 03](Resources/Animation Path Visuazer 03.png)

**Keyframe editing handles:**

![Animation Path Visuazer 04](Resources/Animation Path Visuazer 04.png)

**Tangents and contextual menus:**

![Animation Path Visuazer 05](Resources/Animation Path Visuazer 05.png)

**Animated path in action (GIF):**

![Animation Path Visuazer 06 GIF](Resources/Animation Path Visuazer 06 GIF.gif)

**Editing multiple keyframes (GIF):**

![Animation Path Visuazer 07 GIF](Resources/Animation Path Visuazer 07 GIF.gif)

**Velocity visualization (GIF):**

![Animation Path Visuazer 08 GIF](Resources/Animation Path Visuazer 08 GIF.gif)

**Selection lock example:**

![Animation Path Visuazer 09](Resources/Animation Path Visuazer 09.png)


---

## ⚙️ Technical Details

### Key Features

* **Instant path visualization:** See all keyframes and motion paths in the Scene view.
* **Edit in the scene:** Move, retime, or delete keyframes with handles and GUI overlays.
* **Tangents as handles:** Adjust curve tangents visually.
* **Context menus:** Right-click on paths or keyframes to add/delete keys.
* **Velocity visualization:** Path color from green (slow) to red (fast), with customizable scale.
* **Multi-object support:** Visualize and edit multiple selected objects (including children).
* **Selection lock:** Lock your current selection for focused editing.
* **Modern, readable UI:** Editor window with dark theme and signature colors.
* **Zero runtime impact:** Editor-only; never affects builds or performance.

---

## 🚀 Installation (Asset Store version)

1. **Import the package** using Unity's Package Manager or Asset Store window.
   *(Window → Asset Store, or right-click the package in Package Manager → Import)*
2. All scripts and resources are automatically placed in `Assets/AnimationPathVisualizer` (with Editor scripts in the correct subfolders).
3. Open the tool from the Unity menu:
   `Tools > 🧩 Animation Path Visualizer`

---

## 🕹️ Usage

1. **Open the Tool**

   * Go to `Tools > 🧩 Animation Path Visualizer`.

2. **Select Objects**

   * In the Hierarchy, select one or more animated GameObjects (with `Animation` or `Animator`).
   * Optionally, use **Lock Selection** to freeze your current selection for editing.

3. **Visualize Paths**

   * Scene view displays the full path (color-coded) and all keyframes as spheres.
   * Mouse over any point for details.
   * Toggle velocity gradient (green/red) in the window options.

4. **Edit Keyframes and Tangents**

   * Click a keyframe to enter edit mode: move in 3D or adjust its time with the slider.
   * Drag tangent handles (cyan/blue) to modify the curve.
   * Right-click a keyframe to delete it.
   * Right-click a path segment to add a new keyframe.

5. **Customize Options**

   * Toggle keyframe visibility, velocity colors, and adjust speed scale in the Options panel.

---

## ❓ FAQ

**Q: Does this tool modify my animation clips?**
A: Only when you edit (move/add/delete) keyframes. All changes support Unity's Undo/Redo. No runtime or unintentional modifications.

**Q: Can I use this on any property?**
A: This version supports only position curves (`m_LocalPosition.x/y/z`). Future updates may expand this.

**Q: How do I unlock selection or reset the window?**
A: Use the “Unlock” button in the “Selected Objects” panel.

**Q: Are my changes permanent?**
A: All edits are saved to the `AnimationClip` asset and can be reverted using Undo (Ctrl+Z).

**Q: Is this safe for production?**
A: Yes. This tool is Editor-only and has no impact on builds or runtime.

---

## 🔄 Changelog

### v1.0.0 (2025-07-06)

#### New Features

* Real-time path visualization in Scene View
* Supports both Animation and Animator
* Interactive keyframe and tangent editing
* Context menus for adding/deleting keyframes
* Velocity color gradient display
* Selection lock/unlock and multi-object support
* Modern Editor Window UI
* 100% Editor-only; Undo/Redo support

#### Known Limitations

* Only supports position curves (m\_LocalPosition)
* Only first AnimationClip visualized per object
* No blend tree/non-transform property support (yet)

---

## 📬 Support & Feedback

Questions, suggestions, bug reports, or feature requests?
Feel free to open an issue or contact me at **[jules.gilli@live.fr](mailto:jules.gilli@live.fr)**

---

## 📝 License

MIT License
Animation Path Visualizer © 2025 JulesGilli

---

*Happy animating!*
