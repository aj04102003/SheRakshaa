
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
// Load environment variables from .env file (if present)
try {
    require('dotenv').config();
} catch (e) {
    // dotenv is optional; if it's not installed, just continue.
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Twilio Client Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// Normalize Twilio From number to E.164. If user enters 10 digits, prefix +91.
const normalizeTwilioFrom = (num) => {
    if (!num) return undefined;
    if (num.startsWith('+')) return num;
    const digits = num.replace(/\D/g, '');
    if (digits.length === 10) return `+91${digits}`; // default to India
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
    return `+${digits}`;
};

const rawTwilioNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioNumber = normalizeTwilioFrom(rawTwilioNumber);

let client = null;
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
} else {
    console.warn(
        '[She Raksha] Twilio credentials are missing. ' +
        'Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER to enable cloud SMS.'
    );
}

const isValidTwilioFrom = (num) => /^\+\d{8,15}$/.test(num || '');

// Helper: Validate Indian Phone Number
const isValidIndianNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return /^(91)?[6-9]\d{9}$/.test(cleaned);
};

// SOS Endpoint
app.post('/api/send-sos', async (req, res) => {
    const { contacts, message, senderName } = req.body;

    if (!client || !twilioNumber) {
        return res.status(500).json({
            error: "Twilio not configured on server.",
        });
    }

    if (!isValidTwilioFrom(twilioNumber)) {
        console.error('[She Raksha] Invalid TWILIO_PHONE_NUMBER format. Use +<countrycode><number>, e.g., +919876543210');
        return res.status(500).json({
            error: "Server Twilio From number is invalid. It must be in +<countrycode><number> format.",
        });
    }

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ error: "No contacts provided." });
    }

    const results = {
        success: [],
        failed: []
    };

    const sendPromises = contacts.map(async (contact) => {
        try {
            // Format to E.164 for Twilio (+91...)
            let formattedPhone = contact.phone.replace(/\D/g, '');
            if (formattedPhone.length === 10) {
                formattedPhone = '+91' + formattedPhone;
            } else if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
                formattedPhone = '+' + formattedPhone;
            }

            if (!isValidIndianNumber(formattedPhone)) {
                throw new Error("Invalid Indian mobile number format.");
            }

            await client.messages.create({
                body: `[SHE RAKSHA SOS] Alert from ${senderName}: ${message}`,
                from: twilioNumber,
                to: formattedPhone
            });

            results.success.push(contact.name);
        } catch (err) {
            console.error(`Failed to send to ${contact.name}:`, err.message);
            results.failed.push({ name: contact.name, error: err.message });
        }
    });

    await Promise.all(sendPromises);

    if (results.success.length > 0) {
        res.status(200).json({
            message: `Alerts sent to ${results.success.length} contacts.`,
            details: results
        });
    } else {
        res.status(500).json({
            error: "Failed to send alerts to any contacts.",
            details: results
        });
    }
});

// Test SMS Endpoint - for Profile screen "Send Test SMS"
app.post('/api/test-sms', async (req, res) => {
    const { phone, name } = req.body || {};

    if (!client || !twilioNumber) {
        return res.status(500).json({
            error: "Twilio not configured on server.",
        });
    }

    if (!isValidTwilioFrom(twilioNumber)) {
        console.error('[She Raksha] Invalid TWILIO_PHONE_NUMBER format. Use +<countrycode><number>, e.g., +919876543210');
        return res.status(500).json({
            error: "Server Twilio From number is invalid. It must be in +<countrycode><number> format.",
        });
    }

    if (!phone) {
        return res.status(400).json({ error: "Phone number is required." });
    }

    try {
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.length === 10) {
            formattedPhone = '+91' + formattedPhone;
        } else if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
            formattedPhone = '+' + formattedPhone;
        }

        if (!isValidIndianNumber(formattedPhone)) {
            return res.status(400).json({ error: "Invalid Indian mobile number format." });
        }

        await client.messages.create({
            body: `[SHE RAKSHA TEST] Hi${name ? ' ' + name : ''}, this is a test message confirming your safety alerts are configured.`,
            from: twilioNumber,
            to: formattedPhone
        });

        res.status(200).json({ message: "Test SMS sent successfully." });
    } catch (err) {
        console.error('Failed to send test SMS:', err.message);
        res.status(500).json({ error: "Failed to send test SMS.", details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`She Raksha Backend running on port ${PORT}`);
});