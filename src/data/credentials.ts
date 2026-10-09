export interface CredentialOverride {
  title?: string;
  type?: string;
}

export const credentialOverrides: Record<string, CredentialOverride> = {
  "fjcci-ranchi": {
    title: "FJCCI",
    type: "Life Member",
  },
  "apdi-2018": {
    title: "Association of Private Detectives & Investigators - India",
    type: "Membership",
  },
  "iedra-anirudha": {
    title: "IEDRA",
    type: "Membership",
  },
  "all-india-human-rights-association": {
    title: "All India Human Rights Association",
    type: "Membership",
  }
};
