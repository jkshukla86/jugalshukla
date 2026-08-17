import {
  BadgeCheck,
  BarChart3,
  Bot,
  ClipboardCheck,
  Compass,
  Linkedin,
  Magnet,
  Mail,
  MapPin,
  Megaphone,
  MousePointerClick,
  PenLine,
  Search,
  Share2,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  BadgeCheck,
  BarChart3,
  Bot,
  ClipboardCheck,
  Compass,
  Linkedin,
  Magnet,
  Mail,
  MapPin,
  Megaphone,
  MousePointerClick,
  PenLine,
  Search,
  Share2,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Workflow,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}
