// test.js
const axios = require('axios');

const testAPI = async () => {
  try {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/v1';
    const response = await axios.post(`${BASE_URL}/job-matching`, {
      keyword: 'DATASCIENCE',
      location: 'Noida'
    });
    
    console.log('✅ Success:', response.data.success);
    console.log('📊 Total Jobs:', response.data.data.totalJobs);
    console.log('🔍 Search Criteria:', response.data.data.searchCriteria);
    console.log('📝 First Job data :', response.data.data.jobs[0]);
    console.log('📝 All Jobs data :', response.data.data.jobs);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testAPI();