import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplet.js"


export const sendWelcomeEmail = async (email,name,clientUrl) =>{
    const {data,error} = await resendClient.emails.send({
        from:`${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Chatlify!",
        html: createWelcomeEmailTemplate(name,clientUrl)
    });
    if(error){
        console.log("Error sending welcome email:",error);
        throw new Error("Failed to send welcome email");
    }
    console.log("Welcome email sent successfully to",email);
    console.log("data",data);
}
