function addItems(parent, items, onSelect) {
  for (const item of items) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "organ";
    button.dataset.id = item.id;
    button.setAttribute("aria-pressed", "false");
    button.textContent = item.en;
    button.addEventListener("click", () => onSelect(item.id));
    parent.append(button);
  }
}

export function mountLibrary({ systemsEl, library, onSelect }) {
  for (const system of library) {
    const details = document.createElement("details");
    if (system.open) details.open = true;
    const summary = document.createElement("summary");
    summary.textContent = system.en;
    details.append(summary);
    if (system.groups) {
      for (const group of system.groups) {
        const sub = document.createElement("details");
        const subSummary = document.createElement("summary");
        subSummary.className = "subhead";
        subSummary.textContent = group.en;
        sub.append(subSummary);
        addItems(sub, group.items, onSelect);
        details.append(sub);
      }
    } else {
      addItems(details, system.items, onSelect);
    }
    systemsEl.append(details);
  }
}
