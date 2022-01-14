# DeliverMe - An App for Expecting Mothers

## TODO:
- user story
- psedo code
- wireframe

// On opening page, restore user data from local storage
// Take the user's input (location + radius)
// Store this in local storage
// Formulate into API queries
// Query map API to identify hospitals within radius of location
// Return list of hospitals
// Store this in local storage
// Query the medical API with list of hospitals as input
// Return corresponding rating / other metric
// Store this in local storage
// On map, zoom in to corresponding location + radius so that radius lies within bounds of display
// Place a pin on map for each hospital identified within radius
// To one side of the map, display a list of hospitals by distance to location and corresponding rating
// When user clicks on a pin, highlight information about that hospitals rating