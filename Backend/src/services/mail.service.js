import nodemailer from 'nodemailer'
import dotenv from "dotenv";
import config from '../config/config.js';


const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS,
    }
})

transporter.verify()
    .then(()=>{
        console.log('Email transporter is ready to send Emails');
    }).catch((err)=>{
        console.error("Email transporter Verification Failed:",err);
    })

export async function sendEmail({to,subject,html,text}) {
    const mailOption={
        from: process.env.GMAIL_USER,
        to,
        subject,
        html,
        text
    }
    const details=await transporter.sendMail(mailOption);
    console.log('email Sent:',details);
}