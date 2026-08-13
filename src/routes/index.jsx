import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Building2,
  Calculator,
  IndianRupee,
  Map,
  Quote,
  School,
  Search,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import heroImage from "@/assets/hero-roomsathi.jpg";
import { SiteLayout } from "@/components/layout/site-layout";
import { RoomCard } from "@/components/room-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs, rooms, testimonials } from "@/lib/data";

const stats = [
  { value: "500+", label: "Verified Rooms", icon: Building2 },
  { value: "300+", label: "Trusted Owners", icon: School },
  { value: "2000+", label: "Happy Students", icon: Users }
];
const features = [
  {
    icon: BadgeCheck,
    title: "Verified Listings",
    body: "Every property is checked by our team \u2014 real photos, real owners, no surprises."
  },
  {
    icon: IndianRupee,
    title: "No Brokerage",
    body: "Talk to owners directly. You never pay a rupee of commission on RoomSathi."
  },
  {
    icon: Sparkles,
    title: "Smart Roommate Matching",
    body: "A lifestyle quiz scores compatibility so you live with someone who actually fits."
  },
  {
    icon: Map,
    title: "Maps Integration",
    body: "See exactly where a room sits relative to your campus, mess and metro stop."
  },
  {
    icon: School,
    title: "Near College Search",
    body: "Filter by college and get results sorted by walking distance from the gate."
  },
  {
    icon: Calculator,
    title: "Expense Split Calculator",
    body: "Split rent, electricity, WiFi and gas across members in a single tap."
  }
];
function Index() {
  return <SiteLayout>
      {
    /* Hero */
  }
      <section className="gradient-soft relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="space-y-7"
  >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Trusted by 2000+ students across India
            </span>
            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Perfect Room <span className="text-gradient">Near Your College</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Find verified rooms, PGs, flats and compatible roommates without paying brokerage.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/rooms">
                  <Search /> Search Rooms
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/owner-register">
                  <Building2 /> Become an Owner
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {[11, 22, 33, 44].map((i) => <img
    key={i}
    src={`https://i.pravatar.cc/80?img=${i}`}
    alt="Student"
    loading="lazy"
    className="h-9 w-9 rounded-full border-2 border-background object-cover"
  />)}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">4.8/5</span> average rating from
                student reviews
              </p>
            </div>
          </motion.div>
          <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.15 }}
    className="relative"
  >
            <img
    src={heroImage}
    alt="Students finding shared accommodation near their college"
    width={1280}
    height={1024}
    className="w-full rounded-3xl border border-border shadow-lift"
  />
            <div className="absolute -bottom-6 left-4 hidden rounded-2xl border border-border bg-card p-4 shadow-lift sm:block">
              <p className="text-xs text-muted-foreground">Nearest verified PG</p>
              <p className="font-semibold">600 m from campus</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-accent">
                <BadgeCheck className="h-3.5 w-3.5" /> Owner verified
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {
    /* Stats */
  }
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
          {stats.map((s, i) => <motion.div
    key={s.label}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: i * 0.1 }}
    className="flex items-center gap-4 rounded-2xl border border-border p-5 shadow-soft"
  >
              <span className="gradient-hero flex h-12 w-12 items-center justify-center rounded-2xl text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-2xl font-extrabold tracking-tight">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </motion.div>)}
        </div>
      </section>

      {
    /* Features */
  }
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Why RoomSathi</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything a student needs to move in
          </h2>
          <p className="mt-3 text-muted-foreground">
            From discovering a verified room to splitting the electricity bill — one product, no
            middlemen.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => <motion.div
    key={f.title}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.4, delay: i % 3 * 0.08 }}
    className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
  >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>)}
        </div>
      </section>

      {
    /* Featured rooms */
  }
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Handpicked</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Popular rooms this week</h2>
            </div>
            <Button variant="soft" asChild>
              <Link to="/rooms">Browse all rooms</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.slice(0, 3).map((room, i) => <RoomCard key={room.id} room={room} index={i} />)}
          </div>
        </div>
      </section>

      {
    /* Testimonials */
  }
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Student stories</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by students in 5 cities
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => <motion.figure
    key={t.name}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: i * 0.1 }}
    className="rounded-2xl border border-border bg-card p-6 shadow-soft"
  >
              <Quote className="h-6 w-6 text-primary/30" />
              <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img
    src={`https://i.pravatar.cc/80?img=${20 + i * 7}`}
    alt={t.name}
    loading="lazy"
    className="h-10 w-10 rounded-full object-cover"
  />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" /> 5.0
                </span>
              </figcaption>
            </motion.figure>)}
        </div>
      </section>

      {
    /* FAQ */
  }
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Questions, answered</h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f) => <AccordionItem
    key={f.q}
    value={f.q}
    className="mb-3 rounded-2xl border border-border bg-card px-5 shadow-soft"
  >
                <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </section>

      {
    /* CTA */
  }
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="gradient-hero relative overflow-hidden rounded-3xl px-6 py-14 text-center shadow-lift sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Your next room is two clicks away
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Create a free student account and start shortlisting verified rooms near your campus
            today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="xl" variant="secondary" asChild>
              <Link to="/register">Create student account</Link>
            </Button>
            <Button size="xl" variant="accent" asChild>
              <Link to="/rooms">Explore rooms</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>;
}
export default Index;
