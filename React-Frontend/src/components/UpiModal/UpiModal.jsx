import { useState, useEffect } from "react";
import "../../styles/payment.css";

function UpiModal({ total, onSuccess, onClose }) {
  const [step, setStep] = useState("qr"); // "qr" | "processing" | "success"
  const [timer, setTimer] = useState(180); // 3 minutes timer
  const [copied, setCopied] = useState(false);
  const upiId = "smartshop@upi";

  const upiString = `upi://pay?pa=${upiId}&pn=SmartShop%20Store&am=${total}&cu=INR&tn=Order%20Payment`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiString)}&color=0f172a&bgcolor=ffffff`;

  // Timer Countdown Effect
  useEffect(() => {
    if (step !== "qr") return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, onClose]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 2200);
    }, 2500);
  };

  return (
    <div className="ss-payment-overlay" onClick={onClose}>
      <div className="ss-payment-modal ss-upi-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="ss-payment-header">
          <div className="ss-payment-header-left">
            <span className="ss-payment-lock">📱</span>
            <div>
              <div className="ss-payment-title">UPI Instant Payment</div>
              <div className="ss-payment-subtitle">Scan & Pay via GPay, PhonePe, Paytm, BHIM</div>
            </div>
          </div>
          <button className="ss-payment-close" onClick={onClose}>✕</button>
        </div>

        {/* AMOUNT BAR */}
        <div className="ss-payment-amount-bar">
          <span>Amount to Pay</span>
          <span className="ss-payment-amount-val">₹{total?.toLocaleString("en-IN")}</span>
        </div>

        {step === "qr" && (
          <div className="ss-upi-body">
            {/* TIMER BADGE */}
            <div className="ss-upi-timer-badge">
              ⏳ QR Code expires in <strong className="ms-1">{formatTimer(timer)}</strong>
            </div>

            {/* QR CODE CONTAINER */}
            <div className="ss-upi-qr-card">
              <div className="ss-upi-qr-wrapper">
                <img src={qrUrl} alt="UPI QR Code" className="ss-upi-qr-img" />
                <div className="ss-upi-qr-logo">🇮🇳 UPI</div>
              </div>
              <p className="ss-upi-scan-text">
                Scan with any UPI App to Pay
              </p>
            </div>

            {/* SUPPORTED APPS BADGES */}
            <div className="ss-upi-apps">
              <div className="ss-upi-app-badge gpay">
                <span>🔵🔴</span> GPay
              </div>
              <div className="ss-upi-app-badge phonepe">
                <span>💜</span> PhonePe
              </div>
              <div className="ss-upi-app-badge paytm">
                <span>💙</span> Paytm
              </div>
              <div className="ss-upi-app-badge bhim">
                <span>🇮🇳</span> BHIM
              </div>
            </div>

            {/* COPY VPA SECTION */}
            <div className="ss-upi-vpa-box">
              <div className="ss-upi-vpa-info">
                <span className="ss-upi-vpa-label">UPI ID / VPA</span>
                <span className="ss-upi-vpa-val">{upiId}</span>
              </div>
              <button className="ss-upi-copy-btn" onClick={handleCopy}>
                {copied ? "✅ Copied" : "📋 Copy"}
              </button>
            </div>

            {/* DEMO / SIMULATION ACTION */}
            <button className="ss-pay-btn ss-upi-sim-btn mt-3" onClick={handleSimulatePayment}>
              ⚡ Simulate UPI Payment Success
            </button>

            <div className="ss-payment-trust mt-2">
              <span>🔒 100% Encrypted</span>
              <span>⚡ Instant Settlement</span>
              <span>✅ NPCI Verified</span>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="ss-payment-processing">
            <div className="ss-pay-spinner" />
            <div className="ss-processing-title">Waiting for UPI Confirmation...</div>
            <div className="ss-processing-sub">Please complete payment in your UPI app</div>
            <div className="ss-processing-steps">
              <div className="ss-proc-step done">✅ QR Code Scanned</div>
              <div className="ss-proc-step active">⏳ Verifying payment with bank</div>
              <div className="ss-proc-step">🏦 Transferring funds</div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="ss-payment-success">
            <div className="ss-success-ring">
              <span className="ss-success-check">✅</span>
            </div>
            <div className="ss-success-title">UPI Payment Successful!</div>
            <div className="ss-success-sub">₹{total?.toLocaleString("en-IN")} received via UPI</div>
            <div className="ss-success-sub">Placing your order now...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpiModal;
