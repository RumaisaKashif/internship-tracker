-- =============================================
-- ROW LEVEL SECURITY
-- For a single-user app, we use simple policies
-- that allow all authenticated + anon reads/writes
-- In production: restrict to auth.uid() = user_id
-- =============================================

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE leetcode_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE leetcode_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE leetcode_streak ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_contacts ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (single-user personal app)
-- In a multi-user app, replace 'true' with 'auth.uid() = user_id'

CREATE POLICY "Allow all" ON user_profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON internships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON timeline_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON leetcode_problems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON leetcode_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON leetcode_streak FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON optimization_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON scan_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON referral_contacts FOR ALL USING (true) WITH CHECK (true);
