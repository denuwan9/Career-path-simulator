const axios = require('axios');

async function testSlotCreation() {
    try {
        console.log('Testing slot creation...\n');

        // First, get a user to use as admin
        const userRes = await axios.get('http://localhost:5000/api/users/profile/student@example.com');
        console.log('✓ User fetched:', userRes.data.name);

        // Create a test slot
        const slotData = {
            company: 'Google',
            position: 'Software Engineer',
            location: 'Building A, Room 101',
            date: '2026-03-15',
            startTime: '10:00',
            endTime: '10:30',
            duration: 30,
            maxCapacity: 2,
            description: 'Entry-level software engineering position',
            adminId: userRes.data._id
        };

        console.log('\nCreating slot with data:', JSON.stringify(slotData, null, 2));

        const slotRes = await axios.post('http://localhost:5000/api/interviews/slots', slotData);
        console.log('\n✅ SUCCESS! Slot created:', {
            id: slotRes.data._id,
            company: slotRes.data.company,
            position: slotRes.data.position,
            status: slotRes.data.status
        });

        // Get all slots
        const allSlots = await axios.get('http://localhost:5000/api/interviews/slots');
        console.log(`\n✓ Total slots in system: ${allSlots.data.length}`);

        console.log('\n🎉 All tests passed!');

    } catch (error) {
        console.error('\n❌ ERROR:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testSlotCreation();
