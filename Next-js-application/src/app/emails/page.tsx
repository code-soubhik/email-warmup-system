import EmailList from "@/components/EmailList";
import { verifySession } from "@/lib/authSession";
import prisma from "@/lib/prisma";

export default async function EmailsPage() {
  const { userId } = await verifySession();

  const data = await prisma.emailConfig.findMany({
    where: { userId: parseInt(userId as string) }
  })
  return <EmailList emailList={data} />;
}