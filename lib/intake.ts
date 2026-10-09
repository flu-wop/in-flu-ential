// Intake questions, shared by the form and the API that emails the answers.
// Asked after a paid deposit, so the build can start without a back-and-forth.

export type IntakeField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "url" | "checks";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  only?: "social"; // shown only for the social media marketing package
};

export const INTAKE_FIELDS: IntakeField[] = [
  { id: "business", label: "Business or Artist Name", type: "text", required: true, placeholder: "Bourbon Daiquiris" },
  { id: "currentSite", label: "Current Website", type: "url", placeholder: "https://… (leave blank if none)" },
  { id: "socials", label: "Social Handles", type: "text", placeholder: "@yourname on Instagram, TikTok…" },
  { id: "goal", label: "What Should the Site Do for You?", type: "textarea", required: true, placeholder: "Take bookings, sell products, get more calls…" },
  { id: "pages", label: "Pages You Want", type: "checks", options: ["Home", "About", "Services", "Booking", "Store", "Gallery", "Press", "Contact"] },
  { id: "features", label: "Features", type: "checks", options: ["Online Booking", "Payments", "Store", "Email Signup", "Paywall", "Calendar Invites"] },
  { id: "brand", label: "Logo, Colors and Fonts", type: "textarea", placeholder: "Describe them, or paste a Google Drive or Dropbox link" },
  { id: "content", label: "Photos, Video and Copy", type: "textarea", placeholder: "Paste a shared folder link, or tell me what you still need" },
  { id: "examples", label: "Sites You Like", type: "textarea", placeholder: "Links, and what you like about each" },
  { id: "domain", label: "Domain", type: "text", placeholder: "yourbusiness.com, or 'I need one'" },
  { id: "audience", label: "Who Is Your Audience?", type: "textarea", required: true, only: "social", placeholder: "Age, location, what they care about" },
  { id: "socialGoals", label: "Goals for the First 30 Days", type: "textarea", required: true, only: "social", placeholder: "Followers, bookings, a release, foot traffic…" },
  { id: "contentOnHand", label: "Content You Already Have", type: "textarea", only: "social", placeholder: "Photos, videos, past posts that did well" },
  { id: "deadline", label: "Launch Date or Deadline", type: "text", placeholder: "Any date that matters" },
  { id: "notes", label: "Anything Else", type: "textarea" },
];

export const INTAKE_PRODUCTS = ["website-deposit", "social-deposit"] as const;
