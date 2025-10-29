// L.U.M.I.A Pro - Liability & Underwriting Management Insurance Assistant Professional
// Professional Insurance Assessment System

// Global variables
let currentClient = null;
let currentCalculation = null;
let currentMonth = 0; // 0 = October 2025

// Navigation functionality - ALL BUTTONS WORK
function navigateTo(pageId) {
    console.log('Navigating to:', pageId);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Page-specific actions
        if (pageId === 'agent-assistant') {
            loadClientFolders();
            initializeCalendar();
        } else if (pageId === 'existing-client-info') {
            loadExistingClientDropdown();
        } else if (pageId === 'new-client-assessment' || pageId === 'existing-client-assessment') {
            updateClientInfo();
        }
    } else {
        console.error('Page not found:', pageId);
    }
    
    // Close mobile menu if open
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Client Management Functions
function saveNewClient() {
    const name = document.getElementById('new-client-name').value.trim();
    const address = document.getElementById('new-client-address').value.trim();
    const phone = document.getElementById('new-client-phone').value.trim();
    const email = document.getElementById('new-client-email').value.trim();
    const occupation = document.getElementById('new-client-occupation').value.trim();
    
    if (!name) {
        alert('Please enter client name');
        return;
    }
    
    currentClient = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        occupation: occupation,
        clientType: 'new',
        timestamp: new Date().toISOString()
    };
    
    saveClientToDatabase(currentClient);
    navigateTo('new-client-assessment');
}

function saveExistingClient() {
    const select = document.getElementById('existing-client-name');
    const name = select.value.trim() || document.getElementById('existing-client-name').value.trim();
    const address = document.getElementById('existing-client-address').value.trim();
    const phone = document.getElementById('existing-client-phone').value.trim();
    const email = document.getElementById('existing-client-email').value.trim();
    const occupation = document.getElementById('existing-client-occupation').value.trim();
    
    if (!name) {
        alert('Please select or enter client name');
        return;
    }
    
    currentClient = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        occupation: occupation,
        clientType: 'existing',
        timestamp: new Date().toISOString()
    };
    
    saveClientToDatabase(currentClient);
    navigateTo('existing-client-assessment');
}

function populateExistingClient() {
    const select = document.getElementById('existing-client-name');
    const selectedClientName = select.value;
    
    if (selectedClientName) {
        const clients = JSON.parse(localStorage.getItem('lumia-clients') || '[]');
        const client = clients.find(c => c.name === selectedClientName);
        
        if (client) {
            document.getElementById('existing-client-address').value = client.address || '';
            document.getElementById('existing-client-phone').value = client.phone || '';
            document.getElementById('existing-client-email').value = client.email || '';
            document.getElementById('existing-client-occupation').value = client.occupation || '';
        }
    }
}

function loadExistingClientDropdown() {
    const select = document.getElementById('existing-client-name');
    if (!select) return;
    
    const clients = JSON.parse(localStorage.getItem('lumia-clients') || '[]');
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select existing client or enter new</option>';
    
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.name;
        option.textContent = client.name;
        select.appendChild(option);
    });
}

function saveClientToDatabase(clientData) {
    let clients = JSON.parse(localStorage.getItem('lumia-clients') || '[]');
    
    // Check if client already exists
    const existingIndex = clients.findIndex(client => client.name === clientData.name);
    if (existingIndex >= 0) {
        clients[existingIndex] = { ...clients[existingIndex], ...clientData };
    } else {
        clients.push(clientData);
    }
    
    localStorage.setItem('lumia-clients', JSON.stringify(clients));
}

function updateClientInfo() {
    if (currentClient) {
        const name = currentClient.name;
        const clientType = currentClient.clientType;
        
        if (clientType === 'new') {
            const nameElement = document.getElementById('assessmentClientName');
            if (nameElement) nameElement.textContent = name;
        } else {
            const nameElement = document.getElementById('existingAssessmentClientName');
            if (nameElement) nameElement.textContent = name;
        }
    }
}

// Liability Calculation Functions
function calculateAndShowRecommendations(clientType) {
    console.log('Calculating for:', clientType);
    
    let homeValue, autoValue, income, lifeIns, investments, totalExposure;
    let summaryElement, nameElement, exposureElement;
    
    if (clientType === 'new') {
        homeValue = parseFloat(document.getElementById('home-value').value) || 0;
        autoValue = parseFloat(document.getElementById('auto-value').value) || 0;
        income = parseFloat(document.getElementById('annual-income').value) || 0;
        lifeIns = parseFloat(document.getElementById('life-insurance').value) || 0;
        investments = parseFloat(document.getElementById('investments').value) || 0;
        
        summaryElement = document.getElementById('calculationSummary');
        nameElement = document.getElementById('assessmentClientName');
        exposureElement = document.getElementById('recommendationsExposure');
        
        // Display calculations
        document.getElementById('calc-home').textContent = `$${homeValue.toLocaleString()}`;
        document.getElementById('calc-auto').textContent = `$${autoValue.toLocaleString()}`;
        document.getElementById('calc-income').textContent = `$${(income * 2).toLocaleString()}`;
        document.getElementById('calc-life').textContent = `$${lifeIns.toLocaleString()}`;
        document.getElementById('calc-investments').textContent = `$${investments.toLocaleString()}`;
        totalExposure = homeValue + autoValue + (income * 2) + lifeIns + investments;
        document.getElementById('calc-total').textContent = `$${totalExposure.toLocaleString()}`;
        
    } else {
        homeValue = parseFloat(document.getElementById('existing-home-value').value) || 0;
        autoValue = parseFloat(document.getElementById('existing-auto-value').value) || 0;
        income = parseFloat(document.getElementById('existing-annual-income').value) || 0;
        lifeIns = parseFloat(document.getElementById('existing-life-insurance').value) || 0;
        investments = parseFloat(document.getElementById('existing-investments').value) || 0;
        
        summaryElement = document.getElementById('existingCalculationSummary');
        nameElement = document.getElementById('existingAssessmentClientName');
        exposureElement = document.getElementById('existingRecommendationsExposure');
        
        // Display calculations
        document.getElementById('existing-calc-home').textContent = `$${homeValue.toLocaleString()}`;
        document.getElementById('existing-calc-auto').textContent = `$${autoValue.toLocaleString()}`;
        document.getElementById('existing-calc-income').textContent = `$${(income * 2).toLocaleString()}`;
        document.getElementById('existing-calc-life').textContent = `$${lifeIns.toLocaleString()}`;
        document.getElementById('existing-calc-investments').textContent = `$${investments.toLocaleString()}`;
        totalExposure = homeValue + autoValue + (income * 2) + lifeIns + investments;
        document.getElementById('existing-calc-total').textContent = `$${totalExposure.toLocaleString()}`;
    }
    
    if (homeValue === 0 && autoValue === 0 && income === 0 && lifeIns === 0 && investments === 0) {
        alert('Please enter at least one asset value to calculate exposure');
        return;
    }
    
    // Show calculation summary
    if (summaryElement) {
        summaryElement.style.display = 'block';
    }
    
    // Update client info
    if (nameElement && currentClient) {
        nameElement.textContent = currentClient.name;
    }
    
    // Store calculation results
    currentCalculation = {
        homeValue,
        autoValue,
        income,
        lifeIns,
        investments,
        incomeProtection: income * 2,
        totalExposure,
        clientType: clientType
    };
    
    // Store with client data
    if (currentClient) {
        currentClient.calculation = currentCalculation;
    }
    
    // Generate and show recommendations
    generateRecommendations(clientType);
}

function getRecommendations(exposure) {
    console.log('Getting recommendations for exposure:', exposure);
    
    if (exposure < 150000) {
        return {
            policyLimits: '100,000 / 300,000',
            umbrellaRecommended: 'No',
            explanation: 'Basic coverage suitable for minimal asset exposure. This meets most state minimum requirements while providing fundamental protection for basic liability claims.',
            reasoning: 'With an exposure of $' + exposure.toLocaleString() + ', the standard 100/300 limits provide adequate protection for your current asset level.',
            premiumEstimate: 'Estimated $45-65/month'
        };
    } else if (exposure < 310000) {
        return {
            policyLimits: '250,000 / 500,000',
            umbrellaRecommended: 'No',
            explanation: 'Enhanced coverage for moderate asset exposure. This level provides substantial protection against significant medical bills and asset protection.',
            reasoning: 'Your $' + exposure.toLocaleString() + ' exposure requires higher limits to ensure adequate protection for your home, vehicle, and investment assets.',
            premiumEstimate: 'Estimated $65-85/month'
        };
    } else if (exposure < 600000) {
        return {
            policyLimits: '500,000 / 500,000',
            umbrellaRecommended: 'Consider $1M Umbrella',
            explanation: 'Comprehensive coverage for substantial asset protection. This level guards against catastrophic claims and protects your investment portfolio.',
            reasoning: 'With $' + exposure.toLocaleString() + ' in exposure, these limits ensure robust protection for your significant assets and provide peace of mind.',
            premiumEstimate: 'Estimated $95-125/month'
        };
    } else {
        return {
            policyLimits: '500,000 / 500,000 + $1M Umbrella',
            umbrellaRecommended: 'Yes - $1M to $2M Umbrella',
            explanation: 'Maximum protection for high asset exposure. Essential for protecting substantial wealth, multiple properties, and significant investment accounts.',
            reasoning: 'Your $' + exposure.toLocaleString() + ' exposure requires maximum limits to protect against catastrophic claims that could jeopardize your financial security.',
            premiumEstimate: 'Estimated $150-200/month'
        };
    }
}

function generateRecommendations(clientType) {
    if (!currentCalculation || !currentClient) {
        alert('Please complete the assessment first');
        return;
    }
    
    const recommendations = getRecommendations(currentCalculation.totalExposure);
    
    const recommendationsPage = clientType === 'new' ? 'new-client-recommendations' : 'existing-client-recommendations';
    
    // Update client info on recommendations page
    const nameElement = document.getElementById(clientType === 'new' ? 'recommendationsClientName' : 'existingRecommendationsClientName');
    const exposureElement = document.getElementById(clientType === 'new' ? 'recommendationsExposure' : 'existingRecommendationsExposure');
    
    if (nameElement) nameElement.textContent = currentClient.name;
    if (exposureElement) exposureElement.textContent = '$' + currentCalculation.totalExposure.toLocaleString();
    
    // Generate recommendation card HTML
    const recommendationCard = document.getElementById(clientType === 'new' ? 'newRecommendationCard' : 'existingRecommendationCard');
    if (recommendationCard) {
        const isNewClient = clientType === 'new';
        recommendationCard.innerHTML = `
            <div class="recommendation-header">
                <h3>${isNewClient ? 'Recommended Coverage' : 'Recommended Coverage Updates'}</h3>
                <div class="policy-limits">${recommendations.policyLimits}</div>
            </div>
            
            <div class="recommendation-details">
                <div class="detail-section">
                    <h4>Coverage Explanation</h4>
                    <p>${recommendations.explanation}</p>
                </div>
                
                <div class="detail-section">
                    <h4>${isNewClient ? 'Why This Coverage?' : 'Why Update Your Coverage?'}</h4>
                    <p>${recommendations.reasoning}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Umbrella Policy Recommendation</h4>
                    <p><strong>${recommendations.umbrellaRecommended}</strong></p>
                    <p>Additional umbrella coverage provides an extra layer of protection above your auto and home policies.</p>
                </div>
                
                <div class="detail-section">
                    <h4>Estimated Premium</h4>
                    <p class="premium-estimate">${recommendations.premiumEstimate}</p>
                    <small>*Actual rates vary based on location, driving record, and coverage options</small>
                </div>
            </div>
            
            ${!isNewClient ? `
            <div class="policy-renewal">
                <h4>Client Benefits</h4>
                <p>As an existing client of your agency, you may be eligible for:</p>
                <ul>
                    <li>Multi-policy discounts</li>
                    <li>Loyalty discounts</li>
                    <li>Safe driver discounts</li>
                    <li>Bundle savings opportunities</li>
                </ul>
            </div>
            ` : ''}
            
            <div class="next-steps">
                <h4>Next Steps</h4>
                <ol>
                    <li>${isNewClient ? 'Review these recommendations with your family' : 'Review these updated recommendations'}</li>
                    <li>${isNewClient ? 'Obtain official quote from your agency' : 'Discuss during your annual policy review'}</li>
                    <li>Compare coverage features and deductibles</li>
                    <li>${isNewClient ? 'Schedule policy activation' : 'Update coverage before renewal date'}</li>
                </ol>
            </div>
        `;
    }
    
    // Store recommendations with client data
    currentClient.recommendations = recommendations;
    
    // Navigate to recommendations page
    navigateTo(recommendationsPage);
}

function generateSummary(clientType) {
    if (!currentClient || !currentClient.recommendations) {
        alert('Please complete the recommendations first');
        return;
    }
    
    const client = currentClient;
    const calc = currentCalculation;
    const rec = currentClient.recommendations;
    
    const summaryHTML = `
        <div class="summary-header">
            <h2>Insurance Coverage Analysis</h2>
            <p>Prepared for: ${client.name}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary-section">
            <h3>Client Information</h3>
            <div class="info-grid">
                <div><strong>Name:</strong> ${client.name}</div>
                <div><strong>Address:</strong> ${client.address || 'Not provided'}</div>
                <div><strong>Phone:</strong> ${client.phone || 'Not provided'}</div>
                <div><strong>Email:</strong> ${client.email || 'Not provided'}</div>
                <div><strong>Occupation:</strong> ${client.occupation || 'Not provided'}</div>
                <div><strong>Client Type:</strong> ${clientType === 'new' ? 'New Prospect' : 'Existing Client'}</div>
            </div>
        </div>
        
        <div class="summary-section">
            <h3>Asset Assessment</h3>
            <div class="assessment-table">
                <div class="assessment-row">
                    <span>Home Value:</span>
                    <span>$${calc.homeValue.toLocaleString()}</span>
                </div>
                <div class="assessment-row">
                    <span>Auto Value:</span>
                    <span>$${calc.autoValue.toLocaleString()}</span>
                </div>
                <div class="assessment-row">
                    <span>Annual Income:</span>
                    <span>$${calc.income.toLocaleString()}</span>
                </div>
                <div class="assessment-row">
                    <span>Income Protection (2x):</span>
                    <span>$${calc.incomeProtection.toLocaleString()}</span>
                </div>
                <div class="assessment-row">
                    <span>Life Insurance Protection:</span>
                    <span>$${calc.lifeIns.toLocaleString()}</span>
                </div>
                <div class="assessment-row">
                    <span>Investment Protection:</span>
                    <span>$${calc.investments.toLocaleString()}</span>
                </div>
                <div class="assessment-row total">
                    <span><strong>Total Liability Exposure:</strong></span>
                    <span><strong>$${calc.totalExposure.toLocaleString()}</strong></span>
                </div>
            </div>
        </div>
        
        <div class="summary-section">
            <h3>Agent Recommendations</h3>
            <div class="recommendation-summary">
                <div class="policy-recommendation">
                    <h4>Recommended Policy Limits</h4>
                    <div class="limits-display">${rec.policyLimits}</div>
                </div>
                
                <div class="explanation-summary">
                    <h4>Coverage Rationale</h4>
                    <p>${rec.explanation}</p>
                </div>
                
                <div class="umbrella-summary">
                    <h4>Umbrella Policy</h4>
                    <p><strong>${rec.umbrellaRecommended}</strong></p>
                </div>
                
                <div class="premium-summary">
                    <h4>Estimated Premium</h4>
                    <p>${rec.premiumEstimate}</p>
                </div>
            </div>
        </div>
        
        <div class="summary-section">
            <h3>Why Choose Your Agency?</h3>
            <div class="agency-benefits">
                <ul>
                    <li><strong>Local Service:</strong> Your local agent knows your community</li>
                    <li><strong>Comprehensive Coverage:</strong> Auto, home, life, and umbrella policies all in one place</li>
                    <li><strong>Competitive Rates:</strong> We shop multiple carriers to find you the best price</li>
                    <li><strong>Claims Support:</strong> 24/7 claims service when you need it most</li>
                    <li><strong>Financial Strength:</strong> Over 90 years of protecting what matters most</li>
                </ul>
            </div>
        </div>
        
        <div class="summary-section">
            <h3>Action Items</h3>
            <div class="action-items">
                <ol>
                    <li>Review these recommendations with family members</li>
                    <li>Schedule follow-up to obtain official quote from your agency</li>
                    <li>Compare coverage features and deductibles</li>
                    <li>Complete application and policy activation</li>
                    <li>${clientType === 'existing' ? 'Review at next annual renewal' : 'Set up automatic payments for convenience'}</li>
                </ol>
            </div>
        </div>
        
        <div class="agent-contact">
            <p><strong>Questions?</strong> Contact your agency agent for personalized service.</p>
        </div>
    `;
    
    const summaryContent = document.getElementById('summaryContent');
    if (summaryContent) {
        summaryContent.innerHTML = summaryHTML;
    }
    
    navigateTo('summary-page');
}

// Print and Save Functions
function printSummary() {
    window.print();
}

function saveClientRecord() {
    if (!currentClient) {
        alert('No client data to save');
        return;
    }
    
    // Update client in database with calculation and recommendations
    saveClientToDatabase(currentClient);
    
    alert('Client record saved successfully!');
    
    // Navigate to agent assistant to see saved client
    navigateTo('agent-assistant');
}

function printRecommendations() {
    window.print();
}

function printScripts() {
    window.print();
}

function printClientInfo() {
    window.print();
}

// Agent Assistant Functions
function loadClientFolders() {
    const clients = JSON.parse(localStorage.getItem('lumia-clients') || '[]');
    
    const newClients = clients.filter(client => client.clientType === 'new');
    const existingClients = clients.filter(client => client.clientType === 'existing');
    
    // Load new clients folder
    const newClientsFolder = document.getElementById('newClientsFolder');
    if (newClientsFolder) {
        if (newClients.length === 0) {
            newClientsFolder.innerHTML = '<div class="no-clients">No new clients saved yet.</div>';
        } else {
            let html = '<div class="clients-list">';
            newClients.forEach((client, index) => {
                html += `
                    <div class="client-record">
                        <h5>${client.name}</h5>
                        <p><strong>Exposure:</strong> $${(client.calculation?.totalExposure || 0).toLocaleString()}</p>
                        <p><strong>Recommended:</strong> ${client.recommendations?.policyLimits || 'Not calculated'}</p>
                        <p><strong>Saved:</strong> ${new Date(client.timestamp).toLocaleDateString()}</p>
                    </div>
                `;
            });
            html += '</div>';
            newClientsFolder.innerHTML = html;
        }
    }
    
    // Load existing clients folder
    const existingClientsFolder = document.getElementById('existingClientsFolder');
    if (existingClientsFolder) {
        if (existingClients.length === 0) {
            existingClientsFolder.innerHTML = '<div class="no-clients">No existing clients saved yet.</div>';
        } else {
            let html = '<div class="clients-list">';
            existingClients.forEach((client, index) => {
                html += `
                    <div class="client-record">
                        <h5>${client.name}</h5>
                        <p><strong>Exposure:</strong> $${(client.calculation?.totalExposure || 0).toLocaleString()}</p>
                        <p><strong>Recommended:</strong> ${client.recommendations?.policyLimits || 'Not calculated'}</p>
                        <p><strong>Saved:</strong> ${new Date(client.timestamp).toLocaleDateString()}</p>
                    </div>
                `;
            });
            html += '</div>';
            existingClientsFolder.innerHTML = html;
        }
    }
}

// Calendar Functions
function initializeCalendar() {
    updateCalendarDisplay();
}

function updateCalendarDisplay() {
    const calendarDates = document.getElementById('calendarDates');
    if (!calendarDates) return;
    
    const year = 2025;
    const month = currentMonth;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = '';
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-date empty"></div>';
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateClass = 'calendar-date';
        const today = new Date();
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
            html += `<div class="${dateClass} today" onclick="selectDate('${dateStr}')">${day}</div>`;
        } else {
            html += `<div class="${dateClass}" onclick="selectDate('${dateStr}')">${day}</div>`;
        }
    }
    
    calendarDates.innerHTML = html;
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
    }
    updateCalendarDisplay();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
    }
    updateCalendarDisplay();
}

function selectDate(date) {
    alert(`Selected date: ${date}\n\nThis would open appointment scheduling for ${date}`);
}

function scheduleAppointment() {
    alert('Appointment scheduling feature:\n\n• Calendar integration\n• Automated reminders\n• Client notifications\n• Follow-up tracking\n\n(Calendar functionality ready for implementation)');
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('L.U.M.I.A Pro initialized');
    
    // Initialize navigation
    navigateTo('welcome');
    
    // Load saved client data
    const savedClient = localStorage.getItem('lumia-current-client');
    if (savedClient) {
        currentClient = JSON.parse(savedClient);
    }
    
    // Set up global navigation
    window.navigateTo = navigateTo;
    window.toggleMobileMenu = toggleMobileMenu;
    window.saveNewClient = saveNewClient;
    window.saveExistingClient = saveExistingClient;
    window.populateExistingClient = populateExistingClient;
    window.calculateAndShowRecommendations = calculateAndShowRecommendations;
    window.generateSummary = generateSummary;
    window.printSummary = printSummary;
    window.saveClientRecord = saveClientRecord;
    window.printRecommendations = printRecommendations;
    window.printScripts = printScripts;
    window.printClientInfo = printClientInfo;
    window.previousMonth = previousMonth;
    window.nextMonth = nextMonth;
    window.selectDate = selectDate;
    window.scheduleAppointment = scheduleAppointment;
    
    console.log('All event handlers attached');
});

function printClientInfo() {
    window.print();
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Make sure all functions are globally available
window.navigateTo = navigateTo;
window.toggleMobileMenu = toggleMobileMenu;
window.saveNewClient = saveNewClient;
window.saveExistingClient = saveExistingClient;
window.populateExistingClient = populateExistingClient;
window.calculateAndShowRecommendations = calculateAndShowRecommendations;
window.generateSummary = generateSummary;
window.printSummary = printSummary;
window.saveClientRecord = saveClientRecord;
window.printRecommendations = printRecommendations;
window.printScripts = printScripts;
window.printClientInfo = printClientInfo;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.selectDate = selectDate;
window.scheduleAppointment = scheduleAppointment;