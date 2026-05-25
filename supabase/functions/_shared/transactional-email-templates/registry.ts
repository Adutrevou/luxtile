/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { template as contactEnquiry } from './contact-enquiry.tsx'

export interface TemplateEntry<TData = any> {
  component: React.ComponentType<TData>
  subject: string | ((data: TData) => string)
  displayName?: string
  previewData?: TData
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry<any>> = {
  contact_enquiry: contactEnquiry,
}
