export async function loadCrops() {
  return [
    {
      id: 'maize',
      name: 'Maize',
      season: 'Summer',
      soil: 'Sandy loam',
      water: 'Medium',
      optTempMin: 18,
      optTempMax: 30,
      description: 'Staple cereal crop across Zimbabwe, highly responsive to summer rains and Pfumvudza conservation agriculture.'
    },
    {
      id: 'soybeans',
      name: 'Soybeans',
      season: 'Summer',
      soil: 'Clay loam',
      water: 'High',
      optTempMin: 20,
      optTempMax: 32,
      description: 'Important oilseed crop thriving in high rainfall regions like Mashonaland.'
    },
    {
      id: 'wheat',
      name: 'Wheat',
      season: 'Winter',
      soil: 'Clay loam',
      water: 'High',
      optTempMin: 10,
      optTempMax: 25,
      description: 'Major winter cereal grown under irrigation in the Lowveld and Midlands.'
    },
    {
      id: 'sorghum',
      name: 'Sorghum',
      season: 'Summer',
      soil: 'Sandy loam',
      water: 'Low',
      optTempMin: 22,
      optTempMax: 35,
      description: 'Drought-tolerant traditional grain ideal for regions like Matabeleland and Masvingo.'
    },
    {
      id: 'groundnuts',
      name: 'Groundnuts',
      season: 'Summer',
      soil: 'Sandy loam',
      water: 'Medium',
      optTempMin: 20,
      optTempMax: 30,
      description: 'Legume widely cultivated by smallholder farmers across Zimbabwe.'
    }
  ];
}
