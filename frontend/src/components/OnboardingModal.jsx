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

  const options = step === 1 ? peopleOptions : purposeOptions;

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

        <div className="onboarding-icon">
          {step === 1 ? "👋" : "✨"}
        </div>

        <h2>
          {step === 1
            ? "Who are you budgeting with?"
            : "What is this budget tracker for?"}
        </h2>

        <p>
          {step === 1
            ? "Tell us who this Budget Space is for."
            : "Choose what you’re planning or keeping track of."}
        </p>

        <div className="onboarding-options">
          {options.map((option) => (
            <button
              key={option}
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
          className="primary-button onboarding-continue"
          disabled={!selected}
          onClick={continueNext}
        >
          Continue →
        </button>

      </div>
    </div>
  );
}