// The register form uses friendly labels ("Vegetarian", "11 PM - 12 AM") for the UI,
// but the backend's Roommate schema expects fixed enum values. These functions translate
// between the two so the form doesn't need to change.

export function mapFoodPreference(value) {
  if (value === "Vegetarian" || value === "Vegan") return "veg";
  if (value === "Non-vegetarian") return "non_veg";
  return "either"; // Eggetarian and anything else falls back to "either"
}

export function mapSleepSchedule(value) {
  if (value === "Before 10 PM" || value === "10 PM - 11 PM") return "early_bird";
  if (value === "After 12 AM") return "night_owl";
  return "flexible";
}

export function mapCleanliness(value) {
  const map = {
    "Very tidy": 5,
    Tidy: 4,
    Average: 3,
    Relaxed: 2,
  };
  return map[value] ?? 3;
}

export function mapYesNo(value) {
  // "No" -> false, "Occasionally" / "Yes" -> true (schema is a simple boolean)
  return value === "Yes" || value === "Occasionally";
}

export function mapStudyHabits(value) {
  // Register form only asks study *hours*, not habit style, so this is a
  // reasonable default. Extend the form later if you want a real "studyHabits" question.
  return "silent";
}

export function mapGuestsFrequency() {
  // Not currently asked on the register form; default to a safe middle value.
  return "sometimes";
}