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