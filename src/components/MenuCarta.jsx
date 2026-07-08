"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { menuCategories } from "@/data/menu";

const CATEGORY_ORDER = ["carnes", "pollo", "mariscos", "desayunos", "bebidas"];

// Tab colors are wool-dye tones pulled from the huipil band woven above.
const catMeta = {
  carnes: { short: "Carnes", color: "#8F2B10", hover: "rgba(143,43,16,0.09)" },
  pollo: { short: "Pollo", color: "#A57200", hover: "rgba(165,114,0,0.10)" },
  mariscos: { short: "Mariscos", color: "#1A3060", hover: "rgba(26,48,96,0.09)" },
  desayunos: { short: "Desayunos", color: "#2E6B2E", hover: "rgba(46,107,46,0.09)" },
  bebidas: { short: "Bebidas", color: "#5C4028", hover: "rgba(92,64,40,0.10)" },
};

function formatPrice(item) {
  if (item.priceLabel) return item.priceLabel;
  return `$${item.price.toFixed(2)}`;
}

const HuipilBorder = ({ patternId, radius }) => (
  <svg
    width="100%"
    height="36"
    style={{ display: "block", borderRadius: radius, flex: "none" }}
  >
    <defs>
      <pattern
        id={patternId}
        x="0"
        y="0"
        width="60"
        height="36"
        patternUnits="userSpaceOnUse"
      >
        <rect width="60" height="36" fill="#1A3060" />
        <rect width="60" height="4" fill="#D4A017" />
        <rect y="32" width="60" height="4" fill="#D4A017" />
        <polygon points="30,7 50,18 30,29 10,18" fill="#C8420A" />
        <polygon
          points="30,11 46,18 30,25 14,18"
          fill="none"
          stroke="#D4A017"
          strokeWidth="1.4"
        />
        <polygon points="0,4 8,4 0,12" fill="#2E7D32" />
        <polygon points="60,4 52,4 60,12" fill="#2E7D32" />
        <polygon points="0,32 8,32 0,24" fill="#2E7D32" />
        <polygon points="60,32 52,32 60,24" fill="#2E7D32" />
        <circle cx="30" cy="5" r="1.8" fill="#D4A017" />
        <circle cx="30" cy="31" r="1.8" fill="#D4A017" />
      </pattern>
    </defs>
    <rect width="100%" height="36" fill={`url(#${patternId})`} />
  </svg>
);

export default function MenuCarta() {
  const categoriesById = useMemo(() => {
    const map = {};
    menuCategories.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, []);

  const [activeCategory, setActiveCategory] = useState("carnes");
  const [selected, setSelected] = useState(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!panelVisible) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPanelVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelVisible]);

  const meta = catMeta[activeCategory];
  const activeCat = categoriesById[activeCategory];
  const activeItems = activeCat?.items ?? [];
  const twoColumns = activeItems.length > 9;

  const selectItem = (item) => {
    setSelected(item);
    setPanelVisible(true);
  };

  const switchCategory = (id) => {
    setActiveCategory(id);
    setPanelVisible(false);
  };

  const addToCart = () => {
    if (!selected) return;
    setCart((c) => [...c, selected]);
  };

  const selectedInitial = selected ? selected.name.charAt(0).toUpperCase() : "?";
  const selectedCatLabel = selected
    ? catMeta[selected._catId]?.short ?? ""
    : "";
  const stampColor = selected
    ? catMeta[selected._catId]?.color ?? "#8F2B10"
    : "#8F2B10";

  return (
    <section id="menu" className="quetz-menu-outer">
      <div className="quetz-menu-content">
        {/* the page underneath — next week's carta */}
        <div className="quetz-under" aria-hidden="true" />

        <div className="quetz-menu-paper">
          <HuipilBorder patternId="quetz-huipil-top" radius="3px 3px 0 0" />

          <div
            className="quetz-menu-inner"
            style={{ "--cat": meta.color, "--cat-hover": meta.hover }}
          >
            {/* Header */}
            <header className="quetz-head">
              <p className="quetz-eyebrow">Auténtica Cocina</p>
              <h1 className="quetz-menu-h1">El Quetzalito</h1>
              <p className="quetz-subtitle">Restaurante Guatemalteco</p>
              <div className="quetz-divider" aria-hidden="true">
                <span className="qline qline-l" />
                <i className="qd qd-red" />
                <i className="qd qd-gold qd-sm" />
                <i className="qd qd-red" />
                <span className="qline qline-r" />
              </div>
              <p className="quetz-hint">Click any dish to see it plated</p>
            </header>

            {/* Category tabs — ledger on desktop, chip row on mobile */}
            <nav className="quetz-ledger" aria-label="Menu categories">
              {CATEGORY_ORDER.map((id) => {
                const isActive = activeCategory === id;
                const c = catMeta[id];
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => switchCategory(id)}
                    className={`quetz-tab${isActive ? " quetz-tab-active" : ""}`}
                    style={{ background: isActive ? c.color : c.color + "C9" }}
                    aria-pressed={isActive}
                  >
                    {c.short}
                  </button>
                );
              })}
            </nav>

            {/* Active category */}
            <div className="quetz-cat" key={activeCategory}>
              <h2 className="quetz-cat-title" style={{ color: meta.color }}>
                ~ {activeCat.label} ~
              </h2>
              {activeCat.note && (
                <p className="quetz-cat-note">{activeCat.note}</p>
              )}

              <ul
                className={`quetz-items${twoColumns ? " quetz-items-cols" : ""}`}
              >
                {activeItems.map((item, i) => {
                  const withCat = { ...item, _catId: activeCategory };
                  return (
                    <li key={`${activeCategory}-${item.name}-${i}`}>
                      <button
                        type="button"
                        className="quetz-row"
                        onClick={() => selectItem(withCat)}
                      >
                        <span className="quetz-item-name">{item.name}</span>
                        {item.signature && (
                          <>
                            <i className="qmark qmark-house" aria-hidden="true" />
                            <span className="sr-only">
                              Especialidad de la casa
                            </span>
                          </>
                        )}
                        {item.veg && (
                          <>
                            <i className="qmark qmark-veg" aria-hidden="true" />
                            <span className="sr-only">Vegetariano</span>
                          </>
                        )}
                        <span className="quetz-leader" aria-hidden="true" />
                        <span
                          className={`quetz-price${
                            item.priceLabel ? " quetz-price-multi" : ""
                          }`}
                        >
                          {formatPrice(item)}
                        </span>
                      </button>
                      {item.description && (
                        <p className="quetz-item-desc">{item.description}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Footer */}
            <footer className="quetz-foot">
              <p className="quetz-legend">
                <span>
                  <i className="qmark qmark-house" aria-hidden="true" />{" "}
                  Especialidad de la casa
                </span>
                <span>
                  <i className="qmark qmark-veg" aria-hidden="true" />{" "}
                  Vegetariano
                </span>
              </p>
              <p className="quetz-provecho">Buen Provecho</p>
            </footer>
          </div>

          <HuipilBorder patternId="quetz-huipil-bot" radius="0 0 3px 3px" />
        </div>
      </div>

      {/* Cart badge */}
      <div
        className="quetz-cart"
        style={{ top: isMobile ? 76 : 108 }}
        aria-live="polite"
        aria-label={`Cart: ${cart.length} item${cart.length === 1 ? "" : "s"}`}
      >
        <span style={{ fontSize: 22 }}>🛒</span>
        {cart.length > 0 && <span className="quetz-cart-count">{cart.length}</span>}
      </div>

      {/* Detail panel (slide-in) — la mesa */}
      <div
        className={`quetz-panel${panelVisible ? " quetz-panel-in" : ""}`}
        style={
          isMobile
            ? {
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                height: "78vh",
                width: "100%",
                background:
                  "linear-gradient(175deg, #F7EDDA 0%, #EEE0C4 40%, #F2E8CE 70%, #EAD9BC 100%)",
                transform: panelVisible ? "translateY(0)" : "translateY(100%)",
                transition: `transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), visibility 0s linear ${panelVisible ? "0s" : "0.45s"}`,
                visibility: panelVisible ? "visible" : "hidden",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                boxShadow: panelVisible
                  ? "0 -12px 40px rgba(44,26,14,0.32)"
                  : "none",
                overflow: "hidden",
                borderRadius: "16px 16px 0 0",
              }
            : {
                position: "fixed",
                right: 0,
                top: 96,
                height: "calc(100vh - 96px)",
                width: "min(1320px, 94vw)",
                background:
                  "linear-gradient(175deg, #F7EDDA 0%, #EEE0C4 40%, #F2E8CE 70%, #EAD9BC 100%)",
                transformOrigin: "right center",
                transform: panelVisible
                  ? "perspective(1200px) rotateY(0deg)"
                  : "perspective(1200px) rotateY(90deg)",
                transition: `transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94), visibility 0s linear ${panelVisible ? "0s" : "0.55s"}`,
                visibility: panelVisible ? "visible" : "hidden",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                boxShadow: panelVisible
                  ? "-18px 0 60px rgba(44,26,14,0.3)"
                  : "none",
                overflow: "hidden",
              }
        }
        aria-hidden={!panelVisible}
      >
        <HuipilBorder patternId="quetz-huipil-panel-top" radius="0" />

        <button
          type="button"
          className="quetz-panel-close"
          onClick={() => setPanelVisible(false)}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="quetz-panel-sheet">
          <span className="quetz-stamp anim a1" style={{ color: stampColor }}>
            {selectedCatLabel}
          </span>

          {/* The place setting: plate on a woven petate mat */}
          <div className="quetz-setting anim a2">
            <div className="quetz-petate" aria-hidden="true" />
            {selected?.image ? (
              <div className="quetz-plate-photo">
                <Image
                  src={selected.image}
                  alt={selected.name}
                  fill
                  sizes="800px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : (
              <div className="quetz-plate">
                <div className="quetz-plate-well">
                  <div className="quetz-plate-ph">
                    <span className="quetz-plate-initial">
                      {selectedInitial}
                    </span>
                    <span className="quetz-plate-caption">
                      Foto en camino · photo coming soon
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <h2 className="quetz-dish-name anim a3">{selected?.name ?? ""}</h2>
          <div className="quetz-dish-divider anim a3" aria-hidden="true">
            <span className="qline qline-l" />
            <i className="qd qd-red" />
            <i className="qd qd-gold qd-sm" />
            <i className="qd qd-red" />
            <span className="qline qline-r" />
          </div>
          <div className="quetz-dish-price anim a3">
            {selected ? formatPrice(selected) : ""}
          </div>
          <p className="quetz-dish-desc anim a4">
            {selected?.description ?? ""}
          </p>
          <button
            type="button"
            className="quetz-add-btn anim a4"
            onClick={addToCart}
          >
            + Add to Cart
          </button>
        </div>

        <HuipilBorder patternId="quetz-huipil-panel-bot" radius="0" />
      </div>

      <style jsx>{`
        /* ── The table ─────────────────────────────────────── */
        .quetz-menu-outer {
          min-height: 100vh;
          padding: 128px 24px 88px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow-x: clip;
          background:
            radial-gradient(
              900px 460px at 50% -80px,
              rgba(212, 160, 23, 0.1),
              transparent 70%
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0 148px,
              rgba(0, 0, 0, 0.24) 148px 151px
            ),
            linear-gradient(180deg, #2c1b10 0%, #201209 55%, #170d07 100%);
        }
        .quetz-menu-content {
          position: relative;
          width: 100%;
          max-width: 900px;
        }
        .quetz-under {
          position: absolute;
          inset: 0;
          border-radius: 3px;
          background: linear-gradient(180deg, #efe2c6, #e0cda6);
          transform: rotate(0.9deg) translate(14px, 10px);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
        }

        /* ── The carta ─────────────────────────────────────── */
        .quetz-menu-paper {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          border-radius: 3px;
          transform: rotate(-0.7deg);
          background: linear-gradient(
            175deg,
            #f7edda 0%,
            #eee0c4 40%,
            #f2e8ce 70%,
            #ead9bc 100%
          );
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.6),
            0 10px 26px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }
        .quetz-menu-inner {
          flex: 1;
          min-height: 780px;
          display: flex;
          flex-direction: column;
          padding: 56px 72px 48px;
        }

        /* ── Header ────────────────────────────────────────── */
        .quetz-head {
          text-align: center;
          margin-bottom: 26px;
        }
        .quetz-eyebrow {
          font-family: var(--font-menu-body);
          font-size: 12px;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: #9b7a50;
          margin: 0 0 8px;
        }
        .quetz-menu-h1 {
          font-family: var(--font-serif);
          font-size: 54px;
          font-weight: 700;
          color: #2c1a0e;
          letter-spacing: 1px;
          line-height: 1;
          margin: 0;
        }
        .quetz-subtitle {
          font-family: var(--font-menu-body);
          font-style: italic;
          font-size: 17px;
          letter-spacing: 2px;
          color: #7b6347;
          margin: 8px 0 0;
        }
        .quetz-divider {
          display: flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          margin: 14px auto 0;
        }
        .quetz-hint {
          font-family: var(--font-menu-body);
          font-style: italic;
          font-size: 13px;
          letter-spacing: 1px;
          color: #b8a07b;
          margin: 10px 0 0;
        }

        /* ── Ledger tabs ───────────────────────────────────── */
        .quetz-ledger {
          position: absolute;
          right: -54px;
          top: 132px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 5;
        }
        .quetz-tab {
          width: 56px;
          height: 94px;
          padding: 0;
          color: #fefaf3;
          border: none;
          border-left: 2px solid rgba(255, 255, 255, 0.18);
          border-radius: 0 7px 7px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 14px;
          letter-spacing: 1.5px;
          box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.35);
          transition:
            transform 0.2s,
            box-shadow 0.2s;
          user-select: none;
        }
        .quetz-tab:hover {
          transform: translateX(3px);
        }
        .quetz-tab-active {
          transform: translateX(7px);
          border-left: 3px solid rgba(255, 255, 255, 0.4);
          box-shadow: 5px 4px 14px rgba(0, 0, 0, 0.5);
        }
        .quetz-tab-active:hover {
          transform: translateX(7px);
        }

        /* ── Category block ────────────────────────────────── */
        .quetz-cat {
          flex: 1;
          display: flex;
          flex-direction: column;
          animation: quetzCatIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        @keyframes quetzCatIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .quetz-cat-title {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 29px;
          font-weight: 500;
          text-align: center;
          letter-spacing: 1px;
          margin: 0 0 6px;
        }
        .quetz-cat-note {
          font-family: var(--font-menu-body);
          font-style: italic;
          font-size: 14px;
          text-align: center;
          color: #b8a07b;
          margin: 0 0 20px;
        }

        /* ── Items ─────────────────────────────────────────── */
        .quetz-items {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .quetz-items > li {
          break-inside: avoid;
          margin-bottom: 10px;
        }
        .quetz-items-cols {
          columns: 2;
          column-gap: 56px;
        }
        .quetz-row {
          display: flex;
          width: 100%;
          align-items: baseline;
          padding: 8px 10px 3px;
          border-radius: 3px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          font: inherit;
          transition:
            background 0.2s,
            transform 0.15s;
        }
        .quetz-row:hover {
          background: var(--cat-hover);
          transform: translateX(4px);
        }
        .quetz-row:hover .quetz-item-name {
          color: var(--cat);
        }
        .quetz-item-name {
          font-family: var(--font-menu-body);
          font-size: 21px;
          color: #2c1a0e;
          flex: none;
          text-wrap: pretty;
          transition: color 0.2s;
        }
        .quetz-items-cols .quetz-item-name {
          font-size: 19px;
        }
        .quetz-leader {
          flex: 1;
          border-bottom: 1px dotted #c4a87a;
          margin: 0 12px 4px;
          min-width: 20px;
        }
        .quetz-price {
          font-family: var(--font-menu-body);
          font-size: 19px;
          font-weight: 600;
          color: #2c1a0e;
          flex: none;
          white-space: nowrap;
        }
        .quetz-items-cols .quetz-price {
          font-size: 17px;
        }
        .quetz-price-multi {
          font-size: 15px;
          font-weight: 600;
        }
        .quetz-item-desc {
          font-family: var(--font-menu-body);
          font-style: italic;
          font-size: 14.5px;
          line-height: 1.55;
          color: #9b7a50;
          margin: 0;
          padding: 0 10px;
          text-wrap: pretty;
        }
        .qmark {
          display: inline-block;
          width: 7px;
          height: 7px;
          transform: rotate(45deg);
          margin: 0 0 1px 9px;
          flex: none;
        }
        .qmark-house {
          background: #c08a1d;
        }
        .qmark-veg {
          background: #3e7c3e;
        }

        /* ── Footer ────────────────────────────────────────── */
        .quetz-foot {
          text-align: center;
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid #d4c09a;
        }
        .quetz-legend {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px 26px;
          font-family: var(--font-menu-body);
          font-style: italic;
          font-size: 13px;
          color: #9b7a50;
          margin: 16px 0 0;
        }
        .quetz-legend .qmark {
          margin: 0 4px 1px 0;
        }
        .quetz-provecho {
          font-family: var(--font-menu-body);
          font-style: italic;
          font-size: 14px;
          letter-spacing: 1px;
          color: #b8a07b;
          margin: 10px 0 0;
        }

        /* ── Cart badge ────────────────────────────────────── */
        .quetz-cart {
          position: fixed;
          right: 24px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #f3e7cf;
          border: 1px solid rgba(212, 160, 23, 0.55);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 999;
        }
        .quetz-cart-count {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #c8420a;
          color: white;
          font-family: var(--font-menu-body);
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Detail panel: la mesa ─────────────────────────── */
        .quetz-panel-close {
          position: absolute;
          top: 52px;
          right: 24px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(252, 249, 242, 0.92);
          border: 1px solid rgba(44, 26, 14, 0.22);
          color: rgba(44, 26, 14, 0.65);
          font-size: 15px;
          font-family: sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          z-index: 3;
          padding: 0;
        }
        .quetz-panel-close:hover {
          background: #f3e9d8;
          transform: rotate(90deg);
        }
        .quetz-panel-sheet {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 36px 48px;
          overflow-y: auto;
        }
        .quetz-setting {
          --plate: min(340px, 34vh);
          position: relative;
          width: calc(var(--plate) * 1.3);
          height: calc(var(--plate) * 1.3);
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 26px 0 34px;
        }
        .quetz-petate {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            repeating-conic-gradient(
              rgba(139, 90, 43, 0.1) 0deg 5deg,
              rgba(255, 255, 255, 0.05) 5deg 10deg
            ),
            repeating-radial-gradient(
              circle at 50% 50%,
              #dcc397 0 7px,
              #cdb081 7px 14px
            );
          box-shadow:
            inset 0 0 0 2px rgba(139, 90, 43, 0.3),
            0 18px 44px rgba(44, 26, 14, 0.26);
        }
        .quetz-plate-photo {
          position: relative;
          width: calc(var(--plate) * 1.12);
          height: calc(var(--plate) * 1.12);
          filter: drop-shadow(0 18px 30px rgba(44, 26, 14, 0.38));
        }
        .quetz-plate {
          position: relative;
          width: var(--plate);
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(
            circle at 36% 30%,
            #ffffff 0%,
            #f6f0e4 62%,
            #e9dfcc 100%
          );
          box-shadow:
            0 14px 34px rgba(44, 26, 14, 0.28),
            0 4px 10px rgba(44, 26, 14, 0.15),
            inset 0 0 0 1px rgba(44, 26, 14, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quetz-plate::after {
          content: "";
          position: absolute;
          inset: 7%;
          border-radius: 50%;
          border: 1px solid rgba(165, 114, 0, 0.38);
          pointer-events: none;
        }
        .quetz-plate-well {
          width: 76%;
          height: 76%;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 42%, #fbf7ef, #f0e8d8);
          box-shadow:
            inset 0 3px 12px rgba(44, 26, 14, 0.12),
            inset 0 0 0 1px rgba(44, 26, 14, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quetz-plate-ph {
          width: 72%;
          height: 72%;
          border-radius: 50%;
          border: 1px dashed rgba(44, 26, 14, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .quetz-plate-initial {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 58px;
          line-height: 1;
          color: rgba(44, 26, 14, 0.2);
        }
        .quetz-plate-caption {
          font-family: var(--font-menu-body);
          font-style: italic;
          font-size: 11px;
          letter-spacing: 0.5px;
          color: rgba(44, 26, 14, 0.32);
          padding: 0 18px;
        }
        .quetz-stamp {
          align-self: center;
          margin-top: auto;
          font-family: var(--font-menu-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          border: 1.5px solid currentColor;
          border-radius: 2px;
          padding: 6px 14px 5px;
          transform: rotate(-2.5deg);
          opacity: 0.85;
        }
        .quetz-dish-name {
          font-family: var(--font-serif);
          font-size: 52px;
          font-weight: 700;
          line-height: 1.12;
          letter-spacing: 0.5px;
          color: #2c1a0e;
          margin: 0 0 14px;
          max-width: 20ch;
          text-wrap: pretty;
        }
        .quetz-dish-price {
          font-family: var(--font-menu-body);
          font-size: 30px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #8f5e00;
          margin: 0 0 22px;
        }
        .qd {
          width: 7px;
          height: 7px;
          transform: rotate(45deg);
          flex: none;
        }
        .qd-red {
          background: #c8420a;
        }
        .qd-gold {
          background: #d4a017;
        }
        .qd-sm {
          width: 5px;
          height: 5px;
        }
        .quetz-dish-desc {
          font-family: var(--font-menu-body);
          font-style: italic;
          font-size: 17px;
          line-height: 1.75;
          color: rgba(44, 26, 14, 0.72);
          max-width: 52ch;
          margin: 0;
          text-wrap: pretty;
        }
        .quetz-dish-divider {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 20px;
        }
        .qline {
          height: 1px;
          width: 60px;
        }
        .qline-l {
          background: linear-gradient(90deg, transparent, #c8a96a);
        }
        .qline-r {
          background: linear-gradient(90deg, #c8a96a, transparent);
        }
        .quetz-add-btn {
          margin: 34px 0 auto;
          align-self: center;
          min-width: 320px;
          padding: 15px 40px;
          background: #c8420a;
          color: #fefaf3;
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 17px;
          letter-spacing: 1px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(200, 66, 10, 0.35);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .quetz-add-btn:hover {
          background: #a83508;
          transform: translateY(-1px);
          box-shadow: 0 9px 24px rgba(200, 66, 10, 0.42);
        }

        /* Staggered entrance when the panel opens */
        .quetz-panel .anim {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity 0.45s ease,
            transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .quetz-panel .a1 {
          transition-delay: 0.12s;
        }
        .quetz-panel .a2 {
          transition-delay: 0.22s;
        }
        .quetz-panel .a3 {
          transition-delay: 0.3s;
        }
        .quetz-panel .a4 {
          transition-delay: 0.38s;
        }
        .quetz-panel-in .anim {
          opacity: 1;
          transform: none;
        }

        .quetz-panel button:focus-visible,
        .quetz-ledger button:focus-visible,
        .quetz-menu-inner button:focus-visible {
          outline: 2px solid #c8420a;
          outline-offset: 3px;
        }
        .quetz-tab:focus-visible {
          outline-color: #f3e7cf;
        }

        @media (max-width: 1100px) {
          /* reserve room on the right so the ledger tabs never spill offscreen */
          .quetz-menu-content {
            max-width: 860px;
            margin-right: 46px;
          }
          .quetz-ledger {
            right: -46px;
          }
          .quetz-tab {
            width: 48px;
          }
        }

        @media (max-width: 768px) {
          .quetz-menu-outer {
            padding: 104px 14px 56px;
          }
          .quetz-menu-content {
            max-width: 100%;
            margin-right: 0;
          }
          .quetz-menu-paper {
            transform: rotate(-0.4deg);
          }
          .quetz-under {
            transform: rotate(0.5deg) translate(8px, 7px);
          }
          .quetz-menu-inner {
            min-height: 0;
            padding: 30px 20px 34px;
          }
          .quetz-menu-h1 {
            font-size: 36px;
          }
          .quetz-head {
            margin-bottom: 18px;
          }
          .quetz-ledger {
            position: static;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            margin: 0 0 22px;
          }
          .quetz-tab {
            writing-mode: horizontal-tb;
            width: auto;
            height: auto;
            padding: 8px 14px;
            border-left: none;
            border-radius: 6px;
            font-size: 13px;
          }
          .quetz-tab:hover,
          .quetz-tab-active,
          .quetz-tab-active:hover {
            transform: none;
          }
          .quetz-tab-active {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
          }
          .quetz-items-cols {
            columns: 1;
          }
          .quetz-items-cols .quetz-item-name {
            font-size: 21px;
          }
          .quetz-items-cols .quetz-price {
            font-size: 19px;
          }
          .quetz-panel-sheet {
            padding: 22px 22px 26px;
          }
          .quetz-setting {
            --plate: min(180px, 24vh);
            margin: 16px 0 22px;
          }
          .quetz-plate-initial {
            font-size: 38px;
          }
          .quetz-plate-caption {
            font-size: 9px;
          }
          .quetz-dish-name {
            font-size: 30px;
          }
          .quetz-dish-price {
            font-size: 22px;
            margin-bottom: 16px;
          }
          .quetz-dish-desc {
            font-size: 15px;
          }
          .quetz-dish-divider {
            margin-bottom: 16px;
          }
          .quetz-add-btn {
            align-self: stretch;
            min-width: 0;
            margin: 24px 0 auto;
          }
          .quetz-panel-close {
            top: 48px;
            right: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .quetz-panel,
          .quetz-panel .anim,
          .quetz-add-btn,
          .quetz-panel-close,
          .quetz-tab,
          .quetz-row {
            transition: none !important;
          }
          .quetz-cat {
            animation: none;
          }
          .quetz-panel .anim {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
