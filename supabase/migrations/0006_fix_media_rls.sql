-- 0006_fix_media_rls.sql
-- Allow service role to insert/update/delete media rows for batch upload scripts

DROP POLICY IF EXISTS "User can insert own media" ON public.media;

CREATE POLICY "Insert media (owner or service)" ON public.media
  FOR INSERT
  WITH CHECK (
    (auth.role() = 'authenticated' AND owner_id = auth.uid())
    OR auth.role() = 'service_role'
  );
