export const isInstitutionalEmailValid = (
  firstName: string,
  lastName: string,
  localPart: string,
  domainPart: string,
  APPROVED_DOMAINS: any[]
): boolean => {
  if (!firstName || !lastName || !localPart || !domainPart) return false;

  const normalizedFirst = firstName.trim().toLowerCase();
  const normalizedLast = lastName.trim().toLowerCase();
  const local = localPart.trim().toLowerCase();
  const domain = domainPart.trim().toLowerCase();

  const isDomainApproved = APPROVED_DOMAINS.some((d) => d.value.toLowerCase() === domain);
  if (!isDomainApproved) return false;

  const firstNameMatch = local.includes(normalizedFirst) || normalizedFirst.includes(local);
  const lastNameMatch = local.includes(normalizedLast) || normalizedLast.includes(local);
  const initialsMatch = local.includes(`${normalizedFirst[0] ?? ''}${normalizedLast[0] ?? ''}`);

  return firstNameMatch || lastNameMatch || initialsMatch;
};
