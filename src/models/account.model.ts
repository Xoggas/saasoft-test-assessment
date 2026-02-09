export type RecordType = 'local' | 'ldap';

export interface Mark {
  text: string;
}

export interface Account {
  id: number;
  marks: Mark[];
  recordType: RecordType;
  login: string;
  password: string | null;
}