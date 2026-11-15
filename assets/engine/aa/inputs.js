/**
 * The four canonical inputs of the Axiom Arcana: name, date, time, place.
 * The document requires all four — N1, D1, T1, P1 — because twelve of the
 * bindings read the time and place seeds.
 */
export const CITIES = [
    { name: 'Guwahati', state: 'Assam', lat: 26.1445, lon: 91.7362 },
    { name: 'Dibrugarh', state: 'Assam', lat: 27.4728, lon: 94.912 },
    { name: 'Jorhat', state: 'Assam', lat: 26.7509, lon: 94.2037 },
    { name: 'Silchar', state: 'Assam', lat: 24.8333, lon: 92.7789 },
    { name: 'Tezpur', state: 'Assam', lat: 26.6338, lon: 92.8 },
    { name: 'Nagaon', state: 'Assam', lat: 26.3464, lon: 92.684 },
    { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
    { name: 'Delhi', state: 'Delhi', lat: 28.6139, lon: 77.209 },
    { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lon: 72.8777 },
    { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
    { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882 },
    { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
    { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lon: 76.6394 },
    { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
    { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198 },
    { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558 },
    { name: 'Hyderabad', state: 'Telangana', lat: 17.385, lon: 78.4867 },
    { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lon: 80.648 },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185 },
    { name: 'Kochi', state: 'Kerala', lat: 9.9312, lon: 76.2673 },
    { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lon: 76.9366 },
    { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lon: 75.7804 },
    { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714 },
    { name: 'Surat', state: 'Gujarat', lat: 21.1702, lon: 72.8311 },
    { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lon: 73.1812 },
    { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
    { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lon: 73.0243 },
    { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lon: 73.7125 },
    { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
    { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739 },
    { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lon: 80.3319 },
    { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081 },
    { name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lon: 81.8463 },
    { name: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376 },
    { name: 'Gaya', state: 'Bihar', lat: 24.7955, lon: 85.0002 },
    { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lon: 85.3096 },
    { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lon: 85.8245 },
    { name: 'Cuttack', state: 'Odisha', lat: 20.4625, lon: 85.883 },
    { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lon: 81.6296 },
    { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126 },
    { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577 },
    { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lon: 79.9864 },
    { name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lon: 76.7794 },
    { name: 'Amritsar', state: 'Punjab', lat: 31.634, lon: 74.8723 },
    { name: 'Ludhiana', state: 'Punjab', lat: 30.901, lon: 75.8573 },
    { name: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0837, lon: 74.7973 },
    { name: 'Jammu', state: 'Jammu & Kashmir', lat: 32.7266, lon: 74.857 },
    { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lon: 78.0322 },
    { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lon: 77.1734 },
    { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lon: 91.8933 },
    { name: 'Imphal', state: 'Manipur', lat: 24.817, lon: 93.9368 },
    { name: 'Aizawl', state: 'Mizoram', lat: 23.7271, lon: 92.7176 },
    { name: 'Agartala', state: 'Tripura', lat: 23.8315, lon: 91.2868 },
    { name: 'Kohima', state: 'Nagaland', lat: 25.6751, lon: 94.1086 },
    { name: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.0844, lon: 93.6053 },
    { name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lon: 88.6065 },
    { name: 'Panaji', state: 'Goa', lat: 15.4909, lon: 73.8278 },
    { name: 'Puducherry', state: 'Puducherry', lat: 11.9416, lon: 79.8083 },
    { name: 'Kathmandu', state: 'Nepal', lat: 27.7172, lon: 85.324 },
    { name: 'Dhaka', state: 'Bangladesh', lat: 23.8103, lon: 90.4125 },
    { name: 'London', state: 'UK', lat: 51.5072, lon: -0.1276 },
    { name: 'New York', state: 'USA', lat: 40.7128, lon: -74.006 },
    { name: 'Dubai', state: 'UAE', lat: 25.2048, lon: 55.2708 },
    { name: 'Singapore', state: 'Singapore', lat: 1.3521, lon: 103.8198 },
];
export function findCity(name) {
    const q = name.trim().toLowerCase();
    return CITIES.find((c) => c.name.toLowerCase() === q)
        ?? CITIES.find((c) => c.name.toLowerCase().startsWith(q));
}
export function parseTime(value, tzMinutes = 330) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
    const hh = m ? Math.min(23, Number(m[1])) : 12;
    const mm = m ? Math.min(59, Number(m[2])) : 0;
    return { hh, mm, tzOffsetMinutes: tzMinutes };
}
/** Local clock minutes, used for the T1 seed. */
export function localMinutes(t) {
    return t.hh * 60 + t.mm;
}
/** Local mean time in minutes, corrected for longitude and the zone offset. */
export function localMeanMinutes(t, lon) {
    const zoneMeridian = (t.tzOffsetMinutes / 60) * 15;
    return localMinutes(t) + (lon - zoneMeridian) * 4;
}
