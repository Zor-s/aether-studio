# Development To-Do List

This document tracks planned fixes, feature implementations, and system improvements for Aether Studio. Contributors are encouraged to pick tasks from this list or propose new ones.

## Mandatory Workflow
- **Read Documentation First:** Before you proceed with any changes, make sure to read the `docs/` directory as it includes all the documentation for the project.

- **Report First:** Any discovered bugs or proposed features MUST be added to this list before any implementation begins.
- **Task-Driven Changes:** Do not implement any changes unless they are documented below and you have been specifically tasked to do so.
- **Scope Adherence:** Strictly apply changes only within the scope of the documented task. Do not refactor unrelated code or fix other issues unless they are critical blockers or part of the defined task.
- **Hierarchical Completion Rule:** A main task or parent subtask must **ONLY** be marked as complete `[X]` when **ALL** of its children/subtasks are also marked `[X]`. Use `[.]` for partially completed parent tasks.

---

### Legend

- `[ ]` Incomplete: No subtasks are finished.
- `[.]` Partially complete: At least one subtask is finished, but not all.
- `[X]` Complete: **ALL** subtasks and nested items are marked `[X]`.

---

### Note for AI Models (Antigravity & others)
When updating this document:
1. **Maintain Hierarchy:** Always preserve the indentation and nested structure.
2. **Propagate Status:** When you finish a subtask, check if it was the last one for its parent. If so, update the parent to `[X]`. If not, ensure the parent is `[.]`.
3. **Be Specific:** Only mark the exact subtask you worked on. Do not mark an entire feature as done unless you have verified every sub-item.
4. **Break Down Large Tasks:** If a task is complex or large, break it down into smaller, manageable subtasks within the hierarchy. For each subtask:
    - Provide a clear **Description** or **Goal**.
    - Include a **Files Involved** list (affected, added, or deleted).

---

