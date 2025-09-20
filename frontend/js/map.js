// Extended list of synthetic locations with coordinates
const locations = [
    {name: "Central Recycling Hub", type: "recycling", lat: 40.7128, lng: -74.0060, rating: 4.5},
    {name: "E-Waste Center", type: "ewaste", lat: 40.7210, lng: -74.0005, rating: 4.2},
    {name: "Community Compost Site", type: "composting", lat: 40.7150, lng: -74.0110, rating: 4.7},
    // ... (keep your other locations)
];

// Initialize the map only when the tab is activated
let map = null;
let markers = [];

function initMap() {
    console.log("Initializing map...");
    
    // Check if map container exists
    const mapContainer = document.getElementById('mapCanvas');
    if (!mapContainer) {
        console.error("Map container not found!");
        return;
    }
    
    // Remove any existing map instance
    if (map) {
        map.remove();
        map = null;
    }
    
    // Create map centered on Manhattan
    map = L.map('mapCanvas').setView([40.7128, -74.0060], 13);
    
    // Add tile layer (OpenStreetMap as base)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add a more stylish alternative layer (CartoDB)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
    
    // Create custom icons for different location types
    function createCustomIcon(type) {
        let className = 'custom-marker';
        let iconHtml = '';
        
        switch(type) {
            case 'recycling':
                className += ' marker-recycling';
                iconHtml = '♻️';
                break;
            case 'ewaste':
                className += ' marker-ewaste';
                iconHtml = '📱';
                break;
            case 'composting':
                className += ' marker-composting';
                iconHtml = '🌱';
                break;
            default:
                className += ' marker-recycling';
                iconHtml = '♻️';
        }
        
        return L.divIcon({
            className: className,
            html: `<div class="marker-inner">${iconHtml}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
    }
    
    // Clear existing markers
    markers = [];
    
    // Add markers for each location
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng], {
            icon: createCustomIcon(location.type)
        }).addTo(map);
        
        // Bind popup to marker
        marker.bindPopup(`
            <div class="popup-content">
                <h4>${location.name}</h4>
                <p>Type: <span class="location-type type-${location.type}">${getTypeIcon(location.type)} ${location.type}</span></p>
                <p>Rating: ${location.rating} ⭐</p>
            </div>
        `);
        
        markers.push({
            element: marker,
            type: location.type
        });
    });
    
    // Fix map rendering after tab switch
    setTimeout(() => {
        if (map) {
            map.invalidateSize(true);
        }
    }, 100);
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        // Remove any existing event listeners
        button.replaceWith(button.cloneNode(true));
    });
    
    // Re-select buttons after cloning
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            // Show/hide markers based on filter
            markers.forEach(marker => {
                if (filter === 'all' || marker.type === filter) {
                    map.addLayer(marker.element);
                } else {
                    map.removeLayer(marker.element);
                }
            });
            
            // Update location list
            updateLocationList(filter);
        });
    });
    
    // Initialize location list
    updateLocationList();
}

// Function to update location list based on filter
function updateLocationList(filter = 'all') {
    const container = document.getElementById('locationList');
    if (!container) return;
    
    const filteredLocations = filter === 'all' 
        ? locations 
        : locations.filter(loc => loc.type === filter);
    
    container.innerHTML = filteredLocations.map(loc => `
        <div class="location-card">
            <h4>${loc.name}</h4>
            <p>
                <span class="location-type type-${loc.type}">${getTypeIcon(loc.type)} ${loc.type}</span>
            </p>
            <p>Rating: ${loc.rating} ⭐</p>
            <p>Coordinates: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</p>
        </div>
    `).join('');
}

// Helper function to get icon for location type
function getTypeIcon(type) {
    switch(type) {
        case 'recycling': return '♻️';
        case 'ewaste': return '📱';
        case 'composting': return '🌱';
        default: return '📍';
    }
}

// Handle tab switching
document.addEventListener('DOMContentLoaded', function() {
    const mapTab = document.querySelector('[data-tab="map"]');
    
    if (mapTab) {
        mapTab.addEventListener('click', function() {
            // Small delay to ensure the tab is visible before initializing map
            setTimeout(initMap, 300);
        });
    }
    
    // Also initialize if map tab is active on page load
    if (document.getElementById('map') && document.getElementById('map').classList.contains('active')) {
        setTimeout(initMap, 500);
    }
});