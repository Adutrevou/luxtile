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
  "Unable to send your enquiry right now. Please try again.";

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

  const templateData = {
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    deliveryLocation: fields.deliveryLocation,
    message: fields.message,
    formName,
  };

  try {
    const { data, error } = await supabase.functions.invoke(
      "send-transactional-email",
      {
        body: {
          templateName: "contact_enquiry",
          templateData,
        },
      },
    );

    if (error) {
      console.error("send-transactional-email error", error);
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
