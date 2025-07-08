// mongo-ide-session/ui/src/MongoSessionPageView.sidebar.js

const getMongoSessionPageSidebarItems = (session) => {
  return [
    {
      type: "link",
      text: "Overview (Dynamic)", // Added (Dynamic) for clarity
      to: "",
      icon: "FaInfoCircle",
      end: true,
    },
    {
      type: "link",
      text: "Runner (Dynamic)",
      to: "runner",
      icon: "FaTerminal",
    },
    {
      type: "link",
      text: "Browser (Dynamic)",
      to: "browser",
      icon: "FaTable",
      disabled: true,
      title: "Data Browser (Coming Soon)",
    },
  ];
};

export default getMongoSessionPageSidebarItems;