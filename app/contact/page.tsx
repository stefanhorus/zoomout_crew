"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EASE } from "@/components/motion/ease";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICES } from "@/lib/services";
import { withBasePath } from "@/lib/base-path";

const OTHER = "other";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [projectType, setProjectType] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const typeLabel = (key: string) => (key === OTHER ? t("contact2.other") : t(`services.${key}`));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    // Tipul de proiect ales se trimite la începutul mesajului (API-ul primește doar name, email, message)
    const message = projectType ? `${t("contact2.typePrefix")}: ${typeLabel(projectType)}\n\n${formData.message}` : formData.message;

    try {
      const response = await fetch(withBasePath("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, message }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setProjectType(null);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const field =
    "w-full border-b border-line bg-transparent py-4 text-lg text-paper placeholder:text-mute/70 transition-colors duration-300 focus:border-paper focus:outline-none md:text-xl";

  return (
    <section className="container-site pb-28 pt-36 md:pb-40 md:pt-48">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="kicker flex items-center gap-2">
            <span className="rec-dot h-1.5 w-1.5" /> {t("contact2.kicker")}
          </p>
          <h1 className="display-xl mt-7">
            <SplitReveal text={t("contact2.title")} mode="mount" delay={0.1} />
          </h1>
          <Reveal delay={0.3}>
            <p className="lead mt-8 max-w-md">{t("contact.subtitle")}</p>
          </Reveal>

          <Reveal delay={0.4}>
            <dl className="mt-14 space-y-8">
              <div>
                <dt className="kicker mb-2">{t("contact2.emailLabel")}</dt>
                <dd>
                  <a href="mailto:contact@zoomoutcrew.com" className="link-line font-display text-2xl font-medium tracking-tight md:text-3xl">
                    contact@zoomoutcrew.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="kicker mb-2">Instagram</dt>
                <dd>
                  <a
                    href="https://instagram.com/zoomout_crew"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-line font-display text-2xl font-medium tracking-tight md:text-3xl"
                  >
                    @zoomout_crew
                  </a>
                </dd>
              </div>
              <div>
                <dt className="kicker mb-2">{t("contact2.locationLabel")}</dt>
                <dd className="text-paper-dim">{t("services.location")}</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="lg:col-span-6 lg:col-start-7">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-line bg-ink-2 p-6 md:p-10">
            <fieldset>
              <legend className="kicker mb-5">{t("contact2.projectType")}</legend>
              <div className="flex flex-wrap gap-2">
                {[...SERVICES.map((service) => service.key), OTHER].map((key) => {
                  const active = projectType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setProjectType(active ? null : key)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-2.5 text-sm transition-colors duration-300 ${
                        active ? "border-paper bg-paper text-ink" : "border-line text-paper-dim hover:border-paper hover:text-paper"
                      }`}
                    >
                      {typeLabel(key)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="kicker">{t("contact.name")}</span>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("contact.namePlaceholder")}
                  autoComplete="name"
                  required
                  className={field}
                />
              </label>
              <label className="block">
                <span className="kicker">{t("contact.email")}</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("contact.emailPlaceholder")}
                  autoComplete="email"
                  required
                  className={field}
                />
              </label>
            </div>

            <label className="mt-6 block">
              <span className="kicker">{t("contact.message")}</span>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder={t("contact.messagePlaceholder")}
                required
                className={`${field} resize-none`}
                data-lenis-prevent
              />
            </label>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Magnetic>
                <button type="submit" disabled={status === "sending"} className="btn-primary px-8 py-5 disabled:opacity-50">
                  {status === "sending" ? t("contact.sending") : t("contact.send")} →
                </button>
              </Magnetic>
              <AnimatePresence mode="wait">
                {(status === "success" || status === "error") && (
                  <motion.p
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className={status === "success" ? "text-paper" : "text-rec"}
                    role="status"
                  >
                    {status === "success" ? t("contact.success") : t("contact.error")}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
