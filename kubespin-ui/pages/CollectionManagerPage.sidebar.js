// plugins/kubespin-mongo-ide-session/kubespin-ui/pages/CollectionManagerPage.sidebar.js
export const getCollectionManagerPageSidebarConfig = ({
  addLog,
  // Add any other props needed for this page
}) => ({
  topItems: [
    { type: "title", text: "Collection Manager" },
    { type: "link", to: "/plugin/mongodb-development-platform/collection-manager", icon: "FaFolder", text: "Collections", end: true },
    { type: "link", to: "/plugin/mongodb-development-platform/collection-manager/indexes", icon: "FaKey", text: "Indexes" },
    { type: "link", to: "/plugin/mongodb-development-platform/collection-manager/schema", icon: "FaTable", text: "Schema Analysis" },
    { type: "divider" },
    { type: "link", to: "/plugin/mongodb-development-platform/query-runner", icon: "FaSearch", text: "Query Runner" },
    { type: "link", to: "/plugin/mongodb-development-platform/database-dashboard", icon: "FaChartBar", text: "Database Dashboard" },
  ],
  bottomItems: [
    { type: "divider" },
    { type: "link", to: "/home", icon: "FaHome", text: "Back to Home" },
  ],
}); 