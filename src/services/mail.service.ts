import { render } from "@react-email/components";

import { CONFIGS } from "@/configs";
import mailer from "@/libraries/mailer";
import WelcomeUserEmail from "@/email-templates/welcome-user";
import PasswordResetEmail from "@/email-templates/password-reset";
import VerificationLinkEmail from "@/email-templates/verification-link";

import type { IUser } from "@/models/user.model";

class MailService {
    async sendWelcomeUserEmail(context: { user: Pick<IUser, "_id" | "name" | "email">; verificationToken: string }) {
        const emailProp = {
            name: context.user.name,
            verificationLink: `${CONFIGS.URL.CLIENT_BASE_URL}/auth/verify-email?verificationToken=${context.verificationToken}&userId=${context.user._id}`
        };

        return await mailer.sendMail({
            to: context.user.email,
            subject: "Welcome to apollo-server-boilertemplate",
            text: render(WelcomeUserEmail(emailProp), { plainText: true }),
            html: render(WelcomeUserEmail(emailProp))
        });
    }

    async sendVerificationLinkEmail(context: { user: Pick<IUser, "_id" | "name" | "email">; verificationToken: string }) {
        const emailProp = {
            name: context.user.name,
            verificationLink: `${CONFIGS.URL.CLIENT_BASE_URL}/auth/verify-email?verificationToken=${context.verificationToken}&userId=${context.user._id}`
        };

        return await mailer.sendMail({
            to: context.user.email,
            subject: "Verify your email address",
            text: render(VerificationLinkEmail(emailProp), { plainText: true }),
            html: render(VerificationLinkEmail(emailProp))
        });
    }

    async sendPasswordResetEmail(context: { user: Pick<IUser, "_id" | "name" | "email">; resetToken: string }) {
        const emailProp = {
            name: context.user.name,
            resetLink: `${CONFIGS.URL.CLIENT_BASE_URL}/auth/reset-password?resetToken=${context.resetToken}&userId=${context.user._id}`
        };

        return await mailer.sendMail({
            to: context.user.email,
            subject: "Reset your password",
            text: render(PasswordResetEmail(emailProp), { plainText: true }),
            html: render(PasswordResetEmail(emailProp))
        });
    }
}

// For testing purposes, uncomment code below and run `yarn start`
// new MailService().sendWelcomeUserEmail({
//     user: {
//         _id: "5f9b3b1b9b3b1b9b3b1b9b3b",
//         firstName: "John",
//         email: "", // Add your email here to test
//     },
//     verificationToken: "5f9b3b1b9b3b1b9b3b1b9b3b",
// });

export default new MailService();
