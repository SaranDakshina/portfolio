import { redirect } from "next/navigation";
import { homeSectionHref } from "@/lib/paths";

export default function WorkPage() {
  redirect(homeSectionHref("work"));
}
