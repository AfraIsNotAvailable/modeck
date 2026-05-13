type Props = { onSetup: () => void; onDismiss: () => void };

export default function CertSetupPopup({ onSetup, onDismiss }: Props) {
  return (
    <div
      onClick={onDismiss}
      style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:150, padding:"24px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor:"#1a1a1a", borderRadius:"16px", padding:"24px", width:"100%", maxWidth:"400px", display:"flex", flexDirection:"column", gap:"12px" }}
      >
        <span style={{ color:"#fff", fontSize:"16px", fontWeight:600 }}>Install MoDeck as an app</span>
        <p style={{ color:"#888", fontSize:"13px", margin:0 }}>
          Install a trusted certificate first — takes about a minute. Tap outside to skip.
        </p>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={onSetup} style={{ flex:1, backgroundColor:"#3498db", border:"none", borderRadius:"8px", padding:"10px", color:"#fff", fontSize:"13px", cursor:"pointer" }}>
            Set up now
          </button>
          <button onClick={onDismiss} style={{ flex:1, backgroundColor:"#333", border:"none", borderRadius:"8px", padding:"10px", color:"#fff", fontSize:"13px", cursor:"pointer" }}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
