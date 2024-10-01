// Handle user sign-up and save to local storage with optional fingerprint registration
function handleSignUp(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    // Save user data in local storage
    const userData = {
        name,
        email,
        password,
        hasFingerprint: false // Initialize fingerprint flag
    };

    // Attempt to register user's fingerprint
    registerUserFingerprint().then(() => {
        userData.hasFingerprint = true; // Set flag if fingerprint is registered
        localStorage.setItem('user', JSON.stringify(userData)); // Save user data with fingerprint flag
        alert('Sign up and fingerprint registration successful! Redirecting to the attendance page.');
        window.location.href = "attendance.html";
    }).catch((err) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Save user data without fingerprint
        document.getElementById('status').innerText = 'Fingerprint registration failed or not supported. You can still proceed by clicking the picture to mark attendance.';
        console.warn('Fingerprint registration failed:', err);
    });
}

// Function to register fingerprint using WebAuthn API
function registerUserFingerprint() {
    return new Promise((resolve, reject) => {
        if (window.PublicKeyCredential) {
            navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array(32), // Random challenge
                    rp: { name: "Biometric Attendance System" },
                    user: {
                        id: new Uint8Array(16), // Random user ID
                        name: document.getElementById('signup-email').value.trim(),
                        displayName: document.getElementById('signup-name').value.trim(),
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform", // Use device's built-in authenticator
                        userVerification: "required" // Require biometric verification
                    },
                    timeout: 60000, // Timeout for the operation
                }
            }).then((credential) => {
                localStorage.setItem('credential', JSON.stringify(credential)); // Save the credential
                resolve(); // Resolve promise on success
            }).catch((err) => {
                reject(err); // Reject promise if registration fails
            });
        } else {
            reject('WebAuthn API not supported on this device.');
        }
    });
}

// Function to mark attendance and check for fingerprint or fallback
function markAttendance(event) {
    event.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const status = document.getElementById('status');

    if (storedUser && storedUser.hasFingerprint) {
        // If fingerprint is registered, prompt for fingerprint authentication
        authenticateWithFingerprint().then(() => {
            markAttendanceRecord(storedUser);
        }).catch((err) => {
            status.innerHTML = 'Fingerprint authentication failed. Try again or use fallback.';
            status.style.color = 'red';
            console.error('Fingerprint authentication error:', err);
        });
    } else {
        // No fingerprint registered, use fallback (click the picture)
        markAttendanceRecord(storedUser);
    }
}

// Function to authenticate with fingerprint (for registered users)
function authenticateWithFingerprint() {
    return new Promise((resolve, reject) => {
        if (window.PublicKeyCredential) {
            navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32), // Random challenge for security
                    timeout: 60000, // Timeout
                    userVerification: "required" // Require user verification
                }
            }).then((credential) => {
                resolve(); // Fingerprint authenticated successfully
            }).catch((err) => {
                reject(err); // Error during authentication
            });
        } else {
            reject('WebAuthn API not supported on this device.');
        }
    });
}

// Helper function to mark attendance (used in both cases: fingerprint or fallback)
function markAttendanceRecord(storedUser) {
    const enteredDepartment = document.getElementById('department').value.trim();
    const currentTime = new Date().toLocaleString();

    const attendanceRecord = {
        name: storedUser.name,
        department: enteredDepartment,
        time: currentTime
    };

    let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
    attendanceData.push(attendanceRecord);
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

    const status = document.getElementById('status');
    status.innerHTML = `Attendance marked for ${storedUser.name} (${enteredDepartment}) at ${currentTime}`;
    status.style.color = 'green';
}
