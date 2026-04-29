'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { Locale, Messages } from '@/lib/i18n/config';
import { logClientAnalytics } from '@/lib/analyticsClient';
import { isValidEmail } from '@/lib/validation';
import { validateImageFile, uploadImageToStorage, generateImagePreview, revokeImagePreview } from '@/lib/imageUpload';
import type { CountryOption, CurrencyOption, UserSubmissionInput } from '@/types';

type SubmitFormProps = {
  locale: Locale;
  copy: Messages['submit'];
  countries: CountryOption[];
  currencies: CurrencyOption[];
};

type FormValues = {
  city: string;
  country_iso: string;
  price: string;
  currency: string;
  weight_g: string;
  submitter_name: string;
  submitter_email: string;
};

const INITIAL_VALUES: FormValues = {
  city: '',
  country_iso: '',
  price: '',
  currency: '',
  weight_g: '',
  submitter_name: '',
  submitter_email: '',
};

export default function SubmitForm({ locale, copy, countries, currencies }: SubmitFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const isSubmitting = status === 'submitting';

  const fieldsRequiringValue: Array<keyof FormValues> = useMemo(
    () => ['country_iso', 'price', 'currency', 'weight_g', 'submitter_name', 'submitter_email'],
    []
  );

  const countriesByIso = useMemo(
    () => new Map(countries.map((country) => [country.iso_code, country.name])),
    [countries]
  );

  const currenciesByCode = useMemo(
    () => new Set(currencies.map((currency) => currency.code)),
    [currencies]
  );

  const hasSelectedCountry = Boolean(values.country_iso && countriesByIso.has(values.country_iso));

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        revokeImagePreview(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const validate = (input: FormValues) => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};

    fieldsRequiringValue.forEach((field) => {
      if (!input[field].trim()) {
        nextErrors[field] = copy.validation.required;
      }
    });

    if (input.country_iso && !countriesByIso.has(input.country_iso)) {
      nextErrors.country_iso = copy.validation.required;
    }

    if (input.currency && !currenciesByCode.has(input.currency.trim().toUpperCase())) {
      nextErrors.currency = copy.validation.required;
    }

    const email = input.submitter_email.trim();
    if (email && !isValidEmail(email)) {
      nextErrors.submitter_email = copy.validation.invalidEmail;
    }

    const weight = Number.parseFloat(input.weight_g);
    if (input.weight_g.trim() && (!Number.isFinite(weight) || weight <= 0)) {
      nextErrors.weight_g = copy.validation.minWeight;
    }

    const price = Number.parseFloat(input.price);
    if (input.price.trim() && (!Number.isFinite(price) || price < 0)) {
      nextErrors.price = copy.validation.minPrice;
    }

    return nextErrors;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    setImageError(null);

    if (!file) {
      setSelectedFile(null);
      setImagePreviewUrl(null);
      return;
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || copy.validation.invalidImage);
      setSelectedFile(null);
      setImagePreviewUrl(null);
      return;
    }

    // Generate preview and set file
    const previewUrl = generateImagePreview(file);
    setSelectedFile(file);
    setImagePreviewUrl(previewUrl);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate form fields
    const nextErrors = validate(values);
    setErrors(nextErrors);

    // Validate photo is selected
    if (!selectedFile) {
      setImageError(copy.validation.required);
    }

    if (Object.keys(nextErrors).length > 0 || !selectedFile) {
      void logClientAnalytics({
        eventName: 'form_submit_failure',
        route: '/submit',
        reason: 'client_validation_failed',
      });
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      // Generate a temporary ID for the submission
      const submissionId = `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Upload image first
      const uploadResult = await uploadImageToStorage(selectedFile, submissionId);
      if (uploadResult.error) {
        void logClientAnalytics({
          eventName: 'form_submit_failure',
          route: '/submit',
          reason: 'image_upload_failed',
        });
        setImageError(copy.validation.imageUploadError);
        setStatus('error');
        return;
      }

      // Prepare payload with image path (storage path, not URL)
      const payload: UserSubmissionInput = {
        city: values.city.trim() || undefined,
        country: countriesByIso.get(values.country_iso) || '',
        iso_country: values.country_iso,
        price: Number.parseFloat(values.price),
        currency: values.currency.trim().toUpperCase(),
        weight_g: Number.parseFloat(values.weight_g),
        submitter_name: values.submitter_name.trim(),
        submitter_email: values.submitter_email.trim().toLowerCase(),
        image_path: uploadResult.path || '',
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus('error');
        return;
      }

      setValues(INITIAL_VALUES);
      setErrors({});
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setImageError(null);
      setStatus('success');
    } catch {
      void logClientAnalytics({
        eventName: 'form_submit_failure',
        route: '/submit',
        reason: 'submit_exception',
      });
      setStatus('error');
    }
  };

  const setField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const errorClass =
    'w-full rounded-lg border border-[rgba(229,1,1,0.6)] bg-[rgba(46,10,0,0.7)] px-3 py-2 text-sm text-[var(--nutella-cream)] placeholder:text-[rgba(255,231,155,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nutella-red)]';
  const baseClass =
    'w-full rounded-lg border border-[var(--nutella-gold)]/45 bg-[rgba(46,10,0,0.72)] px-3 py-2 text-sm text-[var(--nutella-cream)] placeholder:text-[rgba(255,231,155,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nutella-gold)]/60';

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="submitter_name">
            {copy.form.labels.submitterName}
          </label>
          <input
            id="submitter_name"
            value={values.submitter_name}
            onChange={(event) => setField('submitter_name', event.target.value)}
            className={errors.submitter_name ? errorClass : baseClass}
            autoComplete="name"
          />
          {errors.submitter_name ? <p className="mt-1 text-xs text-[var(--nutella-red)]">{errors.submitter_name}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="submitter_email">
            {copy.form.labels.submitterEmail}
          </label>
          <input
            id="submitter_email"
            type="email"
            value={values.submitter_email}
            onChange={(event) => setField('submitter_email', event.target.value)}
            className={errors.submitter_email ? errorClass : baseClass}
            autoComplete="email"
            maxLength={254}
          />
          {errors.submitter_email ? <p className="mt-1 text-xs text-[var(--nutella-red)]">{errors.submitter_email}</p> : null}
        </div>
      </div>

      <div>
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="country">
            {copy.form.labels.country}
          </label>
          <select
            id="country"
            value={values.country_iso}
            onChange={(event) => setField('country_iso', event.target.value.toUpperCase())}
            className={errors.country_iso ? errorClass : baseClass}
          >
            <option value="">{copy.form.labels.countryPlaceholder}</option>
            {countries.map((country) => (
              <option key={country.iso_code} value={country.iso_code}>
                {country.name} ({country.iso_code})
              </option>
            ))}
          </select>
          {!hasSelectedCountry && values.country_iso ? (
            <p className="mt-1 text-xs text-[var(--nutella-red)]">{copy.validation.required}</p>
          ) : null}
          {errors.country_iso ? <p className="mt-1 text-xs text-[var(--nutella-red)]">{errors.country_iso}</p> : null}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="city">
          {copy.form.labels.city}
        </label>
        <input
          id="city"
          value={values.city}
          onChange={(event) => setField('city', event.target.value)}
          className={errors.city ? errorClass : baseClass}
        />
        {errors.city ? <p className="mt-1 text-xs text-[var(--nutella-red)]">{errors.city}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="weight_g">
            {copy.form.labels.weight}
          </label>
          <input
            id="weight_g"
            type="number"
            min="0.01"
            step="0.01"
            value={values.weight_g}
            onChange={(event) => setField('weight_g', event.target.value)}
            className={errors.weight_g ? errorClass : baseClass}
            inputMode="decimal"
          />
          <p className="mt-1 text-xs text-[color:rgba(255,231,155,0.72)]">{copy.form.hints.weight}</p>
          {errors.weight_g ? <p className="mt-1 text-xs text-[var(--nutella-red)]">{errors.weight_g}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="price">
            {copy.form.labels.price}
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(event) => setField('price', event.target.value)}
            className={errors.price ? errorClass : baseClass}
            inputMode="decimal"
          />
          <p className="mt-1 text-xs text-[color:rgba(255,231,155,0.72)]">{copy.form.hints.price}</p>
          {errors.price ? <p className="mt-1 text-xs text-[var(--nutella-red)]">{errors.price}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="currency">
            {copy.form.labels.currency}
          </label>
          <select
            id="currency"
            value={values.currency}
            onChange={(event) => setField('currency', event.target.value.toUpperCase())}
            className={errors.currency ? errorClass : baseClass}
          >
            <option value="">{copy.form.labels.currencyPlaceholder}</option>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[color:rgba(255,231,155,0.72)]">{copy.form.hints.currency}</p>
          {errors.currency ? <p className="mt-1 text-xs text-[var(--nutella-red)]">{errors.currency}</p> : null}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="photo">
          {copy.form.labels.photo}
        </label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--nutella-gold)]/45 bg-[rgba(46,10,0,0.72)] px-3 py-2 text-sm text-[var(--nutella-cream)] file:mr-3 file:rounded file:border-0 file:bg-[var(--nutella-red)] file:px-2 file:py-1 file:text-xs file:font-semibold file:text-[var(--nutella-cream)] hover:file:bg-[rgb(190,10,10)]"
        />
        <p className="mt-1 text-xs text-[color:rgba(255,231,155,0.72)]">{copy.form.hints.photo}</p>
        {selectedFile && imagePreviewUrl ? (
          <div className="mt-3 rounded-lg border border-[var(--nutella-gold)]/30 bg-[rgba(46,10,0,0.4)] p-3">
            <p className="mb-2 text-xs font-semibold text-[var(--nutella-cream)]">Photo preview:</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- preview URL is a blob/object URL generated client-side */}
            <img src={imagePreviewUrl} alt="Photo preview" className="max-h-48 w-full rounded-lg object-cover" />
            <p className="mt-2 text-xs text-[color:rgba(255,231,155,0.72)]">{selectedFile.name}</p>
          </div>
        ) : null}
        {imageError ? <p className="mt-1 text-xs text-[var(--nutella-red)]">{imageError}</p> : null}
      </div>

      {status === 'success' ? (
        <div className="rounded-lg border border-emerald-300/60 bg-emerald-950/35 p-3">
          <p className="text-sm font-semibold text-emerald-200">{copy.success.heading}</p>
          <p className="mt-1 text-xs text-emerald-100/90">{copy.success.message}</p>
        </div>
      ) : null}

      {status === 'error' && Object.keys(errors).length === 0 ? (
        <div className="rounded-lg border border-[rgba(229,1,1,0.55)] bg-[rgba(80,10,10,0.4)] p-3">
          <p className="text-sm text-[var(--nutella-cream)]">{copy.error.generic}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-[var(--nutella-red)] px-4 py-2 text-sm font-semibold text-[var(--nutella-cream)] transition-colors hover:bg-[rgb(190,10,10)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? copy.form.actions.submitting : copy.form.actions.submit}
        </button>
        <button
          type="button"
          className="rounded-lg border border-[var(--nutella-gold)]/50 px-4 py-2 text-sm font-semibold hover:bg-[rgba(250,179,11,0.12)]"
          disabled={isSubmitting}
          onClick={() => {
            setValues(INITIAL_VALUES);
            setErrors({});
            setSelectedFile(null);
            if (imagePreviewUrl) {
              revokeImagePreview(imagePreviewUrl);
              setImagePreviewUrl(null);
            }
            setImageError(null);
            setStatus('idle');
          }}
        >
          {copy.form.actions.reset}
        </button>
      </div>

      <p className="text-[11px] text-[color:rgba(255,231,155,0.64)]">
        {locale === 'it' ? 'I campi obbligatori saranno controllati prima del salvataggio.' : 'Required fields are validated before saving.'}
      </p>
    </form>
  );
}
