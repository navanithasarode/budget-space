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
      {
        id: "g1",
        title: "Hotel",
        amount: 8000,
        category: "Accommodation",
        date: "2026-09-06",
        paidBy: "Me",
        note: "3 nights"
      },
      {
        id: "g2",
        title: "Food",
        amount: 2500,
        category: "Food",
        date: "2026-09-07",
        paidBy: "Alex",
        note: "Beach dinner"
      },
      {
        id: "g3",
        title: "Transport",
        amount: 3000,
        category: "Transport",
        date: "2026-09-07",
        paidBy: "Me",
        note: ""
      }
    ]
  }
];

export const categories = [
  "Food",
  "Transport",
  "Accommodation",
  "Shopping",
  "Entertainment",
  "Medical",
  "Education",
  "Bills",
  "Gifts",
  "Household",
  "Other"
];

export const types = [
  "Personal",
  "Trip",
  "Birthday",
  "Wedding/Event",
  "Healthcare",
  "Insurance",
  "Household",
  "Education",
  "Shopping",
  "Vehicle",
  "Project",
  "Custom"
];