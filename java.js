

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

        // Firebase configuration for interactions
        const firebaseConfig2 = {
            apiKey: "AIzaSyCqdg6ePdCGvlzHpaEFgOUFPaHEsPYIApw",
            authDomain: "operationinterectiondata.firebaseapp.com",
            databaseURL: "https://operationinterectiondata-default-rtdb.firebaseio.com",
            projectId: "operationinterectiondata",
            storageBucket: "operationinterectiondata.firebasestorage.app",
            messagingSenderId: "211887231593",
            appId: "1:211887231593:web:aac4253ab20803876348f8",
            measurementId: "G-HSL5TF5FTB"
        };

        // Initialize Firebase apps
        const app1 = firebase.initializeApp(firebaseConfig1, "app1");
        const database1 = firebase.database(app1);
        
        const app2 = firebase.initializeApp(firebaseConfig2, "app2");
        const database2 = firebase.database(app2);

        // DOM elements
        const modalTabs = document.querySelectorAll('.modal-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        const operationForm = document.getElementById('operation-form');
        const statisticsForm = document.getElementById('statistics-form');
        const interactionForm = document.getElementById('interactionForm');
        const operationDateInput = document.getElementById('operation-date');
        const statisticsDateInput = document.getElementById('statistics-date');
        const operationSuccess = document.getElementById('operation-success');
        const statisticsSuccess = document.getElementById('statistics-success');
        const interactionSuccess = document.getElementById('interaction-success');

        // Initialize date pickers for operation and statistics forms
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
            database1.ref('entries').push(operationData)
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
            database1.ref('entries').push(statisticsData)
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

        // Interaction Form functionality
        let associateCount = 0;
        
        // Set current date-time as default for interaction form
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16);
        document.getElementById('interactionDate').value = formattedDateTime;
        
        // Add DOB change listener to calculate age
        document.getElementById('dob').addEventListener('change', function() {
            calculateAge(this.value);
        });
        
        function calculateAge(dobString) {
            if (!dobString) return;
            
            const dob = new Date(dobString);
            const today = new Date();
            
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            document.getElementById('ageDisplay').textContent = age + ' years';
            return age;
        }
        
        // Add search functionality
        document.getElementById('searchBtn').addEventListener('click', searchPersonById);
        document.getElementById('idCardNo').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchPersonById();
            }
        });
        
        // Also search when ID field loses focus (tab out or click elsewhere)
        document.getElementById('idCardNo').addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                searchPersonById();
            }
        });
        
        function searchPersonById() {
            const idCardNo = document.getElementById('idCardNo').value.trim();
            if (!idCardNo) {
                alert('Please enter an ID Card Number');
                return;
            }
            
            const searchBtn = document.getElementById('searchBtn');
            const spinner = document.getElementById('searchSpinner');
            
            // Show loading spinner
            searchBtn.disabled = true;
            spinner.style.display = 'inline-block';
            
            // First search in criminals database
            database2.ref('criminals').orderByChild('id').equalTo(idCardNo).once('value')
                .then(criminalSnapshot => {
                    if (criminalSnapshot.exists()) {
                        // Found in criminals database
                        const criminalData = Object.values(criminalSnapshot.val())[0];
                        fillPersonDetails(criminalData, true);
                    } else {
                        // If not found in criminals, search in interactions
                        return database2.ref('interactions').orderByChild('idCardNo').equalTo(idCardNo).once('value')
                            .then(interactionSnapshot => {
                                if (interactionSnapshot.exists()) {
                                    // Get the most recent interaction for this person
                                    let mostRecentInteraction = null;
                                    let mostRecentDate = 0;
                                    
                                    interactionSnapshot.forEach(interaction => {
                                        const interactionData = interaction.val();
                                        const interactionDate = new Date(interactionData.date).getTime();
                                        
                                        if (interactionDate > mostRecentDate) {
                                            mostRecentDate = interactionDate;
                                            mostRecentInteraction = interactionData;
                                        }
                                    });
                                    
                                    if (mostRecentInteraction) {
                                        fillPersonDetails(mostRecentInteraction, false);
                                    } else {
                                        throw new Error('No valid interaction found');
                                    }
                                } else {
                                    throw new Error('No person found with this ID');
                                }
                            });
                    }
                })
                .catch(error => {
                    console.error('Error searching person:', error);
                    alert('No person found with this ID Card Number');
                    clearPersonDetails();
                })
                .finally(() => {
                    // Hide loading spinner
                    searchBtn.disabled = false;
                    spinner.style.display = 'none';
                });
        }
        
        function fillPersonDetails(personData, isCriminal) {
            document.getElementById('interactionName').value = personData.name || '';
            document.getElementById('nickname').value = personData.nickname || '';
            
            // Set date of birth and calculate age if available
            if (personData.dob) {
                document.getElementById('dob').value = personData.dob;
                calculateAge(personData.dob);
            } else {
                document.getElementById('dob').value = '';
                document.getElementById('ageDisplay').textContent = '';
            }
            
            document.getElementById('address').value = personData.address || '';
            document.getElementById('currentAddress').value = personData.currentAddress || personData.address || '';
            document.getElementById('contact').value = personData.contact || '';
            
            // Set city if available
            if (personData.city) {
                document.getElementById('city').value = personData.city;
            }
            
            // Display image if available
            const imageContainer = document.getElementById('personImageContainer');
            const personImage = document.getElementById('personImage');
            
            if (isCriminal && personData.image) {
                // For criminals, image is stored directly in the data
                personImage.src = personData.image;
                imageContainer.style.display = 'block';
            } else if (!isCriminal && personData.personImage) {
                // For interactions, person image might be stored as personImage
                personImage.src = personData.personImage;
                imageContainer.style.display = 'block';
            } else {
                imageContainer.style.display = 'none';
            }
            
            // If this is a criminal, set the criminalId
            if (isCriminal) {
                document.getElementById('criminalId').value = personData.key || '';
            }
        }
        
        function clearPersonDetails() {
            document.getElementById('interactionName').value = '';
            document.getElementById('nickname').value = '';
            document.getElementById('dob').value = '';
            document.getElementById('ageDisplay').textContent = '';
            document.getElementById('address').value = '';
            document.getElementById('currentAddress').value = '';
            document.getElementById('contact').value = '';
            document.getElementById('personImageContainer').style.display = 'none';
            document.getElementById('criminalId').value = '';
        }
        
        // Add associate function
        function addAssociate() {
            associateCount++;
            const associateId = `associate_${associateCount}`;
            
            const associateHtml = `
                <div class="associate-item" id="${associateId}">
                    <span class="associate-remove" onclick="removeAssociate('${associateId}')">×</span>
                    <div class="form-group">
                        <label for="${associateId}_id">ID Card No.</label>
                        <input type="text" id="${associateId}_id" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="${associateId}_name">Name</label>
                        <input type="text" id="${associateId}_name" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="${associateId}_address">Address</label>
                        <input type="text" id="${associateId}_address" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="${associateId}_remarks">Remarks</label>
                        <input type="text" id="${associateId}_remarks" class="form-control">
                    </div>
                </div>
            `;
            
            document.getElementById('associatesContainer').insertAdjacentHTML('beforeend', associateHtml);
        }
        
        function removeAssociate(id) {
            document.getElementById(id).remove();
        }
        
        // Vehicle image upload
        document.getElementById('vehicleImageUpload').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('vehicleImagePreview').innerHTML = `
                        <img src="${e.target.result}">
                        <button type="button" class="remove-btn" onclick="removeVehicleImage()" style="margin-top: 5px;">× Remove Image</button>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
        
        function removeVehicleImage() {
            document.getElementById('vehicleImagePreview').innerHTML = '';
            document.getElementById('vehicleImageUpload').value = '';
        }
        
        // Clear interaction form
        function clearInteractionForm() {
            interactionForm.reset();
            document.getElementById('personImageContainer').style.display = 'none';
            document.getElementById('vehicleImagePreview').innerHTML = '';
            document.getElementById('associatesContainer').innerHTML = '';
            document.getElementById('ageDisplay').textContent = '';
            associateCount = 0;
            
            // Reset date to current
            const now = new Date();
            const formattedDateTime = now.toISOString().slice(0, 16);
            document.getElementById('interactionDate').value = formattedDateTime;
        }
        
        // Interaction Form submission
        interactionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const criminalId = document.getElementById('criminalId').value;
            const idCardNo = document.getElementById('idCardNo').value;
            const name = document.getElementById('interactionName').value;
            const nickname = document.getElementById('nickname').value;
            const dob = document.getElementById('dob').value;
            const address = document.getElementById('address').value;
            const currentAddress = document.getElementById('currentAddress').value;
            const contact = document.getElementById('contact').value;
            const location = document.getElementById('location').value;
            const city = document.getElementById('city').value;
            const vehicleRegNo = document.getElementById('vehicleRegNo').value;
            const vehicleChassisNo = document.getElementById('vehicleChassisNo').value;
            const vehicleModel = document.getElementById('vehicleModel').value;
            const vehicleType = document.getElementById('vehicleType').value;
            const remarks = document.getElementById('remarks').value;
            const interactedOfficers = document.getElementById('interactedOfficers').value;
            const date = document.getElementById('interactionDate').value;
            
            // Get person image if available
            const personImage = document.getElementById('personImage').src;
            const personImageData = personImage.startsWith('data:image') ? personImage : '';
            
            // Get vehicle image
            const vehicleImageFile = document.getElementById('vehicleImageUpload').files[0];
            
            // Collect associates data
            const associates = [];
            document.querySelectorAll('.associate-item').forEach(item => {
                const id = item.id;
                associates.push({
                    id: document.getElementById(`${id}_id`).value,
                    name: document.getElementById(`${id}_name`).value,
                    address: document.getElementById(`${id}_address`).value,
                    remarks: document.getElementById(`${id}_remarks`).value
                });
            });
            
            if (!idCardNo || !name || !address || !currentAddress || !contact || !location || !city || !date) {
                alert('Please fill all required fields');
                return;
            }
            
            // Create interaction object
            const interaction = {
                criminalId: criminalId,
                idCardNo: idCardNo,
                name: name,
                nickname: nickname,
                dob: dob,
                address: address,
                currentAddress: currentAddress,
                contact: contact,
                location: location,
                city: city,
                vehicleRegNo: vehicleRegNo,
                vehicleChassisNo: vehicleChassisNo,
                vehicleModel: vehicleModel,
                vehicleType: vehicleType,
                remarks: remarks,
                interactedOfficers: interactedOfficers,
                date: date,
                associates: associates,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            
            // Add person image if available
            if (personImageData) {
                interaction.personImage = personImageData;
            }
            
            // Process vehicle image
            if (vehicleImageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    interaction.vehicleImage = e.target.result;
                    saveInteractionToFirebase(interaction);
                };
                reader.readAsDataURL(vehicleImageFile);
            } else {
                saveInteractionToFirebase(interaction);
            }
        });
        
        function saveInteractionToFirebase(interaction) {
            // Push the interaction to Firebase
            const newInteractionRef = database2.ref('interactions').push();
            newInteractionRef.set(interaction)
                .then(() => {
                    interactionSuccess.style.display = 'block';
                    clearInteractionForm();
                    
                    // Hide success message after 3 seconds
                    setTimeout(() => {
                        interactionSuccess.style.display = 'none';
                    }, 3000);
                })
                .catch(error => {
                    alert('Error saving interaction: ' + error.message);
                });
        }
  
