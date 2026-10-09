import { MembershipClient } from './MembershipClient';
import { MEMBERSHIPS, MEMBERSHIP_LOGOS } from '@/src/data/membership';

export function Membership() {
  return <MembershipClient memberships={MEMBERSHIPS} logos={MEMBERSHIP_LOGOS} />;
}