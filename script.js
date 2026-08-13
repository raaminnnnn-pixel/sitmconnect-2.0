/**
 * CampusFix — Vanilla JavaScript Logic Core
 * Formatted for 1st-Semester CSE Student Explanation
 * 
 * Concepts covered:
 * - DOM manipulation & Event Listeners
 * - LocalStorage state persistence
 * - Array methods: filter(), map(), find()
 * - Counter animation with setInterval() / requestAnimationFrame()
 */

// 1. Initial Sample Data Array
const initialReports = [
  {
    id: "CF-1024",
    title: "Broken Ceiling Fan in Room 204",
    category: "Electricity",
    location: "CSE Block",
    priority: "High",
    status: "Reported",
    upvotes: 14
  },
  {
    id: "CF-1023",
    title: "Water Leakage Near Washroom Sink",
    category: "Water",
    location: "Boys Hostel",
    priority: "Medium",
    status: "In Progress",
    upvotes: 22
  }
];

// 2. LocalStorage Helper Functions
function loadReportsFromStorage() {
  const saved = localStorage.getItem("campusfix_reports");
  return saved ? JSON.parse(saved) : initialReports;
}

function saveReportsToStorage(reportsArray) {
  localStorage.setItem("campusfix_reports", JSON.stringify(reportsArray));
}

// 3. Report ID Generator (e.g. CF-1025)
function generateReportId(currentCount) {
  const baseId = 1024;
  return `CF-${baseId + currentCount}`;
}

// 4. Upvote Function
function upvoteReport(reportId, reportsArray) {
  const item = reportsArray.find(r => r.id === reportId);
  if (item) {
    item.upvotes += 1;
    saveReportsToStorage(reportsArray);
  }
}

// 5. Status Update Function (Admin)
function updateReportStatus(reportId, newStatus, reportsArray) {
  const item = reportsArray.find(r => r.id === reportId);
  if (item) {
    item.status = newStatus;
    saveReportsToStorage(reportsArray);
  }
}

console.log("CampusFix script logic initialized.");
