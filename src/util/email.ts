import nodemailer from "nodemailer";
import path from "path";

export const sendEmail = async (to: string, subject: string, message: string) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Lumière Salon" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: `
            <div style="text-align:center;">
            <img src="cid:salonlogo" alt="Salon Logo" style="width:150px; margin-bottom:10px;" />
            </div>
            ${message}
        `,
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../assets/logo.png"),
                cid: "salonlogo",
            },
        ],
    });
};
