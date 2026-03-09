import { Resend } from 'resend';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

let resendInstance: Resend | null = null;

const getResendInstance = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 're_your_api_key_here') {
        console.error('❌ Resend Error: API Key is missing or invalid in .env');
        return null;
    }
    if (!resendInstance) {
        resendInstance = new Resend(apiKey);
    }
    return resendInstance;
};

export const sendVerificationEmail = async (email: string, name: string, otp: string) => {
    try {
        const resend = getResendInstance();
        if (!resend) return false;

        const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
        
        console.log(`✉️ Attempting to send verification email to ${email} using ${fromEmail}`);

        // Themes are from App.css
        const primaryColor = '#9671FF'; // Cosmos Vibrant Purple
        const backgroundColor = '#05020b'; // Cosmos Deep Background

        const { data, error } = await resend.emails.send({
            from: `SafarFlow <${fromEmail}>`,
            to: [email],
            subject: 'Verify your SafarFlow account',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #2A1758; border-radius: 24px; background-color: ${backgroundColor}; color: #FFFFFF;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <div style="display: inline-block; padding: 12px; border-radius: 16px; background: rgba(150, 113, 255, 0.1); border: 1px solid rgba(150, 113, 255, 0.2); margin-bottom: 16px;">
                            <h1 style="color: ${primaryColor}; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1.5px; text-transform: uppercase;">SAFARFLOW</h1>
                        </div>
                        <p style="color: #94A3B8; font-size: 14px; margin: 0; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;">Orbital Sync Active</p>
                    </div>
                    
                    <div style="margin-bottom: 40px; background: rgba(255, 255, 255, 0.03); padding: 32px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <h2 style="color: #FFFFFF; margin: 0 0 16px 0; font-size: 24px; font-weight: 800;">Welcome, ${name}</h2>
                        <p style="color: #94A3B8; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Step into the next era of group travel. To verify your identity and activate your account, use the secure code below:</p>
                        
                        <div style="background-color: rgba(150, 113, 255, 0.1); padding: 32px; border-radius: 16px; text-align: center; border: 1px dashed ${primaryColor};">
                            <span style="font-size: 42px; font-weight: 900; color: ${primaryColor}; letter-spacing: 8px; font-family: monospace;">${otp}</span>
                        </div>
                        
                        <p style="color: #64748B; font-size: 13px; margin-top: 24px; text-align: center; font-weight: 500;">This secure code expires in 10 minutes.</p>
                    </div>
                    
                    <div style="border-top: 1px solid #2A1758; padding-top: 32px; text-align: center;">
                        <p style="color: #94A3B8; font-size: 14px; margin: 0 0 24px 0;">Exploring the world, together.</p>
                        <p style="color: #FFFFFF; font-size: 14px; font-weight: 700; margin: 0;">The SafarFlow Team</p>
                    </div>
                    
                    <div style="margin-top: 48px; text-align: center;">
                        <p style="color: #475569; font-size: 11px; margin: 0; letter-spacing: 1px;">&copy; 2024 SAFARFLOW. ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('❌ Resend API Error:', error);
            if (error.name === 'validation_error' && fromEmail !== 'onboarding@resend.dev') {
                console.warn('💡 Tip: Try using onboarding@resend.dev as your EMAIL_FROM in .env for testing.');
            }
            return false;
        }

        console.log('✅ Theme-aligned verification email sent successfully!', data?.id);
        return true;
    } catch (err) {
        console.error('❌ Email Service Error:', err);
        return false;
    }
};
