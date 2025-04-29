

 // Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqdg6ePdCGvlzHpaEFgOUFPaHEsPYIApw",
  authDomain: "operationinterectiondata.firebaseapp.com",
  databaseURL: "https://operationinterectiondata-default-rtdb.firebaseio.com",
  projectId: "operationinterectiondata",
  storageBucket: "operationinterectiondata.firebasestorage.app",
  messagingSenderId: "211887231593",
  appId: "1:211887231593:web:aac4253ab20803876348f8",
  measurementId: "G-HSL5TF5FTB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM elements
const modalTabs = document.querySelectorAll('.modal-tab');
const tabContents = document.querySelectorAll('.tab-content');
const operationForm = document.getElementById('operation-form');
const statisticsForm = document.getElementById('statistics-form');
const operationDateInput = document.getElementById('operation-date');
const statisticsDateInput = document.getElementById('statistics-date');
const operationSuccess = document.getElementById('operation-success');
const statisticsSuccess = document.getElementById('statistics-success');

// Initialize date pickers for forms
$(operationDateInput).daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2000,
    maxYear: parseInt(moment().format('YYYY'), 10),
    locale: {
        format: 'YYYY-MM-DD'
    },
    autoUpdateInput: true
});

$(statisticsDateInput).daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2000,
    maxYear: parseInt(moment().format('YYYY'), 10),
    locale: {
        format: 'YYYY-MM-DD'
    },
    autoUpdateInput: true
});

// Tab switching
modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        modalTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const tabId = tab.dataset.tab;
        document.getElementById(tabId).classList.add('active');
    });
});

// Operation Form submission
operationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const operationData = {
        date: operationDateInput.value,
        operation: document.getElementById('operation-name').value,
        location: document.getElementById('operation-location').value,
        details: document.getElementById('operation-details').value,
        city: document.getElementById('operation-city').value,
        type: 'operation'
    };

    // Push data to Firebase
    database.ref('entries').push(operationData)
        .then(() => {
            operationSuccess.style.display = 'block';
            operationForm.reset();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                operationSuccess.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            console.error('Error adding document: ', error);
            alert('Error adding operation: ' + error.message);
        });
});

// Statistics Form submission
statisticsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const statisticsData = {
        date: statisticsDateInput.value,
        city: document.getElementById('statistics-city').value,
        locationCheck: parseInt(document.getElementById('location-check').value) || 0,
        interaction: parseInt(document.getElementById('interaction').value) || 0,
        arrest: parseInt(document.getElementById('arrest').value) || 0,
        detention: parseInt(document.getElementById('detention').value) || 0,
        vehicleCheck: parseInt(document.getElementById('vehicle-check').value) || 0,
        towVehicles: parseInt(document.getElementById('tow-vehicles').value) || 0,
        type: 'statistics'
    };

    // Push data to Firebase
    database.ref('entries').push(statisticsData)
        .then(() => {
            statisticsSuccess.style.display = 'block';
            statisticsForm.reset();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                statisticsSuccess.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            console.error('Error adding document: ', error);
            alert('Error adding statistics: ' + error.message);
        });
});
