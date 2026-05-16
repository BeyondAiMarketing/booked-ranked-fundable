import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  headline?: string;
}

export default function FAQSection({
  faqs,
  headline = "Frequently Asked Questions",
}: FAQSectionProps) {
  return (
    <section className="py-20 px-6 bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">{headline}</h2>
          <p className="text-slate-200">
            Have more questions? Get your free audit and we'll walk you through
            everything.
          </p>
        </motion.div>

        <Accordion
          type="single"
          collapsible
          className="space-y-3"
          data-ocid="faq.panel"
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.question}
              value={`item-${i}`}
              data-ocid={`faq.item.${i + 1}`}
              className="bg-slate-900 border border-white/5 rounded-xl px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-white text-sm font-medium text-left py-5 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-200 text-sm pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
