import test from "node:test";
import assert from "node:assert/strict";
import { weatherLabel } from "../src/weather.js";

test("maps every supported Open-Meteo WMO weather code to the correct condition", () => {
  const expected = {
    0: "Clear",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    56: "Light freezing drizzle",
    57: "Freezing drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Freezing rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Light rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    85: "Light snow showers",
    86: "Snow showers",
    95: "Thunderstorms",
    96: "Thunderstorms with hail",
    99: "Thunderstorms with hail",
  };

  for (const [code, label] of Object.entries(expected)) {
    assert.equal(weatherLabel(code), label, `WMO code ${code}`);
  }
});

test("does not misreport an unsupported weather code", () => {
  assert.equal(weatherLabel(42), "Unknown conditions");
});
