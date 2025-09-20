import { API_BASE } from './config.js';

class CarbonCalculator {
    constructor() {
        this.form = document.getElementById('carbonForm');
        this.vehicleSelect = document.getElementById('vehicleType');
        this.fuelSelect = document.getElementById('fuelType');
        
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.vehicleSelect.addEventListener('change', this.updateFuelTypes.bind(this));
            
            // Initialize fuel types for default vehicle selection
            this.updateFuelTypes({ target: this.vehicleSelect });
        }
    }

    updateFuelTypes(event) {
        const vehicleType = event.target.value;
        const fuelSelect = this.fuelSelect;
        
        // Clear existing options
        fuelSelect.innerHTML = '';
        
        // Define fuel types for each vehicle
        const fuelTypes = {
            car: ['petrol', 'diesel', 'hybrid', 'electric'],
            motorcycle: ['petrol', 'electric'],
            bus: ['diesel', 'electric'],
            train: ['electric']
        };

        // Add new options
        fuelTypes[vehicleType].forEach(fuel => {
            const option = document.createElement('option');
            option.value = fuel;
            option.textContent = fuel.charAt(0).toUpperCase() + fuel.slice(1);
            fuelSelect.appendChild(option);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const vehicle = {
            type: document.getElementById('vehicleType').value,
            fuelType: document.getElementById('fuelType').value,
            distance: parseFloat(document.getElementById('distance').value),
            frequency: document.getElementById('frequency').value
        };

        const result = this.calculateEmissions(vehicle);
        this.displayResults(result);
    }

    calculateEmissions(vehicle) {
        // Emission factors in grams CO2 per kilometer
        const emissionFactors = {
            car: {
                petrol: 192,
                diesel: 171,
                hybrid: 92,
                electric: 53
            },
            motorcycle: {
                petrol: 103,
                electric: 35
            },
            bus: {
                diesel: 89,
                electric: 45
            },
            train: {
                electric: 41
            }
        };

        // Frequency multipliers for annual calculation
        const frequencyMultipliers = {
            daily: 365,
            weekly: 52,
            monthly: 12,
            yearly: 1
        };

        const baseEmission = emissionFactors[vehicle.type][vehicle.fuelType];
        const annualDistance = vehicle.distance * frequencyMultipliers[vehicle.frequency];
        const totalEmissions = (baseEmission * annualDistance) / 1000; // Convert to kg CO2

        return {
            footprint: Math.round(totalEmissions),
            details: {
                perKm: baseEmission,
                annualDistance: annualDistance
            }
        };
    }

    displayResults(result) {
        // Update main result
        this.totalCarbon.textContent = result.footprint.toLocaleString();
        
        // Calculate equivalents
        const treesRequired = Math.ceil(result.footprint / 21); // One tree absorbs ~21kg CO2 per year
        const phoneCharges = Math.ceil(result.footprint * 0.11); // ~0.11kg CO2 per phone charge
        
        // Update comparison values
        this.treesNeeded.textContent = treesRequired.toLocaleString();
        this.energyEquiv.textContent = phoneCharges.toLocaleString();
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CarbonCalculator();
});
qyi-urio-dtg