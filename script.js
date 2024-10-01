// Handle user sign-up and save to local storage
function handleSignUp(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value.trim().toLowerCase();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    const userData = {
        name,
        email,
        password
    };

    localStorage.setItem('user', JSON.stringify(userData));

    alert('Sign up Successful!😁 You will be redirected to the attendance page.');
    window.location.href = "attendance.html";  // Redirect to attendance page
}

// Function to check biometric support and trigger biometric authentication
function checkAndMarkAttendance(event) {
    event.preventDefault();

    if (window.PublicKeyCredential) {
        // Biometric device supported, attempt to trigger biometric authentication
        navigator.credentials.get({ publicKey: { challenge: new Uint8Array(32), timeout: 60000 } })
            .then((cred) => {
                // Successful biometric verification
                markAttendanceBiometric();
            })
            .catch((err) => {
                // Biometric not verified or user canceled
                console.error('Biometric authentication failed:', err);
                status.innerHTML = 'Biometric authentication failed or canceled.';
                status.style.color = 'red';
            });
    } else {
        // No biometric support, fallback to normal attendance marking
        markAttendance(event);
    }
}

// Function to mark attendance after biometric authentication
function markAttendanceBiometric() {
    const enteredDepartment = document.getElementById('department').value.trim();
    const status = document.getElementById('status');

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        const currentTime = new Date().toLocaleString();
        const attendanceRecord = {
            name: storedUser.name,
            department: enteredDepartment,
            time: currentTime
        };

        let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
        attendanceData.push(attendanceRecord);
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

        status.innerHTML = `Attendance marked for ${storedUser.name} (${enteredDepartment}) at ${currentTime}`;
        status.style.color = 'green';
    } else {
        status.innerHTML = 'Error: User not found.😕';
        status.style.color = 'red';
    }
}

// Fallback function to mark attendance without biometric
function markAttendance(event) {
    event.preventDefault();

    const enteredName = document.getElementById('name').value.trim().toLowerCase();
    const enteredDepartment = document.getElementById('department').value.trim();
    const status = document.getElementById('status');

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.name === enteredName) {
        const currentTime = new Date().toLocaleString();
        const attendanceRecord = {
            name: storedUser.name,
            department: enteredDepartment,
            time: currentTime
        };

        let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
        attendanceData.push(attendanceRecord);
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

        status.innerHTML = `Attendance marked for ${storedUser.name} (${enteredDepartment}) at ${currentTime}`;
        status.style.color = 'green';
    } else {
        status.innerHTML = 'Error: Name does not match the registered.😕';
        status.style.color = 'red';
    }
}
