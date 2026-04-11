const projectsData = {
  ocr: {
    company: "PT KAYABA INDONESIA",
    title: "Stock Opname OCR Monitoring System",
    stack: ["Laravel", "MySQL", "Bootstrap", "OCR API"],
    desc: "An internal system designed to streamline the stock opname process by automating data extraction from physical documents using Optical Character Recognition (OCR) and presenting the results through a real-time monitoring dashboard.",
    images: [],
    body: `
      <p>Digitizing the manual stock opname process to handle various formats of physical documents efficiently and accurately.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Developed an automated stock opname data extraction system using OCR integrated with a third-party vendor API.</li>
        <li>Built a real-time verification and monitoring dashboard to review, validate, and track extracted data efficiently.</li>
        <li>Significantly reduced manual data entry, improving process efficiency and data accuracy.</li>
      </ul>
    `,
  },
  budget: {
    company: "PT KAYABA INDONESIA",
    title: "Digitalized Master Budget System",
    stack: ["Laravel", "MySQL", "Bootstrap"],
    desc: "A web-based budget submission system designed to replace manual Excel-based processes, enabling faster, more structured, and easily monitored budget planning and approval workflows.",
    images: [],
    body: `
      <p>A comprehensive system that digitalizes the budget planning process.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Developed a web-based budget submission system to replace manual Excel workflows.</li>
        <li>Implemented document import and export features using supporting libraries to streamline budget data management.</li>
        <li>Designed a structured multi-level approval workflow across different management levels.</li>
        <li>Reduced the budget preparation and approval process from months to just a few days.</li>
      </ul>
    `,
  },
  assessment: {
    company: "PT KAYABA INDONESIA",
    title: "Employee Performance Assessment System",
    stack: ["Laravel", "MySQL", "Bootstrap"],
    desc: "A digital employee performance assessment system providing an internal dashboard for HR and management to structurally monitor employee performance and behavior.",
    images: [],
    body: `
      <p>A centralized platform to effectively track, evaluate, and summarize employee metrics.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Developed a summary dashboard for employee performance and behavior to assist HR and management in the evaluation process.</li>
        <li>Implemented a multi-criteria assessment system to objectively measure performance, discipline, and work behavior.</li>
        <li>Supported manual input by system users as well as import/export of assessment data via Excel to speed up the evaluation workflow.</li>
        <li>Improved evaluation process efficiency and reduced reliance on manual document-based processes.</li>
        <li>Ensured security and consistency of assessment data through system validation and access rights control.</li>
      </ul>
    `,
  },
  recruitment: {
    company: "PT KAYABA INDONESIA",
    title: "Recruitment System Enhancement",
    stack: ["MySQL", "Data Encryption", "OCR Verification"],
    desc: "An enhancement to the company’s recruitment system aimed at accelerating the candidate screening process and improving document security through automated verification and data encryption.",
    images: [],
    body: `
      <p>Upgrading the recruitment workflow with layers of security and automated validation.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Enhanced the recruitment system by implementing sensitive data encryption to improve applicant document security.</li>
        <li>Integrated OCR technology through a third-party vendor API to automatically verify identity documents and academic certificates.</li>
        <li>Enabled HR teams to accelerate document validation processes while minimizing manual input errors.</li>
      </ul>
    `,
  },
  monitoring: {
    company: "PT KAYABA INDONESIA",
    title: "Stock Monitoring System",
    stack: ["Laravel", "MySQL", "RESTful API", "Bootstrap"],
    desc: "An end-to-end stock monitoring system developed to provide internal teams with a real-time dashboard and suppliers with RESTful API access for stock management.",
    images: [],
    body: `
      <p>A comprehensive tracking solution bridging internal inventory management with external supplier data exchange through secure APIs.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Built internal dashboard to monitor stock levels, trends, and discrepancies in real-time.</li>
        <li>Developed RESTful API to enable supplier systems to push and pull stock data securely.</li>
        <li>Supported manual input within the system and import/export of stock data via Excel.</li>
        <li>Streamlined stock synchronization and improved accuracy of internal and supplier data exchange.</li>
      </ul>
    `,
  },
  documentControl: {
    company: "PT KAYABA INDONESIA",
    title: "Document Control System",
    stack: ["Laravel", "MySQL", "Bootstrap"],
    desc: "A web-based document management system allowing each department to upload documents for review and approval by the Quality Management System (QMS) Department before distribution.",
    images: [],
    body: `
      <p>A centralized system to manage the upload, review, approval, and distribution of internal company documents.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Developed a document management system to structure the workflow of upload, review, approval, and distribution.</li>
        <li>Implemented a review and approval mechanism by the QMS Department to ensure documents meet company quality standards.</li>
        <li>Implemented cross-departmental document access features tailored to specific access rights and operational needs.</li>
        <li>Improved accuracy and document traceability through centralized storage and consistent document control workflows.</li>
        <li>Streamlined the document distribution process through an automated delivery system and internal notifications.</li>
      </ul>
    `,
  },
};

let slideIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  const container = document.getElementById("content-container");
  const errorContainer = document.getElementById("error-container");

  if (projectId && projectsData[projectId]) {
    const data = projectsData[projectId];

    document.getElementById("detail-company").textContent = data.company;
    document.getElementById("detail-title").textContent = data.title;
    document.getElementById("detail-desc").textContent = data.desc;

    let sliderHTML = "";
    if (data.images && data.images.length > 0) {
      sliderHTML += `<div class="slider-container">`;

      data.images.forEach((img, index) => {
        let activeClass = index === 0 ? "active" : "";
        sliderHTML += `<div class="slide ${activeClass}"><img src="${img}" alt="Project Preview ${index + 1}"></div>`;
      });

      if (data.images.length > 1) {
        sliderHTML += `<div class="slider-dots">`;
        data.images.forEach((_, index) => {
          let activeClass = index === 0 ? "active" : "";
          sliderHTML += `<span class="dot ${activeClass}" onclick="goToSlide(${index})"></span>`;
        });
        sliderHTML += `</div>`;
      }
      sliderHTML += `</div>`;
    }

    document.getElementById("detail-slider").innerHTML = sliderHTML;
    document.getElementById("detail-body").innerHTML = data.body;

    const stackContainer = document.getElementById("detail-stack");
    stackContainer.innerHTML = "";
    data.stack.forEach((tech) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tech;
      stackContainer.appendChild(span);
    });

    if (data.images && data.images.length > 1) {
      setInterval(() => {
        changeSlide(1);
      }, 5000);
    }
  } else {
    container.style.display = "none";
    errorContainer.style.display = "block";
  }
});

window.changeSlide = function (n) {
  showSlides((slideIndex += n));
};

window.goToSlide = function (n) {
  showSlides((slideIndex = n));
};

window.showSlides = function (n) {
  let slides = document.querySelectorAll(".slide");
  let dots = document.querySelectorAll(".dot");
  if (!slides.length) return;

  if (n >= slides.length) slideIndex = 0;
  if (n < 0) slideIndex = slides.length - 1;

  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  slides[slideIndex].classList.add("active");
  if (dots.length > 0) dots[slideIndex].classList.add("active");
};
