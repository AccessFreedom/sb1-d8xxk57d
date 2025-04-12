// MSAL (Microsoft Authentication Library) Configuration

import { Configuration, LogLevel } from "@azure/msal-browser";

// Configuration for MSAL
export const msalConfig: Configuration = {
  auth: {
    clientId: "YOUR_CLIENT_ID", // Replace with your Microsoft App registration client ID
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii) {
          switch (level) {
            case LogLevel.Error:
              console.error(message);
              return;
            case LogLevel.Info:
              console.info(message);
              return;
            case LogLevel.Verbose:
              console.debug(message);
              return;
            case LogLevel.Warning:
              console.warn(message);
              return;
          }
        }
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
  },
};

// Scopes for Microsoft Graph API access
export const loginRequest = {
  scopes: [
    "User.Read",
    "Files.ReadWrite.All", // Access to read and write files
    "Sites.ReadWrite.All", // Access to SharePoint sites
  ],
};

// Login request for app-specific functionality
export const graphRequest = {
  scopes: ["User.Read", "Files.ReadWrite.All", "Sites.ReadWrite.All"],
};

// Navigation endpoints in Microsoft Graph API
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphFilesEndpoint: "https://graph.microsoft.com/v1.0/me/drive/root/children",
  graphSearchEndpoint: "https://graph.microsoft.com/v1.0/me/drive/root/search",
};