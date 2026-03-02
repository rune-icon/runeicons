'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Github, MessageCircle, Twitter } from 'lucide-react'

type FAQItem = {
    id: string
    number: string
    question: string
    answer: string
}

const faqItems: FAQItem[] = [
    {
        id: 'item-1',
        number: '01',
        question: 'What formats are the icons available in?',
        answer: 'All Rune Icons are available as optimized SVGs, React components, and Vue components. Each icon is tree-shakeable and can be imported individually to keep your bundle size minimal.',
    },
    {
        id: 'item-2',
        number: '02',
        question: 'Can I customize the icon size and color?',
        answer: 'Absolutely! Every Rune Icon supports custom sizing, stroke width, and color via props or CSS. They inherit currentColor by default, so they naturally adapt to your design system.',
    },
    {
        id: 'item-3',
        number: '03',
        question: 'Is Rune Icons free to use commercially?',
        answer: 'Yes! Rune Icons is open-source and licensed under the MIT License. You can use them in personal, commercial, and client projects without any attribution required.',
    },
    {
        id: 'item-4',
        number: '04',
        question: 'How do I request a new icon?',
        answer: 'You can submit icon requests through our GitHub repository by opening an issue. Our team reviews requests weekly and we prioritize icons based on community votes and demand.',
    },
]

export default function Faq() {
    return (
        <section className="w-full py-24">
            {/* Full-width white card */}
            <div className="relative w-full px-4 py-8 sm:px-10 sm:py-14 lg:px-16 lg:py-16 overflow-hidden">

                {/* Content grid */}
                <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:gap-20">
                    {/* Left column */}
                    <div className="flex flex-col gap-8 lg:w-[340px] shrink-0">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-mono uppercase tracking-widest text-blue-700">FAQ</span>
                            <h2 className="text-3xl font-semibold text-foreground tracking-tight">
                                Questions &amp; Answers
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Have more questions? Reach out to us on any of these platforms:
                            </p>
                        </div>
                    </div>

                    {/* Right column - Accordion */}
                    <div className="flex-1">
                        <Accordion
                            type="single"
                            collapsible
                            defaultValue="item-1"
                            className="w-full space-y-3"
                        >
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="rounded-2xl bg-white dark:bg-background border border-border px-6 last:border-b"
                                >
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-semibold text-blue-700 tabular-nums">
                                                {item.number}
                                            </span>
                                            <span className="text-[15px] font-medium text-foreground">
                                                {item.question}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <p className="text-sm text-muted-foreground leading-relaxed pl-10">
                                            {item.answer}
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
