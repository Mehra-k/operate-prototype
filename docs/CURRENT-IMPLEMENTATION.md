# Operate Prototype – Current Implementation Summary

**Checkpoint date:** November 3, 2026 at 13:37 UTC  
**Branch:** main  
**Remote:** https://github.com/Mehra-k/operate-prototype.git (private, personal)  
**Status:** Stable and tested; all approved features verified and working

---

## Overview

This document summarizes the **currently implemented** Operate prototype features as of this checkpoint. See [operate-requirements.md](operate-requirements.md) for original requirements and future/unresolved items.

All features below have been implemented, tested locally, and the build passes with zero errors.

---

## Application Structure

### Navigation & Layout

**Sticky/Fixed Header Areas:**
- Application header (acme co branding) – sticky at top of viewport
- Breadcrumb navigation – sticky below app header, updates with equipment context
- Equipment page title (e.g., "AHU-SA-01") – sticky below breadcrumbs
- Primary left navigation (sidebar) – fixed on left, stays visible during scroll
- Equipment tree – inside left sidebar, stays visible during scroll

**Main Content Area:**
- Four main tabs (Operate, Points, Trends, Associated Documents) – sticky just below breadcrumb/title area
- Tab content scrolls independently within viewport

### Default Equipment

**AHU-SA-01** (Air Handling Unit, Supply Air Unit)
- Located at: Riverside Complex > Tower A > Floor 1
- Related equipment: upstream Chiller CH-01, sibling AHU-SA-02, downstream VAVs (VAV-01 through VAV-04, plus +9 more)
- 2 active alarms: Duct Static Pressure (low), CO2 (high)
- 1 override: Supply Fan Speed

---

## Implemented Features

### 1. Equipment Tree & Status Indicators

**Equipment Hierarchy:**
- Building → Floor → Zone → Equipment structure
- Support for multiple locations and nested hierarchy
- Expandable/collapsible tree nodes

**Status Indicators:**
- Red triangle (△): Alarm – equipment has active alarms
- Green circle (●): Normal – no alarms, no overrides
- Purple circle (●): Override – setpoint/value override active
- Orange triangle (△): Fault – equipment in fault state
- Indicators appear on right side of each tree item

**Aggregated Alarms:**
- Parent location nodes show badge count when containing alarmed equipment
- Example: Floor 1 badge shows "2" if two pieces of equipment on that floor are in alarm

**Navigation:**
- Click any equipment in tree to navigate to its details page
- Tree selection syncs with Related Equipment diagram

---

### 2. Alarm & Fault Context

**Primary Navigation Badge:**
- "Alarms & Faults" item in sidebar shows red badge with count of active equipment alarms
- Derived from live alarm data across entire site

**Active Alarms Section (Equipment Page):**
- Prominent red alert box at top of Operate tab
- Shows: active alarm count, affected point names, current values, alarm thresholds/reasons, timestamps
- Each alarm row includes:
  - Point name (e.g., "Duct Static Pressure")
  - Current value (e.g., "1.2 in wc")
  - Alarm message with threshold (e.g., "Low (< 1.5 in wc)")
  - Acknowledge checkbox (local toggle, no backend)
  - Clear button (local toggle, no backend)
  - Time in alarm (e.g., "Oct 28, 2026, 10:14 AM, 3h 48m")
  - Action button: "View Point" (navigates to Point Details)
- "View all alarms (2)" button at top right navigates to filtered Points view

**Note on Acknowledge/Clear:**
- Acknowledge and Clear are locally interactive buttons/checkboxes
- They provide visual feedback and can track local state
- They do not remove mock alarm records or change alarm counts
- No backend request is made

---

### 3. Equipment Page – Overview Section

**Layout:**
- Desktop: Three-column layout (left, center, right)
- Left: Equipment Properties & Field Information (combined card)
- Center: Controlling Devices (single column or stacked)
- Right: Equipment State, Notes sidebar

**Equipment Properties & Field Information (Combined Card):**
- Single merged card displaying both sections
- Properties (non-editable):
  - Equipment Name (e.g., "AHU-SA-01")
  - Type (e.g., "AHU")
  - Subtype (e.g., "Built-Up")
  - Assigned Space (e.g., "Floor 1 – Tower A")
  - Description (e.g., "Supply Air AHU serving Tower A Floor 1")
  - Last Updated (timestamp)
- Field Information (with Edit action):
  - Equipment image/photo (representative air-handling-unit.jpg)
  - Location (e.g., "Mechanical Room 1A, North Wall")
  - Access (e.g., "Remove ceiling tile #4")
  - Orientation (e.g., "Face supply fan left to right, GA Filter, Fan")
  - Edit button opens local form with Save/Cancel

**Controlling Devices Card:**
- Shows connected controllers (e.g., "EYC-303 Distech Controller")
- For each controller displays:
  - Device name (text, not clickable in current build)
  - Program/Sequence name and version (e.g., "Rapid Sequence v2.3")
  - Status indicator (e.g., "● Connected")
  - Note: "Program/Sequence" terminology replaces "Sequence"
- Multiple controllers displayed in list format without excessive empty space
- "Connected" status is used (not "Online")

**Equipment State Card:**
- Shows operating state fields (not binary alarm/override pills)
- Includes:
  - Control Mode (e.g., "Auto")
  - Occupancy (e.g., "Occupied")
  - Operating Mode (e.g., "Cooling")
  - Fan Status (e.g., "Running")
  - Outdoor Air Damper (e.g., "25% Open")
- Customize button available to toggle field visibility (local interaction)

**Notes Sidebar (Right):**
- Always-visible text input for adding new notes
- Existing notes displayed with author, timestamp, and content
- Add button to save new note (creates local author/date/time)
- Cancel button to discard draft without closing input
- Resolve and Delete actions available on existing notes (no real permissions required)
- Notes persist across tab switches during session

---

### 4. Operational Roll-up

**Layout:**
- Three equal-width cards displayed in a single row on desktop
- Cards: Healthy, In Alarm, In Override
- Compact, desktop-aligned presentation

**Cards Display:**

1. **Healthy Card** (Green)
   - Count: "11 / 14"
   - Trend: "↑ Stable (+0 delta)"
   - Color: EF green (#00a651)
   - Trend icon: Stable/no-change

2. **In Alarm Card** (Red)
   - Count: "2 / 14"
   - Trend: "↑ Escalating (+1 alarms)"
   - Color: EF red (#c5192d)
   - Trend icon: Escalating/increasing

3. **In Override Card** (Purple)
   - Count: "1 / 14"
   - Trend: "→ Flat (0 changed)"
   - Color: EF purple (#5f27a5)
   - Trend icon: Flat/no-change

**Supporting Text:**
- "Trend shows change over last 24 h" (header subtitle)

**Hover Behavior:**
- On Alarm and Override cards: hover popover appears showing detailed information
- In Alarm popover: list of alarmed points with their values
- In Override popover: list of overridden points with their values
- Popover positioned above the card, floats above page content

**Interaction:**
- Healthy: informational only
- In Alarm: clickable → filters Points view to show only alarmed points
- In Override: clickable → filters Points view to show only overridden points

**Styling:**
- EF status colors applied (red, green, purple, orange for fault)
- Progress bars for visual proportion
- Cards maintain equal width and height

---

### 5. Key Points

**Display:**
- Grid of 8 point cards, displayed in 2-3 rows
- Compact card size maintained (no card stretching)
- Each card shows:
  - Point name (e.g., "Zone Temp")
  - Current value and unit (e.g., "72.4 °F")
  - Status/condition (e.g., "Normal", "Low", "High", "Override")
  - Last updated time (e.g., "2 min ago")
  - EF color-coded status indicator on card (green, red, purple, orange)
  - Right arrow icon (navigation hint)

**Interaction:**
- Click any point card → opens Point Details view with that exact point
- "View all points" link at top right → opens full Points list (8-record directory)

**Example Points:**
- Zone Temp: 72.4 °F, Normal
- Supply Air Temp: 55.3 °F, Normal
- Duct Static Pressure: 1.2 in wc, Low
- Supply Fan Speed: 78%, Override
- CO2: 1,180 ppm, High
- Outdoor Air Damper: 25%, Normal
- Return Air Temp: 71.2 °F, Normal
- Mixed Air Temp: 62.1 °F, Normal

---

### 6. Point Details

**Accessible Via:**
- Click any Key Point card
- Click any alarm row in Active Alarms
- Click "View point" action in alarm details
- Deep-link from Related Equipment or Trends

**Display (Read-Only):**
- Point name and icon/status indicator
- Current value (e.g., "1.2 in wc") and unit
- Status label (Normal, Low, High, Override, Fault)
- Setpoint value when available (e.g., "Setpoint: 1.5 in wc")
- Alarm information:
  - High alarm threshold (e.g., "High (> 1.8 in wc)")
  - Low alarm threshold (e.g., "Low (< 1.5 in wc)")
  - Alarm status and why it triggered
  - Alarm start time (e.g., "Oct 28, 2026, 10:14 AM")
- Trend chart: inline reference to Overview trend or dedicated trend view
- Alarm history: list of previous alarm events (mock data)
- Override history: shown when override exists (not shown when empty)

**Navigation Context:**
- Back button: returns to originating equipment and restores previous tab/filter state
- Point selection preserved when arriving from Key Point, alarm, or chart

---

### 7. Inline Point Trend (Operate Tab)

**Chart Display:**
- Recharts-based line chart embedded in Operate tab
- Positioned above Related Equipment section
- Default series: Duct Static Pressure (blue) + Duct Static Pressure SP (dashed blue setpoint)
- Alternative view available: Reheat + Supply Air Temperature + Discharge Air Temperature

**Time-Range Selection:**

**Preset Options:**
- Last 4 Hours
- Last 12 Hours
- Last 24 Hours (default)
- Last 7 Days

**Custom Range:**
- Dropdown option: "Custom Range"
- Opens date/time picker with:
  - Start date/time input (e.g., "2026-10-28, 04:46 PM")
  - End date/time input (e.g., "2026-10-28, 10:25 PM")
  - Apply button (filters chart to selected range)
  - Cancel button (closes picker without applying)

**Manual Range Selection (Drag/Click on Chart):**
- Click and drag horizontally across chart plot area
- Semi-transparent orange/yellow selection box appears under cursor
- While dragging, shows:
  - Start date/time
  - End date/time
  - Duration of selection
- Release mouse → chart zooms to selected time period
- Selected range updates in Custom Range picker
- Label shows: "Custom: [date/time] – [date/time]"
- Reset button available to return to preset range

**Series Controls:**
- Checkbox for "Duct Static Pressure" (checked)
- Checkbox for "Duct Static Pressure SP" (checked)
- Focus button for each series:
  - Click Focus → emphasize that series, de-emphasize others
  - de-emphasized series still visible
  - Show which series is currently focused
  - Click Focus again or "View all" → return to viewing all series

**Scale Adjustment:**
- Available when series is focused
- Options:
  - Auto scale (default)
  - Manual minimum (text input)
  - Manual maximum (text input)
  - Reset scale (button)
- Validation: minimum must be < maximum
- Scale changes apply only to focused series
- All series refresh on scale change

**Event Markers:**
- Three event types shown on chart:
  - "Alarm started" (red diamond) – Oct 28, 10:14 AM
  - "Override applied" (purple diamond) – Oct 28, 2:00 PM  
  - "Setpoint changed" (gray diamond) – Oct 28, 6:00 PM
- Click event marker → popover appears with event details
- Events persist across time-range changes
- Events only show if they fall within selected time range
- Hover shows tooltip with date/time

**Interaction:**
- "View point" button at bottom right → opens Point Details for Duct Static Pressure
- Trend view selector dropdown to switch between preset trend comparisons
- No automatic backend fetch; all data is mock/local

---

### 8. Trends Tab (Separate Experience)

**Layout:**
- "Trend Builder" heading: "Compare point histories across equipment"
- Trend view selector dropdown (default: "Airflow + Airflow Setpoint")
- "Duplicate as custom" button

**Chart Display (Per Trend View):**
- Large Recharts line chart
- Time range selector (Last 12 Hours, Last 24 Hours default)
- Two or more series displayed simultaneously (color-coded)

**Trend View Examples:**

1. **Airflow + Airflow Setpoint** (Default)
   - Series: Airflow (teal), Airflow Setpoint (blue, dashed)
   - Range: 1360–1520 CFM

2. **Reheat + Supply Air Temperature + Discharge Air Temperature**
   - Series: Reheat, Supply Air Temperature, Discharge Air Temperature

**Series Controls:**
- Buttons for each series name (e.g., "Airflow", "Airflow Setpoint")
- Series can be clicked to toggle visibility or focus

**Event Markers:**
- Same three event types as inline trend (Alarm started, Override applied, Setpoint changed)
- Hover shows inline details (no separate popover)
- Events labeled with time (e.g., "10:14")

**Add Points to Trend:**
- Dropdown: "Add point from" with options:
  - Select a point (default/placeholder)
  - Current equipment points (e.g., Reheat, Supply Air Temperature, Duct Static Pressure)
  - Related equipment points (e.g., AHU-SA-02 · Airflow)
  - Other site points (e.g., VAV-01 · Zone Temp, East Office · CO2)
- Add point button (disabled until a point is selected)
- Selected point added to chart; series displays with new data

**Custom Trends:**
- Preset views are protected; cannot be renamed or modified
- "Duplicate as custom" creates editable copy
- Custom views support:
  - Rename
  - Add/remove series (via dropdown)
  - Delete (remove custom view entirely)
- Changes persist during session

---

### 9. Related Equipment

**Desktop Diagram:**
- SVG relationship diagram showing equipment hierarchy
- Nodes and connector lines
- Expand/Zoom/Reset controls at bottom

**Hierarchy:**
```
        Chiller CH-01 (Upstream)
              |
    ┌─────────┴─────────┐
    |                   |
AHU-SA-02 (Sibling)  AHU-SA-01 (Current)
                         |
         ┌───────┬───────┼───────┬──────┐
         |       |       |       |      |
      VAV-01  VAV-02  VAV-03  VAV-04  +9 more
    (Served) (Served) (Served) (Served) (Aggregate)
```

**Node Styling:**
- Current equipment: blue/highlighted border
- Sibling: green/normal color
- Related equipment: green/normal color
- "+9 more VAVs": non-clickable aggregate text (no navigation)
- Status indicators: color-coded boxes (Normal, Alarm, Override, Offline)
  - Green: Normal
  - Red: Alarm
  - Purple: Override
  - Orange: Offline

**Controls:**
- **Expand** button (top right): expands diagram view, shows full diagram
- **Zoom In** button: enlarges diagram (up to 150%)
- **Zoom Out** button: shrinks diagram (down to 60%)
- **Reset** button: returns to default zoom/pan
- **Legend** at bottom: Color key for Normal, Alarm, Override, Offline

**Navigation:**
- Click named equipment node → navigate to that equipment, update page
- Click named node → equipment tree selection syncs
- Click "+9 more VAVs" → no navigation (informational aggregate only)

**Mobile List View:**
- On smaller screens, diagram converts to simple list
- Equipment relationships shown as text/hierarchy list
- Same navigation available

**Interaction Preservation:**
- Cannot redesign; maintain hierarchy and visual structure
- Status colors preserved from EF palette
- All equipment nodes remain clickable (except aggregate)

---

### 10. Associated Documents

**Tab Location:**
- Appears as separate "Associated Documents" tab (only in this tab, not elsewhere)
- Shows "5" document count

**Document List:**
- Five mock documents:

1. **Sequence of Operations.pdf**
   - Type: PDF
   - Size: 1.2 MB
   - Actions: Preview, Download

2. **AHU-SA-01 Drawing.pdf**
   - Type: PDF
   - Size: 3.4 MB
   - Actions: Preview, Download

3. **Point List.xlsx**
   - Type: XLSX
   - Size: 245 KB
   - Actions: Preview, Download

4. **Maintenance Manual.pdf**
   - Type: PDF
   - Size: 4.1 MB
   - Actions: Preview, Download

5. **Equipment Photos (3)**
   - Type: ZIP (gallery of 3 images)
   - Size: 12.8 MB
   - Actions: Preview (gallery), Download

**Document Actions:**
- **Preview button** (squares icon): opens modal/preview pane showing:
  - PDFs: placeholder document preview
  - XLSX: placeholder spreadsheet preview
  - ZIP/Gallery: grid of three preview images (Equipment Photos)
  - No actual file fetch; all previews are placeholder UI
- **Download button** (arrow icon): simulated download (no backend)
  - Button remains visible; no actual download occurs
  - Selection persists across tabs during session

**Interaction:**
- No documents are actually downloaded or fetched
- Buttons provide UI interaction and visual feedback
- Document list persists when switching tabs

---

### 11. Equipment Status Colors (EF Palette)

All status indicators use authoritative EF color palette:

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| Normal | Green | #00a651 | Equipment/points functioning normally |
| Alarm | Red | #c5192d | Equipment/point in alarm, requires attention |
| Override | Purple | #5f27a5 | Setpoint/value manually overridden |
| Fault | Orange | #ea8600 | Equipment in fault state |

**Applied To:**
- Equipment tree status indicators (left sidebar)
- Operational Roll-up card backgrounds and progress bars
- Key Point card status labels
- Point Details status indicator
- Related Equipment node colors
- Event marker colors (alarm = red, override = purple, etc.)
- Alarm badge in primary navigation

---

### 12. EF Status Terminology

**Current Terminology:**
- "Connected" (not "Online")  
  - Used for controller/device status in Controlling Devices
  - Replaces previous "Online" terminology
- "Program/Sequence" (not "Sequence")
  - Used for program/sequence name in Controlling Devices
  - Combines program and sequence into single field name

**Preserved Terminology:**
- "Healthy", "In Alarm", "In Override" (Operational Roll-up)
- "Normal", "Low", "High", "Override", "Fault" (point status)
- "Override" (not "Overridden") – used for override status

---

## Responsive Behavior

### Desktop (Full Size)
- All sections visible and properly laid out
- Three-column overview (Properties, Devices, State)
- Three-card Operational Roll-up in single row
- Point cards grid (2-3 rows)
- Related Equipment diagram with controls

### Mobile/Tablet (Smaller Screens)
- Sidebar may collapse or reorganize
- Overview sections stack vertically
- Operational Roll-up cards stack (1 column)
- Point cards respond to screen width
- Related Equipment converts to list view
- All functionality preserved

---

## Mock Data & Limitations

### Data Structure
- All equipment, points, alarms, trends, and documents use **local mock data**
- No backend API, database, or network requests
- No authentication; no user roles or permissions required
- No real document downloads or file operations

### Prototype-Only Interactions
- Acknowledge/Clear buttons are local interactive controls only
- Adding notes creates local client-state entries (not persisted across reload)
- Equipment navigation updates client state (not backend)
- Tab selection persists during session but resets on page reload
- Customizing trends, changing time ranges, and adding points are local only

### Session Persistence
- Notes and document selection persist across tab switches **within the same session**
- Reloading page resets all client state to defaults
- No local storage or browser caching implemented

---

## Build & Deployment

### Development
```bash
npm run dev        # Start Vite dev server (typically port 5173)
npm run build      # TypeScript check + Vite build
npm run preview    # Serve built dist/ locally
```

### Current Status
- **Build passes:** Zero errors, zero warnings
- **TypeScript:** All types checked; no compilation errors
- **Linting:** No linting script configured; browser interaction checks verify functionality
- **Testing:** No automated test suite; all features verified via local browser testing

### Repository
- **Branch:** main
- **Remote:** https://github.com/Mehra-k/operate-prototype.git (private, personal account)
- **Ownership:** Mehra-k (not organization-owned)
- **Visibility:** Private (not public)
- **Git status:** All approved changes staged and ready for commit

---

## Known Limitations & Preserved Design Decisions

### Related Equipment Connector Lines
- Small visual gaps may exist between connector lines and equipment cards (known limitation from revert)
- Connector line geometry is functional but not perfectly aligned
- Diagram hierarchy and interaction remain correct

### Chart & Trend Limitations
- Manual time-range selection via drag requires compatible browser/mouse
- Touch support on mobile is basic; may require alternative interaction on some devices
- Chart pan/zoom may not be fully responsive on all screen sizes

### Not Implemented (By Design)
- Real-time data updates (mock static snapshots only)
- Point trend deep-drilling or period comparisons
- Equipment graphics or floor-plan visualization
- Historical equipment state playback or time-travel debugging
- Automatic parent-equipment diagnosis or root-cause analysis
- Real alarm acknowledgment (no backend notification system)
- File upload or document management
- User preferences or profile-based defaults
- Multi-language support

---

## File Locations (Key Components)

| File | Purpose |
|------|---------|
| src/components/EquipmentPage.tsx | Header, tabs, breadcrumb, sticky layout |
| src/components/OperateOverview.tsx | Overview section composition (cards, roll-up, key points) |
| src/components/EquipmentOverviewCards.tsx | Equipment Properties + Field Information merged card |
| src/components/OperationalRollup.tsx | Roll-up cards with hover popovers and click navigation |
| src/components/KeyPointsSection.tsx | Key Points grid and card display |
| src/components/PointDetails.tsx | Point Details view (value, thresholds, history) |
| src/components/PointTrendPanel.tsx | Inline Point Trend state, time-range, custom views |
| src/components/PointTrendChart.tsx | Recharts rendering, manual selection, event markers |
| src/components/TrendsExperience.tsx | Separate Trends tab experience |
| src/components/RelatedEquipment.tsx | Equipment relationship diagram and list |
| src/components/EquipmentHierarchy.tsx | Left navigation tree with status indicators |
| src/components/PrimaryNavigation.tsx | Sidebar navigation with alarm badge |
| src/components/EquipmentResources.tsx | Notes and Associated Documents panels |
| src/data/equipment.ts | Equipment hierarchy, relationships, status |
| src/data/operateOverview.ts | Controllers, states, alarms, points, roll-up data |
| src/data/trends.ts | Trend catalog, mock data, presets |
| src/data/statusColors.ts | EF color palette and status mappings |
| src/styles.css | All layout, spacing, colors, responsive styles |

---

## Next Steps / Future Work

See [operate-requirements.md](operate-requirements.md) for the **"Future / Not Yet Implemented"** section, which details:
- Unresolved design decisions
- Out-of-scope features (Graphics tab, time-travel, auto-diagnosis)
- Not-yet-authorized features (Phase 1 / Phase 1 & 2 toggle, editable floor plans, etc.)
- Potential enhancements (profile defaults, real permissions, document management)

Do not implement any of these features without explicit authorization.

---

## Verification & QA

**Last verified:** November 3, 2026, 13:37 UTC

- ✅ All sticky/fixed layout working (header, navigation, breadcrumbs, title)
- ✅ All four tabs functional (Operate, Points, Trends, Associated Documents)
- ✅ Active Alarms section displaying correctly with Acknowledge/Clear controls
- ✅ Operational Roll-up cards equal width, proper spacing, hover popovers working
- ✅ Key Points grid displaying all 8 points with proper layout
- ✅ Point Details accessible from Key Points, Alarms, and charts
- ✅ Inline Point Trend with time-range selection, manual drag-select, series focus, scale adjustment
- ✅ Trends tab displaying with preset views, add points, custom trend management
- ✅ Related Equipment diagram showing correct hierarchy and navigation
- ✅ Associated Documents tab showing all 5 documents with Preview/Download actions
- ✅ Equipment tree showing status indicators and alarm aggregation
- ✅ EF colors applied correctly across all sections
- ✅ Build passes with zero errors
- ✅ No layout breaking, excessive whitespace, or unexpected empty containers
