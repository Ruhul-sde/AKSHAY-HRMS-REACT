const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const { BASE_URL, axiosConfig, handleApiError } = require('../auth/utils');
const router = express.Router();

// OUT-DUTY TRACKING
router.post('/out-duty', async (req, res) => {
  const {
    ls_EmpCode,
    ls_Type,
    ls_Location,
    ls_LocManual,
    ls_Latitude,
    ls_Longitude,
    ls_ClientNm,
    ls_ReasonVisit,
    ls_Remark
  } = req.body;

  // Validate required fields
  if (!ls_EmpCode || !ls_Type || !ls_Latitude || !ls_Longitude) {
    return res.status(400).json({
      success: false,
      message: "Employee code, type, latitude, and longitude are required"
    });
  }

  // Validate ls_Type
  if (ls_Type !== 'I' && ls_Type !== 'O') {
    return res.status(400).json({
      success: false,
      message: "Type must be 'I' for In or 'O' for Out"
    });
  }

  try {
    // Format current date and time
    const currentDate = dayjs().format('YYYYMMDD');
    const currentTime = dayjs().format('HH:mm');

    // Prepare payload for WCF API
    const payload = {
      ls_EmpCode: ls_EmpCode.toString(),
      ls_AttendDt: currentDate,
      ls_Date: currentDate,
      ls_Time: currentTime,
      ls_Type,
      ls_Location: ls_Location || '',
      ls_LocManual: ls_LocManual || '',
      ls_Latitude: ls_Latitude.toString(),
      ls_Longitude: ls_Longitude.toString(),
      ls_ClientNm: ls_ClientNm || '',
      ls_ReasonVisit: ls_ReasonVisit || '',
      ls_Remark: ls_Remark || ''
    };

    console.log('Out-duty API payload:', JSON.stringify(payload, null, 2));

    // Call WCF API
    const response = await axios.post(
      `${BASE_URL}/EmpOutDuty`,
      payload,
      axiosConfig
    );

    console.log('Out-duty API response:', JSON.stringify(response.data, null, 2));

    // Check response status
    if (response.data && response.data.ls_Status === 'S') {
      return res.json({
        success: true,
        message: response.data.ls_Message || `${ls_Type === 'I' ? 'Check-in' : 'Check-out'} recorded successfully`,
        data: response.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data?.ls_Message || `Failed to record ${ls_Type === 'I' ? 'check-in' : 'check-out'}`
      });
    }
  } catch (err) {
    console.error('Out-duty API error:', err);
    return handleApiError(res, err, `Failed to record ${ls_Type === 'I' ? 'check-in' : 'check-out'}`);
  }
});

// GET REVERSE GEOCODING (Optional - for getting address from coordinates)
router.post('/reverse-geocode', async (req, res) => {
  const { latitude, longitude } = req.body;

  console.log('Reverse geocode request:', { latitude, longitude });

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required"
    });
  }

  try {
    // Note: You'll need to add GOOGLE_MAPS_API_KEY to your environment variables
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    console.log('Google Maps API Key exists:', !!googleMapsApiKey);
    
    if (!googleMapsApiKey) {
      console.warn('Google Maps API key not configured');
      return res.status(500).json({
        success: false,
        message: "Google Maps API key not configured"
      });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`
    );

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      
      // Try to get a more meaningful location name
      let locationName = result.formatted_address;
      
      // Look for establishment, point_of_interest, or premise first
      const preferredTypes = ['establishment', 'point_of_interest', 'premise', 'subpremise'];
      for (const component of result.address_components) {
        if (component.types.some(type => preferredTypes.includes(type))) {
          locationName = component.long_name + ', ' + result.formatted_address.split(',').slice(-2).join(',');
          break;
        }
      }
      
      // If no specific place found, use the formatted address but clean it up
      if (locationName === result.formatted_address) {
        // Remove postal codes and country codes for cleaner display
        locationName = result.formatted_address
          .replace(/\b\d{5,6}\b/g, '') // Remove postal codes
          .replace(/,\s*[A-Z]{2,3}$/g, '') // Remove country codes at the end
          .replace(/,\s+,/g, ',') // Remove double commas
          .trim();
      }
      
      return res.json({
        success: true,
        address: locationName,
        fullAddress: result.formatted_address,
        data: result
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch location name from Google Maps API"
      });
    }
  } catch (err) {
    console.error('Reverse geocoding error:', err);
    return handleApiError(res, err, "Failed to fetch address");
  }
});

// GET LATEST OUT-DUTY DATA
router.get('/latest-out-duty', async (req, res) => {
  const { empCode, date } = req.query;

  if (!empCode || !date) {
    return res.status(400).json({
      success: false,
      message: "Employee code and date are required"
    });
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/GetLatestOutDuty?EmpCode=${empCode}&Date=${date}`
    );

    console.log('Latest out-duty API response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.lst_ClsLatestOutDutyDtls) {
      return res.json({
        success: true,
        message: "Latest out-duty data fetched successfully",
        data: response.data.lst_ClsLatestOutDutyDtls
      });
    } else {
      return res.json({
        success: true,
        message: "No out-duty data found",
        data: []
      });
    }
  } catch (err) {
    console.error('Latest out-duty API error:', err);
    return handleApiError(res, err, "Failed to fetch latest out-duty data");
  }
});

// GET OUT-DUTY HISTORY
router.get('/out-duty-history', async (req, res) => {
  const { empCode, date } = req.query;

  if (!empCode || !date) {
    return res.status(400).json({
      success: false,
      message: "Employee code and date are required"
    });
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/GetOutDuty?EmpCode=${empCode}&Date=${date}`,
      axiosConfig
    );

    console.log('Out-duty history API response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.lst_ClsOutDutyDtls) {
      return res.json({
        success: true,
        message: "Out-duty history fetched successfully",
        data: response.data.lst_ClsOutDutyDtls
      });
    } else {
      return res.json({
        success: true,
        message: "No out-duty history found",
        data: []
      });
    }
  } catch (err) {
    console.error('Out-duty history API error:', err);
    return handleApiError(res, err, "Failed to fetch out-duty history");
  }
});

module.exports = router;