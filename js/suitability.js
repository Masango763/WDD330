export function checkSuitability(crop, weather) {
  if (!crop || !weather || !weather.current) {
    return { status: "Unknown", note: "Insufficient data for suitability analysis." };
  }

  const currentTemp = weather.current.temperature_2m;

  if (currentTemp >= crop.optTempMin && currentTemp <= crop.optTempMax) {
    return {
      status: "Optimal 🟢",
      note: `Current temperature (${currentTemp}°C) is within the ideal range (${crop.optTempMin}°C - ${crop.optTempMax}°C) for ${crop.name}.`
    };
  } else if (currentTemp < crop.optTempMin) {
    return {
      status: "Cool 🟡",
      note: `Current temperature (${currentTemp}°C) is below optimal range for ${crop.name}. Growth may slow down.`
    };
  } else {
    return {
      status: "Warm 🟠",
      note: `Current temperature (${currentTemp}°C) is above optimal range for ${crop.name}. Ensure adequate soil moisture.`
    };
  }
}
