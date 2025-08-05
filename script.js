document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('multiStepForm');
  const formSteps = Array.from(document.querySelectorAll('.form-step'));
  const progress = document.getElementById('progress');
  const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
  const summary = document.getElementById('summary');

  let currentStep = 0;

  // Load saved data if exists (Autosave)
  loadFormData();

  updateForm();

  // Button event listeners for each step

  // Step 1 Next
  document.getElementById('nextBtn1').addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      updateForm();
      saveFormData();
    }
  });

  // Step 2 Prev & Next
  document.getElementById('prevBtn2').addEventListener('click', () => {
    currentStep--;
    updateForm();
  });
  document.getElementById('nextBtn2').addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      updateForm();
      saveFormData();
    }
  });

  // Step 3 Prev & Next
  document.getElementById('prevBtn3').addEventListener('click', () => {
    currentStep--;
    updateForm();
  });
  document.getElementById('nextBtn3').addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      updateForm();
      saveFormData();
    }
  });

  // Summary Prev
  document.getElementById('prevBtnSummary').addEventListener('click', () => {
    currentStep--;
    updateForm();
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Form submitted successfully!');
    localStorage.removeItem('multiStepFormData');
    form.reset();
    currentStep = 0;
    updateForm();
  });

  // On input change, autosave data
  form.querySelectorAll('input').forEach(input =>
    input.addEventListener('input', saveFormData)
  );

  function updateForm() {
    // Show current step and hide others with transition
    formSteps.forEach((step, index) => {
      step.classList.toggle('form-step-active', index === currentStep);
    });

    // Update progress bar
    const progressPercent = (currentStep) / (formSteps.length - 1) * 100; 
    progress.style.width = progressPercent + '%';

    // Update progress steps active class
    progressSteps.forEach((step, idx) => {
      if (idx <= currentStep) {
        step.classList.add('progress-step-active');
      } else {
        step.classList.remove('progress-step-active');
      }
    });

    if (currentStep === formSteps.length - 1) {
      displaySummary();
    }
  }

  function validateStep(step) {
    const inputs = formSteps[step].querySelectorAll('input[required]');
    for (let input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }
    return true;
  }

  function displaySummary() {
    // Gather form data
    const formData = new FormData(form);
    let text = '';
    for (let [key, value] of formData.entries()) {
      // prettier key to label
      let label = key.replace(/([A-Z])/g, ' $1');
      label = label.charAt(0).toUpperCase() + label.slice(1);
      if (value.trim() === '') value = '-';
      text += `${label}: ${value}\n`;
    }
    summary.textContent = text;
  }

  function saveFormData() {
    const formData = {};
    form.querySelectorAll('input').forEach(input => {
      formData[input.name] = input.value;
    });
    localStorage.setItem('multiStepFormData', JSON.stringify(formData));
  }

  function loadFormData() {
    const savedData = JSON.parse(localStorage.getItem('multiStepFormData'));
    if (savedData) {
      for (let key in savedData) {
        const input = form.querySelector(`input[name="${key}"]`);
        if (input) input.value = savedData[key];
      }
    }
  }
});
