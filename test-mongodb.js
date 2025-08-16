// Test script to verify MongoDB leaderboard functionality
// Run this with: node test-mongodb.js

const testMongoDBLeaderboard = async () => {
  try {
    console.log('🗄️ Testing MongoDB Leaderboard Integration...\n');
    
    // Test 1: Check if leaderboard endpoint returns data from MongoDB
    console.log('1. Testing Leaderboard API (MongoDB)...');
    const leaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
    
    if (leaderboardResponse.ok) {
      const leaderboardData = await leaderboardResponse.json();
      console.log('✅ Leaderboard Response from MongoDB:', leaderboardData);
      
      if (leaderboardData.length > 0) {
        console.log('✅ MongoDB is working! Found', leaderboardData.length, 'entries');
        console.log('📊 Top 3 Scores:');
        leaderboardData.slice(0, 3).forEach((player, index) => {
          console.log(`   ${index + 1}. ${player.name}: ${player.bestScore} points`);
        });
      } else {
        console.log('📝 No scores in database yet. Play the game to add some!');
      }
    } else {
      const error = await leaderboardResponse.json();
      console.error('❌ Leaderboard Error:', error);
    }

    // Test 2: Post a test score to verify MongoDB write
    console.log('\n2. Testing Score Posting to MongoDB...');
    const testScoreResponse = await fetch('http://localhost:5000/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: 'TEST123',
        name: 'Test Player',
        score: 999,
        sessionId: 'test-session-' + Date.now()
      })
    });

    if (testScoreResponse.ok) {
      const scoreData = await testScoreResponse.json();
      console.log('✅ Test Score Posted Successfully:', scoreData);
    } else {
      const error = await testScoreResponse.json();
      console.error('❌ Score Posting Error:', error);
    }

    // Test 3: Verify the test score appears in leaderboard
    console.log('\n3. Verifying Test Score in Leaderboard...');
    const verifyResponse = await fetch('http://localhost:5000/api/leaderboard');
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      const testPlayer = verifyData.find(p => p.name === 'Test Player');
      
      if (testPlayer) {
        console.log('✅ Test Player Found in Leaderboard:', testPlayer);
      } else {
        console.log('⚠️ Test Player not found in leaderboard (might be filtered out)');
      }
    }

  } catch (error) {
    console.error('❌ MongoDB Test Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB Atlas is connected');
    console.log('2. Check your MONGO_URI in .env file');
    console.log('3. Ensure the server is running: cd server && npm run dev');
    console.log('4. Check if your IP is whitelisted in MongoDB Atlas');
  }
};

// Run MongoDB tests
const runMongoDBTests = async () => {
  console.log('🗄️ MongoDB Leaderboard Test Suite');
  console.log('==================================\n');
  
  await testMongoDBLeaderboard();
  
  console.log('\n✨ MongoDB tests completed!');
  console.log('\n📝 Notes:');
  console.log('- Leaderboard data is fetched from MongoDB Atlas');
  console.log('- Scores are stored with student ID and session tracking');
  console.log('- Best scores per student are displayed');
  console.log('- Test scores may be cleaned up later');
};

runMongoDBTests();
