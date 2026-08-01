import { useState } from "react";
import "../../styles/payment.css";

const CARD_TYPES = {
  visa: { name: "Visa", icon: "💳", pattern: /^4/ },
  mastercard: { name: "Mastercard", icon: "🔴", pattern: /^5[1-5]/ },
  rupay: { name: "RuPay", icon: "🇮🇳", pattern: /^6/ },
  amex: { name: "Amex", icon: "🔵", pattern: /^3[47]/ },
};

function detectCardType(number) {
  const cleaned = number.replace(/\s/g, "");
  for (const [key, type] of Object.entries(CARD_TYPES)) {
    if (type.pattern.test(cleaned)) return { key, ...type };
  }
  return null;
}

function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .substring(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const cleaned = value.replace(/\D/g, "").substring(0, 4);
  if (cleaned.length >= 3) return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
  return cleaned;
}

function PaymentModal({ total, onSuccess, onClose }) {
  const [step, setStep] = useState("form"); // "form" | "processing" | "success"
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [cardType, setCardType] = useState(null);

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
  };

  const validate = () => {
    const errs = {};
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length < 16) errs.cardNumber = "Enter a valid 16-digit card number";
    if (!cardName.trim()) errs.cardName = "Card holder name is required";
    const [mm, yy] = (expiry || "").split("/");
    if (!mm || !yy || +mm > 12 || +mm < 1) errs.expiry = "Enter a valid expiry (MM/YY)";
    if (cvv.length < 3) errs.cvv = "CVV must be 3-4 digits";
    return errs;
  };

  const handlePay = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 2500);
    }, 2500);
  };

  return (
    <div className="ss-payment-overlay" onClick={onClose}>
      <div className="ss-payment-modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="ss-payment-header">
          <div className="ss-payment-header-left">
            <span className="ss-payment-lock">🔒</span>
            <div>
              <div className="ss-payment-title">Secure Payment</div>
              <div className="ss-payment-subtitle">SSL encrypted · 256-bit security</div>
            </div>
          </div>
          <button className="ss-payment-close" onClick={onClose}>✕</button>
        </div>

        {/* AMOUNT DUE */}
        <div className="ss-payment-amount-bar">
          <span>Amount Due</span>
          <span className="ss-payment-amount-val">₹{total?.toLocaleString("en-IN")}</span>
        </div>

        {step === "form" && (
          <div className="ss-payment-form">

            {/* CARD PREVIEW */}
            <div className="ss-card-preview">
              <div className="ss-card-chip">💳</div>
              <div className="ss-card-number-display">
                {cardNumber || "•••• •••• •••• ••••"}
              </div>
              <div className="ss-card-bottom-row">
                <div>
                  <div className="ss-card-label">Card Holder</div>
                  <div className="ss-card-value">{cardName || "YOUR NAME"}</div>
                </div>
                <div>
                  <div className="ss-card-label">Expires</div>
                  <div className="ss-card-value">{expiry || "MM/YY"}</div>
                </div>
                {cardType && (
                  <div className="ss-card-type-badge">
                    {cardType.icon} {cardType.name}
                  </div>
                )}
              </div>
            </div>

            {/* FORM FIELDS */}
            <div className="ss-pf-group">
              <label className="ss-pf-label">
                Card Number
                {cardType && <span className="ss-card-type-tag">{cardType.icon} {cardType.name}</span>}
              </label>
              <input
                className={`ss-pf-input ${errors.cardNumber ? "error" : ""}`}
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
              />
              {errors.cardNumber && <div className="ss-pf-error">{errors.cardNumber}</div>}
            </div>

            <div className="ss-pf-group">
              <label className="ss-pf-label">Card Holder Name</label>
              <input
                className={`ss-pf-input ${errors.cardName ? "error" : ""}`}
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                maxLength={26}
              />
              {errors.cardName && <div className="ss-pf-error">{errors.cardName}</div>}
            </div>

            <div className="ss-pf-row">
              <div className="ss-pf-group">
                <label className="ss-pf-label">Expiry Date</label>
                <input
                  className={`ss-pf-input ${errors.expiry ? "error" : ""}`}
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
                {errors.expiry && <div className="ss-pf-error">{errors.expiry}</div>}
              </div>
              <div className="ss-pf-group">
                <label className="ss-pf-label">CVV / CVC</label>
                <input
                  className={`ss-pf-input ${errors.cvv ? "error" : ""}`}
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                  maxLength={4}
                />
                {errors.cvv && <div className="ss-pf-error">{errors.cvv}</div>}
              </div>
            </div>

            <button className="ss-pay-btn" onClick={handlePay}>
              🔐 Pay ₹{total?.toLocaleString("en-IN")} Now
            </button>

            <div className="ss-payment-trust">
              <span>🛡️ Razorpay Secured</span>
              <span>🔒 256-bit SSL</span>
              <span>✅ PCI DSS Compliant</span>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="ss-payment-processing">
            <div className="ss-pay-spinner" />
            <div className="ss-processing-title">Processing Payment...</div>
            <div className="ss-processing-sub">Please do not close this window</div>
            <div className="ss-processing-steps">
              <div className="ss-proc-step done">✅ Verifying card details</div>
              <div className="ss-proc-step active">⏳ Authorizing payment</div>
              <div className="ss-proc-step">🏦 Confirming with bank</div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="ss-payment-success">
            <div className="ss-success-ring">
              <span className="ss-success-check">✅</span>
            </div>
            <div className="ss-success-title">Payment Successful!</div>
            <div className="ss-success-sub">₹{total?.toLocaleString("en-IN")} paid successfully</div>
            <div className="ss-success-sub">Redirecting to confirmation...</div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PaymentModal;
