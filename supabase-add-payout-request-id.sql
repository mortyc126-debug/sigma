-- Связь транзакции вывода с заявкой на вывод (для отображения статуса в истории операций)
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS payout_request_id uuid REFERENCES public.payout_requests(id);
