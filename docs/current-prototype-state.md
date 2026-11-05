# Current Operate Prototype State

Checkpoint date: November 5, 2026 at 14:28 UTC. Read this first when continuing in a new Agent chat, then inspect the referenced code and [requirements](operate-requirements.md). The repository, not past conversation history, is the source of truth.

## Latest Updates (November 5, 2026)

**Session 7 Summary:**
1. ✅ **Customise Key Points Dialog:** Fixed critical bugs where X, Cancel, and Apply buttons failed to close dialog. Root cause: CSS not respecting native `<dialog>` lifecycle (missing `[open]` attribute selector). Fixed by updating CSS to use `.key-points-customize[open]` for conditional display. All three buttons now work correctly with normal browser clicks.
2. ✅ **Key Points Customise Button Styling:** Updated button to visually match Equipment State Customise button by making CSS selector more specific (`.key-points__header .key-points__customize`), revealing the border that was being overridden by parent selector.
3. ✅ **Points Tab Redesign:** Replaced simple PointDirectory with new PointsTable component—searchable, sortable, paginated table with 6 columns (Point Name, Type, Current Value, Unit, Last Read, Status). Search filters across all fields (case-insensitive). Pagination with 10/25/50 items-per-page selector. Status badges use EF colors. Point names are clickable links to Point Details.
4. ✅ **Point Trend Functionality Recovery:** Restored missing "+ Create custom trend" button that was removed during two-column layout refactoring. Button is now visible next to Trend View dropdown on the left. Clicking it activates right-column "Add Point From" section to add points from Current equipment, Related equipment, or Wider site (tree picker). All comparison and multi-equipment features functional.

## Architecture and Files

## Purpose and Constraints

Operate is a clickable equipment-troubleshooting UX prototype built with React, TypeScript, and Vite. It supports desktop and phone layouts. Everything uses local mock data; there is no backend, API integration, authentication, or server persistence.

Do not redesign, add features, change approved terminology/colors/counts, create branches/repositories, deploy, or commit/push without an explicit request. Preserve working navigation and the existing design language. Do not implement Graphics, historical equipment playback/time-machine, automatic parent-equipment diagnosis, asset-management integration, real permissions, or the Phase 1 / Phase 1 & 2 mode toggle without authorization.

## Architecture and Files

- `src/main.tsx`: React entry point; initializes EF CSS tokens before rendering.
- `src/App.tsx`: equipment/tab/point navigation, Back context, notes, document selection, Overview trend-view state, and alarm count badge. Navigation is React state, not a router or backend.
- `src/components/EquipmentPage.tsx`: breadcrumb, equipment header, optional alarm summary, tab row, and content panel; exports `EquipmentTab`.
- `src/components/OperateOverview.tsx`: composes upper cards (Equipment Properties + Field Information combined), Operational Roll-up, Key Points, inline Point Trend, Related Equipment, and the Notes sidebar.
- `src/components/EquipmentOverviewCards.tsx`: Equipment Properties and Field Information merged into single combined card with Edit action beside Field Information only. Properties section is not editable.
- `src/components/EquipmentHierarchy.tsx`: equipment tree with status indicators, aggregated alarm counts on parent locations, and clickable node selection.
- `src/components/PrimaryNavigation.tsx`: main navigation with alarm count badge on "Alarms & Faults" item, derived from active alarm data.
- `src/components/EquipmentResources.tsx`: shared Notes/Documents panels. Documents now include Preview and Download actions for each entry; Equipment Photos preview shows gallery of three images. Do not duplicate these implementations.
- `src/components/OperationalRollup.tsx`, `KeyPointsSection.tsx`, `FilteredPoints.tsx`, `PointDetails.tsx`: shared status/point views and interactions.
- `src/components/PointsTable.tsx` (NEW): Searchable, paginated Points table with 6 columns (Point Name, Type, Current Value, Unit, Last Read, Status). Replaces PointDirectory. Features: multi-field search (case-insensitive), items-per-page selector (10/25/50), pagination controls, status badges with EF colors, clickable point names navigate to Point Details. Uses shared `operateOverviewData.keyPoints` data.
- `src/components/RelatedEquipment.tsx`: desktop diagram, mobile list, legend, Expand/Zoom/Reset, and equipment selection.
- `src/components/PointTrendPanel.tsx` and `TrendWorkspace.tsx`: Inline Point Trend and expandable modal. Features restored in this checkpoint: "+ Create custom trend" button next to Trend View dropdown (left column). Clicking button activates "Add Point From" section (right column) with three source options: Current equipment, Related equipment, Wider site. Wider site includes equipment hierarchy tree with checkbox selection and collapsible nodes. Multi-equipment comparison with distinct series colors and source-equipment labels. Selected-series chips show removable comparisons. All state is temporary/session-only. Presets remain protected. `PointTrendChart.tsx` uses Recharts for visualization.
- `src/components/TrendsExperience.tsx`: Separate Trends-tab experience (unchanged).
- `src/data/equipment.ts`: site/equipment tree with `EquipmentStatus` field (alarm/ok/override/fault), relationship nodes, and status-based rendering. `operateOverview.ts`: shared AHU properties (Sequence removed), controllers, states, alarms, points, roll-up counts/trends, and point formatting/lookup.
- `src/data/trends.ts`: catalog, presets, mock values/events, and additional point-detail records. `overviewTrends.ts`: explicit timestamped samples/events and protected Overview presets, including pressure SP.
- `src/data/equipmentResources.ts`: initial notes, five document entries with preview/download support, and field-location values. `statusColors.ts`: authoritative shared EF palette.
- `src/styles.css`: shared desktop/mobile styles including status indicators, alarm badges, and layout updates. `src/assets/air-handling-unit.jpg` is a representative public-domain photo; provenance is in `src/assets/README.md`.
- `docs/operate-requirements.md`: original FigJam context, implemented updates, EF mappings, and future/unresolved items. Project setup is in `README.md`, `package.json`, `package-lock.json`, `tsconfig.json`, and `vite.config.ts`.

## Implemented Views and Interactions

- Default equipment: AHU-SA-01. Tabs, in order: Operate, Equipment Graphic, Points, Associated Documents.
- Operate: full-width Active Alarms above the tabs; combined Equipment Properties and Field Information card (single column with Properties above Field Information); Controlling Devices and Equipment State cards stacked below in left column on desktop; roll-up; compact Key Points; inline pressure trend directly above Related Equipment; Notes in the right-side area (collapsible).
- Operational Roll-up: Uses improved typography for better readability. Status titles (Healthy, In Alarm, In Override) are now **bold text** with their respective EF status colors (green, red, purple) to make status easier to identify without relying solely on color. Main values (e.g., 11 / 14, 2 / 14, 1 / 14) remain visually dominant. Trend information and counts maintain the established visual hierarchy. Key Points typography has been refined throughout for improved readability.
- Page Layout: Approximately 50px of white breathing room appears below the final page content to provide visual spacing at the end of the scrollable content area.
- Active Alarm Summary: displays the main alarm icon as a red Bell icon using EF In Alarm primary color. Point names are text-only with no alarm icons beside them. Alarm Message column shows Low/High indicators (downward/upward arrows) in EF In Alarm red, followed by the condition text. Example: `[↓] Low (< 1.5 in wc)` for Duct Static Pressure and `[↑] High (> 1,000 ppm)` for CO2. The table uses seven columns in this order: Point | Alarm Message | Acknowledge | Clear | Current Value | Time in Alarm | Action. Acknowledge and Clear controls are centered within their respective columns beneath the column headings. Header and data rows use identical grid column definitions to maintain perfect vertical alignment with no overlapping controls or headers. Acknowledge and Clear remain visually grouped near the Alarm Message without excessive spacing.
- Equipment Properties shows Equipment Name, Type, Subtype, Assigned Space, Description, and Last Updated. Sequence property has been removed. Field Information displays equipment image, Location, Access, and Orientation with an Edit action beside the Field Information heading. Properties section is not editable.
- Alarm and Key Point selections open the exact Point Details through a shared point ID. View all alarms opens alarm-filtered Points; View all points opens the available eight-record directory. Point Details Back uses the current equipment name and restores the originating tab/filter.
- Roll-up: Healthy `11 / 14` with `Stable (+0 delta)`; In Alarm `2 / 14` with `Escalating (+1 alarms)`; In Override `1 / 14` with `Flat (0 changed)`. The heading's supporting text is `Trend shows change over last 24 h`. Trend icons use the corresponding EF primary colors; all desktop cards stay compact/aligned.
- In Alarm and In Override remain clickable filters for the two alarm points and Supply Fan Speed respectively. Healthy has no extra interaction.
- Related Equipment: Chiller CH-01, AHU-SA-02/AHU-SA-01, VAV-01 through VAV-04, and a non-navigable `+9 more VAVs` aggregate. Named nodes update the equipment header/tree and offer Back; Expand/Zoom/Reset and Normal/Alarm/Override/Offline legend are retained.
- Point Details shows the selected point, reading/unit, state, available setpoint/alarm information and timing, a trend placeholder, and available alarm-history content. No synthetic override history is shown when none exists.
- Inline Point Trend defaults to Duct Static Pressure + Duct Static Pressure SP, with a Reheat/Supply Air Temperature/Discharge Air Temperature alternative. Supports 4h/12h/24h/7d ranges, tooltip/hover line, visibility/focus/scale, event hover/click/keyboard controls, and exact View point navigation. Presets are protected; duplicate before editing. Custom views support create/rename/remove and series additions/removals from current equipment, related equipment, and wider site.
- Separate Trends tab supports the original airflow and reheat comparisons, 12h/24h ranges, hover values, focus/scale, inline event details, View Point, three-source point additions, and duplicate/remove custom views. Do not silently merge it with the Overview panel or assume their management features are identical.
- Associated Documents appears only in its tab. Five local entries include expandable Preview (Equipment Photos shows gallery of three images; other documents show placeholder preview) and Download actions. Selection persists across tabs but no documents are downloaded/fetched.
- Equipment Graphic: Displays a static placeholder graphic of the AHU equipment schematic. The image is a supplied asset showing the equipment layout with visible areas such as exhaust damper, return fan, return air, outside air, return damper, coil, supply fan, and discharge conditions. The graphic is not interactive at this stage.
- Notes: On desktop, Notes is a right-side column visible by default within the Overview area. The Notes header shows a **ChevronUp (↑)** collapse control. Clicking it hides the entire Notes column and expands the main content area to full available width. No empty Notes column remains. Main content cards preserve their existing hierarchy and proportional widths. When Notes is collapsed, a "Notes" reopen button with a **ChevronDown (↓)** icon appears on the same row as the "Overview" heading, aligned to the far right. This button does NOT appear beside Active Alarms or at the bottom of the page. The Open Notes button remains visible without scrolling. Clicking the Notes button restores the Notes right-side column, and the Overview-level Notes button disappears. The original two-column layout is restored when Notes is reopened. Main content expands to use the full available width when Notes is collapsed, and returns to two-column layout when Notes reopens. Notes state and content (added notes, resolved status, input draft) are preserved during collapse and reopen. On mobile, Notes behavior follows the existing responsive design and is not affected by the collapse control.
- Notes has an always-visible input, Cancel, and Add note alongside existing records. Cancel clears the draft without closing it. Add creates author/date/time metadata; Resolve/Delete work without real permissions. Saved notes and document selection survive tab switches in the current session.
- Field Information is rendered once inside the combined card with Properties, with a left image, Location/Access/Orientation, and Edit. Its local form supports Save/Cancel. Customize chooses visible Equipment State fields. Alarm Acknowledge/Clear controls provide local toggle/request feedback; Clear does not remove mock alarm records or change counts.

## Equipment Status and Navigation Indicators

- Equipment tree displays `EquipmentStatus` indicators on the right side of each tree item: red triangle for alarm, green circle for ok, purple circle for override, orange triangle for fault.
- Parent locations (building/floor nodes) show an aggregated alarm count badge when they contain equipment with active alarms. The count is computed recursively from their children.
- "Alarms & Faults" primary navigation item displays a red badge showing the total number of active alarms in the system. Count is derived from `operateOverviewData.activeAlarmCount`, not hard-coded.
- Status colors use the existing EF palette: alarm uses `--ef-status-alarm-primary` (red), ok uses `--ef-status-ok-primary` (green), override uses `--ef-status-override-primary` (purple), fault uses `--ef-status-fault-primary` (orange).
- Equipment status is defined in `src/data/equipment.ts` as `EquipmentStatus` type; sample data includes alarm items (AHU-SA-01, VAV-01, South Office), ok items (most equipment and Warehouse), and override item (VAV-02).

## Approved UI and Terminology

- Controller connection status is **Connected**, never Online. The internal `controlling-devices-card__online` CSS class is a legacy identifier, not visible wording; do not change it merely to rename UI text.
- Key Point cards show only name, value/unit, status, update time, and navigation chevron. No SP/setpoint or alarm-condition text, decorative status dots, or trend arrows belong inside these cards. Data/Point Details still retain available parameters.
- The upper area uses available main-column width with consistent gaps. Equipment Properties and Field Information are combined in a single card; Field Information image cropping uses `object-fit: cover` without distortion.
- Associated Documents is directly after Trends; Preview and Download actions appear on each document row. Do not restore a duplicate Overview document section. Notes fills the right-side upper-information/roll-up area, not an excessively tall empty column beside every chart.

## EF Status Palette

EF is the source of truth. `statusColors.ts` exports `efStatusColors`; startup exposes `--ef-status-<status>-primary/secondary`. Use primary for strong status text/dots/icons/borders/progress; existing pale backgrounds derive from secondary colors. Keep ordinary links, chart-series identity colors, selection outlines, and neutral form controls unchanged.

| Status | Primary | Secondary |
| --- | --- | --- |
| In Alarm | `#BE2434` | `#FB6265` |
| Down / Communication Failure | `#C0570D` | `#EAB448` |
| Fault | `#C0570D` | `#EAB448` |
| Out of Service | `#BE2434` | `#FB6265` |
| Overridden | `#9781E2` | `#9781E2` |
| Unacknowledged Alarm | `#BE2434` | `#FB6265` |
| Disabled | `#505050` | `#CCCCCC` |
| Stale | `#FDB813` | `#FDB813` |
| OK | `#358600` | `#A7D987` |

OK/Normal/Healthy/Connected and resolved-note indicators use OK. Alarm point names/readings and override filtering reuse canonical Key Points. Low/High threshold alarms map to In Alarm; Offline maps to Down; Override maps to Overridden. Earlier blue Low-alarm and orange Override styling is historical and superseded. Unused mappings do not imply new mock states.

## Mock Data and Responsive Behavior

- Alarm point names/readings and override filtering reuse canonical Key Points. Roll-up totals/trend deltas are fixed local examples, not computed analytics. The 14 total points include six unspecified records; do not invent them. Trends use generated/interpolated local sequences with UTC timestamps, not live history.
- App-level notes, document selection, and Overview custom configurations persist through tab navigation, not browser reloads. Draft notes, presentation state, Field Information edits, and Equipment State visibility can reset on remount.
- Desktop: compact header, primary rail with alarm badge, tree with status indicators, breadcrumb/tabs, two-column main layout (left: combined Properties/Field Information card; right: Controlling Devices and Equipment State cards stacked), equal-width upper cards, three roll-up cards with bars/trends, four-column Key Points, and a full relationship diagram.
- Below 768px: stacked shell with fixed bottom primary navigation, compact tree with status indicators, equipment/location and alarms near the top, compact Equipment State, Notes/Field Information access, and document-tab shortcut. Healthy/progress bars are hidden in roll-up; alarm/override trends remain. Key Points use two columns/controlled overflow; Related Equipment uses a compact clickable list. The separate Trends tab uses compact series values; the Overview trend uses contained horizontal chart scrolling. Narrow tabs can scroll without widening the page.

## Known Limitations and Future Items

- Related equipment header/tree navigation is implemented, but overview/alarm/resource content reuses AHU-SA-01's available dataset; do not present this as complete per-equipment data.
- Device names select the Command Center stub; no device-detail view exists. Other unimplemented primary destinations remain stubs. Do not invent destination screens without approval.
- Document content is mocked; the image is representative, not the actual AHU. No external storage or asset-management integration exists.
- Notes permissions, production state-configuration policy, and deployment/sharing are not implemented. The GitHub repository is private, but there is no shared hosted deployment; localhost is accessible only on the developer machine. Private source alone must not be treated as private website access control.
- Preserve Graphics, historical playback, automated diagnostic warnings, real permissions, and integrations as future/unresolved concepts in the requirements, not implemented features.

## Point Trend – Operate Tab (November 4, 2026 Refactoring)

### Current Implementation

The **Point Trend – Duct Static Pressure** card under the Operate tab has been refactored into a unified **TrendWorkspace** component that renders identically in both inline and expanded-modal views with shared state.

**Layout and Controls:**
- **Header:** "Point Trend – Duct Static Pressure" title with two top-right buttons: Expand (icon) and Reset (text)
- **Time Range:** Compact dropdown selector (24h default) positioned below the title, right-aligned
- **Chart:** Recharts CartesianChart with event markers, series visibility/focus/scale controls, and tooltip/hover interactions
- **Trend View Row:** 
  - Labeled section showing "Trend View"
  - Dropdown selector (340px width on desktop) displaying current trend (e.g., "Point Trend – Duct Static Pressure")
  - "+ Create custom trend" button (Phase 2 only, hidden in Phase 1)
- **Add Point From Workflow:**
  - Labeled section showing "Add point from"
  - Three source options: This equipment, Related equipment, Wider site
  - Each source has equipment/point selection controls and "+ Add point" button
  - Selections are enabled/disabled based on availability and user selection state
- **Selected Points Chips:** Horizontal list of added-point chips, each with name/id and × delete button
- **Shared State:** Inline card and expanded modal use identical state objects from parent PointTrendPanel; changes in one view immediately reflect in the other

### "Add Point From" Sources

**THIS EQUIPMENT**
- Uses the current equipment (e.g., AHU-SA-01)
- User clicks "Select point" dropdown
- Available points from current equipment are listed
- User selects a point
- User clicks "+ Add point"
- Chart series updates immediately
- Point appears in Selected Points list

**RELATED EQUIPMENT**
- User clicks "Select equipment" dropdown
- Related equipment list is displayed (Chiller CH-01, AHU-SA-02, VAV-01–04, etc.)
- User selects an equipment
- User clicks "Select point" dropdown
- Available points for that equipment are listed
- User selects a point
- User clicks "+ Add point"
- Chart series updates
- Allows multi-equipment trend comparison

**WIDER SITE**
- User clicks "Select equipment" dropdown
- Hierarchical equipment picker displays inside dropdown/popover:
  - Location/site group nodes (Riverside Complex, Tower A, Floor 1, etc.) expand/collapse via chevrons
  - Equipment leaf nodes (AHU-SA-01, VAV-01, etc.) have checkboxes for multi-selection
  - No checkboxes on group nodes; group rows are navigation-only
- User may select multiple equipment via checkboxes
- User clicks "Select point" dropdown
- Available points that apply to ALL selected equipment are listed
- User selects a point
- User clicks "+ Add point"
- Chart series updates with multi-equipment series
- Supports site-wide equipment comparison

### Expanded Point Trend Modal

- **Trigger:** Expand button on inline Point Trend
- **Rendering:** Pure React conditional rendering (not native dialog element)
- **Backdrop:** Semi-transparent overlay, clickable to close
- **Modal Content:** Same TrendWorkspace with identical state, larger viewport for chart visibility
- **Header:** Title + Reset button + X close button
- **Close Behavior:** 
  - X button closes modal
  - Escape key closes modal
  - Focus returns to Expand button after close
  - Backdrop click closes modal
- **State Persistence:** Changes made in expanded modal immediately appear in inline view when modal closes

### Removed Point Trend Controls

The Operate Point Trend no longer includes:
- **Three-dot menu:** Removed; controls now inline
- **Duplicate Trend:** No longer available; use Create Custom Trend instead
- **Old Series dropdown:** Replaced by Add Point From workflow
- **View Point action:** Point navigation through point-detail panel; use main Point Details instead
- **Persistent custom-trend saving:** Custom trends are session-only; not saved to backend
- **Rename Trend:** Can be implemented in future if needed

### Custom Trend Behavior (Temporary/Session-Only)

- User can click "+ Create custom trend" button (Phase 2 only)
- A custom trend is created as "Custom Trend" with empty series
- User adds points via "Add point from" workflow
- Custom trend state persists while the Operate tab is active
- Switching tabs or reloading the page clears custom trends
- No backend persistence or storage

## Known Issues

- **Related Equipment connector lines:** Related Equipment connector lines are functional and successfully visualize the equipment hierarchy. However, some connector geometry/alignment still needs visual refinement—for example, some vertical lines do not align perfectly with card boundaries. The diagram layout, structure, node positions, and interaction model are approved and stable. Do not redesign the diagram or rebuild the connector architecture without an explicit request. Any future refinement must preserve the existing layout.

- **Wider Site equipment-tree visual styling:** Wider Site tree currently requires visual refinement. Parent/location nodes (Riverside Complex, Tower A, Floor 1, Second Floor, Third Floor, South Office, East Office, Warehouse) should be rendered as compact navigation-tree rows rather than bordered form-control-like elements. Location/group nodes should use clear ChevronRight (collapsed) / ChevronDown (expanded) treatment without checkboxes. Equipment leaf nodes should use checkboxes for selection. Tree indentation should clearly communicate hierarchy depth (0px, 16px, 32px, 48px). Current styling overrides applied; additional visual refinement may be needed in future iterations. Do not redesign the hierarchy or invent missing equipment without an explicit request. The tree uses only existing equipment data from `src/data/equipment.ts`.

## Equipment Graphic Tab (November 5, 2026)

### Tab Structure Update

The equipment-page tabs have been refactored. The standalone **Trends** tab has been removed from equipment navigation. Trend functionality is now available exclusively through the **Operate** tab via the inline Point Trend card.

**New Tab Order:**
1. Operate
2. Equipment Graphic
3. Points
4. Associated Documents

### Equipment Graphic Implementation

- **Purpose:** Provides a visual representation of the equipment layout and structure
- **Current Implementation:** Displays a static, non-interactive AHU equipment graphic placeholder
- **Image Asset:** `src/assets/ahu-graphic.png` (provided reference image showing AHU schematic with labeled areas)
- **Component:** `EquipmentGraphic.tsx` renders the image centered in a flex container with responsive scaling
- **Styling:** Image uses `object-fit: contain` to maintain aspect ratio; sizing is responsive to viewport width
- **Status:** Placeholder implementation; ready for future interactive enhancements (e.g., clickable zones, real-time overlays, performance indicators)

### Preserved Trend Functionality

The removal of the Trends tab does **NOT** affect trend capabilities in the Operate tab:
- **Point Trend – Duct Static Pressure** remains fully functional in the Operate tab
- **Trend View** selection still available
- **Create Custom Trend** workspace preserved
- **Add Point From** (This equipment, Related equipment, Wider site) fully intact
- **Multi-equipment comparison** supported
- **Selected-series chips** management working
- **Expand/Reset/time-range controls** all available
- **Shared inline/expanded state** maintained

## Run, Build, and Git

Use Node.js 22.12+ on a supported LTS release (24 LTS recommended) and npm. From the repository root:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Vite prints the local URL, normally `http://localhost:5173/`; existing development sessions used `http://localhost:5174/` because 5173 was occupied. `build` runs TypeScript checking and Vite; `preview` serves the generated build locally. There is no configured lint/test script; browser interaction checks supplement the build.

The existing branch is `main`, with `origin` at `https://github.com/Mehra-k/operate-prototype.git`. The repository is private and personally owned by Mehra-k; it is not currently owned by a company organisation. Do not create another repository, change visibility, or deploy without approval. Inspect `git status`, `git log -1`, and the configured remote to establish current checkpoint identity instead of relying on a hard-coded hash.

`.gitignore` excludes dependencies, `dist/`, TypeScript caches, environment/credential files, logs, temporary files, and editor/system state. Source, local assets/provenance, docs, lockfile, and required configuration belong together here. Never commit secrets. Commit and push only when explicitly authorized, and verify `main`/`origin/main` synchronization afterward.

## Complete Feature Documentation (Current Session)

### Active Alarms and Faults (Operate Tab - Top Section)

**Layout & Styling:**
- Red Bell icon (EF In Alarm primary color #BE2434)
- Title: "Active Alarms and Faults"
- Subtitle: "These 2 points have 2 active alarms that require attention."
- Badge: "2 active alarms" with red background
- "View all alarms" link (clickable → opens Points tab with alarm filter)

**Expandable/Collapsible Behavior:**
- Expanded by default on initial load
- Click the collapse/expand chevron to toggle
- Collapsed state shows title + "These 2 points..." text only
- Expanded state shows full alarm table

**Alarm Table Columns** (7 total, left to right):
1. **Point** - Alarm point name (text-only, no icons)
2. **Alarm Message** - Low/High indicator + condition. Examples:
   - Duct Static Pressure: `↓ Low (< 1.5 in wc)` in EF In Alarm red
   - CO2: `↑ High (> 1,000 ppm)` in EF In Alarm red
3. **Acknowledge** - Centered button (clickable, currently non-functional)
4. **Clear** - Centered button (clickable, currently non-functional)
5. **Current Value** - Latest reading with unit. Examples: "1.2 in wc", "1,180 ppm"
6. **Time in Alarm** - Relative time. Examples: "Oct 28, 10:14 AM (38 mins)", "Oct 28, 9:03 AM (3h 48m)"
7. **Action** - "View Point" link → navigates to Point Details for that point

**Grid Alignment:** Header and data rows use identical grid column definitions for perfect vertical alignment. No overlapping controls.

---

### Overview Section (Operate Tab)

**Equipment Properties & Field Information (Combined Card)**
- Single column layout with Properties section above Field Information section
- **Equipment Properties** (not editable):
  - Equipment Name: AHU-SA-01
  - Type: AHU
  - Subtype: Air-handling-unit-1
  - Assigned Space: Building-1A
  - Description: "Supply Air AHU serving Tower A + Floor 1"
  - Last Updated: "Oct 28, 2026, 2:02 PM"
  - Note: Sequence property is NOT shown

- **Field Information** with Edit action (beside heading):
  - Equipment Photo (representative AHU image)
  - Location: "Mechanical Room, M3, North Wall"
  - Access: "Climbs a ladder (tall ladder/scissor lift)"
  - Orientation: "Face west Supply Fan, Coil [Reheat]"

**Equipment State Card** (positioned above Controlling Devices)
- **Customise button:** Labeled exactly "Customise" with settings icon, visible border, matches Equipment State styling
- Clicking Customise opens Equipment State customization panel
- Current states shown:
  - Control Mode: Auto
  - Occupancy: Occupied
  - Operating Mode: Cooling
  - Fan Status: On
  - Outdoor Air Damper: 25% Open

**Controlling Devices Card**
- Title: Controlling Devices
- Three devices listed:
  1. EYC-503 (Ductwork Controller) - Connected - Program/Sequence: AHUJ Standard v2.3
  2. EYC-504 (Ductwork VAV Module) - Connected - (no Program/Sequence)
  3. (Additional connected devices as mock data provides)
- Connected status indicator (green dot + "Connected" text)
- Program/Sequence values shown when available (e.g., "AHUJ Standard v2.3"), "-" when unavailable

---

### Operational Roll-up

**Six Status Categories with Current Mock Data:**

1. **Healthy** - Count: 11/14 (78%)
   - EF Status Colors: Primary #358600, Secondary #A7D987
   - Trend: Stable (+0 delta)
   - Trend Info: "Stable (+0 delta)"
   - Icon color: Green #358600

2. **In Alarm** - Count: 2/14 (14%)
   - EF Status Colors: Primary #BE2434, Secondary #FB6265
   - Trend: Escalating (+1 alarms)
   - Trend Info: "Escalating (+1 alarms)"
   - Icon color: Red #BE2434

3. **In Override** - Count: 1/14 (7%)
   - EF Status Colors: Primary #9781E2, Secondary #9781E2
   - Trend: Flat (0 changed)
   - Trend Info: "Flat (0 changed)"
   - Icon color: Purple #9781E2

4. **Down** - Count: 0/14 (0%)
   - EF Status Colors: Primary #C0570D, Secondary #EAB448
   - Meaning: Communications failure / device not responding
   - Icon color: Orange #C0570D
   - Trend: Flat (0 changed)

5. **Fault** - Count: 1/14 (7%)
   - EF Status Colors: Primary #C0570D, Secondary #EAB448
   - Meaning: Hardware/software error or abnormal state
   - Icon color: Orange #C0570D
   - Trend: Flat (0 changed)

6. **Out of Service** - Count: 2/14 (14%)
   - EF Status Colors: Primary #BE2434, Secondary #FB6265
   - Meaning: Disabled or decommissioned
   - Icon color: Red #BE2434
   - Trend: Flat (0 changed)

**Common Styling:**
- Status titles displayed in **bold text** with respective EF primary colors
- Main value (11/14) is visually dominant
- Trend icon uses corresponding EF primary color
- Heading text: "Trend shows change over last 24 h"
- Healthy, In Alarm, In Override are clickable (filters Points tab)
- Down, Fault, Out of Service are non-interactive in current implementation

**Hover/Focus Popovers:** Not currently implemented; shown as future enhancement

---

### Key Points Section

**Current Implementation:**
- 12 Key Point cards displayed in a responsive grid
- Default selected points (currently showing 6-8 visible on desktop): Zone Temp, Supply Air Temp, Duct Static Pressure, Supply Fan Speed, CO2, Outdoor Air Damper (others scrollable)

**Customise Button:**
- Located top-right of Key Points header
- Label: "Customise"
- Icon: Settings/sliders icon (blue, EF blue color)
- Styling: Visible border, white background, blue text, matches Equipment State Customise button
- Click behavior: Opens Customise Key Points dialog

**Customise Key Points Dialog:**
- Title: "Customise Key Points" with close (X) button
- Layout: Vertical list, one point per row
- Each row shows: [checkbox] [Point Name] [Value] [Unit] [Status]
- Example row: ✓ Zone Temp | 72.4 | °F | Normal
- All 12 available points shown with checkboxes
- Current Key Points are pre-checked when dialog opens
- Points NOT currently shown as Key Points are unchecked
- Draft selection (changes during editing) is separate from applied selection (displayed Key Points)
- Bottom buttons:
  - **Cancel:** Closes dialog without applying changes. Draft changes are discarded.
  - **Apply:** Updates visible Key Points to match checkbox selection, then closes dialog. Minimum one point must be selected.
  - **X (close button):** Closes dialog without applying changes. Draft changes are discarded.
  - **Escape key:** Same behavior as X/Cancel (closes, discards changes)

**Session Persistence:**
- All customization is temporary/session-only
- Page refresh resets to default Key Points
- No localStorage or backend persistence

**Point Details Navigation:**
- Clicking a Key Point card title opens Point Details panel for that point
- Point Details shows value, unit, status, setpoint info, trend, and alarm history

---

### Point Trend – Duct Static Pressure (Inline & Expanded)

**Inline Workspace (on Operate tab):**
- Title: "Point Trend – Duct Static Pressure"
- Header buttons: Expand (↗) | Reset
- Expandable modal version shares exact same state and functionality

**Time Range Control:**
- Dropdown with options: Last 4 Hours, Last 12 Hours, Last 24 Hours (default), Last 7 Days, Custom Range
- Selecting Custom Range shows date/time input fields (Start, End, Apply/Cancel buttons)

**Series Legend & Chart:**
- Two default series displayed:
  1. Duct Static Pressure (blue line)
  2. Duct Static Pressure SP (blue dashed line - setpoint)
- Each series has: [checkbox] [Series Name] [Focus button]
- Checkbox toggles series visibility
- Focus button highlights one series and hides others; scales view to focused series; clicking again clears focus
- Chart displays with time axis and value axis
- Y-axis shows pressure values (e.g., 1.2–1.8 in wc)
- X-axis shows time labels (8:00 AM → 8:00 AM next day)

**Event Markers on Chart:**
- Three types: Alarm started (red ●), Override applied (blue ●), Setpoint changed (black ●)
- Markers positioned at exact timestamp on chart
- Clicking/hovering on marker shows event details panel:
  - Event type (e.g., "Alarm started")
  - Timestamp (e.g., "Oct 28, 10:14 AM UTC")
  - Description (e.g., "Alarm started for Duct Static Pressure")
  - Close (X) button

**Event Legend Buttons:**
- Below chart: "Alarm started" | "Override applied" | "Setpoint changed"
- Buttons are clickable; clicking shows event details panel
- Buttons not currently filtering chart display (future feature)

**Scale Control** (for focused series):
- Appears when a series is focused
- Slider: 0.5x – 1x (auto) – 2x scale
- Menu button (↓) for scale options:
  - Auto scale (radio button)
  - Manual scale (radio button) with Min/Max input fields
  - Apply, Reset Scale, Done buttons

**Lower Controls (Two-Column Layout):**

**LEFT COLUMN: Trend View**
- Title: "Trend View"
- Dropdown: "Point Trend – Duct Static Pressure" (default), "Reheat + Supply Air Temperature + Discharge Air Temperature" (alternative preset)
- **"+ Create custom trend" button** (RESTORED): Click to enable custom mode
- Button styling: Matches Trend View dropdown (same height, border, padding, colors)

**RIGHT COLUMN: Create Custom Trend (appears when "Create custom trend" button clicked)**
- Title: "Create Custom Trend"
- Subtitle: "Add Point From"
- Source selector dropdown: "Current equipment" (default), "Related equipment", "Wider site"

**Source: Current Equipment**
- Point selector dropdown: "Select point" (default), then available points (Airflow, Airflow Setpoint, Reheat, Supply Air Temp, Discharge Air Temp, CO2, Supply Fan Speed, Mixed Air Temp, Return Air Temp, etc.)
- "Add point" button: Disabled until point selected, then enabled
- Click "Add point" to add selected point to custom trend

**Source: Related Equipment**
- Equipment selector dropdown: "Select equipment" (default), then related equipment (Chiller CH-01, AHU-SA-02, VAV-01, VAV-02, VAV-03, VAV-04)
- When equipment selected, shows point selector (same as above)
- "Add point" button to add selected equipment's point to trend

**Source: Wider Site**
- Equipment picker button: "Select equipment" (or "N selected" if multiple checked)
- Clicking opens equipment hierarchy tree/popover:
  - Site/location nodes: Collapsible (ChevronRight when collapsed, ChevronDown when expanded)
  - Equipment leaves: Checkboxes (no chevron)
  - Multi-select: Can check multiple equipment
  - Click outside or close button to close tree
- When equipment(s) selected (≥1), shows point selector
- "Add point" button to add selected point from first selected equipment

**Selected Points Display:**
- Below Add Point From controls, shows selected series as removable chips
- Example: [Duct Static Pressure ×] [Duct Static Pressure SP ×] [Airflow ×]
- Clicking X removes that series from custom trend
- Chips wrap naturally

**Multi-Equipment Comparison:**
- When points are added from different equipment, chart shows distinct series colors
- Each series labeled with: "[Equipment Name] · [Point Name]"
- Examples: "AHU-SA-01 · Duct Static Pressure", "AHU-SA-02 · Airflow", "VAV-01 · Zone Temp"
- Remove-series action (chips with ×) removes that equipment/point comparison

**Add Point Button Enablement Logic:**
- Disabled when no valid point selected
- Enabled when equipment and point both selected (for Related equipment / Wider site)
- Disabled when trying to add same point twice (duplicate prevention)

**Reset Button:**
- Located in header next to Expand
- Clicking Reset:
  - Returns to default "Point Trend – Duct Static Pressure" preset
  - Clears any custom comparison points
  - Clears temporary custom trend state
  - Resets time range to Last 24 Hours
  - Resets all series visibility
  - Returns to "Current equipment" source in Add Point From (if still in custom mode)
  - Clears any focused series or scale editing

**Expand Button:**
- Opens full-screen modal version of Point Trend workspace
- Modal contains exact same Trend View + Add Point From sections
- Shared state: Changes in modal reflect in inline view and vice versa
- Modal can be closed via:
  - X button (top-right)
  - Escape key (returns focus to Expand button)
- Opening modal preserves:
  - Selected trend
  - Selected comparison points
  - Selected source
  - Time range
  - Event markers
  - Any focus/scale settings

**Removed Controls (NOT implemented):**
- Old three-dot menu (removed)
- Duplicate Trend (removed)
- Old Series dropdown (replaced with checkbox legend)
- Lower-left "View Point" action (removed)
- Rename Trend (removed)
- Persistent custom-trend saving (only session-only custom trends)

---

### Points Tab

**Current Implementation: Searchable, Paginated Points Table**

**Table Columns** (6 total, left to right):
1. **Point Name** - Clickable link (navigates to Point Details), largest column
2. **Type** - Point type code (AI, AO, BO, B0), compact, centered
3. **Current Value** - Latest reading value (e.g., "72.4", "1,180", "25%"), left-aligned
4. **Unit** - Unit of measurement (°F, ppm, %, in wc, —), compact
5. **Last Read** - Relative time (e.g., "2 min ago", "12 hours ago"), medium width
6. **Status** - Status badge (Healthy/Normal, Alarm/Low/High, Override, Down, Fault, Out of Service) with EF color

**Status Badge Colors:**
- Healthy / Normal: Green (#358600)
- Alarm / Low / High: Red (#BE2434)
- Override: Purple (#9781E2)
- Down: Orange (#C0570D)
- Fault: Orange (#C0570D)
- Out of Service: Red (#BE2434)

**Search Feature:**
- Search input box at top of table
- Real-time filtering across multiple fields (case-insensitive):
  - Point Name
  - Point ID
  - Type (AI, AO, etc.)
  - Current Value
  - Unit
  - Status
- Example: "temp" matches 6 points (Zone Temp, Supply Air Temp, etc.)
- Example: "low" matches Duct Static Pressure (status is Low/Alarm)
- Empty search shows all 12 points

**Filter Icon:** Present but non-functional (placeholder for future enhancement)

**Items Per Page Selector:**
- Dropdown: 10 items (default), 25 items, 50 items
- Changes pagination dynamically
- Resets to page 1 when changed
- With 12 points and 10 per page setting, shows "Page 1 of 2"

**Pagination Controls:**
- First page button (disabled on page 1)
- Previous page button (disabled on page 1)
- Page indicator: "Page X of Y"
- Next page button (disabled on last page)
- Last page button (disabled on last page)

**Dynamic Item Count:**
- Shows current filtered count: "X items"
- Updates when search changes
- Example: "12 items" initially, "6 items" when searching "temp"

**Empty State:**
- When search matches no points: "No points match your search" message
- "Clear search" button to reset

**Point Details Navigation:**
- Clicking a point name opens Point Details panel
- Shows value, unit, status, setpoint info, trend, and alarm history
- Back button returns to Points tab and preserves search state

**All 12 Points Currently Available:**
Zone Temp (AI), Supply Air Temp (AI), Duct Static Pressure (AI), Supply Fan Speed (AO), CO2 (AI), Outdoor Air Damper (AO), Return Air Temp (AI), Reheat (B0), Discharge Air Temp (AI), Mixed Air Temp (AI), Airflow (AI), Airflow Setpoint (AI)

---

### Equipment Graphic Tab

**Current Implementation:**
- Static AHU equipment graphic (PNG image)
- Non-interactive placeholder
- Shows representative air-handling unit diagram
- Future enhancement: Interactive component selection, status overlays

---

### Notes Section (Right Sidebar, Operate Tab)

**Layout:**
- Vertically collapsible/expandable panel
- Default: Expanded
- When collapsed: Only "↓ Notes" button visible at top-right of Operate section
- When expanded: Full Notes panel width appears

**Collapse/Reopen:**
- Collapse chevron (↓) to close panel
- "↓ Notes" button appears at top-right to reopen
- Panel dimensions adapt when collapsed

**Notes Content:**
- "Add Note" button
- Existing notes listed (mock data)
- Delete action on each note (not currently functional)
- Checkmark/resolve removal: Not currently implemented (future feature)

---

### Related Equipment Section

**Hierarchy Diagram (Desktop):**
- Chiller CH-01 (Upstream Source) - clickable
- AHU-SA-01 (Current Equipment, blue highlight) - not clickable
- AHU-SA-02 (Serving System) - clickable
- VAV-01–VAV-04 (Served Space) - clickable (each scrollable in list)
- "+9 more VAVs" (non-navigable aggregate)
- Visual connectors showing relationships

**Mobile List View:**
- Same equipment shown as list items
- Preserves hierarchical relationship labels (Upstream Source, Current Equipment, Serving System, Served Space)

**Legend:**
- Normal (green indicator)
- Alarm (red indicator)
- Override (purple indicator)
- Offline (gray indicator)

**Controls:**
- Expand (↗) - shows full diagram on mobile or opens dedicated view
- Zoom (+/− buttons) - scales diagram view
- Reset - returns to default zoom level
- All controls functional

**Navigation:**
- Clicking an equipment name:
  - Updates main equipment header
  - Highlights selected node in tree/diagram
  - Shows Back button to return to AHU-SA-01
  - Clears any Point selection
  - Returns to Operate tab (default)

**Known Limitations:** None documented in current state

---

### Associated Documents Tab

**Implementation Preserved:**
- Five document entries with title, description, file type
- Preview and Download actions on each document
- Equipment Photos section shows gallery of three images
- Non-functional but placeholder structure in place

---

### Equipment Hierarchy (Left Sidebar)

**Structure:**
- Riverside Complex (parent, collapsible)
  - Tower A (group, collapsible)
    - Floor 1 (group, collapsible)
      - AHU-SA-01 ✓ (default selected, bold)
      - AHU-SA-02
      - Chiller CH-01
      - VAV-01, VAV-02, VAV-03
  - Second Floor (group)
  - East Office
  - Warehouse

**Status Indicators:**
- Green dot: Healthy/OK
- Red dot: Alarm
- Orange dot: Down/Fault
- Purple dot: Override
- Badge on parent nodes: Aggregated alarm count (e.g., "2" in red badge on Riverside Complex)

**Interactions:**
- Click equipment to select and navigate
- Expand/collapse group nodes
- Mobile: Condensed hierarchy, expand as needed

---

### Primary Navigation (Main Menu)

**Menu Items** (top-to-bottom):
- Home
- Equipment (current section, AHU-SA-01 selected)
- Alarms & Faults (alarm count badge: "2")
- Schedules
- Command Center
- Reports
- Trends (separate Trends-tab experience)
- Settings
- Help
- Sign out

**Alarm Count Badge:**
- Red background with white text
- Shows active alarm count (e.g., "2 active alarms")
- Only displayed on "Alarms & Faults" item
- Updates dynamically based on active alarm data

---

### Tab Order (Equipment Page)

Current tab order for AHU-SA-01:
1. **Operate** (default, active)
2. **Equipment Graphic** (placeholder AHU image)
3. **Points** (searchable Points table)
4. **Associated Documents** (document entries + photos)

---

### EF Color System (Authoritative Palette)

**Used throughout all components:**

| Status | Primary Color | Primary RGB | Secondary Color | Secondary RGB | Usage |
|--------|---------------|------------|-----------------|--------------|-------|
| Healthy / OK | #358600 | rgb(53, 134, 0) | #A7D987 | rgb(167, 217, 135) | Icons, text, status badges, roll-up |
| In Alarm | #BE2434 | rgb(190, 36, 52) | #FB6265 | rgb(251, 98, 101) | Alarm indicators, high/low arrows, badges |
| In Override | #9781E2 | rgb(151, 129, 226) | #9781E2 | rgb(151, 129, 226) | Override status, badges |
| Down | #C0570D | rgb(192, 87, 13) | #EAB448 | rgb(234, 180, 72) | Communications failure, equipment offline |
| Fault | #C0570D | rgb(192, 87, 13) | #EAB448 | rgb(234, 180, 72) | Hardware/software errors |
| Out of Service | #BE2434 | rgb(190, 36, 52) | #FB6265 | rgb(251, 98, 101) | Decommissioned/disabled equipment |

---

### Session Persistence & State Management

**Preserved Across Navigation:**
- Equipment selection
- Current tab (Operate, Points, etc.)
- Point Details when opened
- Filtered Points view
- Active Point Trend view
- Custom Trend state (while in Create Custom Trend mode)
- Equipment hierarchy state
- Expand/collapse states

**Reset on Page Refresh:**
- All customization lost (by design - session-only)
- Returns to default: AHU-SA-01, Operate tab, no custom trends
- Notes not persisted (session-only)

**Note:** All state is managed via React `useState`, not localStorage or backend. No persistence beyond current session.

