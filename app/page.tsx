"use client";

import { useState, useRef, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import Video from 'next-video';
import videoLoop from '/videos/bg.mp4';
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
