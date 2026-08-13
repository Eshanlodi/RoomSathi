import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function ContactPage() {
  const onSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent", { description: "Our team replies within 24 hours." });
  };
  return <SiteLayout>
      <section className="gradient-soft border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Talk to the team</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Whether you're a student stuck on a booking or an owner listing a property, we're one
            message away.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          {[
    { icon: Mail, label: "Email", value: "hello@roomsathi.in" },
    { icon: Phone, label: "Phone", value: "+91 90000 12345" },
    { icon: MapPin, label: "Office", value: "FC Road, Pune 411004" },
    { icon: MessageSquare, label: "Support hours", value: "Mon\u2013Sat, 9 AM \u2013 8 PM" }
  ].map((c) => <div
    key={c.label}
    className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
  >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{c.label}</p>
                <p className="text-sm text-muted-foreground">{c.value}</p>
              </div>
            </div>)}
        </div>

        <form
    onSubmit={onSubmit}
    className="rounded-3xl border border-border bg-card p-8 shadow-soft lg:col-span-2"
  >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required placeholder="Aditi Joshi" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cemail">Email</Label>
              <Input id="cemail" type="email" required placeholder="you@college.edu" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" required placeholder="I need help with a booking" />
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" required rows={6} placeholder="Tell us what's going on…" />
          </div>
          <Button type="submit" variant="hero" size="xl" className="mt-6 w-full sm:w-auto">
            Send message
          </Button>
        </form>
      </section>
    </SiteLayout>;
}
export default ContactPage;
