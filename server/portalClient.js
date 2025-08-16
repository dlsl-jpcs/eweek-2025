const axios = require('axios');
const https = require('https');

async function fetchStudentInfo(studentId) {
  const apiUrl = process.env.PORTAL_BASE_URL + "/registration/event/helper.php";
  const regKey = process.env.REG_KEY || "20250515U60HB0";
  
  console.log('Making request to DLSL API:', apiUrl);
  console.log('Student ID:', studentId);
  console.log('REG_KEY:', regKey);

  const formData = new URLSearchParams({
    action: "registration_tapregister",
    regkey: regKey,
    card_tag: studentId,
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'dlsl-student-api/1.0',
    'Accept': 'application/json, text/plain, */*',
  };

  let httpsAgent;
  if (process.env.INSECURE_TLS === 'true') {
    httpsAgent = new https.Agent({ rejectUnauthorized: false });
  }

  try {
    console.log('Sending form data:', formData.toString());
    
    const response = await axios({
      method: 'POST',
      url: apiUrl,
      data: formData.toString(),
      headers,
      httpsAgent,
      timeout: 15000,
      validateStatus: function (status) {
        return status < 500;
      }
    });

    console.log('DLSL API response status:', response.status);
    console.log('DLSL API response headers:', response.headers);
    console.log('DLSL API response data:', response.data);

    const data = response.data;
    
    if (typeof data === 'string' && data.includes('<!doctype html>')) {
      console.log('Received HTML response - endpoint might be incorrect');
      throw new Error('Invalid endpoint - received HTML instead of JSON data');
    }
    
    if (!data.email_address) {
      console.log('Student not registered - missing email');
      console.log('Available data fields:', Object.keys(data));
      return null;
    }

    if (data.email_address === "") {
      console.log('Student not registered - empty email');
      return null;
    }

    console.log('Student found:', {
      email: data.email_address
    });

    return {
      email: data.email_address.toLowerCase()
    };
  } catch (error) {
    console.error('DLSL API request failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

async function fetchStudentEmail(studentId) {
  const studentInfo = await fetchStudentInfo(studentId);
  return studentInfo ? studentInfo.email : null;
}

module.exports = { fetchStudentEmail, fetchStudentInfo };
