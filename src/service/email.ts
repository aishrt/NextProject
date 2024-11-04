import axios from "axios";
import moment from "moment";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `http://localhost:3000/activate/${token}`; // Nowy format URL
  await transporter.sendMail({
    from: '"Your App Name" <distories69@gmail.com>',
    to: email,
    subject: "Verify Your Email",
    html: `Please click on the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  role: string
) {
  const url = process.env?.NEXTAUTH_URL;
  const resetPasswordUrl = `${url}/api/auth/verify-link?email=${email}&token=${token}&role=${role}`;
  // const resetPasswordUrl = `${url}/auth/reset-password?email=${email}&token=${token}&role=${role}`;
  //   const resetPasswordUrl = `http://localhost:3000/reset-password/${encodeURIComponent(
  //     token
  //   )}`;
  await transporter.sendMail({
    from: process.env?.EMAIL_FROM,
    to: email,
    subject: "Password Reset Request",
    html: `We received a request to reset your password for our app. Please click on the following link to reset your password: <strong><a href="${resetPasswordUrl}" target="_blank style="font-weight:bold">Reset Password</a></strong>. 
    <p>If you did not request a password reset, please ignore this email.</p>`,
  });
}

export async function sendEmailVerification(to: string, otp: number) {
  const from = process.env?.EMAIL_FROM;
  const subject = "Email Verification";
  const text = `Dear user, Your Otp is ${otp} to verify your email`;
  const html = `Dear user, Your Otp is ${otp} to verify your email`;
  await transporter.sendMail({ from, to, subject, html });
}

export async function sendNewPasswordEmail(email: string, newPassword: string) {
  await transporter.sendMail({
    from: '"Your App Name" <distories69@gmail.com>',
    to: email,
    subject: "Your New Password",
    html: `Your password has been reset. Here is your new password: <strong>${newPassword}</strong>. It is recommended to change this password after logging in.`,
  });
}

export async function sendGDPRConsentEmail(email: string) {
  const url = process.env?.NEXTAUTH_URL;

  const link = `${url}/auth/login`;

  await transporter.sendMail({
    from: process.env?.EMAIL_FROM,
    to: email,
    subject: "Your Consent is Needed to Proceed with Your Legal Case",
    html: `
    <p>Hey,</p>
    <p>I hope this message finds you well. As part of our ongoing efforts to support your legal representation, we are reaching out to ensure the responsible and compliant handling of your personal data in accordance with data protection laws.</p>
    <p>You have been included in a group representation led by [Lead Representative's Name], who is taking proactive steps to address a legal matter that concerns you among others. Before we can fully engage on your behalf and include your details in our case management process, we require your consent to process your personal information.</p>
     <p>Why Your Consent Matters?</p>
     <p>Your consent allows us to legally use your personal data solely for the purpose of this legal case. It ensures that all actions we undertake on your behalf are transparent, secure, and directly aligned with your interests.</p>

<p>What You Need to Do:
Please review and electronically sign the attached GDPR consent document. This is a simple yet vital step to formally authorize us to include your information in our case evaluations and related activities.
</p>

<p>Click here to review and sign the consent form:<strong><a href="${link}" target="_blank style="font-weight:bold">Click here</a></strong>
Please ensure to complete this at your earliest convenience. Your prompt action will help us move forward more efficiently and strengthen our position.</p>
<p>
We deeply appreciate your cooperation and are here to assist with any questions you may have. We look forward to representing you effectively and securing the best possible outcome for your case.</p>
    <p> Warm regards,</p>
    <p>Mathias REY</p>
    <p>Président</p>
    <p>If you have received this email in error or if you have any concerns about this process, please contact us immediately at:<strong>contact@indemnisezmoi.fr</strong></p>`,
  });
}

export async function sendAuthorizedDelegationEmail(data: {
  email: string;
  legalRepresentiveName: string;
  employeeName: string;
}) {
  const url = process.env?.NEXT_PUBLIC_AUTH_URL;
  const pdfBaseUrl = process.env?.NEXT_PUBLIC_PDF_URL;
  const link = `${url}/auth/login`;
  const pdfUrl = `${pdfBaseUrl}/generate-pdf`;
  const pdf = await axios.get(pdfUrl);

  await transporter.sendMail({
    from: process.env?.EMAIL_FROM,
    to: data?.email,
    attachments: [
      {
        filename: "AuthorityMandate.pdf",
        path: pdf?.data?.pdf,
      },
    ],
    subject:
      "Request for Authorization Delegation for Free Claim Evaluation and Financing Opportunities",
    html: `
      <p style='text-transform: capitalize'>Dear ${data?.legalRepresentiveName},</p>
      <p>
        I hope this message finds you in good spirits. ${data?.employeeName} is considering a potential claim that your company may have against [Name of Opposing Party]. To assess this matter comprehensively and explore all viable options, ${data?.employeeName} would like to conduct a free, no-obligation evaluation of the claim's potential.
      </p>
      <p>
        Furthermore, he is interested in exploring possible financing solutions for pursuing this claim, should it prove viable. To facilitate this process, we kindly request that you formalize the delegation of authority. Could you please provide a proof of identity or authenticate via France Connect at your earliest convenience? This will allow us to proceed with the evaluation and discuss the financing options available.
      </p>
      <p>We appreciate your cooperation in this matter and look forward to your prompt response, enabling us to move forward effectively and ensure our mutual interests are well protected.</p>
      <p>Warm regards,</p>
      <p>Mathias REY</p>
      <p>President</p>
      <p>Indemnisez Moi</p>
      <p><strong>mathias.rey@indemnisezmoi.fr</strong></p>`,
  });
}

// TASK REMINDER EMAIL
export async function sendTaskReminderEmail(
  email: string,
  date: any,
  case_id: any
) {
  try {
    await transporter.sendMail({
      from: '"Indemnisez Moi" <distories69@gmail.com>',
      to: email,
      subject: "Task Reminder",
      html: `This is a gental reminder for you. Your task for case #${case_id} is pending. Please complete it before ${moment(
        date
      ).format("DD-MMM-YYYY")}. Thank You`,
    });
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return {
      error,
      success: false,
    };
  }
}
// Meeting Sechdule Email
export async function sendMeetingSechduleEmail(
  email: string,
  date: any,
  case_id: any
) {
  try {
    await transporter.sendMail({
      from: '"Indemnisez Moi" <distories69@gmail.com>',
      to: email,
      subject: "Meeting Scheduled",
      html: `Hey, Hope you doing well. We have scheduled a meeting for ${date} regarding your case #${case_id}. Thank You`,
    });
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return {
      error,
      success: false,
    };
  }
}

// CourtHearing Reminder Email
export async function sendCourtHearingReminderEmail(data: any) {
  try {
    await transporter.sendMail({
      from: '"Indemnisez Moi" <distories69@gmail.com>',
      to: data?.email,
      subject: "Court Hearing Reminder",
      html: `Hey, Hope you doing well. This is a gental reminder to you regarding your upcoming court hearing on ${data?.date} ${data?.time}, Please reach at ${data?.address} and attend it. Thank You`,
    });
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return {
      error,
      success: false,
    };
  }
}

// Quitense Report Alert Email
export async function sendQuitenseAlertEmail(data: any) {
  try {
    await transporter.sendMail({
      from: '"Indemnisez Moi" <distories69@gmail.com>',
      to: data?.email,
      subject: "Quitense Report Created",
      html: `Hey, Hope you doing well. Case Manager have uploaded Quitense Instruction Document. You can review it by clicking below button. Thank You <br></br>
      <p><strong><a href="${process.env.NEXTAUTH_URL}/client/quitense?case_id=${data?.case_id}" target="_blank style="font-weight:bold">Click here</a></strong>
      `,
    });
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return {
      error,
      success: false,
    };
  }
}

// Litigation Case Complete Report Alert Email
export async function sendLitigationCompleteAlertEmail(data: any) {
  try {
    await transporter.sendMail({
      from: '"Indemnisez Moi" <distories69@gmail.com>',
      to: data?.email,
      subject: "Carpa Instruction Document Updated",
      html: `Hey, Hope you doing well. Case Manager have uploaded Carpa Instruction Document. You can review it by clicking below button. Thank You <br></br>
      <p><strong><a href="${process.env.NEXTAUTH_URL}/client/litigation-case-complete?case_id=${data?.case_id}" target="_blank style="font-weight:bold">Click here</a></strong>
      `,
    });
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return {
      error,
      success: false,
    };
  }
}
