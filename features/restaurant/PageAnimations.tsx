"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PageAnimations() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const ease = "power3.out";

      // --- Hero entrance ---
      const hero = document.querySelector("#top");
      if (hero) {
        const heroChildren = [
          hero.querySelector("p.tracking-\\[0\\.22em\\]"),
          hero.querySelector("h1"),
          hero.querySelector("h1 + p"),
          hero.querySelector("h1 ~ div"),
          hero.querySelector("h1 ~ ul"),
        ].filter(Boolean);

        gsap.from(heroChildren, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease,
          delay: 0.1,
          clearProps: "transform,opacity",
        });

        const heroImg = hero.querySelector("img");
        if (heroImg) {
          // opacity-only fade — the slow zoom-out is handled by the
          // .que-hero-pullback CSS keyframe on each slide's image
          gsap.fromTo(
            heroImg,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 1.4,
              ease: "power4.out",
              delay: 0.15,
              clearProps: "opacity",
            }
          );
        }
      }

      // --- Section headers (eyebrow + h2 + intro paragraph) ---
      gsap.utils.toArray<HTMLElement>("section").forEach((section) => {
        if (section.id === "top") return;
        const header = section.querySelector(":scope > div > .text-center");
        if (!header) return;
        const parts = header.children;
        if (!parts.length) return;
        gsap.set(parts, { opacity: 0, y: 40 });
        gsap.to(parts, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease,
          scrollTrigger: {
            trigger: header,
            start: "top 82%",
            once: true,
          },
        });
      });

      // --- MenuCategories cards ---
      const menuCards = document.querySelectorAll("[data-menu-card]");
      if (menuCards.length) {
        const trigger = {
          trigger: menuCards[0],
          start: "top 85%",
          once: true,
        };

        gsap.set(menuCards, { opacity: 0, y: 64 });
        gsap.to(menuCards, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.14,
          ease,
          scrollTrigger: trigger,
          clearProps: "transform,opacity",
        });

        // photos reveal slightly zoomed and settle — quiet depth cue
        const menuImages = document.querySelectorAll("[data-menu-card] img");
        if (menuImages.length) {
          gsap.set(menuImages, { scale: 1.08 });
          gsap.to(menuImages, {
            scale: 1,
            duration: 1.4,
            stagger: 0.14,
            ease: "power2.out",
            scrollTrigger: trigger,
            clearProps: "transform",
          });
        }
      }

      // --- Full menu items ---
      const menuList = document.querySelectorAll("#menu ul > li");
      if (menuList.length) {
        gsap.set(menuList, { opacity: 0, y: 30 });
        gsap.to(menuList, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease,
          scrollTrigger: {
            trigger: menuList[0].parentElement,
            start: "top 82%",
            once: true,
          },
        });
      }

      // --- Promo banner ---
      const promo = document.querySelector(".bg-pine.rounded-\\[3rem\\]");
      if (promo) {
        const promoImg = promo.querySelector("img");
        const promoText = promo.querySelector(":scope > div > div:last-child");
        if (promoImg) {
          gsap.set(promoImg, { scale: 1.15, opacity: 0 });
          gsap.to(promoImg, {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease,
            scrollTrigger: {
              trigger: promo,
              start: "top 80%",
              once: true,
            },
          });
        }
        if (promoText) {
          const bits = promoText.children;
          gsap.set(bits, { opacity: 0, x: 40 });
          gsap.to(bits, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease,
            scrollTrigger: {
              trigger: promo,
              start: "top 80%",
              once: true,
            },
          });
        }
      }

      // --- FAQ cards ---
      const faqCards = document.querySelectorAll("#faqs .grid > div");
      if (faqCards.length) {
        gsap.set(faqCards, { opacity: 0, y: 40 });
        gsap.to(faqCards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease,
          scrollTrigger: {
            trigger: faqCards[0].parentElement,
            start: "top 85%",
            once: true,
          },
        });
      }

      // --- Footer ---
      const footer = document.querySelector("#contact > div.relative");
      if (footer) {
        const kids = footer.children;
        gsap.set(kids, { opacity: 0, y: 30 });
        gsap.to(kids, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease,
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            once: true,
          },
        });
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return null;
}
