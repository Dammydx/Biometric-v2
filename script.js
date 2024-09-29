// Handle user sign-up and save to local storage
function handleSignUp(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value; // No change
    const email = document.getElementById('signup-email').value; // No change
    const password = document.getElementById('signup-password').value; // No change

    // Save user data in local storage
    const userData = {
        name,
        email,
        password
    };

    localStorage.setItem('user', JSON.stringify(userData)); // No change

    alert('Sign up Successful!😁 You will be redirected to the attendance page.'); // No change
    window.location.href = "attendance.html"; // Redirect to attendance page
}

// Handle user sign-in by validating against stored data
function handleSignIn(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value; // No change
    const password = document.getElementById('login-password').value; // No change

    const storedUser = JSON.parse(localStorage.getItem('user')); // No change

    if (storedUser && storedUser.email === email && storedUser.password === password) { // No change
        alert('Login successful!🙂 Redirecting to attendance page.'); // No change
        window.location.href = "attendance.html"; // Redirect to attendance page
    } else {
        alert('Invalid email or password😥---Not Registered Sign up!😉'); // No change
    }
}

// Function to mark attendance and store in local storage
function markAttendance(event) {
    event.preventDefault();

    const enteredName = document.getElementById('name').value.trim().toLowerCase(); // No change
    const enteredDepartment = document.getElementById('department').value.trim(); // No change
    const status = document.getElementById('status'); // No change

    const storedUser = JSON.parse(localStorage.getItem('user')); // No change

    if (storedUser && storedUser.name.toLowerCase() === enteredName) { // No change
        const currentTime = new Date().toLocaleString(); // No change
        const attendanceRecord = {
            name: storedUser.name,  // Use the stored name to maintain consistency
            department: enteredDepartment, // No change
            time: currentTime // No change
        };

        // Save to local storage
        let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || []; // No change
        attendanceData.push(attendanceRecord); // No change
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData)); // No change

        status.innerHTML = `Attendance marked for ${storedUser.name} (${enteredDepartment}) at ${currentTime}`; // No change
        status.style.color = 'green'; // No change
    } else {
        status.innerHTML = 'Error: Name does not match the registered.😕'; // No change
        status.style.color = 'red'; // No change
    }
}

// Function to handle admin login
function adminLogin(event) {
    event.preventDefault();

    const username = document.getElementById('admin-username').value; // No change
    const password = document.getElementById('admin-password').value; // No change

    // Changed: Updated the admin password to 'admin123'
    if (username === 'admin' && password === 'admin123') { 
        window.location.href = "admin-dashboard.html"; // Redirect to admin dashboard
    } else {
        alert('Invalid are you an Admin Dammy sees all!😡'); // No change
    }
}
