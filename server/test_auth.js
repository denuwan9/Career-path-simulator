async function testEndpoints() {
    try {
        // Test Root
        console.log('Testing Root...');
        const rootRes = await fetch('http://localhost:5000/');
        console.log('Root Status:', rootRes.status);
        console.log('Root Text:', await rootRes.text());

        // Test Jobs
        console.log('\nTesting Jobs...');
        const jobsRes = await fetch('http://localhost:5000/api/jobs');
        console.log('Jobs Status:', jobsRes.status);
        // console.log('Jobs Text:', await jobsRes.text());

        // Test Auth Test Route
        console.log('\nTesting Auth Test Route...');
        const authTestRes = await fetch('http://localhost:5000/api/auth/test');
        console.log('Auth Test Status:', authTestRes.status);
        console.log('Auth Test Text:', await authTestRes.text());

        // Test Auth Register
        console.log('\nTesting Auth Register...');
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'testuser_' + Date.now() + '@example.com',
                password: 'password123'
            })
        });

        const text = await response.text();
        console.log('Auth Status:', response.status);
        console.log('Auth Response:', text);

    } catch (err) {
        console.error('Network Error:', err.message);
    }
}

testEndpoints();
