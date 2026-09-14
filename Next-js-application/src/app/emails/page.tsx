import EmailList from "@/_components/EmailList";
import { verifySession } from "@/_lib/authSession";
import prisma from "@/_lib/prisma";

export default async function EmailsPage() {
  const { userId } = await verifySession();

  const data = await prisma.emailConfig.findMany({
    where: { userId: parseInt(userId as string) },
    select: { email: true, userId: true, status: true, id: true },
  });

  return <EmailList emailList={data} />;
}
