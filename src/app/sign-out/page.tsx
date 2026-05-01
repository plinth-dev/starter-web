import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignOut() {
  const c = await cookies();
  c.delete("plinth_dev_user");
  redirect("/");
}
