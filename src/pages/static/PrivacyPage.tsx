import LegalPage from '@/components/fx/LegalPage'

const SECTIONS = [
  { h: '1. Information We Collect', p: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support.' },
  { h: '2. How We Use Your Information', p: 'We use the information we collect to process transactions, send transactional messages, provide customer support, and improve our services.' },
  { h: '3. Information Sharing', p: 'We do not sell or share your personal information with third parties except as necessary to provide our services.' },
  { h: '4. Data Security', p: 'We use industry-standard encryption and security measures to protect your personal information.' },
  { h: '5. Contact Us', p: 'If you have questions about this Privacy Policy, please contact us at privacy@90percent.com.' },
]

export default function PrivacyPage() {
  return <LegalPage title="Privacy" accent="Policy." updated="January 1, 2025" sections={SECTIONS} />
}
