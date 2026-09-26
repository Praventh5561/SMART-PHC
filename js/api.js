// Smart PHC API Connector
// Dynamically connects to unified FastAPI backend (relative /api or localhost:8000)
(function() {
  var isSameOrigin = (window.location.port === "8000");
  var API_BASE = isSameOrigin ? "/api" : "http://localhost:8000/api";
  var isBackendOnline = false;

  window.API = {
    isOnline: function() { return isBackendOnline; },
    getBaseUrl: function() { return API_BASE; },
    
    checkHealth: function() {
      return fetch(API_BASE + "/health", { method: "GET" })
        .then(function(res) {
          if (res.ok) {
            isBackendOnline = true;
            console.log("[SmartPHC API] Unified backend connected: " + API_BASE);
            return true;
          }
          isBackendOnline = false;
          return false;
        })
        .catch(function() {
          isBackendOnline = false;
          console.log("[SmartPHC API] Backend offline. Running in client-side state mode.");
          return false;
        });
    },

    login: function(email, password) {
      if (!isBackendOnline) return Promise.resolve(null);
      return fetch(API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
      }).then(function(res) {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
      });
    },

    getRecommendations: function(targetPhcId, specialization) {
      if (!isBackendOnline) return Promise.resolve(null);
      var url = API_BASE + "/recommendations/doctor?target_phc_id=" + encodeURIComponent(targetPhcId) + 
                "&required_specialization=" + encodeURIComponent(specialization || "General Medicine");
      return fetch(url).then(function(res) { return res.json(); });
    },

    approveSubstitute: function(doctorId, toPhcId, score) {
      if (!isBackendOnline) return Promise.resolve(null);
      return fetch(API_BASE + "/recommendations/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctorId, to_phc_id: toPhcId, score: score })
      }).then(function(res) { return res.json(); });
    },

    callNext: function(phcId) {
      if (!isBackendOnline) return Promise.resolve(null);
      return fetch(API_BASE + "/queue/call-next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phc_id: phcId })
      }).then(function(res) { return res.json(); });
    },

    markAbsent: function(doctorId, reason) {
      if (!isBackendOnline) return Promise.resolve(null);
      return fetch(API_BASE + "/doctors/mark-absent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctorId, reason: reason })
      }).then(function(res) { return res.json(); });
    },

    getDistrictSummary: function() {
      if (!isBackendOnline) return Promise.resolve(null);
      return fetch(API_BASE + "/reports/summary").then(function(res) { return res.json(); });
    }
  };

  // Test backend availability on load
  window.API.checkHealth();
})();
