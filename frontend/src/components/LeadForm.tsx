import { useState } from "react";

import type { NewLeadInput } from "../types/lead";

interface LeadFormProps {
  onSubmit: (input: NewLeadInput) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const emptyForm: NewLeadInput = {
  name: "",
  email: "",
  phone: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LeadForm = ({ onSubmit }: LeadFormProps) => {
  const [form, setForm] = useState<NewLeadInput>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (nextForm: NewLeadInput): FormErrors => {
    const nextErrors: FormErrors = {};

    if (nextForm.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!emailRegex.test(nextForm.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    const digitsOnly = nextForm.phone.replace(/\D/g, "");
    if (digitsOnly.length < 7) {
      nextErrors.phone = "Phone must include at least 7 digits.";
    }

    return nextErrors;
  };

  const handleChange = (field: keyof NewLeadInput, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });

    setForm(emptyForm);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="lead-name">
            Name
          </label>
          <input
            id="lead-name"
            type="text"
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="field-input"
            placeholder="Jane Doe"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="field-error">{errors.name}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor="lead-email">
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="field-input"
            placeholder="jane@example.com"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor="lead-phone">
            Phone
          </label>
          <input
            id="lead-phone"
            type="tel"
            value={form.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            className="field-input"
            placeholder="(415) 555-0101"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="btn-icon">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add lead
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
