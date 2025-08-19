const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const Score = require('./models/Score');
const cors = require('cors');
const { fetchStudentInfo } = require('./portalClient');
const { deriveUsername, deriveDisplayName } = require('./username');

// CORS 
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://talamakiling.onrender.com','https://jpcs-booth-game-frontend.onrender.com', 'http://localhost:3000']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

app.use(express.json());

const pendingRequests = new Map(); 

// request id generator
const generateRequestId = () => {
  return 'req_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

app.post('/api/approval/request', async (req, res) => {
  try {
    const { studentId, studentName } = req.body;
    
    if (!studentId || !studentName) {
      return res.status(400).json({ error: 'Student ID and student name are required' });
    }

    const requestId = generateRequestId();
    
    pendingRequests.set(requestId, {
      studentId,
      studentName,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + (5 * 60 * 1000) 
    });

    console.log(`New approval request: ${studentName} (${studentId})`);

    res.json({
      requestId,
      status: 'pending',
      message: 'Approval request submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting approval request:', error);
    res.status(500).json({ error: 'Failed to submit approval request' });
  }
});

// check status
app.get('/api/approval/status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = pendingRequests.get(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (Date.now() > request.expiresAt) {
      pendingRequests.delete(requestId);
      return res.status(410).json({ error: 'Request has expired' });
    }

    res.json({
      requestId,
      status: request.status,
      studentName: request.studentName,
      studentId: request.studentId
    });
  } catch (error) {
    console.error('Error checking approval status:', error);
    res.status(500).json({ error: 'Failed to check approval status' });
  }
});

// approve
app.post('/api/approval/approve/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { staffPassword } = req.body;
    
    const validPassword = process.env.BOOTH_PASSWORD || 'bukasnauli';
    if (staffPassword !== validPassword) {
      return res.status(401).json({ error: 'Invalid booth password' });
    }

    const request = pendingRequests.get(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'approved';
    pendingRequests.set(requestId, request);

    console.log(`Approved: ${request.studentName} (${request.studentId})`);

    res.json({
      message: 'Request approved successfully',
      studentName: request.studentName
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

// reject
app.post('/api/approval/reject/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { staffPassword, reason } = req.body;
    
    const validPassword = process.env.BOOTH_PASSWORD || 'bukasnauli';
    if (staffPassword !== validPassword) {
      return res.status(401).json({ error: 'Invalid booth password' });
    }

    const request = pendingRequests.get(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'rejected';
    request.rejectionReason = reason || 'No reason provided';
    pendingRequests.set(requestId, request);

    console.log(`Rejected: ${request.studentName} (${request.studentId}) - ${reason}`);

    res.json({
      message: 'Request rejected successfully',
      studentName: request.studentName
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

// pending
const handlePendingRequests = async (req, res) => {
  try {
    const staffPassword = req.body.staffPassword || req.query.staffPassword;
    
    const validPassword = process.env.BOOTH_PASSWORD || 'bukasnauli';
    if (staffPassword !== validPassword) {
      return res.status(401).json({ error: 'Invalid booth password' });
    }

    cleanupExpiredRequests();

    const pending = Array.from(pendingRequests.entries())
      .filter(([_, request]) => request.status === 'pending')
      .map(([requestId, request]) => ({
        requestId,
        studentId: request.studentId,
        studentName: request.studentName,
        createdAt: request.createdAt,
        expiresAt: request.expiresAt,
        timeRemaining: Math.max(0, request.expiresAt - Date.now())
      }))
      .sort((a, b) => a.createdAt - b.createdAt);

    res.json(pending);
  } catch (error) {
    console.error('Error in pending requests:', error);
    res.status(500).json({ error: 'Failed to process pending requests' });
  }
};

app.get('/api/approval/pending', handlePendingRequests);
app.post('/api/approval/pending', handlePendingRequests);

// expire
function cleanupExpiredRequests() {
  const now = Date.now();
  for (const [requestId, request] of pendingRequests.entries()) {
    if (now > request.expiresAt) {
      pendingRequests.delete(requestId);
    }
  }
}

// ito yung illegal
app.post('/api/username', async (req, res) => {
  try {
    const { studentId, strategy } = req.body || {};
    if (!studentId || typeof studentId !== 'string') {
      return res.status(400).json({ error: 'studentId is required as a non-empty string' });
    }

    const studentInfo = await fetchStudentInfo(studentId);
    if (!studentInfo) {
      return res.status(404).json({ error: 'Student information not found' });
    }

    const { email } = studentInfo;
    const username = deriveUsername(email, strategy || process.env.USERNAME_STRATEGY || 'dot');
    const displayName = deriveDisplayName(email);
     
    return res.json({ 
      studentId, 
      email, 
      username, 
      displayName
    });
  } catch (error) {
    console.error('Error in student lookup:', error);
    res.status(500).json({ error: 'Failed to fetch student information from DLSL API' });
  }
});

app.post('/api/scores', async (req, res) => {
  try {
    const { studentId, name, score, sessionId } = req.body;
    
    console.log('Score submission received:', { studentId, name, score, sessionId });
    
    if (!studentId || !name || typeof score !== 'number' || !sessionId) {
      return res.status(400).json({ error: 'Student ID, name, score, and session ID are required.' });
    }

    const existingScore = await Score.findOne({ studentId, sessionId });
    
    if (existingScore) {
      console.log('Updating existing score for student:', studentId);
      // UPDATE SCORE PAG MAS MATAAS NEW SCORE
      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.attempts += 1;
        await existingScore.save();
        console.log('Score updated successfully:', score);
        return res.json({ 
          message: 'Score updated successfully.',
          attempts: existingScore.attempts,
          maxAttempts: 3
        });
      } else {
        // TRACK ILANG ATTEMPTS
        existingScore.attempts += 1;
        await existingScore.save();
        console.log('Attempt recorded, score not updated');
        return res.json({ 
          message: 'Attempt recorded.',
          attempts: existingScore.attempts,
          maxAttempts: 3
        });
      }
    } else {
      console.log('Creating new score entry for student:', studentId);
      // NEW SCORE
      const newScore = new Score({ studentId, name, score, sessionId });
      await newScore.save();
      console.log('New score saved successfully:', score);
      return res.status(201).json({ 
        message: 'Score saved successfully.',
        attempts: 1,
        maxAttempts: 3
      });
    }
  } catch (err) {
    console.error('Error saving score:', err);
    res.status(500).json({ error: 'Failed to save score.' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    console.log('Leaderboard request received');
    
    // BEST SCORE NG STUDENT, ISANG SCORE LANG PER STUDENT MARERECORD
    const topScores = await Score.aggregate([
      {
        $group: {
          _id: '$studentId',
          name: { $first: '$name' },
          bestScore: { $max: '$score' },
          attempts: { $sum: '$attempts' }
        }
      },
      {
        $sort: { bestScore: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    console.log('Leaderboard data:', topScores);
    console.log('Number of entries found:', topScores.length);
    
    res.json(topScores);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

// IF -AALLOW NATIN SILA MAG-RETRY
app.get('/api/student-status/:studentId/:sessionId', async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;
    
    const studentScore = await Score.findOne({ studentId, sessionId });
    
    if (!studentScore) {
      return res.json({ canPlay: true, attempts: 0, maxAttempts: 3 });
    }
    
    const canPlay = studentScore.attempts < 3;
    
    res.json({
      canPlay,
      attempts: studentScore.attempts,
      maxAttempts: 3,
      bestScore: studentScore.score
    });
  } catch (err) {
    console.error('Error checking student status:', err);
    res.status(500).json({ error: 'Failed to check student status.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
