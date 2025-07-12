// plugins/kubespin-mongo-ide-session/kubespin-ui/pages/DatabaseDashboardPage.sidebar.js
export const getDatabaseDashboardPageSidebarConfig = ({
  addLog,
  // Add any other props needed for this page
}) => ({
  topItems: [
    { type: "title", text: "Database Dashboard" },
    { type: "link", to: "/plugin/mongodb-development-platform/database-dashboard", icon: "FaChartBar", text: "Overview", end: true },
    { type: "link", to: "/plugin/mongodb-development-platform/database-dashboard/performance", icon: "FaTachometerAlt", text: "Performance" },
    { type: "link", to: "/plugin/mongodb-development-platform/database-dashboard/storage", icon: "FaHdd", text: "Storage" },
    { type: "link", to: "/plugin/mongodb-development-platform/database-dashboard/connections", icon: "FaWifi", text: "Connections" },
    { type: "divider" },
    { type: "link", to: "/plugin/mongodb-development-platform/query-runner", icon: "FaSearch", text: "Query Runner" },
    { type: "link", to: "/plugin/mongodb-development-platform/collection-manager", icon: "FaFolder", text: "Collection Manager" },
  ],
  bottomItems: [
    { type: "divider" },
    { type: "link", to: "/home", icon: "FaHome", text: "Back to Home" },
  ],
}); 