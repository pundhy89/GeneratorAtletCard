import { forwardRef } from "react";

export interface Skill {
  label: string;
  value: number;
}
export interface Stat {
  label: string;
  value: string;
  icon: string;
}

export interface CardData {
  logo: string | null;
  teamName: string;
  tagline: string;
  photo: string | null;
  playerName: string;
  age: string;
  quote: string;
  stats: Stat[];
  highlightPhoto: string | null;
  highlights: string[];
  skills: Skill[];
  footerText: string;
  hashtag: string;
  actionPhoto: string | null;
}

const IDCard = forwardRef<HTMLDivElement, { data: CardData }>(({ data }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: 1024,
        height: 1536,
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(120% 80% at 20% 20%, oklch(0.28 0.15 300 / 0.7), transparent 60%), radial-gradient(90% 70% at 80% 80%, oklch(0.35 0.18 55 / 0.35), transparent 60%), #0a0410",
        fontFamily: "Inter, sans-serif",
        color: "#fff",
      }}
    >
      {/* Left: full-bleed action photo */}
      <div style={{ position: "absolute", inset: 0, width: 560, height: "100%" }}>
        {data.actionPhoto ? (
          <img
            src={data.actionPhoto}
            alt=""
            crossOrigin="anonymous"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "drop-shadow(0 0 40px rgba(180,80,255,0.4))",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(180deg,#1a0830,#0a0410)",
              color: "#6b4a8a",
              fontSize: 22,
              textAlign: "center",
              padding: 40,
            }}
          >
            Upload foto aksi
            <br />
            (full body)
          </div>
        )}
        {/* fade to right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 55%, #0a0410 100%)",
          }}
        />
      </div>

      {/* Stage lights top-left */}
      <div style={{ position: "absolute", top: 30, left: 20, display: "flex", gap: 14 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 99,
              background: "#fff",
              boxShadow: "0 0 20px #fff, 0 0 40px #c58bff",
            }}
          />
        ))}
      </div>

      {/* Right column content */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          bottom: 40,
          width: 500,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          justifyContent: "center",
          transform: "translateY(-16px)",
        }}
      >
        {/* Logo header */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
            position: "relative",
            zIndex: 2,
          }}
        >
          {data.logo ? (
            <img
              src={data.logo}
              alt="logo"
              crossOrigin="anonymous"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                mixBlendMode: "screen",
                filter: "drop-shadow(0 0 20px rgba(197,139,255,0.6))",
              }}
            />
          ) : (
            <div
              style={{
                padding: "30px 26px",
                border: "3px solid #c58bff",
                borderRadius: 20,
                textAlign: "center",
                boxShadow: "0 0 30px rgba(197,139,255,0.5), inset 0 0 20px rgba(197,139,255,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "Bebas Neue",
                  fontSize: 48,
                  letterSpacing: 2,
                  color: "#ff9640",
                  textShadow: "0 0 15px rgba(255,150,64,0.7)",
                }}
              >
                LOGO
              </div>
              <div
                style={{ fontFamily: "Bebas Neue", fontSize: 22, letterSpacing: 3, color: "#fff" }}
              >
                TEAM
              </div>
            </div>
          )}
        </div>

        {/* Team title panel */}
        <div style={{ marginTop: -40 }}>
          <Panel>
            <div style={{ padding: "28px 30px 24px" }}>
              <div
                style={{
                  fontFamily: "Bebas Neue",
                  fontSize: 68,
                  lineHeight: 0.95,
                  letterSpacing: 1,
                  color: "#f2f2f2",
                  textShadow: "0 2px 0 rgba(0,0,0,0.4)",
                }}
              >
                {data.teamName || "TEAM NAME"}
              </div>
              <div
                style={{
                  marginTop: 12,
                  height: 2,
                  background: "linear-gradient(90deg, #ff9640, transparent)",
                }}
              />
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "Oswald",
                  fontWeight: 600,
                  letterSpacing: 3,
                  fontSize: 18,
                  color: "#ff9640",
                  textShadow: "0 0 10px rgba(255,150,64,0.5)",
                }}
              >
                {data.tagline || "TAGLINE HERE"}
              </div>

              {/* Player row */}
              <div style={{ marginTop: 22, display: "flex", gap: 18, alignItems: "center" }}>
                <div
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 99,
                    padding: 3,
                    background: "linear-gradient(135deg,#c58bff,#ff9640)",
                    boxShadow: "0 0 20px rgba(197,139,255,0.6)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 99,
                      overflow: "hidden",
                      background: "#1a0830",
                    }}
                  >
                    {data.photo ? (
                      <img
                        src={data.photo}
                        alt=""
                        crossOrigin="anonymous"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          color: "#c58bff",
                        }}
                      >
                        Foto
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "Bebas Neue",
                      fontSize: 40,
                      lineHeight: 1,
                      letterSpacing: 1,
                    }}
                  >
                    {(data.playerName || "NAMA PEMAIN").split(" ")[0]}
                  </div>
                  <div
                    style={{
                      fontFamily: "Bebas Neue",
                      fontSize: 22,
                      letterSpacing: 1.5,
                      color: "#e6d5ff",
                    }}
                  >
                    {(data.playerName || "NAMA PEMAIN").split(" ").slice(1).join(" ")}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      fontFamily: "Oswald",
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        padding: "3px 10px",
                        border: "2px solid #ff9640",
                        borderRadius: 6,
                        color: "#ff9640",
                        fontSize: 13,
                        letterSpacing: 1,
                      }}
                    >
                      AGE
                    </span>
                    <span style={{ color: "#ff9640", fontSize: 18, letterSpacing: 1 }}>
                      {data.age || "0 TAHUN"}
                    </span>
                  </div>
                </div>
              </div>

              {data.quote && (
                <div
                  style={{
                    marginTop: 16,
                    fontStyle: "italic",
                    color: "#e6d5ff",
                    fontSize: 16,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: "#ff9640", fontSize: 22, marginRight: 4 }}>“</span>
                  {data.quote}
                  <span style={{ color: "#ff9640", fontSize: 22, marginLeft: 4 }}>”</span>
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* Player Stats */}
        <div>
          <SectionTitle>PLAYER STATS</SectionTitle>
          <Panel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                padding: "18px 12px",
                gap: 4,
              }}
            >
              {data.stats.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 34,
                      color: "#ff9640",
                      filter: "drop-shadow(0 0 8px rgba(255,150,64,0.6))",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "Oswald",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: 2,
                      color: "#e6d5ff",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "Bebas Neue",
                      fontSize: 34,
                      letterSpacing: 1,
                      color: "#fff",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "Oswald",
                      fontSize: 10,
                      letterSpacing: 2,
                      color: "#a58bc8",
                    }}
                  >
                    SEASON
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Highlight */}
        <div>
          <SectionTitle>HIGHLIGHT</SectionTitle>
          <Panel>
            <div style={{ display: "flex", padding: 14, gap: 14 }}>
              <div
                style={{
                  position: "relative",
                  width: 240,
                  height: 140,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "#1a0830",
                  border: "1px solid #c58bff",
                }}
              >
                {data.highlightPhoto ? (
                  <img
                    src={data.highlightPhoto}
                    alt=""
                    crossOrigin="anonymous"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b4a8a",
                      fontSize: 12,
                    }}
                  >
                    Highlight
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 99,
                      background: "rgba(197,139,255,0.35)",
                      border: "2px solid #c58bff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "14px solid #fff",
                        borderTop: "9px solid transparent",
                        borderBottom: "9px solid transparent",
                        marginLeft: 4,
                      }}
                    />
                  </div>
                </div>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 6,
                  fontFamily: "Oswald",
                  fontWeight: 600,
                  letterSpacing: 2,
                  fontSize: 14,
                  color: "#ff9640",
                }}
              >
                {data.highlights.map((h, i) => (
                  <li key={i}>• {h.toUpperCase()}</li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>

        {/* Skills */}
        <div>
          <SectionTitle>SKILLS &amp; ATTRIBUTES</SectionTitle>
          <Panel>
            <div
              style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}
            >
              {data.skills.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: "#ff9640", fontSize: 16, width: 20 }}>●</div>
                  <div
                    style={{
                      fontFamily: "Oswald",
                      fontWeight: 600,
                      letterSpacing: 2,
                      fontSize: 13,
                      color: "#e6d5ff",
                      width: 130,
                    }}
                  >
                    {s.label.toUpperCase()}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 10,
                      background: "#1a0830",
                      border: "1px solid #4a2870",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(0, Math.min(100, s.value))}%`,
                        height: "100%",
                        background: "linear-gradient(90deg,#c58bff,#8f4dff)",
                        boxShadow: "0 0 10px rgba(197,139,255,0.7)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: "Bebas Neue",
                      fontSize: 22,
                      color: "#fff",
                      width: 40,
                      textAlign: "right",
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Footer */}
        <Panel>
          <div style={{ display: "flex", padding: 14, gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 60,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {data.logo ? (
                <img
                  src={data.logo}
                  alt=""
                  crossOrigin="anonymous"
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              ) : (
                <div style={{ fontSize: 30 }}>🐉</div>
              )}
            </div>
            <div
              style={{
                flex: 1,
                fontFamily: "Oswald",
                fontWeight: 600,
                letterSpacing: 1.5,
                fontSize: 13,
                color: "#e6d5ff",
                lineHeight: 1.35,
              }}
            >
              {(data.footerText || "ONE TEAM. ONE DREAM.").toUpperCase()}
            </div>
            <div
              style={{
                borderLeft: "1px solid #4a2870",
                paddingLeft: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 22, color: "#c58bff" }}>🏀</div>
              <div
                style={{
                  fontFamily: "Oswald",
                  fontWeight: 700,
                  letterSpacing: 2,
                  fontSize: 14,
                  color: "#c58bff",
                  lineHeight: 1.1,
                }}
              >
                {(data.hashtag || "#TAG").split(" ").map((w, i) => (
                  <div key={i}>{w.toUpperCase()}</div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
});

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: "2px solid #c58bff",
        background: "linear-gradient(180deg, rgba(30,10,50,0.85), rgba(15,5,30,0.9))",
        boxShadow: "0 0 20px rgba(197,139,255,0.4), inset 0 0 20px rgba(197,139,255,0.08)",
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Oswald",
        fontWeight: 700,
        letterSpacing: 3,
        fontSize: 16,
        color: "#c58bff",
        textShadow: "0 0 8px rgba(197,139,255,0.6)",
        marginBottom: 8,
        marginLeft: 4,
      }}
    >
      {children}
    </div>
  );
}

IDCard.displayName = "IDCard";
export default IDCard;
