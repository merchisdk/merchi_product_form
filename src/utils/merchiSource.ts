function cleanIds(raw: any[]) {
  return raw.map(id => id.trim())            // Trim each ID entry to remove whitespace
    .filter(id => /^\d+$/.test(id))  // Use a regular expression to ensure the ID is entirely numeric.
    .map(id => Number(id));          // Convert the remaining, valid ID entries into numbers
}

// Function to get the value of the "merchi_source" query parameter.
const getMerchiSourceValue = (): string | null => {
  // Using URLSearchParams to parse query parameters
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('merchi_source');
  }
  return null;
};

// Function to retrieve and extend the merchi_source value in localStorage.
export const extendMerchiSourceInLocalStorage = (): void => {
  const merchiSourceFromUrl = getMerchiSourceValue(); // Retrieve new value from URL.

  if (merchiSourceFromUrl !== null) {
    try {
      if (typeof localStorage !== 'undefined' && localStorage !== null) {

        // Retrieve the current merchi_source value from localStorage and split it into an array.
        const currentMerchiSource = localStorage.getItem('merchi_source');
        const currentIds = currentMerchiSource ? currentMerchiSource.split(',') : [];
        
        // Split the new merchiSourceFromUrl value into an array.
        const newIds = merchiSourceFromUrl.split(',');

        // Create a set combining the two arrays to remove duplicates and convert back to an array.
        const combinedIdsArray = Array.from(new Set([...currentIds, ...newIds]));

        const cleanedIds = cleanIds(combinedIdsArray);

        // Convert the array back into a comma-separated string.
        const combinedIdsString = cleanedIds.join(',');

        // Store the new unique combined value in localStorage.
        localStorage.setItem('merchi_source', combinedIdsString);
      }
    } catch (error) {
      console.warn('Error extending "merchi_source" in localStorage:', error);
    }
  } else {
    console.warn('No "merchi_source" value found in the URL query parameters.');
  }
};
