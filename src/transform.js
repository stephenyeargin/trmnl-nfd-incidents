function transform(input) {
  const features = (input && Array.isArray(input.features)) ? input.features : [];
  const events = {};

  features.forEach((feature) => {
    const p = (feature && feature.properties) ? feature.properties : {};
    const eventNumber = p.event_number || `${p.DispatchDateTime || ''}:${p.incident_type_id || ''}:${p.PostalCode || ''}`;
    const unitId = p.Unit_ID;

    if (!events[eventNumber]) {
      events[eventNumber] = {
        ...p,
        UNIT_IDs: unitId ? [unitId] : []
      };
      return;
    }

    if (unitId) {
      events[eventNumber].UNIT_IDs.push(unitId);
    }
  });

  const condensedIncidents = Object.values(events)
    .map((event) => ({
      ...event,
      UNIT_IDs: Array.from(new Set(Array.isArray(event.UNIT_IDs) ? event.UNIT_IDs : []))
    }))
    .sort((a, b) => {
      const ta = new Date(a.DispatchDateTime).getTime() || 0;
      const tb = new Date(b.DispatchDateTime).getTime() || 0;
      return tb - ta;
    });

  return {
    ...input,
    condensed_incidents: condensedIncidents
  };
}
