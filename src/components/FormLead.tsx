'use client';
import * as React from 'react';
import { useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import Variations from './Variations';
import { submitLead } from '../actions/leads';

interface Props {
  hideSubmitButtons?: boolean;
  submitLabel?: string;
  successMessage?: string;
  hideBuiltInSuccess?: boolean;
  onSuccess?: () => void;
}

function FormLead({
  hideSubmitButtons = false,
  submitLabel = 'Submit',
  successMessage = 'Thank you! We will be in touch shortly.',
  hideBuiltInSuccess = false,
  onSuccess,
}: Props) {
  const {
    apiUrl,
    classNameButtonSubmit,
    classNameButtonsSubmitContainer,
    classNameInput,
    hcaptchaSiteKey,
    hookForm,
    onSubmit,
    product,
  } = useMerchiFormContext();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = hookForm;

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hcaptchaToken, setHcaptchaToken] = useState<string>('');
  const captchaRef = useRef<HCaptcha | null>(null);
  const siteKey = (hcaptchaSiteKey || '').trim();
  const captchaRequired = Boolean(siteKey);

  const hasVariations =
    Array.isArray(product?.independentVariationFields) &&
    product.independentVariationFields.length > 0;

  async function doSubmit(values: any) {
    setError(null);
    if (captchaRequired && !hcaptchaToken) {
      setError('Please complete the captcha.');
      return;
    }
    try {
      const { client, variations, variationsGroups, website } = values;
      await submitLead(
        {
          client,
          product,
          variations,
          variationsGroups,
        },
        apiUrl ?? '',
        {
          website: website ?? '',
          hcaptchaToken: hcaptchaToken || undefined,
        },
      );
      setSubmitted(true);
      onSuccess?.();
      onSubmit?.(null);
    } catch (e: unknown) {
      const err = e as { errorMessage?: string; message?: string };
      const message =
        err?.errorMessage ||
        (e instanceof Error ? e.message : null) ||
        err?.message ||
        'Could not submit. Please try again.';
      setError(message);
      setHcaptchaToken('');
      captchaRef.current?.resetCaptcha();
      console.error('Lead form submit failed:', e);
    }
  }

  if (submitted) {
    if (hideBuiltInSuccess) return null;
    return (
      <div className="merchi-lead-form-success">
        <p>{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(doSubmit)}>
      {error && (
        <p className="merchi-lead-form-error mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Honeypot: hidden from humans; bots that fill it are rejected server-side. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="merchi-lead-website">Website</label>
        <input
          id="merchi-lead-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      <div className="merchi-lead-form-client-fields space-y-4">
        <div className="merchi-lead-form-field flex flex-col gap-1">
          <label className="merchi-lead-form-label text-sm font-medium text-zinc-700">
            Name
          </label>
          <input
            type="text"
            className={classNameInput}
            placeholder="Full name"
            {...register('client.name', { required: 'Name is required.' })}
          />
        </div>
        <div className="merchi-lead-form-field flex flex-col gap-1">
          <label className="merchi-lead-form-label text-sm font-medium text-zinc-700">
            Email address
          </label>
          <input
            type="email"
            className={classNameInput}
            placeholder="info@example.com"
            {...register('client.emailAddresses[0].emailAddress', {
              required: 'Email address is required.',
            })}
          />
        </div>
        <div className="merchi-lead-form-field flex flex-col gap-1">
          <label className="merchi-lead-form-label text-sm font-medium text-zinc-700">
            Phone number
          </label>
          <input
            type="tel"
            className={classNameInput}
            placeholder="Phone number"
            {...register('client.phoneNumbers[0].number')}
          />
        </div>
      </div>

      {hasVariations && (
        <div className="merchi-embed-form_variantion-container">
          <Variations />
        </div>
      )}

      {captchaRequired && (
        <div className="merchi-lead-form-captcha mt-4 flex justify-center">
          <HCaptcha
            ref={captchaRef}
            sitekey={siteKey}
            onVerify={(token) => setHcaptchaToken(token)}
            onExpire={() => setHcaptchaToken('')}
            onError={() => setHcaptchaToken('')}
          />
        </div>
      )}

      {!hideSubmitButtons && (
        <div className={classNameButtonsSubmitContainer}>
          <button
            type="submit"
            className={classNameButtonSubmit}
            disabled={isSubmitting || (captchaRequired && !hcaptchaToken)}
          >
            {isSubmitting ? 'Sending…' : submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}

export default FormLead;
