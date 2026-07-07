"use client";

import type { ElementType } from "react";

import {
  ArrowLeft as _ArrowLeft,
  ArrowLeftRight as _ArrowLeftRight,
  ArrowRight as _ArrowRight,
  BadgeCheck as _BadgeCheck,
  Bell as _Bell,
  BookOpen as _BookOpen,
  BookOpenText as _Story,
  BookPlus as _CreateStory,
  ChartNoAxesColumn as _Dashboard,
  Check as _Check,
  ChevronDown as _ChevronDown,
  ChevronLeft as _ChevronLeft,
  ChevronRight as _ChevronRight,
  ChevronsUpDown as _ChevronsUpDown,
  CirclePlus as _Support,
  Clock as _Clock,
  Cog as _Cog,
  Component as _Component,
  CreditCard as _CreditCard,
  Download as _Download,
  Flag as _Reporting,
  Flame as _Flame,
  Heart as _Heart,
  House as _Home,
  Layers as _Layers,
  BookText as _Book,
  LayoutGrid as _LayoutGrid,
  LoaderCircle as _LoaderCircle,
  MapPin as _MapPin,
  LogOut as _LogOut,
  Mail as _Mail,
  MousePointerClick as _MousePointerClick,
  Palette as _Palette,
  Grid2X2 as _Collage,
  PanelLeft as _PanelLeft,
  Pencil as _Pencil,
  Rocket as _Rocket,
  Star as _Star,
  UtensilsCrossed as _Utensils,
  Send as _Send,
  Settings as _Settings,
  Sparkles as _Sparkles,
  SquareCheckBig as _Tasks,
  CircleQuestionMark as _Question,
  Trash2 as _Trash2,
  TriangleAlert as _TriangleAlert,
  Users as _Users,
  ScanFace as _FaceSwap,
  X as _X,
} from "lucide-react";

export interface SvgAsset {
  readonly src: string;
  readonly width?: number;
  readonly height?: number;
}

export interface IconToken {
  readonly _brand: "IconToken";
  readonly element: ElementType | SvgAsset;
}

export const t = (c: ElementType | SvgAsset): IconToken => ({
  _brand: "IconToken",
  element: c,
});

export const LogoIcon = t({ src: "/logo.svg" });
export const Home = t(_Home);
export const Dashboard = t(_Dashboard);
export const Projects = t(_Layers);
export const Tasks = t(_Tasks);
export const Reporting = t(_Reporting);
export const Users = t(_Users);
export const Support = t(_Support);
export const Settings = t(_Settings);
export const Question = t(_Question);
export const Collage = t(_Collage);
export const FaceSwap = t(_FaceSwap);
export const Book = t(_Book);

export const AlertTriangle = t(_TriangleAlert);
export const ArrowLeftRightIcon = t(_ArrowLeftRight);
export const ArrowRight = t(_ArrowRight);
export const BadgeCheckIcon = t(_BadgeCheck);
export const BellIcon = t(_Bell);
export const CheckIcon = t(_Check);
export const ChevronDownIcon = t(_ChevronDown);
export const ChevronsUpDownIcon = t(_ChevronsUpDown);
export const CircleNotchIcon = t(_LoaderCircle);
export const ClockIcon = t(_Clock);
export const Component = t(_Component);
export const CreditCardIcon = t(_CreditCard);
export const DownloadIcon = t(_Download);
export const EnvelopeIcon = t(_Mail);
export const FlameIcon = t(_Flame);
export const GearIcon = t(_Cog);
export const HeartIcon = t(_Heart);
export const Layers = t(_Layers);
export const LogOutIcon = t(_LogOut);
export const MapPinIcon = t(_MapPin);
export const MousePointerClickIcon = t(_MousePointerClick);
export const Palette = t(_Palette);
export const PencilIcon = t(_Pencil);
export const SquaresFourIcon = t(_LayoutGrid);
export const StarIcon = t(_Star);
export const Trash2Icon = t(_Trash2);
export const UtensilsIcon = t(_Utensils);

export const CloseIcon = t(_X);
export const SidebarIcon = t(_PanelLeft);

// app-facing icons
export const ArrowLeft = t(_ArrowLeft);
export const BookOpenIcon = t(_BookOpen);
export const ChevronLeftIcon = t(_ChevronLeft);
export const ChevronRightIcon = t(_ChevronRight);
export const CreateStoryIcon = t(_CreateStory);
export const RocketIcon = t(_Rocket);
export const SendIcon = t(_Send);
export const SparklesIcon = t(_Sparkles);
export const StoryIcon = t(_Story);
