// plugins/kubespin-mongo-ide-session/kubespin-ui/pages/QueryRunnerPage.sidebar.js
export const getQueryRunnerPageSidebarConfig = ({
  addLog,
  // Add any other props needed for this page
}) => ({
  topItems: [
    { type: "title", text: "Query Runner" },
    { type: "link", to: "/plugin/mongodb-development-platform/query-runner", icon: "FaSearch", text: "Query Editor", end: true },
    { type: "link", to: "/plugin/mongodb-development-platform/query-runner/history", icon: "FaHistory", text: "Query History" },
    { type: "link", to: "/plugin/mongodb-development-platform/query-runner/templates", icon: "FaFileAlt", text: "Query Templates" },
    { type: "divider" },
    { type: "link", to: "/plugin/mongodb-development-platform/collection-manager", icon: "FaFolder", text: "Collection Manager" },
    { type: "link", to: "/plugin/mongodb-development-platform/database-dashboard", icon: "FaChartBar", text: "Database Dashboard" },
  ],
  bottomItems: [
    { type: "divider" },
    { type: "link", to: "/home", icon: "FaHome", text: "Back to Home" },
  ],
}); 