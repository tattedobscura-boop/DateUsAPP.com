import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Shield, FileText, Cookie, Users, ArrowLeft } from 'lucide-react';
import { LogoMark } from './Logo';

/* ─── Prose helpers ──────────────────────────────────── */
function P({ children }) {
  return <p style={{ marginBottom: 12, color: 'rgba(240,230,255,0.62)', lineHeight: 1.8, fontSize: 14 }}>{children}</p>;
}

function UL({ items }) {
  return (
    <ul style={{ paddingLeft: 0, margin: '8px 0 14px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(240,230,255,0.62)', lineHeight: 1.75 }}>
          <span style={{ color: '#c9815a', marginTop: 2, flexShrink: 0, fontSize: 12 }}>◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Strong({ children }) {
  return <strong style={{ color: 'rgba(240,230,255,0.88)', fontWeight: 600 }}>{children}</strong>;
}

/* ─── Collapsible section ────────────────────────────── */
function Section({ title, accent, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      borderRadius: 16,
      background: open ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.018)',
      border: `1px solid ${open ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.055)'}`,
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '15px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 4, height: 16, borderRadius: 2,
            background: `linear-gradient(180deg, ${accent}, ${accent}66)`,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: open ? 'rgba(240,230,255,0.95)' : 'rgba(240,230,255,0.72)', transition: 'color 0.15s' }}>{title}</span>
        </div>
        {open
          ? <ChevronUp size={15} color="rgba(240,230,255,0.35)" />
          : <ChevronDown size={15} color="rgba(240,230,255,0.28)" />}
      </button>
      {open && (
        <div style={{ padding: '0 18px 18px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Policy content components ──────────────────────── */
function PrivacyContent() {
  const accent = '#0d9488';
  return (
    <>
      <div style={{ marginBottom: 24, padding: '13px 16px', borderRadius: 14, background: `${accent}12`, border: `1px solid ${accent}30`, fontSize: 13, color: 'rgba(240,230,255,0.48)', lineHeight: 1.6 }}>
        Last updated: May 3, 2026 · Effective immediately
      </div>
      <P>DateUs ("we," "us," or "our") operates DateUsApp.com. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform.</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Section title="1. Information We Collect" accent={accent} defaultOpen>
          <P><Strong>Information you provide directly:</Strong></P>
          <UL items={[
            'Account details: name, email address, date of birth, gender identity',
            'Profile information: photos, bio, occupation, location (city-level only)',
            'Love language preferences, interests, relationship goals',
            'Messages and correspondence exchanged with matches',
            'Payment information processed securely through Stripe (we never store card details)',
          ]} />
          <P><Strong>Information collected automatically:</Strong></P>
          <UL items={[
            'Device type, operating system, browser type',
            'IP address and approximate location',
            'App usage data: screens viewed, features used, session duration',
            'Interaction data: profiles liked, passed, or reported',
          ]} />
        </Section>

        <Section title="2. How We Use Your Information" accent={accent}>
          <UL items={[
            'To create and manage your DateUs account',
            'To match you with compatible users based on love language compatibility',
            'To enable messaging and connection features',
            'To process subscription payments via Stripe',
            'To send important service notifications and updates',
            'To detect, prevent, and address fraud, abuse, and safety violations',
            'To improve our matching algorithms and platform features',
            'To comply with legal obligations',
          ]} />
        </Section>

        <Section title="3. Information Sharing" accent={accent}>
          <P>We do not sell your personal information. We may share data with:</P>
          <UL items={[
            'Other users — only the profile information you choose to make visible',
            "Stripe — for payment processing (governed by Stripe's Privacy Policy)",
            'Cloud infrastructure providers — for secure data storage and hosting',
            'Law enforcement — only when required by valid legal process',
            'Safety partners — in situations involving credible risk of harm',
          ]} />
        </Section>

        <Section title="4. Data Retention" accent={accent}>
          <P>We retain your account data while your account is active. You may delete your account at any time from Settings → Account Security → Delete Account. Upon deletion:</P>
          <UL items={[
            'Your profile is immediately hidden from other users',
            'Personal data is purged within 30 days',
            'Messages are deleted from our servers within 90 days',
            'Anonymized usage data may be retained for up to 3 years for safety and analytics',
            'Financial records are retained as required by applicable tax law (typically 7 years)',
          ]} />
        </Section>

        <Section title="5. Your Rights" accent={accent}>
          <P>Depending on your location, you may have the right to:</P>
          <UL items={[
            'Access — request a copy of the personal data we hold about you',
            'Correction — update inaccurate or incomplete information',
            'Erasure — request deletion of your personal data ("right to be forgotten")',
            'Portability — receive your data in a machine-readable format',
            'Restriction — limit how we process your data in certain circumstances',
            'Objection — opt out of certain types of processing, including direct marketing',
          ]} />
          <P>To exercise any of these rights, contact us at <Strong>privacy@dateusapp.com</Strong>.</P>
        </Section>

        <Section title="6. Security" accent={accent}>
          <P>We implement industry-standard security measures including:</P>
          <UL items={[
            'TLS 1.3 encryption for all data in transit',
            'AES-256 encryption for sensitive data at rest',
            'Regular third-party security audits',
            'Strict access controls — employee access to user data is logged and minimized',
            'Automated threat detection and monitoring',
          ]} />
          <P>No system is 100% secure. If you discover a security vulnerability, please report it responsibly to <Strong>security@dateusapp.com</Strong>.</P>
        </Section>

        <Section title="7. Cookies & Tracking" accent={accent}>
          <P>We use essential cookies to keep you signed in and store preferences. We do not use third-party advertising trackers. See our Cookie Policy for full details.</P>
        </Section>

        <Section title="8. Children's Privacy" accent={accent}>
          <P>DateUs is intended for users 18 years of age and older. We do not knowingly collect personal information from anyone under 18. If you believe a minor has created an account, please report it immediately to <Strong>safety@dateusapp.com</Strong> and we will investigate and remove the account promptly.</P>
        </Section>

        <Section title="9. Contact Us" accent={accent}>
          <P>DateUs Inc. · <Strong>privacy@dateusapp.com</Strong> · dateusapp.com</P>
          <P>For EU/EEA inquiries, our Data Protection Officer can be reached at <Strong>dpo@dateusapp.com</Strong>.</P>
        </Section>
      </div>
    </>
  );
}

function TermsContent() {
  const accent = '#c9815a';
  return (
    <>
      <div style={{ marginBottom: 24, padding: '13px 16px', borderRadius: 14, background: `${accent}12`, border: `1px solid ${accent}30`, fontSize: 13, color: 'rgba(240,230,255,0.48)', lineHeight: 1.6 }}>
        Last updated: May 3, 2026 · By using DateUs you agree to these terms.
      </div>
      <P>These Terms of Service ("Terms") govern your use of DateUs and all related services operated by DateUs Inc. ("DateUs," "we," "us"). Please read them carefully.</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Section title="1. Eligibility" accent={accent} defaultOpen>
          <UL items={[
            'You must be at least 18 years old to use DateUs',
            'You must be legally permitted to enter into a binding contract in your jurisdiction',
            'You must not be a convicted sex offender',
            'You must not have been previously banned from DateUs',
            'Only one account per person is permitted',
          ]} />
        </Section>

        <Section title="2. Account Responsibilities" accent={accent}>
          <P>You are responsible for:</P>
          <UL items={[
            'Keeping your login credentials secure and confidential',
            'All activity that occurs under your account',
            'Ensuring the information in your profile is accurate and up to date',
            'Notifying us immediately if you suspect unauthorized account access',
          ]} />
          <P>DateUs accounts are personal and non-transferable. You may not sell, trade, or transfer your account to another person.</P>
        </Section>

        <Section title="3. Acceptable Use" accent={accent}>
          <P>You agree not to:</P>
          <UL items={[
            'Harass, abuse, threaten, stalk, or intimidate other users',
            'Send unsolicited bulk messages or spam',
            'Post false, misleading, or fraudulent profile information',
            'Impersonate any person or entity',
            'Use DateUs for commercial solicitation, escort services, or prostitution',
            "Attempt to access another user's account or personal data",
            'Scrape, crawl, or use automated tools to access the platform',
            'Upload malware, viruses, or any harmful code',
            'Use the platform to facilitate any illegal activity',
            "Share another user's personal information without their consent",
          ]} />
        </Section>

        <Section title="4. Content & Intellectual Property" accent={accent}>
          <P>You retain ownership of content you submit (photos, bio, messages). By submitting content, you grant DateUs a non-exclusive, worldwide, royalty-free license to display that content as necessary to operate the platform.</P>
          <P>DateUs retains all rights to the platform, including its design, features, matching algorithms, and brand identity. You may not reproduce or distribute any part of DateUs without written permission.</P>
        </Section>

        <Section title="5. Subscriptions & Payments" accent={accent}>
          <UL items={[
            'Ardor ($19.99/mo) and Echelon ($33.33/mo) subscriptions are billed monthly via Stripe',
            'Subscriptions auto-renew unless cancelled at least 24 hours before renewal',
            'You may cancel at any time from Settings → Manage Subscription',
            'Refunds are issued at our discretion and subject to applicable consumer protection laws',
            'We reserve the right to change subscription pricing with 30 days notice',
            'All prices are in USD; local taxes may apply depending on your jurisdiction',
          ]} />
        </Section>

        <Section title="6. Disclaimers & Limitation of Liability" accent={accent}>
          <P>DateUs is provided "as is." We do not guarantee that you will find a match, form a relationship, or have any particular experience on the platform.</P>
          <P>To the fullest extent permitted by law, DateUs shall not be liable for any indirect, incidental, special, or consequential damages, including but not limited to loss of profits, data, or goodwill, arising from your use of or inability to use the service.</P>
          <P>DateUs does not conduct criminal background checks on users. You are responsible for exercising your own judgment when meeting people from the platform.</P>
        </Section>

        <Section title="7. Termination" accent={accent}>
          <P>We may suspend or permanently terminate your account if you violate these Terms, engage in behavior that harms other users, or for any other reason at our sole discretion. You may delete your account at any time.</P>
          <P>Upon termination, your right to use DateUs ceases immediately. Provisions that by their nature should survive termination (including intellectual property, disclaimers, and limitation of liability) will remain in effect.</P>
        </Section>

        <Section title="8. Governing Law" accent={accent}>
          <P>These Terms are governed by the laws of the State of Delaware, USA, without regard to its conflict of law provisions. Any disputes shall be resolved through binding arbitration in accordance with the American Arbitration Association rules, except where prohibited by law.</P>
        </Section>

        <Section title="9. Changes to Terms" accent={accent}>
          <P>We may update these Terms from time to time. We will notify you of significant changes via email or an in-app notice at least 14 days before the changes take effect. Continued use of DateUs after the effective date constitutes acceptance of the revised Terms.</P>
        </Section>

        <Section title="10. Contact" accent={accent}>
          <P>DateUs Inc. · <Strong>legal@dateusapp.com</Strong> · dateusapp.com</P>
        </Section>
      </div>
    </>
  );
}

function CookieContent() {
  const accent = '#d4a843';
  return (
    <>
      <div style={{ marginBottom: 24, padding: '13px 16px', borderRadius: 14, background: `${accent}12`, border: `1px solid ${accent}30`, fontSize: 13, color: 'rgba(240,230,255,0.48)', lineHeight: 1.6 }}>
        Last updated: May 3, 2026
      </div>
      <P>This Cookie Policy explains how DateUs uses cookies and similar technologies on our website and app.</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Section title="What Are Cookies" accent={accent} defaultOpen>
          <P>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and understand how you interact with DateUs.</P>
        </Section>

        <Section title="Cookies We Use" accent={accent} defaultOpen>
          <P><Strong>Essential Cookies (always active)</Strong></P>
          <UL items={[
            'auth_token — keeps you signed in securely (session)',
            'csrf_token — protects against cross-site request forgery',
            'preference_store — remembers your app settings (1 year)',
          ]} />
          <P><Strong>Functional Cookies</Strong></P>
          <UL items={[
            'onboarding_step — saves your onboarding progress (30 days)',
            'theme_pref — stores dark/light mode preference (1 year)',
            'match_filter — remembers your last-used discover filters (30 days)',
          ]} />
          <P><Strong>Analytics Cookies (can be opted out)</Strong></P>
          <UL items={[
            'Anonymized usage metrics to understand feature engagement',
            'No personal data is included in analytics reports',
            'No third-party advertising cookies are used — ever',
          ]} />
        </Section>

        <Section title="Managing Cookies" accent={accent}>
          <P>You can control cookies through your browser settings or via Settings → Privacy within the app. Disabling essential cookies will affect your ability to stay signed in.</P>
          <P>Most browsers allow you to refuse cookies, delete existing cookies, or be notified when a new cookie is set. See your browser's help documentation for instructions.</P>
        </Section>

        <Section title="Contact" accent={accent}>
          <P>For questions about our cookie practices: <Strong>privacy@dateusapp.com</Strong></P>
        </Section>
      </div>
    </>
  );
}

function CommunityContent() {
  const accent = '#8b5cf6';
  return (
    <>
      <div style={{ marginBottom: 24, padding: '13px 16px', borderRadius: 14, background: `${accent}12`, border: `1px solid ${accent}30`, fontSize: 13, color: 'rgba(240,230,255,0.48)', lineHeight: 1.6 }}>
        Last updated: May 3, 2026 · These standards apply to all DateUs users. Looking for platonic connections?{' '}
        <a href="https://friendusapp.com" target="_blank" rel="noopener noreferrer" style={{ color: '#5eead4', textDecoration: 'none', fontWeight: 600 }}>FriendUs</a> is our sister app for friendship and community.
      </div>
      <P>DateUs is built on the belief that meaningful connections require respect, honesty, and safety. These Community Standards define what is and isn't acceptable on our platform.</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Section title="Be Authentic" accent={accent} defaultOpen>
          <UL items={[
            'Use your real name and genuine photos — no filters that materially alter your appearance',
            'Only one account per person',
            'Do not impersonate celebrities, public figures, or other users',
            'Keep your profile information accurate and up to date',
            'Do not misrepresent your age, location, or relationship status',
          ]} />
        </Section>

        <Section title="Be Respectful" accent={accent} defaultOpen>
          <UL items={[
            'Treat every person you interact with as you would want to be treated',
            'Rejection is a normal part of dating — respond to it gracefully',
            'Do not send unsolicited explicit content of any kind',
            'Do not make discriminatory remarks based on race, ethnicity, religion, gender, sexuality, disability, or body type',
            'Do not contact someone who has unmatched or blocked you through other means',
          ]} />
        </Section>

        <Section title="Be Safe" accent={accent} defaultOpen>
          <UL items={[
            'Never share your home address, financial details, or passwords with matches',
            'Meet for the first time in a public place and let someone you trust know your plans',
            'Trust your instincts — if something feels wrong, leave or end the conversation',
            'Report any suspicious or threatening behavior using the in-app Report button',
            "Do not solicit or transfer money to or from people you've met on DateUs",
          ]} />
        </Section>

        <Section title="Zero Tolerance Violations" accent="#ef4444">
          <div style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', fontSize: 13, color: 'rgba(240,230,255,0.5)' }}>
            The following result in immediate and permanent account removal:
          </div>
          <UL items={[
            'Sexual content involving minors — will be reported to NCMEC and law enforcement',
            'Threats of violence or physical harm toward any person',
            'Non-consensual sharing of intimate images ("revenge porn")',
            'Human trafficking or solicitation of sex for money',
            'Coordinated harassment or hate campaigns',
            'Fraudulent schemes, romance scams, or financial manipulation',
          ]} />
        </Section>

        <Section title="Content Standards" accent={accent}>
          <UL items={[
            'Profile photos must show your face clearly in at least one photo',
            'No nudity, graphic violence, or sexually suggestive content in profile photos',
            'No contact information (phone numbers, social handles, emails) in bios — use the messaging system',
            'No promotional content, MLM, or commercial advertising',
            'No political campaign content or ideological recruitment',
          ]} />
        </Section>

        <Section title="Enforcement" accent={accent}>
          <P>We use a combination of automated detection, user reports, and human review to enforce these standards. Actions may include:</P>
          <UL items={[
            'Content removal',
            'Temporary account suspension (24 hours to 30 days)',
            'Permanent account ban',
            'Referral to law enforcement where required by law or credible risk of harm',
          ]} />
          <P>Appeals can be submitted to <Strong>safety@dateusapp.com</Strong> within 30 days of enforcement action.</P>
        </Section>

        <Section title="Reporting" accent={accent}>
          <P>Use the Report button on any profile or message to flag a concern. Reports are reviewed within 24 hours. In urgent safety situations, always contact local emergency services first — then report within the app.</P>
          <P>You can also reach our Safety team directly: <Strong>safety@dateusapp.com</Strong></P>
        </Section>
      </div>
    </>
  );
}

/* ─── Policy definitions ─────────────────────────────── */
const POLICIES = {
  privacy:   { title: 'Privacy Policy',      subtitle: 'How we handle your data',             icon: Shield,   color: '#0d9488', Content: PrivacyContent },
  terms:     { title: 'Terms of Service',    subtitle: 'Rules and agreements',                 icon: FileText, color: '#c9815a', Content: TermsContent },
  cookies:   { title: 'Cookie Policy',       subtitle: 'What we store on your device',         icon: Cookie,   color: '#d4a843', Content: CookieContent },
  community: { title: 'Community Standards', subtitle: 'Keeping DateUs safe and respectful',   icon: Users,    color: '#8b5cf6', Content: CommunityContent },
};

/* ─── Main Component ─────────────────────────────────── */
export default function PolicySheet({ policyId, onClose }) {
  const [activeId, setActiveId] = useState(policyId);
  const policy = POLICIES[activeId];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    setActiveId(policyId);
  }, [policyId]);

  if (!policy) return null;
  const { title, subtitle, icon: Icon, color, Content } = policy;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#09051a',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeIn 0.22s ease',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* ── Ambient gradient blobs ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -120, left: -80, width: 560, height: 560, borderRadius: '50%', background: `${color}`, opacity: 0.045, filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -60, width: 440, height: 440, borderRadius: '50%', background: '#9b4468', opacity: 0.055, filter: 'blur(70px)' }} />
      </div>

      {/* ── Top nav ── */}
      <div style={{
        position: 'relative', zIndex: 2, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(9,5,26,0.8)', backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px 8px 10px',
              borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(240,230,255,0.55)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogoMark size={24} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,230,255,0.7)', letterSpacing: '-0.01em' }}>DateUs</span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <X size={15} color="rgba(240,230,255,0.55)" />
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', position: 'relative', zIndex: 1 }}>

        {/* ── Sidebar (desktop) ── */}
        <div style={{
          flexShrink: 0, width: 240, borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column', padding: '24px 16px',
          background: 'rgba(255,255,255,0.01)',
          overflowY: 'auto',
        }} className="policy-sidebar">
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(240,230,255,0.25)', marginBottom: 12, paddingLeft: 4 }}>
            Legal documents
          </div>
          {Object.entries(POLICIES).map(([id, p]) => {
            const PIcon = p.icon;
            const active = id === activeId;
            return (
              <button
                key={id}
                onClick={() => setActiveId(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 12px', borderRadius: 12, marginBottom: 4,
                  background: active ? `${p.color}14` : 'transparent',
                  border: active ? `1px solid ${p.color}28` : '1px solid transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: active ? `${p.color}20` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? p.color + '38' : 'rgba(255,255,255,0.07)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  <PIcon size={14} color={active ? p.color : 'rgba(240,230,255,0.4)'} />
                </div>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'rgba(240,230,255,0.92)' : 'rgba(240,230,255,0.5)', lineHeight: 1.25, transition: 'color 0.15s' }}>
                  {p.title}
                </span>
              </button>
            );
          })}

          <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 11.5, color: 'rgba(240,230,255,0.2)', lineHeight: 1.6, paddingLeft: 4 }}>
              © 2026 DateUs Inc.<br />All rights reserved.
            </p>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
          {/* Hero header */}
          <div style={{
            padding: 'clamp(32px, 5vw, 56px) clamp(24px, 5vw, 56px) 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            paddingBottom: 'clamp(24px, 3vw, 36px)',
            background: `linear-gradient(180deg, ${color}07 0%, transparent 100%)`,
          }}>
            {/* Mobile policy switcher */}
            <div className="policy-mobile-tabs" style={{ display: 'none', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
              {Object.entries(POLICIES).map(([id, p]) => {
                const PIcon = p.icon;
                const active = id === activeId;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveId(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 12px', borderRadius: 10,
                      background: active ? `${p.color}16` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? p.color + '32' : 'rgba(255,255,255,0.07)'}`,
                      cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    <PIcon size={12} color={active ? p.color : 'rgba(240,230,255,0.4)'} />
                    <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? 'rgba(240,230,255,0.9)' : 'rgba(240,230,255,0.45)' }}>{p.title}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, maxWidth: 760 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: `${color}16`, border: `1px solid ${color}32`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={24} color={color} />
              </div>
              <div>
                <h1 style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 800, lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  background: `linear-gradient(135deg, rgba(240,230,255,0.95), ${color})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  marginBottom: 6,
                }}>
                  {title}
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(240,230,255,0.42)', marginTop: 4 }}>{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: 'clamp(24px, 4vw, 40px) clamp(24px, 5vw, 56px) clamp(60px, 6vw, 80px)', maxWidth: 760 }}>
            <Content />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .policy-sidebar { display: none !important; }
          .policy-mobile-tabs { display: flex !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

