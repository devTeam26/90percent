import LegalPage from '@/components/fx/LegalPage'

const SECTIONS = [
  { h: '1. Acceptance of Terms', p: 'By using 90percent, you agree to these Terms of Service and our Privacy Policy.' },
  { h: '2. Use of Service', p: 'You may use our service only for lawful purposes and in accordance with these Terms.' },
  { h: '3. Purchases', p: 'All purchases are subject to product availability. We reserve the right to refuse or cancel orders.' },
  { h: '4. Intellectual Property', p: 'All content on this platform is owned by 90percent and protected by copyright laws.' },
  { h: '5. Limitation of Liability', p: '90percent shall not be liable for any indirect, incidental, or consequential damages.' },
]

export default function TermsPage() {
  return <LegalPage title="Terms of" accent="Service." updated="January 1, 2025" sections={SECTIONS} />
}
