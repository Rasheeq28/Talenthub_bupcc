# TalentHub — BUP Career Club

**The official Corporate HR Portal by BUP Career Club** for seamless talent discovery, candidate analytics, and CV bank management during career fests.

---

## What It Is

TalentHub is a web-based HR portal that gives **corporate partners and recruiters** direct, authenticated access to a centralized CV bank of BUP students. Built for the BUP Career Fest, it replaces manual resume collection with a streamlined digital pipeline — login, explore, filter, export.

## Key Features

| Feature | Description |
|---|---|
| **Corporate Login** | Credential-based authentication for partner companies (City Bank, Aarong, Pathao, etc.) |
| **Analytics Dashboard** | At-a-glance KPIs — total resumes, department count, average CGPA — with interactive pie & bar charts |
| **Talent Discovery** | Searchable, filterable candidate table with name, department, CGPA, skills, and direct CV links |
| **Advanced Filters** | Filter by department, year of study, and CGPA range; search by name or university ID |
| **CSV Export** | One-click export of filtered candidate data for offline use |
| **Responsive Design** | Full mobile support with bottom navigation and adaptive layouts |

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, shadcn/ui, Tailwind CSS 4 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Custom company-level authentication via Supabase |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project with the `CvBank` and `HrProfiles` tables (see `supabase/schema.sql`)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Rasheeq28/Talenthub_bupcc.git
cd Talenthub_bupcc

# 2. Install dependencies
npm install

# 3. Configure environment variables
#    Create a .env.local file with your Supabase credentials:
#    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

### Database Setup

Run the SQL in `supabase/schema.sql` against your Supabase project to create the `HrProfiles` table with seed data and configure Row Level Security for the `CvBank` table.

## Project Structure

```
src/
├── app/
│   ├── login/page.tsx          # Corporate login
│   ├── dashboard/
│   │   ├── layout.tsx          # Sidebar + mobile nav shell
│   │   ├── page.tsx            # Analytics overview (charts & KPIs)
│   │   └── candidates/page.tsx # Talent discovery table
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Redirect → /login
├── components/ui/              # shadcn/ui components
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── utils.ts                # Utilities
└── supabase/
    └── schema.sql              # Database schema & seed data
```

## License

Built with ❤️ by the **BUP Career Club** tech team.
