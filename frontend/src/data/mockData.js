export const mockBudgets = [
  {
    id: "goa",
    name: "Goa Trip",
    description: "Weekend with friends",
    type: "Trip",
    budgetAmount: 30000,
    currency: "INR",
    startDate: "2026-10-10",
    endDate: "2026-10-13",
    expenses: [
      { id: "g1", title: "Hotel", amount: 8000, category: "Accommodation", date: "2026-09-06", paidBy: "Me", note: "3 nights" },
      { id: "g2", title: "Food", amount: 2500, category: "Food", date: "2026-09-07", paidBy: "Alex", note: "Beach dinner" },
      { id: "g3", title: "Transport", amount: 3000, category: "Transport", date: "2026-09-07", paidBy: "Me", note: "" }
    ]
  },
  {
    id: "hospital",
    name: "Hospital Expenses",
    description: "Treatment expense tracking",
    type: "Healthcare",
    budgetAmount: 100000,
    currency: "INR",
    expenses: [
      { id: "h1", title: "Hospital", amount: 35000, category: "Medical", date: "2026-09-02", paidBy: "Me", note: "Initial bill" },
      { id: "h2", title: "Medicine", amount: 8400, category: "Medical", date: "2026-09-04", paidBy: "Me", note: "" },
      { id: "h3", title: "Tests", amount: 12000, category: "Medical", date: "2026-09-05", paidBy: "Me", note: "" }
    ],
    healthcare: {
      patientName: "Family Member",
      hospital: "City Hospital",
      insuranceProvider: "Health Secure",
      insuranceCoverage: 50000,
      claimAmount: 50000,
      approvedAmount: 30000,
      pendingAmount: 20000,
      outOfPocket: 25400,
      claimStatus: "Under review"
    }
  },
  {
    id: "birthday",
    name: "Dad's Birthday",
    description: "Small family celebration",
    type: "Birthday",
    budgetAmount: 15000,
    currency: "INR",
    expenses: [
      { id: "b1", title: "Cake", amount: 1200, category: "Gifts", date: "2026-08-29", paidBy: "Me", note: "" },
      { id: "b2", title: "Gift", amount: 3500, category: "Shopping", date: "2026-08-30", paidBy: "Me", note: "" },
      { id: "b3", title: "Decorations", amount: 2000, category: "Other", date: "2026-08-30", paidBy: "Me", note: "" },
      { id: "b4", title: "Dinner", amount: 2800, category: "Food", date: "2026-08-31", paidBy: "Me", note: "" }
    ]
  },
  {
    id: "home",
    name: "Monthly Household",
    description: "September household spending",
    type: "Household",
    budgetAmount: 25000,
    currency: "INR",
    expenses: [
      { id: "m1", title: "Groceries", amount: 5000, category: "Household", date: "2026-09-01", paidBy: "Me", note: "" },
      { id: "m2", title: "Electricity", amount: 2100, category: "Bills", date: "2026-09-03", paidBy: "Me", note: "" },
      { id: "m3", title: "Internet", amount: 900, category: "Bills", date: "2026-09-04", paidBy: "Me", note: "" }
    ]
  },
  {
    id: "college",
    name: "College Event",
    description: "Club event budget",
    type: "Education",
    budgetAmount: 20000,
    currency: "INR",
    expenses: [
      { id: "c1", title: "Printing", amount: 1800, category: "Education", date: "2026-09-01", paidBy: "Me", note: "" },
      { id: "c2", title: "Venue", amount: 6500, category: "Other", date: "2026-09-02", paidBy: "Me", note: "" }
    ]
  }
];

export const categories = ["Food", "Transport", "Accommodation", "Shopping", "Entertainment", "Medical", "Education", "Bills", "Gifts", "Household", "Other"];
export const types = ["Personal", "Trip", "Birthday", "Wedding/Event", "Healthcare", "Insurance", "Household", "Education", "Shopping", "Vehicle", "Project", "Custom"];
