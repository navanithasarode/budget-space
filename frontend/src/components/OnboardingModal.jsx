import React, { useState } from "react";

export default function OnboardingModal({ step = 1, onComplete }) {
  const [selected, setSelected] = useState("");

  const peopleOptions = [
    "Just me",
    "Family",
    "Friends",
    "Partner",
    "Other",
  ];

  const purposeOptions = [
    "Trip / Travel",
    "Monthly expenses",
    "Birthday / Celebration",
    "Education",
    "Healthcare",
    "Shopping",
    "Work / Business",
    "Saving for something",
    "Other",
  ];

  const firstActionOptions = [
    "Create my first Budget Space",
    "Explore the dashboard",
  ];

  let options;
  let title;
  let description;
  let icon;

  if (step === 1) {
    options = peopleOptions;
    title = "Who are you budgeting with?";
    description = "Tell us who this Budget Space is for.";
    icon = "👋";
  } else if (step === 2) {
    options = purposeOptions;
    title = "What is this budget tracker for?";
    description = "Choose what you're planning or keeping track of.";
    icon = "";
  } else {
    options = firstActionOptions;
    title = "What would you like to do first?";
    description = "You can always change things later.";
    icon = "🚀";
  }

  function continueNext() {
    if (!selected) return;

    onComplete(selected);
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-modal">

        <div className="onboarding-step">
          Step {step} of 3
        </div>

        {icon && (
          <div className="onboarding-icon">
            {icon}
          </div>
        )}

        <h2>{title}</h2>

        <p>{description}</p>

        <div className="onboarding-options">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={
                selected === option
                  ? "onboarding-option selected"
                  : "onboarding-option"
              }
              onClick={() => setSelected(option)}
            >
              <span className="option-circle">
                {selected === option ? "✓" : ""}
              </span>

              {option}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="primary-button onboarding-continue"
          disabled={!selected}
          onClick={continueNext}
        >
          {step === 3 ? "Let's get started →" : "Continue →"}
        </button>

      </div>
    </div>
  );
}