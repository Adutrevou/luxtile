import { supabase } from "@/integrations/supabase/client";

interface SubmitFormPayload {
  formName: string;
  fields: Record<string, string>;
}

interface SubmitFormResponse {
  success: boolean;
  message: string;
}

export class FormSubmitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormSubmitError";
  }
}

const NETWORK_ERROR_MESSAGE =
  "We couldn't send your enquiry right now. Please try again or email Sales@luxtile.co.za.";

export const sanitizeFormFields = (fields: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(fields)
      .map(([key, value]) => [key, value.trim()])
      .filter(([, value]) => Boolean(value)),
  ) as Record<string, string>;

export async function submitForm(
  payload: SubmitFormPayload,
): Promise<SubmitFormResponse> {
  const { fields, formName } = payload;

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : undefined;

  try {
    const { data, error } = await supabase.functions.invoke("send-enquiry", {
      body: {
        ...fields,
        formName,
        pageUrl,
      },
    });

    if (error) {
      console.error("send-enquiry error", error);
      throw new FormSubmitError(NETWORK_ERROR_MESSAGE);
    }
    if (data && data.success === false) {
      throw new FormSubmitError(NETWORK_ERROR_MESSAGE);
    }

    return { success: true, message: "Enquiry sent" };
  } catch (err) {
    if (err instanceof FormSubmitError) throw err;
    throw new FormSubmitError(NETWORK_ERROR_MESSAGE);
  }
}
