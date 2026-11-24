"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";

// Server action: runs on the server when the form is submitted.
export async function addEntry(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const message = String(formData.get("message") ?? "").trim().slice(0, 500);
  if (!name || !message) return;

  await sql`insert into guestbook (name, message) values (${name}, ${message})`;
  revalidatePath("/guestbook");
}
