// src/controllers/serviceabilityController.js
const { asyncHandler } = require('../middleware/errorHandler');

// Starter pincode map — keyed by first 3 digits (postal circle prefix).
// Expand this over time; unmapped-but-valid pincodes still fall through
// to a generic "serviceable" response below.
const PINCODE_MAP = {
  '400': { city: 'Mumbai', state: 'Maharashtra', estimatedDays: 2 },
  '411': { city: 'Pune', state: 'Maharashtra', estimatedDays: 2 },
  '110': { city: 'Delhi', state: 'Delhi', estimatedDays: 3 },
  '560': { city: 'Bengaluru', state: 'Karnataka', estimatedDays: 3 },
  '500': { city: 'Hyderabad', state: 'Telangana', estimatedDays: 3 },
  '600': { city: 'Chennai', state: 'Tamil Nadu', estimatedDays: 3 },
  '700': { city: 'Kolkata', state: 'West Bengal', estimatedDays: 4 },
  '380': { city: 'Ahmedabad', state: 'Gujarat', estimatedDays: 3 },
  '390': { city: 'Vadodara', state: 'Gujarat', estimatedDays: 3 },
  '395': { city: 'Surat', state: 'Gujarat', estimatedDays: 3 },
  '302': { city: 'Jaipur', state: 'Rajasthan', estimatedDays: 4 },
  '226': { city: 'Lucknow', state: 'Uttar Pradesh', estimatedDays: 4 },
  '208': { city: 'Kanpur', state: 'Uttar Pradesh', estimatedDays: 4 },
  '160': { city: 'Chandigarh', state: 'Chandigarh', estimatedDays: 4 },
  '462': { city: 'Bhopal', state: 'Madhya Pradesh', estimatedDays: 4 },
  '452': { city: 'Indore', state: 'Madhya Pradesh', estimatedDays: 4 },
  '800': { city: 'Patna', state: 'Bihar', estimatedDays: 5 },
  '440': { city: 'Nagpur', state: 'Maharashtra', estimatedDays: 3 },
  '422': { city: 'Nashik', state: 'Maharashtra', estimatedDays: 3 },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu', estimatedDays: 4 },
  '682': { city: 'Kochi', state: 'Kerala', estimatedDays: 4 },
  '695': { city: 'Thiruvananthapuram', state: 'Kerala', estimatedDays: 5 },
  '751': { city: 'Bhubaneswar', state: 'Odisha', estimatedDays: 5 },
  '781': { city: 'Guwahati', state: 'Assam', estimatedDays: 6 },
  '143': { city: 'Amritsar', state: 'Punjab', estimatedDays: 4 },
  '141': { city: 'Ludhiana', state: 'Punjab', estimatedDays: 4 },
  '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh', estimatedDays: 4 },
  '834': { city: 'Ranchi', state: 'Jharkhand', estimatedDays: 5 },
  '492': { city: 'Raipur', state: 'Chhattisgarh', estimatedDays: 5 },
  '248': { city: 'Dehradun', state: 'Uttarakhand', estimatedDays: 4 },
};

// GET /api/serviceability/:pincode  (public)
exports.checkServiceability = asyncHandler(async (req, res) => {
  const { pincode } = req.params;

  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      success: false,
      message: 'Pincode must be exactly 6 digits',
    });
  }

  const prefix = pincode.slice(0, 3);
  const known = PINCODE_MAP[prefix];

  if (known) {
    return res.json({
      success: true,
      data: {
        serviceable: true,
        pincode,
        city: known.city,
        state: known.state,
        estimatedDays: known.estimatedDays,
      },
    });
  }

  // Unmapped but valid-format pincode — treat as serviceable with a
  // conservative estimate until the map is expanded with real courier data.
  return res.json({
    success: true,
    data: {
      serviceable: true,
      pincode,
      city: 'Your Area',
      state: '',
      estimatedDays: 7,
    },
  });
});
