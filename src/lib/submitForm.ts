const FORM_API = 'https://154.66.196.229/send-form';

interface SubmitFormPayload {
  formName: string;
  fields: Record<string, string>;
}

interface SubmitFormResponse {
  success: boolean;
  message: string;
}

export async function submitForm(payload: SubmitFormPayload): Promise<SubmitFormResponse> {
  const res = await fetch(FORM_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Network error');
  }

  const data: SubmitFormResponse = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}
