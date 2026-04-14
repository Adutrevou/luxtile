const FORM_API = 'https://154.66.196.229/send-form';

interface SubmitFormPayload {
  formName: string;
  fields: Record<string, string>;
}

interface SubmitFormResponse {
  success: boolean;
  message: string;
}

interface SubmitFormErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  fallback?: boolean;
}

export class FormSubmitError extends Error {
  fallback: boolean;

  constructor(message: string, options?: { fallback?: boolean }) {
    super(message);
    this.name = 'FormSubmitError';
    this.fallback = Boolean(options?.fallback);
  }
}

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const SERVICE_UNAVAILABLE_MESSAGE = 'Service is temporarily unavailable. Please try again later.';
const NETWORK_ERROR_MESSAGE = 'Unable to send your enquiry right now. Please try again.';

const getErrorMessage = (data: SubmitFormErrorResponse | null) => {
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (data?.fallback) {
    return SERVICE_UNAVAILABLE_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
};

export async function submitForm(payload: SubmitFormPayload): Promise<SubmitFormResponse> {
  let res: Response;

  try {
    res = await fetch(FORM_API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new FormSubmitError(NETWORK_ERROR_MESSAGE);
  }

  let data: SubmitFormResponse | SubmitFormErrorResponse | null = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok || !data?.success) {
    throw new FormSubmitError(getErrorMessage(data), {
      fallback: Boolean(data?.fallback),
    });
  }

  return {
    success: true,
    message: data.message,
  };
}

