import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0B1A14", green: "#A2FF00", cream: "#F4F1EC", gold: "#C2A14D",
  surface: "rgba(244,241,236,0.05)", border: "rgba(244,241,236,0.1)",
  muted: "rgba(244,241,236,0.35)", faint: "rgba(244,241,236,0.12)",
  red: "#e06060", redBg: "rgba(220,60,60,0.08)", redBorder: "rgba(220,60,60,0.2)",
};

const profiles = [
  { id: 1, name: "Jack Mercer", homeCourse: "Winged Foot GC", distance: "4 mi", wagerRange: "$50 – $200", vouches: 34, handicap: 6, tees: "Back", availability: "Weekends", gradient: "linear-gradient(160deg,#1a3a2a,#0d2418 50%,#0b1a14)", initials: "JM", games: ["Nassau","Skins"], vouchComments: [{ author: "Mike T.", text: "Legit 6. Pays same day. Great pace of play.", icons: [true,true,true] },{ author: "Dave R.", text: "Plays to his number every time. Stand-up guy.", icons: [true,true,true] }] },
  { id: 2, name: "Tom Hargrove", homeCourse: "Baltusrol GC", distance: "11 mi", wagerRange: "$25 – $100", vouches: 21, handicap: 12, tees: "Middle", availability: "Mornings", gradient: "linear-gradient(160deg,#1e3520,#0f2010 50%,#0b1a14)", initials: "TH", games: ["Match Play"], vouchComments: [{ author: "Ben S.", text: "Good guy. Honest about his handicap.", icons: [true,true,true] }] },
  { id: 3, name: "Dale Fountain", homeCourse: "Shinnecock Hills", distance: "23 mi", wagerRange: "$100 – $500", vouches: 58, handicap: 3, tees: "Championship", availability: "Flexible", gradient: "linear-gradient(160deg,#162e1c,#0e2214 50%,#0b1a14)", initials: "DF", games: ["Nassau","Match Play","Skins"], vouchComments: [{ author: "Pete M.", text: "Best 3 I've played with. Money is always there.", icons: [true,true,true] }] },
  { id: 4, name: "Ray Costello", homeCourse: "Pebble Beach GL", distance: "8 mi", wagerRange: "$20 – $75", vouches: 12, handicap: 18, tees: "Forward", availability: "Weekdays", gradient: "linear-gradient(160deg,#1a2e18,#101e0e 50%,#0b1a14)", initials: "RC", games: ["Stroke Play"], vouchComments: [{ author: "Jim B.", text: "Fun to play with. Honest 18.", icons: [true,true,true] }] },
];

const myProfile = { name: "Connor Walsh", homeCourse: "Bethpage Black", handicap: 9, tees: "Back", wagerMin: 50, wagerMax: 250, games: ["Nassau","Skins"], availability: ["Saturday","Sunday"], vouches: 27, gradient: "linear-gradient(160deg,#1a2e2a,#0d201c 50%,#0b1a14)", initials: "CW" };

const initialThreads = [
  { id: 1, profile: profiles[0], messages: [
    { id: 1, from: "them", text: "Hey Connor — looking forward to it. Bethpage work for you Saturday?", time: "9:41 AM", type: "text" },
    { id: 2, from: "me", text: "Works great. 8am off the back?", time: "9:44 AM", type: "text" },
    { id: 3, from: "them", text: "Perfect. Nassau $100 a side?", time: "9:46 AM", type: "text" },
  ], wagerStatus: "pending_proposal", wagerAmount: 100, course: "Bethpage Black", date: "Sat Mar 8", time: "8:00 AM" },
  { id: 2, profile: profiles[2], messages: [
    { id: 1, from: "them", text: "Connor — Dale here. Shinnecock this weekend?", time: "Yesterday", type: "text" },
    { id: 2, from: "system", text: "✓ Wager funded. GIMME is holding $300 from both players.", time: "Yesterday", type: "system" },
  ], wagerStatus: "funded", wagerAmount: 300, course: "Shinnecock Hills", date: "Sun Mar 9", time: "7:30 AM" },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#060f0a;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:'DM Sans',sans-serif;}
.shell{width:390px;height:844px;background:${C.bg};position:relative;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 40px 120px rgba(0,0,0,0.8);}
.screen{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;}.screen::-webkit-scrollbar{display:none;}
.hdr{padding:52px 24px 14px;display:flex;justify-content:space-between;align-items:flex-end;flex-shrink:0;}
.logo{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:${C.cream};letter-spacing:-.5px;}.logo em{color:${C.green};font-style:normal;}
.icon-btn{background:${C.faint};border:1px solid ${C.border};border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;flex-shrink:0;}.icon-btn:hover{background:rgba(244,241,236,.14);}
.sec-label{padding:0 24px 14px;font-size:11px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:${C.muted};}
.card-stack{flex:1;position:relative;padding:0 20px;overflow:hidden;}
.card{position:absolute;width:calc(100% - 40px);border-radius:20px;overflow:hidden;cursor:pointer;transform-origin:center bottom;}
.card-photo{width:100%;height:500px;display:block;}
.card-overlay{position:absolute;bottom:0;left:0;right:0;height:75%;background:linear-gradient(to top,rgba(11,26,20,.98) 0%,rgba(11,26,20,.65) 45%,transparent 100%);}
.card-body{position:absolute;bottom:0;left:0;right:0;padding:24px 22px 22px;}
.card-name{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:${C.cream};letter-spacing:-.3px;line-height:1.1;margin-bottom:4px;}
.card-course{font-size:12px;color:rgba(244,241,236,.55);margin-bottom:16px;}
.card-stats{display:flex;gap:10px;flex-wrap:wrap;}
.pill{display:flex;align-items:center;gap:6px;background:rgba(244,241,236,.08);border:1px solid ${C.border};border-radius:100px;padding:6px 12px;}.pill span{font-size:12px;font-weight:500;color:${C.cream};}
.pill-green{background:rgba(162,255,0,.07);border-color:rgba(162,255,0,.2);}.pill-green span{color:${C.green};}
.pill-gold{background:rgba(194,161,77,.12);border-color:rgba(194,161,77,.3);}.pill-gold span{color:${C.gold};}
.hcp-badge{position:absolute;top:16px;left:16px;background:rgba(11,26,20,.75);border:1px solid ${C.faint};border-radius:8px;padding:5px 10px;font-size:11px;color:rgba(244,241,236,.55);backdrop-filter:blur(4px);}.hcp-badge strong{font-family:'Playfair Display',serif;font-size:14px;color:${C.cream};}
.card-counter{position:absolute;top:16px;right:16px;background:rgba(11,26,20,.7);border:1px solid ${C.faint};border-radius:100px;padding:4px 10px;font-size:11px;color:rgba(244,241,236,.5);}
.initials-ring{width:90px;height:90px;border-radius:50%;border:1px solid rgba(244,241,236,.12);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:26px;color:rgba(244,241,236,.2);letter-spacing:3px;margin-bottom:80px;}
.actions{padding:14px 24px 28px;display:flex;justify-content:center;gap:14px;flex-shrink:0;align-items:center;}
.btn{border-radius:100px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;transition:all .2s cubic-bezier(.25,.46,.45,.94);display:flex;align-items:center;justify-content:center;gap:7px;}
.btn-pass{background:rgba(244,241,236,.07);border:1px solid ${C.border};color:rgba(244,241,236,.6);padding:12px 22px;font-size:13px;}.btn-pass:hover{background:rgba(244,241,236,.12);color:${C.cream};}
.btn-interested{background:${C.green};color:${C.bg};padding:14px 28px;font-size:14px;font-weight:600;box-shadow:0 0 24px rgba(162,255,0,.25);}.btn-interested:hover{background:#b8ff26;box-shadow:0 0 32px rgba(162,255,0,.4);transform:translateY(-1px);}
.btn-save{background:rgba(194,161,77,.1);border:1px solid rgba(194,161,77,.25);color:${C.gold};padding:12px 22px;font-size:13px;}.btn-save:hover{background:rgba(194,161,77,.18);}
.btn-primary{background:${C.green};color:${C.bg};padding:15px 32px;font-size:14px;font-weight:600;width:100%;}.btn-primary:hover{background:#b8ff26;}
.btn-ghost{background:${C.faint};border:1px solid ${C.border};color:${C.cream};padding:13px 24px;font-size:13px;width:100%;}.btn-ghost:hover{background:rgba(244,241,236,.1);}
.nav{padding:10px 24px 8px;display:flex;justify-content:space-around;flex-shrink:0;border-top:1px solid rgba(244,241,236,.07);}
.nav-item{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;opacity:.3;transition:opacity .2s;position:relative;}.nav-item.on{opacity:1;}
.nav-dot{width:4px;height:4px;border-radius:50%;background:transparent;}.nav-item.on .nav-dot{background:${C.green};}
.nav-icon{font-size:20px;}
.nav-badge{position:absolute;top:-2px;right:-2px;width:14px;height:14px;background:${C.green};border-radius:50%;font-size:9px;color:${C.bg};font-weight:700;display:flex;align-items:center;justify-content:center;}
.toast{position:absolute;top:108px;left:50%;transform:translateX(-50%) translateY(-16px);background:rgba(11,26,20,.95);border:1px solid ${C.border};border-radius:100px;padding:10px 20px;font-size:13px;font-weight:500;color:${C.cream};white-space:nowrap;z-index:200;opacity:0;transition:all .3s;pointer-events:none;}
.toast.on{opacity:1;transform:translateX(-50%) translateY(0);}
.toast.interested{border-color:rgba(162,255,0,.4);color:${C.green};}
.toast.saved{border-color:rgba(194,161,77,.4);color:${C.gold};}
.toast.vouched{border-color:rgba(194,161,77,.4);color:${C.gold};}
.toast.funded{border-color:rgba(162,255,0,.4);color:${C.green};}
.toast.passed{border-color:${C.border};color:rgba(244,241,236,.6);}
.drawer{position:absolute;top:0;left:0;right:0;bottom:0;background:${C.bg};z-index:50;padding:60px 24px 32px;transform:translateX(100%);transition:transform .35s cubic-bezier(.25,.46,.45,.94);overflow-y:auto;}.drawer.open{transform:translateX(0);}
.drawer-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;}
.drawer-title{font-family:'Playfair Display',serif;font-size:24px;color:${C.cream};}
.close-btn{background:none;border:none;color:${C.muted};font-size:22px;cursor:pointer;}
.filter-sec{margin-bottom:32px;}
.filter-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};margin-bottom:14px;font-weight:500;}
.range-track{position:relative;height:2px;background:rgba(244,241,236,.1);border-radius:2px;margin:20px 0 8px;}
.range-fill{position:absolute;height:100%;background:${C.green};border-radius:2px;}
.range-input{position:absolute;width:100%;top:-8px;height:18px;opacity:0;cursor:pointer;}
.range-val{font-size:20px;font-family:'Playfair Display',serif;color:${C.cream};}
.toggle-row{display:flex;justify-content:space-between;align-items:center;}
.toggle-lbl{font-size:15px;color:${C.cream};}
.toggle{width:44px;height:24px;background:rgba(244,241,236,.1);border-radius:12px;position:relative;cursor:pointer;transition:background .2s;border:none;}.toggle.on{background:${C.green};}
.toggle-thumb{position:absolute;top:3px;left:3px;width:18px;height:18px;background:white;border-radius:50%;transition:transform .2s;}.toggle.on .toggle-thumb{transform:translateX(20px);}
.wager-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.wager-opt{background:${C.surface};border:1px solid ${C.border};border-radius:10px;padding:12px 14px;cursor:pointer;transition:all .2s;font-size:13px;color:rgba(244,241,236,.6);font-weight:500;text-align:center;}.wager-opt.on{background:rgba(162,255,0,.08);border-color:rgba(162,255,0,.35);color:${C.green};}
.days-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.day-opt{background:${C.surface};border:1px solid ${C.border};border-radius:10px;padding:10px 6px;cursor:pointer;transition:all .2s;font-size:12px;color:rgba(244,241,236,.6);text-align:center;}.day-opt.on{background:rgba(162,255,0,.08);border-color:rgba(162,255,0,.35);color:${C.green};}
.profile-hero{width:100%;height:280px;position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.profile-hero-overlay{position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,${C.bg} 0%,transparent 100%);}
.profile-back{position:absolute;top:52px;left:20px;background:rgba(11,26,20,.7);border:1px solid ${C.faint};border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(4px);}
.profile-content{padding:0 24px 32px;}
.profile-name{font-family:'Playfair Display',serif;font-size:30px;font-weight:600;color:${C.cream};letter-spacing:-.5px;margin-bottom:4px;}
.profile-course{font-size:13px;color:${C.muted};margin-bottom:20px;}
.stat-row{display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap;}
.stat-box{flex:1;min-width:80px;background:${C.surface};border:1px solid ${C.border};border-radius:14px;padding:14px 16px;}
.stat-box-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-bottom:6px;}
.stat-box-val{font-family:'Playfair Display',serif;font-size:22px;color:${C.cream};}
.divider{height:1px;background:${C.border};margin:20px 0;}
.section-title{font-family:'Playfair Display',serif;font-size:18px;color:${C.cream};margin-bottom:16px;}
.tag-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.tag{background:${C.surface};border:1px solid ${C.border};border-radius:100px;padding:6px 14px;font-size:12px;color:rgba(244,241,236,.7);}
.vouch-summary{display:flex;gap:12px;margin-bottom:20px;}
.vouch-icon-box{flex:1;background:${C.surface};border:1px solid ${C.border};border-radius:14px;padding:14px;text-align:center;}
.vouch-icon-box .vi{font-size:22px;margin-bottom:6px;}.vouch-icon-box .vn{font-family:'Playfair Display',serif;font-size:20px;color:${C.gold};}.vouch-icon-box .vl{font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:${C.muted};margin-top:4px;}
.vouch-card{background:${C.surface};border:1px solid ${C.border};border-radius:14px;padding:16px;margin-bottom:10px;}
.vouch-card-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.vouch-author{font-size:13px;font-weight:600;color:${C.cream};}
.vouch-icons{display:flex;gap:6px;}
.vi-dot{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;}.vi-dot.on{background:rgba(194,161,77,.2);border:1px solid rgba(194,161,77,.4);}.vi-dot.off{background:rgba(244,241,236,.05);border:1px solid rgba(244,241,236,.1);}
.vouch-text{font-size:13px;color:rgba(244,241,236,.6);line-height:1.5;}
.standing-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(162,255,0,.08);border:1px solid rgba(162,255,0,.25);border-radius:100px;padding:8px 16px;margin-bottom:20px;}
.standing-dot{width:8px;height:8px;border-radius:50%;background:${C.green};}
.standing-text{font-size:12px;font-weight:500;color:${C.green};letter-spacing:.5px;}
.req-card{background:${C.surface};border:1px solid ${C.border};border-radius:18px;margin:0 24px 14px;overflow:hidden;}
.req-card-hdr{display:flex;gap:14px;padding:16px;align-items:center;}
.req-info{flex:1;}.req-name{font-family:'Playfair Display',serif;font-size:17px;color:${C.cream};margin-bottom:3px;}.req-meta{font-size:12px;color:${C.muted};}
.req-details{padding:12px 16px 16px;border-top:1px solid ${C.border};}
.req-detail-row{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;}
.req-actions{display:flex;gap:10px;}
.btn-accept{flex:1;background:${C.green};color:${C.bg};border:none;border-radius:100px;padding:12px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s;}.btn-accept:hover{background:#b8ff26;}
.btn-decline{flex:1;background:rgba(244,241,236,.05);border:1px solid ${C.border};color:rgba(244,241,236,.5);border-radius:100px;padding:12px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;}
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;color:${C.muted};gap:12px;text-align:center;padding:24px;}
.empty-icon{font-size:40px;}.empty-title{font-family:'Playfair Display',serif;font-size:20px;color:rgba(244,241,236,.4);}
.my-profile-hero{width:100%;height:200px;position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.my-avatar{width:90px;height:90px;border-radius:50%;border:2px solid rgba(162,255,0,.3);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:28px;color:rgba(244,241,236,.35);position:relative;z-index:2;}
.my-avatar-edit{position:absolute;bottom:0;right:0;width:26px;height:26px;background:${C.green};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;}
.my-profile-name{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:${C.cream};text-align:center;margin-bottom:4px;}
.my-profile-course{font-size:13px;color:${C.muted};text-align:center;margin-bottom:24px;}
.edit-section{background:${C.surface};border:1px solid ${C.border};border-radius:16px;margin:0 24px 14px;padding:18px;}
.edit-section-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};margin-bottom:14px;}
.edit-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(244,241,236,.06);}.edit-row:last-child{border-bottom:none;padding-bottom:0;}
.edit-row-label{font-size:14px;color:rgba(244,241,236,.7);}.edit-row-val{font-size:14px;color:${C.cream};font-weight:500;}.edit-chevron{color:${C.muted};font-size:12px;}
.standing-score-ring{width:120px;height:120px;border-radius:50%;border:2px solid rgba(162,255,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 24px;background:rgba(162,255,0,.04);}
.standing-score{font-family:'Playfair Display',serif;font-size:36px;color:${C.green};}
.standing-score-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-top:2px;}
.no-strikes{display:flex;flex-direction:column;align-items:center;padding:32px 24px;text-align:center;gap:10px;}
.vouch-flow{padding:24px;}.vouch-flow-title{font-family:'Playfair Display',serif;font-size:24px;color:${C.cream};margin-bottom:6px;}.vouch-flow-sub{font-size:14px;color:${C.muted};margin-bottom:32px;line-height:1.5;}
.vouch-target{display:flex;align-items:center;gap:14px;background:${C.surface};border:1px solid ${C.border};border-radius:14px;padding:16px;margin-bottom:28px;}
.vouch-icon-row{display:flex;gap:12px;margin-bottom:28px;}
.vouch-icon-btn{flex:1;background:${C.surface};border:2px solid ${C.border};border-radius:16px;padding:18px 12px;cursor:pointer;transition:all .2s;text-align:center;}.vouch-icon-btn.on{background:rgba(194,161,77,.1);border-color:rgba(194,161,77,.4);}
.vouch-icon-btn .vib-icon{font-size:28px;margin-bottom:8px;}.vouch-icon-btn .vib-label{font-size:11px;letter-spacing:.5px;color:${C.muted};line-height:1.3;}.vouch-icon-btn.on .vib-label{color:${C.gold};}
.vouch-textarea{width:100%;background:${C.surface};border:1px solid ${C.border};border-radius:14px;padding:14px;color:${C.cream};font-family:'DM Sans',sans-serif;font-size:14px;resize:none;outline:none;line-height:1.5;margin-bottom:20px;}.vouch-textarea::placeholder{color:rgba(244,241,236,.25);}.vouch-textarea:focus{border-color:rgba(162,255,0,.3);}
.onboard{flex:1;display:flex;flex-direction:column;padding:52px 24px 32px;}
.onboard-step{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};margin-bottom:16px;}
.onboard-title{font-family:'Playfair Display',serif;font-size:32px;color:${C.cream};line-height:1.15;margin-bottom:8px;}
.onboard-sub{font-size:14px;color:${C.muted};margin-bottom:36px;line-height:1.6;}
.onboard-field{margin-bottom:20px;}
.onboard-field-label{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-bottom:10px;}
.onboard-input{width:100%;background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:14px 16px;color:${C.cream};font-family:'DM Sans',sans-serif;font-size:15px;outline:none;transition:border-color .2s;}.onboard-input:focus{border-color:rgba(162,255,0,.4);}.onboard-input::placeholder{color:rgba(244,241,236,.2);}
.onboard-bottom{margin-top:auto;display:flex;flex-direction:column;gap:10px;}
.step-dots{display:flex;gap:6px;justify-content:center;margin-bottom:20px;}
.step-dot{width:6px;height:6px;border-radius:50%;background:rgba(244,241,236,.15);transition:all .3s;}.step-dot.on{background:${C.green};width:20px;}
.tee-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.tee-opt{background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:14px;cursor:pointer;transition:all .2s;font-size:14px;color:rgba(244,241,236,.6);text-align:center;}.tee-opt.on{background:rgba(162,255,0,.08);border-color:rgba(162,255,0,.35);color:${C.green};}
.game-opts{display:flex;flex-wrap:wrap;gap:8px;}
.game-opt{background:${C.surface};border:1px solid ${C.border};border-radius:100px;padding:10px 18px;cursor:pointer;transition:all .2s;font-size:13px;color:rgba(244,241,236,.6);}.game-opt.on{background:rgba(162,255,0,.08);border-color:rgba(162,255,0,.35);color:${C.green};}

/* MESSAGING */
.thread-list{padding:0 24px;}
.thread-item{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid ${C.border};cursor:pointer;transition:opacity .2s;}.thread-item:hover{opacity:.8;}.thread-item:last-child{border-bottom:none;}
.thread-info{flex:1;min-width:0;}
.thread-name{font-family:'Playfair Display',serif;font-size:16px;color:${C.cream};margin-bottom:3px;}
.thread-preview{font-size:12px;color:${C.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.thread-meta{text-align:right;flex-shrink:0;}
.thread-time{font-size:11px;color:${C.muted};margin-bottom:6px;}
.thread-status{font-size:11px;padding:3px 8px;border-radius:100px;}
.thread-status.funded{background:rgba(162,255,0,.1);color:${C.green};border:1px solid rgba(162,255,0,.25);}
.thread-status.pending{background:rgba(194,161,77,.1);color:${C.gold};border:1px solid rgba(194,161,77,.25);}
.thread-status.settled{background:rgba(244,241,236,.05);color:${C.muted};border:1px solid ${C.border};}
.thread-badge{background:${C.green};color:${C.bg};border-radius:100px;padding:3px 10px;font-size:11px;font-weight:600;}

/* CHAT */
.chat-shell{display:flex;flex-direction:column;height:100%;}
.chat-hdr{padding:52px 20px 14px;display:flex;align-items:center;gap:12px;flex-shrink:0;border-bottom:1px solid ${C.border};}
.chat-hdr-info{flex:1;}.chat-hdr-name{font-family:'Playfair Display',serif;font-size:18px;color:${C.cream};}.chat-hdr-sub{font-size:11px;color:${C.muted};margin-top:2px;}
.chat-messages{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px;scrollbar-width:none;}.chat-messages::-webkit-scrollbar{display:none;}
.msg-row{display:flex;gap:8px;}.msg-row.mine{flex-direction:row-reverse;}
.msg-bubble{max-width:72%;padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.5;}
.msg-bubble.theirs{background:rgba(244,241,236,.08);border:1px solid ${C.border};color:${C.cream};border-bottom-left-radius:4px;}
.msg-bubble.mine{background:rgba(162,255,0,.12);border:1px solid rgba(162,255,0,.2);color:${C.cream};border-bottom-right-radius:4px;}
.msg-time{font-size:10px;color:${C.muted};margin-top:4px;text-align:right;}.msg-time.theirs{text-align:left;}

/* PROPOSAL CARD */
.proposal-card{background:rgba(194,161,77,.06);border:1px solid rgba(194,161,77,.2);border-radius:16px;padding:16px;margin:4px 0;}
.proposal-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.gold};margin-bottom:12px;}
.proposal-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.proposal-label{font-size:12px;color:${C.muted};}.proposal-val{font-size:14px;color:${C.cream};font-weight:500;}
.proposal-actions{display:flex;gap:8px;margin-top:14px;}
.btn-confirm{flex:1;background:${C.green};color:${C.bg};border:none;border-radius:100px;padding:10px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s;}.btn-confirm:hover{background:#b8ff26;}
.btn-counter{flex:1;background:rgba(244,241,236,.05);border:1px solid ${C.border};color:rgba(244,241,236,.6);border-radius:100px;padding:10px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;}

/* WAGER BANNER */
.wager-banner{margin:0 20px 10px;border-radius:14px;padding:14px 16px;}
.wager-banner.pending{background:rgba(194,161,77,.06);border:1px solid rgba(194,161,77,.2);}
.wager-banner.funded{background:rgba(162,255,0,.06);border:1px solid rgba(162,255,0,.2);}
.wager-banner.disputed{background:${C.redBg};border:1px solid ${C.redBorder};}
.wager-banner.settled{background:rgba(244,241,236,.04);border:1px solid ${C.border};}
.wager-banner.claim{background:rgba(194,161,77,.06);border:1px solid rgba(194,161,77,.2);}
.wager-banner-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
.wager-banner.pending .wager-banner-title,.wager-banner.claim .wager-banner-title{color:${C.gold};}
.wager-banner.funded .wager-banner-title{color:${C.green};}
.wager-banner.disputed .wager-banner-title{color:${C.red};}
.wager-banner.settled .wager-banner-title{color:${C.muted};}
.wager-banner-amount{font-family:'Playfair Display',serif;font-size:26px;color:${C.cream};margin-bottom:10px;}
.wager-banner-sub{font-size:12px;color:${C.muted};margin-bottom:12px;line-height:1.5;}
.wager-fund-btns{display:flex;gap:8px;}

/* MODAL */
.modal-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(11,26,20,.92);z-index:100;display:flex;align-items:flex-end;}
.modal{background:#0f2018;border:1px solid ${C.border};border-radius:24px 24px 0 0;padding:28px 24px 40px;width:100%;max-height:90%;overflow-y:auto;}
.modal-handle{width:36px;height:3px;background:rgba(244,241,236,.2);border-radius:2px;margin:0 auto 24px;}
.modal-title{font-family:'Playfair Display',serif;font-size:22px;color:${C.cream};margin-bottom:8px;}
.modal-sub{font-size:13px;color:${C.muted};margin-bottom:24px;line-height:1.6;}
.wager-type-opts{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
.wager-type-opt{background:${C.surface};border:2px solid ${C.border};border-radius:16px;padding:16px 18px;cursor:pointer;transition:all .2s;}.wager-type-opt.on{border-color:rgba(162,255,0,.4);background:rgba(162,255,0,.06);}
.wto-title{font-size:15px;font-weight:600;color:${C.cream};margin-bottom:4px;}.wto-sub{font-size:12px;color:${C.muted};line-height:1.4;}.wager-type-opt.on .wto-title{color:${C.green};}
.amount-row{display:flex;gap:10px;align-items:center;margin-bottom:20px;}
.amount-input{flex:1;background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:14px 16px;color:${C.cream};font-family:'Playfair Display',serif;font-size:22px;outline:none;text-align:center;}.amount-input:focus{border-color:rgba(162,255,0,.4);}
.settlement-opts{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
.settlement-opt{background:${C.surface};border:2px solid ${C.border};border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;text-align:center;}.settlement-opt.on{border-color:rgba(162,255,0,.4);background:rgba(162,255,0,.06);}
.settlement-opt-title{font-size:15px;font-weight:600;color:${C.cream};margin-bottom:3px;}.settlement-opt.on .settlement-opt-title{color:${C.green};}
.settlement-opt-sub{font-size:12px;color:${C.muted};}

/* CHAT INPUT */
.chat-input-row{padding:10px 16px 24px;display:flex;gap:10px;align-items:flex-end;flex-shrink:0;border-top:1px solid ${C.border};}
.chat-input{flex:1;background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:10px 16px;color:${C.cream};font-family:'DM Sans',sans-serif;font-size:14px;outline:none;resize:none;max-height:80px;line-height:1.4;}.chat-input:focus{border-color:rgba(162,255,0,.3);}.chat-input::placeholder{color:rgba(244,241,236,.2);}
.chat-send{width:38px;height:38px;background:${C.green};border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .2s;}.chat-send:hover{background:#b8ff26;}
.chat-propose-btn{background:rgba(194,161,77,.1);border:1px solid rgba(194,161,77,.25);border-radius:20px;padding:8px 14px;color:${C.gold};font-size:12px;font-weight:500;cursor:pointer;white-space:nowrap;transition:all .2s;}.chat-propose-btn:hover{background:rgba(194,161,77,.18);}
`;

// HELPERS
function Avatar({ gradient, initials, size = 90, radius = "50%", fontSize = 26 }) {
  return <div style={{ width: size, height: size, borderRadius: radius, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize, color: "rgba(244,241,236,.22)", letterSpacing: 3, flexShrink: 0 }}>{initials}</div>;
}
function BackBtn({ onClick }) {
  return <button className="icon-btn" onClick={onClick}><svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke={C.cream} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></button>;
}
function Pill({ icon, label, type = "" }) {
  return <div className={`pill ${type==="green"?"pill-green":type==="gold"?"pill-gold":""}`}><span style={{fontSize:12}}>{icon}</span><span>{label}</span></div>;
}

// FEED
function FeedScreen({ onViewProfile }) {
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState({ on: false, msg: "", type: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [gamblerOnly, setGamblerOnly] = useState(false);
  const [distMax, setDistMax] = useState(25);
  const [wagerSel, setWagerSel] = useState(null);
  const [daySel, setDaySel] = useState([]);
  const showToast = (msg, type) => { setToast({ on: true, msg, type }); setTimeout(() => setToast({ on: false, msg: "", type: "" }), 1800); };
  const handle = (action) => {
    const p = profiles[idx];
    if (action==="interested") showToast(`Interested in ${p.name}`,"interested");
    if (action==="save") showToast(`Saved ${p.name}`,"saved");
    if (action==="pass") showToast("Passed","passed");
    setTimeout(() => setIdx(i=>i+1), action==="pass"?0:300);
  };
  const cur=profiles[idx], nxt=profiles[idx+1], thr=profiles[idx+2];
  const wagerOpts=["$0–$25","$25–$100","$100–$300","$300+"];
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <>
      <div className={`toast ${toast.on?"on":""} ${toast.type}`}>{toast.msg}</div>
      <div className={`drawer ${filterOpen?"open":""}`}>
        <div className="drawer-hdr"><div className="drawer-title">Filters</div><button className="close-btn" onClick={()=>setFilterOpen(false)}>✕</button></div>
        <div className="filter-sec"><div className="filter-lbl">Distance</div><div className="range-val">{distMax} mi</div><div className="range-track"><div className="range-fill" style={{width:`${distMax}%`}}/><input type="range" min="5" max="100" value={distMax} className="range-input" onChange={e=>setDistMax(+e.target.value)}/></div></div>
        <div className="filter-sec"><div className="filter-lbl">Wager Range</div><div className="wager-grid">{wagerOpts.map(o=><div key={o} className={`wager-opt ${wagerSel===o?"on":""}`} onClick={()=>setWagerSel(wagerSel===o?null:o)}>{o}</div>)}</div></div>
        <div className="filter-sec"><div className="filter-lbl">Availability</div><div className="days-grid">{days.map(d=><div key={d} className={`day-opt ${daySel.includes(d)?"on":""}`} onClick={()=>setDaySel(s=>s.includes(d)?s.filter(x=>x!==d):[...s,d])}>{d}</div>)}</div></div>
        <div className="filter-sec"><div className="toggle-row"><span className="toggle-lbl">Gamblers only</span><button className={`toggle ${gamblerOnly?"on":""}`} onClick={()=>setGamblerOnly(g=>!g)}><div className="toggle-thumb"/></button></div></div>
        <button className="btn btn-primary" onClick={()=>setFilterOpen(false)}>Apply Filters</button>
      </div>
      <div className="hdr">
        <div className="logo">GIMME<em>.</em></div>
        <button className="icon-btn" onClick={()=>setFilterOpen(true)}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><line x1="0" y1="2" x2="18" y2="2" stroke={C.cream} strokeWidth="1.5" strokeOpacity=".7"/><circle cx="13" cy="2" r="2.5" fill={C.bg} stroke={C.cream} strokeWidth="1.5" strokeOpacity=".7"/><line x1="0" y1="8" x2="18" y2="8" stroke={C.cream} strokeWidth="1.5" strokeOpacity=".7"/><circle cx="5" cy="8" r="2.5" fill={C.bg} stroke={C.cream} strokeWidth="1.5" strokeOpacity=".7"/><line x1="0" y1="14" x2="18" y2="14" stroke={C.cream} strokeWidth="1.5" strokeOpacity=".7"/><circle cx="10" cy="14" r="2.5" fill={C.bg} stroke={C.cream} strokeWidth="1.5" strokeOpacity=".7"/></svg>
        </button>
      </div>
      <div className="sec-label">Fairway Feed</div>
      <div className="card-stack">
        {idx>=profiles.length?(
          <div className="empty-state" style={{height:"100%"}}><div className="empty-icon">⛳</div><div className="empty-title">You've seen everyone</div><div style={{fontSize:13,color:C.muted}}>Adjust your filters or check back later</div></div>
        ):(
          <>
            {thr&&<div className="card" style={{top:24,left:28,right:28,transform:"scale(0.92)",opacity:0.4,zIndex:1}}><div className="card-photo" style={{background:thr.gradient}}/><div className="card-overlay"/></div>}
            {nxt&&<div className="card" style={{top:14,left:24,right:24,transform:"scale(0.96)",opacity:0.65,zIndex:2}}><div className="card-photo" style={{background:nxt.gradient}}/><div className="card-overlay"/></div>}
            <div className="card" style={{top:4,zIndex:3}} onClick={()=>onViewProfile(cur)}>
              <div className="card-photo" style={{background:cur.gradient,display:"flex",alignItems:"center",justifyContent:"center"}}><div className="initials-ring">{cur.initials}</div></div>
              <div className="card-overlay"/>
              <div className="hcp-badge">HCP <strong>{cur.handicap}</strong></div>
              <div className="card-counter">{idx+1} / {profiles.length}</div>
              <div className="card-body">
                <div className="card-name">{cur.name}</div>
                <div className="card-course">{cur.homeCourse}</div>
                <div className="card-stats"><Pill icon="📍" label={cur.distance} type="green"/><Pill icon="💵" label={cur.wagerRange}/><Pill icon="✦" label={`${cur.vouches} vouches`} type="gold"/></div>
              </div>
            </div>
          </>
        )}
      </div>
      {idx<profiles.length&&<div className="actions"><button className="btn btn-pass" onClick={()=>handle("pass")}>Pass</button><button className="btn btn-interested" onClick={()=>handle("interested")}>Interested</button><button className="btn btn-save" onClick={()=>handle("save")}>Save</button></div>}
    </>
  );
}

// PROFILE DETAIL
function ProfileScreen({ profile, onBack, onInterested, onVouch }) {
  const [vouchOpen, setVouchOpen] = useState(false);
  return (
    <div className="screen">
      <div className="profile-hero" style={{background:profile.gradient}}>
        <div className="initials-ring" style={{marginBottom:0}}>{profile.initials}</div>
        <div className="profile-hero-overlay"/>
        <button className="profile-back" onClick={onBack}><svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke={C.cream} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="profile-content">
        <div style={{marginTop:16,marginBottom:4}}><div className="standing-badge"><div className="standing-dot"/><div className="standing-text">Account in Good Standing</div></div></div>
        <div className="profile-name">{profile.name}</div>
        <div className="profile-course">{profile.homeCourse} · {profile.distance} away</div>
        <div className="stat-row">
          <div className="stat-box"><div className="stat-box-label">Handicap</div><div className="stat-box-val">{profile.handicap}</div></div>
          <div className="stat-box"><div className="stat-box-label">Tees</div><div className="stat-box-val" style={{fontSize:16,paddingTop:4}}>{profile.tees}</div></div>
          <div className="stat-box"><div className="stat-box-label">Vouches</div><div className="stat-box-val" style={{color:C.gold}}>{profile.vouches}</div></div>
        </div>
        <div className="divider"/>
        <div className="section-title">Wager Range</div>
        <div className="tag-row" style={{marginBottom:24}}><div className="tag" style={{background:"rgba(162,255,0,.07)",borderColor:"rgba(162,255,0,.2)",color:C.green,fontSize:16,fontFamily:"'Playfair Display',serif"}}>{profile.wagerRange} / round</div></div>
        <div className="divider"/>
        <div className="section-title">Favorite Games</div>
        <div className="tag-row">{profile.games.map(g=><div key={g} className="tag">{g}</div>)}</div>
        <div className="divider"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div className="section-title" style={{marginBottom:0}}>Vouches</div>
          <button className="btn btn-save" style={{padding:"8px 16px",fontSize:12}} onClick={()=>setVouchOpen(!vouchOpen)}>{vouchOpen?"Hide":"Show all"}</button>
        </div>
        <div className="vouch-summary">
          <div className="vouch-icon-box"><div className="vi">🏌️</div><div className="vn">{profile.vouches}</div><div className="vl">HCP Legit</div></div>
          <div className="vouch-icon-box"><div className="vi">💰</div><div className="vn">{Math.floor(profile.vouches*.9)}</div><div className="vl">Pays Up</div></div>
          <div className="vouch-icon-box"><div className="vi">🤝</div><div className="vn">{Math.floor(profile.vouches*.85)}</div><div className="vl">Good Game</div></div>
        </div>
        {vouchOpen&&profile.vouchComments.map((v,i)=>(
          <div key={i} className="vouch-card">
            <div className="vouch-card-hdr"><div className="vouch-author">{v.author}</div><div className="vouch-icons">{["🏌️","💰","🤝"].map((ic,j)=><div key={j} className={`vi-dot ${v.icons[j]?"on":"off"}`}>{v.icons[j]?ic:""}</div>)}</div></div>
            <div className="vouch-text">{v.text}</div>
          </div>
        ))}
        <div style={{display:"flex",gap:10,marginTop:24,paddingBottom:8}}>
          <button className="btn btn-interested" style={{flex:1}} onClick={onInterested}>Interested</button>
          <button className="btn btn-save" onClick={onVouch}>Vouch</button>
        </div>
      </div>
    </div>
  );
}

// REQUESTS
function RequestsScreen({ onOpenThread }) {
  const [reqs, setReqs] = useState([
    { id:1, profile:profiles[0], date:"Sat Mar 8", time:"8:00 AM", course:"Bethpage Black", wagerRange:"$50–$200", status:"pending" },
    { id:2, profile:profiles[2], date:"Sun Mar 9", time:"7:30 AM", course:"Shinnecock Hills", wagerRange:"$100–$500", status:"pending" },
  ]);
  const handle = (id, action) => setReqs(r=>r.map(req=>req.id===id?{...req,status:action}:req));
  return (
    <div className="screen">
      <div className="hdr"><div className="logo">GIMME<em>.</em></div></div>
      <div className="sec-label">Incoming Requests</div>
      {reqs.filter(r=>r.status==="pending").map(req=>(
        <div key={req.id} className="req-card">
          <div className="req-card-hdr"><Avatar gradient={req.profile.gradient} initials={req.profile.initials} size={52}/><div className="req-info"><div className="req-name">{req.profile.name}</div><div className="req-meta">{req.profile.homeCourse} · {req.profile.distance}</div></div><Pill icon="✦" label={`${req.profile.vouches}`} type="gold"/></div>
          <div className="req-details">
            <div className="req-detail-row"><Pill icon="📅" label={req.date}/><Pill icon="⏰" label={req.time}/><Pill icon="💵" label={req.wagerRange}/></div>
            <div className="req-actions"><button className="btn-accept" onClick={()=>handle(req.id,"accepted")}>Accept</button><button className="btn-decline" onClick={()=>handle(req.id,"declined")}>Decline</button></div>
          </div>
        </div>
      ))}
      {reqs.filter(r=>r.status==="accepted").length>0&&<>
        <div className="sec-label" style={{marginTop:8}}>Accepted</div>
        {reqs.filter(r=>r.status==="accepted").map(req=>(
          <div key={req.id} className="req-card" style={{cursor:"pointer"}} onClick={()=>onOpenThread(req.profile)}>
            <div className="req-card-hdr"><Avatar gradient={req.profile.gradient} initials={req.profile.initials} size={52}/><div className="req-info"><div className="req-name">{req.profile.name}</div><div className="req-meta">{req.course} · {req.date}</div></div><div className="thread-badge">Open Chat →</div></div>
          </div>
        ))}
      </>}
      {reqs.every(r=>r.status!=="pending")&&reqs.every(r=>r.status==="declined")&&<div className="empty-state"><div className="empty-icon">🔔</div><div className="empty-title">All clear</div></div>}
    </div>
  );
}

// MESSAGES LIST
function MessagesScreen({ threads, onOpenThread }) {
  const statusLabel = (t) => {
    if (t.wagerStatus==="funded") return <span className="thread-status funded">Funded ✓</span>;
    if (t.wagerStatus==="settled") return <span className="thread-status settled">Settled</span>;
    if (t.wagerStatus==="disputed") return <span className="thread-status" style={{background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`}}>Disputed</span>;
    return <span className="thread-status pending">Pending</span>;
  };
  return (
    <div className="screen">
      <div className="hdr"><div className="logo">GIMME<em>.</em></div></div>
      <div className="sec-label">Messages</div>
      {threads.length===0?(
        <div className="empty-state"><div className="empty-icon">💬</div><div className="empty-title">No conversations yet</div><div style={{fontSize:13,color:C.muted}}>Accept a request to start a thread</div></div>
      ):(
        <div className="thread-list">
          {threads.map(t=>(
            <div key={t.id} className="thread-item" onClick={()=>onOpenThread(t)}>
              <Avatar gradient={t.profile.gradient} initials={t.profile.initials} size={46}/>
              <div className="thread-info">
                <div className="thread-name">{t.profile.name}</div>
                <div className="thread-preview">{t.messages[t.messages.length-1]?.text||"No messages yet"}</div>
              </div>
              <div className="thread-meta">
                <div className="thread-time">{t.messages[t.messages.length-1]?.time}</div>
                {statusLabel(t)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// CHAT
function ChatScreen({ thread, onBack, onUpdateThread, showToast, onVouch }) {
  const [text, setText] = useState("");
  const [showEscrow, setShowEscrow] = useState(false);
  const [showSettle, setShowSettle] = useState(false);
  const [escrowType, setEscrowType] = useState(null);
  const [wagerAmt, setWagerAmt] = useState(thread.wagerAmount||100);
  const [settleSel, setSettleSel] = useState(null);
  const endRef = useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[thread.messages]);

  const send = () => {
    if (!text.trim()) return;
    onUpdateThread({...thread,messages:[...thread.messages,{id:Date.now(),from:"me",text:text.trim(),time:"Just now",type:"text"}]});
    setText("");
  };

  const sendProposal = () => {
    const proposal = {id:Date.now(),from:"me",type:"proposal",time:"Just now",data:{course:thread.course,date:thread.date,time:thread.time,amount:wagerAmt}};
    onUpdateThread({...thread,messages:[...thread.messages,proposal],wagerStatus:"pending_fund",wagerAmount:wagerAmt});
    setShowEscrow(false);
  };

  const fundWager = () => {
    const sys = {id:Date.now(),from:"system",text:`✓ Wager funded. GIMME is holding $${thread.wagerAmount} from both players.`,time:"Just now",type:"system"};
    onUpdateThread({...thread,messages:[...thread.messages,sys],wagerStatus:"funded"});
    showToast("Wager funded — GIMME is holding it","funded");
  };

  const handleSettle = () => {
    if (!settleSel) return;
    let updated;
    if (settleSel==="i_won") {
      const msg={id:Date.now(),from:"system",text:`Connor has claimed the win. ${thread.profile.name} has 24 hours to confirm.`,time:"Just now",type:"system"};
      updated={...thread,messages:[...thread.messages,msg],wagerStatus:"claim_pending"};
    } else if (settleSel==="they_won") {
      const msg={id:Date.now(),from:"system",text:`Round settled. ${thread.profile.name} wins. Funds released.`,time:"Just now",type:"system"};
      updated={...thread,messages:[...thread.messages,msg],wagerStatus:"settled"};
      showToast("Round settled. Funds released.","vouched");
    } else {
      const msg={id:Date.now(),from:"system",text:"⚠ Dispute filed. GIMME team notified. Funds frozen pending review.",time:"Just now",type:"system"};
      updated={...thread,messages:[...thread.messages,msg],wagerStatus:"disputed"};
    }
    onUpdateThread(updated);
    setShowSettle(false);
    setSettleSel(null);
  };

  const Banner = () => {
    const s=thread.wagerStatus;
    if (s==="pending_proposal"||s==="pending_fund") return (
      <div className={`wager-banner pending`}>
        <div className="wager-banner-title">{s==="pending_proposal"?"Wager Discussed":"Ready to Fund"}</div>
        <div className="wager-banner-amount">${thread.wagerAmount}<span style={{fontSize:14,color:C.muted,marginLeft:6}}>/ round</span></div>
        <div className="wager-banner-sub">{s==="pending_proposal"?"Set up your wager before the round.":"Both players need to fund before the round."}</div>
        <div className="wager-fund-btns">
          {s==="pending_proposal"&&<button className="btn btn-interested" style={{flex:1,padding:"10px 16px",fontSize:13}} onClick={()=>setShowEscrow(true)}>Set Up Wager</button>}
          {s==="pending_fund"&&<button className="btn btn-interested" style={{flex:1,padding:"10px 16px",fontSize:13}} onClick={fundWager}>Fund My Side — ${thread.wagerAmount}</button>}
        </div>
      </div>
    );
    if (s==="funded") return (
      <div className="wager-banner funded">
        <div className="wager-banner-title">Wager Funded ✓</div>
        <div className="wager-banner-amount">${thread.wagerAmount}<span style={{fontSize:14,color:C.muted,marginLeft:6}}>held by GIMME</span></div>
        <div className="wager-banner-sub">Good luck. Settle after the round.</div>
        <div className="wager-fund-btns">
          <button className="btn btn-interested" style={{flex:1,padding:"10px 16px",fontSize:13}} onClick={()=>setShowSettle(true)}>Settle Round</button>
          <button className="btn btn-save" style={{padding:"10px 16px",fontSize:13}} onClick={()=>onVouch(thread.profile)}>Vouch</button>
        </div>
      </div>
    );
    if (s==="claim_pending") return (
      <div className="wager-banner claim">
        <div className="wager-banner-title">Win Claimed — Awaiting Confirmation</div>
        <div className="wager-banner-amount">${thread.wagerAmount}</div>
        <div className="wager-banner-sub">{thread.profile.name} has 24hrs to confirm. Funds auto-release if no response.</div>
      </div>
    );
    if (s==="disputed") return (
      <div className="wager-banner disputed">
        <div className="wager-banner-title">⚠ Dispute Under Review</div>
        <div className="wager-banner-amount">${thread.wagerAmount}<span style={{fontSize:14,color:C.muted,marginLeft:6}}>frozen</span></div>
        <div className="wager-banner-sub">GIMME team has been notified. Funds frozen. Expect a response within 24 hours.</div>
      </div>
    );
    if (s==="settled") return (
      <div className="wager-banner settled">
        <div className="wager-banner-title">Round Settled</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:10}}>All squared up. Leave a vouch.</div>
        <button className="btn btn-save" style={{width:"100%",justifyContent:"center"}} onClick={()=>onVouch(thread.profile)}>Leave a Vouch</button>
      </div>
    );
    return null;
  };

  const renderMsg = (msg) => {
    if (msg.type==="system") return (
      <div key={msg.id} style={{textAlign:"center",padding:"4px 0"}}>
        <span style={{fontSize:12,color:C.muted,background:C.surface,border:`1px solid ${C.border}`,borderRadius:100,padding:"5px 12px",display:"inline-block",lineHeight:1.5}}>{msg.text}</span>
      </div>
    );
    if (msg.type==="proposal") return (
      <div key={msg.id} className={`msg-row ${msg.from==="me"?"mine":""}`}>
        <div style={{maxWidth:"88%"}}>
          <div className="proposal-card">
            <div className="proposal-title">Round Proposal</div>
            <div className="proposal-row"><span className="proposal-label">Course</span><span className="proposal-val">{msg.data.course}</span></div>
            <div className="proposal-row"><span className="proposal-label">Date</span><span className="proposal-val">{msg.data.date}</span></div>
            <div className="proposal-row"><span className="proposal-label">Tee Time</span><span className="proposal-val">{msg.data.time}</span></div>
            <div className="proposal-row" style={{marginBottom:0}}><span className="proposal-label">Wager</span><span className="proposal-val" style={{color:C.green}}>${msg.data.amount}/round</span></div>
            {msg.from==="them"&&<div className="proposal-actions"><button className="btn-confirm" onClick={()=>onUpdateThread({...thread,wagerStatus:"pending_fund"})}>Confirm</button><button className="btn-counter">Counter</button></div>}
          </div>
          <div className="msg-time" style={{textAlign:msg.from==="me"?"right":"left"}}>{msg.time}</div>
        </div>
      </div>
    );
    return (
      <div key={msg.id} className={`msg-row ${msg.from==="me"?"mine":""}`}>
        <div><div className={`msg-bubble ${msg.from==="me"?"mine":"theirs"}`}>{msg.text}</div><div className={`msg-time ${msg.from==="them"?"theirs":""}`}>{msg.time}</div></div>
      </div>
    );
  };

  const statusColor = {funded:C.green,settled:C.muted,disputed:C.red,claim_pending:C.gold,pending_fund:C.gold,pending_proposal:C.gold}[thread.wagerStatus]||C.muted;
  const statusLabel = {funded:"Funded",settled:"Settled",disputed:"Disputed",claim_pending:"Claim Pending",pending_fund:"Pending Fund",pending_proposal:"Pending"}[thread.wagerStatus]||"Pending";
  const locked = ["settled","disputed","claim_pending"].includes(thread.wagerStatus);

  return (
    <div className="chat-shell">
      <div className="chat-hdr">
        <BackBtn onClick={onBack}/>
        <Avatar gradient={thread.profile.gradient} initials={thread.profile.initials} size={36}/>
        <div className="chat-hdr-info"><div className="chat-hdr-name">{thread.profile.name}</div><div className="chat-hdr-sub">{thread.course} · {thread.date}</div></div>
        <div style={{fontSize:11,color:statusColor,background:`${statusColor}18`,border:`1px solid ${statusColor}40`,borderRadius:100,padding:"4px 10px",fontWeight:500,flexShrink:0}}>{statusLabel}</div>
      </div>

      <Banner/>

      <div className="chat-messages">
        {thread.messages.map(renderMsg)}
        <div ref={endRef}/>
      </div>

      {!locked&&(
        <div className="chat-input-row">
          <button className="chat-propose-btn" onClick={()=>setShowEscrow(true)}>💵 Wager</button>
          <textarea className="chat-input" rows={1} placeholder="Message..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}/>
          <button className="chat-send" onClick={send}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 1L6 8M13 1L9 13L6 8M13 1L1 5L6 8" stroke={C.bg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        </div>
      )}

      {/* ESCROW MODAL */}
      {showEscrow&&(
        <div className="modal-overlay" onClick={()=>setShowEscrow(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-handle"/>
            <div className="modal-title">Set Up Wager</div>
            <div className="modal-sub">Choose how to handle the money for this round.</div>
            <div className="filter-lbl">Amount per round</div>
            <div className="amount-row">
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:C.muted}}>$</span>
              <input className="amount-input" type="number" value={wagerAmt} onChange={e=>setWagerAmt(+e.target.value)}/>
              <span style={{fontSize:12,color:C.muted}}>per round</span>
            </div>
            <div className="filter-lbl">How to handle it</div>
            <div className="wager-type-opts">
              <div className={`wager-type-opt ${escrowType==="gimme"?"on":""}`} onClick={()=>setEscrowType("gimme")}>
                <div className="wto-title">🏦 GIMME Holds It</div>
                <div className="wto-sub">Both players fund upfront. Winner claims within 24hrs. GIMME arbitrates disputes. Small rake applies.</div>
              </div>
              <div className={`wager-type-opt ${escrowType==="handshake"?"on":""}`} onClick={()=>setEscrowType("handshake")}>
                <div className="wto-title">🤝 Gentleman's Agreement</div>
                <div className="wto-sub">Handle it on site. No rake. GIMME can't arbitrate — Pays Up vouches are the only trust signal.</div>
              </div>
              <div className={`wager-type-opt ${escrowType==="social"?"on":""}`} onClick={()=>setEscrowType("social")}>
                <div className="wto-title">⛳ Social — No Wager</div>
                <div className="wto-sub">Just a round. No money involved.</div>
              </div>
            </div>
            <button className="btn btn-primary" style={{opacity:escrowType?1:0.4}} onClick={()=>{
              if (!escrowType) return;
              if (escrowType==="gimme") { sendProposal(); }
              else {
                const t = escrowType==="handshake"?`🤝 Gentleman's Agreement — $${wagerAmt}/round. See you on the course.`:"⛳ Social round — no wager. Looking forward to it.";
                onUpdateThread({...thread,messages:[...thread.messages,{id:Date.now(),from:"me",text:t,time:"Just now",type:"text"}],wagerStatus:"settled"});
                setShowEscrow(false);
              }
            }}>
              {escrowType==="gimme"?"Send Round Proposal":escrowType==="handshake"?"Confirm Gentleman's Agreement":"Confirm Social Round"}
            </button>
          </div>
        </div>
      )}

      {/* SETTLE MODAL */}
      {showSettle&&(
        <div className="modal-overlay" onClick={()=>setShowSettle(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-handle"/>
            <div className="modal-title">Settle the Round</div>
            <div className="modal-sub">How'd it go? This releases funds from GIMME's hold.</div>
            <div className="settlement-opts">
              <div className={`settlement-opt ${settleSel==="i_won"?"on":""}`} onClick={()=>setSettleSel("i_won")}>
                <div className="settlement-opt-title">I Won</div>
                <div className="settlement-opt-sub">{thread.profile.name} has 24hrs to confirm. Funds auto-release with no response.</div>
              </div>
              <div className={`settlement-opt ${settleSel==="they_won"?"on":""}`} onClick={()=>setSettleSel("they_won")}>
                <div className="settlement-opt-title">{thread.profile.name} Won</div>
                <div className="settlement-opt-sub">Confirms their win. Funds release to them immediately.</div>
              </div>
              <div className={`settlement-opt ${settleSel==="dispute"?"on":""}`} onClick={()=>setSettleSel("dispute")} style={{borderColor:settleSel==="dispute"?C.red:undefined}}>
                <div className="settlement-opt-title" style={{color:settleSel==="dispute"?C.red:undefined}}>⚠ Dispute</div>
                <div className="settlement-opt-sub">Something went wrong. GIMME team reviews. Funds stay frozen.</div>
              </div>
            </div>
            <button className="btn btn-primary" style={{opacity:settleSel?1:0.4}} onClick={handleSettle}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
}

// MY PROFILE
function MyProfileScreen({ onStanding }) {
  return (
    <div className="screen">
      <div className="my-profile-hero" style={{background:myProfile.gradient}}>
        <div style={{position:"relative",zIndex:2}}><div className="my-avatar">{myProfile.initials}<div className="my-avatar-edit">✎</div></div></div>
        <div className="profile-hero-overlay"/>
      </div>
      <div style={{padding:"0 24px 24px"}}>
        <div className="my-profile-name">{myProfile.name}</div>
        <div className="my-profile-course">{myProfile.homeCourse}</div>
        <div style={{marginBottom:20}}><div className="standing-badge" style={{cursor:"pointer"}} onClick={onStanding}><div className="standing-dot"/><div className="standing-text">Good Standing · {myProfile.vouches} vouches</div></div></div>
        <div className="edit-section">
          <div className="edit-section-title">Playing Profile</div>
          <div className="edit-row"><span className="edit-row-label">Handicap Index</span><span className="edit-row-val">{myProfile.handicap} <span className="edit-chevron">›</span></span></div>
          <div className="edit-row"><span className="edit-row-label">Tees</span><span className="edit-row-val">{myProfile.tees} <span className="edit-chevron">›</span></span></div>
          <div className="edit-row"><span className="edit-row-label">Home Course</span><span className="edit-row-val">{myProfile.homeCourse} <span className="edit-chevron">›</span></span></div>
        </div>
        <div className="edit-section">
          <div className="edit-section-title">Wager Preferences</div>
          <div className="edit-row"><span className="edit-row-label">Range</span><span className="edit-row-val" style={{color:C.green}}>${myProfile.wagerMin} – ${myProfile.wagerMax} <span className="edit-chevron">›</span></span></div>
          <div className="edit-row"><span className="edit-row-label">Favorite Games</span><span className="edit-row-val">{myProfile.games.join(", ")} <span className="edit-chevron">›</span></span></div>
        </div>
        <div className="edit-section">
          <div className="edit-section-title">Availability</div>
          <div className="edit-row"><span className="edit-row-label">Days</span><span className="edit-row-val">{myProfile.availability.join(", ")} <span className="edit-chevron">›</span></span></div>
          <div className="edit-row"><span className="edit-row-label">Distance Radius</span><span className="edit-row-val">25 mi <span className="edit-chevron">›</span></span></div>
        </div>
        <div className="edit-section">
          <div className="edit-section-title">Account</div>
          <div className="edit-row"><span className="edit-row-label">Subscription</span><span className="edit-row-val" style={{color:C.green}}>Active <span className="edit-chevron">›</span></span></div>
          <div className="edit-row"><span className="edit-row-label">Payment Method</span><span className="edit-row-val">•••• 4291 <span className="edit-chevron">›</span></span></div>
          <div className="edit-row"><span className="edit-row-label" style={{color:C.red}}>Sign Out</span></div>
        </div>
      </div>
    </div>
  );
}

// STANDING
function StandingScreen({ onBack }) {
  return (
    <div className="screen">
      <div className="hdr"><BackBtn onClick={onBack}/><div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.cream}}>My Standing</div><div style={{width:40}}/></div>
      <div style={{padding:"8px 24px 32px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div className="standing-score-ring"><div className="standing-score">{myProfile.vouches}</div><div className="standing-score-label">Vouches</div></div>
          <div className="standing-badge" style={{display:"inline-flex"}}><div className="standing-dot"/><div className="standing-text">Account in Good Standing</div></div>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:16}}>
          <div className="filter-lbl" style={{marginBottom:16}}>Vouch Breakdown</div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            {[["🏌️","HCP Legit",myProfile.vouches],["💰","Pays Up",Math.floor(myProfile.vouches*.93)],["🤝","Good Game",Math.floor(myProfile.vouches*.88)]].map(([ic,lb,n])=>(
              <div key={lb} style={{textAlign:"center"}}><div style={{fontSize:24,marginBottom:4}}>{ic}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:C.gold}}>{n}</div><div style={{fontSize:10,letterSpacing:"1.2px",textTransform:"uppercase",color:C.muted,marginTop:4}}>{lb}</div></div>
            ))}
          </div>
        </div>
        <div className="sec-label" style={{padding:"8px 0 12px"}}>Active Strikes</div>
        <div className="no-strikes"><div style={{fontSize:36}}>✓</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"rgba(244,241,236,.5)"}}>No active strikes</div><div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>Strikes clear after 5 quality vouches or 8 months of clean play.</div></div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
          <div className="filter-lbl" style={{marginBottom:12}}>How Strikes Work</div>
          <div style={{fontSize:13,color:"rgba(244,241,236,.55)",lineHeight:1.7}}>
            A strike requires a written comment to submit — friction is intentional.<br/><br/>
            <span style={{color:C.gold}}>Categories:</span> Sandbagger · Didn't Pay · Bad Actor<br/><br/>
            <span style={{color:C.gold}}>To clear:</span> 5 quality vouches (all 3 icons) after strike date, or 8 months clean. Financial strikes need 8 vouches.
          </div>
        </div>
      </div>
    </div>
  );
}

// VOUCH
function VouchScreen({ profile, onBack, onSubmit }) {
  const [icons, setIcons] = useState([false,false,false]);
  const [comment, setComment] = useState("");
  const defs=[{icon:"🏌️",label:"Handicap\nLegit"},{icon:"💰",label:"Pays\nUp"},{icon:"🤝",label:"Good\nGame"}];
  const canSubmit = icons.some(Boolean)&&comment.trim().length>5;
  return (
    <div className="screen">
      <div className="hdr"><BackBtn onClick={onBack}/><div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.cream}}>Leave a Vouch</div><div style={{width:40}}/></div>
      <div className="vouch-flow">
        <div className="vouch-flow-title">How was the round?</div>
        <div className="vouch-flow-sub">Your vouch builds trust in the GIMME community. Be honest — it matters.</div>
        <div className="vouch-target"><Avatar gradient={profile.gradient} initials={profile.initials} size={48}/><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:C.cream}}>{profile.name}</div><div style={{fontSize:12,color:C.muted}}>{profile.homeCourse}</div></div></div>
        <div className="filter-lbl">Tap to vouch for</div>
        <div className="vouch-icon-row">{defs.map((d,i)=>(<div key={i} className={`vouch-icon-btn ${icons[i]?"on":""}`} onClick={()=>setIcons(ic=>ic.map((v,j)=>j===i?!v:v))}><div className="vib-icon">{d.icon}</div><div className="vib-label">{d.label}</div></div>))}</div>
        <div className="filter-lbl">Your comment (required)</div>
        <textarea className="vouch-textarea" rows={4} placeholder="e.g. Legit 9 handicap. Paid up same day. Great pace of play." value={comment} onChange={e=>setComment(e.target.value)}/>
        <button className="btn btn-primary" style={{opacity:canSubmit?1:0.4,cursor:canSubmit?"pointer":"default"}} onClick={()=>canSubmit&&onSubmit()}>Submit Vouch</button>
      </div>
    </div>
  );
}

// ONBOARDING
function OnboardScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({name:"",homeCourse:"",handicap:"",tees:"",wagerMin:25,wagerMax:150,games:[],days:[]});
  const teeOpts=["Championship","Back","Middle","Forward","Forward-Fwd"];
  const gameOpts=["Nassau","Skins","Match Play","Stroke Play","Other"];
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const total=5;
  const steps=[
    {title:"Welcome to\nGIMME.",sub:"A private club for golfers who take the game seriously. Let's set up your profile.",content:<div><div className="onboard-field"><div className="onboard-field-label">Your Name</div><input className="onboard-input" placeholder="Full name" value={data.name} onChange={e=>setData(d=>({...d,name:e.target.value}))}/></div><div className="onboard-field"><div className="onboard-field-label">Home Course</div><input className="onboard-input" placeholder="e.g. Bethpage Black" value={data.homeCourse} onChange={e=>setData(d=>({...d,homeCourse:e.target.value}))}/></div></div>},
    {title:"Your game.",sub:"Handicap and tees help partners understand how you play — the GHIN system handles equalization.",content:<div><div className="onboard-field"><div className="onboard-field-label">GHIN Handicap Index</div><input className="onboard-input" placeholder="e.g. 9.4" value={data.handicap} onChange={e=>setData(d=>({...d,handicap:e.target.value}))}/></div><div className="onboard-field"><div className="onboard-field-label">Tees You Play</div><div className="tee-opts">{teeOpts.map(t=><div key={t} className={`tee-opt ${data.tees===t?"on":""}`} onClick={()=>setData(d=>({...d,tees:t}))}>{t}</div>)}</div></div></div>},
    {title:"The wager.",sub:"Set your comfort range per round. GIMME holds the money — nobody gets stiffed.",content:<div><div className="onboard-field"><div className="onboard-field-label">Minimum per round</div><div className="range-val" style={{marginBottom:8}}>${data.wagerMin}</div><div className="range-track"><div className="range-fill" style={{width:`${(data.wagerMin/500)*100}%`}}/><input type="range" min="0" max="500" step="25" value={data.wagerMin} className="range-input" onChange={e=>setData(d=>({...d,wagerMin:+e.target.value}))}/></div></div><div className="onboard-field"><div className="onboard-field-label">Maximum per round</div><div className="range-val" style={{marginBottom:8}}>${data.wagerMax}</div><div className="range-track"><div className="range-fill" style={{width:`${(data.wagerMax/1000)*100}%`}}/><input type="range" min="0" max="1000" step="25" value={data.wagerMax} className="range-input" onChange={e=>setData(d=>({...d,wagerMax:+e.target.value}))}/></div></div></div>},
    {title:"How you like\nto play.",sub:"Select your favorite formats. You'll sort the rest out on the first tee.",content:<div className="onboard-field"><div className="onboard-field-label">Favorite games</div><div className="game-opts">{gameOpts.map(g=><div key={g} className={`game-opt ${data.games.includes(g)?"on":""}`} onClick={()=>setData(d=>({...d,games:d.games.includes(g)?d.games.filter(x=>x!==g):[...d.games,g]}))}>{g}</div>)}</div></div>},
    {title:"When do\nyou play?",sub:"This helps GIMME surface the right players at the right time.",content:<div><div className="onboard-field"><div className="onboard-field-label">Available Days</div><div className="days-grid">{days.map(d=><div key={d} className={`day-opt ${data.days.includes(d)?"on":""}`} onClick={()=>setData(dt=>({...dt,days:dt.days.includes(d)?dt.days.filter(x=>x!==d):[...dt.days,d]}))}>{d}</div>)}</div></div><div className="onboard-field"><div className="onboard-field-label">Distance Willing to Travel</div><div className="range-val" style={{marginBottom:8}}>25 mi</div><div className="range-track"><div className="range-fill" style={{width:"25%"}}/><input type="range" min="5" max="100" defaultValue="25" className="range-input" readOnly/></div></div></div>},
  ];
  const s=steps[step];
  return (
    <div className="onboard">
      <div className="onboard-step">Step {step+1} of {total}</div>
      <div className="onboard-title">{s.title}</div>
      <div className="onboard-sub">{s.sub}</div>
      <div style={{flex:1}}>{s.content}</div>
      <div className="onboard-bottom">
        <div className="step-dots">{Array.from({length:total}).map((_,i)=><div key={i} className={`step-dot ${i===step?"on":""}`}/>)}</div>
        <button className="btn btn-primary" onClick={()=>step<total-1?setStep(s=>s+1):onDone()}>{step<total-1?"Continue":"Enter the Clubhouse"}</button>
        {step>0&&<button className="btn btn-ghost" onClick={()=>setStep(s=>s-1)}>Back</button>}
      </div>
    </div>
  );
}

// ROOT
export default function GimmeApp() {
  const [nav, setNav] = useState("onboard");
  const [viewedProfile, setViewedProfile] = useState(null);
  const [prevNav, setPrevNav] = useState("feed");
  const [vouchTarget, setVouchTarget] = useState(null);
  const [threads, setThreads] = useState(initialThreads);
  const [activeThread, setActiveThread] = useState(null);
  const [toast, setToast] = useState({ on: false, msg: "", type: "" });

  const showToast = (msg, type="vouched") => { setToast({on:true,msg,type}); setTimeout(()=>setToast({on:false,msg:"",type:""}),2200); };

  const goTo = (screen) => { setPrevNav(nav); setNav(screen); };

  const openThread = (profileOrThread) => {
    if (profileOrThread.messages) {
      setActiveThread(profileOrThread);
    } else {
      const existing = threads.find(t=>t.profile.id===profileOrThread.id);
      if (existing) { setActiveThread(existing); }
      else {
        const t = { id:Date.now(), profile:profileOrThread, messages:[], wagerStatus:"pending_proposal", wagerAmount:100, course:profileOrThread.homeCourse, date:"Sat Mar 8", time:"8:00 AM" };
        setThreads(ts=>[...ts,t]);
        setActiveThread(t);
      }
    }
    goTo("chat");
  };

  const updateThread = (updated) => { setThreads(ts=>ts.map(t=>t.id===updated.id?updated:t)); setActiveThread(updated); };
  const openVouch = (profile) => { setVouchTarget(profile); setPrevNav(nav); setNav("vouch"); };

  const navItems = [{ id:"feed", icon:"⛳" },{ id:"requests", icon:"🔔" },{ id:"messages", icon:"💬" },{ id:"profile", icon:"👤" }];
  const showNav = !["onboard","viewProfile","vouch","standing","chat"].includes(nav);
  const pendingCount = threads.filter(t=>["pending_proposal","pending_fund"].includes(t.wagerStatus)).length;

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        <div className={`toast ${toast.on?"on":""} ${toast.type}`}>{toast.msg}</div>

        {nav==="onboard"&&<OnboardScreen onDone={()=>setNav("feed")}/>}
        {nav==="feed"&&<FeedScreen onViewProfile={p=>{setViewedProfile(p);goTo("viewProfile");}}/>}
        {nav==="requests"&&<RequestsScreen onOpenThread={p=>openThread(p)}/>}
        {nav==="messages"&&<MessagesScreen threads={threads} onOpenThread={t=>openThread(t)}/>}
        {nav==="chat"&&activeThread&&<ChatScreen thread={activeThread} onBack={()=>setNav("messages")} onUpdateThread={updateThread} showToast={showToast} onVouch={openVouch}/>}
        {nav==="profile"&&<MyProfileScreen onStanding={()=>goTo("standing")}/>}
        {nav==="standing"&&<StandingScreen onBack={()=>setNav("profile")}/>}
        {nav==="viewProfile"&&viewedProfile&&<ProfileScreen profile={viewedProfile} onBack={()=>setNav("feed")} onInterested={()=>{showToast(`Interested in ${viewedProfile.name}`,"interested");openThread(viewedProfile);}} onVouch={()=>openVouch(viewedProfile)}/>}
        {nav==="vouch"&&vouchTarget&&<VouchScreen profile={vouchTarget} onBack={()=>setNav(prevNav)} onSubmit={()=>{showToast(`Vouch submitted for ${vouchTarget.name}`,"vouched");setNav(prevNav);}}/>}

        {showNav&&(
          <div className="nav">
            {navItems.map(n=>(
              <div key={n.id} className={`nav-item ${nav===n.id?"on":""}`} onClick={()=>setNav(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                {n.id==="messages"&&pendingCount>0&&<div className="nav-badge">{pendingCount}</div>}
                <div className="nav-dot"/>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
