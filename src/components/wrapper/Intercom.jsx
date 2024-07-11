import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const Intercom = () => {
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  if (sessionStorage.getItem("userId")) {
    sessionStorage.removeItem("random_user");
  } else {
    if (!sessionStorage.getItem("random_user")) {
      sessionStorage.setItem(
        "random_user",
        Math.floor(Math.random() * 10000000 + 1)
      );
    }
  }

  useEffect(() => {
    const loadIntercom = () => {
      if (!location.pathname.includes("/admin")) {
        // Set up intercomSettings
        window.intercomSettings = {
          api_base: "https://api-iam.intercom.io",
          app_id: "wk35gw8g",
          name: sessionStorage.getItem("userName")
            ? sessionStorage.getItem("userName")
            : "", // Full name
          user_id: sessionStorage.getItem("userId")
            ? sessionStorage.getItem("userId")
            : sessionStorage.getItem("random_user")
            ? sessionStorage.getItem("random_user")
            : "",
          email: sessionStorage.getItem("userEmail")
            ? sessionStorage.getItem("userEmail")
            : "",
          created_at: sessionStorage.getItem("createdAt")
            ? sessionStorage.getItem("createdAt")
            : "",
        };

        // Check if Intercom is already defined
        if (typeof window.Intercom === "function") {
          window.Intercom("reattach_activator");
          window.Intercom("update", window.intercomSettings);
        } else {
          // Create the Intercom function if not already defined
          const intercom = function () {
            intercom.c(arguments);
          };
          intercom.q = [];
          intercom.c = function (args) {
            intercom.q.push(args);
          };
          window.Intercom = intercom;

          // Function to create and insert the script tag
          const loadScript = () => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://widget.intercom.io/widget/wk35gw8g";
            script.id = "intercom-script";
            const firstScript = document.getElementsByTagName("script")[0];
            firstScript.parentNode.insertBefore(script, firstScript);
          };

          // Load the script either on load or immediately if the document is already ready
          if (document.readyState === "complete") {
            loadScript();
          } else if (window.attachEvent) {
            window.attachEvent("onload", loadScript);
          } else {
            window.addEventListener("load", loadScript, false);
          }
        }
      }
    };

    setTimeout(() => {
      loadIntercom();
    }, 2000);

    // Cleanup function to remove Intercom script
    return () => {
      const intercomScript = document.getElementById("intercom-script");
      if (intercomScript && location.pathname.includes("/admin")) {
        intercomScript.remove();
      }
      if (typeof window.Intercom === "function") {
        window.Intercom("shutdown");
      }
    };
  }, [token, location]);
  return <Outlet />;
};
