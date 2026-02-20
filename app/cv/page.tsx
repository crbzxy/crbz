'use client';

import { Download, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { PageLayout } from '@/src/components/templates/PageLayout';
import { Button } from '@/src/components/atoms/Button';
import { Badge } from '@/src/components/atoms/Badge';
import { Separator } from '@/src/components/atoms/Separator';
import {
  cvContact,
  cvSummary,
  cvSkills,
  cvExperience,
  cvEducation,
  cvCertifications,
} from '@/src/constants/cv';

export default function CVPage() {
  const handleDownload = () => {
    window.print();
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed top-20 right-6 z-50 print:hidden md:top-24">
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Descargar PDF
          </Button>
        </div>

        <main className="mx-auto max-w-[720px] px-6 pt-24 pb-16 print:py-8 print:px-0 print:max-w-none print:pt-8">
          <header className="mb-10 print:mb-6">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground print:text-3xl">
              {cvContact.fullName}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground tracking-wide">
              {cvContact.title}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {cvContact.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {cvContact.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {cvContact.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> {cvContact.website}
              </span>
            </div>
          </header>

          <Separator className="mb-10 print:mb-6" />

          <section className="mb-10 print:mb-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Perfil
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              {cvSummary}
            </p>
          </section>

          <Separator className="mb-10 print:mb-6" />

          <section className="mb-10 print:mb-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Competencias principales
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="font-normal"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          <Separator className="mb-10 print:mb-6" />

          <section className="mb-10 print:mb-6">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Experiencia profesional
            </h2>
            <div className="space-y-8 print:space-y-5">
              {cvExperience.map((job) => (
                <div key={job.company}>
                  <div className="flex flex-col gap-1 mb-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {job.company}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {job.role}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {job.period}
                    </span>
                  </div>
                  <ul className="ml-4 list-disc space-y-1.5 text-sm text-foreground/85 marker:text-muted-foreground/50">
                    {job.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="leading-relaxed print:text-xs"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <Separator className="mb-10 print:mb-6" />

          <section className="mb-10 print:mb-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Educación
            </h2>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {cvEducation.degree}
              </h3>
              <p className="text-sm text-muted-foreground">
                {cvEducation.institution}
              </p>
            </div>
          </section>

          <Separator className="mb-10 print:mb-6" />

          <section className="mb-10 print:mb-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Certificaciones y cursos
            </h2>
            <ul className="space-y-1.5 text-sm text-foreground/85">
              {cvCertifications.map((cert) => (
                <li key={cert} className="print:text-xs">
                  {cert}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </PageLayout>
  );
}
