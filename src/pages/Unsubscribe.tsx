import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, AlertCircle } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";

type Status = "validating" | "ready" | "submitting" | "done" | "already" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const UnsubscribePage = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<Status>("validating");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Missing unsubscribe token.");
        return;
      }
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } },
        );
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data?.valid) {
          setStatus("ready");
        } else if (data?.reason === "already_unsubscribed") {
          setStatus("already");
        } else {
          setStatus("error");
          setErrorMessage(data?.error || "Invalid or expired link.");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage("Unable to validate link. Please try again.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleConfirm = async () => {
    setStatus("submitting");
    try {
      const { data, error } = await supabase.functions.invoke(
        "handle-email-unsubscribe",
        { body: { token } },
      );
      if (error) throw error;
      if (data?.success || data?.reason === "already_unsubscribed") {
        setStatus(data?.reason === "already_unsubscribed" ? "already" : "done");
      } else {
        setStatus("error");
        setErrorMessage("Unable to process unsubscribe.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Unable to process unsubscribe. Please try again.");
    }
  };

  return (
    <PageTransition>
      <section className="pt-40 pb-28 section-padding min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-secondary/40 border border-border/40 p-10">
          {status === "validating" && (
            <p className="text-muted-foreground">Validating link…</p>
          )}

          {status === "ready" && (
            <>
              <h1 className="font-display text-3xl mb-3">Unsubscribe</h1>
              <p className="text-muted-foreground mb-8">
                Click below to stop receiving emails from Luxtile.
              </p>
              <button
                onClick={handleConfirm}
                className="w-full bg-accent text-accent-foreground py-4 text-sm tracking-[0.15em] uppercase font-medium gold-shine hover:tracking-[0.19em] transition-all"
              >
                Confirm Unsubscribe
              </button>
            </>
          )}

          {status === "submitting" && (
            <p className="text-muted-foreground">Processing…</p>
          )}

          {status === "done" && (
            <>
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-accent" />
              </div>
              <p className="font-display text-3xl mb-3">Unsubscribed</p>
              <p className="text-muted-foreground">
                You will no longer receive emails from Luxtile.
              </p>
            </>
          )}

          {status === "already" && (
            <>
              <p className="font-display text-3xl mb-3">Already Unsubscribed</p>
              <p className="text-muted-foreground">
                This email address has already been removed from our list.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} className="text-destructive" />
              </div>
              <p className="font-display text-3xl mb-3">Something went wrong</p>
              <p className="text-muted-foreground">{errorMessage}</p>
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default UnsubscribePage;
