async function fetchUserDetails() {
    try {
        const res = await fetch('/api/user');
        const data = await res.json();
        
        document.getElementById('full_name').innerText = data.full_name || 'User32';
        document.getElementById('role').innerText = data.role || 'NaN';
    } catch (err) {
        console.error('Error fetching user details:', err);
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchUserDetails();
});
