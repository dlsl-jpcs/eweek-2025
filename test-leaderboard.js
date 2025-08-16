// Test script to verify leaderboard functionality
// Run this with: node test-leaderboard.js

const testLeaderboard = async () => {
  try {
    console.log('🏆 Testing Leaderboard Functionality...\n');
    
    // Test 1: Check current leaderboard
    console.log('1. Checking current leaderboard...');
    const leaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
    
    if (leaderboardResponse.ok) {
      const leaderboardData = await leaderboardResponse.json();
      console.log('✅ Current leaderboard:', leaderboardData);
      console.log('📊 Number of entries:', leaderboardData.length);
      
      if (leaderboardData.length > 0) {
        console.log('🏅 Top 3 players:');
        leaderboardData.slice(0, 3).forEach((player, index) => {
          console.log(`   ${index + 1}. ${player.name}: ${player.bestScore} points`);
        });
      } else {
        console.log('📝 No scores in database yet');
      }
    } else {
      const error = await leaderboardResponse.json();
      console.error('❌ Leaderboard Error:', error);
    }

    // Test 2: Post a test score
    console.log('\n2. Posting a test score...');
    const testScoreResponse = await fetch('http://localhost:5000/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: 'TEST' + Date.now(),
        name: 'Test Player ' + Date.now(),
        score: Math.floor(Math.random() * 1000) + 100,
        sessionId: 'test-session-' + Date.now()
      })
    });

    if (testScoreResponse.ok) {
      const scoreData = await testScoreResponse.json();
      console.log('✅ Test score posted:', scoreData);
    } else {
      const error = await testScoreResponse.json();
      console.error('❌ Score posting error:', error);
    }

    // Test 3: Check leaderboard again
    console.log('\n3. Checking leaderboard after posting score...');
    const updatedLeaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
    
    if (updatedLeaderboardResponse.ok) {
      const updatedData = await updatedLeaderboardResponse.json();
      console.log('✅ Updated leaderboard:', updatedData);
      console.log('📊 Number of entries:', updatedData.length);
      
      if (updatedData.length > 0) {
        console.log('🏅 Top 3 players:');
        updatedData.slice(0, 3).forEach((player, index) => {
          console.log(`   ${index + 1}. ${player.name}: ${player.bestScore} points`);
        });
      }
    } else {
      const error = await updatedLeaderboardResponse.json();
      console.error('❌ Updated leaderboard error:', error);
    }

    // Test 4: Post multiple scores to test aggregation
    console.log('\n4. Posting multiple scores for same student...');
    const studentId = 'MULTI_TEST_' + Date.now();
    const scores = [150, 300, 250, 400];
    
    for (let i = 0; i < scores.length; i++) {
      const multiScoreResponse = await fetch('http://localhost:5000/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,
          name: 'Multi Test Player',
          score: scores[i],
          sessionId: 'multi-session-' + i
        })
      });

      if (multiScoreResponse.ok) {
        const multiScoreData = await multiScoreResponse.json();
        console.log(`   Score ${i + 1}: ${scores[i]} - ${multiScoreData.message}`);
      }
    }

    // Test 5: Check final leaderboard
    console.log('\n5. Final leaderboard check...');
    const finalLeaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
    
    if (finalLeaderboardResponse.ok) {
      const finalData = await finalLeaderboardResponse.json();
      console.log('✅ Final leaderboard:', finalData);
      
      const multiTestPlayer = finalData.find(p => p.name === 'Multi Test Player');
      if (multiTestPlayer) {
        console.log('✅ Multi Test Player found with best score:', multiTestPlayer.bestScore);
        console.log('   Expected best score: 400 (highest of 150, 300, 250, 400)');
      }
    }

  } catch (error) {
    console.error('❌ Test Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: cd server && npm run dev');
    console.log('2. Check MongoDB connection in .env file');
    console.log('3. Check server console for detailed logs');
  }
};

// Run tests
const runLeaderboardTests = async () => {
  console.log('🏆 Leaderboard Test Suite');
  console.log('========================\n');
  
  await testLeaderboard();
  
  console.log('\n✨ Leaderboard tests completed!');
  console.log('\n📝 Notes:');
  console.log('- Leaderboard should show best score per student');
  console.log('- Multiple scores for same student should aggregate correctly');
  console.log('- Check server console for detailed MongoDB logs');
};

runLeaderboardTests();
