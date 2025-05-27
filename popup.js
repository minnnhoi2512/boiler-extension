console.log("Execute script");

document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    
    calculateBtn.addEventListener('click', function() {
        // Get input values
        const traffic = parseFloat(document.getElementById('traffic').value) || 0;
        const timeOnSite = parseFloat(document.getElementById('timeOnSite').value) || 0;
        const keywordPrice = 1; // Fixed at $1 as per requirement

        // Validate input
        if (traffic <= 0 || timeOnSite <= 0) {
            alert('Please enter valid numbers for traffic and time on site');
            return;
        }

        // Calculate price
        const price = calculatePrice(traffic, timeOnSite, keywordPrice);
        
        // Display results
        displayResults(price, traffic, timeOnSite);
    });

    // Calculate website price
    function calculatePrice(traffic, timeOnSite, keywordPrice) {
        // Base calculation: traffic * timeOnSite * keywordPrice
        let basePrice = traffic * timeOnSite * keywordPrice;
        
        // Apply time on site multiplier
        // More time on site = higher value
        const timeMultiplier = Math.min(timeOnSite / 2, 3); // Cap at 3x
        
        // Apply traffic multiplier
        // Higher traffic = better value
        const trafficMultiplier = Math.min(traffic / 10000, 5); // Cap at 5x
        
        // Calculate final price
        const finalPrice = basePrice * timeMultiplier * trafficMultiplier;
        
        return Math.round(finalPrice);
    }

    // Display results
    function displayResults(price, traffic, timeOnSite) {
        const priceElement = document.getElementById('price');
        const detailsElement = document.getElementById('details');
        
        // Format price with commas
        const formattedPrice = price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        
        // Display price
        priceElement.textContent = formattedPrice;
        
        // Display details
        const details = [
            `Monthly Traffic: ${traffic.toLocaleString()} visitors`,
            `Average Time on Site: ${timeOnSite} minutes`,
            `Keyword Price: $${keywordPrice}`,
            `Calculation: ${traffic.toLocaleString()} × ${timeOnSite} × $${keywordPrice}`
        ].join('<br>');
        
        detailsElement.innerHTML = details;
        resultDiv.style.display = 'block';
    }
});