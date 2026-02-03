"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BadgeCheck,
  Clock,
  Eye,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";

type Creator = {
  _id?: string;
  name: string;
  handle: string;
  location: string;
  tagline: string;
  avatarUrl: string;
  startingPrice: number;
  contentTypes: string[];
  platforms: string[];
  attributes: string[];
  stats: {
    audienceSize: number;
    avgViews: number;
    engagementRate: number;
  };
  responseTimeHours: number;
  turnaroundDays: number;
  nextAvailableDays: number;
  verified?: boolean;
};

const PRICE_FILTERS = [
  { value: "any", label: "Any price" },
  { value: "under-250", label: "Under $250", max: 250 },
  { value: "250-500", label: "$250 - $500", min: 250, max: 500 },
  { value: "500-1000", label: "$500 - $1k", min: 500, max: 1000 },
  { value: "1000-plus", label: "$1k+", min: 1000 },
] as const;

const DEFAULT_CONTENT_TYPES = [
  "Short-form video",
  "Long-form video",
  "Newsletter feature",
  "Podcast ad",
  "Livestream",
  "Thread",
  "Product demo",
  "Case study",
  "Founder story",
  "LinkedIn post",
  "Carousel",
  "Testimonial",
  "Community post",
  "Tutorial",
  "Unboxing",
  "Story",
];

const DEFAULT_ATTRIBUTES = [
  "B2B",
  "SaaS",
  "AI",
  "Fintech",
  "Developer",
  "Founder-led",
  "Ecommerce",
  "Consumer",
  "Wellness",
  "Creator economy",
  "Gaming",
  "Community",
  "Podcast",
  "Live",
  "Tech",
];

const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export default function AppPage() {
  const creators = useQuery((api as any).creators.list) as
    | Creator[]
    | undefined;
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("any");
  const [contentType, setContentType] = useState("all");
  const [activeAttributes, setActiveAttributes] = useState<string[]>([]);

  const contentTypeOptions = useMemo(() => {
    const extras = new Set<string>();
    for (const creator of creators ?? []) {
      for (const type of creator.contentTypes ?? []) {
        if (!DEFAULT_CONTENT_TYPES.includes(type)) {
          extras.add(type);
        }
      }
    }
    return [...DEFAULT_CONTENT_TYPES, ...Array.from(extras)];
  }, [creators]);

  const attributeOptions = useMemo(() => {
    const extras = new Set<string>();
    for (const creator of creators ?? []) {
      for (const attribute of creator.attributes ?? []) {
        if (!DEFAULT_ATTRIBUTES.includes(attribute)) {
          extras.add(attribute);
        }
      }
    }
    return [...DEFAULT_ATTRIBUTES, ...Array.from(extras)];
  }, [creators]);

  const filteredCreators = useMemo(() => {
    const creatorsList = creators ?? [];
    const normalizedSearch = search.trim().toLowerCase();
    const searchTokens = normalizedSearch
      ? normalizedSearch.split(/\s+/).filter(Boolean)
      : [];
    const priceConfig = PRICE_FILTERS.find(
      (filter) => filter.value === priceFilter
    );

    return creatorsList.filter((creator) => {
      if (searchTokens.length > 0) {
        const haystack = [
          creator.name,
          creator.handle,
          creator.location,
          creator.tagline,
          creator.platforms?.join(" "),
          creator.contentTypes?.join(" "),
          creator.attributes?.join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchTokens.every((token) => haystack.includes(token))) {
          return false;
        }
      }

      if (priceConfig) {
        if (
          typeof priceConfig.min === "number" &&
          creator.startingPrice < priceConfig.min
        ) {
          return false;
        }
        if (
          typeof priceConfig.max === "number" &&
          creator.startingPrice > priceConfig.max
        ) {
          return false;
        }
      }

      if (contentType !== "all") {
        if (!creator.contentTypes?.includes(contentType)) {
          return false;
        }
      }

      if (activeAttributes.length > 0) {
        const hasAllAttributes = activeAttributes.every((attribute) =>
          creator.attributes?.includes(attribute)
        );
        if (!hasAllAttributes) {
          return false;
        }
      }

      return true;
    });
  }, [creators, search, priceFilter, contentType, activeAttributes]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    priceFilter !== "any" ||
    contentType !== "all" ||
    activeAttributes.length > 0;

  const isLoading = creators === undefined;

  const toggleAttribute = (attribute: string) => {
    setActiveAttributes((prev) =>
      prev.includes(attribute)
        ? prev.filter((item) => item !== attribute)
        : [...prev, attribute]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setPriceFilter("any");
    setContentType("all");
    setActiveAttributes([]);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(120%_120%_at_50%_0%,_rgba(255,244,214,0.8)_0%,_rgba(255,255,255,0.95)_50%,_rgba(255,255,255,1)_100%)] pb-16">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-12">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.2em]">
              Creator marketplace
            </p>
            <h1 className="text-balance text-3xl font-semibold sm:text-4xl">
              Find creators who ship proof, not hype
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
              Compare price, content type, and trust signals before making a
              funded offer. Filters update instantly, so you can narrow down
              the list fast.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {filteredCreators.length} match
              {filteredCreators.length === 1 ? "" : "es"}
            </Badge>
            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>
        </header>

        <div className="bg-card/80 border-border/60 shadow-sm relative overflow-hidden rounded-3xl border p-6 backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/10" />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex-1 space-y-2">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                  <SlidersHorizontal className="size-3.5" />
                  Filters
                </div>
                <InputGroup className="h-10">
                  <InputGroupAddon>
                    <Search className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search creators, niches, platforms..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search creators"
                  />
                </InputGroup>
              </div>
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs">
                    Price
                  </span>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_FILTERS.map((filter) => (
                        <SelectItem key={filter.value} value={filter.value}>
                          {filter.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs">
                    Content type
                  </span>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All content" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All content</SelectItem>
                      {contentTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {attributeOptions.map((attribute) => {
                const isActive = activeAttributes.includes(attribute);
                return (
                  <Button
                    key={attribute}
                    type="button"
                    size="sm"
                    variant={isActive ? "secondary" : "outline"}
                    onClick={() => toggleAttribute(attribute)}
                    className="h-7 rounded-full px-3 text-xs"
                  >
                    {attribute}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-muted/40 h-[420px] animate-pulse rounded-3xl border"
                />
              ))
            : filteredCreators.map((creator) => (
                <Card
                  key={creator._id ?? creator.handle}
                  className="bg-card/85 border-border/60 shadow-sm overflow-hidden rounded-3xl pt-0 backdrop-blur"
                >
                  <div className="relative">
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="h-52 w-full object-cover object-[center_25%]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                      {creator.verified ? (
                        <Badge className="gap-1 bg-white/90 text-slate-900">
                          <BadgeCheck className="size-3.5" />
                          Verified
                        </Badge>
                      ) : (
                        <span />
                      )}
                      <Badge className="bg-white/90 text-slate-900">
                        {formatCurrency(creator.startingPrice)}+
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {creator.name}
                          </h3>
                          <div className="text-white/80 flex items-center gap-2 text-xs">
                            <span>{creator.handle}</span>
                            <span className="text-white/50">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {creator.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col gap-4 pt-4">
                    <p className="text-muted-foreground text-sm">
                      {creator.tagline}
                    </p>
                    <div className="flex-1" />
                    <div className="flex flex-wrap gap-1">
                      {creator.contentTypes.slice(0, 3).map((type) => (
                        <Badge key={type} variant="secondary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Platforms: {creator.platforms.join(", ")}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="bg-muted/50 rounded-2xl p-2">
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Users className="size-3" />
                          Audience
                        </div>
                        <div className="text-foreground mt-1 text-sm font-semibold">
                          {formatCompactNumber(creator.stats.audienceSize)}
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-2xl p-2">
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Eye className="size-3" />
                          Avg views
                        </div>
                        <div className="text-foreground mt-1 text-sm font-semibold">
                          {formatCompactNumber(creator.stats.avgViews)}
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-2xl p-2">
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Sparkles className="size-3" />
                          Engagement
                        </div>
                        <div className="text-foreground mt-1 text-sm font-semibold">
                          {formatPercent(creator.stats.engagementRate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {creator.attributes.slice(0, 3).map((attribute) => (
                        <Badge key={attribute} variant="outline">
                          {attribute}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      Responds in {creator.responseTimeHours}h
                    </span>
                    <span>
                      Next slot in {creator.nextAvailableDays} day
                      {creator.nextAvailableDays === 1 ? "" : "s"}
                    </span>
                  </CardFooter>
                </Card>
              ))}
          {!isLoading && filteredCreators.length === 0 ? (
            <div className="border-border/70 col-span-full rounded-3xl border border-dashed p-10 text-center">
              <p className="text-foreground text-base font-semibold">
                No creators match those filters yet.
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Try removing a filter or widening the price range to see more
                results.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
