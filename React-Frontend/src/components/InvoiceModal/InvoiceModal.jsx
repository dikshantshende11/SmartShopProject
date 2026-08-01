import React from "react";
import "../../styles/invoice.css";

function InvoiceModal({ order, product, user, onClose }) {
  if (!order) return null;

  const GST_RATE = 0.18;
  const basePrice = product?.price * order.quantity || order.totalAmount;
  const gstAmount = +(basePrice * GST_RATE).toFixed(2);
  const grandTotal = +(basePrice + gstAmount).toFixed(2);
  const invoiceDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ss-invoice-overlay" onClick={onClose}>
      <div className="ss-invoice-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* ── Action Buttons (hidden in print) ── */}
        <div className="ss-invoice-actions no-print">
          <button className="ss-invoice-print-btn" onClick={handlePrint}>
            🖨️ Print / Save as PDF
          </button>
          <button className="ss-invoice-close-btn" onClick={onClose}>✕ Close</button>
        </div>

        {/* ── PRINTABLE INVOICE CONTENT ── */}
        <div className="ss-invoice-paper" id="invoice-content">

          {/* Header */}
          <div className="ss-invoice-header">
            <div className="ss-invoice-brand">
              <div className="ss-invoice-logo">
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                  <path d="M10 13C10 9 14 6 18 6C22 6 26 9 26 13C26 17 21 18 18 18" stroke="#4F46E5" strokeWidth="4.5" strokeLinecap="round"/>
                  <path d="M18 18C15 18 10 19 10 23C10 27 14 30 18 30C22 30 26 27 26 23" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round"/>
                  <circle cx="18" cy="18" r="2.5" fill="#4F46E5"/>
                </svg>
              </div>
              <div>
                <div className="ss-invoice-brand-name">SmartShop</div>
                <div className="ss-invoice-brand-tag">Premium E-Commerce Platform</div>
              </div>
            </div>
            <div className="ss-invoice-meta">
              <div className="ss-invoice-title">TAX INVOICE</div>
              <div className="ss-invoice-badge-paid">✅ PAID</div>
            </div>
          </div>

          <div className="ss-invoice-divider" />

          {/* Invoice Details Row */}
          <div className="ss-invoice-info-row">
            <div className="ss-invoice-info-block">
              <div className="ss-invoice-info-label">Invoice Number</div>
              <div className="ss-invoice-info-val">INV-SS-{order.id}-{new Date().getFullYear()}</div>
              <div className="ss-invoice-info-label mt-1">Invoice Date</div>
              <div className="ss-invoice-info-val">{invoiceDate}</div>
            </div>
            <div className="ss-invoice-info-block">
              <div className="ss-invoice-info-label">Billed To</div>
              <div className="ss-invoice-info-val fw-bold">{user?.name}</div>
              <div className="ss-invoice-info-val">{user?.email}</div>
              <div className="ss-invoice-info-val">Order #{order.id}</div>
            </div>
            <div className="ss-invoice-info-block">
              <div className="ss-invoice-info-label">Order Status</div>
              <div className={`ss-invoice-status-pill status-${order.status?.toLowerCase()}`}>
                {order.status}
              </div>
              <div className="ss-invoice-info-label mt-1">Payment Method</div>
              <div className="ss-invoice-info-val">Cash on Delivery</div>
            </div>
          </div>

          <div className="ss-invoice-divider" />

          {/* Product Table */}
          <table className="ss-invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Brand</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <div className="ss-invoice-product-name">{product?.name || `Product #${order.productId}`}</div>
                  {product?.category && <div className="ss-invoice-product-cat">{product.category}</div>}
                </td>
                <td>{product?.brand || "SmartShop"}</td>
                <td className="text-center">{order.quantity}</td>
                <td>₹{product?.price?.toLocaleString("en-IN") || "—"}</td>
                <td>₹{basePrice?.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>

          {/* Tax Summary */}
          <div className="ss-invoice-summary">
            <div className="ss-invoice-summary-row">
              <span>Subtotal</span>
              <span>₹{basePrice?.toLocaleString("en-IN")}</span>
            </div>
            <div className="ss-invoice-summary-row">
              <span>Delivery Charges</span>
              <span className="text-success">FREE</span>
            </div>
            <div className="ss-invoice-summary-row">
              <span>GST (18%)</span>
              <span>₹{gstAmount?.toLocaleString("en-IN")}</span>
            </div>
            <div className="ss-invoice-divider my-1" />
            <div className="ss-invoice-summary-row total">
              <span>Grand Total</span>
              <span>₹{grandTotal?.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="ss-invoice-footer">
            <div className="ss-invoice-footer-note">
              🙏 Thank you for shopping with <strong>SmartShop</strong>! This is a computer-generated invoice and does not require a signature.
            </div>
            <div className="ss-invoice-footer-legal">
              GST Rate: 18% · Subject to jurisdiction of courts in India · For queries: support@smartshop.in
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;
