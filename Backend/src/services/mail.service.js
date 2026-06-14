import { Resend } from 'resend';
import config from '../config/config.js';

const resend = new Resend(config.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
    const { data, error } = await resend.emails.send({
        from: 'Snitch <onboarding@resend.dev>',
        to: 'rupanshuchaudhary96302@gmail.com',
        subject,
        html,
        text
    });
    if (error) throw error;
    console.log('Email sent:', data);
}