import { useState } from "react";
import { getServerUrl } from "../api";

type Props = { onClose: () => void; installPrompt?: any };

const ua = navigator.userAgent;
const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(ua);

export default function CertSetupPage({ onClose, installPrompt }: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const downloadUrl = `${getServerUrl()}/setup/rootca`;

  return (
    <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"16px" }}>
      <div style={{ backgroundColor:"#1a1a1a", borderRadius:"16px", padding:"24px", width:"100%", maxWidth:"420px", display:"flex", flexDirection:"column", gap:"20px", maxHeight:"90dvh", overflowY:"auto" }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"#fff", fontSize:"18px", fontWeight:600 }}>Set up HTTPS</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#666", fontSize:"22px", cursor:"pointer", lineHeight:1, padding:"0 4px" }}>×</button>
        </div>

        <p style={{ color:"#888", fontSize:"13px", margin:0, lineHeight:1.5 }}>
          MoDeck needs a trusted certificate to install as a home screen app. Do this once per device.
        </p>

        <SetupStep num={1} active title="Download the certificate">
          <a
            href={downloadUrl}
            download="MoDeck-CA.pem"
            onClick={() => setDownloaded(true)}
            style={linkBtnStyle}
          >
            Download MoDeck-CA.pem
          </a>
          {isIOS && (
            <p style={{ color:"#666", fontSize:"12px", margin:"6px 0 0" }}>Use Safari — Chrome on iOS can't install certificates.</p>
          )}
        </SetupStep>

        <SetupStep num={2} active={downloaded} title="Install the certificate">
          {isIOS ? (
            <ol style={listStyle}>
              <li>Tap <b style={hl}>Allow</b> in the download prompt</li>
              <li>Open <b style={hl}>Settings → General → VPN & Device Management</b></li>
              <li>Tap <b style={hl}>MoDeck CA</b> → Install → enter passcode</li>
              <li>Open <b style={hl}>Settings → General → About → Certificate Trust Settings</b></li>
              <li>Toggle on <b style={hl}>MoDeck CA</b> → Continue</li>
            </ol>
          ) : isAndroid ? (
            <ol style={listStyle}>
              <li>Tap the <b style={hl}>download notification</b> at the bottom of Chrome</li>
              <li>If dismissed: open <b style={hl}>Files → Downloads</b></li>
              <li style={{ color:"#555" }}>Path: <code style={{ fontSize:"11px", color:"#888" }}>/storage/emulated/0/Download/MoDeck-CA.pem</code></li>
              <li>Tap <b style={hl}>MoDeck-CA.pem</b> → name it <b style={hl}>MoDeck CA</b> → OK</li>
            </ol>
          ) : (
            <p style={{ color:"#aaa", fontSize:"13px", margin:0 }}>
              Open <b style={hl}>MoDeck-CA.pem</b> from your downloads and install it as a trusted root CA.
            </p>
          )}
        </SetupStep>

        <SetupStep num={3} active={downloaded} title="Reload and install">
          <p style={{ color:"#aaa", fontSize:"13px", margin:"0 0 10px" }}>
            After installing, reload — then use the button below to install the app.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <button onClick={() => window.location.reload()} style={btnStyle("#2a2a2a")}>
              Reload page
            </button>
            {installPrompt && (
              <button onClick={() => installPrompt.prompt()} style={btnStyle("#22c55e")}>
                Install app
              </button>
            )}
          </div>
        </SetupStep>

        <button onClick={onClose} style={btnStyle("#2a2a2a")}>Close</button>
      </div>
    </div>
  );
}

function SetupStep({ num, active, title, children }: { num: number; active: boolean; title: string; children: React.ReactNode }) {
  return (
    <div style={{ opacity: active ? 1 : 0.35, display:"flex", flexDirection:"column", gap:"10px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        <div style={{ width:"22px", height:"22px", borderRadius:"50%", backgroundColor: active ? "#3498db" : "#333", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", color:"#fff", fontWeight:700, flexShrink:0 }}>
          {num}
        </div>
        <span style={{ color:"#fff", fontSize:"14px", fontWeight:500 }}>{title}</span>
      </div>
      <div style={{ paddingLeft:"32px" }}>{children}</div>
    </div>
  );
}

const listStyle: React.CSSProperties = { color:"#aaa", fontSize:"13px", margin:0, paddingLeft:"16px", display:"flex", flexDirection:"column", gap:"8px" };
const hl: React.CSSProperties = { color:"#fff" };
const linkBtnStyle: React.CSSProperties = { display:"block", backgroundColor:"#3498db", border:"none", borderRadius:"8px", padding:"10px 16px", color:"#fff", cursor:"pointer", fontSize:"13px", textAlign:"center", textDecoration:"none" };
const btnStyle = (bg: string): React.CSSProperties => ({ backgroundColor:bg, border:"none", borderRadius:"8px", padding:"10px 16px", color:"#fff", cursor:"pointer", fontSize:"13px", width:"100%" });
