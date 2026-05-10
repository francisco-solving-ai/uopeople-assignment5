if (typeof window !== "undefined" && window.navigation) {
    window.navigation.addEventListener("navigate", (event) => {
     sendNewLocationToServer(event.destination.url);
     console.log("new url", event.destination.url);
  
  
    });
  }
  