// plugins/kubespin-mongo-ide-session/kubespin-ui/pages/MongoSessionPageView.sidebar.js
export const getMongoSessionPageViewSidebarConfig = ({
  addLog,
  session,
  // Add any other props needed for this page
}) => ({
  topItems: [
    { type: "title", text: "MongoDB Session" },
    { type: "link", to: "/plugin/mongodb-development-platform", icon: "FaInfoCircle", text: "Overview", end: true },
    { type: "link", to: "/plugin/mongodb-development-platform/runner", icon: "FaTerminal", text: "Runner" },
    { type: "link", to: "/plugin/mongodb-development-platform/browser", icon: "FaTable", text: "Browser", disabled: true, title: "Data Browser (Coming Soon)" },
    { type: "divider" },
    { type: "link", to: "/plugin/mongodb-development-platform/query-runner", icon: "FaSearch", text: "Query Runner" },
    { type: "link", to: "/plugin/mongodb-development-platform/collection-manager", icon: "FaFolder", text: "Collection Manager" },
    { type: "link", to: "/plugin/mongodb-development-platform/database-dashboard", icon: "FaChartBar", text: "Database Dashboard" },
  ],
  bottomItems: [
    { type: "divider" },
    { type: "link", to: "/home", icon: "FaHome", text: "Back to Home" },
  ],
}); 