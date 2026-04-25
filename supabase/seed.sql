-- =============================================
-- SEED DATA — Rumaisa Kashif's Internship Tracker
-- =============================================

-- User Profile
INSERT INTO user_profile (
  id, name, university, grad_date, current_position, skills, target_fields,
  location_pref, pay_floor, target_companies, base_resume, notification_email, scan_frequency
) VALUES (
  uuid_generate_v4(),
  'Rumaisa Kashif',
  'National University of Singapore — Computer Science',
  'May 2028',
  'Computer Vision Intern @ Bosch APAC, Singapore',
  ARRAY[
    'Python', 'C/C++', 'Java', 'JavaScript', 'TypeScript', 'OCaml',
    'PyTorch', 'TensorFlow', 'LangChain', 'LangGraph', 'FastAPI', 'Flask',
    'React', 'scikit-learn', 'OpenCV', 'NumPy', 'pandas', 'Stable Baselines3',
    'Diffusion Models', 'ViT', 'MAE', 'SAM2', 'CLIP', 'YOLO',
    'RAG pipelines', 'LLM agents', 'MCP', 'Redis', 'Supabase',
    'AWS EC2', 'Docker', 'ComfyUI'
  ],
  ARRAY['SWE', 'ML/AI', 'Quant Research', 'Quant Trading'],
  'Remote or Singapore',
  3000,
  ARRAY[
    'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple',
    'Anthropic', 'OpenAI', 'Jane Street', 'Citadel', 'Two Sigma',
    'D.E. Shaw', 'Optiver', 'Palantir', 'Stripe', 'Databricks',
    'Scale AI', 'HRT', 'Five Rings', 'LinkedIn', 'Grab', 'Sea Group'
  ],
  E'RUMAISA KASHIF\nSingapore | rumaisa.kashif2109@gmail.com | linkedin.com/in/rumaisa-kashif | github.com/rumaisa-k\n\nEDUCATION\nNational University of Singapore (NUS)\nBachelor of Computing, Computer Science | Expected: May 2028\nCAP: 4.5/5.0 | Dean''s List\n\nEXPERIENCE\nComputer Vision Intern — Bosch APAC, Singapore (May 2025 – Present)\n• Developed thermal imaging pipeline using diffusion models and SAM2 for industrial defect detection\n• Implemented Vision Transformer (ViT) and MAE architectures achieving 94% detection accuracy\n• Deployed models on AWS EC2 with Docker containerization, reducing inference latency by 40%\n• Integrated CLIP zero-shot classification for multi-class defect categorization\n\nSoftware Engineering Intern — Systems Limited (Jun 2024 – Dec 2024)\n• Built production RAG pipeline using LangChain and LangGraph for enterprise knowledge base\n• Implemented hybrid semantic + keyword search with Supabase and pgvector\n• Developed FastAPI backend serving 10K+ daily queries with Redis caching\n• Reduced hallucination rate by 35% through re-ranking and context compression\n\nNOTABLE\n• Jane Street INSIGHT Program — SWE Track (Competitive, <5% acceptance)\n• MIT xPro Machine Learning Certificate\n\nPROJECTS\nLLM Agent Framework (Python, LangGraph, MCP)\n• Built multi-agent system with tool use, memory, and reflection capabilities\n• Implemented Model Context Protocol (MCP) servers for external tool integration\n\nReinforcement Learning Trading Bot (Python, Stable Baselines3)\n• PPO agent for cryptocurrency market simulation achieving 2.3x baseline returns\n• Custom gym environment with realistic slippage and fee modeling\n\nComputerVision Toolkit (Python, PyTorch, OpenCV)\n• YOLO-based real-time object detection pipeline with 30fps on CPU\n• Custom data augmentation pipeline for low-data regimes\n\nSKILLS\nLanguages: Python, C/C++, Java, JavaScript/TypeScript, OCaml\nML/AI: PyTorch, TensorFlow, scikit-learn, Diffusion Models, ViT, SAM2, CLIP, YOLO, LangChain\nInfra: AWS EC2, Docker, Redis, Supabase, FastAPI, Flask\nTools: Git, Linux, ComfyUI',
  'rumaisa.kashif2109@gmail.com',
  2
);

-- LeetCode Streak
INSERT INTO leetcode_streak (id, current_streak, longest_streak, last_solved_date)
VALUES (uuid_generate_v4(), 0, 0, NULL);

-- =============================================
-- COMPANIES + TIMELINE EVENTS + REFERRAL CONTACTS
-- Uses a DO block so each company UUID is generated once
-- and reused consistently across all FK references.
-- =============================================
DO $$
DECLARE
  v_jane_street    UUID := uuid_generate_v4();
  v_de_shaw        UUID := uuid_generate_v4();
  v_google         UUID := uuid_generate_v4();
  v_meta           UUID := uuid_generate_v4();
  v_amazon         UUID := uuid_generate_v4();
  v_microsoft      UUID := uuid_generate_v4();
  v_two_sigma      UUID := uuid_generate_v4();
  v_citadel        UUID := uuid_generate_v4();
  v_anthropic      UUID := uuid_generate_v4();
  v_optiver        UUID := uuid_generate_v4();
  v_palantir       UUID := uuid_generate_v4();
  v_apple          UUID := uuid_generate_v4();
  v_databricks     UUID := uuid_generate_v4();
  v_stripe         UUID := uuid_generate_v4();
  v_openai         UUID := uuid_generate_v4();
  v_hrt            UUID := uuid_generate_v4();
  v_five_rings     UUID := uuid_generate_v4();
  v_grab           UUID := uuid_generate_v4();
  v_sea            UUID := uuid_generate_v4();
  v_scale_ai       UUID := uuid_generate_v4();
BEGIN

-- =============================================
-- COMPANIES
-- =============================================
INSERT INTO companies (id, name, careers_url, logo_color, field, outreach_status, linkedin_query, outreach_strategy, timing_advice) VALUES
  (v_jane_street, 'Jane Street', 'https://www.janestreet.com/join-jane-street/open-roles/', '#C4B5FD', ARRAY['Quant Trading', 'SWE'], 'not_started', 'Jane Street software engineer singapore intern 2027', 'Reach out to Jane Street alumni from NUS or INSIGHT alumni network. Reference INSIGHT participation directly.', 'Reach out now — they hire on rolling basis. App opens continuously.'),
  (v_de_shaw,     'D.E. Shaw',   'https://www.deshaw.com/careers/students', '#06B6D4', ARRAY['Quant', 'SWE'], 'not_started', 'DE Shaw software engineer quantitative researcher intern', 'Target NYC/remote roles. Connect with recent NUS grads at DE Shaw via LinkedIn alumni search.', 'Applications open now. Apply within 2 weeks.'),
  (v_google,      'Google',      'https://careers.google.com/students/', '#34A853', ARRAY['SWE', 'ML/AI'], 'not_started', 'Google software engineer intern 2027 singapore', 'Connect with Google engineers via NUS CS alumni network. Focus on ML/AI roles.', 'Window opens mid-October 2026, lasts 2-4 weeks. CRITICAL — set calendar alert.'),
  (v_meta,        'Meta',        'https://www.metacareers.com/careerprograms/students/', '#0668E1', ARRAY['SWE', 'ML/AI'], 'not_started', 'Meta software engineer intern 2027 machine learning', 'Find Meta engineers from NUS via LinkedIn. Coffee chat 6 weeks before apps open.', 'Apps open early September 2026. Reach out to referrals in July-August 2026.'),
  (v_amazon,      'Amazon',      'https://www.amazon.jobs/en/teams/internships-for-students', '#FF9900', ARRAY['SWE', 'ML/AI'], 'not_started', 'Amazon software development engineer intern 2027', 'Amazon has structured referral process. Target AWS ML teams or Amazon Research.', 'Apps open July 2026. Referral process takes 2-3 weeks.'),
  (v_microsoft,   'Microsoft',   'https://careers.microsoft.com/students/us/en/usuniversityinternship', '#0067B8', ARRAY['SWE', 'ML/AI'], 'not_started', 'Microsoft software engineer intern 2027 AI research', 'MSFT Research Asia in Singapore/Beijing is a strong target given ML background.', 'Apps open mid-August 2026.'),
  (v_two_sigma,   'Two Sigma',   'https://www.twosigma.com/careers/students/', '#3B82F6', ARRAY['Quant', 'SWE'], 'not_started', 'Two Sigma software engineer quantitative researcher intern 2027', 'Two Sigma values ML/stats skills heavily. Target Software + QR hybrid roles.', 'Apps open August 2026. Reach out to recruiters on LinkedIn in July.'),
  (v_citadel,     'Citadel',     'https://www.citadel.com/careers/students/', '#EF4444', ARRAY['Quant', 'SWE'], 'not_started', 'Citadel securities software engineer quantitative researcher intern 2027', 'Citadel and Citadel Securities are separate. Target both. Network via NUS Math/CS departments.', 'Apps open August-September 2026. Watch careers page daily in August.'),
  (v_anthropic,   'Anthropic',   'https://www.anthropic.com/careers', '#E07B54', ARRAY['ML/AI', 'SWE'], 'not_started', 'Anthropic software engineer research engineer intern', 'With diffusion model and agent experience, strong fit. Reference LangGraph + MCP work.', 'Rolling basis. Apply when roles appear. Monitor monthly.'),
  (v_optiver,     'Optiver',     'https://optiver.com/working-at-optiver/career-opportunities/', '#F59E0B', ARRAY['Quant Trading', 'SWE'], 'not_started', 'Optiver software engineer trading intern singapore 2027', 'Optiver Singapore office is active. Target SWE + trading tech roles. Jane Street INSIGHT is a strong signal.', 'Rolling basis. Apply now via careers page.'),
  (v_palantir,    'Palantir',    'https://www.palantir.com/careers/students/', '#6366F1', ARRAY['SWE', 'ML/AI'], 'not_started', 'Palantir forward deployed engineer intern 2027', 'FDE role values consulting + engineering. Highlight RAG pipeline and client-facing work.', 'Apps open October 2026.'),
  (v_apple,       'Apple',       'https://jobs.apple.com/en-us/search?team=internships-STDNT-INTRN', '#555555', ARRAY['SWE', 'ML/AI'], 'not_started', 'Apple software engineer machine learning intern 2027', 'Apple has strong Singapore presence. Target Siri/ML or hardware-adjacent roles.', 'Rolling September-November 2026.'),
  (v_databricks,  'Databricks',  'https://www.databricks.com/company/careers/university', '#FF6900', ARRAY['SWE', 'ML/AI'], 'not_started', 'Databricks software engineer intern 2027 machine learning', 'Strong ML platform company. Highlight Spark/data pipeline adjacent skills. High growth.', 'Apps open July 2026.'),
  (v_stripe,      'Stripe',      'https://stripe.com/jobs/university', '#635BFF', ARRAY['SWE'], 'not_started', 'Stripe software engineer intern 2027 singapore', 'Singapore office is growing. Target payments infrastructure or ML fraud detection.', 'Apps open October 2026.'),
  (v_openai,      'OpenAI',      'https://openai.com/careers', '#10a37f', ARRAY['ML/AI', 'SWE'], 'not_started', 'OpenAI software engineer research engineer intern 2027', 'Monitor openai.com/careers monthly. Rare intern spots, highly competitive. Strong ML background required.', 'Monitor monthly. No fixed window — roles appear sporadically.'),
  (v_hrt,         'HRT',         'https://www.hudsonrivertrading.com/careers/', '#10B981', ARRAY['Quant Trading', 'SWE'], 'not_started', 'Hudson River Trading software engineer quant intern 2027', 'Small firm, strong signal value. Algo trading focus. C++ skills valuable.', 'Monitor careers page. Rolling basis.'),
  (v_five_rings,  'Five Rings',  'https://fiverings.com/apply/', '#F472B6', ARRAY['Quant Trading', 'SWE'], 'not_started', 'Five Rings capital software engineer quant trader intern 2027', 'Very competitive quant trading firm. Strong math + CS fundamentals required.', 'Apps cycle varies. Monitor October-November 2026.'),
  (v_grab,        'Grab',        'https://grab.careers/students/', '#00B14F', ARRAY['SWE', 'ML/AI'], 'not_started', 'Grab software engineer machine learning intern singapore 2027', 'Singapore HQ. Strong AI/ML org. Good fallback with local presence.', 'Rolling basis. Apply directly via Grab Careers.'),
  (v_sea,         'Sea Group',   'https://careers.sea.com/', '#EE4D2D', ARRAY['SWE', 'ML/AI'], 'not_started', 'Sea Group Shopee Garena software engineer intern singapore 2027', 'Singapore unicorn. Multiple product lines. ML roles in recommendation systems.', 'Rolling basis. Monitor Shopee/Sea careers page.'),
  (v_scale_ai,    'Scale AI',    'https://scale.com/careers', '#FF6B6B', ARRAY['ML/AI', 'SWE'], 'not_started', 'Scale AI software engineer machine learning intern 2027', 'ML data platform. Python + ML pipeline experience directly relevant.', 'Rolling basis. Monitor monthly.');

-- =============================================
-- TIMELINE EVENTS
-- =============================================
INSERT INTO timeline_events (id, company_id, event_type, expected_date, confidence, source_url, urgency, notes, apply_url) VALUES
  (uuid_generate_v4(), v_jane_street,  'Applications Open (FTTP/FOCUS)', NULL,         0.95, 'https://www.janestreet.com/join-jane-street/programs/focus/', 'open_now',  'Jane Street FOCUS and FTTP are open now for 2027 cycle. Apply ASAP.',                                                       'https://www.janestreet.com/join-jane-street/programs/focus/'),
  (uuid_generate_v4(), v_de_shaw,      'Applications Open',              NULL,         0.90, 'https://www.deshaw.com/careers/students',                     'open_now',  'D.E. Shaw internship applications open now for Summer 2027.',                                                                'https://www.deshaw.com/careers/students'),
  (uuid_generate_v4(), v_amazon,       'Applications Open',              '2026-07-01', 0.85, 'https://www.amazon.jobs/',                                    'upcoming',  'Amazon SDE internship typically opens July. Target SWE + Applied Science roles.',                                              'https://www.amazon.jobs/en/teams/internships-for-students'),
  (uuid_generate_v4(), v_two_sigma,    'Applications Open',              '2026-08-01', 0.80, 'https://www.twosigma.com/careers/',                           'upcoming',  'Two Sigma internship applications open in August for Summer 2027.',                                                          'https://www.twosigma.com/careers/students/'),
  (uuid_generate_v4(), v_microsoft,    'Applications Open',              '2026-08-15', 0.82, 'https://careers.microsoft.com/',                              'upcoming',  'Microsoft EXPLORE and SWE intern apps open mid-August.',                                                                    'https://careers.microsoft.com/students/'),
  (uuid_generate_v4(), v_meta,         'Applications Open',              '2026-09-05', 0.85, 'https://www.metacareers.com/',                                'upcoming',  'Meta University internship opens early September. Very fast close — apply day 1.',                                            'https://www.metacareers.com/careerprograms/students/'),
  (uuid_generate_v4(), v_citadel,      'Applications Open',              '2026-08-15', 0.80, 'https://www.citadel.com/careers/',                            'upcoming',  'Citadel and Citadel Securities applications open August-September.',                                                         'https://www.citadel.com/careers/students/'),
  (uuid_generate_v4(), v_google,       'Applications Open — CRITICAL WINDOW', '2026-10-15', 0.90, 'https://careers.google.com/',                            'upcoming',  'Google STEP and SWE intern applications open mid-October 2026. Window is ONLY 2-4 weeks. Mark this date.',                    'https://careers.google.com/students/'),
  (uuid_generate_v4(), v_stripe,       'Applications Open',              '2026-10-01', 0.75, 'https://stripe.com/jobs',                                     'upcoming',  'Stripe intern apps typically open October.',                                                                                 'https://stripe.com/jobs/university'),
  (uuid_generate_v4(), v_palantir,     'Applications Open',              '2026-10-01', 0.72, 'https://www.palantir.com/careers/',                           'upcoming',  'Palantir FDE and SWE intern apps open October.',                                                                             'https://www.palantir.com/careers/students/'),
  (uuid_generate_v4(), v_databricks,   'Applications Open',              '2026-07-15', 0.78, 'https://www.databricks.com/',                                 'upcoming',  'Databricks intern apps open July 2026.',                                                                                    'https://www.databricks.com/company/careers/university'),
  (uuid_generate_v4(), v_apple,        'Applications Open',              '2026-09-01', 0.70, 'https://jobs.apple.com/',                                     'upcoming',  'Apple intern apps open September-November on rolling basis.',                                                                'https://jobs.apple.com/en-us/search?team=internships-STDNT-INTRN'),
  (uuid_generate_v4(), v_anthropic,    'Monitor for New Roles',          NULL,         0.70, 'https://www.anthropic.com/careers',                           'unknown',   'Anthropic hires on rolling basis. Check monthly.',                                                                          'https://www.anthropic.com/careers'),
  (uuid_generate_v4(), v_optiver,      'Applications Open',              NULL,         0.80, 'https://optiver.com/working-at-optiver/career-opportunities/', 'open_now',  'Optiver Singapore roles available on rolling basis. Apply now.',                                                             'https://optiver.com/working-at-optiver/career-opportunities/'),
  (uuid_generate_v4(), v_openai,       'Monitor for New Roles',          NULL,         0.60, 'https://openai.com/careers',                                  'unknown',   'OpenAI intern roles appear sporadically. Monitor monthly. Very competitive.',                                                'https://openai.com/careers');

-- =============================================
-- REFERRAL CONTACTS
-- =============================================
INSERT INTO referral_contacts (company_id, strategy, status, notes) VALUES
  (v_jane_street,  'Use Jane Street INSIGHT alumni connection. Message on LinkedIn referencing the INSIGHT program and your current quant/SWE trajectory. Keep it very short (3-4 sentences).', 'not_started', NULL),
  (v_de_shaw,      'Search LinkedIn for NUS CS alumni at DE Shaw. Reference shared alma mater. Ask about their quant/SWE split role experience.', 'not_started', NULL),
  (v_google,       'Google has a formal referral program. Find Google engineers from NUS via alumni portal. ML/AI background is very relevant.', 'not_started', NULL),
  (v_meta,         'Meta has strong intern referral culture. Target ML engineers working on Llama or Recommendation Systems teams.', 'not_started', NULL),
  (v_amazon,       'Amazon referral portal is straightforward. Target AWS Applied Science or Alexa AI team members from NUS.', 'not_started', NULL),
  (v_two_sigma,    'Two Sigma values stats/ML. Target software engineers with ML research background. NUS DSML students who interned there are good contacts.', 'not_started', NULL),
  (v_citadel,      'Citadel hires aggressively from top Asian unis. Look for NUS/NTU Citadel interns from prior years. Jane Street INSIGHT is a strong credibility signal.', 'not_started', NULL),
  (v_anthropic,    'Anthropic is small and selective. Target researchers who publish papers you can reference. MCP and agent work is directly relevant.', 'not_started', NULL),
  (v_optiver,      'Optiver Singapore is close to NUS. Target local team members. C++ and low-latency awareness helps.', 'not_started', NULL),
  (v_databricks,   'Databricks has strong ML/data engineering culture. Target MLflow or Unity Catalog team members.', 'not_started', NULL);

END $$;

-- =============================================
-- SAMPLE INTERNSHIP LISTINGS
-- =============================================
INSERT INTO internships (role, company, location, loc_type, wage, wage_period, paid, description, requirements, skills_required, match_score, deadline, days_until_deadline, status, source, apply_url, is_new) VALUES
  ('Software Engineering Intern — ML Infrastructure', 'Google', 'Mountain View, CA / Remote', 'remote', 8000, 'month', true, 'Join Google''s ML Infrastructure team building the systems that power next-generation AI products. Work on distributed training frameworks, model serving infrastructure, and ML platform tooling used by thousands of Google engineers.', 'Currently enrolled in BS/MS in CS or related. Strong Python and systems programming. Experience with ML frameworks (TensorFlow/PyTorch). Graduating 2027-2028.', ARRAY['Python', 'PyTorch', 'TensorFlow', 'Distributed Systems', 'C++', 'ML'], 92, '2026-11-15', 205, 'saved', 'LinkedIn Alert', 'https://careers.google.com/students/', true),
  ('Quantitative Research Intern', 'Jane Street', 'New York, NY', 'onsite', 12000, 'month', true, 'Work alongside researchers on trading strategies, risk models, and market microstructure. Solve challenging mathematical problems with immediate real-world application. Jane Street''s research internship is among the most competitive in finance.', 'Top academic record in CS, Math, Statistics, or Physics. Strong probability and combinatorics. Programming skills in Python or OCaml. Jane Street INSIGHT alumni preferred.', ARRAY['Python', 'OCaml', 'Probability', 'Statistics', 'Math', 'Algorithms'], 95, '2026-06-01', 37, 'saved', 'Jane Street Careers', 'https://www.janestreet.com/join-jane-street/programs/', true),
  ('Machine Learning Engineer Intern', 'Anthropic', 'San Francisco, CA / Remote', 'remote', 9000, 'month', true, 'Build and improve Claude. Work on alignment research, model training infrastructure, RLHF pipelines, or safety evaluations. Anthropic interns work on real research with publication potential.', 'Strong ML background. PyTorch proficiency. Familiarity with transformer architectures, RLHF, or interpretability research. Published research or strong project work.', ARRAY['Python', 'PyTorch', 'Transformers', 'RLHF', 'LLM', 'ML'], 90, NULL, NULL, 'saved', 'Anthropic Careers', 'https://www.anthropic.com/careers', true),
  ('Software Engineering Intern — AI/ML', 'Meta', 'Menlo Park, CA', 'hybrid', 9000, 'month', true, 'Work on PyTorch, FAISS, or Meta''s next-generation AI infrastructure. Contribute to models powering Instagram, WhatsApp, and Llama. Meta interns own real features shipped to billions of users.', 'BS/MS in CS. Proficiency in Python and C++. Familiarity with deep learning frameworks. Strong data structures and algorithms fundamentals.', ARRAY['Python', 'C++', 'PyTorch', 'ML', 'Distributed Systems'], 88, '2026-10-15', 173, 'saved', 'LinkedIn Alert', 'https://www.metacareers.com/careerprograms/students/', true),
  ('Quantitative Researcher Intern', 'Two Sigma', 'New York, NY', 'onsite', 11000, 'month', true, 'Apply statistical and ML techniques to financial markets. Research alpha generation, risk management, and portfolio construction. Two Sigma''s research culture is deeply academic.', 'PhD or exceptional MS/BS in CS, Statistics, or Math. Machine learning research experience. Strong Python/NumPy/pandas. Financial interest a plus.', ARRAY['Python', 'NumPy', 'pandas', 'Statistics', 'ML', 'scikit-learn'], 87, '2026-09-01', 129, 'saved', 'Two Sigma Careers', 'https://www.twosigma.com/careers/students/', true),
  ('Software Engineering Intern — Distributed Systems', 'Stripe', 'Singapore', 'onsite', 7000, 'month', true, 'Build the financial infrastructure that powers millions of businesses. Work on payments processing, fraud detection ML, or developer-facing APIs. Singapore office is growing rapidly.', 'BS in CS. Strong systems programming. Python, Go, or Ruby experience. Interested in fintech and distributed systems.', ARRAY['Python', 'Distributed Systems', 'APIs', 'ML', 'Redis'], 78, '2026-11-01', 190, 'saved', 'Stripe Careers', 'https://stripe.com/jobs/university', false),
  ('ML Research Intern', 'D.E. Shaw', 'New York, NY / Remote', 'hybrid', 10000, 'month', true, 'Research at the intersection of machine learning and quantitative finance. Projects span NLP for news analysis, computer vision for satellite data, and time-series prediction.', 'Top academic record. Strong ML background. Python proficiency. Research experience strongly preferred.', ARRAY['Python', 'PyTorch', 'ML', 'NLP', 'Research', 'Statistics'], 89, '2026-07-01', 67, 'saved', 'DE Shaw Careers', 'https://www.deshaw.com/careers/students', true),
  ('Software Engineer Intern — Trading Technology', 'Citadel Securities', 'Chicago, IL', 'onsite', 11000, 'month', true, 'Build low-latency trading systems that process millions of orders per second. Work on matching engines, risk systems, or market data infrastructure. C++ performance engineering.', 'Strong C++ skills. Knowledge of data structures and algorithms. Interest in systems programming and financial markets.', ARRAY['C++', 'Python', 'Algorithms', 'Systems', 'Low Latency'], 82, '2026-09-15', 143, 'saved', 'Citadel Careers', 'https://www.citadel.com/careers/students/', true);

-- =============================================
-- LEETCODE PROBLEMS — 80+ problems across all patterns
-- =============================================
INSERT INTO leetcode_problems (number, title, difficulty, pattern, companies, frequency, topic, lc_url, notes) VALUES
-- Two Pointers
(1,    'Two Sum',                                    'easy',   'HashMap',            ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         5, 'Arrays',       'https://leetcode.com/problems/two-sum/',                                       'Classic. Hash map approach is O(n).'),
(11,   'Container With Most Water',                  'medium', 'Two Pointers',        ARRAY['Google', 'Meta', 'Amazon'],                      5, 'Arrays',       'https://leetcode.com/problems/container-with-most-water/',                     'Two pointer greedy approach.'),
(15,   'Three Sum',                                  'medium', 'Two Pointers',        ARRAY['Google', 'Meta', 'Amazon', 'Microsoft'],         5, 'Arrays',       'https://leetcode.com/problems/3sum/',                                          'Sort + two pointers. Handle duplicates.'),
(42,   'Trapping Rain Water',                        'hard',   'Two Pointers',        ARRAY['Google', 'Jane Street', 'Amazon', 'Meta'],       4, 'Arrays',       'https://leetcode.com/problems/trapping-rain-water/',                           'Two pointers or stack approach.'),
(125,  'Valid Palindrome',                           'easy',   'Two Pointers',        ARRAY['Google', 'Meta', 'Microsoft'],                   4, 'Strings',      'https://leetcode.com/problems/valid-palindrome/',                              'Filter then two pointers.'),
(167,  'Two Sum II',                                 'medium', 'Two Pointers',        ARRAY['Amazon', 'Two Sigma'],                           3, 'Arrays',       'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',             'Sorted array, two pointers.'),
(977,  'Squares of a Sorted Array',                  'easy',   'Two Pointers',        ARRAY['Google', 'Amazon'],                              3, 'Arrays',       'https://leetcode.com/problems/squares-of-a-sorted-array/',                    'Two pointers from ends.'),
-- Sliding Window
(3,    'Longest Substring Without Repeating Characters', 'medium', 'Sliding Window', ARRAY['Google', 'Amazon', 'Meta', 'Citadel'],           5, 'Strings',      'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'Classic sliding window with hashmap.'),
(76,   'Minimum Window Substring',                   'hard',   'Sliding Window',      ARRAY['Google', 'Meta', 'Amazon', 'Jane Street'],       4, 'Strings',      'https://leetcode.com/problems/minimum-window-substring/',                     'Sliding window + frequency map.'),
(121,  'Best Time to Buy and Sell Stock',             'easy',   'Sliding Window',      ARRAY['Google', 'Amazon', 'Meta', 'Citadel', 'Jane Street'], 5, 'Arrays', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',             'Track min price, update max profit.'),
(239,  'Sliding Window Maximum',                     'hard',   'Sliding Window',      ARRAY['Google', 'Amazon', 'Citadel'],                   4, 'Arrays',       'https://leetcode.com/problems/sliding-window-maximum/',                       'Monotonic deque.'),
(424,  'Longest Repeating Character Replacement',    'medium', 'Sliding Window',      ARRAY['Google', 'Meta'],                                3, 'Strings',      'https://leetcode.com/problems/longest-repeating-character-replacement/',      'Window size - max_count <= k.'),
-- BFS
(102,  'Binary Tree Level Order Traversal',          'medium', 'BFS',                 ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         5, 'Trees',        'https://leetcode.com/problems/binary-tree-level-order-traversal/',            'BFS with queue.'),
(200,  'Number of Islands',                          'medium', 'BFS',                 ARRAY['Google', 'Meta', 'Amazon', 'Microsoft', 'Citadel'], 5, 'Graphs',    'https://leetcode.com/problems/number-of-islands/',                            'BFS/DFS, mark visited.'),
(994,  'Rotting Oranges',                            'medium', 'BFS',                 ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Graphs',       'https://leetcode.com/problems/rotting-oranges/',                              'Multi-source BFS.'),
(127,  'Word Ladder',                                'hard',   'BFS',                 ARRAY['Google', 'Amazon', 'Meta'],                      3, 'Graphs',       'https://leetcode.com/problems/word-ladder/',                                  'BFS level by level. Build adjacency via wildcards.'),
(1926, 'Nearest Exit from Entrance in Maze',         'medium', 'BFS',                 ARRAY['Google', 'Amazon'],                              3, 'Graphs',       'https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/',           'Standard BFS grid traversal.'),
-- DFS
(133,  'Clone Graph',                                'medium', 'DFS',                 ARRAY['Google', 'Meta', 'Amazon'],                      4, 'Graphs',       'https://leetcode.com/problems/clone-graph/',                                  'DFS + visited map.'),
(695,  'Max Area of Island',                         'medium', 'DFS',                 ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Graphs',       'https://leetcode.com/problems/max-area-of-island/',                           'DFS, count cells.'),
(417,  'Pacific Atlantic Water Flow',                'medium', 'DFS',                 ARRAY['Google', 'Citadel'],                             3, 'Graphs',       'https://leetcode.com/problems/pacific-atlantic-water-flow/',                  'Reverse DFS from both oceans.'),
(543,  'Diameter of Binary Tree',                    'easy',   'DFS',                 ARRAY['Google', 'Meta', 'Amazon'],                      4, 'Trees',        'https://leetcode.com/problems/diameter-of-binary-tree/',                      'DFS, track max depth.'),
-- Union-Find
(684,  'Redundant Connection',                       'medium', 'Union-Find',          ARRAY['Google', 'Amazon', 'Citadel'],                   3, 'Graphs',       'https://leetcode.com/problems/redundant-connection/',                         'Union-Find detect cycle.'),
(547,  'Number of Provinces',                        'medium', 'Union-Find',          ARRAY['Google', 'Meta', 'Microsoft'],                   4, 'Graphs',       'https://leetcode.com/problems/number-of-provinces/',                          'Union-Find or DFS.'),
(128,  'Longest Consecutive Sequence',               'medium', 'Union-Find',          ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Arrays',       'https://leetcode.com/problems/longest-consecutive-sequence/',                 'HashSet approach O(n).'),
-- Topological Sort
(207,  'Course Schedule',                            'medium', 'Topological Sort',    ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         5, 'Graphs',       'https://leetcode.com/problems/course-schedule/',                              'Detect cycle with topo sort.'),
(210,  'Course Schedule II',                         'medium', 'Topological Sort',    ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Graphs',       'https://leetcode.com/problems/course-schedule-ii/',                           'Kahn''s algorithm.'),
(269,  'Alien Dictionary',                           'hard',   'Topological Sort',    ARRAY['Google', 'Meta', 'Jane Street'],                 3, 'Graphs',       'https://leetcode.com/problems/alien-dictionary/',                             'Build graph from adjacent word pairs.'),
-- Heap/Priority Queue
(215,  'Kth Largest Element',                        'medium', 'Heap/Priority Queue', ARRAY['Google', 'Amazon', 'Meta', 'Citadel'],           5, 'Arrays',       'https://leetcode.com/problems/kth-largest-element-in-an-array/',             'Min-heap of size k. Or quickselect.'),
(295,  'Find Median from Data Stream',               'hard',   'Heap/Priority Queue', ARRAY['Google', 'Amazon', 'Meta', 'Jane Street'],       4, 'Design',       'https://leetcode.com/problems/find-median-from-data-stream/',                 'Two heaps: max-heap left, min-heap right.'),
(703,  'Kth Largest in Stream',                      'easy',   'Heap/Priority Queue', ARRAY['Google', 'Amazon'],                              3, 'Arrays',       'https://leetcode.com/problems/kth-largest-element-in-a-stream/',             'Min-heap of size k.'),
(378,  'Kth Smallest in Sorted Matrix',              'medium', 'Heap/Priority Queue', ARRAY['Google', 'Amazon', 'Two Sigma'],                 3, 'Arrays',       'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/',     'Min-heap or binary search.'),
-- Intervals
(56,   'Merge Intervals',                            'medium', 'Intervals',           ARRAY['Google', 'Meta', 'Amazon', 'Microsoft', 'Citadel'], 5, 'Arrays',    'https://leetcode.com/problems/merge-intervals/',                              'Sort by start, merge overlapping.'),
(57,   'Insert Interval',                            'medium', 'Intervals',           ARRAY['Google', 'Meta', 'Amazon'],                      4, 'Arrays',       'https://leetcode.com/problems/insert-interval/',                              'Find overlap, merge.'),
(435,  'Non-overlapping Intervals',                  'medium', 'Intervals',           ARRAY['Google', 'Amazon', 'Citadel'],                   3, 'Arrays',       'https://leetcode.com/problems/non-overlapping-intervals/',                    'Greedy: sort by end time.'),
(252,  'Meeting Rooms',                              'easy',   'Intervals',           ARRAY['Google', 'Meta', 'Amazon'],                      3, 'Arrays',       'https://leetcode.com/problems/meeting-rooms/',                                'Sort, check consecutive overlap.'),
-- DP 1D
(70,   'Climbing Stairs',                            'easy',   'DP (1D)',             ARRAY['Google', 'Amazon', 'Meta', 'Microsoft', 'Jane Street'], 5, 'DP',    'https://leetcode.com/problems/climbing-stairs/',                              'Fibonacci DP.'),
(322,  'Coin Change',                                'medium', 'DP (1D)',             ARRAY['Google', 'Amazon', 'Meta', 'Citadel'],           5, 'DP',           'https://leetcode.com/problems/coin-change/',                                  'Bottom-up DP. dp[i] = min coins.'),
(198,  'House Robber',                               'medium', 'DP (1D)',             ARRAY['Google', 'Amazon', 'Meta'],                      4, 'DP',           'https://leetcode.com/problems/house-robber/',                                 'dp[i] = max(dp[i-1], dp[i-2]+nums[i]).'),
(300,  'Longest Increasing Subsequence',             'medium', 'DP (1D)',             ARRAY['Google', 'Amazon', 'Jane Street', 'Citadel'],    4, 'DP',           'https://leetcode.com/problems/longest-increasing-subsequence/',               'O(n log n) with patience sorting.'),
(139,  'Word Break',                                 'medium', 'DP (1D)',             ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         4, 'DP',           'https://leetcode.com/problems/word-break/',                                   'dp[i] = any dp[j] and s[j..i] in dict.'),
(152,  'Maximum Product Subarray',                   'medium', 'DP (1D)',             ARRAY['Google', 'Amazon', 'Citadel'],                   4, 'Arrays',       'https://leetcode.com/problems/maximum-product-subarray/',                     'Track max and min at each step.'),
-- DP 2D
(62,   'Unique Paths',                               'medium', 'DP (2D)',             ARRAY['Google', 'Amazon', 'Meta'],                      4, 'DP',           'https://leetcode.com/problems/unique-paths/',                                 'dp[i][j] = dp[i-1][j] + dp[i][j-1].'),
(1143, 'Longest Common Subsequence',                 'medium', 'DP (2D)',             ARRAY['Google', 'Amazon', 'Meta', 'Jane Street'],       4, 'Strings',      'https://leetcode.com/problems/longest-common-subsequence/',                   '2D DP. Watch for base cases.'),
(72,   'Edit Distance',                              'hard',   'DP (2D)',             ARRAY['Google', 'Amazon', 'Meta', 'Two Sigma'],         3, 'Strings',      'https://leetcode.com/problems/edit-distance/',                                'dp[i][j] = min ops to convert s1[:i] to s2[:j].'),
(518,  'Coin Change II',                             'medium', 'DP (2D)',             ARRAY['Google', 'Amazon', 'Citadel'],                   3, 'DP',           'https://leetcode.com/problems/coin-change-ii/',                               'Unbounded knapsack.'),
-- Backtracking
(46,   'Permutations',                               'medium', 'Backtracking',        ARRAY['Google', 'Amazon', 'Meta', 'Citadel'],           5, 'Recursion',    'https://leetcode.com/problems/permutations/',                                 'Swap or used-array backtracking.'),
(78,   'Subsets',                                    'medium', 'Backtracking',        ARRAY['Google', 'Amazon', 'Meta'],                      5, 'Recursion',    'https://leetcode.com/problems/subsets/',                                      'Include/exclude each element.'),
(79,   'Word Search',                                'medium', 'Backtracking',        ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         4, 'Graphs',       'https://leetcode.com/problems/word-search/',                                  'DFS + backtrack, mark visited.'),
(39,   'Combination Sum',                            'medium', 'Backtracking',        ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Recursion',    'https://leetcode.com/problems/combination-sum/',                              'Backtrack with start index.'),
(51,   'N-Queens',                                   'hard',   'Backtracking',        ARRAY['Google', 'Jane Street', 'Citadel'],              3, 'Recursion',    'https://leetcode.com/problems/n-queens/',                                     'Column + diagonal tracking.'),
-- Trie
(208,  'Implement Trie',                             'medium', 'Trie',                ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         4, 'Design',       'https://leetcode.com/problems/implement-trie-prefix-tree/',                  'TrieNode with 26 children.'),
(211,  'Design Add and Search Words',                'medium', 'Trie',                ARRAY['Google', 'Meta'],                                3, 'Design',       'https://leetcode.com/problems/design-add-and-search-words-data-structure/',  'Trie + wildcard DFS.'),
(212,  'Word Search II',                             'hard',   'Trie',                ARRAY['Google', 'Meta', 'Amazon'],                      3, 'Graphs',       'https://leetcode.com/problems/word-search-ii/',                               'Trie + DFS. Prune found words.'),
-- Monotonic Stack
(84,   'Largest Rectangle in Histogram',             'hard',   'Monotonic Stack',     ARRAY['Google', 'Amazon', 'Jane Street', 'Citadel'],    4, 'Arrays',       'https://leetcode.com/problems/largest-rectangle-in-histogram/',              'Monotonic stack, pop on smaller bar.'),
(739,  'Daily Temperatures',                         'medium', 'Monotonic Stack',     ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Arrays',       'https://leetcode.com/problems/daily-temperatures/',                           'Monotonic decreasing stack.'),
(853,  'Car Fleet',                                  'medium', 'Monotonic Stack',     ARRAY['Google', 'Amazon'],                              3, 'Arrays',       'https://leetcode.com/problems/car-fleet/',                                    'Stack, check if car catches up.'),
(503,  'Next Greater Element II',                    'medium', 'Monotonic Stack',     ARRAY['Amazon', 'Google'],                              3, 'Arrays',       'https://leetcode.com/problems/next-greater-element-ii/',                     'Circular: iterate 2n, mod indexing.'),
-- Binary Search
(153,  'Find Minimum in Rotated Sorted Array',       'medium', 'Binary Search',       ARRAY['Google', 'Amazon', 'Meta', 'Citadel'],           4, 'Arrays',       'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',        'Compare mid with right.'),
(33,   'Search in Rotated Sorted Array',             'medium', 'Binary Search',       ARRAY['Google', 'Amazon', 'Meta', 'Jane Street'],       5, 'Arrays',       'https://leetcode.com/problems/search-in-rotated-sorted-array/',              'Find which half is sorted.'),
(74,   'Search a 2D Matrix',                         'medium', 'Binary Search',       ARRAY['Google', 'Amazon', 'Microsoft'],                 3, 'Arrays',       'https://leetcode.com/problems/search-a-2d-matrix/',                          'Treat as flat array.'),
(875,  'Koko Eating Bananas',                        'medium', 'Binary Search',       ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Arrays',       'https://leetcode.com/problems/koko-eating-bananas/',                         'Binary search on answer.'),
-- Graphs
(743,  'Network Delay Time',                         'medium', 'Graphs',              ARRAY['Google', 'Amazon', 'Citadel'],                   3, 'Graphs',       'https://leetcode.com/problems/network-delay-time/',                          'Dijkstra.'),
(787,  'Cheapest Flights Within K Stops',            'medium', 'Graphs',              ARRAY['Google', 'Amazon', 'Meta'],                      3, 'Graphs',       'https://leetcode.com/problems/cheapest-flights-within-k-stops/',             'Bellman-Ford or Dijkstra with level limit.'),
(1584, 'Min Cost to Connect Points',                 'medium', 'Graphs',              ARRAY['Google', 'Amazon'],                              3, 'Graphs',       'https://leetcode.com/problems/min-cost-to-connect-all-points/',              'Prim''s or Kruskal MST.'),
-- Linked List
(206,  'Reverse Linked List',                        'easy',   'Linked List',         ARRAY['Google', 'Meta', 'Amazon', 'Microsoft'],         5, 'Linked Lists', 'https://leetcode.com/problems/reverse-linked-list/',                         'Iterative: prev, curr, next.'),
(21,   'Merge Two Sorted Lists',                     'easy',   'Linked List',         ARRAY['Google', 'Meta', 'Amazon', 'Microsoft'],         5, 'Linked Lists', 'https://leetcode.com/problems/merge-two-sorted-lists/',                      'Dummy head, compare nodes.'),
(143,  'Reorder List',                               'medium', 'Linked List',         ARRAY['Google', 'Meta', 'Amazon'],                      3, 'Linked Lists', 'https://leetcode.com/problems/reorder-list/',                                'Find mid, reverse second half, merge.'),
(19,   'Remove Nth Node From End',                   'medium', 'Linked List',         ARRAY['Google', 'Meta', 'Amazon'],                      4, 'Linked Lists', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',           'Two pointers, n apart.'),
(141,  'Linked List Cycle',                          'easy',   'Linked List',         ARRAY['Google', 'Meta', 'Amazon'],                      5, 'Linked Lists', 'https://leetcode.com/problems/linked-list-cycle/',                           'Floyd''s fast/slow pointers.'),
-- Design
(155,  'Min Stack',                                  'medium', 'Design',              ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         4, 'Design',       'https://leetcode.com/problems/min-stack/',                                   'Stack of (val, current_min) pairs.'),
(146,  'LRU Cache',                                  'medium', 'Design',              ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         5, 'Design',       'https://leetcode.com/problems/lru-cache/',                                   'OrderedDict or doubly-linked list + hashmap.'),
(981,  'Time Based Key-Value Store',                 'medium', 'Design',              ARRAY['Google', 'Amazon', 'Meta'],                      3, 'Design',       'https://leetcode.com/problems/time-based-key-value-store/',                  'Dict of sorted lists + binary search.'),
-- Tree
(104,  'Maximum Depth of Binary Tree',               'easy',   'Tree',                ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         5, 'Trees',        'https://leetcode.com/problems/maximum-depth-of-binary-tree/',                'DFS, return 1+max(left,right).'),
(226,  'Invert Binary Tree',                         'easy',   'Tree',                ARRAY['Google', 'Meta', 'Amazon'],                      4, 'Trees',        'https://leetcode.com/problems/invert-binary-tree/',                          'Swap children recursively.'),
(235,  'LCA of BST',                                 'medium', 'Tree',                ARRAY['Google', 'Meta', 'Amazon', 'Microsoft'],         4, 'Trees',        'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', 'Use BST property.'),
(572,  'Subtree of Another Tree',                    'easy',   'Tree',                ARRAY['Google', 'Meta', 'Amazon'],                      3, 'Trees',        'https://leetcode.com/problems/subtree-of-another-tree/',                     'DFS + isSameTree helper.'),
(236,  'LCA of Binary Tree',                         'medium', 'Tree',                ARRAY['Google', 'Meta', 'Amazon', 'Jane Street'],       4, 'Trees',        'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',     'Return node if found, propagate LCA up.'),
-- Math/Probability
(268,  'Missing Number',                             'easy',   'Math/Probability',    ARRAY['Google', 'Amazon', 'Jane Street'],               3, 'Math',         'https://leetcode.com/problems/missing-number/',                              'Gauss formula or XOR.'),
(338,  'Counting Bits',                              'easy',   'Math/Probability',    ARRAY['Google', 'Amazon', 'Microsoft'],                 3, 'Math',         'https://leetcode.com/problems/counting-bits/',                               'dp[i] = dp[i>>1] + (i&1).'),
(371,  'Sum of Two Integers',                        'medium', 'Math/Probability',    ARRAY['Google', 'Meta', 'Jane Street'],                 3, 'Math',         'https://leetcode.com/problems/sum-of-two-integers/',                         'Bit manipulation. XOR for sum, AND for carry.'),
(7,    'Reverse Integer',                            'medium', 'Math/Probability',    ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Math',         'https://leetcode.com/problems/reverse-integer/',                             'Check overflow.'),
-- HashMap
(49,   'Group Anagrams',                             'medium', 'HashMap',             ARRAY['Google', 'Amazon', 'Meta', 'Microsoft'],         5, 'Strings',      'https://leetcode.com/problems/group-anagrams/',                              'Sort chars as key, or 26-char count.'),
(347,  'Top K Frequent Elements',                    'medium', 'HashMap',             ARRAY['Google', 'Amazon', 'Meta', 'Citadel'],           5, 'Arrays',       'https://leetcode.com/problems/top-k-frequent-elements/',                     'Bucket sort or heap.'),
(242,  'Valid Anagram',                              'easy',   'HashMap',             ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Strings',      'https://leetcode.com/problems/valid-anagram/',                               'Counter comparison.'),
(383,  'Ransom Note',                                'easy',   'HashMap',             ARRAY['Google', 'Amazon'],                              3, 'Strings',      'https://leetcode.com/problems/ransom-note/',                                 'Counter.'),
(438,  'Find All Anagrams in String',                'medium', 'HashMap',             ARRAY['Google', 'Amazon', 'Meta'],                      4, 'Strings',      'https://leetcode.com/problems/find-all-anagrams-in-a-string/',               'Sliding window with freq map.');
