import { redirect } from "next/navigation";

// The starter kit now lives on the Business page.
export default function ProductsPage() {
  redirect("/business#kit");
}
