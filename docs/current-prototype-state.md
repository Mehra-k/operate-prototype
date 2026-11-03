# Current Operate Prototype State

Checkpoint date: November 3, 2026 at 13:37 UTC. Read this first when continuing in a new Agent chat, then inspect the referenced code and [requirements](operate-requirements.md). The repository, not past conversation history, is the source of truth.

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
- `src/components/OperationalRollup.tsx`, `KeyPointsSection.tsx`, `FilteredPoints.tsx`, `PointDirectory.tsx`, `PointDetails.tsx`: shared status/point views and interactions.
- `src/components/RelatedEquipment.tsx`: desktop diagram, mobile list, legend, Expand/Zoom/Reset, and equipment selection.
- `src/components/PointTrendPanel.tsx` and `PointTrendChart.tsx`: Overview trend management and separate Recharts rendering. `TrendsExperience.tsx` is the existing separate Trends-tab experience. Chart components are lazy-loaded and share Recharts.
- `src/data/equipment.ts`: site/equipment tree with `EquipmentStatus` field (alarm/ok/override/fault), relationship nodes, and status-based rendering. `operateOverview.ts`: shared AHU properties (Sequence removed), controllers, states, alarms, points, roll-up counts/trends, and point formatting/lookup.
- `src/data/trends.ts`: catalog, presets, mock values/events, and additional point-detail records. `overviewTrends.ts`: explicit timestamped samples/events and protected Overview presets, including pressure SP.
- `src/data/equipmentResources.ts`: initial notes, five document entries with preview/download support, and field-location values. `statusColors.ts`: authoritative shared EF palette.
- `src/styles.css`: shared desktop/mobile styles including status indicators, alarm badges, and layout updates. `src/assets/air-handling-unit.jpg` is a representative public-domain photo; provenance is in `src/assets/README.md`.
- `docs/operate-requirements.md`: original FigJam context, implemented updates, EF mappings, and future/unresolved items. Project setup is in `README.md`, `package.json`, `package-lock.json`, `tsconfig.json`, and `vite.config.ts`.

## Implemented Views and Interactions

- Default equipment: AHU-SA-01. Tabs, in order: Operate, Points, Trends, Associated Documents.
- Operate: full-width Active Alarms above the tabs; combined Equipment Properties and Field Information card (single column with Properties above Field Information); Controlling Devices and Equipment State cards stacked below in left column on desktop; roll-up; compact Key Points; inline pressure trend directly above Related Equipment; Notes in the right-side area (collapsible).
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
- Notes: On desktop, Notes is a right-side column visible by default within the Overview area. The Notes header shows a ChevronLeft collapse control. Clicking it hides the entire Notes column and expands the main content area to full available width. No empty Notes column remains. Main content cards preserve their existing hierarchy and proportional widths. When Notes is collapsed, a "Notes" reopen button appears on the same row as the "Overview" heading, aligned to the far right. This button does NOT appear beside Active Alarms or at the bottom of the page. The Open Notes button remains visible without scrolling. Clicking the Notes button restores the Notes right-side column, and the Overview-level Notes button disappears. The original two-column layout is restored when Notes is reopened. Notes state and content (added notes, resolved status, input draft) are preserved during collapse and reopen. On mobile, Notes behavior follows the existing responsive design and is not affected by the collapse control.
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
