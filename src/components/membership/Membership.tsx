import { MembershipClient } from './MembershipClient';
import { MEMBERSHIPS, MEMBERSHIP_LOGOS } from '@/src/data/membership';

type MembershipProps = {
  variant?: "default" | "editorial";
};

export function Membership({ variant = "default" }: MembershipProps) {
  return (
    <MembershipClient
      memberships={MEMBERSHIPS}
      logos={MEMBERSHIP_LOGOS}
      variant={variant}
    />
  );
}