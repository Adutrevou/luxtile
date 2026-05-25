/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface ContactEnquiryProps {
  name?: string
  email?: string
  phone?: string
  deliveryLocation?: string
  message?: string
  formName?: string
  products?: string
  itemDetails?: string
  [key: string]: string | undefined
}

const RESERVED_KEYS = new Set([
  'name',
  'email',
  'phone',
  'deliveryLocation',
  'message',
  'formName',
  'products',
  'itemDetails',
  'website',
])

const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()

const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, Arial, sans-serif',
  color: '#0F0F0F',
}

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '32px 24px',
  maxWidth: '560px',
}

const heading: React.CSSProperties = {
  fontFamily: '"Playfair Display", Georgia, serif',
  fontSize: '24px',
  color: '#0F0F0F',
  margin: '0 0 8px',
}

const label: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#8a8a8a',
  margin: '16px 0 4px',
}

const value: React.CSSProperties = {
  fontSize: '15px',
  color: '#0F0F0F',
  margin: '0',
  whiteSpace: 'pre-wrap',
}

const hr: React.CSSProperties = {
  borderColor: '#e7e3dc',
  margin: '24px 0',
}

const ContactEnquiryEmail: React.FC<ContactEnquiryProps> = ({
  name = '—',
  email = '—',
  phone,
  deliveryLocation,
  message = '—',
  formName = 'Contact Us',
}) => (
  <Html>
    <Head />
    <Preview>New {formName} enquiry from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New Enquiry — Luxtile</Heading>
        <Text style={{ color: '#55575d', margin: '0 0 8px' }}>
          A new enquiry was submitted via the {formName} form.
        </Text>
        <Hr style={hr} />
        <Section>
          <Text style={label}>Name</Text>
          <Text style={value}>{name}</Text>
          <Text style={label}>Email</Text>
          <Text style={value}>{email}</Text>
          {phone ? (
            <>
              <Text style={label}>Phone</Text>
              <Text style={value}>{phone}</Text>
            </>
          ) : null}
          {deliveryLocation ? (
            <>
              <Text style={label}>Delivery Location</Text>
              <Text style={value}>{deliveryLocation}</Text>
            </>
          ) : null}
          <Text style={label}>Message</Text>
          <Text style={value}>{message}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={{ fontSize: '12px', color: '#8a8a8a' }}>
          Sent automatically from luxtile.co.za
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactEnquiryEmail,
  subject: (data: ContactEnquiryProps) =>
    `New enquiry from ${data.name || 'website visitor'}`,
  displayName: 'Contact Enquiry',
  to: 'Sales@luxtile.co.za',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+27 82 000 0000',
    deliveryLocation: 'Sandton, Johannesburg',
    message: 'Hi, I would like a quote for 60sqm of large-format marble slabs.',
    formName: 'Contact Us',
  },
} satisfies TemplateEntry<ContactEnquiryProps>
