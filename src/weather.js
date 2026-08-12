const WEATHER_LABELS = new Map([
  [0, "Clear"],
  [1, "Mostly clear"],
  [2, "Partly cloudy"],
  [3, "Overcast"],
  [45, "Fog"],
  [48, "Rime fog"],
  [51, "Light drizzle"],
  [53, "Drizzle"],
  [55, "Heavy drizzle"],
  [56, "Light freezing drizzle"],
  [57, "Freezing drizzle"],
  [61, "Light rain"],
  [63, "Rain"],
  [65, "Heavy rain"],
  [66, "Light freezing rain"],
  [67, "Freezing rain"],
  [71, "Light snow"],
  [73, "Snow"],
  [75, "Heavy snow"],
  [77, "Snow grains"],
  [80, "Light rain showers"],
  [81, "Rain showers"],
  [82, "Heavy rain showers"],
  [85, "Light snow showers"],
  [86, "Snow showers"],
  [95, "Thunderstorms"],
  [96, "Thunderstorms with hail"],
  [99, "Thunderstorms with hail"],
]);

export function weatherLabel(code) {
  return WEATHER_LABELS.get(Number(code)) || "Unknown conditions";
}
