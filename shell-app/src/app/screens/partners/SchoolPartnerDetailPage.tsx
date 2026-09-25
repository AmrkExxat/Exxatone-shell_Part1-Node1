import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import {
  ChevronUp,
  FileText,
  Globe,
  IdCard,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import { Input } from '../../components/ui/input';
import { useSchoolPartners } from '../../data/SchoolPartnersContext';
import { EditCategorySheet } from './EditCategorySheet';
import { ContractSummaryBadges } from './partnersShared';
import { partnersFont, partnersSurfaces, partnersType } from './partnersTypography';
import { partnersTableGrid } from './partnersTable';

const DETAIL_TABS = [
  'About',
  'Contracts',
  'Engagement Log',
  'Requests',
  'Schedules',
] as const;

type DetailTab = (typeof DETAIL_TABS)[number];

export function SchoolPartnerDetailPage() {
  const { siteId, partnerId } = useParams<{ siteId: string; partnerId: string }>();
  const { getPartner, updatePartnerCategory } = useSchoolPartners();
  const partner = partnerId ? getPartner(partnerId) : undefined;
  const [activeTab, setActiveTab] = useState<DetailTab>('About');
  const [contactQuery, setContactQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredContacts = useMemo(() => {
    if (!partner) return [];
    const q = contactQuery.trim().toLowerCase();
    if (!q) return partner.contacts;
    return partner.contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q),
    );
  }, [partner, contactQuery]);

  if (!partner) {
    return <Navigate to={`/site/${siteId}/partners`} replace />;
  }

  const listPath = `/site/${siteId}/partners`;

  return (
    <div className={`min-h-full ${partnersSurfaces.page} ${partnersFont}`}>
      <div className="px-6 pt-4 pb-3">
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={listPath} className={partnersType.breadcrumb}>
                  School Partners
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={`${partnersType.fieldValue} text-[#212121]`}>
                {partner.schoolName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="px-6 pb-6">
        <div className={`${partnersSurfaces.card} overflow-hidden`}>
          <div className="px-6 pt-5 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className={partnersType.detailTitle}>{partner.schoolName}</h1>
              <ContractSummaryBadges contracts={partner.contracts} />
            </div>
            <div
              className={`mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 ${partnersType.detailMeta}`}
            >
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#757575]" strokeWidth={1.75} />
                {partner.addressMeta}
              </span>
              {partner.website !== '--' && (
                <a
                  href={partner.websiteUrl}
                  className="inline-flex items-center gap-1.5 text-[13px] font-normal leading-5 text-[#2563eb] hover:underline"
                >
                  <Globe className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                  {partner.website}
                </a>
              )}
              <span className="inline-flex items-center gap-1.5">
                <IdCard className="h-3.5 w-3.5 shrink-0 text-[#757575]" strokeWidth={1.75} />
                {partner.category}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[13px] font-normal leading-5 text-[#2563eb] hover:underline"
              >
                <User className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                {partner.programContactPrimary}
                {partner.programContactExtra > 0 &&
                  ` +${partner.programContactExtra} View All`}
              </button>
            </div>
          </div>

          <nav className="flex gap-6 px-6" aria-label="Partner sections">
            {DETAIL_TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 py-2.5 transition-colors ${
                    active
                      ? `border-[#3f51b5] ${partnersType.detailTabActive}`
                      : `border-transparent ${partnersType.detailTabIdle}`
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'About' ? (
            <div className="flex w-full flex-col gap-6">
              <section className={`w-full ${partnersSurfaces.card}`}>
                <div className="flex items-center justify-between border-b border-[#eceef1] px-6 py-4">
                  <h2 className={partnersType.cardTitle}>Basic Information</h2>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="rounded p-1.5 text-[#6b7280] hover:bg-neutral-100"
                    aria-label="Edit basic information"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-6 px-6 py-6 md:grid-cols-2">
                  <InfoItem label="Name" value={partner.schoolName} />
                  <InfoItem label="Alias name" value={partner.aliasName} />
                  <InfoItem label="Category" value={partner.category} />
                  <InfoItem
                    label="Website"
                    value={
                      partner.websiteUrl ? (
                        <a href={partner.websiteUrl} className={partnersType.link}>
                          {partner.websiteUrl}
                        </a>
                      ) : (
                        '--'
                      )
                    }
                  />
                  <InfoItem label="Associated Discipline" value={partner.discipline} />
                  <InfoItem label="Address" value={partner.address} className="md:col-span-2" />
                </dl>
              </section>

              <section className={`w-full overflow-hidden ${partnersSurfaces.card}`}>
                <div className="flex items-center justify-between border-b border-[#eceef1] px-6 py-4">
                  <h2 className={partnersType.cardTitle}>Related Documents</h2>
                  <button
                    type="button"
                    className="rounded p-1.5 text-[#6b7280] hover:bg-neutral-100"
                    aria-label="Add document"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <FileText
                    className="mb-4 h-12 w-12 text-[#bdbdbd]"
                    strokeWidth={1.25}
                  />
                  <p className="mb-5 text-sm font-normal leading-5 text-[#757575]">
                    Notes and documents will be listed here
                  </p>
                  <button type="button" className={partnersType.outlinePrimaryButton}>
                    <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    Add Notes and documents
                  </button>
                </div>
              </section>

              <section className={`w-full overflow-hidden ${partnersSurfaces.card}`}>
                <h2 className="sr-only">Program Contacts</h2>
                <div className="flex items-center justify-between gap-3 border-b border-[#eceef1] px-4 py-3">
                  <div className="relative w-full max-w-[280px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                    <Input
                      value={contactQuery}
                      onChange={(e) => setContactQuery(e.target.value)}
                      placeholder="Search"
                      className="h-[34px] border-[#eceef1] bg-white pl-9"
                    />
                  </div>
                  <button type="button" className={partnersType.outlinePrimaryButton}>
                    <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    Add User
                  </button>
                </div>
                <table className={partnersTableGrid.contactsTable}>
                  <colgroup>
                    <col className="w-[22%]" />
                    <col className="w-[38%]" />
                    <col className="w-[22%]" />
                    <col className="w-[18%]" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className={partnersTableGrid.contactsHeadCell}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 uppercase"
                        >
                          Name
                          <ChevronUp className="h-3 w-3" aria-hidden />
                        </button>
                      </th>
                      <th className={partnersTableGrid.contactsHeadCell}>Email</th>
                      <th className={partnersTableGrid.contactsHeadCell}>Phone</th>
                      <th className={partnersTableGrid.contactsHeadCell}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((c) => (
                      <tr key={c.id} className={partnersTableGrid.bodyRow}>
                        <td className={partnersTableGrid.contactsBodyCell}>
                          <span className="block truncate text-[14px] font-semibold leading-5 text-[#212121]">
                            {c.name}
                          </span>
                        </td>
                        <td className={partnersTableGrid.contactsBodyCell}>
                          <span className="block truncate">{c.email}</span>
                        </td>
                        <td className={`${partnersTableGrid.contactsBodyCell} whitespace-nowrap`}>
                          {c.phone}
                        </td>
                        <td className={partnersTableGrid.contactsBodyCell}>
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              className="rounded p-1 text-[#757575] hover:bg-neutral-100"
                              aria-label={`Edit ${c.name}`}
                            >
                              <Pencil className="h-[18px] w-[18px]" strokeWidth={1.75} />
                            </button>
                            <button
                              type="button"
                              className="rounded p-1 text-[#d32f2f] hover:bg-red-50"
                              aria-label={`Delete ${c.name}`}
                            >
                              <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="border-t border-[#eceef1] px-6 py-3 text-right text-[13px] leading-5 text-[#757575]">
                  Showing {filteredContacts.length} of {partner.contacts.length} results
                </p>
              </section>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#d1d5db] bg-white px-6 py-16 text-center text-sm text-[#6b7280]">
              {activeTab} content will be added in a later iteration.
            </div>
          )}
        </div>
      </div>

      <EditCategorySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        partner={partner}
        onUpdate={(category) => updatePartnerCategory(partner.id, category)}
      />
    </div>
  );
}

function InfoItem({
  label,
  value,
  className = '',
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className={`${partnersType.fieldLabel} mb-1.5`}>{label}</dt>
      <dd className={partnersType.fieldValue}>{value}</dd>
    </div>
  );
}
