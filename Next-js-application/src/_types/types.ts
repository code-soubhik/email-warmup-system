import { EMAIL_STATUS } from "@prisma/client";

export type EmailConfigType = {
    email: string;
    status: EMAIL_STATUS;
    userId: number;
    id: number;
}