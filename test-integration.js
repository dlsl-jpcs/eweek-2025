// Simple test script to verify integrated API functionality
// Run this with: node test-integration.js

const testIntegratedApi = async () => {
  try {
    console.log('🚀 Testing Integrated E-Week 2025 API on port 5000...\n');
    
    // Test 1: DLSL Student Lookup
    console.log('1. Testing Student Lookup API...');
    const studentResponse = await fetch('http://localhost:5000/api/username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId: '2022336001' })
    });

    if (studentResponse.ok) {
      const studentData = await studentResponse.json();
      console.log('✅ Student Lookup Response:', studentData);
      console.log('✅ Student Name:', studentData.displayName);
      console.log('✅ Username:', studentData.username);
      console.log('✅ Email:', studentData.email);
    } else {
      const error = await studentResponse.json();
      console.error('❌ Student Lookup Error:', error);
    }

    // Test 2: Game Leaderboard
    console.log('\n2. Testing Game Leaderboard API...');
    const leaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
    
    if (leaderboardResponse.ok) {
      const leaderboardData = await leaderboardResponse.json();
      console.log('✅ Leaderboard Response:', leaderboardData);
    } else {
      const error = await leaderboardResponse.json();
      console.error('❌ Leaderboard Error:', error);
    }

    // Test 3: Student Status Check
    console.log('\n3. Testing Student Status API...');
    const statusResponse = await fetch('http://localhost:5000/api/student-status/test123/session123');
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Student Status Response:', statusData);
    } else {
      const error = await statusResponse.json();
      console.error('❌ Student Status Error:', error);
    }

    // Test 4: Test with different student IDs
    console.log('\n4. Testing Multiple Student IDs...');
    const testIds = ['2022336001', '2022336002', '2022336003', '2022336004'];
    
    for (const studentId of testIds) {
      try {
        const response = await fetch('http://localhost:5000/api/username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${studentId} → ${data.displayName}`);
        } else {
          console.log(`❌ ${studentId} → Not found`);
        }
      } catch (error) {
        console.log(`❌ ${studentId} → Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: cd server && npm run dev');
    console.log('2. Check if port 5000 is available');
    console.log('3. Verify your .env file is set up correctly');
    console.log('4. Check server logs for detailed error messages');
  }
};

// Run tests
const runTests = async () => {
  console.log('🎮 E-Week 2025 Integration Test Suite');
  console.log('=====================================\n');
  
  await testIntegratedApi();
  
  console.log('\n✨ All tests completed!');
  console.log('\n📝 Notes:');
  console.log('- The DLSL API is now integrated into the game server');
  console.log('- All endpoints run on port 5000');
  console.log('- Fallback data is used when DLSL API is unavailable');
  console.log('- Check setup.md for complete setup instructions');
};

runTests();
