# Operate Requirements

Source: [Operate_Figjam modification, node 618:3013](https://www.figma.com/board/JCDjrqRMvGF9Pzktfi4Ehz/Mehra-s-sand-box?node-id=618-3013).

This document records the current mockup as reference and the annotations as the target direction. It does not specify or implement screens beyond what the board shows.

## Existing structure and screens shown

The desktop mockups show an equipment detail experience with:

- A persistent application navigation rail and a site/equipment tree.
- An equipment page header with breadcrumb/context and equipment identity.
- An Overview area containing Equipment Properties, Controlling Devices, and Equipment State.
- An Operational Roll-up for healthy, alarmed, and overridden points, followed by Key Points.
- Associated equipment documents, a Related Equipment diagram, and trend charts lower on the page.

The board shows this as one equipment page with sections, not as a set of independently defined routes. A dedicated point-detail experience is requested by an annotation, but is not fully drawn. The left/older mockup is the reference for existing structure; the annotated mockup and notes indicate proposed changes. Preserve existing behavior unless a requirement below explicitly changes it.

## Desktop requirements

- Keep the equipment detail page as the central desktop workspace, with its existing navigation, equipment context, overview, and lower-page relationship and trend sections.
- The first release is intended to show read-only, preconfigured dashboards after equipment and points have been modelled. Do not add editable equipment graphics or floor plans to this release.
- The board does not define desktop breakpoints, exact card dimensions beyond the Key Points note, or a full page layout specification. See Unresolved items below.

## Alarm context and navigation

- **Target direction:** Show an alarm-status indicator beside affected equipment in the left tree so users can identify equipment in alarm without comparing names or opening items one by one.
- **Target direction:** Place a prominent alarm summary at the top of the equipment page. Include active alarm count, affected point names, current values, thresholds or alarm reasons, timestamps, and direct `View point` or `View all alarms` actions.
- **Interaction:** Make alarm and override roll-up counts clickable. Selecting a count such as `2 in alarm` should reveal those points or navigate to a filtered point list; the board does not choose between these behaviors.
- **Interaction:** Deep-link to the exact selected point. For example, selecting CO2 should open its details, not a generic Points page.
- **Interaction:** An alarm notification should open the affected equipment or controller, depending on the alarm source.
- **Interaction:** When navigating from related equipment to another unit, provide a clear Back action to return to the original troubleshooting context.
- **Unresolved:** A note asks whether the roll-up should move higher. Its final position relative to the alarm summary and page header is not specified.

## Equipment overview

- **Preserve:** Keep Equipment Properties visible, particularly equipment name, type, subtype, and assigned location.
- **Target direction:** Improve the Controlling Devices card. Keep device names clickable; show programme/sequence name and version when available; support multiple controllers without excessive empty space.
- **Interaction, suggested:** Consider opening local quick information first, with a secondary `Go to device` action. Keep the destination appropriate for an operator rather than automatically opening full configuration tools.
- **Target direction:** Provide access to associated equipment documents, including written sequences, drawings, manuals, point lists, and other equipment files.
- **Release constraint:** Keep the initial dashboards read-only and preconfigured. Do not add editable equipment graphics or floor plans.
- **Future idea:** If graphics are added later, keep them functional and schematic, prioritizing troubleshooting clarity over decorative realism. Put graphics in a separate third tab rather than duplicating information on the Operate page. A profile-level default landing tab could be Operate, Points, or Graphics.
- **Unresolved:** The quick-information panel is phrased as a consideration; whether it is required, and what it contains, is not decided. The later Graphics tab and profile default are not first-release requirements.

## Equipment State

- **Target direction:** Repurpose Equipment State to show the equipment's operating state, such as Auto or Manual, Occupied or Unoccupied, and Heating, Cooling, or Ventilation mode.
- **Target direction:** Keep Equipment State separate from Key Points. State communicates a broad operational answer; Key Points show measurements such as temperature, pressure, airflow, and setpoints.
- **Target direction:** Remove the current `In Alarm: Yes` and `In Override: No` pills from Equipment State; the Operational Roll-up communicates alarm and override information as counts.
- **Interaction:** Make Equipment State configurable. Provide equipment-type defaults and allow authorized users to adjust which state values appear.
- **Unresolved:** The exact state values and defaults by equipment type, and which roles may configure them, are not specified.

## Operational Roll-up

- **Preserve and reposition:** Keep the Healthy, In Alarm, and In Override roll-up near the top of the equipment page.
- **Target direction:** Use counts in the roll-up instead of the binary alarm/override pills in Equipment State.
- **Interaction:** Counts lead to the corresponding points, either by revealing those points or opening a filtered point list. See the unresolved interaction choice under Alarm context and navigation.
- **Unresolved:** The annotation asks whether this area should be higher but does not state its final ordering.

## Key Points

- **Target direction:** Use approximately two rows as the default maximum. The note gives about four points for a VAV and roughly ten or eleven for an air handler as examples; too many cards undermine the purpose of a focused Key Points area.
- **Target direction:** If configured points exceed the visible area, use internal scrolling or another controlled overflow treatment.
- **Target direction:** Keep Key Point cards consistently sized. The Outdoor Air Damper card should not stretch across the full container.
- **Interaction:** Make every Key Point card clickable and open that exact point's details.
- **Preserve:** Keep `View all points` as a secondary route to the full point list, including for field troubleshooting.
- **Target direction:** Alarmed points should show useful status context: high/low state, alarm threshold, current value and unit, last-updated time, and optionally direction of change.
- **Unresolved:** The two-row limit is described as an approximate default maximum, not a strict cap; the board does not specify the final overflow behavior or exact per-equipment limits.

## Point Details

- **Target direction:** Create a dedicated point-detail experience containing current value and unit, high and low alarm thresholds, why the point is in alarm, alarm start time, point trend, alarm history, override history where available, and point configuration and alarm parameters.
- **Interaction:** Preserve the selected point context when arriving from an alarm card, Key Point, or chart. Open the exact point rather than requiring users to find it again.
- **Unresolved:** The board lists the information for this experience but does not draw its full layout or define additional point-detail interactions.

## Related Equipment

- **Preserve:** Keep the relationship diagram.
- **Interaction:** Make each equipment node clickable. The examples AHU-SA-02, Chiller CH-01, and a VAV should navigate to that equipment.
- **Interaction:** Synchronize the left navigation tree with the equipment selected in the relationship diagram.
- **Preserve and clarify:** Retain status coloring and add a visible legend for Normal, Alarm, Override, and Offline.
- **Preserve:** Keep Expand, zoom, and Reset controls.
- **Future idea:** Consider warning that many downstream units are in alarm and suggesting investigation of parent equipment first. The threshold and automated diagnosis are described as configurable, longer-term concepts, not confirmed immediate requirements.
- **Unresolved:** The board does not define the exact relationship-node selection behavior when the destination equipment is not in the current tree context.

## Trends

- **Target direction:** Provide pre-built comparisons, including airflow with airflow setpoint, and reheat with supply-air and discharge-air temperatures.
- **Interaction:** Allow users to duplicate a pre-built trend and customize the copy; allow custom trend views to be removed.
- **Interaction:** Allow points to be added from the current equipment, related equipment, or the wider site. Provide time-range selection.
- **Interaction:** Show values when hovering or moving through the chart. Allow a series to be focused and its scale adjusted.
- **Target direction:** Add chart event markers for events such as alarm started, override applied, and setpoint changed.
- **Interaction:** Associate each chart series with its source without making the line itself an accidental navigation target. Use the legend, tooltip, event list, or a `View point` action to reach the exact point or equipment.
- **Future idea:** Design with a possible historical playback or "time-machine" capability in mind. Moving the equipment state back to a selected time is a future architecture consideration, not a first-release change.
- **Unresolved:** The board does not define the full trend customization model, available time ranges, or exact behavior for adding and scaling series.

## Notes and field information

- **Target direction:** Add a prominent Notes area for immediate context, such as waiting for parts, a known recurring problem, an alarm that can temporarily be ignored, intentionally overridden points, or a seasonal setpoint adjustment.
- **Target direction:** Record note author, date, and time automatically.
- **Interaction:** Allow notes to be deleted or resolved, subject to permissions.
- **Target direction:** Include available field-location information, such as physical location, ceiling tile or access location, orientation guidance, photos, and related drawings.
- **Future idea:** Keep future asset-management integration in mind for organizations that manage maintenance and parts elsewhere.
- **Unresolved:** Permission levels are raised for consideration, including a possible higher permission requirement to delete an administrator's note; the policy and role rules are not decided.

## Mobile

- **Entry paths:** Support a user opening an alarm notification remotely and a technician opening the equipment page while physically at the unit.
- **Navigation:** Alarm notifications should open the exact affected equipment or controller, based on the alarm source.
- **Prioritize:** Alarm reason, equipment identity and location, Equipment State, alarm and override counts, Notes, and direct access to affected points.
- **De-emphasize or remove:** A large Controlling Devices card unless the controller caused the alarm, the healthy-point progress bar, the full Key Points grid, a large relationship diagram, and complex trend comparisons.
- **Interaction:** Provide an obvious `View all points` action for field troubleshooting.
- **Unresolved:** The board does not specify mobile page ordering, breakpoints, navigation treatment, or which content should be hidden versus collapsed. It asks to de-emphasize or remove several areas without choosing a specific treatment.

## Unresolved items

- The relative placement of the Operational Roll-up and alarm summary.
- Whether selecting alarm/override counts reveals points inline or opens a filtered list.
- Whether the Controlling Devices quick-information panel is required and what it contains.
- Equipment State defaults, the full set of possible values, and configuration permissions.
- Note permission and deletion/resolution policy.
- Desktop breakpoints and detailed layout behavior; mobile ordering and hide/collapse behavior.
- Detailed layouts for Point Details and the extent of trend customization.
- The relationship diagram's destination-selection behavior outside the current tree context.

## Future ideas

These are not changes required for the initial prototype unless later confirmed:

- A separate Graphics tab and profile-level default landing tab.
- Historical playback or a "time-machine" view of equipment state.
- Configurable parent-equipment alarm warnings or automated diagnosis.
- Integration with external asset-management systems.

## Implemented Prototype Updates

Current checkpoint: November 3, 2026. This includes the November 2 approved UI refinements, the established EF palette, and the latest Operational Roll-up trend rows. For a repository-based continuation guide, see [Current Prototype State](current-prototype-state.md).

The preceding sections preserve the original FigJam requirements, unresolved questions, and future ideas. This section records the subsequently approved prototype refinements and takes precedence when describing the current implemented UI. Items described here are local prototype behavior, not production services or permission policies.

### Controlling Devices

- Controller/device connection status uses `Connected`, replacing the earlier `Online` terminology. Both controller records use the shared status type and mock data so equipment views inherit the wording consistently.
- Device names remain clickable through the existing device-navigation callback. The separate `View device details` link was removed to avoid duplicate navigation.
- There is no implemented controller-detail screen: this callback still selects the Command Center stub. It must not be described as a completed device-detail workflow.

### Alarm Summary and Equipment State

- The Active Alarm Summary spans the full top content area above the navigation tabs. It retains the existing point names, readings, units, conditions, timing, `View Point`, and `View all alarms` actions.
- The main Active Alarms header icon is a red Bell/alarm icon using the EF In Alarm primary color (`--ef-status-alarm-primary`).
- The summary table uses the following column order: **Point** | **Alarm Message** | **Acknowledge** | **Clear** | **Current Value** | **Time in Alarm** | **Action**.
- **Point column** displays point names as text only (e.g., "Duct Static Pressure", "CO2"). No alarm icons or status indicators appear beside point names.
- **Alarm Message column** displays the alarm condition text preceded by a Low (↓ downward arrow) or High (↑ upward arrow) direction indicator. Low alarms display `[↓] Low (< threshold)` format; High alarms display `[↑] High (> threshold)` format. Direction icons use the EF In Alarm primary color.
- **Acknowledge column** displays a centered checkbox control directly under the "Acknowledge" heading. Each alarm row has its own Acknowledge button, horizontally centered within the column.
- **Clear column** displays a centered circle/cancel control directly under the "Clear" heading. Each alarm row has its own Clear button, horizontally centered within the column.
- **Current Value column** displays the point's current reading and unit (e.g., "1.2 in wc", "1,180 ppm").
- **Time in Alarm column** displays the alarm timestamp and duration in parentheses.
- **Action column** displays the "View Point" link with navigation chevron.
- Header and data rows use the same grid-template-columns definition to maintain perfect vertical alignment. No overlapping headers or misaligned controls.
- Acknowledge and Clear controls are visually grouped with the Alarm Message, remaining close together without excessive spacing.
- Compact Acknowledge and Clear controls provide local toggle/request feedback; Clear does not clear a live alarm, remove the mock record, or change the mock alarm counts.
- The current status treatment uses the [Established EF Status Colours](#established-ef-status-colours) below: Low/High threshold alarms use EF In Alarm red, Override uses EF Overridden purple, and Normal/Healthy/Connected use EF OK green. Offline uses EF Down / Communication Failure orange. This supersedes the earlier blue Low-alarm and orange Override implementation.
- Equipment State retains the existing control mode, occupancy, operating mode, fan status, and outdoor-air-damper values. `Customize` allows local selection of visible fields. Alarm and override counts are not duplicated as binary pills in this card.

### Operational Roll-up and 24-Hour Trends

- All three desktop cards retain the status name and count at the top, the existing progress/status bar and percentage, and a compact trend row underneath. Cards share a consistent height and alignment.
- The supporting text directly under the section heading is `Trend shows change over last 24 h`.
- Healthy remains `11 / 14` and displays `Trend: Stable (+0 delta)` with a flat/right direction indicator using EF OK green.
- In Alarm remains `2 / 14` and displays `Trend: Escalating (+1 alarms)` with an upward direction indicator using EF In Alarm red.
- In Override remains `1 / 14` and displays `Trend: Flat (0 changed)` with a flat/right direction indicator using EF Overridden purple.
- Trend labels, changes, and direction are local values on the shared `operationalRollup` mock records; they do not imply live calculations, diagnosis, or backend history.
- In Alarm still opens the Points tab filtered to Duct Static Pressure and CO2. In Override still opens the Points tab filtered to Supply Fan Speed. Healthy does not gain a new interaction.
- Mobile preserves the approved priority treatment: Healthy and large progress bars are hidden; the alarm/override cards keep their trend rows and tap targets. No other section or navigation flow was redesigned for this update.

### Compact Key Points

- Key Point cards display only point name, current value and unit, status, last-updated time, and the right-side navigation chevron.
- SP/setpoint and alarm-condition text were removed from the cards. Trend-arrow icons and decorative status dots were also removed; the navigation chevron remains.
- Padding, internal gaps, and fixed card heights were reduced. All cards remain consistently sized within each responsive layout, using four desktop columns and two phone columns with controlled overflow.
- Normal, Low, High, and Override states and their status colors are preserved through shared card styles.
- Every card still opens the exact selected Point Details. Setpoints and available alarm parameters remain in Point Details; they were not removed from the underlying mock data.
- `View all points` continues to open the existing Points directory. The directory contains the eight named Key Points supplied by the reference; the roll-up still represents 14 total points. The UI does not fabricate the six unspecified point records.

### Field Information and Upper Cards

- Field Information was moved out of the lower resource stack and is rendered once beside Equipment Properties in the upper information-card area.
- The desktop upper area uses a balanced two-column grid: Equipment Properties and Field Information share the first row; Controlling Devices and Equipment State occupy the next row. Cards fill the available main-column width with consistent gaps.
- Field Information retains Location, Access, and Orientation, with a representative equipment image on the left and an `Edit` action at the top-right. Smaller layouts stack the image and information.
- The local image uses `object-fit: cover` to crop without distortion. It is a public-domain representative air-handling-unit photograph, not a photograph of AHU-SA-01. Source and license are recorded in `src/assets/README.md`.
- Edit opens a local form for the three field-information values. Save updates the mounted card; Cancel leaves the values unchanged. There is no backend persistence or permission model, and these edits can reset when the view is remounted.

### Associated Documents

- The equipment tabs are `Operate`, `Points`, `Trends`, and `Associated Documents`, with Associated Documents immediately to the right of Trends.
- The existing Associated Documents component and all five local entries were moved into that tab. There is no duplicate documents panel in the Overview sidebar or farther down the page.
- The tab preserves the written sequence, drawing, point list, maintenance manual, and equipment-photo archive entries, including document names, type/size metadata, selection highlighting, and button accessibility.
- Document selection survives tab switches during the current app session. Selection does not download or fetch documents from external storage.
- The mobile Documents shortcut opens the Associated Documents tab instead of linking to the removed Overview section.

### Expanded Notes

- Notes is the sole panel in the available right-side resource area. It fills that area's width and is sized against the upper information/roll-up region rather than stretching an empty panel alongside the entire chart stack.
- The note-entry area is open by default and includes the note input, `Cancel`, and `Add note`. No preliminary Add Note button is required.
- Cancel clears the draft without hiding the entry area. Adding a nonblank note creates a local record and clears the input while keeping it open.
- Existing notes remain visible with author, date, and time. Adding a note automatically supplies the local mock author and current date/time; resolving and deleting notes remain available without real permission checks.
- Added notes, resolved states, and deletions survive tab switches during the app session. They reset on reload; an unsent draft can reset when Notes is remounted.
- Notes stacks on smaller screens and uses controlled history scrolling. Permission enforcement remains a future requirement, not an implemented restriction.

### Overview Point Trend

- AHU-SA-01 Overview includes a reusable Point Trend panel directly above Related Equipment, spanning the full main content column. The separate existing Trends tab remains available.
- The default pre-built view is `Point Trend - Duct Static Pressure`, displaying Duct Static Pressure and Duct Static Pressure SP, using the existing pressure reading/setpoint data. The visible title uses an en dash between Point Trend and the point name.
- The chart shows timestamped samples, an `in wc` axis for the pressure comparison, a primary area/line and a dashed setpoint line, series controls, and a top-right range selector and overflow menu.
- Ranges are Last 4 Hours, Last 12 Hours, Last 24 Hours (default), and Last 7 Days. Hover shows a selected-time line, UTC date/time, and visible series values with units.
- Series can be shown/hidden, focused, and scaled. A selected series has an explicit `View point` action that opens its exact existing Point Details. Chart lines do not navigate.
- Alarm started, Override applied, and Setpoint changed markers expose local event descriptions/timestamps by hover, click, or keyboard selection without leaving the chart.
- The second pre-built comparison contains Reheat, Supply Air Temperature, and Discharge Air Temperature. Pre-built Overview views are protected from series/name edits; duplicate a preset before customizing it.
- Custom Overview trend views can be created, duplicated, renamed, removed, and have series added/removed from current equipment, related equipment, or the wider site. View configurations survive Point Details/tab navigation but reset on reload.
- Configuration, timestamped samples/events, and chart rendering are separate. The seven-day samples are generated from local mock sequences and are not real historical measurements. No API, historical equipment playback, or time-machine behavior is implemented.
- Desktop/tablet retain the complete chart. Narrow screens use contained horizontal chart scrolling instead of compressing it into an unreadable width.

### Preserved Navigation and Scope

- Alarm `View Point`, Key Point selection, and trend `View point` retain the selected point ID and reuse Point Details. Back uses the current equipment name and restores the originating tab/filter context.
- Operational Roll-up keeps 11/14 Healthy, 2/14 In Alarm, and 1/14 In Override. Alarm and override actions open filtered Points views; View all alarms uses the alarm-filtered view.
- Related Equipment navigation retains the selected-equipment header/tree synchronization and equipment Back action. Its diagram controls and Normal/Alarm/Override/Offline legend remain unchanged.
- Desktop navigation, compact mobile navigation, and the Field Information, Notes, and Documents access paths remain available. No Graphics tab, parent-equipment diagnosis, asset-management integration, authentication, or backend persistence was added.
- Known limitation: related-equipment navigation changes equipment context, but detailed overview/alarm mock content still comes from the available AHU-SA-01 dataset. Unimplemented primary-navigation/device destinations remain stubs, not new screens.

## Established EF Status Colours

Approved palette update: November 3, 2026. The existing EF mappings below are the source of truth for status colour in the prototype. This update supersedes earlier colour descriptions, including the November 2 blue Low-alarm and orange Override treatments, without changing status meanings, readings, counts, layout, or interactions.

| EF status | Primary | Secondary |
| --- | --- | --- |
| In Alarm | `#BE2434` | `#FB6265` |
| Down / Communication Failure | `#C0570D` | `#EAB448` |
| Fault | `#C0570D` | `#EAB448` |
| Out of Service | `#BE2434` | `#FB6265` |
| Overridden | `#9781E2` | `#9781E2` |
| Unacknowledged Alarm | `#BE2434` | `#FB6265` |
| Disabled | `#505050` | `#CCCCCC` |
| Stale | `#FDB813` | `#FDB813` |
| OK / Default | `#358600` | `#A7D987` |

- `src/data/statusColors.ts` defines the palette once. Application startup exposes `--ef-status-<status>-primary` and `--ef-status-<status>-secondary` CSS variables before React renders. Status-specific chart events import the same mapping rather than duplicating colour values.
- Primary colours apply to status text, dots, icons, progress fills, and status-coloured borders. Existing supporting backgrounds use pale tints derived from the appropriate secondary colour; no additional status highlights or layout elements are introduced.
- Low and High describe threshold direction on existing alarmed points and therefore use In Alarm. Offline in the existing relationship legend uses Down / Communication Failure. Override/In Override uses Overridden. Normal, Healthy, Connected, and resolved-note indicators use OK / Default.
- The palette applies across Active Alarms, Operational Roll-up, Key Points, the equipment-tree alarm indicator, Related Equipment nodes/legend, Point Details, filtered tables/lists, and alarm/override event markers.
- Controller connection wording remains `Connected`. Existing point/status labels, selected states, interactions, and data are unchanged.
- Ordinary chart-series identity colours, setpoint-change event colours, links, focus/selection styling, document-type icons, and neutral UI controls are not status meanings and retain their existing colours. A disabled form button is not the equipment Disabled status.
- All nine EF mappings are defined, including Fault, Out of Service, Disabled, and Stale even where the current mock dataset has no corresponding visible record. No new mock states or functionality are added to demonstrate unused mappings.

---

## Currently Implemented (As of November 3, 2026)

The following features are **fully implemented** in the current prototype and verified as working:

### Application Structure & Navigation
- ✅ Sticky application header, breadcrumb, equipment title, primary left navigation, equipment tree
- ✅ Content scrolls independently while header/navigation/tree stay visible
- ✅ Four main tabs: Operate, Points, Trends, Associated Documents
- ✅ Equipment tree with status indicators (alarm/normal/override/fault/offline)
- ✅ Aggregated alarm badges on parent location nodes
- ✅ Primary navigation "Alarms & Faults" badge showing active alarm count

### Alarms & Alerts
- ✅ Active Alarms section with alarm list, current values, thresholds, timestamps
- ✅ Acknowledge and Clear buttons (local interaction, no backend)
- ✅ "View Point" action on each alarm
- ✅ "View all alarms" filter action
- ✅ Back button restores equipment and originating tab

### Equipment Overview
- ✅ Equipment Properties & Field Information merged into single card
- ✅ Equipment image/photo with location, access, orientation fields
- ✅ Edit button for Field Information (local form interaction)
- ✅ Controlling Devices card with "Program/Sequence" and "Connected" terminology
- ✅ Equipment State card with operating state fields (Mode, Occupancy, etc.)
- ✅ Customize button to toggle state field visibility

### Operational Roll-up
- ✅ Three equal-width cards (Healthy, In Alarm, In Override)
- ✅ Card counts and trends (↑/→ indicators)
- ✅ Hover popovers on In Alarm and In Override cards with point details
- ✅ Clickable cards to filter Points view

### Key Points
- ✅ Grid of 8 point cards with status, value, units, time-updated
- ✅ EF color-coded status indicators
- ✅ Click to open Point Details
- ✅ "View all points" navigation

### Point Details
- ✅ Current value, unit, status, setpoint
- ✅ High/low alarm thresholds
- ✅ Alarm status and why it triggered
- ✅ Alarm start time
- ✅ Alarm history list
- ✅ Override history (shown when override exists)
- ✅ Back button with tab/filter context restoration

### Inline Point Trend (Operate Tab)
- ✅ Recharts line chart with Duct Static Pressure and SP series
- ✅ Preset time ranges (Last 4 Hours, Last 12 Hours, Last 24 Hours, Last 7 Days)
- ✅ Custom date/time range picker
- ✅ Manual drag-select on chart with selection overlay and tooltip
- ✅ Selection shows start/end times and duration
- ✅ Series visibility toggles
- ✅ Series focus control (emphasize one, de-emphasize others)
- ✅ Scale adjustment (auto/manual min/max)
- ✅ Alarm started, Override applied, Setpoint changed event markers
- ✅ Event hover/click popovers with details
- ✅ Events filtered by selected time range

### Trends Tab
- ✅ Separate "Trend Builder" experience
- ✅ Pre-built trend views (Airflow + Airflow Setpoint, Reheat + Supply Air + Discharge Air)
- ✅ Duplicate as custom (creates editable copy)
- ✅ Custom trend management (rename, add/remove series, delete)
- ✅ Add points from current equipment, related equipment, or site-wide
- ✅ Event markers showing in trends
- ✅ Time range selector in trends

### Related Equipment
- ✅ SVG relationship diagram showing equipment hierarchy
- ✅ Status indicator colors (Normal, Alarm, Override, Offline)
- ✅ Clickable equipment nodes for navigation
- ✅ Tree selection sync with diagram selection
- ✅ Expand, Zoom In, Zoom Out, Reset controls
- ✅ Status legend
- ✅ Mobile/responsive list view

### Associated Documents
- ✅ Associated Documents tab with 5 mock documents
- ✅ Document list with type, size, actions
- ✅ Preview button (opens modal with placeholder preview)
- ✅ Download button (simulated download, no actual file operation)
- ✅ Selection persists across tab switches

### Notes
- ✅ Always-visible notes input panel
- ✅ Add new note with author/date/time
- ✅ Existing notes displayed with author, timestamp, content
- ✅ Resolve and Delete actions on notes
- ✅ Notes persist across tab switches during session

### Status Colors & Terminology
- ✅ EF status color palette applied (red, green, purple, orange)
- ✅ "Connected" terminology for device status
- ✅ "Program/Sequence" terminology in Controlling Devices
- ✅ Colors consistent across all sections (Alarms, Roll-up, Key Points, Tree, Related Equipment, Trends, etc.)

### Responsive Behavior
- ✅ Desktop layout with all sections visible
- ✅ Mobile/tablet layout with stacking and list views
- ✅ Equipment tree collapse/expand on small screens
- ✅ Overview cards stack vertically on mobile
- ✅ All functionality preserved on mobile

---

## Future / Not Yet Implemented

The following features are **out of scope** for the current prototype and should not be implemented without explicit authorization:

### Planned but Deferred
- **Phase 1 / Phase 1 & 2 Mode Toggle** – Decision pending on whether to implement mode switching for different operational views. User has not authorized implementation.
- **Connector Line Gap Fix** – Related Equipment connector lines have small visual gaps that were originally identified for fixing. A previous attempt to fix caused layout breaking and was reverted. The fix remains deferred pending investigation of alternative approaches that don't affect page layout.

### Out of Scope (Not First Release)
- **Graphics Tab** – Visual equipment diagrams, floor plans, or equipment-location graphics (may be added as separate tab in future release)
- **Historical Equipment Playback / Time-Machine** – Ability to view equipment state at past points in time or replay equipment behavior over a historical period
- **Automatic Parent-Equipment Diagnosis** – Root-cause analysis or automatic propagation of alarms up the equipment hierarchy
- **Asset-Management Integration** – Inventory tracking, maintenance scheduling, or asset lifecycle management
- **Real Authentication & Permissions** – User login, role-based access control, or permission enforcement
- **Backend API & Persistence** – Real data storage, database queries, or server-side business logic

### Mock Data Limitations (By Design)
- All data is local/client-side only; no backend fetching
- No real document downloads or file operations
- Acknowledge/Clear are local interactive controls only (no backend notification or state change)
- Notes and configuration changes persist only during current session
- No browser storage, local storage, or session persistence across page reload

### Not Authorized (Requires Explicit Request)
- Repository transfer to distech-int organization
- Public GitHub Pages deployment
- Public repository visibility
- Source code changes beyond approved UI/UX refinements
- GitHub settings or environment configuration changes
- Creation of additional repositories or branches

### Known Limitations Accepted (Not Planned for Fix)
- Related Equipment connector lines have minor visual gaps (reverted from attempted fix that broke page layout)
- Chart manual time-range selection may have limitations on touch devices
- Point trend deep-drilling and period comparisons not implemented
- No real-time data update simulation or automatic refresh
- Equipment-context data (alarms, points, overview) remains AHU-SA-01 focused when navigating to related equipment (mock data scope)

---

## Change Log (Current Session)

**Baseline (November 2, 2026):**
- Prototype stable with Operate, Points, Trends, and Associated Documents tabs
- Sticky header and navigation layout
- Operational Roll-up, Key Points, Point Details, Related Equipment, Notes

**Session Additions (November 3, 2026, up to Finalization):**
1. Extended sticky layout: breadcrumbs and equipment title now stay visible while scrolling
2. Removed unnecessary scrollbar beside four tabs
3. Moved Acknowledge/Clear buttons closer to alarm messages in Active Alarms
4. Added Point Trend time-range selection:
   - Preset options (Last 4 Hours, Last 12 Hours, Last 24 Hours, Last 7 Days)
   - Custom date/time picker
   - Manual drag-select on chart with visual selection overlay
5. Added series focus and scale adjustment controls to Point Trend
6. Updated Operational Roll-up:
   - Fixed equal-width grid layout for three cards
   - Added hover popovers for In Alarm and In Override with point details
   - Added trend indicators (↑/→ arrows) and delta counts
7. Updated equipment-page terminology:
   - "Connected" for controller status
   - "Program/Sequence" for program/sequence name field
8. Attempted Related Equipment connector line fix (reverted due to layout break)
9. Added collapsible Notes panel with improved arrow directionality:
   - Notes column is visible by default on desktop as the right-side column of the Overview area
   - Users can collapse Notes using a **ChevronUp (↑)** icon in the Notes header
   - When collapsed, the main Operate content expands to full available width
   - No empty Notes column remains when collapsed
   - Existing card hierarchy and proportions are preserved during expansion
   - Notes state and content are preserved during collapse/reopen
   - When Notes is collapsed, a "Notes" reopen button with a **ChevronDown (↓)** icon appears on the same row as the "Overview" heading
   - The Notes reopen button is aligned to the far right of the Overview heading row
   - The Notes reopen button does NOT appear beside Active Alarms or at the bottom of the page
   - The Notes reopen button remains accessible without requiring scroll
   - Clicking the Notes button restores the Notes right-side column
   - The Overview-level Notes button disappears when Notes is open
   - Original layout is restored when Notes is reopened
   - Arrow direction clearly communicates the action (UP arrow indicates collapse/hide, DOWN arrow indicates open/show)
10. Improved typography in Operational Roll-up cards:
   - Status titles (Healthy, In Alarm, In Override) are now **bold text**
   - Bold text combined with EF status colors (green, red, purple) improves status identification
   - Color alone is no longer the only visual distinction for status
   - Main values (e.g., 11 / 14, 2 / 14, 1 / 14) remain visually dominant
   - Trend information and visual hierarchy are preserved
   - Key Points typography refined for improved readability throughout
11. Added page bottom breathing room:
   - Approximately 50px of white space appears below the final page content
   - Provides visual spacing at the end of the scrollable area
   - Improves user experience with clean page ending
12. Point Trend layout refinement (November 4, 2026):
   - Below the chart, restructured lower controls into two-column layout
   - LEFT column: "Trend View" with dropdown selector only (removed "+ Create custom trend" button)
   - RIGHT column: "Create Custom Trend" heading + "Add Point From" section with selection controls
   - All dropdown/button controls use consistent 28px height
   - Responsive: desktop 50/50 split, tablet maintained, mobile stacked vertically
   - Typography: Consistent 11px base font size; primary headings use 600 weight, secondary headings use 500 weight
   - Selected-series chips remain in right column below Add Point controls
13. Tab navigation restructuring (November 5, 2026):
   - Removed "Trends" tab from equipment-page navigation
   - Added "Equipment Graphic" tab between Operate and Points
   - Final tab order: Operate | Equipment Graphic | Points | Associated Documents
   - Trend functionality fully preserved in Operate tab (Point Trend card with all features)
   - Equipment Graphic displays static AHU equipment schematic placeholder (non-interactive)
14. Finalized documentation and verified all features

**Not Modified (Preserved from Earlier Work):**
- Overview card layout and content
- Related Equipment diagram hierarchy (approved as-is with known connector geometry refinement needed)
- Point Details view
- Equipment tree structure
- Primary navigation
- EF status colors
- Responsive behavior
- Point Trend functionality in Operate tab (Trend View, Create Custom Trend, Add Point From, multi-equipment comparison, all interactions preserved)
- Desktop and mobile reuse the same palette and status selectors; the update does not change sizes, gaps, layout, or navigation.