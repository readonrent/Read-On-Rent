import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

export default function Careers() {
  const jobs = [
    {
      title: "Frontend Developer (React / Next.js)",
      department: "Engineering",
      type: "Full-time",
      location: "Remote / Hybrid",
    },
    {
      title: "Operations Manager",
      department: "Logistics",
      type: "Full-time",
      location: "On-site",
    },
    {
      title: "Content & Community Specialist",
      department: "Marketing",
      type: "Part-time / Full-time",
      location: "Remote",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-navy dark:text-cream">
          Join Our Team
        </h1>
        <p className="text-navy/60 dark:text-cream/60 mt-3 max-w-2xl mx-auto">
          Help us build the future of book sharing. We’re always looking for passionate people to join our growing team.
        </p>
      </motion.div>

      {/* Openings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4 mb-12"
      >
        <h2 className="text-xl font-bold text-navy dark:text-cream mb-6">
          Open Positions
        </h2>

        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-orange/30 border border-transparent transition-all"
          >
            <div>
              <span className="text-xs font-semibold text-orange uppercase tracking-wider">
                {job.department}
              </span>
              <h3 className="text-lg font-semibold text-navy dark:text-cream mt-1">
                {job.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-navy/60 dark:text-cream/60 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {job.type}
                </span>
              </div>
            </div>

            <a
              href={`mailto:readonrent00@gmail.com?subject=Application for ${job.title}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange/10 hover:bg-orange text-orange hover:text-white text-sm font-semibold rounded-xl transition-colors self-start md:self-center"
            >
              Apply Now <ArrowRight size={14} />
            </a>
          </div>
        ))}
      </motion.div>

      {/* Spontaneous Application */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-navy-light rounded-2xl p-6 md:p-8 shadow-card text-center"
      >
        <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center mx-auto mb-4">
          <Briefcase size={20} className="text-orange" />
        </div>
        <h3 className="font-semibold text-navy dark:text-cream mb-2">
          Don't see a role that fits?
        </h3>
        <p className="text-sm text-navy/60 dark:text-cream/60 leading-relaxed mb-6 max-w-md mx-auto">
          Send us your resume anyway! We’re always eager to connect with talented folks who love books.
        </p>
        <a
          href="mailto:readonrent00@gmail.com?subject=General Career Inquiry"
          className="inline-block px-5 py-2.5 bg-orange text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Send Open Application
        </a>
      </motion.div>
    </div>
  );
}