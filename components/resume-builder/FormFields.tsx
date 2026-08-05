interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className="builder-field">
      <label htmlFor={htmlFor} className="builder-label">
        {label}
      </label>
      {children}
      {hint ? <p className="builder-hint">{hint}</p> : null}
      {error ? (
        <p className="builder-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function FormInput({ error, className = "", ...props }: FormInputProps) {
  return (
    <input
      className={`builder-input ${error ? "builder-input--error" : ""} ${className}`}
      {...props}
    />
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function FormTextarea({ error, className = "", ...props }: FormTextareaProps) {
  return (
    <textarea
      className={`builder-textarea ${error ? "builder-input--error" : ""} ${className}`}
      {...props}
    />
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function FormSelect({ error, className = "", children, ...props }: FormSelectProps) {
  return (
    <select
      className={`builder-select ${error ? "builder-input--error" : ""} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

interface BuilderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function BuilderButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: BuilderButtonProps) {
  return (
    <button
      type="button"
      className={`builder-btn builder-btn--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
