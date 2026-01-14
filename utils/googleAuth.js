const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google token and extract user info
 */
const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub
    };
  } catch (error) {
    throw new Error('Invalid Google token');
  }
};

/**
 * Create or find user with Google OAuth
 */
const handleGoogleAuth = async (Model, token, additionalDefaults = {}) => {
  const { email, name, googleId } = await verifyGoogleToken(token);

  let user = await Model.findOne({ email });

  if (!user) {
    // Create new user with Google data
    const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
    
    user = new Model({
      email,
      googleId,
      password: randomPassword,
      ...additionalDefaults,
      // Set name field based on model
      ...(Model.modelName === 'Employee' ? { fullname: name } : { name })
    });
    
    await user.save();
  }

  return user;
};

module.exports = {
  verifyGoogleToken,
  handleGoogleAuth
};
