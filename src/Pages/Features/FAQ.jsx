import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../Context/ThemeProvider";

const faqs = [
  {
    question: "What is an ATS score?",
    answer:
      "An ATS score shows how well your resume matches a job description and how likely it is to pass Applicant Tracking Systems.",
  },
  {
    question: "How does the AI analyze my resume?",
    answer:
      "Our AI compares your resume with the job description, identifies missing skills, keywords, and provides personalized improvement suggestions.",
  },
  {
    question: "Can I upload multiple resumes?",
    answer:
      "Yes. You can upload and analyze multiple resumes for different job roles.",
  },
  {
    question: "Will my resume be stored securely?",
    answer:
      "Absolutely. Your uploaded files are encrypted and handled securely to protect your privacy.",
  },
  {
    question: "Is the career roadmap personalized?",
    answer:
      "Yes. The roadmap is generated based on your skills, experience, and career goals.",
  },
];

export default function FAQ() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [open, setOpen] = useState(null);

  return (
    <section
      className={`py-16 ${dark ? "bg-[#050816]" : "bg-slate-50"}`}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold tracking-widest uppercase">
            Frequently Asked Questions
          </span>

          <h2
            className={`text-3xl md:text-4xl font-bold mt-2 ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            Got Questions?
          </h2>

          <p
            className={`mt-3 ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Find answers to the most common questions about our AI Resume
            Analyzer.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              viewport={{ once: true }}
              className={`rounded-2xl border overflow-hidden ${
                dark
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle
                    className="text-emerald-500 flex-shrink-0"
                    size={20}
                  />

                  <h3
                    className={`font-semibold ${
                      dark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {faq.question}
                  </h3>
                </div>

                <motion.div
                  animate={{
                    rotate: open === index ? 180 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown
                    className={
                      dark ? "text-slate-400" : "text-slate-600"
                    }
                  />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: open === index ? "auto" : 0,
                  opacity: open === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className={`px-5 pb-5 ${
                    dark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}