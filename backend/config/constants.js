export const ROLES = {
  FARMER: 'farmer',
  ADMIN: 'admin',
};

export const WATER_SOURCES = {
  BOREWELL: 'borewell',
  CANAL: 'canal',
  RAIN: 'rain',
  WELL: 'well',
  OTHER: 'other',
};

export const CROP_TYPES = [
  'rice',
  'wheat',
  'sugarcane',
  'cotton',
  'maize',
  'vegetables',
  'fruits',
  'pulses',
  'oilseeds',
  'other',
];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  INVALID_TOKEN: 'Invalid or expired token',
  SERVER_ERROR: 'Internal server error',
};

export const WATER_USAGE_THRESHOLDS = {
  DAILY_WARNING: 5000, // liters
  DAILY_CRITICAL: 10000, // liters
  WEEKLY_WARNING: 30000, // liters
};
