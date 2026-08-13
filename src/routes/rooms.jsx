import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/layout/site-layout";
import { RoomCard } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cities, colleges, facilityOptions, inr, rooms } from "@/lib/data";

function RoomsPage() {
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState(16e3);
  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");
  const [sharing, setSharing] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const results = useMemo(
    () => rooms.filter((r) => {
      if (query && !`${r.name} ${r.city} ${r.college}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (r.rent > budget) return false;
      if (city && r.city !== city) return false;
      if (college && r.college !== college) return false;
      if (sharing && r.sharing !== sharing) return false;
      if (verifiedOnly && !r.verified) return false;
      return facilities.every((f) => r.facilities.includes(f));
    }),
    [query, budget, city, college, sharing, verifiedOnly, facilities]
  );
  const toggleFacility = (f) => setFacilities((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  return <SiteLayout>
      <section className="gradient-soft border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Find your room</h1>
          <p className="mt-2 text-muted-foreground">
            {results.length} verified stays matching your filters.
          </p>
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search by area, college or property name"
    className="pl-9"
  />
            </div>
            <Button variant="hero" className="sm:w-40">
              <Search /> Search
            </Button>
            <Button
    variant="outline"
    className="lg:hidden"
    onClick={() => setShowFilters(!showFilters)}
  >
              <SlidersHorizontal /> Filters
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside
    className={`h-fit space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-24 ${showFilters ? "block" : "hidden lg:block"}`}
  >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Advanced Filters</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <Label>Max budget</Label>
              <span className="font-semibold text-primary">{inr(budget)}</span>
            </div>
            <Slider
    value={[budget]}
    min={3e3}
    max={2e4}
    step={500}
    onValueChange={(v) => setBudget(v[0] ?? budget)}
  />
          </div>

          <Field label="College" htmlFor="fcollege">
            <Select id="fcollege" value={college} onChange={(e) => setCollege(e.target.value)}>
              <option value="">All colleges</option>
              {colleges.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>

          <Field label="City" htmlFor="fcity">
            <Select id="fcity" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All cities</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>

          <Field label="Sharing type" htmlFor="fsharing">
            <Select id="fsharing" value={sharing} onChange={(e) => setSharing(e.target.value)}>
              <option value="">Any</option>
              <option>Single</option>
              <option>Double</option>
              <option>Triple</option>
            </Select>
          </Field>

          <div className="space-y-2">
            <Label>Facilities</Label>
            <div className="flex flex-wrap gap-2">
              {facilityOptions.map((f) => <button
    key={f}
    type="button"
    onClick={() => toggleFacility(f)}
    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${facilities.includes(f) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
  >
                  {f}
                </button>)}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <Label htmlFor="verified">Verified only</Label>
            <Switch id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
          </div>

          <Button
    variant="ghost"
    className="w-full"
    onClick={() => {
      setQuery("");
      setBudget(2e4);
      setCity("");
      setCollege("");
      setSharing("");
      setVerifiedOnly(false);
      setFacilities([]);
    }}
  >
            Reset filters
          </Button>
        </aside>

        <div>
          {results.length === 0 ? <div className="rounded-2xl border border-dashed border-border p-16 text-center">
              <p className="font-semibold">No rooms match these filters</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try increasing your budget or clearing a filter.
              </p>
            </div> : <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((room, i) => <RoomCard key={room.id} room={room} index={i} />)}
            </div>}

          <div className="mt-10 flex items-center justify-center gap-2">
            {[1, 2, 3].map((p) => <button
    key={p}
    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${p === 1 ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-secondary"}`}
  >
                {p}
              </button>)}
            <span className="px-2 text-sm text-muted-foreground">of 3</span>
          </div>
        </div>
      </section>
    </SiteLayout>;
}
export default RoomsPage;
