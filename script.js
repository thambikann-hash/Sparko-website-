/* =========================================================
   SPARKO HOME CARE — SCRIPT.JS
   ---------------------------------------------------------
   EDIT YOUR BUSINESS INFO HERE — AND ONLY HERE.
   Every button, phone link, WhatsApp link and email link on
   the whole website reads from this one object.
   ========================================================= */
const SPARKO_CONFIG = {
  whatsappNumber: "918778174076",       // digits only, country code first, no + or spaces
  phoneNumber: "+91 8778174076",        // shown on the site and used by the "Call Now" button
  email: "sparko.homecare@gmail.com",
  googleMapsUrl: "YOUR_GOOGLE_MAPS_LINK" // paste your full Google Maps share link here
};

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Fill in contact info from config ---------- */
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  setText("contactPhoneText", SPARKO_CONFIG.phoneNumber);
  setText("contactWhatsappText", SPARKO_CONFIG.phoneNumber);
  setText("contactEmailText", SPARKO_CONFIG.email);
  setText("footerPhoneText", SPARKO_CONFIG.phoneNumber);
  setText("footerWhatsappText", SPARKO_CONFIG.phoneNumber);
  setText("footerEmailText", SPARKO_CONFIG.email);

  const callBtn = document.getElementById("callNowBtn");
  if (callBtn) callBtn.href = `tel:${SPARKO_CONFIG.phoneNumber.replace(/\s+/g, "")}`;

  const mapsBtn = document.getElementById("mapsBtn");
  if (mapsBtn) mapsBtn.href = SPARKO_CONFIG.googleMapsUrl;

  /* ---------- WhatsApp helper ---------- */
  // Builds a wa.me link with a pre-filled, URL-encoded message.
  function buildWhatsappLink(message) {
    const cleanNumber = SPARKO_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsapp(message) {
    window.open(buildWhatsappLink(message), "_blank", "noopener");
  }

  /* ---------- Hero + header + footer + floating WhatsApp buttons ---------- */
  const genericMessage = "Hello SPARKO Home Care, I would like to know more about your products.";

  const heroWhatsapp = document.getElementById("heroWhatsapp");
  if (heroWhatsapp) heroWhatsapp.href = buildWhatsappLink(genericMessage);

  const contactWhatsappBtn = document.getElementById("contactWhatsappBtn");
  if (contactWhatsappBtn) contactWhatsappBtn.href = buildWhatsappLink(genericMessage);

  const floatingWhatsapp = document.getElementById("floatingWhatsapp");
  if (floatingWhatsapp) floatingWhatsapp.href = buildWhatsappLink(genericMessage);

  /* ---------- Product "Enquire on WhatsApp" buttons ---------- */
  document.querySelectorAll(".enquire-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productName = btn.getAttribute("data-product");
      const message = `Hello SPARKO Home Care, I am interested in ${productName}. Please share product details and price.`;
      openWhatsapp(message);
    });
  });

  /* ---------- Become a Partner button ---------- */
  const partnerBtn = document.getElementById("partnerBtn");
  if (partnerBtn) {
    partnerBtn.addEventListener("click", () => {
      openWhatsapp("Hello SPARKO Home Care, I am interested in becoming a SPARKO business partner. Please share the details.");
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Enquiry form ---------- */
  const form = document.getElementById("enquiryForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.fName.value.trim();
      const mobile = form.fMobile.value.trim();
      const email = form.fEmail.value.trim();
      const product = form.fProduct.value;
      const quantity = form.fQuantity.value.trim();
      const enquiryType = form.fType.value;
      const message = form.fMessage.value.trim();

      // Clear previous errors
      ["fName", "fMobile", "fType"].forEach((id) => {
        document.getElementById(id).closest(".form-row").classList.remove("invalid");
        const errEl = document.getElementById(`err-${id}`);
        if (errEl) errEl.textContent = "";
      });

      // Validate required fields: Name, Mobile Number, Enquiry Type
      let isValid = true;
      if (!name) {
        showError("fName", "Please enter your name.");
        isValid = false;
      }
      if (!mobile) {
        showError("fMobile", "Please enter your mobile number.");
        isValid = false;
      } else if (!/^[0-9+\s-]{7,15}$/.test(mobile)) {
        showError("fMobile", "Please enter a valid mobile number.");
        isValid = false;
      }
      if (!enquiryType) {
        showError("fType", "Please select an enquiry type.");
        isValid = false;
      }

      if (!isValid) return;

      /*
        CONNECT TO A BACKEND LATER (OPTIONAL):
        Right now, connectToBackend() does nothing — the enquiry only goes
        to WhatsApp. If you later want enquiries saved to email, Google
        Sheets, Formspree or your own server, write that code inside
        connectToBackend() below and call it here, for example:

          fetch("https://formspree.io/f/your-form-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, mobile, email, product, quantity, enquiryType, message })
          });
      */
      connectToBackend({ name, mobile, email, product, quantity, enquiryType, message });

      const waMessage =
        "Hello SPARKO Home Care,\n\n" +
        "I would like to make an enquiry.\n\n" +
        `Name: ${name}\n` +
        `Mobile: ${mobile}\n` +
        (email ? `Email: ${email}\n` : "") +
        `Product: ${product || "Not specified"}\n` +
        `Quantity: ${quantity || "Not specified"}\n` +
        `Enquiry Type: ${enquiryType}\n` +
        `Message: ${message || "-"}`;

      openWhatsapp(waMessage);
      form.reset();
    });
  }

  function showError(fieldId, text) {
    const field = document.getElementById(fieldId);
    field.closest(".form-row").classList.add("invalid");
    const errEl = document.getElementById(`err-${fieldId}`);
    if (errEl) errEl.textContent = text;
  }

  // Placeholder for a future backend/CRM connection. Safe to leave empty.
  function connectToBackend(enquiryData) {
    // See comment above — add your Formspree/Google Forms/CRM code here later.
  }

  /* ---------- Graceful placeholder for missing product photos ---------- */
  // Until you upload your own photos into the images/ folder, this hides the
  // broken-image icon and shows a clean gradient placeholder instead.
  document.querySelectorAll(".product-img-wrap img, .hero-img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });

  /* ---------- Reveal-on-scroll animation ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
