interface TermOfService {
  version: string;
  content: string | { th: string; en: string; zh: string };
  created_at: string;
  updated_at: string;
}
