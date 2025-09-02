import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
const JWT_SECRET = process.env.JWT_SECRET || 'taxpal_default_secret_key';
const CLIENT_URL = process.env.CLIENT_URL;
let transporter;
console.log(' Setting up email transport...');
console.log(' Checking email configuration...');
console.log(' .env file loaded properly:', process.env.EMAIL_USER ? 'Yes' : 'No');
console.log(' EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
console.log(' EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
console.log(' NODE_ENV:', process.env.NODE_ENV || 'not set');
async function initializeEmailTransport() {
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log(' Setting up Gmail transport with real credentials');
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });      
      await transporter.verify();
      console.log('✅ Gmail SMTP server connection verified');
      return null;
    } else {
      console.log(' No email credentials found, setting up Ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      console.log(' Ethereal test email account created successfully!');
      console.log(' Username:', testAccount.user);
      console.log(' Password:', testAccount.pass);
      console.log(' IMPORTANT: You can view sent emails at https://ethereal.email');
      console.log(' Login with the username and password shown above');      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('✅ Ethereal SMTP test server is ready to send emails');
      return testAccount;
    }
  } catch (error) {
    console.error('❌ Failed to create email transport:', error.message);
    console.log(' Falling back to console logging for emails');
    console.log(' To use real email, ensure EMAIL_USER and EMAIL_PASS are correctly set in .env');
    console.log(' Current process.env keys:', Object.keys(process.env).join(', '));
    transporter = {
      sendMail: (mailOptions) => {
        console.log('=============== EMAIL CONTENTS ===============');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('OTP Code:', mailOptions.html.match(/\d{6}/)?.[0] || 'Not found');
        console.log('==========================================');
        return Promise.resolve({ response: 'Development mode - email logged' });
      }
    };
    return null;
  }
}
let testAccount;
initializeEmailTransport().then(account => {
  testAccount = account;
});
async function sendOTP(email, otp, name = '') {
  const mailOptions = {
    from: `"TaxPal Support" <verification@taxpal.com>`,
    to: email,
    subject: 'TaxPal - Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #207ED0;">TaxPal</h1>
          <p style="color: #666;">Your trusted tax partner</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333;">Hello ${name || 'there'},</h2>
          <p style="color: #555; line-height: 1.5;">Thank you for registering with TaxPal. To verify your email address and complete your registration, please use the following verification code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 28px; letter-spacing: 6px; font-weight: bold; background-color: #eef5fb; display: inline-block; padding: 15px 30px; border-radius: 4px; border: 1px dashed #207ED0; color: #207ED0;">
              ${otp}
            </div>
          </div>
          <p style="color: #555; line-height: 1.5;">This verification code will expire in 10 minutes for security purposes.</p>
          <p style="color: #555; line-height: 1.5;">If you didn't request this code, you can safely ignore this email. Someone might have typed your email address by mistake.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #555; line-height: 1.5;">Need help? Contact our support team at <a href="mailto:support@taxpal.com" style="color: #207ED0; text-decoration: none;">support@taxpal.com</a></p>
          <p style="color: #888; font-size: 12px;">© ${new Date().getFullYear()} TaxPal. All rights reserved.</p>
          <p style="color: #888; font-size: 11px;">This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (info && info.messageId) {
      console.log(' Email sent successfully!');
      console.log(' Message ID:', info.messageId);
      if (info.previewURL) {
        console.log(' Preview URL:', info.previewURL);
        console.log(' View the email at https://ethereal.email');
      }
    }
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}
export const register = async (req, res) => {
  try {
    console.log('REGISTER BODY:', req.body);
    const { name, email, password, country, income } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    const userData = { 
      name, 
      email, 
      password: hashedPassword, 
      otp, 
      otpExpiry, 
      country, 
      income 
    };
    
    console.log('Creating user with data:', userData);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      country,
      income
    });
    await user.save();
    console.log('User created:', user._id);
    try {
      const emailInfo = await sendOTP(email, otp, name);
      console.log('OTP email sent successfully to:', email);
      const previewUrl = emailInfo?.previewURL;
      if (previewUrl) {
        console.log('✅ Use the Ethereal preview URL to view the email:', previewUrl);
        return res.status(201).json({ 
          success: true,
          message: 'Registered! Check Ethereal mail preview (link in console) or use code: ' + otp,
          testOtp: otp, 
          emailPreview: previewUrl 
        });
      } else {
        return res.status(201).json({ 
          success: true,
          message: 'Registered! Check your email for OTP or use code: ' + otp,
          testOtp: otp 
        });
      }
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      console.log('⚠️ Email sending failed, but registration continues. Using test OTP mode.');
      return res.status(201).json({ 
        success: true,
        message: 'Registered! Email failed but you can use this code: ' + otp,
        testOtp: otp 
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Registration failed', 
      error: err.message 
    });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    console.log('Verifying OTP request:', req.body);
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
    
    const user = await User.findOne({ email });
    console.log('Found user:', user ? user._id : 'None');
    
    if (!user) return res.status(400).json({ 
      success: false,
      message: 'User not found' 
    });
    
    console.log('Comparing OTP:', otp, 'with stored OTP:', user.otp);
    console.log('OTP expiry:', new Date(user.otpExpiry).toISOString(), 'Now:', new Date().toISOString());
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired OTP' 
      });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    console.log('User verified:', user._id);
    try {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      console.log('JWT token generated successfully');
      
      return res.json({ 
        success: true,
        message: 'Email verified successfully!',
        token,
        user: { 
          name: user.name, 
          email: user.email,
          country: user.country,
          income: user.income
        }
      });
    } catch (jwtError) {
      console.error('JWT sign error:', jwtError);
      return res.status(500).json({ 
        success: false,
        message: 'Error generating authentication token',
        error: jwtError.message
      });
    }
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'OTP verification failed', 
      error: err.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    if (!user.isVerified) {
      console.log('Auto-verifying user for development:', email);
      user.isVerified = true;
      await user.save();
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    console.log('Login successful for user:', email);
    return res.json({ 
      success: true,
      message: 'Login successful', 
      token, 
      user: { 
        name: user.name, 
        email: user.email,
        country: user.country,
        income: user.income
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Login failed', 
      error: err.message 
    });
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    try {
      const emailInfo = await sendOTP(email, otp, user.name);
      console.log('Reset OTP email sent successfully to:', email);
      const previewUrl = emailInfo?.previewURL;
      if (previewUrl) {
        console.log('✅ Use the Ethereal preview URL to view the email:', previewUrl);
        res.json({ 
          success: true,
          message: 'OTP sent to email',
          emailPreview: previewUrl
        });
      } else {
        res.json({ message: 'OTP sent to email' });
      }
    } catch (emailError) {
      console.error('Error sending reset OTP email:', emailError);
      res.json({ 
        success: true,
        message: 'OTP generated. Use code: ' + otp,
        testOtp: otp
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.otp !== otp || user.otpExpiry < Date.now()) return res.status(400).json({ message: 'Invalid or expired OTP' });
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; 
    await user.save();
    try {
      const emailInfo = await sendOTP(email, otp, user.name);
      console.log('Resent OTP email successfully to:', email);
      const previewUrl = emailInfo?.previewURL;
      if (previewUrl) {
        console.log('✅ Use the Ethereal preview URL to view the email:', previewUrl);
        return res.json({ 
          success: true,
          message: 'OTP resent. Check your email',
          emailPreview: previewUrl 
        });
      } else {
        return res.json({ message: 'OTP resent. Check your email' });
      }
    } catch (emailError) {
      console.error('Error resending OTP email:', emailError);
      return res.json({ 
        success: true,
        message: 'OTP resent. Use this code: ' + otp,
        testOtp: otp 
      });
    }
  } catch (err) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to resend OTP', 
      error: err.message 
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid old password' 
      });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Password change failed', error: err.message });
  }
};
